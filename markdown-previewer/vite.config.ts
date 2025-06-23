import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Front-End-Development-Libraries_FCC-Projects/markdown-previewer/',
  plugins: [react()],
})
