import React, { useState } from "react";
import { 
    SearchWrapper, 
    ContentWrapper,
    IconWrapper, 
    HamburgerIcon, 
    KeungdoriIcon, 
    SearchInputWrapper, 
    SearchIcon, 
    SearchInput, 
    TabContainer, 
    TabButton,
    ResultsList
} from "./Styles";
import Header from "../../components/Header";
import hamburger from "../../assets/hamburger_icon.png";
import keungdori from "../../assets/keungdori.png";
import searchIcon from "../../assets/search_icon.png"; // 🔍 검색 아이콘 추가*/
import DrawerComponent from "../../components/DrawerComponent";
import { useNavigate } from "react-router-dom";

const Search: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('place');

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
        <SearchWrapper>
            <Header 
                leftNode={
                    <IconWrapper>
                        <HamburgerIcon src={hamburger} onClick={toggleDrawer(true)}/>
                        <KeungdoriIcon src={keungdori} />
                    </IconWrapper>
                }
            />

            <DrawerComponent isOpen={isDrawerOpen} onClose={toggleDrawer(false)}></DrawerComponent>

            <ContentWrapper>

                <SearchInputWrapper>
                    <SearchIcon src={searchIcon} />
                    <SearchInput placeholder="Search" />
                </SearchInputWrapper>

                <TabContainer>
                    <TabButton 
                        isActive={activeTab === 'place'} 
                        onClick={() => setActiveTab('place')}
                    >
                        장소
                    </TabButton>
                    <TabButton 
                        isActive={activeTab === 'visited'} 
                        onClick={() => setActiveTab('visited')}
                    >
                        방문했던 곳
                    </TabButton>
                    <TabButton 
                        isActive={activeTab === 'hashtag'} 
                        onClick={() => setActiveTab('hashtag')}
                    >
                        해시태그
                    </TabButton>
                </TabContainer>

                {activeTab === 'place' && (
                    <>
                        <ResultsList>
                           검색 결과 목록이 여기에 표시됩니다.
                        </ResultsList>
                    </>
                )}

                {activeTab === 'visited' && <ResultsList>방문했던 곳 목록</ResultsList>}
                {activeTab === 'hashtag' && <ResultsList>해시태그 목록</ResultsList>}

            </ContentWrapper>
        </SearchWrapper>
    );
};

export default Search;