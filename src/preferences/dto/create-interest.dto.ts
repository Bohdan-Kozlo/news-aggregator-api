import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInterestDto {
  @ApiProperty({
    example: ['Technology', 'Sports'],
    description: 'List of user interests to add.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  interest: string[];
}
