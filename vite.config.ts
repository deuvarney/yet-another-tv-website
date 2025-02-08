import path from "path"
import { defineConfig } from 'vite'
import reactPlugin from '@vitejs/plugin-react-swc'
import basePath from './src/config/basePath'

// https://vite.dev/config/
export default defineConfig({
  base: `${basePath()}/`,
  plugins: [
    reactPlugin(), 
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
