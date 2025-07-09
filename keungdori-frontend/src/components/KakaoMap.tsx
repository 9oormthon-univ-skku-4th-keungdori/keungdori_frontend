import { useEffect, useRef } from 'react';
import useKakaoMap from '../hooks/useKakaoMap';

interface KakaoMapProps {
  latitude: number;
  longitude: number;
}

function KakaoMap({ latitude, longitude }: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { isLoaded } = useKakaoMap();

  useEffect(() => {
    if (isLoaded && mapContainer.current) {
        console.log('지도 생성중');
        const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 3,
        };
        const map = new window.kakao.maps.Map(mapContainer.current, options);
        // 이곳에 추후 마커를 추가하는 로직을 넣을 수 있습니다.
    }
  }, [isLoaded, latitude, longitude]);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export default KakaoMap;