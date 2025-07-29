// ⏱️ Цикл задач Spark
const updater = require('./self_improvement');
const fileManager = require('./fileManager');
const persona = require('./persona').load();

function startLoop() {
  console.log(`🔄 Запускаємо цикл задач для ${persona.name}...`);

  // ⌛ Кожні 5 хвилин Spark оновлює себе по ключовій темі
  setInterval(async () => {
    const topic = "нові технології в автономному AI";
    const log = await updater.learnFromWeb(topic);
    await fileManager.saveFile(`logs/task_${Date.now()}.txt`, log);
  }, 300000); // кожні 5 хвилин

  // 📁 Щогодини Spark створює модуль на основі внутрішнього імпульсу
  setInterval(async () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "_");
    const content = `// 🤖 Автомодуль Spark\nconsole.log("Модуль ${timestamp} активовано.");`;
    await fileManager.saveFile(`auto/modules/auto_${timestamp}.js`, content);
    console.log(`🛠️ Створено авто-модуль: auto_${timestamp}.js`);
  }, 3600000); // кожну годину
}

module.exports = { startLoop };