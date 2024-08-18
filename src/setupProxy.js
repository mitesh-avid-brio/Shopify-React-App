const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/admin/api',
        createProxyMiddleware({
            target: 'https://pakt-shirts.myshopify.com',
            changeOrigin: true,
            secure: true, // Use HTTPS
            pathRewrite: {
                '^/admin/api': '/admin/api', // Keep the same API path
            },
        })
    );
};
