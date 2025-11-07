import BottomSheetHeader from './BottomSheetHeader';
import { BottomSheetContent, Wrapper } from './Styles';
import { useBottomSheet } from "../../hooks/useBottomSheet";
import Content from "./Content";

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


interface BottomSheetProps {
    reviews?: Review[];
    isFetching: boolean;
}

const BottomSheet = ({ reviews, isFetching }: BottomSheetProps) => {
  const { sheet, content } = useBottomSheet();

  
  return (
    <Wrapper ref={sheet}>
      <BottomSheetHeader />
      <BottomSheetContent ref={content}>
        <Content 
          reviews={reviews}
          isFetching={isFetching}
        />
      </BottomSheetContent>
    </Wrapper>
  )
}

export default BottomSheet;