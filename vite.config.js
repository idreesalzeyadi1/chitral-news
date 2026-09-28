import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Google login only allows the origin registered in Google Cloud (http://localhost:5173),
  // so keep the port fixed instead of silently switching to 5174.
  server: { port: 5173, strictPort: true },
})
