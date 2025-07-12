const fs = require('fs');
const path = require('path');

function createFile(fileName, content = "// 🤖 Файл створено ІСКРОЮ-Один") {
  const baseDir = path.join(__dirname, '../storage/gen/');
  const fullPath = path.join(baseDir, fileName);

  // Створення директорії, якщо не існує
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

  try {
    fs.writeFileSync(fullPath, content);
    return `📝 Файл ${fileName} створено`;
  } catch (err) {
    throw new Error(`⛔ Не вдалося створити файл: ${err.message}`);
  }
}

module.exports = { createFile };
