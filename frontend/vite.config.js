import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on mode (development/production)
  const env = loadEnv(mode, process.cwd(), '')
  const baseUrl = env.VITE_BASE_URL || '/'
  
  return {
    plugins: [react()],
    base: baseUrl,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      // Generate source maps for production build
      sourcemap: false,
      // Reduce chunk size
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            redux: ['redux', '@reduxjs/toolkit', 'react-redux', 'redux-persist'],
            ui: ['react-bootstrap', 'bootstrap'],
          },
        },
      },
    },
    server: {
      port: 5173,
      strictPort: false,
      open: true,
    },
  }
})
