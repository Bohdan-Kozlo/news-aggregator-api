import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AccessAuthGuard } from '../common/guards/access-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AccessAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.userId);
  }

  @Put('/profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    await this.usersService.updateUser(user.userId, updateProfileDto);
    return;
  }
}
