// core/iskra_core_loop.js
// Основний цикл ІСКРИ-Один: обробка команд, парсинг, виконання

const parser   = require('../modules/dialog_parser');
const executor = require('../modules/task_engine');
const iskraIF  = require('./iskra_interface');

/**
 * Головна функція обробки команд
 * @param {string} inputMessage — команда користувача
 */
async function iskraCoreLoop(inputMessage) {
  console.log(`[ISKRA] Запит: ${inputMessage}`);

  const parsed = parser.parse(inputMessage);
  if (!parsed.valid) {
    iskraIF.reply("❌ Не можу розпізнати запит.");
    return;
  }

  try {
    const result = await executor.run(parsed.action, parsed.target);
    iskraIF.reply(`✅ Виконано: ${result}`);
  } catch (error) {
    iskraIF.reply(`⚠️ Помилка: ${error.message}`);
  }
}

module.exports = { iskraCoreLoop };
