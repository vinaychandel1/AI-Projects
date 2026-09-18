import fetch from 'node-fetch';

const API_KEY = '347e6b1ecb20415ea3c6f48b026849de';

async function quickTest() {
  console.log('\n🧪 Quick News API Test\n');

  try {
    const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${API_KEY}`;
    console.log('Fetching from:', url.replace(API_KEY, 'API_KEY_HIDDEN'));

    const response = await fetch(url);
    const data = await response.json();

    console.log('\n📊 Status:', data.status);
    console.log('📰 Total Results:', data.totalResults);
    console.log('📄 Articles Received:', data.articles?.length || 0);

    if (data.articles && data.articles.length > 0) {
      console.log('\n✅ SUCCESS! Here are the headlines:\n');
      data.articles.forEach((article, i) => {
        console.log(`${i + 1}. ${article.title}`);
        console.log(`   Source: ${article.source.name}`);
        console.log(`   URL: ${article.url}\n`);
      });
    } else {
      console.log('\n⚠️  No articles returned');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickTest();
