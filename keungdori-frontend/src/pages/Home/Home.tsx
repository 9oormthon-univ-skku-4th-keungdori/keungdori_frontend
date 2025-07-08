import React from "react";
import { HomeWrapper, HamburgerIcon, KeungdoriIcon, IconWrapper } from "./Style";
import Header from "../../components/Header";
import hamburger from "../../assets/hamburger_icon.png"
import keungdori from "../../assets/keungdori.png"

const Home: React.FC = () => {

    

    const handleOnClick = () => {
        // 클릭하면 킁도리 상태 확인 drawer 나옴
    }

    return (
        <HomeWrapper>
            <Header leftNode={
                <IconWrapper>
                <HamburgerIcon src={hamburger} onClick={handleOnClick}></HamburgerIcon>
                <KeungdoriIcon src={keungdori}></KeungdoriIcon>
                </IconWrapper>}>
            </Header>
            여기 카카오 지도랑 bottom sheet 넣을거야! 


        </HomeWrapper>
    );



}

export default Home;