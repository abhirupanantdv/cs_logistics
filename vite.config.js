// import { defineConfig } from 'vite'
// import react, { reactCompilerPreset } from '@vitejs/plugin-react'
// import babel from '@rolldown/plugin-babel'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     babel({ presets: [reactCompilerPreset()] })
//   ],
// })
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       '@': '/src',
//     },
//   },
// })
//vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': {
        // target: 'http://192.168.101.186:8050', //demo
        // target: 'http://182.71.135.110:8051', //public
        target: 'http://192.168.101.129:8050',
        changeOrigin: true,
        secure: false,
      },
      '/files': {
        // target: 'http://192.168.101.186:8050',
        // target: 'http://182.71.135.110:8051', //public
        target: 'http://192.168.101.129:8050',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})