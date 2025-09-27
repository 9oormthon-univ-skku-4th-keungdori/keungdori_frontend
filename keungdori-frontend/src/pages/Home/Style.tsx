import styled from "@emotion/styled";

export const HomeWrapper = styled.div`
    width: 100%;
    height: 100%;
    padding-top: 56px;
    overflow: hidden;
    position: relative;
`;

export const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 18px;
`;
export const SettingsIconImg = styled.img`
    width: 24px;
    height: 24px;
`;

export const HamburgerIcon = styled.img`
`;

export const KeungdoriIcon = styled.img`
`;

export const SearchWrapper = styled.div`
    position: absolute;
    top: 70px;
    left: 16px;
    right: 16px;
    z-index: 10;
    display: flex;
    align-items: center;
    background-color: white;
    padding: 8px 16px;
    border-radius: 24px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

export const SearchIcon = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 8px;
`;

export const SearchInput = styled.input`
    flex-grow: 1;
    border: none;
    outline: none;
    font-size: 16px;
    background-color: transparent;
    cursor: pointer;
    &::placeholder {
        color: #aaa;
    }
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;