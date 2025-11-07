import React from 'react';
import styled from '@emotion/styled';

//공통 컴포넌트
const StyledButton = styled.button`
    width: 100%;
    padding: 16px 0;
    background-color: #8DD7B0;
    color: #FFFFFF;
    font-size: 20px;
    border: none;
    border-radius: 24px;
    cursor: pointer;

    &:disabled {
        background-color: #000000;
        cursor: not-allowed;
    }
`;

//공통 컴포넌트 props
interface ButtonProps {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    type?: 'button' | 'submit';
    disabled?: boolean;
}

//공통 컴포넌트 생성
const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    ...props
}) => {
    return (
        <StyledButton
            type={type}
            onClick={onClick}
            disabled={disabled}
            {...props}
            >
            {children}
        </StyledButton>
    );
};

export default Button;