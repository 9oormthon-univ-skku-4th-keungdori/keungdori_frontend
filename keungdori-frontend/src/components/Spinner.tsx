import React from 'react';
import styled from '@emotion/styled';

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

// 간단한 CSS 스피너 애니메이션
const StyledSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FFA6A9;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Spinner: React.FC = () => (
  <SpinnerWrapper>
    <StyledSpinner />
  </SpinnerWrapper>
);

export default Spinner;