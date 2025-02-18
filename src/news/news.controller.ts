import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { NewsService } from './news.service';
import { AccessAuthGuard } from '../common/guards/access-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SaveNewsDto } from './dto/save-news.dto';

@ApiTags('News')
@ApiBearerAuth()
@Controller('news')
@UseGuards(AccessAuthGuard)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get aggregated news feed' })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Number of articles per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Aggregated news feed retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getNewsFeed(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.newsService.getNewsFeed(user.userId, page, limit);
  }

  @Post('save')
  @ApiOperation({ summary: 'Save an article for later reading' })
  @ApiResponse({ status: 200, description: 'Article saved successfully.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  async newsSave(@CurrentUser() user: any, @Body() saveNewsDto: SaveNewsDto) {
    return this.newsService.newsSave(user.userId, saveNewsDto);
  }

  @Get('saved')
  @ApiOperation({ summary: 'Get saved articles for the user' })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Number of articles per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Saved articles retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSavedArticles(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.newsService.getSavedArticles(user.userId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific article' })
  @ApiResponse({
    status: 200,
    description: 'Article details retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  async getArticleDetails(@Param('id') id: string) {
    return this.newsService.getArticleById(id);
  }
}
