import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// vitejs.dev
export default defineConfig({
  plugins: [react()],
  base: './', // Define o caminho base como relativo para funcionar no GitHub Pages
});
