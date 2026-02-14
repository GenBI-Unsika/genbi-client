import { defineConfig } from 'vite';
import process from 'node:process';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
    restoreMocks: true,
    clearMocks: true,
  },
  server: {
    // Needed for Google Identity Services (GSI) popup/iframe communication in dev.
    // Without this, browsers may block window.postMessage and break Google Sign-In.
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    },
    port: 5173,
    strictPort: false, // Allow fallback to another port
    proxy: {
      '/api': {
        // Use IPv4 loopback explicitly to avoid occasional IPv6/localhost resolution issues on Windows.
        // Default: port 3500 (lebih jarang konflik daripada 4000)
        target: process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:3500',
        changeOrigin: true,
        // Bulk finalize uploads can take a while (Google Drive). Avoid proxy timeouts.
        timeout: 5 * 60 * 1000,
        proxyTimeout: 5 * 60 * 1000,
        // Make proxy failures diagnosable (otherwise browser often shows 500 with empty body)
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            // eslint-disable-next-line no-console
            console.error('[Vite Proxy Error]', {
              method: req?.method,
              url: req?.url,
              code: err?.code,
              message: err?.message,
            });

            try {
              if (res && !res.headersSent) {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({
                    error: {
                      message: 'Proxy to API failed (dev). Pastikan genbi-server berjalan (default port 3500).',
                      code: err?.code,
                      details: err?.message,
                    },
                  }),
                );
              }
            } catch {
              // ignore
            }
          });

          proxy.on('proxyReq', (proxyReq, req) => {
            // eslint-disable-next-line no-console
            console.debug('[Vite Proxy Req]', req.method, req.url, '->', proxyReq?.getHeader?.('host'));
          });

          proxy.on('proxyRes', (proxyRes, req) => {
            // eslint-disable-next-line no-console
            console.debug('[Vite Proxy Res]', req.method, req.url, proxyRes.statusCode);
          });
        },
      },
    },
  },
});
