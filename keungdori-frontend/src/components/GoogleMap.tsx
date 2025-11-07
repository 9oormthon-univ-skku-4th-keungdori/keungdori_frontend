import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, AdvancedMarker, useMap, type MapMouseEvent, type MapEvent } from '@vis.gl/react-google-maps';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import place_marker from '../assets/place_marker.svg';
import location_marker from '../assets/current_marker.svg';

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
  height: 60px;
  animation: ${bounce} 2s infinite;
  filter: drop-shadow(0px 5px 3px rgba(0, 0, 0, 0.2));
`;

const PlaceMarker = styled.img`
  width: 32px; // 원하는 크기로 조절
  height: 32px; // 원하는 크기로 조절
  border-radius: 50%; // 원형 마커로 만들고 싶다면
  border: 2px solid white; // 테두리 추가
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3); // 그림자 효과
`;

const MapController = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    const map = useMap();
    // 사용자가 위치를 이동하면 그에 맞게 지도의 중심을 옮기는 기능임.
    useEffect(() => {
        if (map && latitude && longitude) {
            map.panTo({ lat: latitude, lng: longitude });
        }
    }, [map, latitude, longitude]);

    return null;
}

interface Tag {
    hashtag: string;
    backgroundColor: string;
    fontColor: string;
}

interface Review {
    mainTag: Tag;
    subTags: Tag[];
    placeName: string; 
    address: string;
    googleId: string;
    xcoordinate: number;
    ycoordinate: number;
    distance: number;
}

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  onMapClick: (placeId: string | null) => void; // Place ID를 부모로 전달할 콜백 함수
  onBoundsChanged: (bounds: google.maps.LatLngBounds) => void;
  reviews: Review[] | undefined;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ latitude, longitude, onMapClick, onBoundsChanged, reviews }) => {
  const navigate = useNavigate();
  const position = { lat: latitude, lng: longitude };

  // 지도 클릭 핸들러
  const handleMapClick = (event: MapMouseEvent) => {
    // event.detail 객체에서 placeId를 추출합니다. 장소가 아니면 null일 수 있습니다.
    const placeId = event.detail.placeId;
    onMapClick(placeId);
  };

  const handleIdle = (event: MapEvent) => {
    const newBounds = event.map.getBounds();
    // 화면을 이동하면 해당 화면 모서리의 위도 경도를 구하고 그걸 부모에게 전달
    if (newBounds) {
        onBoundsChanged(newBounds);
    }
  };

  const handleMarkerClick = (review: Review) => {
    console.log("장소 이름:", review.placeName);
    navigate(`/review/reviewlist/${review.googleId}`, 
        { state: { 
            placeName: review.placeName,
            placeId: review.googleId,
            placeAddress: review.address,
            longitude: review.xcoordinate,
            latitude: review.ycoordinate
        }});
  }

  return (
      <Map
        style={{ width: '100%', height: '100%' }}
        defaultCenter={{ lat: 37.588100, lng: 126.992831 }}
        defaultZoom={17}
        gestureHandling={'greedy'} //지도 화면 범위에서 일어나는 스크롤과 드래그를 지도가 독점해서 지도만 움직이게 함
        disableDefaultUI={true} // 커스텀 아이콘 쓰려고 기존 ui 사용 안함
        onClick={handleMapClick}
        onIdle={handleIdle}
        clickableIcons={true} // 장소 아이콘 클릭 가능하게 설정
        mapId={'e8d33b0ce3e0c6e2578bec58'}
      >
        {/* 현재 위치 마커 */}
        <AdvancedMarker position={position}>
            <BouncingMarker src={location_marker} />
        </AdvancedMarker>

        {/* 리뷰 데이터를 기반으로 마커 렌더링 */}
        {reviews &&
            reviews.map((review) => (
                <AdvancedMarker
                    key={review.placeName}
                    position={{
                        lat: review.ycoordinate, // API 데이터의 위도
                        lng: review.xcoordinate, // API 데이터의 경도
                    }}
                    title={review.placeName} // 마우스 오버 시 장소 이름 표시
                    onClick={() => handleMarkerClick(review)}
                >
                    <PlaceMarker src={place_marker} alt={review.placeName} />
                </AdvancedMarker>
          ))}

        {/* Map 자식으로 컨트롤러를 추가하여 지도 움직임을 제어 */}
        <MapController latitude={latitude} longitude={longitude} />
      </Map>
  );
};

export default GoogleMap;