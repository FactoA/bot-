const fs = require("fs");
const path = require("path");
const { logEvent } = require("./memory");

function sanitizeFilename(text) {
  return text.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 32);
}

async function generateCode(prompt) {
  // Проста логіка генерації
  let code;
  if (/hello world/i.test(prompt)) {
    code = 'console.log("Hello, world!");';
  } else if (/цикл/i.test(prompt)) {
    code = "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}";
  } else {
    code = `// Код за запитом: ${prompt}\nconsole.log("Готово");`;
  }

  // Збереження в файл
  const name = `gen_${sanitizeFilename(prompt)}.js`;
  const dir  = path.join(__dirname, "..", "generated");
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, name);
  fs.writeFileSync(filePath, code, "utf-8");

  logEvent(`Згенеровано код: "${prompt}" → ${name}`);
  return `Файл *${name}* створено з кодом:\n\`\`\`js\n${code}\n\`\`\``;
}

module.exports = { generateCode };
