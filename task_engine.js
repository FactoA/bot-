// modules/task_engine.js
const fs = require('fs');
const path = require('path');
const iskraIF = require('../core/iskra_interface');

const BINOMO_DIR = path.join(__dirname, '../binomo_bot');
const STATUS_PATH = path.join(BINOMO_DIR, 'status.json');
const TRADES_PATH = path.join(BINOMO_DIR, 'trades.json');
const KNOWLEDGE_PATH = path.join(BINOMO_DIR, 'ai_knowledge.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function createFile(fileName, content = '// Порожній файл\n') {
  const fullPath = path.join(BINOMO_DIR, fileName);
  fs.writeFileSync(fullPath, content, 'utf8');
  return `Файл створено: ${fileName}`;
}

function showFile(fileName) {
  const fullPath = path.join(BINOMO_DIR, fileName);
  if (!fs.existsSync(fullPath)) throw new Error(`Файл не знайдено: ${fileName}`);
  const content = fs.readFileSync(fullPath, 'utf8');
  console.log(`\n--- Вміст ${fileName} ---\n${content}\n--- Кінець файлу ---\n`);
  return `Показано: ${fileName}`;
}

function createStrategy(fileName) {
  const fullPath = path.join(BINOMO_DIR, fileName);
  const baseName = fileName.replace('.js', '');
  const content = `
// binomo_bot/${fileName}
// Стратегія: ${baseName}

function analyze${baseName.replace(/(^|\_)(\w)/g, (_, __, c) => c.toUpperCase())}(data) {
  // TODO: реалізуй логіку RSI-прориву
  return 'buy'; // або 'sell'
}

module.exports = { analyze${baseName.replace(/(^|\_)(\w)/g, (_, __, c) => c.toUpperCase())} };
`;
  fs.writeFileSync(fullPath, content, 'utf8');
  return `Стратегія створена: ${fileName}`;
}

function trainAI() {
  if (!fs.existsSync(TRADES_PATH)) throw new Error('trades.json не знайдено');
  const trades = JSON.parse(fs.readFileSync(TRADES_PATH, 'utf8'));
  const total = trades.length;
  const wins = trades.filter(t => t.result === 'win').length;
  const hours = trades.map(t => new Date(t.timestamp).getHours());
  const popularHour = hours.sort((a, b) =>
    hours.filter(h => h === b).length - hours.filter(h => h === a).length
  )[0];
  const directionCount = trades.reduce((acc, t) => {
    acc[t.direction] = (acc[t.direction] || 0) + 1;
    return acc;
  }, {});
  const popularDirection = Object.entries(directionCount).sort((a, b) => b[1] - a[1])[0][0];

  const knowledge = {
    winrate: (wins / total).toFixed(2),
    popularDirection,
    popularHour
  };

  fs.writeFileSync(KNOWLEDGE_PATH, JSON.stringify(knowledge, null, 2), 'utf8');
  return `AI навчено: winrate=${knowledge.winrate}, напрям=${popularDirection}, година=${popularHour}`;
}

function toggleAutotrade(on) {
  if (!fs.existsSync(STATUS_PATH)) throw new Error('status.json не знайдено');
  const status = JSON.parse(fs.readFileSync(STATUS_PATH, 'utf8'));
  status.isAutotrading = on;
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2), 'utf8');
  return `Автотрейдинг ${on ? 'увімкнено' : 'вимкнено'}`;
}

function testTrade() {
  const trade = {
    timestamp: new Date().toISOString(),
    direction: 'buy',
    result: Math.random() > 0.5 ? 'win' : 'loss'
  };
  let trades = [];
  if (fs.existsSync(TRADES_PATH)) {
    trades = JSON.parse(fs.readFileSync(TRADES_PATH, 'utf8'));
  }
  trades.push(trade);
  fs.writeFileSync(TRADES_PATH, JSON.stringify(trades, null, 2), 'utf8');
  return `Тестова угода: ${trade.result}`;
}

async function run(action, target) {
  switch (action) {
    case 'create_file':
      return createFile(target);
    case 'create_strategy':
      return createStrategy(target);
    case 'show':
      return showFile(target);
    case 'train_ai':
      return trainAI();
    case 'autotrade_on':
      return toggleAutotrade(true);
    case 'autotrade_off':
      return toggleAutotrade(false);
    case 'test_trade':
      return testTrade();
    default:
      throw new Error(`Невідома дія: ${action}`);
  }
}

module.exports = { run };
