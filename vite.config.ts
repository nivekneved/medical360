import { defineConfig, loadEnv, type Plugin } from 'vite';

// DEV ONLY: server-side key (no VITE_ prefix => never bundled into client code).
function resendDevProxy(resendApiKey: string): Plugin {
  return {
    name: 'resend-dev-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/resend/emails')) {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                if (!resendApiKey) {
                  res.statusCode = 503;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'RESEND_API_KEY not set in local .env' }));
                  return;
                }
                let payloadToSend = body;
                try {
                  const parsed = JSON.parse(body);
                  payloadToSend = JSON.stringify({
                    from: parsed.from,
                    to: Array.isArray(parsed.to) ? parsed.to : [parsed.to],
                    subject: String(parsed.subject || '').replace(/[\r\n\0]/g, ' ').slice(0, 200).trim(),
                    html: String(parsed.html || ''),
                  });
                } catch {}

                const upstreamRes = await fetch('https://api.resend.com/emails', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: payloadToSend,
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
  plugins: [resendDevProxy(env.RESEND_API_KEY || '')],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('react-helmet-async')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'vendor-i18n';
            }
            if (id.includes('@supabase') || id.includes('supabase')) {
              return 'vendor-supabase';
            }
            return 'vendor-libs';
          }
        },
      },
    },
  },
  };
});

