import React, { useState } from "react";
import { HomeWrapper, HamburgerIcon, KeungdoriIcon, IconWrapper, MapContainer, SearchWrapper, SearchIcon, SearchInput } from "./Style";
import Header from "../../components/Header";
import hamburger from "../../assets/hamburger_icon.png";
import keungdori from "../../assets/keungdori.png";
import searchIcon from "../../assets/search_icon.png";
import KakaoMap from "../../components/KakaoMap";
import BottomSheet from "../../components/bottomsheet/BottomSheet";
import { useNavigate } from "react-router-dom";
import DrawerComponent from "../../components/DrawerComponent";


const Home: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearchClick = () => {
        navigate('/search');
    };

    const initialPosition = {
        latitude: 37.588100,
        longitude: 126.992831,
    };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setIsDrawerOpen(open);
    };

    return (
        <HomeWrapper>
            <Header leftNode={
                <IconWrapper>
                    <HamburgerIcon src={hamburger} onClick={toggleDrawer(true)}></HamburgerIcon>
                    <KeungdoriIcon src={keungdori}></KeungdoriIcon>
                </IconWrapper>}>
            </Header>

            <DrawerComponent isOpen={isDrawerOpen} onClose={toggleDrawer(false)}></DrawerComponent>

            <SearchWrapper>
                <SearchIcon src={searchIcon} alt="search icon" />
                <SearchInput
                    placeholder="Search"
                    onClick={handleSearchClick}
                    readOnly // 사용자 입력 방지
                />
            </SearchWrapper>
                    
            <MapContainer>
                <KakaoMap // 1. gelocation api로 웹 브라우저 api로 위치 가져올 수 있도록 해야함
                    latitude={initialPosition.latitude}
                    longitude={initialPosition.longitude}
                />
            </MapContainer>

            <BottomSheet>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
                <p>아니 시트가 왜 안 보이는거야!!!!!</p>
            </BottomSheet>

           
        </HomeWrapper>
    );



}

export default Home;