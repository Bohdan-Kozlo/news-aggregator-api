import { FilterType } from '@prisma/client';

export class CreateKeywordsDto {
  keywords: string[];
  filterType: FilterType;
}
