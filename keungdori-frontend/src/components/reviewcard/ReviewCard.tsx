import React from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { 
    CardContainer, 
    ReviewImage, 
    ReviewContent, 
    ReviewDate, 
    StarRating, 
    ReviewMemo, 
    HashtagContainer 
} from './Styles';
import RdOnlyHashtag from '../RdOnlyHashtag';

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
            <ReviewImage src={review.imageUrl}/>
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
                    {review.subTags.map(tag => 
                    <RdOnlyHashtag key={tag.hashtag} hashtag={tag.hashtag} backgroundColor={tag.backgroundColor} fontColor={tag.fontColor}/>)}
                </HashtagContainer>
            </ReviewContent>
        </CardContainer>
    );
};

export default ReviewCard;