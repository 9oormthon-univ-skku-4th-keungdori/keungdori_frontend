import React, { useState } from 'react';
import { SwipeableDrawer } from '@mui/material';
import { Puller, ContentWrapper } from './Styles';

interface BottomSheetProps {
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ children }) => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      // SwipeableDrawer가 화면 밖으로 완전히 사라지는 것을 방지합니다.
      disableSwipeToOpen={false}
      // Paper 컴포넌트에 직접 스타일을 적용하여 둥근 모서리와 초기 높이를 설정합니다.
      hideBackdrop={true}
      ModalProps={{
        keepMounted: true,
      }
      }
      sx={{
        zIndex: 1000,
        pointerEvents: 'none',
      }}
      slotProps={{
        paper: {
          sx: {
            pointerEvents: 'auto',
            /*position: 'absolute',*/
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            height: open ? '75%' : '10%',
            transition: 'height 0.3s ease-out',
          },
        },
      }}
    >
      {/* 바텀시트 손잡이 */}
      <Puller />
      
      {/* 바텀시트 주 내용 */}
      <ContentWrapper>
        {/* children으로 전달된 내용을 여기에 렌더링합니다. */}
        {children}
      </ContentWrapper>
    </SwipeableDrawer>
  );
};

export default BottomSheet;