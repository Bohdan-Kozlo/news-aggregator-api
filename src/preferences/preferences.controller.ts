import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { AccessAuthGuard } from '../common/guards/access-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateInterestDto } from './dto/create-interest.dto';
import { CreateSourcesDto } from './dto/create-sources.dto';
import { CreateKeywordsDto } from './dto/create-keywords.dto';

@Controller('preferences')
@UseGuards(AccessAuthGuard)
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post('interests')
  async addInterests(
    @CurrentUser() user: any,
    @Body() createInterestDto: CreateInterestDto,
  ) {
    return this.preferencesService.addInterests(user.userId, createInterestDto);
  }

  @Post('sources')
  async setSources(
    @CurrentUser() user: any,
    createSourcesDto: CreateSourcesDto,
  ) {
    return this.preferencesService.setSources(user.userId, createSourcesDto);
  }

  @Post('keywords')
  async addKeywords(@CurrentUser() user: any, keywordDto: CreateKeywordsDto) {
    return this.preferencesService.addKeywords(user.userId, keywordDto);
  }
}
