import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // IMPORTANT:
  // This must be at the top level, not inside build.
  // Frappe will serve the compiled frontend from this path.
  base: '/assets/cs_logistics/cs_logistics_app/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // Build React directly into the Frappe app's public directory
    outDir: path.resolve(
      __dirname,
      '../cs_logistics/public/cs_logistics_app'
    ),

    emptyOutDir: true,

    rollupOptions: {
      output: {
        // Keep generated filenames predictable
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },

  // Used only when running `npm run dev`
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