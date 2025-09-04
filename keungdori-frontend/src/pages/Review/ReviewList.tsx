import '@smastrom/react-rating/style.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/Header';
import Button from '../../components/Button';
import api from '../../api/api';
import { ScreenWrapper, ContentWrapper, MainHashtag, NoReviewsMessage, PlaceHeader, PlaceName, ReviewListContainer, ButtonWrapper, VectorIcon } from './Styles';
import ReviewCard from '../../components/reviewcard/ReviewCard';
import vector from '../../assets/vector.png';

interface Review {
    name: number; // 구글 장소 이름
    address: string; // 구글 장소 주소
    googleId: string; // 구글 장소 id
    xCoordinate: number; //장소 위도
    yCoordinate: number; //장소 경도
    reviewId: number; //리뷰 id
    date: string; //리뷰 작성한 날짜
    rating: number; //별점
    mainTag: string; //메인태그
    subTags: string[]; //서브태그
    imageUrl?: string; //이미지경로(supabase)
    memo: string; //메모
}

const fetchReviewsByPlaceId = async (placeId: string): Promise<Review[]> => { //해당 장소의 리뷰들 받아옴
    const { data } = await api.get<Review[]>(`/reviews/place/${placeId}`);
    return data;
}

const ReviewList: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    //const { placeId } = useParams<{ placeId: string }>(); //검색에서 url에 담아 넘겨주는 카카오 장소 id
    const placeId = location.state.placeId;
    const placeName = location.state.placeName; //검색에서 장소 이름을 state에 담아서 넘겨준거
    const placeAddress = location.state.placeAddress;
    const placeX = location.state.longitude; //장소의 위도, 경도
    const placeY = location.state.latitude;

    const handleBack = () => navigate(-1);
    const handleWriteReview = () => navigate(`/review/writereview/${placeId}`,
        { state: { x: placeX, y: placeY, placeId: placeId, placeName: placeName, placeAddress: placeAddress }}); //1. 처음 리뷰 작성하는 화면이랑, 리뷰 보는 화면 분리
    const handleReviewClick = (review: Review) => {
        navigate(`/review/modifyreview/${placeId}`, { state: { reviewData: review }});
    }

    //UseInfiniteQuery로 교체해서 무한 스크롤해서 계속 데이터를 볼 수 있게 해야됨(페이지 단위)
    const { data: reviews, /*isPending, isError, error*/ } = useQuery<Review[], Error> ({
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
                    {hasReviews && <MainHashtag>{reviews[0].mainTag}</MainHashtag>}
                </PlaceHeader>

                {hasReviews ? (
                    <ReviewListContainer>
                        {reviews.map(review => (
                            <ReviewCard 
                                key={review.reviewId}
                                review={review} 
                                onClick={handleReviewClick} 
                            />
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