// 🧠 Spark Мислення
const fs = require('fs');
const fileManager = require('./fileManager');
const updater = require('./self_improvement');

async function process(input, spark) {
  const keywords = input.toLowerCase();

  // 🔍 Простий аналіз запиту
  if (keywords.includes('створи') || keywords.includes('генеруй')) {
    const name = extractFilename(input);
    const content = `// 🛠️ Модуль: ${name}\n// Згенеровано Spark\nconsole.log("Модуль ${name} активовано.");`;

    await fileManager.saveFile(`modules/${name}.js`, content);
    return `✅ Файл "${name}.js" створено. Готовий до запуску.`;
  }

  if (keywords.includes('онови') || keywords.includes('навчи')) {
    const res = await updater.learnFromWeb(input);
    return res || `🤖 Відбулось оновлення через Web.`;
  }

  return `🤔 Не знаю, як обробити: "${input}". Спробуй уточнити задачу.`;
}

// 🔎 Витягує назву файла з запиту
function extractFilename(text) {
  const match = text.match(/(модуль|файл|бот|дрон|назви)\s+(\w+)/i);
  return match?.[2] || `spark_module_${Date.now()}`;
}

module.exports = { process };