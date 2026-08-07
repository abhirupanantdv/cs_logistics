import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Development uses /
  // Production uses Frappe's assets path
  base:
    command === 'serve'
      ? '/'
      : '/assets/cs_logistics/cs_logistics_app/',

  server: {
    port: 8080,
    host: '0.0.0.0',

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

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  build: {
    outDir: path.resolve(
      __dirname,
      '../cs_logistics/public/cs_logistics_app'
    ),

    emptyOutDir: true,

    target: 'es2015',
  },
}))