import React, { useEffect, useState } from "react";
import { 
    SearchWrapper, 
    ContentWrapper,
    IconWrapper, 
    HamburgerIcon, 
    KeungdoriIcon, 
    SearchInputWrapper, 
    SearchIcon, 
    SearchInput, 
    TabContainer, 
    TabButton,
    ResultsList,
    SearchResultItem,
    Message,
    PlaceInfo,
    Distance,
    ReviewButton
} from "./Styles";
import Header from "../../components/Header";
import hamburger from "../../assets/hamburger_icon.png";
import keungdori from "../../assets/keungdori.png";
import searchIcon from "../../assets/search_icon.png";
import DrawerComponent from "../../components/DrawerComponent";
import { useNavigate } from "react-router-dom";
import useKakaoMap from "../../hooks/useKakaoMap";

interface Place {
    id: string;
    place_name: string;
    address_name: string;
    road_address_name: string;
    phone: string;
    distance: string;
}

const formatDistance = (distance: string) => {// 리렌더링될때마다 새로 생성할 필요없으니까 최초 렌더링 시에 한번만 생성하도록 하려고 함수 컴포넌트 밖에 둠
    const distInMeters = parseInt(distance, 10);
    if (isNaN(distInMeters)) return "";
    if (distInMeters < 1000) {
        return `${distInMeters}m`;
    }
    return `${(distInMeters / 1000).toFixed(1)}km`;
};

const Search: React.FC = () => {
    const { isLoaded } = useKakaoMap();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('place');

    const [currentLocation, setCurrentLocation] = useState<{ latitude: number, longitude: number; } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Place[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                console.log("위치 못 가져옴!");
            }
        );
    }, []);

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

    const handleSearch = () => {
        if (!isLoaded || !searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const ps = new window.kakao.maps.services.Places();

        const searchOptions = currentLocation ? {
            x: currentLocation.longitude,
            y: currentLocation.latitude,
            radius: 10000
        } : {};

        ps.keywordSearch(searchQuery, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                setSearchResults(data as Place[]);
            } else {
                setSearchResults([]);
                console.log("검색결과가 없습니다!");
            }
        }, searchOptions);
    };

    const handleKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleReviewClick = (place: Place) => {
        
        console.log("리뷰 작성:", place.place_name);
        // navigate(`/review/new?placeId=${place.id}`);
    };
   
    return (
        <SearchWrapper>
            <Header 
                leftNode={
                    <IconWrapper>
                        <HamburgerIcon src={hamburger} onClick={toggleDrawer(true)}/>
                        <KeungdoriIcon src={keungdori} />
                    </IconWrapper>
                }
            />

            <DrawerComponent isOpen={isDrawerOpen} onClose={toggleDrawer(false)}></DrawerComponent>

            <ContentWrapper>

                <SearchInputWrapper>
                    <SearchIcon src={searchIcon} />
                    <SearchInput placeholder="Search" value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyEnter} />
                </SearchInputWrapper>

                <TabContainer>
                    <TabButton 
                        isActive={activeTab === 'place'} 
                        onClick={() => setActiveTab('place')}
                    >
                        장소
                    </TabButton>
                    <TabButton 
                        isActive={activeTab === 'visited'} 
                        onClick={() => setActiveTab('visited')}
                    >
                        방문했던 곳
                    </TabButton>
                    <TabButton 
                        isActive={activeTab === 'hashtag'} 
                        onClick={() => setActiveTab('hashtag')}
                    >
                        해시태그
                    </TabButton>
                </TabContainer>

                {activeTab === 'place' && (
                    <ResultsList>
                        {searchResults.length > 0 ? (
                            searchResults.map((place) => (
                                <SearchResultItem key={place.id}>
                                    <PlaceInfo>
                                        <h4>{place.place_name}</h4>
                                        <p>{place.road_address_name || place.address_name}</p>
                                        {place.distance && (
                                            <Distance>{formatDistance(place.distance)}</Distance>
                                        )}
                                    </PlaceInfo>
                                    <ReviewButton onClick={() => handleReviewClick(place)}>
                                        리뷰 쓰기
                                    </ReviewButton>
                                </SearchResultItem>
                            ))
                        ) : (
                            <Message>리뷰를 작성할 장소를 검색해주세요</Message>
                        )}
                    </ResultsList>
                )}
                
                {activeTab === 'visited' && <ResultsList><Message>방문했던 장소로 검색해주세요</Message></ResultsList>}
                {activeTab === 'hashtag' && <ResultsList><Message>해시태그로 검색해주세요</Message></ResultsList>}

            </ContentWrapper>
        </SearchWrapper>
    );
};

export default Search;