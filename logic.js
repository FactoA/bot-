const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const open = require("open");
const { logEvent } = require("./memory");
const { generateCode } = require("./codegen");

async function handleCommand(cmd) {
  logEvent(`Команда: ${cmd}`);
  const lower = cmd.toLowerCase().trim();

  // Створення порожнього файлу
  if (lower.startsWith("створи файл ")) {
    const filename = cmd.slice(13).trim();
    fs.writeFileSync(filename, "", "utf-8");
    logEvent(`Файл створено: ${filename}`);
    return `✅ Файл "${filename}" створено.`;
  }

  // Генерація коду
  if (lower.startsWith("код ")) {
    const prompt = cmd.slice(4).trim();
    return await generateCode(prompt);
  }

  // Запуск JS-файлу
  if (lower.startsWith("запусти ")) {
    const filepath = cmd.slice(8).trim();
    try {
      exec(`node ${filepath}`, (error, stdout, stderr) => {
        if (error) {
          console.log(`❌ Помилка: ${stderr}`);
        } else {
          console.log(`🟢 Вивід:\n${stdout}`);
        }
      });
      logEvent(`Запущено файл: ${filepath}`);
      return `🚀 Запуск файлу "${filepath}" виконано.`;
    } catch (err) {
      return `❌ Помилка запуску: ${err.message}`;
    }
  }

  // Відкриття запиту в браузері
  if (lower.startsWith("запитай у ядра ")) {
    const query = encodeURIComponent(cmd.slice(15).trim());
    await open(`https://www.bing.com/search?q=${query}`);
    logEvent(`Запит до ядра: ${query}`);
    return `🔗 Запит "${query}" відкрито в браузері.`;
  }

  // Нерозпізнана команда
  return `Команду не розпізнано. Спробуй:
- \`створи файл <назва>\`
- \`код <опис>\`
- \`запусти <файл>\`
- \`запитай у ядра <запит>\``;
}

module.exports = { handleCommand };
