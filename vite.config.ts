import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Build static output to docs/ so GitHub Pages can deploy directly from the main branch
// (Settings > Pages > Source: Deploy from a branch > main /docs).
// Base is set for the project site path: https://r4tnadeepbose.github.io/NetQuest/
export default defineConfig({
  base: '/NetQuest/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'docs',
    emptyOutDir: false,
  },
})
