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

// 기본 버튼 스타일
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

// 취소 버튼
export const SecondaryButton = styled(ModalButton)`
  background-color: #f1f3f5; /* 밝은 회색 계열 */
  color: #555;

  &:hover {
    background-color: #e9ecef;
  }
`;

// 확인(로그아웃) 버튼 (이미지 참고)
export const PrimaryButton = styled(ModalButton)`
  background-color: #FFA6A9; /* 이미지와 유사한 파란색 */
  color: white;

  &:hover {
    background-color: #FFA6A9;
  }
`;