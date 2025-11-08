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
        background-color: #FFFFFF; 
        font-family: 'Noto Sans KR', sans-serif;
        font-weight: 400;
      }

      #root {
        width: 100%;
        height: 100%;
        background-color: #FFFFFF;
      }
    
      @media (min-width: 500px) {
        #root {
          max-width: 500px; 
          margin: 0 auto;
          overflow-y: auto;
        }
      }

    `}
  />
);

export default GlobalStyles;