import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'https://192.168.1.145:7085',
        changeOrigin: true,
        secure: false
      },
      '/avatars': {
        target: 'https://192.168.1.145:7085',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'https://192.168.1.145:7085',
        changeOrigin: true,
        secure: false
      },
      '/gallery': {
        target: 'https://192.168.1.145:7085',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
