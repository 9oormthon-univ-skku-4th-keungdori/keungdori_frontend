import styled from '@emotion/styled';

export const ModalOverlay = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  display: flex;
  text-align: center;
  flex-direction: column;
  gap: 20px;
`;

export const TagInput = styled.input`
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 16px;
  text-align: center;
  background-color: #f0f0f0;

  &:focus {
      outline: none;
      border-color: #ff467dff;
  }
`;

export const PickerWrapper = styled.div`
    .swatches-picker {
        width: 100% !important;
        box-shadow: none !important;
    }
`;


export const ModalButton = styled.button`
    padding: 14px;
    border-radius: 12px;
    border: none;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    background-color: #FF769F;
    color: white;
    
    &:disabled {
      background-color: #ccc;
    }
`;