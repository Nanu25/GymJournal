// @ts-nocheck
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// Using a dynamic import for path
// @ts-ignore
const path = await import('path');

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
