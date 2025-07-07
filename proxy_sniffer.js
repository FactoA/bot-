const Proxy = require("http-mitm-proxy");
const proxy = Proxy();

proxy.onError((ctx, err) => {
  console.error("❌ Proxy error:", err);
});

proxy.onRequest((ctx, callback) => {
  const url = ctx.clientToProxyRequest.url;
  const method = ctx.clientToProxyRequest.method;
  const host = ctx.clientToProxyRequest.headers.host;

  const headers = ctx.clientToProxyRequest.headers;
  const auth = headers["authorization"] || headers["Authorization"];

  if (auth || host.includes("binomo")) {
    console.log("🔍 Запит:", method, host + url);
    if (auth) {
      console.log("🔐 Authorization:", auth);
    }
  }

  return callback();
});

proxy.listen({ port: 8000 }, () => {
  console.log("🛡️ Проксі-сервер запущено на порту 8000");
});
