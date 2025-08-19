import { useEffect, useRef } from "react";
import { MAX_Y, MIN_Y } from "../components/bottomsheet/Config";

interface BottomSheetMetrics {
  touchStart: {
    sheetY: number;
    touchY: number;
  };
  touchMove: {
    prevTouchY?: number;
    movingDirection: "none" | "down" | "up";
  };
  isContentAreaTouched: boolean;
}

export function useBottomSheet() {
  const sheet = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  const metrics = useRef<BottomSheetMetrics>({
    touchStart: { sheetY: 0, touchY: 0 },
    touchMove: { prevTouchY: 0, movingDirection: "none" },
    isContentAreaTouched: false,
  });

  useEffect(() => {
    const sheetElement = sheet.current;
    if (!sheetElement) return;

    // 🎯 1. 초기 위치를 닫힌 상태(MAX_Y)로 명확하게 설정합니다.
    sheetElement.style.transform = `translateY(${MAX_Y}px)`;

    const handleTouchStart = (e: TouchEvent) => {
        
      const { touchStart } = metrics.current;
      touchStart.sheetY = sheetElement.getBoundingClientRect().y;
      touchStart.touchY = e.touches[0].clientY;

      // 🎯 2. 드래그 시작 시 부드러운 애니메이션 효과를 잠시 제거합니다.
      sheetElement.style.transition = 'none';
    };

    const handleTouchMove = (e: TouchEvent) => {
      const { touchStart, touchMove } = metrics.current;
      const currentTouch = e.touches[0];

      if (touchMove.prevTouchY === undefined) {
        touchMove.prevTouchY = touchStart.touchY;
      }
      if (touchMove.prevTouchY < currentTouch.clientY) {
        touchMove.movingDirection = 'down';
      }
      if (touchMove.prevTouchY > currentTouch.clientY) {
        touchMove.movingDirection = 'up';
      }

      const touchOffset = currentTouch.clientY - touchStart.touchY;
      let nextSheetY = touchStart.sheetY + touchOffset;

      if (nextSheetY <= MIN_Y) nextSheetY = MIN_Y;
      if (nextSheetY >= MAX_Y) nextSheetY = MAX_Y;

      // 🎯 3. [가장 중요] 계산된 절대 Y 좌표를 바로 transform에 적용합니다.
      sheetElement.style.transform = `translateY(${nextSheetY}px)`;
    };

    const handleTouchEnd = () => {
      const currentSheetY = sheetElement.getBoundingClientRect().y;

      // 🎯 4. 드래그 종료 시 부드러운 애니메이션 효과를 다시 적용합니다.
      sheetElement.style.transition = 'transform 300ms ease-out';

      // 🎯 5. 최종 위치를 기준으로 열지 닫을지 결정합니다.
      const middlePoint = (MIN_Y + MAX_Y) / 2;
      if (currentSheetY < middlePoint) {
        // 열기 (MIN_Y 위치로 이동)
        sheetElement.style.transform = `translateY(${MIN_Y}px)`;
      } else {
        // 닫기 (MAX_Y 위치로 이동)
        sheetElement.style.transform = `translateY(${MAX_Y}px)`;
      }

      // metrics 초기화
      metrics.current = {
        touchStart: { sheetY: 0, touchY: 0 },
        touchMove: { prevTouchY: 0, movingDirection: "none" },
        isContentAreaTouched: false,
      };
    };

    sheetElement.addEventListener('touchstart', handleTouchStart);
    sheetElement.addEventListener('touchmove', handleTouchMove);
    sheetElement.addEventListener('touchend', handleTouchEnd);

    // 컴포넌트가 사라질 때 이벤트 리스너를 꼭 제거해야 합니다. (메모리 누수 방지)
    return () => {
      sheetElement.removeEventListener('touchstart', handleTouchStart);
      sheetElement.removeEventListener('touchmove', handleTouchMove);
      sheetElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // content 영역 터치 로직은 기존과 동일하게 사용합니다.
  useEffect(() => {
    const contentElement = content.current;
    if (!contentElement) return;
    const handleTouchStart = () => {
      metrics.current.isContentAreaTouched = true;
    };
    contentElement.addEventListener('touchstart', handleTouchStart);
    return () => contentElement.removeEventListener('touchstart', handleTouchStart);
  }, []);

  return { sheet, content };
}