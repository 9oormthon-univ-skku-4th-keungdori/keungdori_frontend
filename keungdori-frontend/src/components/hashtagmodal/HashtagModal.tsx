import React, { useState, useEffect } from 'react';
import { ModalButton, ModalContent, ModalOverlay, PickerWrapper, TagInput } from './Styles';
import { SwatchesPicker } from 'react-color';
import type { ColorResult } from 'react-color';

interface HashtagModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (tag: { text: string; bgColor: string }) => void;
    initialText?: string; // 수정 시 초기 텍스트
}

const colors = [
    '#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#c5cae9', '#bbdefb', '#b3e5fc', '#b2ebf2',
    '#b2dfdb', '#c8e6c9', '#dcedc8', '#f0f4c3', '#fff9c4', '#ffecb3', '#ffe0b2', '#ffccbc',
    '#ef5350', '#ec407a', '#ab47bc', '#7e57c2', '#5c6bc0', '#42a5f5', '#29b6f6', '#26c6da',
    '#26a69a', '#66bb6a', '#9ccc65', '#d4e157', '#ffee58', '#ffca28', '#ffa726', '#ff7043',
];

const HashtagModal: React.FC<HashtagModalProps> = ({ isOpen, onClose, onSave, initialText = '' }) => {
    const [text, setText] = useState(initialText);
    const [selectedColor, setSelectedColor] = useState('#42a5f5');

    useEffect(() => {
        if (isOpen) {
            setText(initialText || '#');
        }
    }, [isOpen, initialText]);

    const handleColorChange = (color: ColorResult) => {
        setSelectedColor(color.hex);
    };

    const handleSave = () => {
        if (text.trim() && text.trim() !== '#') {
            onSave({ text, bgColor: selectedColor });
            onClose();
        }
    };
    
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
            <ModalContent>
                <h3>태그 추가</h3>
                <TagInput value={text} onChange={(e) => setText(e.target.value)} placeholder="#태그를 입력하세요" />
                
                <PickerWrapper>
                    <SwatchesPicker
                        color={selectedColor}
                        onChangeComplete={handleColorChange}
                    />
                </PickerWrapper>

                <ModalButton onClick={handleSave} disabled={!text.trim() || text.trim() === '#'}>
                    확인
                </ModalButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default HashtagModal;