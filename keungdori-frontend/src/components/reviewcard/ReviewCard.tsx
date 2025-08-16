import React from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { 
    CardContainer, 
    ReviewImagePlaceholder, 
    ReviewContent, 
    ReviewDate, 
    StarRating, 
    ReviewMemo, 
    HashtagContainer 
} from './Styles';
import Hashtag from '../Hashtag';

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

interface ReviewCardProps {
    review: Review;
    onClick: (review: Review) => void;
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

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onClick }) => {
    return (
        <CardContainer onClick={() => onClick(review)}>
            {/* 이미지가 있다면 ReviewImagePlaceholder 대신 img 태그를 사용하도록 수정할 수 있습니다. */}
            <ReviewImagePlaceholder />
            <ReviewContent>
                <ReviewDate>{review.date}</ReviewDate>
                <StarRating>{renderStars(review.rating)}</StarRating>
                {/* 메모가 10자 이상일 경우 ...으로 표시 */}
                <ReviewMemo>
                    {review.memo.length > 10 
                        ? `${review.memo.substring(0, 10)}...` 
                        : review.memo}
                </ReviewMemo>
                <HashtagContainer>
                    {review.subtags.map(tag => <Hashtag key={tag}>{tag}</Hashtag>)}
                </HashtagContainer>
            </ReviewContent>
        </CardContainer>
    );
};

export default ReviewCard;