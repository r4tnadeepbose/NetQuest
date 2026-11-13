import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// GitHub Actions deploys this repo as a project site at /NetQuest/.
// Use that base in CI for reliable asset resolution; keep relative base for local/dev.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/NetQuest/' : './',
  plugins: [react(), tailwindcss()],
})
