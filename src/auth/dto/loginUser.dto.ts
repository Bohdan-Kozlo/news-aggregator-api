import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
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
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
