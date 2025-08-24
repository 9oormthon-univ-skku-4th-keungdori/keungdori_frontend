import BottomSheetHeader from './BottomSheetHeader';
import { BottomSheetContent, Wrapper } from './Styles';
import { useBottomSheet } from "../../hooks/useBottomSheet";
import Content from "./Content";
import type { InfiniteData } from '@tanstack/react-query';

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

interface BottomSheetProps {
    reviewsData?: InfiniteData<ReviewPage>;
    isFetching: boolean;
    fetchNextPage: () => void;
    hasNextPage: boolean;
}

const BottomSheet = (/*{ reviewsData, isFetching, fetchNextPage, hasNextPage }: BottomSheetProps*/) => {
  const { sheet, content } = useBottomSheet();

  
  return (
    <Wrapper ref={sheet}>
      <BottomSheetHeader />
      <BottomSheetContent ref={content}>
        <Content 
          {/*reviewsData={reviewsData}
          isFetching={isFetching}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}*/}
        />
      </BottomSheetContent>
    </Wrapper>
  )
}

export default BottomSheet;