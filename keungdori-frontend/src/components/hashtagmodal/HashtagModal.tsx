import React, { useState, useEffect } from 'react';
import { ModalButton, ModalContent, ModalOverlay, PickerWrapper, TagInput } from './Styles';
import { SwatchesPicker } from 'react-color';
import type { ColorResult } from 'react-color';

interface HashtagModalProps {
    isOpen: boolean;
    onClose: () => void;
    onColorSelect: (bgColor: string) => void;
}

const HashtagModal: React.FC<HashtagModalProps> = ({ isOpen, onClose, onColorSelect }) => {
    const [selectedColor, setSelectedColor] = useState('#FF769F');

    //색상 변경
    const handleColorChange = (color: ColorResult) => {
        setSelectedColor(color.hex);
    };

    //확인 눌러서 부모에 색상 전달
    const handleSave = () => {
        onColorSelect(selectedColor);
    };
    
    //모달 바깥 누르면 모달 닫힘
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
            <ModalContent>
                <h3>태그 색상 선택</h3>
                
                <PickerWrapper>
                    <SwatchesPicker
                        color={selectedColor}
                        onChangeComplete={handleColorChange}
                    />
                </PickerWrapper>

                <ModalButton onClick={handleSave}>
                    확인
                </ModalButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default HashtagModal;