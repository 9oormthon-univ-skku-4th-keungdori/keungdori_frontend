import { useEffect } from 'react';
import { type InfiniteData } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer'; // import
import ReviewCard from '../reviewcard/ReviewCard'; // 경로에 맞게 수정
import Spinner from '../Spinner'; // 스피너 컴포넌트
import React from 'react';
import { useNavigate } from 'react-router-dom';

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

interface ReviewPage {
    reviews: Review[];
    nextPage: number | null;
}
/*
interface ContentProps {
    reviewsData?: InfiniteData<ReviewPage>;
    isFetching: boolean;
    fetchNextPage: () => void;
    hasNextPage: boolean;
}*/

const Content = (/*{ reviewsData, isFetching, fetchNextPage, hasNextPage }: ContentProps*/) => {
  /*const navigate = useNavigate();
  
  const { ref, inView } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetching) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetching, fetchNextPage]);

    const handleReviewClick = (review: Review) => {
      navigate(`/review/modifyreview/${review.googleId}`, { state: { reviewData: review }});
    };

    if (isFetching && !reviewsData) {
        return <Spinner />;
    }

    if (!reviewsData || reviewsData.pages.length === 0 || reviewsData.pages[0].reviews.length === 0) {
        return <div>이 지역에 작성된 리뷰가 없습니다.</div>;
    }*/

    return (
        <div>
            {/* useInfiniteQuery의 데이터는 pages 배열에 중첩되어 있습니다.
            {reviewsData.pages.map((page, i) => (
                <React.Fragment key={i}>
                    {page.reviews.map(review => (
                        <ReviewCard 
                            key={review.reviewId} 
                            review={review}
                            onClick={handleReviewClick}
                        />
                    ))}
                </React.Fragment>
            ))}
            
            {hasNextPage && <div ref={ref} style={{ height: '50px' }} />}
            
            {isFetching && hasNextPage && <Spinner />}*/}
        </div>
    );
}

export default Content;