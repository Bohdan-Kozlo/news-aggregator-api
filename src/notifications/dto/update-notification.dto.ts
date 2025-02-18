import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationDto {
  @ApiProperty({
    example: true,
    description: 'Enable or disable the notification',
  })
  @IsBoolean()
  enabled: boolean;
}