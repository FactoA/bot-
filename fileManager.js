// 📂 Spark Файловий Менеджер
const fs = require('fs');
const path = require('path');

// 📁 Створює або оновлює файл
async function saveFile(filePath, content) {
  const fullPath = path.join(__dirname, '..', filePath);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`📁 Збережено: ${filePath}`);
}

// 📖 Читає файл (опціонально для оновлень)
async function readFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf8');
}

module.exports = { saveFile, readFile };