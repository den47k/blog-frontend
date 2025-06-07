import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/sanctum': {
        target: 'http://backend',
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/app': {
        target: 'http://backend:8080',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/app/, '')
      }
    }
  }
})
