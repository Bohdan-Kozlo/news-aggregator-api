import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('daily')
  @ApiOperation({ summary: 'Update daily digest notifications' })
  @ApiResponse({
    status: 200,
    description: 'Daily digest notification updated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateDailyDigest(
    @CurrentUser() user: any,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    const { enabled } = updateNotificationDto;
    return this.notificationsService.updateDailyDigest(user.userId, enabled);
  }
}
