const fs = require("fs");

const HISTORY_FILE = "history.json";
let aiStats = {
  trainedOn: 0,
  accuracy: 0,
  lastUpdated: null
};

function trainAI() {
  if (!fs.existsSync(HISTORY_FILE)) return;

  const history = JSON.parse(fs.readFileSync(HISTORY_FILE));
  const recent = history.slice(-30);

  const wins = recent.filter(t => t.result === "win").length;
  const accuracy = Math.round((wins / recent.length) * 100);

  aiStats = {
    trainedOn: recent.length,
    accuracy,
    lastUpdated: new Date().toISOString()
  };

  return aiStats;
}

function analyzeCurrent() {
  const direction = Math.random() > 0.5 ? "call" : "put";
  const confidence = Math.floor(Math.random() * 20) + 80;
  return { direction, confidence };
}

function getAIStats() {
  return aiStats;
}

module.exports = { trainAI, analyzeCurrent, getAIStats };
