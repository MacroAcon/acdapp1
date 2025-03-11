import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Switch,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  BarChart as BarChartIcon,
  CloudUpload as CloudUploadIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
  SmartToy as SmartToyIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useUI } from '../../contexts/UIContext';

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAgentMode, toggleAgentMode } = useUI();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { text: 'Upload Data', icon: <CloudUploadIcon />, path: '/upload' },
    { text: 'Analysis', icon: <BarChartIcon />, path: '/analysis' },
    { text: 'Token Usage', icon: <TimelineIcon />, path: '/usage' },
    { text: 'About Me', icon: <PersonIcon />, path: '/about' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <div>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '1px solid rgba(0, 255, 178, 0.1)',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(8, 12, 20, 0.95) 100%)',
      }}>
        <Typography variant="h6" sx={{ 
          background: 'linear-gradient(135deg, #00FFB2 0%, #00CC8E 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
        }}>
          AI Analytics
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setIsMobileMenuOpen(false);
            }}
            selected={location.pathname === item.path}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 2,
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, rgba(0, 255, 178, 0.1) 0%, rgba(0, 204, 142, 0.1) 100%)',
                borderLeft: '3px solid #00FFB2',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(0, 255, 178, 0.15) 0%, rgba(0, 204, 142, 0.15) 100%)',
                },
              },
              '&:hover': {
                background: 'rgba(0, 255, 178, 0.05)',
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? '#00FFB2' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(8, 12, 20, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 255, 178, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleMobileMenu}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Dashboard
            </Typography>
          </Box>
          <Tooltip title={isAgentMode ? "Switch to Human Mode" : "Switch to Agent Mode"}>
            <FormControlLabel
              control={
                <Switch
                  checked={isAgentMode}
                  onChange={toggleAgentMode}
                  icon={<SmartToyIcon sx={{ fontSize: 16 }} />}
                  checkedIcon={<SmartToyIcon sx={{ fontSize: 16, color: '#00FFB2' }} />}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#00FFB2',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 178, 0.08)',
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'rgba(0, 255, 178, 0.5)',
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SmartToyIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">Agent Mode</Typography>
                </Box>
              }
            />
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={isMobileMenuOpen}
          onClose={toggleMobileMenu}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(8, 12, 20, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              borderRight: '1px solid rgba(0, 255, 178, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(8, 12, 20, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              borderRight: '1px solid rgba(0, 255, 178, 0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          background: 'linear-gradient(135deg, #080C14 0%, #111827 100%)',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  );
};

export default Layout; 