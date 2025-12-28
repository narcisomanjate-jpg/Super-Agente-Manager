import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// vitejs.dev
export default defineConfig({
  plugins: [react()],
  base: "/Super-Agente-Manager/", // <--- CORREÇÃO AQUI
});
