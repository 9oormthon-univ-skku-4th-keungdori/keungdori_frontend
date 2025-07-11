import React, { useState } from "react";
import { HomeWrapper, HamburgerIcon, KeungdoriIcon, IconWrapper, MapContainer, SettingsIconImg } from "./Style";
import { Drawer,
    Box,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Toolbar
} from '@mui/material';
import Header from "../../components/Header";
import hamburger from "../../assets/hamburger_icon.png";
import keungdori from "../../assets/keungdori.png";
import KakaoMap from "../../components/KakaoMap";
import BottomSheet from "../../components/bottomsheet/BottomSheet";
import { useNavigate } from "react-router-dom";


const Home: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();

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

    const handleSettingsClick = () => {
        navigate('/settings');
        setIsDrawerOpen(false);
    };

    const drawerContent = (
        <Box
            sx={{ width: 280 }}
            role="presentation"
        >
            <Toolbar>
                <IconButton onClick={handleSettingsClick} sx={{ p: 1 }}>
                    <SettingsIconImg src={keungdori} alt="설정" />
                </IconButton>
                <Typography variant="h6" sx={{ ml: 1 }} onClick={toggleDrawer(false)}>
                    설정
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                <ListItem>
                    <Typography variant="h5" onClick={toggleDrawer(false)}>킁도리 상태</Typography>
                </ListItem>
                <ListItem>
                    <ListItemText primary="상태" secondary="킁도리는 지금 행복합니다!"/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="배고픔" secondary="50%"/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="청결도" secondary="80%"/>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <HomeWrapper>
            <Header leftNode={ //1.화면 너비만큼만 차지하도록 변경해야 함? 웹 화면에서는 header가 커짐!
                <IconWrapper>
                    <HamburgerIcon src={hamburger} onClick={toggleDrawer(true)}></HamburgerIcon>
                    <KeungdoriIcon src={keungdori}></KeungdoriIcon>
                </IconWrapper>}>
            </Header>

            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
            >
                {drawerContent}
            </Drawer>
                    
            <MapContainer>
                <KakaoMap //2.gelocation api로 웹 브라우저 api로 위치 가져올 수 있도록 해야함
                    latitude={initialPosition.latitude}
                    longitude={initialPosition.longitude}
                />
            </MapContainer>

            <BottomSheet>
                {/* 여기에 바텀시트에 들어갈 내용을 작성합니다. */}
                <h2>킁도리 상태</h2>
                <p>킁도리는 지금 행복합니다!</p>
                <p>배고픔: 50%</p>
                <p>청결도: 80%</p>
            </BottomSheet>

           
        </HomeWrapper>
    );



}

export default Home;