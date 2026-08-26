import { defineConfig, type Plugin } from 'vite';

function resendDevProxy(): Plugin {
  return {
    name: 'resend-dev-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/resend/emails')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const authHeader = req.headers['authorization'] || '';
                const upstreamRes = await fetch('https://api.resend.com/emails', {
                  method: 'POST',
                  headers: {
                    'Authorization': authHeader as string,
                    'Content-Type': 'application/json',
                  },
                  body,
                });

                const text = await upstreamRes.text();
                res.statusCode = upstreamRes.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(text);
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          res.statusCode = 405;
          res.end();
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [resendDevProxy()],
  server: {
    proxy: {
      '/api/resend': {
        target: 'https://api.resend.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/resend/, ''),
      },
    },
  },
});
