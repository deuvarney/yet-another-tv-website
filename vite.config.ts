import path from "path"
import { defineConfig, loadEnv } from 'vite'
import reactPlugin from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig((config) => {
  const {/*command,*/ mode} = config
  const env = loadEnv(mode, process.cwd())
  const basepath = `${env.VITE_WEB_BASEPATH || '/'}`;

  return {
    base: basepath,
    plugins: [
      reactPlugin(),
      {
        name: 'add-github-redirect-logic',
        apply: 'build', // Only run this plugin in 'build' mode not when dev serving
        closeBundle() {
          import('./scripts/generate404Redirect').then(({ postBuildSteps }) => {
            postBuildSteps(env)
          })
        }
      }
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
