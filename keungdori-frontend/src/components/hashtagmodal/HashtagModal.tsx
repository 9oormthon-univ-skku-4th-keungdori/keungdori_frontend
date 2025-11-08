import React, { useState } from 'react';
import { ModalButton, ModalContent, ModalOverlay, PickerWrapper } from './Styles';
import { SwatchesPicker } from 'react-color';
import type { ColorResult } from 'react-color';

interface HashtagModalProps {
    isOpen: boolean;
    onClose: () => void;
    onColorSelect: (bgColor: string) => void;
}

const customColors = [
    ['#F44259','#FF83A8', '#FFA6A7', '#FFE0E0'],
    ['#FF5E2D', '#FF953E', '#FFC639', '#FFF272'],
    ['#57B75B', '#A3E23D', '#8DD7B0', '#D7FF97'],
    ['#14479E', '#B571DB', '#7CD8FF', '#B4D8ED'],
    ['#854343', '#D05953', '#D17619', '#ADADAD']
];

const HashtagModal: React.FC<HashtagModalProps> = ({ isOpen, onClose, onColorSelect }) => {
    const [selectedColor, setSelectedColor] = useState(customColors[0][0]);

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
                        colors={customColors}
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