import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { NewsModule } from '../news/news.module';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [NewsModule],
})
export class CommentsModule {}
