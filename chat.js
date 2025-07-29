// 💬 Spark CLI Чат
const readline = require('readline');

function start(spark) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `💡 Spark-1 готова. Введи запит:\n> `
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();

    // 🧠 Обробка запиту як текстової задачі
    const response = await spark.brain.process(input, spark);
    console.log(`🧠 Spark каже: ${response}`);

    rl.prompt();
  });

  rl.on('close', () => {
    console.log('🌙 Spark завершила сесію. До наступного запуску...');
    process.exit(0);
  });
}

module.exports = { start };