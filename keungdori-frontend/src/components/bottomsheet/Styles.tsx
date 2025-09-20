import styled from "@emotion/styled";
import { BOTTOM_SHEET_HEIGHT } from "./Config";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 100;
  touch-action: none;
  top: 0;
  left: 0;
  right: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.6);
  height: ${BOTTOM_SHEET_HEIGHT}px;
`;

export const BottomSheetContent = styled.div`
  overflow: auto;                            
  -webkit-overflow-scrolling: touch;
`;