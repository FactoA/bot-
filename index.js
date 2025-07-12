/// index.js — запуск ІСКРИ-Один
const { iskraCoreLoop } = require('./core/iskra_core_loop');
const readline = require('readline');

// Привітання
console.log("⚡ ІСКРА (Node.js) активна. Введи команду.");

// Ініціалізація інтерфейсу вводу
const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ">> "
});

input.prompt();

// Обробка кожного рядка
input.on('line', async (text) => {
  const trimmed = text.trim().toLowerCase();

  if (trimmed === 'exit' || trimmed === 'вихід') {
    console.log("🛑 Завершення ІСКРИ.");
    input.close();
    return;
  }

  if (typeof iskraCoreLoop === 'function') {
    try {
      await iskraCoreLoop(text.trim());
    } catch (err) {
      console.log(`⚠️ Помилка виконання: ${err.message}`);
    }
  } else {
    console.log("❌ Функція iskraCoreLoop не розпізнана.");
  }

  input.prompt();
});

// Завершення сесії
input.on('close', () => {
  console.log("💤 ІСКРА перейшла в сплячий режим.");
  process.exit(0);
});
