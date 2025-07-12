const fs = require('fs');
const path = require('path');

// Симуляція відповіді (можна замінити на API / CLI / Telegram надалі)
function reply(message = "🔔 Відповідь не визначена") {
  console.log(`[ISKRA Interface] ${message}`);

  // Логування відповіді
  const logDir = path.join(__dirname, '../storage/logs/');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const time = new Date().toISOString();
  fs.appendFileSync(path.join(logDir, `reply_log.txt`), `${time} — ${message}\n`);
}

module.exports = { reply };
