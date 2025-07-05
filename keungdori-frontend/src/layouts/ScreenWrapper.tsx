import React from 'react';
import styled from '@emotion/styled';

//화면 구성을 담당하는 공통 컴포넌트 레이아웃
const StyledWrapper = styled.div`
    width: 100%;
    min-height: 100vh;
    padding: 40px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
`;

interface ScreenWrapperProps {
    children: React.ReactNode;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
    return <StyledWrapper>{children}</StyledWrapper>
}

export default ScreenWrapper;