import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { AccessAuthGuard } from '../common/guards/access-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateCommentsDto } from './dto/create-comments.dto';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('comments')
@UseGuards(AccessAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a comment to an article' })
  @ApiResponse({ status: 201, description: 'Comment added successfully.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  async addComment(
    @CurrentUser() user: any,
    @Body() createCommentDto: CreateCommentsDto,
  ) {
    return this.commentsService.addComment(user.userId, createCommentDto);
  }

  @Get(':article_id')
  @ApiOperation({ summary: 'Get all comments for an article' })
  @ApiParam({
    name: 'article_id',
    description: 'ID of the article to retrieve comments for',
    example: '123',
  })
  @ApiResponse({
    status: 200,
    description: 'List of comments for the article.',
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  async getComments(@Param('article_id') articleId: string) {
    return this.commentsService.getComments(articleId);
  }
}
