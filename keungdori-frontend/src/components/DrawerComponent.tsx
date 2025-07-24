import React from 'react';
import { Drawer, Box, IconButton, Typography, List, ListItem, ListItemText, Divider, Toolbar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import keungdori from '../assets/keungdori.png';
import styled from '@emotion/styled';

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
      sx={{ width: 280 }}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <Toolbar>
        <IconButton onClick={handleSettingsClick} sx={{ p: 1 }}>
          <SettingsIconImg src={keungdori} alt="설정" />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }} onClick={handleSettingsClick}>
          설정
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem>
          <Typography variant="h5">킁도리 상태</Typography>
        </ListItem>
        <ListItem>
          <ListItemText primary="상태" secondary="킁도리는 지금 행복합니다!" />
        </ListItem>
        <ListItem>
          <ListItemText primary="배고픔" secondary="50%" />
        </ListItem>
        <ListItem>
          <ListItemText primary="청결도" secondary="80%" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      {drawerContent}
    </Drawer>
  );
};

export default DrawerComponent;