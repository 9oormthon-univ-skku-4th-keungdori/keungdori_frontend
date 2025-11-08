import React from 'react';
import { Drawer, Box, IconButton, Typography, Divider, Toolbar, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import settings from '../assets/settings.png';
import styled from '@emotion/styled';
import keungdoriCharacter from '../assets/keungdori_character.png';

const SettingsIconImg = styled.img`
    width: 24px;
    height: 24px;
`;

interface DrawerComponentProps {
  isOpen: boolean;
  onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const DrawerComponent: React.FC<DrawerComponentProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSettingsClick = () => {
    navigate('/settings', { state: { from: location.pathname } });
  };

  const drawerContent = (
    <Box
      sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}
      role="presentation"
    >
      {/* 기존 설정 버튼 (상단 툴바) */}
      <Toolbar>
        <IconButton onClick={handleSettingsClick} sx={{ p: 1 }}>
          <SettingsIconImg src={settings} alt="설정" />
        </IconButton>
      </Toolbar>
      <Divider />

      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: '#A9E6C2', // 이미지와 유사한 연두색 배경
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          overflowY: 'auto',
        }}
        onClick={onClose} // 이 영역을 클릭해도 닫히도록
        onKeyDown={onClose}
      >

        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '20px',
            mb: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            width: '100%', // 너비를 꽉 채움
          }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
            킁킁..! 맛있는 냄새가 나!
          </Typography>
        </Box>

        <Box
          component="img"
          src={keungdoriCharacter}
          alt="킁도리 캐릭터"
          sx={{
            width: '180px',
            height: '180px',
            objectFit: 'contain',
            mb: 3,
          }}
        />

        <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', mb: 1, color: '#333' }}>
          킁도리가 당신을 1일째 기다리고 있었어요!
        </Typography>

      </Box>

      <Box
        sx={{
          padding: '16px',
          backgroundColor: 'white',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', // 상단 영역과 구분선
        }}
      >
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#FF83A8', // 이미지와 유사한 핑크색
            color: 'white',
            borderRadius: '16px',
            padding: '12px',
            fontSize: '1rem',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#FF83A8',
            },
          }}
          onClick={(event) => { 
            console.log("킁도리 옷 입혀주기 클릭!");
            onClose(event); 
          }}
        >
          킁도리 옷 입혀주기
        </Button>
      </Box>
    </Box>
  );

  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      {drawerContent}
    </Drawer>
  );
};

export default DrawerComponent;