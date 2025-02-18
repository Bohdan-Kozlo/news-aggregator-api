import { IsArray, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSourcesDto {
  @ApiProperty({
    example: ['source1', 'source2'],
    description: 'List of source IDs to set as preferred.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsString({ each: true })
  sources: string[];
}