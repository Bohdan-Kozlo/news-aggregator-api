import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PreferencesService } from './preferences.service';
import { AccessAuthGuard } from '../common/guards/access-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateInterestDto } from './dto/create-interest.dto';
import { CreateSourcesDto } from './dto/create-sources.dto';
import { CreateKeywordsDto } from './dto/create-keywords.dto';

@ApiTags('Preferences')
@ApiBearerAuth()
@Controller('preferences')
@UseGuards(AccessAuthGuard)
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post('interests')
  @ApiOperation({ summary: 'Add user interests' })
  @ApiResponse({ status: 200, description: 'Interests added successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  async addInterests(
    @CurrentUser() user: any,
    @Body() createInterestDto: CreateInterestDto,
  ) {
    return this.preferencesService.addInterests(user.userId, createInterestDto);
  }

  @Post('sources')
  @ApiOperation({ summary: 'Set preferred news sources for the user' })
  @ApiResponse({ status: 200, description: 'Sources set successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  async setSources(
    @CurrentUser() user: any,
    @Body() createSourcesDto: CreateSourcesDto,
  ) {
    return this.preferencesService.setSources(user.userId, createSourcesDto);
  }

  @Post('keywords')
  @ApiOperation({ summary: 'Add keyword filters for the user' })
  @ApiResponse({ status: 200, description: 'Keywords added successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  async addKeywords(
    @CurrentUser() user: any,
    @Body() keywordDto: CreateKeywordsDto,
  ) {
    return this.preferencesService.addKeywords(user.userId, keywordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve user preferences' })
  @ApiResponse({
    status: 200,
    description: 'User preferences retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPreferences(@CurrentUser() user: any) {
    return this.preferencesService.getPreferences(user.userId);
  }
}
