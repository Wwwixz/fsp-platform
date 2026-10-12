import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  css: {
    postcss: './postcss.config.js'
  },
  server: {
    // Локальная разработка: запросы /api уходят в Java-бекенд на 8080.
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
})
