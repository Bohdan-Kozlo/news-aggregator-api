import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ShareService } from './share.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ShareArticleDto } from './dto/share-article.dto';
import { AccessAuthGuard } from '../common/guards/access-auth.guard';

@ApiTags('Share')
@ApiBearerAuth()
@Controller('share')
@UseGuards(AccessAuthGuard)
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Post()
  @ApiOperation({ summary: 'Share an article with another user' })
  @ApiResponse({ status: 200, description: 'Article shared successfully.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  async shareArticle(
    @CurrentUser() user: any,
    @Body() shareArticleDto: ShareArticleDto,
  ) {
    const { articleId, recipientEmail } = shareArticleDto;
    return this.shareService.shareArticle(
      user.userId,
      articleId,
      recipientEmail,
    );
  }
}
