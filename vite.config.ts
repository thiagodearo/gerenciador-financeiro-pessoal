import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // FIX: Expose API_KEY to the client-side code via Vite's `define` feature.
  // This is necessary because `process.env` is not available in the browser by default.
  // This change makes `process.env.API_KEY` accessible in files like `services/geminiService.ts`,
  // aligning with the project's requirement to use this specific environment variable.
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
