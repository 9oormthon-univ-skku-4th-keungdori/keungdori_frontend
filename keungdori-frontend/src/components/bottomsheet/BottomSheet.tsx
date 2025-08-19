import BottomSheetHeader from './BottomSheetHeader';
import { BottomSheetContent, Wrapper } from './Styles';
import { useBottomSheet } from "../../hooks/useBottomSheet";
import Content from "./Content";

const BottomSheet = () => {
  const { sheet, content } = useBottomSheet();

  
  return (
    <Wrapper ref={sheet}>
      <BottomSheetHeader />
      <BottomSheetContent ref={content}>
        <Content />
      </BottomSheetContent>
    </Wrapper>
  )
}

export default BottomSheet;