import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../common/prisma/prisma.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import * as process from 'node:process';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { FilterType } from '@prisma/client';
import { SaveNewsDto } from './dto/save-news.dto';

@Injectable()
export class NewsService {
  private readonly CACHE_TTL = process.env.REDIS_CACHE_TTL || '3600';
  private readonly NEWS_API_KEY = process.env.NEWS_API_KEY;
  private readonly NEWS_API_URL = process.env.NEWS_API_URL;

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async getNewsFeed(userId: number, page: number = 1, limit: number = 10) {
    const cacheKey = `news-feed:${userId}`;

    const cachedNews = await this.redis.get(cacheKey);
    if (cachedNews) {
      return JSON.parse(cachedNews);
    }

    const interests = await this.prisma.interest.findMany({
      where: { userId },
    });
    const sources = await this.prisma.userSource.findMany({
      where: { userId },
      include: { source: true },
    });

    const categories = interests.map((interest) => interest.interest).join(',');
    const sourceNames = sources.map((source) => source.source.name).join(',');

    const validCategories = categories || null;
    const validSources = sourceNames || null;

    const newsData = await this.fetchNewsFromAPI(
      validCategories,
      validSources,
      page,
      limit,
    );

    let filteredNews = await this.applyKeywordFilters(userId, newsData);

    if (filteredNews.length === 0) {
      filteredNews = await this.fetchNewsFromAPI(null, null, page, limit);
    }

    await this.redis.setex(
      cacheKey,
      parseInt(this.CACHE_TTL, 10),
      JSON.stringify(filteredNews),
    );

    return filteredNews;
  }

  async fetchNewsFromAPI(
    categories: string | null,
    sources: string | null,
    page: number,
    limit: number,
  ): Promise<any[]> {
    const apiKey = this.NEWS_API_KEY;

    const params = new URLSearchParams();

    if (categories) {
      params.append('category', categories);
    }

    if (sources) {
      params.append('sources', sources);
    }

    if (!categories && !sources) {
      params.append('category', 'general');
      params.append('country', 'us');
    }

    params.append('page', page.toString());
    params.append('pageSize', limit.toString());
    params.append('apiKey', apiKey);

    const url = `${this.NEWS_API_URL}/top-headlines?${params.toString()}`;

    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(url),
      );

      return response.data.articles
        .filter((article) => article.title && article.url)
        .map((article) => ({
          id: article.url,
          title: article.title || 'No title available',
          summary: article.description || 'No summary available',
          content: article.content || 'Content not available',
          source: article.source?.name || 'Unknown source',
          url: article.url,
          publishedAt: article.publishedAt || 'Unknown publish date',
          urlToImage: article.urlToImage || 'No image available',
        }));
    } catch (error) {
      console.error(
        'Error fetching news:',
        error.response?.data || error.message,
      );
      throw new BadRequestException(
        'Failed to fetch news. Please check your request parameters.',
      );
    }
  }

  async getArticleById(articleId: string): Promise<any> {
    const keys = await this.redis.keys('news-feed:*');
    for (const key of keys) {
      const cachedNews = await this.redis.get(key);
      if (cachedNews) {
        const articles = JSON.parse(cachedNews);
        const article = articles.find((a) => a.id === articleId);
        if (article) return article;
      }
    }

    throw new NotFoundException('Article not found');
  }

  private async applyKeywordFilters(
    userId: number,
    articles: any[],
  ): Promise<any[]> {
    const keywordFilters = await this.prisma.keyword.findMany({
      where: { userId },
    });

    const includeKeywords = keywordFilters
      .filter((filter) => filter.filterType === FilterType.INCLUDE)
      .map((filter) => filter.keyword.toLowerCase());

    const excludeKeywords = keywordFilters
      .filter((filter) => filter.filterType === FilterType.EXCLUDE)
      .map((filter) => filter.keyword.toLowerCase());

    return articles.filter((article) => {
      const content =
        `${article.title} ${article.summary} ${article.content}`.toLowerCase();

      if (excludeKeywords.some((keyword) => content.includes(keyword))) {
        return false;
      }

      if (includeKeywords.length > 0) {
        return includeKeywords.some((keyword) => content.includes(keyword));
      }

      return true;
    });
  }

  async newsSave(
    userId: number,
    saveNewsDto: SaveNewsDto,
  ): Promise<{ message: string }> {
    const { articleId } = saveNewsDto;

    const article = await this.getArticleById(articleId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const existingSavedArticle = await this.prisma.savedArticle.findFirst({
      where: {
        userId,
        url: articleId,
      },
    });

    if (existingSavedArticle) {
      throw new BadRequestException('Article is already saved.');
    }

    let source = await this.prisma.source.findUnique({
      where: { name: article.source },
    });

    if (!source) {
      source = await this.prisma.source.create({
        data: {
          name: article.source,
          url: article.url,
        },
      });
    }

    await this.prisma.savedArticle.create({
      data: {
        title: article.title,
        summary: article.summary,
        url: articleId,
        publishedAt: article.publishedAt
          ? new Date(article.publishedAt)
          : new Date(),
        userId,
        sourceId: source.id,
      },
    });

    return { message: 'Article saved successfully.' };
  }

  async getSavedArticles(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const offset = (page - 1) * limit;

    const savedArticles = await this.prisma.savedArticle.findMany({
      where: { userId },
      include: {
        source: true,
      },
      skip: offset,
      take: limit,
      orderBy: {
        publishedAt: 'desc',
      },
    });

    const totalCount = await this.prisma.savedArticle.count({
      where: { userId },
    });

    return {
      page,
      limit,
      total: totalCount,
      articles: savedArticles.map((article) => ({
        id: article.id,
        title: article.title,
        summary: article.summary,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
      })),
    };
  }
}
