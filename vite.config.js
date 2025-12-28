import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// vitejs.dev
export default defineConfig({
  plugins: [react()],
  base: './', // <--- Mude para um caminho relativo puro
  build: {
    outDir: 'dist',
  },
});
