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