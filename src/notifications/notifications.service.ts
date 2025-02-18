import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { NewsService } from '../news/news.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly newsService: NewsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendDailyDigest(): Promise<void> {
    console.log('Sending daily digest...');

    // Отримуємо користувачів із ввімкненим щоденним дайджестом
    const users = await this.prisma.user.findMany({
      where: {
        notifications: {
          some: {
            type: 'daily',
            enabled: true,
          },
        },
      },
      include: {
        interests: true, // Інтереси користувача
        sources: { include: { source: true } }, // Джерела користувача
      },
    });

    for (const user of users) {
      try {
        const interests = user.interests.map((i) => i.interest).join(',');
        const sources = user.sources.map((s) => s.source.name).join(',');

        // Отримуємо новини з News API
        const newsData = await this.newsService.fetchNewsFromAPI(
          interests || null, // Категорії
          sources || null, // Джерела
          1, // Сторінка
          5, // Кількість статей
        );

        if (newsData.length === 0) {
          console.log(`No news found for user ${user.email}`);
          continue;
        }

        // Надсилаємо email
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Your Daily News Digest',
          template: './daily-digest',
          context: {
            username: user.username,
            articles: newsData,
          },
        });

        console.log(`Daily digest sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send daily digest to ${user.email}`, error);
      }
    }

    console.log('Daily digest process completed.');
  }

  async updateDailyDigest(
    userId: number,
    enabled: boolean,
  ): Promise<{ message: string }> {
    await this.prisma.notification.upsert({
      where: {
        userId_type: { userId, type: 'daily' },
      },
      update: { enabled },
      create: {
        userId,
        type: 'daily',
        enabled,
      },
    });

    return { message: 'Daily digest notification updated successfully.' };
  }
}
