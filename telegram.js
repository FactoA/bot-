require("dotenv").config();
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");
const { trainAI, getAIStats, analyzeCurrent } = require("./ai");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const chatId = process.env.TELEGRAM_CHAT_ID;
const STATE_FILE = "state.json";

function loadState() {
  return JSON.parse(fs.readFileSync(STATE_FILE));
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

bot.onText(/\/start/, () => {
  bot.sendMessage(chatId, "🤖 Бот запущено. Готовий до дій.");
});

bot.onText(/\/menu/, () => {
  bot.sendMessage(chatId, `
📋 Меню:
/autotrade_on
/autotrade_off
/mode_predict
/mode_trade
/status
/train_ai
/analyze
/ai_stats
/test_trade
/performance
/uptime
/reset_status
  `);
});

bot.onText(/\/autotrade_on/, () => {
  const state = loadState();
  state.autotrade = true;
  saveState(state);
  bot.sendMessage(chatId, "✅ Автотрейдинг увімкнено.");
});

bot.onText(/\/autotrade_off/, () => {
  const state = loadState();
  state.autotrade = false;
  saveState(state);
  bot.sendMessage(chatId, "⛔ Автотрейдинг вимкнено.");
});

bot.onText(/\/mode_predict/, () => {
  const state = loadState();
  state.mode = "predict";
  saveState(state);
  bot.sendMessage(chatId, "🧠 Режим: AI-прогноз.");
});

bot.onText(/\/mode_trade/, () => {
  const state = loadState();
  state.mode = "trade";
  saveState(state);
  bot.sendMessage(chatId, "📈 Режим: випадкова стратегія.");
});

bot.onText(/\/status/, () => {
  const state = loadState();
  const uptime = Date.now() - (state.uptimeStart || Date.now());
  const minutes = Math.floor(uptime / 60000);
  bot.sendMessage(chatId, `📊 Стан:
- Угід: ${state.totalTrades}
- Програші поспіль: ${state.consecutiveLosses}
- Режим: ${state.mode}
- Автотрейдинг: ${state.autotrade ? "Увімкнено" : "Вимкнено"}
- Аптайм: ${minutes} хв`);
});

bot.onText(/\/train_ai/, () => {
  const stats = trainAI();
  bot.sendMessage(chatId, `🧠 AI навчено на ${stats.trainedOn} угодах. Точність: ${stats.accuracy}%`);
});

bot.onText(/\/analyze/, () => {
  const { direction, confidence } = analyzeCurrent();
  bot.sendMessage(chatId, `🔍 Прогноз: ${direction.toUpperCase()} з впевненістю ${confidence}%`);
});

bot.onText(/\/ai_stats/, () => {
  const stats = getAIStats();
  bot.sendMessage(chatId, `📈 AI статистика:
- Навчено на: ${stats.trainedOn}
- Точність: ${stats.accuracy}%
- Оновлено: ${stats.lastUpdated}`);
});

bot.onText(/\/test_trade/, () => {
  const { direction, confidence } = analyzeCurrent();
  bot.sendMessage(chatId, `🧪 Тестова угода: ${direction.toUpperCase()} (${confidence}%) — [симуляція]`);
});

bot.onText(/\/performance/, () => {
  const history = JSON.parse(fs.readFileSync("history.json"));
  const recent = history.slice(-10).map((t, i) =>
    `${i + 1}. ${t.direction.toUpperCase()} (${t.confidence}%) → ${t.result.toUpperCase()}`
  ).join("\n");
  bot.sendMessage(chatId, `📉 Останні 10 угод:\n${recent}`);
});

bot.onText(/\/uptime/, () => {
  const state = loadState();
  const uptime = Date.now() - (state.uptimeStart || Date.now());
  const minutes = Math.floor(uptime / 60000);
  bot.sendMessage(chatId, `⏱️ Аптайм: ${minutes} хв`);
});

bot.onText(/\/reset_status/, () => {
  const state = {
    totalTrades: 0,
    consecutiveLosses: 0,
    lastTradeTimestamp: 0,
    mode: "trade",
    autotrade: false,
    uptimeStart: Date.now()
  };
  saveState(state);
  bot.sendMessage(chatId, "♻️ Стан скинуто.");
});

module.exports = bot;
