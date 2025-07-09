import React from 'react';
import styled from '@emotion/styled';

//공통 컴포넌트
const StyledHeader = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #FFFFFF;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    padding-top: env(safe-area-inset-top);
    border-bottom: 1px solid #E0E0E0;
`;

const Section = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

//공통 컴포넌트 props
interface HeaderProps {
    leftNode?: React.ReactNode;
    centerNode?: React.ReactNode;
    rightNode?: React.ReactNode;
    onLeftClick?: () => void;
    onRightClick?: () => void;
}

//공통 컴포넌트 생성
const Header: React.FC<HeaderProps> = ({
    leftNode,
    centerNode,
    rightNode,
    onLeftClick,
    onRightClick,
}) => {
    return (
        <StyledHeader>
            <Section onClick={onLeftClick}>{leftNode}</Section>
            <Section>{centerNode}</Section>
            <Section onClick={onRightClick}>{rightNode}</Section>
        </StyledHeader>

    );
};

export default Header;