import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: 'esbuild', // إجبار Vite على استخدام esbuild بدلاً من lightningcss
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore', 'firebase/auth']
  }
})