import React from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, config } from '@react-spring/web';
import { Sheet, Puller, ContentWrapper, SheetHeader } from './Styles';

interface BottomSheetProps {
  children: React.ReactNode;
}

// 움직임 수정 필요! (조금 움직이면 다시 아래로 내려가는데 움직인 만큼 이동하도록 변경)
// 바텀 시트 내부 스크롤 다 되면 바텀 시트가 스크롤 되도록 변경
const BottomSheet: React.FC<BottomSheetProps> = ({ children }) => {
  const openY = window.innerHeight * 0.2;
  const closedY = window.innerHeight - 30;
  const [{ y }, api] = useSpring(() => ({ y: closedY, config: config.gentle, clamp: true}));

  const bind = useDrag(
    ({ last, down, movement: [, my], velocity: [, vy] }) => {
      const currentY = y.get();
      if (down) {
        api.start({ y: currentY + my });
      } else {
        if (vy > 0.5) {
          api.start({ y: closedY });
        } else if (vy < -0.5) {
          api.start({ y: openY });
        } else {
          if (currentY < (openY + closedY) / 2) {
            api.start({ y: openY });
          } else {
            api.start({ y: closedY });
          }
        }
      }
    },
    {
      from: () => [0, y.get()],
      bounds: { top: openY },
      rubberband: true,
    }
  );

  return (
    <Sheet style={{ y }}>
      <SheetHeader {...bind()}>
        <Puller />
      </SheetHeader>
      <ContentWrapper>{children}</ContentWrapper>
    </Sheet>
  );
};

export default BottomSheet;