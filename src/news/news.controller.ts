import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { AccessAuthGuard } from '../common/guards/access-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SaveNewsDto } from './dto/save-news.dto';

@Controller('news')
@UseGuards(AccessAuthGuard)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNewsFeed(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.newsService.getNewsFeed(user.userId, page, limit);
  }

  @Post('save')
  async newsSave(@CurrentUser() user: any, @Body() saveNewsDto: SaveNewsDto) {
    return this.newsService.newsSave(user.userId, saveNewsDto);
  }

  @Get('saved')
  async getSavedArticles(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.newsService.getSavedArticles(user.userId, page, limit);
  }

  @Get(':id')
  async getArticleDetails(@Param('id') id: string) {
    return this.newsService.getArticleById(id);
  }
}
