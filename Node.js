// test_token.js
require("dotenv").config();
const fetch = require("node-fetch");

(async () => {
  const res = await fetch("https://api.binomo.com/web/user/profile", {
    headers: {
      "Authorization": `Bearer ${process.env.BINOMO_API_KEY}`
    }
  });

  const data = await res.json();
  console.log("🔍 Відповідь:", data);
})();
