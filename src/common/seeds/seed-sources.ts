import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const NEWS_API_KEY = process.env.NEWS_API_KEY || 'your_news_api_key';
const NEWS_API_URL = 'https://newsapi.org/v2/sources';

async function seedSources() {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        apiKey: NEWS_API_KEY,
      },
    });

    const sources = response.data.sources;

    if (!sources || sources.length === 0) {
      console.error('No sources found from NewsAPI');
      return;
    }

    const sourceData = sources.map((source: any) => ({
      name: source.name,
      url: source.url,
    }));

    for (const data of sourceData) {
      await prisma.source.upsert({
        where: { name: data.name },
        update: {},
        create: data,
      });
    }

    console.log(
      `Successfully seeded ${sourceData.length} sources into the database.`,
    );
  } catch (error) {
    console.error(
      'Error seeding sources:',
      error.response?.data || error.message,
    );
  } finally {
    await prisma.$disconnect();
  }
}

seedSources();
