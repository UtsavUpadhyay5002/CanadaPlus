import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// Determine which app we're building based on the working directory
const isMarketingBuild = process.cwd().includes('marketing') || process.env.VITE_APP === 'marketing'
const isPWABuild = process.cwd().includes('pwa') || process.env.VITE_APP === 'pwa'

export default defineConfig({
  plugins: [
    react(),
    // Only add PWA plugin for the PWA build
    ...(isPWABuild ? [
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'apps/pwa',
        filename: 'sw.ts',
        injectManifest: {
          swSrc: 'apps/pwa/sw.ts',
          swDest: 'sw.js'
        },
        devOptions: {
          enabled: true,
          type: 'module'
        }
      })
    ] : [])
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'apps/pwa'),
      '@marketing': path.resolve(__dirname, 'apps/marketing')
    }
  },
  server: {
    port: isMarketingBuild ? 3000 : 3001
  },
  build: {
    rollupOptions: {
      input: {
        main: isMarketingBuild 
          ? path.resolve(__dirname, 'apps/marketing/index.html')
          : path.resolve(__dirname, 'apps/pwa/index.html')
      }
    }
  }
})