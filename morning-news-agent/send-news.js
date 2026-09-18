import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import twilio from 'twilio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '.env') });

// Unset any shell env vars that might override
delete process.env.NEWS_API_KEY;
config({ path: join(__dirname, '.env'), override: true });

import { fetchAllNews } from './news.js';

/**
 * Create message (works for both SMS and WhatsApp)
 */
function createMessage(newsData) {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  let message = `📰 MORNING NEWS - ${date}\n\n`;

  // Top Headlines
  if (newsData.india.length > 0) {
    message += `🔥 TOP HEADLINES\n`;
    newsData.india.slice(0, 2).forEach((article, i) => {
      message += `${i + 1}. ${article.title}\n`;
    });
    message += `\n`;
  }

  // Business
  if (newsData.business.length > 0) {
    message += `💰 BUSINESS\n`;
    newsData.business.slice(0, 2).forEach((article, i) => {
      message += `${i + 1}. ${article.title}\n`;
    });
    message += `\n`;
  }

  // Technology
  if (newsData.tech.length > 0) {
    message += `🤖 TECHNOLOGY\n`;
    newsData.tech.slice(0, 2).forEach((article, i) => {
      message += `${i + 1}. ${article.title}\n`;
    });
  }

  message += `\n- Morning News Agent`;

  return message;
}

/**
 * Send via SMS (more reliable than WhatsApp)
 */
async function sendSMS(newsData) {
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER || '+15017122661'; // Twilio test number
  const toNumber = process.env.WHATSAPP_TO_NUMBER;

  if (!twilioSid || !twilioToken || !toNumber) {
    console.log('❌ Twilio credentials not configured');
    return false;
  }

  console.log('📱 Sending SMS via Twilio...');
  console.log('📤 From:', twilioPhone);
  console.log('📥 To: +' + toNumber);

  try {
    const client = twilio(twilioSid, twilioToken);
    const message = createMessage(newsData);

    const result = await client.messages.create({
      from: twilioPhone,
      to: `+${toNumber}`,
      body: message
    });

    console.log('\n✅ ═══════════════════════════════════════');
    console.log('🎉 SMS SENT SUCCESSFULLY!');
    console.log('═══════════════════════════════════════');
    console.log('📱 Phone: +' + toNumber);
    console.log('🆔 Message SID:', result.sid);
    console.log('📊 Status:', result.status);
    console.log('═══════════════════════════════════════');
    console.log('📬 CHECK YOUR PHONE NOW! 📬');
    console.log('═══════════════════════════════════════\n');

    return true;

  } catch (error) {
    console.error('❌ SMS error:', error.message);
    console.log('\nTrying WhatsApp fallback...\n');
    return await sendWhatsAppFallback(newsData);
  }
}

/**
 * Try WhatsApp with simple text (no formatting)
 */
async function sendWhatsAppFallback(newsData) {
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_FROM_NUMBER;
  const toNumber = process.env.WHATSAPP_TO_NUMBER;

  console.log('📱 Attempting WhatsApp (simplified)...');

  try {
    const client = twilio(twilioSid, twilioToken);

    // Simple message without special formatting
    const simpleMessage = `Morning News - ${new Date().toLocaleDateString()}\n\nNews update sent! Visit your news agent for full briefing.`;

    const result = await client.messages.create({
      from: twilioFrom,
      to: `whatsapp:+${toNumber}`,
      body: simpleMessage
    });

    console.log('\n✅ WhatsApp message sent!');
    console.log('🆔 SID:', result.sid);
    console.log('📬 CHECK WHATSAPP!\n');

    return true;

  } catch (error) {
    console.error('❌ WhatsApp also failed:', error.message);

    if (error.code === 21654) {
      console.log('\n💡 Twilio WhatsApp now requires pre-approved templates.');
      console.log('   Using SMS is more reliable for custom messages.\n');
    }

    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n📰 Morning News Agent\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    console.log('📰 Fetching latest news...\n');
    const newsData = await fetchAllNews();

    const totalArticles = newsData.india.length + newsData.business.length + newsData.tech.length;

    if (totalArticles === 0) {
      console.log('⚠️  No news articles fetched.');
      return;
    }

    console.log(`✅ Fetched ${totalArticles} articles\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Try SMS first (more reliable)
    await sendSMS(newsData);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
