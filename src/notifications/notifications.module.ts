import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { NewsModule } from '../news/news.module';

@Module({
  imports: [ScheduleModule.forRoot(), ScheduleModule.forRoot(), NewsModule],
  providers: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
