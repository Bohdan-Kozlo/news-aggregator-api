import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { NewsService } from '../news/news.service';
import { CreateCommentsDto } from './dto/create-comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly newsService: NewsService,
  ) {}

  async addComment(userId: number, commentDto: CreateCommentsDto) {
    let article = await this.prismaService.savedArticle.findUnique({
      where: { url: commentDto.articleId },
    });

    if (!article) {
      const redisArticle = await this.newsService.getArticleById(
        commentDto.articleId,
      );

      const source = await this.prismaService.source.upsert({
        where: { name: redisArticle.source },
        update: {},
        create: {
          name: redisArticle.source,
          url: redisArticle.url,
        },
      });

      article = await this.prismaService.savedArticle.create({
        data: {
          title: redisArticle.title,
          summary: redisArticle.summary,
          url: redisArticle.id,
          publishedAt: redisArticle.publishedAt
            ? new Date(redisArticle.publishedAt)
            : new Date(),
          source: {
            connect: {
              id: source.id,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      await this.prismaService.comment.create({
        data: {
          userId,
          articleId: article.id,
          content: commentDto.comment,
        },
      });
    }

    return { message: 'Comment added successfully.' };
  }

  async getComments(articleId: string): Promise<any[]> {
    const article = await this.prismaService.savedArticle.findUnique({
      where: { url: articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const comments = await this.prismaService.comment.findMany({
      where: { articleId: article.id },
      include: {
        user: {
          select: { username: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: comment.user.username,
    }));
  }
}
