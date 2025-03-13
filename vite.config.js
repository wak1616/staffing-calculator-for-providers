import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // Configure fs.allow to include node_modules for @mdi/font
  server: {
    fs: {
      // Allow serving files from these directories
      allow: ['..', 'node_modules'],
    },
  },
  build: {
    // Ensure Material Design Icons are properly included in the build
    rollupOptions: {
      output: {
        manualChunks: {
          'material-icons': ['@mdi/font']
        }
      }
    }
  }
})
