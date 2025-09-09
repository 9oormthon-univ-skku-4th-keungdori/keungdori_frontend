import BottomSheetHeader from './BottomSheetHeader';
import { BottomSheetContent, Wrapper } from './Styles';
import { useBottomSheet } from "../../hooks/useBottomSheet";
import Content from "./Content";
import type { InfiniteData } from '@tanstack/react-query';

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
    name: string; 
    address: string;
    googleId: string;
    xCoordinate: number;
    yCoordinate: number;
    date: string;
    imageUrl: string;
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

const BottomSheet = ({ reviewsData, isFetching, fetchNextPage, hasNextPage }: BottomSheetProps) => {
  const { sheet, content } = useBottomSheet();

  
  return (
    <Wrapper ref={sheet}>
      <BottomSheetHeader />
      <BottomSheetContent ref={content}>
        <Content 
          reviewsData={reviewsData}
          isFetching={isFetching}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
        />
      </BottomSheetContent>
    </Wrapper>
  )
}

export default BottomSheet;