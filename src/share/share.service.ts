import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { NewsService } from '../news/news.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ShareService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly newsService: NewsService,
    private readonly mailerService: MailerService,
  ) {}

  async shareArticle(
    userId: number,
    articleId: string,
    recipientEmail: string,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let article = await this.prisma.savedArticle.findUnique({
      where: { url: articleId },
    });

    if (!article) {
      const redisArticle = await this.newsService.getArticleById(articleId);

      if (!redisArticle) {
        throw new NotFoundException('Article not found');
      }

      const source = await this.prisma.source.findUnique({
        where: { name: redisArticle.source },
      });

      article = await this.prisma.savedArticle.create({
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
    }

    await this.sendEmail(recipientEmail, article, user);

    return { message: `Article shared successfully with ${recipientEmail}` };
  }

  private async sendEmail(
    recipientEmail: string,
    article: any,
    user: any,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: recipientEmail,
        subject: `Check out this article: ${article.title}`,
        template: './share-article',
        context: {
          title: article.title,
          summary: article.summary || 'Unknown',
          url: article.url,
          source: article.source || 'Unknown',
          sharedBy: user.username || user.email,
        },
      });

      console.log(`Email sent to ${recipientEmail}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
