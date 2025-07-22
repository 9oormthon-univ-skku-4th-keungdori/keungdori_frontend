import React from 'react';
import {
  ModalBackdrop,
  ModalContainer,
  ModalText,
  ButtonWrapper,
  PrimaryButton,
  SecondaryButton,
} from './Styles';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  text: string;
}

const LogoutModal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, text }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop onClick={onClose}>
      {/* 이벤트 버블링 방지 */}
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalText>{text}</ModalText>
        <ButtonWrapper>
          <SecondaryButton onClick={onClose}>취소</SecondaryButton>
          <PrimaryButton onClick={onConfirm}>로그아웃</PrimaryButton>
        </ButtonWrapper>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default LogoutModal;