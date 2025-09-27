import React, { useEffect, useState, useRef } from "react";
import { 
    SearchWrapper, 
    ContentWrapper,
    IconWrapper, 
    VectorIcon,
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
    ReviewListContainer,
    ReviewListItem,
} from "./Styles";
import Header from "../../components/Header";
import vector from "../../assets/vector.svg";
import keungdori from "../../assets/keungdori.png";
import searchIcon from "../../assets/search_icon.png";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from 'react-intersection-observer';
import { loadGoogleScript } from "../../utils/loadGoogleScript";
import PlaceCard from "../../components/placecard/PlaceCard";

interface Place {
    place_id: string;
    placeName: string;
    formatted_address: string;
    geometry: {
        location: google.maps.LatLng;
    }
}

interface ReviewedPlace {
    placeId: number;
    placeName: string;
    address: string;
    googleId: string;
    xcoordinate: number;
    ycoordinate: number;
}

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
            placeName: place.displayName ?? '', 
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

const fetchPlaceNameSearch = async ({ pageParam = 0, query }: { pageParam?: number, query: string }) => {
    const { data } = await api.get(`/reviews/visited?search=${query}&page=${pageParam}`);
    
    const { content, pageInfo } = data;
    
    //다음 페이지 존재 여부 확인
    const nextPage = pageInfo.currentPage < pageInfo.totalPages - 1 ? pageInfo.currentPage + 1 : undefined;

    return {
        content: content,
        nextPage: nextPage,
    }
};

const fetchHashtagSearch = async ({ pageParam = 0, query }: { pageParam?: number, query: string }) => {
    const { data } = await api.get(`/reviews/hashtag?tag=${query}&page=${pageParam}`);
    
    const { content, pageInfo } = data;

    const nextPage = pageInfo.currentPage < pageInfo.totalPages - 1? pageInfo.currentPage + 1 : undefined;

    return {
        content: content,
        nextPage: nextPage,
    };
}


const Search: React.FC = () => {
    const navigate = useNavigate();
    const googleScriptLoaded = useRef(false);
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
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 0,
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
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 0,
        enabled: false, 
    });

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
        console.log("리뷰 작성:", place.placeName);
        navigate(`/review/reviewlist/${place.place_id}`, 
            { state: { 
                placeName: place.placeName,
                placeId: place.place_id,
                placeAddress: place.formatted_address,
                longitude: place.geometry.location.lng(), 
                latitude: place.geometry.location.lat()  
            }
        });
    };

    const handleReviewClick = (place: ReviewedPlace) => {
        navigate(`/review/reviewlist/${place.googleId}`, 
            { state: { 
                placeName: place.placeName,
                placeId: place.googleId,
                placeAddress: place.address,
                longitude: place.xcoordinate,
                latitude: place.ycoordinate
             }});
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
                        <VectorIcon src={vector} onClick={() => {navigate(-1)}}></VectorIcon>
                        <KeungdoriIcon src={keungdori} />
                    </IconWrapper>
                }
            />

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

                { activeTab === 'place' && (
                    <ResultsList>
                        {googleSearchResult.length > 0 ? (
                            googleSearchResult.map((place) => (
                                <SearchResultItem key={place.place_id}>
                                    <PlaceInfo>
                                        <h4>{place.placeName}</h4>
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
                
                { activeTab === 'visited' && (
                    <ResultsList>
                        {visitedResult?.pages && visitedResult.pages[0].content.length > 0 ? (
                            <ReviewListContainer>
                                { visitedResult.pages.map(page =>
                                page.content.map((place: ReviewedPlace) => (
                                    <ReviewListItem key={place.placeId}>
                                        <PlaceCard 
                                            place={place} 
                                            onClick={() => handleReviewClick(place)} 
                                        />
                                    </ReviewListItem>
                                ))
                            )}
                            </ReviewListContainer>
                        ) : (
                            <Message>해당 장소의 리뷰가 없습니다</Message>
                        )}
                    </ResultsList>
                )}

                { activeTab === 'hashtag' && (
                    <ResultsList>
                        { hashtagResult?.pages && hashtagResult.pages[0].content.length > 0 ? (
                            <ReviewListContainer>
                                { hashtagResult.pages.map(page => 
                                page.content.map((place: ReviewedPlace) => (
                                    <ReviewListItem key={place.placeId}>
                                        <PlaceCard 
                                            place={place} 
                                            onClick={() => handleReviewClick(place)} 
                                        />
                                    </ReviewListItem>
                                ))
                            )}
                            </ReviewListContainer>
                        ) : (
                            <Message>해당 해시태그의 리뷰가 없습니다</Message>
                        )}
                        
                    </ResultsList>
                )}

                {/*activeTab !== 'place' && (
                    <>
                    <div ref={ref} /> 
                    {(isVisitedFetching || isHashtagFetching) && (
                        <Message>리뷰를 불러오는 중입니다</Message>
                    )}
                    </>
                )*/}

            </ContentWrapper>
        </SearchWrapper>
        
    );
};

export default Search;