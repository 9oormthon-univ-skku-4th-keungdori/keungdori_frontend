import React, { lazy, useCallback, useEffect, useState } from "react";
import { HomeWrapper, HamburgerIcon, KeungdoriIcon, IconWrapper, MapContainer, SearchWrapper, SearchIcon, SearchInput } from "./Style";
import Header from "../../components/Header";
import hamburger from "../../assets/hamburger_icon.png";
import keungdori from "../../assets/keungdori.png";
import searchIcon from "../../assets/search_icon.png";
//import KakaoMap from "../../components/KakaoMap";
import BottomSheet from "../../components/bottomsheet/BottomSheet";
import { useNavigate } from "react-router-dom";
import GoogleMap from "../../components/GoogleMap";
import { APIProvider, useApiIsLoaded } from "@vis.gl/react-google-maps";
import Spinner from "../../components/Spinner";

const API_KEY = import.meta.env.VITE_GOOGLEMAPS_API_KEY;

const DrawerComponent = lazy(() => import("../../components/DrawerComponent"));

const MapLoader: React.FC<{
    currentPosition: { latitude: number; longitude: number; };
    handleMapClick: (placeId: string | null) => void;
}> = ({ currentPosition, handleMapClick }) => {

    const apiIsLoaded = useApiIsLoaded();

    return apiIsLoaded ? (
        <GoogleMap
            latitude={currentPosition.latitude}
            longitude={currentPosition.longitude}
            onMapClick={handleMapClick}
        />
    ) : (
        <Spinner />
    );
};

// 해당 위치에서 사용자가 리뷰 작성한 곳 마커 표시해야 함
const Home: React.FC = () => {
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentPosition, setCurrentPosition] = useState({
        latitude: 37.588100,
        longitude: 126.992831,
    });
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

    const handleMapClick = useCallback((placeId: string | null) => {
        if (placeId) {
            console.log("선택된 장소의 Place ID:", placeId);
            if (!selectedPlaceId) {
                console.log(selectedPlaceId);
            }
            setSelectedPlaceId(placeId);
            // 여기서 BottomSheet를 열거나 다른 동작을 수행할 수 있습니다.
        }
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

    useEffect(() => {
        let watchId: number | null = null;

        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
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
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            console.error("브라우저가 위치정보 api 제공하지 않음");
        }

        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId); // 다른 화면 이동하면 종료(배터리 소모 많음)
            }
        }
    }, []);


    return (
            <HomeWrapper>
                <Header leftNode={
                    <IconWrapper>
                        <HamburgerIcon src={hamburger} onClick={toggleDrawer(true)}></HamburgerIcon>
                        <KeungdoriIcon src={keungdori}></KeungdoriIcon>
                    </IconWrapper>}>
                </Header>

                <DrawerComponent isOpen={isDrawerOpen} onClose={toggleDrawer(false)}></DrawerComponent>

                <SearchWrapper>
                    <SearchIcon src={searchIcon} alt="search icon" />
                    <SearchInput
                        placeholder="Search"
                        onClick={handleSearchClick}
                        readOnly // 사용자 입력 방지
                    />
                </SearchWrapper>
        
                <MapContainer>
                    <APIProvider apiKey={API_KEY} libraries={['places']}>
                        <MapLoader
                            currentPosition={currentPosition}
                            handleMapClick={handleMapClick}
                        />
                    </APIProvider>
                    </MapContainer>
                
                <BottomSheet/>

            
            </HomeWrapper>
    );



}

export default Home;