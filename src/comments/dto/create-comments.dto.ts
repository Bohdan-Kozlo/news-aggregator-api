import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentsDto {
  @ApiProperty({
    example: '123',
    description: 'ID of the article to add the comment to',
  })
  @IsString()
  @IsNotEmpty()
  articleId: string;

  @ApiProperty({
    example: 'This is a great article!',
    description: 'Content of the comment',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;
}