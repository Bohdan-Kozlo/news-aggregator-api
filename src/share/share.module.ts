import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { NewsModule } from '../news/news.module';

@Module({
  providers: [ShareService],
  controllers: [ShareController],
  imports: [NewsModule],
})
export class ShareModule {}
