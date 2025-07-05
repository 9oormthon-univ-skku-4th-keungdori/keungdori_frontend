import React from 'react';
import styled from '@emotion/styled';

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
    box-shadow: 0 1xp 2px rgba(0, 0, 0, 0.05);
`;

const Section = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CenterSection = styled(Section)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
`;

interface HeaderProps {
    leftNode?: React.ReactNode;
    centerNode?: React.ReactNode;
    rightNode?: React.ReactNode;
    onLeftClick?: () => void;
    onRightClick?: () => void;
}

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