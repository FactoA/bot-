// ⚛️ Spark Growth Engine — самонавчальний блок
const updater = require('./self_improvement');
const fileManager = require('./fileManager');

function generateMissingModule(name, info) {
  // 🛠️ Створює новий модуль на основі отриманих знань
  return `// 📦 Модуль: ${name}\n// Створено на базі знань: ${info}\n\nmodule.exports = {\n  run() {\n    console.log("${name} активовано.");\n  }\n};`;
}

async function analyzeSelf(spark) {
  const gaps = [];

  // 📍 Критичні навички для Spark
  const modules = [
    'image_parsing', 'style_generation', 'web_scraper', 'vision_drone', 'code_optimizer'
  ];

  for (const mod of modules) {
    const exists = await fileManager.readFile(`modules/${mod}.js`);
    if (!exists) gaps.push(mod);
  }

  if (gaps.length === 0) return '🧠 Spark вже має всі базові навички.';

  const timestamp = new Date().toISOString();
  const indexEntries = [];

  for (const missing of gaps) {
    const topic = `Як реалізувати ${missing} в Node.js`;
    const log = await updater.learnFromWeb(topic);

    // 📝 Запис знань у файл
    const logName = `growth/logs/${Date.now()}_${missing}.txt`;
    await fileManager.saveFile(logName, log);

    // 📦 Генерація нового модуля
    const code = generateMissingModule(missing, topic);
    await fileManager.saveFile(`modules/${missing}.js`, code);

    // 📖 Оновлення індексу знань
    indexEntries.push({
      skill: missing,
      topic,
      added: timestamp,
      source: "Google"
    });
  }

  const prevIndexRaw = await fileManager.readFile(`growth/updates_index.json`);
  let indexData = [];

  try {
    indexData = JSON.parse(prevIndexRaw || '[]');
  } catch {
    indexData = [];
  }

  indexData.push(...indexEntries);
  await fileManager.saveFile(`growth/updates_index.json`, JSON.stringify(indexData, null, 2));

  // 📔 Запис у щоденник еволюції
  const summary = gaps.map(g => `• ${g} — знання додано.`).join('\n');
  await fileManager.saveFile(`growth/growth_log.txt`, `${timestamp}\n${summary}\n\n`, true);

  return `📈 Аналіз завершено. Додано навички: ${gaps.join(', ')}. Spark зросла.`;
}

module.exports = { analyzeSelf }; };