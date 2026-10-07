import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Vite can't run PHP. To test the contact form locally, start a PHP server
    // (php -S 127.0.0.1:8099 -t public) and run: PHP_DEV_SERVER=http://127.0.0.1:8099 npm run dev
    proxy: process.env.PHP_DEV_SERVER ? { '/api': process.env.PHP_DEV_SERVER } : undefined,
  },
});
