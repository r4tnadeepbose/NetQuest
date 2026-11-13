import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Use relative base so the built site works on GitHub Pages (project or user site)
// and when opening dist locally. HashRouter is used for SPA routing compatibility.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
