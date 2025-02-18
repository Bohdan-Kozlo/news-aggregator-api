import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveNewsDto {
  @ApiProperty({
    example: 'https://example.com/article-123',
    description: 'The unique ID or URL of the article to save',
  })
  @IsString()
  @IsNotEmpty()
  articleId: string;
}