import 'dotenv/config';
import cron from 'node-cron';
import { fetchAllNews, formatNewsForAI } from './news.js';
import { summarizeNews } from './ai.js';
import { sendWhatsAppMessage, prepareMessage } from './whatsapp.js';

/**
 * Main function to fetch, summarize, and send news
 */
async function runNewsAgent() {
  console.log('\n🚀 Morning News Agent Starting...');
  console.log('⏰', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  console.log('─────────────────────────────────────\n');

  try {
    // Step 1: Fetch news
    const newsData = await fetchAllNews();

    // Step 2: Format for AI
    const formattedNews = formatNewsForAI(newsData);

    if (!formattedNews || formattedNews.trim().length === 0) {
      console.log('⚠️  No news articles fetched. Check your NEWS_API_KEY.');
      return;
    }

    // Step 3: Summarize with AI
    const briefing = await summarizeNews(formattedNews);

    // Step 4: Prepare and send WhatsApp message
    const message = prepareMessage(briefing);
    await sendWhatsAppMessage(message);

    console.log('✅ News briefing completed successfully!\n');

  } catch (error) {
    console.error('❌ Error running news agent:', error.message);
    console.error(error.stack);
  }
}

/**
 * Start the scheduler
 */
function startScheduler() {
  const cronExpression = process.env.SCHEDULE_CRON || '0 2 * * *'; // 7:30 AM IST = 2:00 AM UTC

  console.log('📅 Scheduler started!');
  console.log(`⏰ Will run daily at: ${process.env.SCHEDULE_TIME || '7:30 AM IST'}`);
  console.log(`📍 Cron: ${cronExpression}\n`);

  cron.schedule(cronExpression, () => {
    console.log('🔔 Scheduled task triggered!');
    runNewsAgent();
  }, {
    timezone: 'Asia/Kolkata'
  });

  console.log('Press Ctrl+C to stop the scheduler.\n');
}

// Check if running in test mode or as scheduled service
const args = process.argv.slice(2);
const isTest = process.env.TEST_MODE === 'true' || args.includes('--test');
const runNow = args.includes('--now') || isTest;

if (runNow) {
  // Run immediately for testing
  runNewsAgent();
} else {
  // Start the scheduler
  startScheduler();

  // Optional: Run once on startup
  if (args.includes('--startup')) {
    console.log('🔄 Running once on startup...\n');
    runNewsAgent();
  }
}
