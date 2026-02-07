import { defineConfig } from 'vite';
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
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        // Use IPv4 loopback explicitly to avoid occasional IPv6/localhost resolution issues on Windows.
        target: process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
    },
  },
});
