import styled from '@emotion/styled';
import { animated } from '@react-spring/web';

export const SheetHeader = styled.div`
  height: 40px;
  position: relative;
  cursor: grab;
`;

export const Puller = styled.div`
  width: 30px;
  height: 6px;
  background-color: #e0e0e0; 
  border-radius: 3px;
  position: absolute;
  top: 8px;
  left: calc(50% - 15px);
`;

export const ContentWrapper = styled.div`
  padding: 0 16px 16px;
  flex-grow: 1;
  overflow: auto;
`;

export const Sheet = styled(animated.div)`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 100vh;
  z-index: 1000;
  background-color: #FFA6A9;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  touch-action: none;
  display: flex;
  flex-direction: column;
`;