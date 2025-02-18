import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The updated name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  readonly username?: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'The updated password of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  readonly password?: string;
}
