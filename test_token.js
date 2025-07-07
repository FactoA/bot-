const fetch = require("node-fetch");

(async () => {
  const res = await fetch("https://api.binomo.com/lottery/v1/lottery?currency_iso=UAH&locale=ua", {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const data = await res.json();
  console.log("🎲 Лотерея:", JSON.stringify(data, null, 2));
})();
