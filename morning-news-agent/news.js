import 'dotenv/config';
import fetch from 'node-fetch';

console.log('🔍 Debug: API Key loaded:', process.env.NEWS_API_KEY ? 'YES ✓' : 'NO ✗');
console.log('🔍 First 10 chars:', process.env.NEWS_API_KEY?.substring(0, 10));

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

/**
 * Fetch news for a specific category and country
 */
async function fetchNews(category, country = 'us') {
  try {
    const url = `${NEWS_API_URL}?country=${country}&category=${category}&pageSize=5&apiKey=${NEWS_API_KEY}`;
    console.log(`Fetching ${category} (${country})...`);

    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`News API error: ${response.status} ${response.statusText} - ${text}`);
    }

    const data = await response.json();
    console.log(`  ✓ Got ${data.articles?.length || 0} articles`);
    return data.articles || [];
  } catch (error) {
    console.error(`  ✗ Error fetching ${category} news:`, error.message);
    return [];
  }
}

/**
 * Fetch all news categories
 */
export async function fetchAllNews() {
  console.log('\n📰 Fetching latest news...\n');

  const [usNews, ukNews, businessNews, techNews] = await Promise.all([
    fetchNews('general', 'us'),
    fetchNews('general', 'gb'),
    fetchNews('business', 'us'),
    fetchNews('technology', 'us')
  ]);

  return {
    india: usNews,
    world: ukNews,
    business: businessNews,
    tech: techNews
  };
}

/**
 * Format news articles for AI processing
 */
export function formatNewsForAI(newsData) {
  const sections = [];

  if (newsData.india.length > 0) {
    sections.push('TOP NEWS:\n' + newsData.india.map((a, i) =>
      `${i + 1}. ${a.title}\nSource: ${a.source.name}\nURL: ${a.url}`
    ).join('\n\n'));
  }

  if (newsData.world.length > 0) {
    sections.push('WORLD NEWS:\n' + newsData.world.map((a, i) =>
      `${i + 1}. ${a.title}\nSource: ${a.source.name}\nURL: ${a.url}`
    ).join('\n\n'));
  }

  if (newsData.business.length > 0) {
    sections.push('BUSINESS NEWS:\n' + newsData.business.map((a, i) =>
      `${i + 1}. ${a.title}\nSource: ${a.source.name}\nURL: ${a.url}`
    ).join('\n\n'));
  }

  if (newsData.tech.length > 0) {
    sections.push('AI & TECHNOLOGY NEWS:\n' + newsData.tech.map((a, i) =>
      `${i + 1}. ${a.title}\nSource: ${a.source.name}\nURL: ${a.url}`
    ).join('\n\n'));
  }

  return sections.join('\n\n─────────────────────────\n\n');
}
