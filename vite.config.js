import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // '/api': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true,
      // },
      '/api': {
        target: 'http://52.79.206.11',
        changeOrigin: true,
      },
      '/oauth2': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ocr-api': {
        target: 'https://w7f0k3xqy8.apigw.ntruss.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ocr-api/, ''),
        secure: true,
      },
    },
  },
});
