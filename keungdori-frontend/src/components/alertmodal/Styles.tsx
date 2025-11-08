import styled from '@emotion/styled';

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  width: 85%;
  max-width: 320px;
  padding: 32px 24px 24px 24px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

export const ModalText = styled.p`
  font-size: 18px;
  color: #333;
  text-align: center;
  margin: 0;
  margin-bottom: 24px;
  line-height: 1.5;
  font-weight: 500;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 12px;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 14px 20px;
  border-radius: 25px; /* 충분히 둥글게 */
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
`;

export const PrimaryButton = styled(ModalButton)`
  background-color: #FFA6A9; /* 이미지와 유사한 파란색 */
  color: white;

  &:hover {
    background-color: #FFA6A9;
  }
`;

// 단일 버튼을 가운데 정렬하기 위한 래퍼
export const SingleButtonWrapper = styled.div`
  display: flex;
  justify-content: center; /* 버튼을 수평 중앙에 위치시킴 */
  width: 100%;
`;

// 단일 버튼 스타일
export const AlertButton = styled(PrimaryButton)`
  flex: 0 1 auto; /* flex: 1 속성을 해제하여 버튼이 꽉 차지 않도록 함 */
  padding: 14px 40px; /* 좌우 패딩을 늘려 버튼 모양을 예쁘게 만듦 */
`;

