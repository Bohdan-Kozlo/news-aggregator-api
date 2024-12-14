import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { NewsModule } from './news/news.module';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { PreferencesModule } from './preferences/preferences.module';

@Module({
  imports: [
    UsersModule,
    NewsModule,
    CommentsModule,
    NotificationsModule,
    AuthModule,
    PrismaModule,
    PreferencesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
