import PlaceCard from '../placecard/PlaceCard'; // 경로에 맞게 수정
import Spinner from '../Spinner'; // 스피너 컴포넌트
//import { useNavigate } from 'react-router-dom';

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

interface ContentProps {
    reviews?: Review[];
    isFetching: boolean;
}

const Content = ({ reviews, isFetching }: ContentProps) => {
    //const navigate = useNavigate();
  

    /*
    const handleReviewClick = (review: Review) => {
      navigate(`/review/modifyreview/${review.googleId}`, { state: { reviewData: review }});
    };*/

    if (isFetching && !reviews) {
        return <Spinner />;
    }

    if (!reviews|| reviews.length === 0 ) {
        return <div>근처에 리뷰를 작성한 장소가 없어요!</div>;
    }

    return (
        <div>
            {reviews.map(review => (
                <PlaceCard 
                    key={review.placeName} // (placeName이 고유하지 않다면 review.address 등을 조합해 더 고유한 key를 만드는 것이 좋습니다)
                    place={review}
                />
            ))}
        </div>
    );
}

export default Content;