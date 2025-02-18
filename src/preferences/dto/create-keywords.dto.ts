import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { FilterType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKeywordDto {
  @ApiProperty({
    example: ['keyword1', 'keyword2'],
    description: 'List of keywords to add for filtering articles.',
  })
  @IsString()
  @IsNotEmpty()
  keyword: string;
}

export class CreateKeywordsDto {
  @ValidateNested({ each: true })
  @IsNotEmpty()
  keywords: CreateKeywordDto[];

  @ApiProperty({
    example: 'INCLUDE',
    description: 'Filter type: INCLUDE or EXCLUDE.',
    enum: ['INCLUDE', 'EXCLUDE'],
  })
  @IsEnum(FilterType)
  filterType: FilterType;
}