import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'Password of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  refreshToken?: string;
}
