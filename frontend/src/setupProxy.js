const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/auth/signup",
    createProxyMiddleware({
      target: "http://127.0.0.1:5000/",
      changeOrigin: true,
    })
  );
};

module.exports = function (app) {
  app.use(
    "/auth/login",
    createProxyMiddleware({
      target: "http://127.0.0.1:5000/",
      changeOrigin: true,
    })
  );
};
