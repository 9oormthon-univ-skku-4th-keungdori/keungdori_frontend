import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html, body {
        width: 100%;
        height: 100%;
        background-color: #f0f2f5; 
        font-family: 'Noto Sans KR', sans-serif;
        font-weight: 400;
      }

      #root {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
      }
    
      @media (min-width: 500px) {
        #root {
          /* 최대 너비를 지정해 더 이상 늘어나지 않도록 함 */
          max-width: 500px; 
          
          /* margin: auto를 이용해 화면 중앙에 배치 */
          margin: 0 auto;
          
          /* #root 내부에서만 스크롤이 가능하도록 설정 */
          overflow-y: auto;
        }
      }

    `}
  />
);

export default GlobalStyles;