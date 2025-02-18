import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { NewsModule } from './news/news.module';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { PreferencesModule } from './preferences/preferences.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import * as process from 'node:process';
import { ShareModule } from './share/share.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'node:path';

@Module({
  imports: [
    UsersModule,
    NewsModule,
    CommentsModule,
    NotificationsModule,
    AuthModule,
    PrismaModule,
    PreferencesModule,
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from: process.env.EMAIL_FROM || '"No Reply" <no-reply@gmail.com>',
      },
      template: {
        dir: path.join(__dirname, '../templates/email'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ShareModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
