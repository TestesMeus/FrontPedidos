import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['P-X.png'],
      manifest: {
        name: 'Perfil-X Construtora',
        short_name: 'Perfil-X',
        description: 'Sistema de pedidos de materiais da Perfil-X',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        icons: [
          {
            src: 'P-X.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'P-X.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === 'document' ||
              request.destination === 'script' ||
              request.destination === 'style' ||
              request.destination === 'image' ||
              request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'perfilx-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 semana
              }
            }
          }
        ]
      }
    })
  ]
});
