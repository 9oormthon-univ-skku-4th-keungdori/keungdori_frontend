import React, { useEffect, useState, useRef } from "react";
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
    /*Distance,*/
    ReviewButton,
    ReviewListContainer
} from "./Styles";
import Header from "../../components/Header";
import hamburger from "../../assets/hamburger_icon.png";
import keungdori from "../../assets/keungdori.png";
import searchIcon from "../../assets/search_icon.png";
import DrawerComponent from "../../components/DrawerComponent";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ReviewCard from "../../components/reviewcard/ReviewCard";
import { useInView } from 'react-intersection-observer';
import { loadGoogleScript } from "../../utils/loadGoogleScript";

interface Place {
    place_id: string;
    name: string;
    formatted_address: string;
    geometry: {
        location: google.maps.LatLng;
    }
}

interface Review {
    placeId: number; //구글 장소 id
    placeName: string; //구글 장소 이름
    x: number; //장소 위도
    y: number; //장소 경도
    reviewId: number; //리뷰 id
    date: string; //리뷰 작성한 날짜
    rating: number; //별점
    maintag: string; //메인태그
    subtags: string[]; //서브태그
    imageUrl?: string; //이미지경로(supabase)
    memo: string; //메모
}

/*const formatDistance = (distance: string) => {// 리렌더링될때마다 새로 생성할 필요없으니까 최초 렌더링 시에 한번만 생성하도록 하려고 함수 컴포넌트 밖에 둠
    const distInMeters = parseInt(distance, 10);
    if (isNaN(distInMeters)) return "";
    if (distInMeters < 1000) {
        return `${distInMeters}m`;
    }
    return `${(distInMeters / 1000).toFixed(1)}km`;
};*/

const searchGooglePlaces = async (
    query: string,
    location: google.maps.LatLng | null
): Promise<Place[]> => { 

    const request: google.maps.places.SearchByTextRequest = {
        textQuery: query,
        fields: ['id', 'displayName', 'formattedAddress', 'location'],
        language: 'ko',
        region: 'kr',
    };

    if (location) {
        request.locationBias = location;
    }

    try {
        const { places } = await google.maps.places.Place.searchByText(request);
        
        const mappedPlaces: Place[] = places.map(place => ({
            place_id: place.id ?? '', 
            name: place.displayName ?? '', 
            formatted_address: place.formattedAddress ?? '', 
            geometry: {
                location: place.location ?? new google.maps.LatLng(0, 0)
            },
        }));

        return mappedPlaces;

    } catch (error) {
        console.error("Google Places search failed:", error);
        return [];
    }
};

const fetchPlaceNameSearch = async ({ pageParam = 1, query }: { pageParam?: number, query: string }) => {
    const { data } = await api.get(`/reviews/visited?name=${query}&page=${pageParam}`);
    return data; //api 응답이 { items: [], nextPage: 2라고 가정}
};

const fetchHashtagSearch = async ({ pageParam = 1, query }: { pageParam?: number, query: string }) => {
    const { data } = await api.get(`/reviews/hashtag?tag=${query}&page=${pageParam}`);
    return data;
}


const Search: React.FC = () => {
    const navigate = useNavigate();
    const googleScriptLoaded = useRef(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('place'); //현재 실행중인 탭
    const [currentLocation, setCurrentLocation] = useState<{ latitude: number, longitude: number; } | null>(null); //현재 사용자 위치
    const [searchQuery, setSearchQuery] = useState(""); //검색어

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '200px',
    });

    const {//구글 검색 useQuery
        data: googleSearchResult = [], 
        refetch: searchGooglePlacesRefetch,
        //isLoading: isGoogleSearchLoading // 3. 로딩 시 애니메이션
    } = useQuery({
        queryKey: ['googlePlaces', searchQuery],
        queryFn: () => searchGooglePlaces(
            searchQuery,
            currentLocation ? new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude) : null
        ),
        enabled: false,
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: visitedResult,
        fetchNextPage: fetchNextVisited,
        hasNextPage: hasNextVisited,
        isFetching: isVisitedFetching,
        refetch: refetchPlaceName,
    } = useInfiniteQuery({
        queryKey: ['placeNameSearch', searchQuery],
        queryFn: ({ pageParam }) => fetchPlaceNameSearch({ pageParam, query: searchQuery }),
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        initialPageParam: 1,
        enabled: false,
    });

    const {
        data: hashtagResult,
        fetchNextPage: fetchNextHashtag,
        hasNextPage: hasNextHashtag,
        isFetching: isHashtagFetching,
        refetch: refetchHashtag, 
    } = useInfiniteQuery({
        queryKey: ['hashtagSearch', searchQuery],
        queryFn: ({ pageParam }) => fetchHashtagSearch({ pageParam, query: searchQuery }),
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        initialPageParam: 1,
        enabled: false, 
    });



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

        const handleFocus = async () => {
            if (!googleScriptLoaded.current) {
                try {
                    await loadGoogleScript();
                    googleScriptLoaded.current = true;
                    console.log("Google Maps 스크립트가 Focus 이벤트로 미리 로드되었습니다.");
                } catch (error) {
                    console.error("스크립트 미리 로드 실패:", error);
                }
            }
        };

    const handleKeyEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            if (activeTab === 'place') {
                try {
                    await loadGoogleScript();
                    searchGooglePlacesRefetch();
                } catch (error) {
                    console.error("검색을 위한 스크립트 로드 실패:", error);
                }
            } else if (activeTab === 'visited') {
                refetchPlaceName();
            } else {
                refetchHashtag();
            }
        }
    };

    const handleReviewButtonClick = (place: Place) => { //리뷰 목록 화면으로 이동할때, 장소 이름, 좌표 넘겨줌
        console.log("리뷰 작성:", place.name);
        navigate('/review/reviewlist/${place.place_id}', 
            { state: { 
                placeName: place.name, 
                longitude: place.geometry.location.lng(), 
                latitude: place.geometry.location.lat()  
            }
        });
    };

    const handleReviewClick = (review: Review) => {
        navigate(`/review/modifyreview/${review.placeId}`, { state: { reviewData: review }});
    }

    useEffect(() => {//브라우저 api로 현재 위치 가져오기
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            /*(error) => {
                console.log("위치 못 가져옴!");
            }*/
        );
    }, []);

    useEffect(() => {
        if (inView) {
            if (activeTab === 'visited' && hasNextVisited && !isVisitedFetching) {
            fetchNextVisited();
            } 
            else if (activeTab === 'hashtag' && hasNextHashtag && !isHashtagFetching) {
            fetchNextHashtag();
            }
        }
    }, [inView, activeTab, hasNextVisited, isVisitedFetching, fetchNextVisited, hasNextHashtag, isHashtagFetching, fetchNextHashtag]);
   
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
                        onFocus={handleFocus}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyEnter} />
                    {/* 1. icon 오른쪽으로 옮기고 아이콘 눌러서 검색할 수 있게함*/}
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
                        {googleSearchResult.length > 0 ? (
                            googleSearchResult.map((place) => (
                                <SearchResultItem key={place.place_id}>
                                    <PlaceInfo>
                                        <h4>{place.name}</h4>
                                        <p>{place.formatted_address}</p>
                                        {/*{place.distance && (
                                            <Distance>{formatDistance(place.distance)}</Distance>
                                        )}*/}
                                    </PlaceInfo>
                                    <ReviewButton onClick={() => handleReviewButtonClick(place)}>
                                        리뷰 쓰기
                                    </ReviewButton>
                                </SearchResultItem>
                            ))
                        ) : (
                            <Message>리뷰를 작성할 장소를 검색해주세요</Message>
                        )}
                    </ResultsList>
                )}
                
                {activeTab === 'visited' && (
                    <ResultsList>
                        { visitedResult?.pages && visitedResult.pages[0].items.length > 0 ? (
                            <ReviewListContainer>
                                { visitedResult.pages.map(page =>
                                page.items.map((review: Review) => (
                                    <ReviewCard 
                                        key={review.reviewId}
                                        review={review} 
                                        onClick={() => handleReviewClick(review)} 
                                    />
                                ))
                            )}
                            <div ref={ref}/>
                            </ReviewListContainer>
                        ) : (
                            <Message>해당 장소의 리뷰가 없습니다</Message>
                        )}
                        {isVisitedFetching && <Message>리뷰를 불러오는 중입니다</Message>} 
                    </ResultsList>
                )}

                {activeTab === 'hashtag' && (
                    <ResultsList>
                        { hashtagResult?.pages && hashtagResult.pages[0].items.length > 0 ? (
                            <ReviewListContainer>
                                { hashtagResult.pages.map(page => 
                                page.items.map((review: Review) => (
                                    <ReviewCard 
                                        key={review.reviewId}
                                        review={review} 
                                        onClick={() => handleReviewClick(review)} 
                                    />
                                ))
                            )}
                            </ReviewListContainer>
                        ) : (
                            <Message>해당 해시태그의 리뷰가 없습니다</Message>
                        )}
                        
                    </ResultsList>
                )}

                {activeTab !== 'place' && (
                    <>
                    <div ref={ref} /> 
                    {(isVisitedFetching || isHashtagFetching) && (
                        <Message>리뷰를 불러오는 중입니다</Message>
                    )}
                    </>
                )}

            </ContentWrapper>
        </SearchWrapper>
        
    );
};

export default Search;