import React, { useEffect, useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Button from '../../components/Button';
import api from '../../api/api';
import { ScreenWrapper, ContentWrapper, HashtagContainer, MainHashtag, NoReviewsMessage, PlaceHeader, PlaceName, ReviewCard, ReviewContent, ReviewDate, ReviewImagePlaceholder, ReviewListContainer, ReviewMemo, StarRating, ButtonWrapper, VectorIcon } from './Styles';
import Hashtag from '../../components/Hashtag';
import vector from '../../assets/vector.png';

interface Review {
  id: number;
  reviewId: number;
  date: string;
  rating: number;
  memo: string;
  mainHashtag: string;
  hashtags: string[];
  imageUrl?: string;
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

const mockData: Review[] = [ {   
            id: 10,
            reviewId: 1,
            date: "20250101", 
            rating: 4.5, 
            memo: "맛있긴한데 너무 비싸요ㅜㅜ",
            mainHashtag: "#존맛",
            hashtags: ["#스페인", "#하몽"], 
            imageUrl: "사진없음"
        },
        {   
            id: 10, 
            reviewId: 2,
            date: "20250101", 
            rating: 3.5, 
            memo: "개존맛임 또가야지~ 근데 너무 비싸ㅜㅜ 돈 많이 벌어야지!",
            mainHashtag: "#존맛",
            hashtags: ["#스페인", "#하몽"], 
            imageUrl: "사진없음"
        },
        {   
            id: 10, 
            reviewId: 3,
            date: "20250101", 
            rating: 2.5, 
            memo: "개존맛임 또가야지~",
            mainHashtag: "#존맛",
            hashtags: ["#스페인", "#하몽"], 
            imageUrl: "사진없음"
        },
        {   
            id: 10, 
            reviewId: 4,
            date: "20250101", 
            rating: 1.5, 
            memo: "개존맛임 또가야지~",
            mainHashtag: "#존맛",
            hashtags: ["#스페인", "#하몽"], 
            imageUrl: "사진없음"
        },
        {   
            id: 10, 
            reviewId: 5,
            date: "20250101", 
            rating: 5, 
            memo: "개존맛임 또가야지~",
            mainHashtag: "#존맛",
            hashtags: ["#스페인", "#하몽"], 
            imageUrl: "사진없음"
        }
    ];

const ReviewList: React.FC = () => {
    const { placeId } = useParams<{ placeId: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const placeNameFromState = location.state?.placeName;

    const [reviews, setReviews] = useState<Review[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get<Review[]>(`/reviews/${placeId}`);
                setReviews(response.data);
            } catch (error) {
                console.error("리뷰 데이터를 불러오는 데 실패했습니다.", error);
                setReviews([]);
            } finally {
                setReviews(mockData);
                setLoading(false);
            }
        };

        if (placeId) {
            fetchReviews();
        }
    }, [placeId]);

    const handleBack = () => navigate(-1);
    const handleWriteReview = () => navigate(`/review/writereview/${placeId}`);
    const handleReviewClick = (review: Review) => {
        navigate(`/review/writereview/${placeId}`, { state: { reviewData: review, placeId: placeId, placeName: placeNameFromState }});
    }

    if (loading) {
        return null;
    }

    const hasReviews = reviews && reviews.length > 0;

    return (
        <ScreenWrapper>
            <Header
                leftNode={<VectorIcon src={vector}></VectorIcon>}
                onLeftClick={handleBack}
            />

            <ContentWrapper>
                {hasReviews && (
                    <>
                        <PlaceHeader>
                            <PlaceName>{placeNameFromState}</PlaceName>
                            {hasReviews && <MainHashtag>{reviews[0].mainHashtag}</MainHashtag>}
                        </PlaceHeader>

                        {hasReviews ? (
                            <ReviewListContainer>
                                {reviews.map(review => (
                                    <ReviewCard key={review.id} onClick={() => handleReviewClick(review)}>
                                        <ReviewImagePlaceholder />
                                        <ReviewContent>
                                            <ReviewDate>{review.date}</ReviewDate>
                                            <StarRating>{renderStars(review.rating)}</StarRating>
                                            <ReviewMemo>{review.memo.length > 10 ? `${review.memo.substring(0, 10)}...` : review.memo}</ReviewMemo>
                                            <HashtagContainer>
                                                {review.hashtags.map(tag => <Hashtag key={tag}>{tag}</Hashtag>)}
                                            </HashtagContainer>
                                        </ReviewContent>
                                    </ReviewCard>
                                ))}
                            </ReviewListContainer>
                        ) : (
                            <NoReviewsMessage>해당 장소의 리뷰가 없습니다</NoReviewsMessage>
                        )}
                    </>
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