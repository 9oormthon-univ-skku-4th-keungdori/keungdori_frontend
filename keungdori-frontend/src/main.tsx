import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { createRoot } from 'react-dom/client'
import { APIProvider } from '@vis.gl/react-google-maps'

const queryClient = new QueryClient(); //앱의 최상단에서 1번 생성하고 필요할때마다 이거 불러와서 사용
const API_KEY = import.meta.env.VITE_GOOGLEMAPS_API_KEY;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode> {/*개발 테스트 할때는 StrictMode 끄고 해야 함*/}
    <APIProvider apiKey={API_KEY}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}> {/*provider가 main.tsx에서 생성한 queryClient 사용할 수 있게 해줌*/}
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </APIProvider>
  </React.StrictMode>
)
