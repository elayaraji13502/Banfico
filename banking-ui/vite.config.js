import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite Configuration
 *
 * plugins: [react()] → enables JSX transform and React Fast Refresh
 *   Fast Refresh = when you save a file, only that component re-renders
 *   in the browser without a full page reload. Saves a lot of dev time.
 *
 * server.proxy:
 *   During development, Vite runs on port 5173.
 *   Instead of writing http://localhost:8080/api/... in every Axios call,
 *   we proxy /api → http://localhost:8080 so Axios calls just use /api/...
 *   This also avoids CORS preflight for same-origin requests in dev.
 *   (We keep CorsConfig in Spring Boot for production deployments.)
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
