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
  date: string;
  rating: number;
  memo: string;
  hashtags: string[];
  imageUrl: string;
}

interface PlaceDetails {
  mainHashtag: string;
  reviews: Review[];
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

const mockData: PlaceDetails = { mainHashtag: "#존맛", 
    reviews: [
        {   
            id: 10, 
            date: "20250101", 
            rating: 4.5, 
            memo: "맛있긴한데 너무 비싸요ㅜㅜ",
            hashtags: ["#스페인", "#하몽"], 
            imageUrl: "사진없음"
        },
        {   
            id: 11, 
            date: "20250101", 
            rating: 3.5, 
            memo: "개존맛임 또가야지~ 근데 너무 비싸ㅜㅜ 돈 많이 벌어야지!",
            hashtags: ["#스페인", "#하몽"], 
            imageUrl: "사진없음"
        },
        {   
            id: 12, 
            date: "20250101", 
            rating: 2.5, 
            memo: "개존맛임 또가야지~",
            hashtags: ["#스페인", "#하몽"], 
            imageUrl: "사진없음"
        },
        {   
            id: 13, 
            date: "20250101", 
            rating: 1.5, 
            memo: "개존맛임 또가야지~",
            hashtags: ["#스페인", "#하몽"], 
            imageUrl: "사진없음"
        },
        {   
            id: 14, 
            date: "20250101", 
            rating: 5, 
            memo: "개존맛임 또가야지~",
            hashtags: ["#스페인", "#하몽"], 
            imageUrl: "사진없음"
        }
    ]
};

const ReviewList: React.FC = () => {
    const { placeId } = useParams<{ placeId: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const placeNameFromState = location.state?.placeName;

    const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get<PlaceDetails>(`/reviews/${placeId}`);
                setPlaceDetails(response.data);
            } catch (error) {
                console.error("리뷰 데이터를 불러오는 데 실패했습니다.", error);
                setPlaceDetails({
                    mainHashtag: "",
                    reviews: []
                });
            } finally {
                setPlaceDetails(mockData);
                setLoading(false);
            }
        };

        if (placeId) {
            fetchReviews();
        }
    }, [placeId]);

    const handleBack = () => navigate(-1);
    const handleWriteReview = () => navigate(`/review/writereview/${placeId}`);

    if (loading) {
        return null;
    }

    const hasReviews = placeDetails && placeDetails.reviews.length > 0;

    return (
        <ScreenWrapper>
            <Header
                leftNode={<VectorIcon src={vector}></VectorIcon>}
                onLeftClick={handleBack}
            />

            <ContentWrapper>
                {placeDetails && (
                    <>
                        <PlaceHeader>
                            <PlaceName>{placeNameFromState}</PlaceName>
                            {hasReviews && <MainHashtag>{placeDetails.mainHashtag}</MainHashtag>}
                        </PlaceHeader>

                        {hasReviews ? (
                            <ReviewListContainer>
                                {placeDetails.reviews.map(review => (
                                    <ReviewCard key={review.id}>
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