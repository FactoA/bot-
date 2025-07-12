const fs = require("fs");
const path = require("path");

const LOG_PATH = path.join(__dirname, "..", "logs", "actions.log");

function logEvent(message) {
  const time = new Date().toISOString();
  const line = `[${time}] ${message}\n`;
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  fs.appendFileSync(LOG_PATH, line, "utf-8");
}

module.exports = { logEvent };
