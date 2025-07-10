import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';

// 바텀시트의 상단 회색 '손잡이' 부분입니다.
export const Puller = styled(Box)(() => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

// 바텀시트 내용이 들어갈 영역입니다.
export const ContentWrapper = styled(Box)(() => ({
    padding: '16px',
    height: '100%',
    overflow: 'auto',
}));