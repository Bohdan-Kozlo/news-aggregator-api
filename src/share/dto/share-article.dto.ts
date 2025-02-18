import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShareArticleDto {
  @ApiProperty({
    example: 'https://example.com/article-123',
    description: 'The unique ID or URL of the article to share',
  })
  @IsString()
  articleId: string;

  @ApiProperty({
    example: 'recipient@example.com',
    description: 'Email of the recipient to share the article with',
  })
  @IsEmail()
  recipientEmail: string;
}
