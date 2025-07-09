import React from "react";
import { HomeWrapper, HamburgerIcon, KeungdoriIcon, IconWrapper, MapContainer } from "./Style";
import Header from "../../components/Header";
import hamburger from "../../assets/hamburger_icon.png";
import keungdori from "../../assets/keungdori.png";
import KakaoMap from "../../components/KakaoMap";

const Home: React.FC = () => {

    

    const handleOnClick = () => {
        // 클릭하면 킁도리 상태 확인 drawer 나옴
    }

    const initialPosition = {
        latitude: 37.588100,
        longitude: 126.992831,
    };

    return (
        <HomeWrapper>
            <Header leftNode={
                <IconWrapper>
                <HamburgerIcon src={hamburger} onClick={handleOnClick}></HamburgerIcon>
                <KeungdoriIcon src={keungdori}></KeungdoriIcon>
                </IconWrapper>}>
            </Header>
            
            <MapContainer>
                <KakaoMap
                    latitude={initialPosition.latitude}
                    longitude={initialPosition.longitude}
                />
            </MapContainer>

        </HomeWrapper>
    );



}

export default Home;