import path from "path"
import { defineConfig } from 'vite'
import reactPlugin from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: "/yet-another-tv-website/", // GITHUB Deployment setting
  plugins: [
    reactPlugin(), 
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
