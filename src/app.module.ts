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
import { HttpModule } from '@nestjs/axios';
import { ShareModule } from './share/share.module';

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
    ShareModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
