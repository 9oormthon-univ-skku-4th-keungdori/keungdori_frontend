import styled from '@emotion/styled';

export const SettingScreenWrapper = styled.div`
    width: 100%;
    height: 100%;
    padding: 0 24px;
    position: relative;
    background-color: #FFA6A9;
`;

export const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 18px;
`;

export const VectorIcon = styled.img`
`;

export const HeaderTitle = styled.h3`

`;

export const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-top: calc(96px + env(safe-area-inset-top));
    padding-bottom: 50px;
    flex: 1;
`;

export const MenuGroup = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

export const MenuItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 16px;
    cursor: pointer;
    min-height: 60px;
    box-sizing: border-box;
    border-radius: 20px;

    background-color: white;
    overflow: hidden; 
    
    /* ::after 가상요소의 위치 기준이 되도록 position: relative 추가 */
    position: relative; 

    /* 마지막 자식이 아닐 경우에만 ::after 가상 요소를 생성하여 밑줄을 만듭니다. */
    &:not(:last-child)::after {
        content: ''; /* 가상 요소에는 반드시 content 속성이 필요합니다. */
        position: absolute; /* MenuItem 내부에서 자유롭게 위치를 지정하기 위함 */
        
        bottom: 0; /* 아래쪽에 붙입니다. */
        left: 16px;  /* 왼쪽 여백. padding과 동일하게 주면 텍스트 시작점과 맞춰집니다. */
        right: 16px; /* 오른쪽 여백. */

        height: 2px; /* 밑줄의 두께 */
        background-color: #B8B8B8; /* 밑줄의 색상 */
    }

`;

export const ItemLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

export const MenuIcon = styled.img`
    width: 24px;
    height: 24px;
`;

export const MenuTitle = styled.span`
    font-size: 16px;
    color: #111;
`;

export const ArrowIcon = styled.img`
    width: 10px;
    height: 15px;
`;

export const Badge = styled.span`
    font-size: 16px;
    color: #8c8c8c;
`;