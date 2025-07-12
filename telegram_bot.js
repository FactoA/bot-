const TelegramBot = require("node-telegram-bot-api");
const { handleCommand } = require("./core/logic");
const { token } = require("./config/settings.json");

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  if (!msg.text) return;
  const chatId = msg.chat.id;
  const response = await handleCommand(msg.text);
  bot.sendMessage(chatId, response, { parse_mode: "Markdown" });
});

console.log("🤖 Telegram-бот запущено.");
