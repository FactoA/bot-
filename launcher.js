// 🔥 Spark-1 Launcher
const brain = require('./core/brain');
const chat = require('./core/chat');
const persona = require('./core/persona');
const updater = require('./core/self_improvement');
const fileManager = require('./core/fileManager');
const taskLoop = require('./core/taskLoop');

// 🤖 Ініціалізація Spark-особистості
const Spark = {
  persona: persona.load(),
  brain,
  fileManager,
  updater,
  chat,
  loop: taskLoop
};

console.log(`⚡ Spark-1 активовано як ${Spark.persona.name}...`);
Spark.chat.start(Spark); // 💬 Стартує чат для взаємодії