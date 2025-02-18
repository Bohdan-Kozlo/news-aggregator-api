import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { CreateSourcesDto } from './dto/create-sources.dto';
import { CreateKeywordsDto } from './dto/create-keywords.dto';

@Injectable()
export class PreferencesService {
  constructor(private readonly prismaService: PrismaService) {}

  async addInterests(userId: number, createInterestDto: CreateInterestDto) {
    const interestRecords = createInterestDto.interest.map(
      (interest: string) => ({
        userId,
        interest,
      }),
    );

    await this.prismaService.interest.createMany({
      data: interestRecords,
      skipDuplicates: true,
    });

    return { message: 'Interests added successfully' };
  }

  async setSources(userId: number, createSourcesDto: CreateSourcesDto) {
    const existingSources = await this.prismaService.source.findMany({
      where: { name: { in: createSourcesDto.sources } },
    });

    if (existingSources.length !== createSourcesDto.sources.length) {
      throw new NotFoundException('Some sources not found');
    }

    const sourceRecords = createSourcesDto.sources.map((sourceId) => ({
      userId: +userId,
      sourceId: +sourceId,
    }));

    await this.prismaService.userSource.createMany({
      data: sourceRecords,
      skipDuplicates: true,
    });

    return { message: 'Sources set successfully' };
  }

  async addKeywords(userId: number, keywordDto: CreateKeywordsDto) {
    const keywordRecords = keywordDto.keywords.map((keyword) => ({
      userId,
      keyword: keyword.keyword,
      filterType: keywordDto.filterType,
    }));

    await this.prismaService.keyword.createMany({
      data: keywordRecords,
      skipDuplicates: true,
    });

    return { message: 'Keywords added successfully' };
  }

  async getPreferences(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: {
        interests: true,
        keywords: true,
        sources: {
          include: {
            source: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      interests: user.interests.map((interest) => interest.interest),
      sources: user.sources.map((userSource) => ({
        id: userSource.source.id,
        name: userSource.source.name,
        url: userSource.source.url,
      })),
      keywords: user.keywords.map((keyword) => ({
        keyword: keyword.keyword,
        filterType: keyword.filterType,
      })),
    };
  }
}
