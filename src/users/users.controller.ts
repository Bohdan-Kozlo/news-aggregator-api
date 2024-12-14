import { Controller, Get, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.userId);
  }

  @Put('/profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(@CurrentUser() user: any, updateProfileDto: UpdateProfileDto) {
    await this.usersService.updateUser(user.userId, updateProfileDto);
    return;
  }
}
