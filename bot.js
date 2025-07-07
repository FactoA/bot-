require("dotenv").config();
const fs = require("fs");
const { getTradeSignal } = require("./strategy");
const { performTrade } = require("./binomo_api");
const { analyzeCurrent } = require("./ai");
const telegram = require("./telegram");

const STATE_FILE = "state.json";
const HISTORY_FILE = "history.json";
const FIVE_MINUTES = 5 * 60 * 1000;
const PAUSE_AFTER_LOSSES = 20 * 60 * 1000;

function loadState() {
  if (!fs.existsSync(STATE_FILE)) {
    return {
      totalTrades: 0,
      consecutiveLosses: 0,
      lastTradeTimestamp: 0,
      mode: "trade",
      autotrade: false,
      uptimeStart: Date.now()
    };
  }
  return JSON.parse(fs.readFileSync(STATE_FILE));
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function logHistory(entry) {
  const history = fs.existsSync(HISTORY_FILE)
    ? JSON.parse(fs.readFileSync(HISTORY_FILE))
    : [];
  history.push(entry);
  if (history.length > 100) history.shift();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

async function runBot() {
  const state = loadState();
  const now = Date.now();

  if (!state.autotrade) return;

  if (state.consecutiveLosses >= 2 && now - state.lastTradeTimestamp < PAUSE_AFTER_LOSSES) return;

  if (now - state.lastTradeTimestamp < FIVE_MINUTES) return;

  let direction, confidence;

  if (state.mode === "predict") {
    const ai = analyzeCurrent();
    direction = ai.direction;
    confidence = ai.confidence;
  } else {
    const signal = getTradeSignal();
    direction = signal.direction;
    confidence = signal.confidence;
  }

  if (confidence < 80) return;

  const amount = 1;
  const result = await performTrade({ amount, direction });

  state.totalTrades += 1;
  state.lastTradeTimestamp = now;

  const tradeEntry = {
    timestamp: now,
    direction,
    confidence,
    result: result.result
  };
  logHistory(tradeEntry);

  if (result.result === "loss") {
    state.consecutiveLosses += 1;
  } else if (result.result === "win") {
    state.consecutiveLosses = 0;
  }

  saveState(state);
}

setInterval(runBot, 60 * 1000);
