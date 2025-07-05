import React from 'react';
import styled from '@emotion/styled';

export const StyledButton = styled.button`
    width: 100%;
    padding: 16px 0;
    background-color: #FF3662;
    color: #FFFFFF;
    font-size: 20px;
    border: none;
    border-radius: 20px;
    cursor: pointer;

    &:disabled {
        background-color: #000000;
        cursor: not-allowed;
    }
`;

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    type?: 'button' | 'submit';
    disabled?: boolean;
}

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