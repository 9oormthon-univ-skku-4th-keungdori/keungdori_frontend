import { useEffect, useState } from 'react';
//script에 적어서 시작부터 로딩하지 않고 필요할 때 불러오려고 훅으로 작성함

declare global {
    interface Window {
        kakao: any;
    }
}
const KAKAOMAP_REST_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAOMAP_REST_API_KEY}&autoload=false&libraries=services,clusterer,drawing`;

export default function useKakaoMap() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<ErrorEvent | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = KAKAO_SDK_URL;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("카카오맵 로드 성공!");
        setIsLoaded(true);
      });
    };
    
    script.onerror = (event: Event | string) => {
      const errorToReport = new ErrorEvent('error', {
        message: '카카오맵 스크립트를 불러오는 중 에러가 발생했습니다.',
        error: event instanceof ErrorEvent ? event.error : new Error(String(event)),
      });
      setError(errorToReport);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return { isLoaded, error };
}