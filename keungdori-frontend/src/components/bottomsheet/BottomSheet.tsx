import React from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, config } from '@react-spring/web';
import { Sheet, Puller, ContentWrapper, SheetHeader } from './Styles';

interface BottomSheetProps {
  children: React.ReactNode;
}

// 화면이 위로 갈 수록 y값은 작아짐!
const BottomSheet: React.FC<BottomSheetProps> = ({ children }) => {
  const openY = window.innerHeight * 0.2; // 화면의 80%까지 보이게 함
  const closedY = window.innerHeight - 30; // 시작은 30px만 보이게 함
  //const midY = (openY + closedY) / 2; // 절반만 펼쳐질 수 있도록 함

  const [{ y }, api] = useSpring(() => ({ y: closedY, config: config.gentle, clamp: true }));

  const bind = useDrag(
    ({ down, movement: [, my], velocity: [, /*vy*/] }) => {
      // down : 드래그 중, my : y축으로 움직인 거리, vy : y축으로 움직인 속도
      const currentY = y.get();
      if (down) {
        const newY = currentY + my;
        const clampedY = Math.max(newY, openY); // 최대 높이 이상으로 드래그 되지 않도록 함
        api.start({ y: clampedY });
      } else {
        /*if (vy < -0.6) { // 드래그 속도가 빠르면 전체가 오르내림
          api.start({ y: openY });
        } else if (vy > 0.6) {
          api.start({ y: closedY });
        } else { // 드래그 속도가 느리면 움직인 정도에 따라 다 펼치든지 반만 펼침
          if (currentY < (openY + midY) / 2) {
            api.start({ y: openY });
          } else if (currentY < (midY + closedY) / 2) {
            api.start({ y: midY });
          } else {
            api.start({ y: closedY });
          }
        }*/
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
      <SheetHeader {...bind()} style={{ touchAction: 'none' }}>
        <Puller />
      </SheetHeader>
      <ContentWrapper>{children}</ContentWrapper>
    </Sheet>
  );
};

export default BottomSheet;