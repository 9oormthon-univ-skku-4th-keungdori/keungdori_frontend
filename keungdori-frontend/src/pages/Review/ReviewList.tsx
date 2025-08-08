import React, { useEffect, useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/Header';
import Button from '../../components/Button';
import api from '../../api/api';
import { ScreenWrapper, ContentWrapper, HashtagContainer, MainHashtag, NoReviewsMessage, PlaceHeader, PlaceName, ReviewCard, ReviewContent, ReviewDate, ReviewImagePlaceholder, ReviewListContainer, ReviewMemo, StarRating, ButtonWrapper, VectorIcon } from './Styles';
import Hashtag from '../../components/Hashtag';
import vector from '../../assets/vector.png';

interface Review {
    placeId: number; //카카오 장소 id
    placeName: string; //카카오 장소 id
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

interface Coords {
    x: number;
    y: number;
}

const renderStars = (rating: number) => {
    return (
        <Rating 
        style={{ maxWidth: 150 }} 
        value={rating}
        readOnly
        />
    );
};

const mockData: Review[] = [ {   //더미데이터
            placeId: 10,
            placeName: "스페인오늘",
            x: 10,
            y: 20,
            reviewId: 1,
            date: "20250101", 
            rating: 4.5, 
            memo: "맛있긴한데 너무 비싸요ㅜㅜ",
            maintag: "#존맛",
            subtags: ["#스페인", "#하몽"], 
            imageUrl: "사진없음"
        },
        {   
            placeId: 10, 
            placeName: "스페인오늘",
            x: 10,
            y: 20,
            reviewId: 2,
            date: "20250101", 
            rating: 3.5, 
            memo: "개존맛임 또가야지~ 근데 너무 비싸ㅜㅜ 돈 많이 벌어야지!",
            maintag: "#존맛",
            subtags: ["#스페인", "#하몽"], 
            imageUrl: "사진없음"
        },
        {   
            placeId: 10, 
            placeName: "스페인오늘",
            x: 10,
            y: 20,
            reviewId: 3,
            date: "20250101", 
            rating: 2.5, 
            memo: "개존맛임 또가야지~",
            maintag: "#존맛",
            subtags: ["#스페인", "#하몽"], 
            imageUrl: "사진없음"
        },
        {   
            placeId: 10, 
            placeName: "스페인오늘",
            x: 10,
            y: 20,
            reviewId: 4,
            date: "20250101", 
            rating: 1.5, 
            memo: "개존맛임 또가야지~",
            maintag: "#존맛",
            subtags: ["#스페인", "#하몽"], 
            imageUrl: "사진없음"
        },
        {   
            placeId: 10, 
            placeName: "스페인오늘",
            x: 10,
            y: 20,
            reviewId: 5,
            date: "20250101", 
            rating: 5, 
            memo: "개존맛임 또가야지~",
            maintag: "#존맛",
            subtags: ["#스페인", "#하몽"], 
            imageUrl: "사진없음"
        }
    ];

    const fetchReviewsByPlaceId = async (placeId: string): Promise<Review[]> => { //해당 장소의 리뷰들 받아옴
        const { data } = await api.get<Review[]>(`/reviews/place/${placeId}`);
        return data;
    }

const ReviewList: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { placeId } = useParams<{ placeId: string }>(); //검색에서 url에 담아 넘겨주는 카카오 장소 id
    const placeName = location.state.placeName; //검색에서 장소 이름을 state에 담아서 넘겨준거
    const placeX = location.state.longitude; //장소의 위도, 경도
    const placeY = location.state.latitude;

    const handleBack = () => navigate(-1);
    const handleWriteReview = () => navigate(`/review/writereview/${placeId}`,
        { state: { x: placeX, y: placeY, placeId: placeId, placeName: placeName }}); //1. 처음 리뷰 작성하는 화면이랑, 리뷰 보는 화면 분리
    const handleReviewClick = (review: Review) => {
        navigate(`/review/modifyreview/${placeId}`, { state: { reviewData: review, placeId: placeId, placeName: placeName }});
    }

    const { data: reviews, isPending, isError, error } = useQuery<Review[], Error> ({
       queryKey: ['reviews', placeId],
       queryFn: () => fetchReviewsByPlaceId(placeId!),
       enabled: !!placeId, 
    });

    /*if (isError) {
        console.error("리뷰 데이터 호출 실패.", error);
        return <div>에러가 발생했습니다!</div>;
    }*/

    const hasReviews = reviews && reviews.length > 0;

    return (
        <ScreenWrapper>
            <Header
                leftNode={<VectorIcon src={vector}></VectorIcon>}
                onLeftClick={handleBack}
            />

            <ContentWrapper>
                <PlaceHeader>
                    <PlaceName>{placeName || '장소 정보'}</PlaceName>
                    {hasReviews && <MainHashtag>{reviews[0].maintag}</MainHashtag>}
                </PlaceHeader>

                {hasReviews ? (
                    <ReviewListContainer>
                        {reviews.map(review => (
                            <ReviewCard key={review.reviewId} onClick={() => handleReviewClick(review)}>
                                <ReviewImagePlaceholder />
                                <ReviewContent>
                                    <ReviewDate>{review.date}</ReviewDate>
                                    <StarRating>{renderStars(review.rating)}</StarRating>
                                    <ReviewMemo>{review.memo.length > 10 ? `${review.memo.substring(0, 10)}...` : review.memo}</ReviewMemo>
                                    <HashtagContainer>
                                        {review.subtags.map(tag => <Hashtag key={tag}>{tag}</Hashtag>)}
                                    </HashtagContainer>
                                </ReviewContent>
                            </ReviewCard>
                        ))}
                    </ReviewListContainer>
                ) : (
                    <NoReviewsMessage>해당 장소의 리뷰가 없습니다</NoReviewsMessage>
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