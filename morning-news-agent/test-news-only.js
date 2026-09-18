import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Explicitly load .env from current directory
config({ path: join(__dirname, '.env') });

console.log('🔍 Loading .env from:', join(__dirname, '.env'));
console.log('🔍 API Key loaded:', process.env.NEWS_API_KEY ? 'YES ✓' : 'NO ✗');
console.log('🔍 API Key value:', process.env.NEWS_API_KEY);

import { fetchAllNews, formatNewsForAI } from './news.js';

/**
 * Quick test to fetch and display news without AI or WhatsApp
 */
async function testNewsOnly() {
  console.log('\n📰 Testing News Fetch...');
  console.log('⏰', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  console.log('─────────────────────────────────────\n');

  try {
    // Fetch news
    const newsData = await fetchAllNews();

    // Display raw counts
    console.log('\n📊 Articles fetched:');
    console.log(`   🇮🇳 Top News: ${newsData.india.length}`);
    console.log(`   🌎 World: ${newsData.world.length}`);
    console.log(`   💰 Business: ${newsData.business.length}`);
    console.log(`   🤖 Tech: ${newsData.tech.length}`);
    console.log('\n─────────────────────────────────────\n');

    // Format and display
    const formatted = formatNewsForAI(newsData);

    if (!formatted || formatted.trim().length === 0) {
      console.log('⚠️  No news articles fetched. Check your NEWS_API_KEY in .env');
      return;
    }

    console.log(formatted);
    console.log('\n─────────────────────────────────────');
    console.log('✅ News fetch successful!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Make sure NEWS_API_KEY is set in your .env file');
  }
}

testNewsOnly();
