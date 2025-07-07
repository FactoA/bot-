function getTradeSignal() {
  const direction = Math.random() > 0.5 ? "call" : "put";
  const confidence = Math.floor(Math.random() * 40) + 60;
  return { direction, confidence };
}

module.exports = { getTradeSignal };
