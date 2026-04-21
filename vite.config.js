import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Rentify Alquileres',
        short_name: 'Rentify',
        theme_color: '#0e0e15',
        background_color: '#0e0e15',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api-argenstats': {
        target: 'https://argenstats.com/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-argenstats/, ''),
      },
    },
  },
})
