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

export const ResultsList = styled.div`
    padding-top: 16px;
    color: #BDBDBD;
    text-align: center;
`;