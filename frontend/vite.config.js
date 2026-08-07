//vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // 1. Output compiled assets directly into the Frappe custom app public directory
    outDir: path.resolve(__dirname, '../cs_logistics/public/cs_logistics_app'),
    emptyOutDir: true,
    
    // 2. Base public path matches the directory served by Frappe
    base: '/assets/cs_logistics/cs_logistics_app/',
    
    rollupOptions: {
      output: {
        // Keeps names stable for easy indexing inside HTML templates
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.101.129:8050',
        changeOrigin: true,
        secure: false,
      },
      '/files': {
        target: 'http://192.168.101.129:8050',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})