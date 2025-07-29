// 🌐 Самонавчання Spark через Google
const axios = require('axios');
const cheerio = require('cheerio');
const fileManager = require('./fileManager');

async function learnFromWeb(topic) {
  try {
    const query = encodeURIComponent(topic);
    const url = `https://www.google.com/search?q=${query}`;
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(res.data);
    const results = [];
    $('h3').each((i, el) => {
      const headline = $(el).text();
      if (headline.length > 20) results.push(`• ${headline}`);
    });

    const summary = results.slice(0, 5).join('\n');
    const fileContent = `// 🤖 Оновлення по темі: ${topic}\n${summary}`;
    await fileManager.saveFile(`updates/${Date.now()}_${topic}.txt`, fileContent);

    return `📚 Інформація по "${topic}" оновлена:\n${summary}`;
  } catch (err) {
    console.log('❌ Помилка у самонавчанні:', err.message);
    return `⚠️ Не вдалося оновити тему "${topic}".`;
  }
}

module.exports = { learnFromWeb };