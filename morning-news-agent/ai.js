import fetch from 'node-fetch';

const OMNIROUTE_API_KEY = process.env.OMNIROUTE_API_KEY;
const OMNIROUTE_API_URL = process.env.OMNIROUTE_API_URL;

/**
 * Summarize news using Omniroute/OpenRouter
 */
export async function summarizeNews(newsContent) {
  console.log('🤖 Summarizing news with AI...');

  try {
    const response = await fetch(OMNIROUTE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OMNIROUTE_API_KEY}`,
        'HTTP-Referer': 'https://github.com/morning-news-agent',
        'X-Title': 'Morning News Agent'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: `You are a morning news briefing assistant. Summarize the following news articles into a concise WhatsApp-friendly briefing.

Format the briefing with these sections:
🇮🇳 INDIA
🌎 WORLD
💰 BUSINESS
🤖 AI & TECHNOLOGY

For each section:
- Include only the most important 2-3 headlines
- Keep each headline brief (1-2 lines max)
- Include the source link in parentheses
- Use simple, clear language
- Keep the total briefing under 500 words

Here are today's news articles:

${newsContent}

Create a briefing that's easy to read on WhatsApp.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Omniroute API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Unexpected API response format');
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error('Error summarizing news:', error.message);
    throw error;
  }
}
