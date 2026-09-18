import fetch from 'node-fetch';

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_TO_NUMBER = process.env.WHATSAPP_TO_NUMBER;
const TEST_MODE = process.env.TEST_MODE === 'true';

/**
 * Send message to WhatsApp
 */
export async function sendWhatsAppMessage(message) {
  if (TEST_MODE) {
    console.log('\n📱 TEST MODE - Would send to WhatsApp:');
    console.log('═══════════════════════════════════════');
    console.log(message);
    console.log('═══════════════════════════════════════\n');
    return { success: true, testMode: true };
  }

  console.log('📱 Sending to WhatsApp...');

  try {
    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: WHATSAPP_TO_NUMBER,
        type: 'text',
        text: {
          preview_url: true,
          body: message
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WhatsApp API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Message sent successfully!');
    return { success: true, data };

  } catch (error) {
    console.error('Error sending WhatsApp message:', error.message);
    throw error;
  }
}

/**
 * Prepare message with greeting based on time
 */
export function prepareMessage(briefing) {
  const now = new Date();
  const hour = now.getHours();

  let greeting = '🌅 Good Morning!';
  if (hour >= 12 && hour < 17) greeting = '☀️ Good Afternoon!';
  if (hour >= 17) greeting = '🌆 Good Evening!';

  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `${greeting}

📅 ${dateStr}

${briefing}

---
🤖 Your Morning News Agent`;
}
