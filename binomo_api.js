require("dotenv").config();
const fetch = require("node-fetch");

const API_KEY = process.env.BINOMO_API_KEY;

async function performTrade({ amount, direction }) {
  try {
    const response = await fetch("https://api.binomo.com/web/trade", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount,
        direction,
        asset: "EURUSD",
        duration: 300
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("❌ Помилка трейду:", data);
      return { success: false, result: "error" };
    }

    return {
      success: true,
      result: data.result === "win" ? "win" : "loss"
    };
  } catch (err) {
    console.error("❌ Запит не вдався:", err.message);
    return { success: false, result: "error" };
  }
}

module.exports = { performTrade };
