import React from 'react';
import {
  ModalBackdrop,
  ModalContainer,
  ModalText,
  SingleButtonWrapper, // 두 개 버튼 래퍼 대신 새로 만들 래퍼
  AlertButton,         // 두 개 버튼 대신 새로 만들 버튼
} from './Styles';

interface AlertModalProps {
  isOpen: boolean;
  onConfirm: () => void; // onClose와 onConfirm을 하나로 통합
  text: string;
  buttonText: string;   // 버튼 텍스트를 props로 받음
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onConfirm, text, buttonText }) => {
  if (!isOpen) {
    return null;
  }

  // 배경 클릭 시에도 onConfirm이 호출되도록 설정 (혹은 별도 onClose props를 만들어도 좋습니다)
  return (
    <ModalBackdrop onClick={onConfirm}>
      {/* 이벤트 버블링 방지 */}
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalText>{text}</ModalText>
        <SingleButtonWrapper>
          <AlertButton onClick={onConfirm}>{buttonText}</AlertButton>
        </SingleButtonWrapper>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default AlertModal;