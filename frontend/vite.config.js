import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This tells Vite: "If you see a request starting with /api, 
      // secretly forward it to the backend on port 5000!"
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})