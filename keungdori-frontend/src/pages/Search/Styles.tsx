import styled from "@emotion/styled";

export const SearchWrapper = styled.div`
    width: 100%;
    height: 100%;
`;

export const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 18px;
`;

export const HamburgerIcon = styled.img`
`;

export const KeungdoriIcon = styled.img`
`;

export const ContentWrapper = styled.div`
    padding-top: 64px;
`;

export const SearchInputWrapper = styled.div`
    display: flex; 
    align-items: center; 
    margin: 6px 16px;
    padding: 8px 16px; 
    background-color: white; 
    border-radius: 24px; 
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); 
    transition: box-shadow 0.2s ease-in-out; 

    &:focus-within {
        box-shadow: 0 0 0 3px rgba(255, 166, 169, 0.5);
    }
`;

export const SearchInput = styled.input`
    flex-grow: 1; 
    border: none; 
    outline: none; 
    font-size: 16px;
    background-color: transparent; 

    &::placeholder {
        color: #BDBDBD;
    }

`;

export const SearchIcon = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 8px;
`;

export const TabContainer = styled.div`
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #E0E0E0;
`;

export const TabButton = styled.button<{ isActive: boolean }>`
    flex: 1;
    padding: 12px 12px;
    font-size: 16px;
    font-weight: ${props => props.isActive ? 'bold' : 'normal'};
    color: ${props => props.isActive ? '#333333' : '#828282'};
    background: none;
    border: none;
    border-bottom: ${props => props.isActive ? '2px solid #FFA6A9' : 'none'};
    cursor: pointer;
`;

export const Message = styled.div`
    padding-top: 16px;
    text-align: center;
    color: #828282;
`;

export const ResultsList = styled.div`
    color: #333; // 기본 텍스트 색상 변경
    text-align: left; // 텍스트 정렬 변경
    margin: 0 16px;
`;

export const SearchResultItem = styled.div`
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    padding: 12px 8px;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;

    &:hover {
        background-color: #f5f5f5;
    }
`;

export const PlaceInfo = styled.div`
    h4 {
        margin: 0 0 4px;
        font-size: 16px;
        font-weight: bold;
    }

    p {
        margin: 0;
        font-size: 14px;
        color: #828282;
    }
`;

export const Distance = styled.p`
    font-size: 12px !important; // !important로 기존 p 태그 스타일 덮어쓰기
    color: #b0b0b0 !important;
    margin-top: 4px !important;
`;

export const ReviewButton = styled.button`
    padding: 6px 12px;
    font-size: 14px;
    font-weight: bold;
    color: #FFA6A9;
    background-color: #fff;
    border: 1px solid #FFA6A9;
    border-radius: 20px;
    cursor: pointer;
    white-space: nowrap; // 버튼 텍스트가 줄바꿈되지 않도록 설정

    &:hover {
        background-color: #FFF0F1;
    }
`;