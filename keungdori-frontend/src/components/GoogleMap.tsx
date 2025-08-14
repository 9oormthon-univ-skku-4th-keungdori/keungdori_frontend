import React, { useEffect } from 'react';
import { Map, AdvancedMarker, useMap, type MapMouseEvent } from '@vis.gl/react-google-maps';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import location_marker from '../assets/current_marker.png';

//현재 위치를 나타내는 마커 애니메이션
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
    animation-timing-function: ease-in;
  }
  50% {
    transform: translateY(-10px);
    animation-timing-function: ease-out;
  }
`;

const BouncingMarker = styled.img`
  width: 48px;
  height: auto;
  animation: ${bounce} 2s infinite;
  filter: drop-shadow(0px 5px 3px rgba(0, 0, 0, 0.2));
`;

const MapController = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    const map = useMap();

    useEffect(() => {
        if (map && latitude && longitude) {
            map.panTo({ lat: latitude, lng: longitude }); //지정된 좌표로 지도 이동
        }
    }, [map, latitude, longitude]);

    return null;
}

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  onMapClick: (placeId: string | null) => void; // Place ID를 부모로 전달할 콜백 함수
}

const GoogleMap: React.FC<GoogleMapProps> = ({ latitude, longitude, onMapClick }) => {
  const position = { lat: latitude, lng: longitude };

  // 지도 클릭 핸들러
  const handleMapClick = (event: MapMouseEvent) => {
    // event.detail 객체에서 placeId를 추출합니다. 장소가 아니면 null일 수 있습니다.
    const placeId = event.detail.placeId;
    onMapClick(placeId);
  };

  return (
      <Map
        style={{ width: '100%', height: '100%' }}
        defaultCenter={{ lat: 37.588100, lng: 126.992831 }}
        defaultZoom={17}
        //지도 화면 범위에서 일어나는 스크롤과 드래그를 지도가 독점해서 지도만 움직이게 함
        gestureHandling={'greedy'} 
        disableDefaultUI={true} // 커스텀 아이콘 쓰려고 기존 ui 사용 안함
        onClick={handleMapClick}
        clickableIcons={true} // 장소 아이콘 클릭 가능하게 설정
        mapId={'e8d33b0ce3e0c6e2578bec58'}
      >
        {/* 현재 위치를 표시하는 마커 */}
        <AdvancedMarker position={position}>
            <BouncingMarker src={location_marker} />
        </AdvancedMarker>

        {/* Map 자식으로 컨트롤러를 추가하여 지도 움직임을 제어 */}
        <MapController latitude={latitude} longitude={longitude} />
      </Map>
  );
};

export default GoogleMap;