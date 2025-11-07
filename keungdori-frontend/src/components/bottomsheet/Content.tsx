import { useEffect } from 'react';
import { type InfiniteData } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer'; // import
import PlaceCard from '../placecard/PlaceCard'; // 경로에 맞게 수정
import Spinner from '../Spinner'; // 스피너 컴포넌트
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Tag {
    hashtag: string;
    backgroundColor: string;
    fontColor: string;
}

interface Review {
    mainTag: Tag; // string -> Tag
    subTags: Tag[]; // string[] -> Tag[]
    placeName: string; 
    address: string;
    xcoordinate: number;
    ycoordinate: number;
    distance: number;
}

interface ReviewPage {
    places: Review[];
    nextPage: number | null;
}

interface ContentProps {
    reviewsData?: InfiniteData<ReviewPage>;
    isFetching: boolean;
    fetchNextPage: () => void;
    hasNextPage: boolean;
}

const Content = ({ reviewsData, isFetching, fetchNextPage, hasNextPage }: ContentProps) => {
  //const navigate = useNavigate();
  
  const { ref, inView } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetching) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetching, fetchNextPage]);

    /*
    const handleReviewClick = (review: Review) => {
      navigate(`/review/modifyreview/${review.googleId}`, { state: { reviewData: review }});
    };*/

    if (isFetching && !reviewsData) {
        return <Spinner />;
    }

    if (!reviewsData || reviewsData.pages.length === 0 || reviewsData.pages[0].places.length === 0) {
        return <div>이 지역에 작성된 리뷰가 없습니다.</div>;
    }

    return (
        <div>
            {/* useInfiniteQuery의 데이터는 pages 배열에 중첩되어 있습니다.*/}
            {reviewsData.pages.map((page, i) => (
                <React.Fragment key={i}>
                    {page.places.map(review => (
                        <PlaceCard 
                            key={review.placeName} 
                            place={review}
                            //onClick={...}
                        />
                    ))}
                </React.Fragment>
            ))}
            
            {hasNextPage && <div ref={ref} style={{ height: '50px' }} />}
            
            {isFetching && hasNextPage && <Spinner />}
        </div>
    );
}

export default Content;