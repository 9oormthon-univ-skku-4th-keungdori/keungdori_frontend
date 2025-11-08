import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import api from '../../api/api';
import '@smastrom/react-rating/style.css';
import { ScreenWrapper, ContentWrapper, NoReviewsMessage, PlaceHeader, PlaceName, ReviewListContainer, ButtonWrapper, VectorIcon } from './Styles';
import Header from '../../components/Header';
import Button from '../../components/Button';
import ReviewCard from '../../components/reviewcard/ReviewCard';
import Spinner from '../../components/Spinner';
import vector from '../../assets/vector.png';
import RdOnlyHashtag from '../../components/RdOnlyHashtag';

interface Tag {
    hashtag: string;
    backgroundColor: string;
    fontColor: string;
}

interface Review {
    reviewId: number;
    rating: number;
    memo: string;
    mainTag: Tag; // string -> Tag
    subTags: Tag[]; // string[] -> Tag[]
    placeName: string; 
    address: string;
    googleId: string;
    xCoordinate: number;
    yCoordinate: number;
    date: string;
    imageUrl: string;
}

//리뷰 불러오는 api
const fetchReviewsByPlaceId = async (placeId: string, pageParam: number) => {
    const { data } = await api.get(`/reviews/place/${placeId}?page=${pageParam}`);
    const { placeInfo, reviews, pageInfo } = data; 

    const nextPage = pageInfo.currentPage < pageInfo.totalPages - 1
        ? pageInfo.currentPage + 1
        : undefined;

    return {
        placeInfo: placeInfo,
        reviews: reviews,
        nextPage: nextPage,
    };
}

const ReviewList: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    //검색 화면에서 넘겨준 값들
    const placeId = location.state.placeId;
    const placeName = location.state.placeName; 
    const placeAddress = location.state.placeAddress;
    const placeX = location.state.longitude; 
    const placeY = location.state.latitude;
    //화면 이동 핸들러
    const handleBack = () => navigate(-1);
    const handleWriteReview = () => navigate(`/review/write/${placeId}`,
        { state: { x: placeX, y: placeY, placeId: placeId, placeName: placeName, placeAddress: placeAddress }}); //1. 처음 리뷰 작성하는 화면이랑, 리뷰 보는 화면 분리
    const handleReviewClick = (review: Review) => {
        navigate(`/review/edit/${review.reviewId}`, { state: { reviewData: review }});
    }

    //무한스크롤 감지
    const { ref, inView } = useInView({ 
        threshold: 0,
        rootMargin: '200px',
    });

    //UseInfiniteQuery로 무한 스크롤해서 계속 데이터를 볼 수 있음
    const { 
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetching,
    } = useInfiniteQuery({
       queryKey: ['reviews', placeId],
       queryFn: ({ pageParam = 0}) => fetchReviewsByPlaceId(placeId!, pageParam),
       initialPageParam: 0,
       getNextPageParam: (lastPage) => lastPage.nextPage,
       enabled: !!placeId, 
    });

    useEffect(() => {
        // 사용자가 페이지 끝을 보고 있고(inView), 다음 페이지가 있으며(hasNextPage), 데이터를 불러오는 중이 아닐 때(!isFetching)
        if (inView && hasNextPage && !isFetching) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetching, fetchNextPage]);

    /*if (isError) {
        console.error("리뷰 데이터 호출 실패.", error);
        return <div>에러가 발생했습니다!</div>;
    }*/

    const placeInfo = data?.pages[0]?.placeInfo;

    if (isLoading) {
        return <Spinner />;
    }

    const hasReviews = data && data.pages.some(page => page.reviews.length > 0);
        

    return (
        <ScreenWrapper>
            <Header
                leftNode={<VectorIcon src={vector}></VectorIcon>}
                onLeftClick={handleBack}
            />

            <ContentWrapper>
                <PlaceHeader>
                    <PlaceName>{placeName}</PlaceName>
                    { placeInfo?.mainTag?.hashtag &&
                        <RdOnlyHashtag 
                            hashtag={placeInfo.mainTag.hashtag} 
                            backgroundColor={placeInfo.mainTag.backgroundColor}
                            fontColor={placeInfo.mainTag.fontColor}
                        />
                    }
                </PlaceHeader>

                {hasReviews ? (
                    <ReviewListContainer>
                        {data.pages.map((page, i) => (
                            <React.Fragment key={i}>
                                {page.reviews.map((review: Review) => (
                                    <ReviewCard 
                                        key={review.reviewId}
                                        review={review} 
                                        onClick={() => handleReviewClick(review)} 
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </ReviewListContainer>
                ) : (
                    <NoReviewsMessage>해당 장소의 리뷰가 없습니다</NoReviewsMessage>
                )}

                <div ref={ref} style={{ height: '1px' }} />

                {/* 다음 페이지를 불러올 때(isFetching) 그리고 초기 로딩이 아닐 때(!isLoading) 로딩 UI 표시 */}
                {isFetching && !isLoading && (
                    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
                         {/* 간단한 로더를 여기에 두거나, Spinner 컴포넌트를 수정하여 사용 */}
                        <NoReviewsMessage>리뷰를 더 불러오는 중입니다...</NoReviewsMessage>
                    </div>
                )}

            </ContentWrapper>

            <ButtonWrapper>
                <Button onClick={handleWriteReview}>
                    {hasReviews ? '추가 작성하기' : '작성하기'}
                </Button>
            </ButtonWrapper>
        </ScreenWrapper>
    );
};

export default ReviewList;