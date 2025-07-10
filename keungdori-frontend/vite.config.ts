import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
      host: true,         // 외부 접근 허용 (기본은 'localhost'만 허용)
      port: 5173,         // ngrok이 이 포트를 터널링할 예정
      strictPort: true,   // 이 포트 못 쓰면 실패하게 (포트 바뀌면 ngrok 주소도 바뀜)
      cors: true,          // CORS 에러 방지
      allowedHosts: ['.ngrok-free.app']
  },
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'auto', //서비스 워커 등록 (자동으로 등록 추후 커스텀 서비스 워커 필요시 코드 작성 후 auto를 변경)
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: { // 앱 정보 (필요 조건 : name, short_name, description, theme_color, icons 192x192 & 512x512)
        name: '킁도리',
        short_name: '킁킁킁',
        description: '친구와 장소를 공유해보세요', 
        id: '/',
        start_url: '/',
        display: 'standalone',
        theme_color: '#ffffff', // theme color, background color 수정 필요)
        background_color: '#ffffff',
        icons: [
          {
            src: "assets/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: 'any'
          },
          {
            src: "assets/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: 'any'
          },
          {
            src: "assets/icons/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "assets/icons/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
      }
    })
  ],
})
