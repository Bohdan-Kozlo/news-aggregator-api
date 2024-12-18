import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AccessAuthGuard } from '../common/guards/access-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateCommentsDto } from './dto/create-comments.dto';

@Controller('comments')
@UseGuards(AccessAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async addComment(
    @CurrentUser() user: any,
    @Body() createCommentDto: CreateCommentsDto,
  ) {
    return this.commentsService.addComment(user.userId, createCommentDto);
  }

  @Get(':article_id')
  async getComments(@Param('article_id') articleId: string) {
    return this.commentsService.getComments(articleId);
  }
}
