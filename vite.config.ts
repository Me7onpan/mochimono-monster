import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/mochimono-monster/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
        globIgnores: ['art/item-animals*.png', 'art/subject-monsters*.png'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [{
          urlPattern: /\/art\/.*\.png$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'mochimono-monster-art-v1',
            expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 365 }
          }
        }]
      },
      manifest: {
        name: 'もちものモンスター',
        short_name: 'もちモン',
        description: 'あしたのもちものを、モンスターといっしょにじゅんびしよう！',
        theme_color: '#ff8f70',
        background_color: '#fffaf1',
        lang: 'ja',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/mochimono-monster/',
        scope: '/mochimono-monster/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ]
})
