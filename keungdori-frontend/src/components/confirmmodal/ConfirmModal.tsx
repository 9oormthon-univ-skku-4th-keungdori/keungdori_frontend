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
  closeText: string;
  confirmText: string;
}

const ConfirmModal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, text, closeText, confirmText }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop onClick={onClose}>
      {/* 이벤트 버블링 방지 */}
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalText>{text}</ModalText>
        <ButtonWrapper>
          <SecondaryButton onClick={onClose}>{closeText}</SecondaryButton>
          <PrimaryButton onClick={onConfirm}>{confirmText}</PrimaryButton>
        </ButtonWrapper>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default ConfirmModal;