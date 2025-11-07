import React, { lazy, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIProvider, useApiIsLoaded } from "@vis.gl/react-google-maps";
import { HomeWrapper, HamburgerIcon, KeungdoriIcon, IconWrapper, MapContainer, SearchWrapper, SearchIcon, SearchInput } from "./Style";
import hamburger from "../../assets/hamburger_icon.png";
import keungdori from "../../assets/keungdori.png";
import searchIcon from "../../assets/search_icon.png";
import Header from "../../components/Header";
import BottomSheet from "../../components/bottomsheet/BottomSheet";
import GoogleMap from "../../components/GoogleMap";
import Spinner from "../../components/Spinner";
import api from "../../api/api";
import { useQuery, type QueryFunctionContext} from "@tanstack/react-query";

const DrawerComponent = lazy(() => import("../../components/DrawerComponent"));

interface Tag {
    hashtag: string;
    backgroundColor: string;
    fontColor: string;
}

interface Review {
    mainTag: Tag; // string -> Tag
    subTags: Tag[]; // string[] -> Tag[]
    placeName: string; 
    address: string;
    googleId: string;
    xcoordinate: number;
    ycoordinate: number;
    distance: number;
}

const API_KEY = import.meta.env.VITE_GOOGLEMAPS_API_KEY;

const MapLoader: React.FC<{
    currentPosition: { latitude: number; longitude: number; };
    handleMapClick: (placeId: string | null) => void;
    onBoundsChanged: (bounds: google.maps.LatLngBounds) => void;
    reviews: Review[] | undefined;
}> = ({ currentPosition, handleMapClick, onBoundsChanged, reviews}) => {

    const apiIsLoaded = useApiIsLoaded();

    return apiIsLoaded ? (
        <GoogleMap
            latitude={currentPosition.latitude}
            longitude={currentPosition.longitude}
            onMapClick={handleMapClick}
            onBoundsChanged={onBoundsChanged}
            reviews={reviews}
        />
    ) : (
        <Spinner />
    );
};

const fetchReview = async ({ queryKey }: QueryFunctionContext<[string, google.maps.LatLngBounds | null]>): Promise<Review[]> => {
    const [, bounds] = queryKey;

    if (!bounds) {
        return [];
    }

    const { north, south, east, west } = bounds.toJSON();
    const { data } = await api.get(`/places/nearme`, {
        params: { north, south, east, west }
    });
    return data.places;

};

// 해당 위치에서 사용자가 리뷰 작성한 곳 마커 표시해야 함
const Home: React.FC = () => {
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentPosition, setCurrentPosition] = useState({ latitude: 37.588100, longitude: 126.992831 }); //현재 위치
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null); //지도에서 클릭한 장소의 장소 id
    const [isInteractiveMapReady, setInteractiveMapReady] = useState(false); //정적 지도 보여지면 바로 지도 api 로드
    const [staticMapUrl, setStaticMapUrl] = useState<string>(); //정적 지도 url
    const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null); //화면에서 지도 범위 어디인지

    const {
        data: reviewData,
        isFetching,
    } = useQuery<
        Review[],                                           // TQueryFnData: fetchReview가 반환하는 타입
        Error,                                               // TError: 에러 타입
        Review[],                           // TData: 실제 반환되는 데이터 타입
        [string, google.maps.LatLngBounds | null]          // TQueryKey: 쿼리 키 타입
    >({
        queryKey: ['reviews', bounds] as const,
        queryFn: fetchReview,
        enabled: !!bounds
    })

    const handleMapClick = useCallback((placeId: string | null) => {
        if (placeId) {
            console.log("선택된 장소의 Place ID:", placeId);
            if (!selectedPlaceId) {
                console.log(selectedPlaceId);
            }
            setSelectedPlaceId(placeId);
            // 여기서 BottomSheet를 열거나 다른 동작을 수행할 수 있습니다.
        }
    }, [selectedPlaceId]);

    const handleBoundsChanged = useCallback((newBounds: google.maps.LatLngBounds) => {
        console.log("지도 범위가 변경되었습니다 (부모 컴포넌트):", newBounds.toJSON());
        setBounds(newBounds);
    }, []);

    const handleSearchClick = () => {
        navigate('/search');
    };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setIsDrawerOpen(open);
    };

    useEffect(() => { //처음에 위치 가져오고 그 다음에 해당 위치의 지도 이미지 표시해서 lcp 줄임
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentPosition({ latitude, longitude });

                    const newStaticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=17&size=600x800&key=${API_KEY}`
                    setStaticMapUrl(newStaticMapUrl);

                    setTimeout(() => {
                        setInteractiveMapReady(true);
                    }, 1000);
                },
                (error) => {
                    console.log("위치 조회 실패", error);
                    setInteractiveMapReady(true);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 1000,
                    maximumAge: 0
                }
            );
        } else {
            console.error("브라우저가 위치정보 제공하지 않음");
            setInteractiveMapReady(true);
        }
    }, []); 

    useEffect(() => {
        if (isInteractiveMapReady && navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setCurrentPosition({// 실시간 위치 추적
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.log("위치 추적 실패", error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 1000,
                    maximumAge: 0
                }
            );

            return () => {
            navigator.geolocation.clearWatch(watchId); // 다른 화면 이동하면 종료(배터리 소모 많음)
            };

        }

    }, [isInteractiveMapReady]);


    return (
            <HomeWrapper>
                <Header leftNode={
                    <IconWrapper>
                        <HamburgerIcon src={hamburger} onClick={toggleDrawer(true)}></HamburgerIcon>
                        <KeungdoriIcon src={keungdori}></KeungdoriIcon>
                    </IconWrapper>}>
                </Header>

                {isDrawerOpen && <DrawerComponent isOpen={isDrawerOpen} onClose={toggleDrawer(false)} />}

                <SearchWrapper>
                    <SearchIcon src={searchIcon} alt="search icon" />
                    <SearchInput
                        placeholder="Search"
                        onClick={handleSearchClick}
                        readOnly // 사용자 입력 방지
                    />
                </SearchWrapper>
        
                <MapContainer>
                    {isInteractiveMapReady ? (
                        <APIProvider apiKey={API_KEY} libraries={['places', 'marker']}>
                            <MapLoader
                                currentPosition={currentPosition}
                                handleMapClick={handleMapClick}
                                onBoundsChanged={handleBoundsChanged}
                                reviews={reviewData}
                            />
                        </APIProvider>
                    ) : (
                        staticMapUrl ? (
                            <img 
                                src={staticMapUrl} 
                                alt="Map of current location" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                fetchPriority="high"
                            />
                        ) : (
                            <Spinner />
                        )
                    )}
                </MapContainer>
                
                {<BottomSheet
                    reviews={reviewData}
                    isFetching={isFetching}
                />}

            
            </HomeWrapper>
    );



}

export default Home;