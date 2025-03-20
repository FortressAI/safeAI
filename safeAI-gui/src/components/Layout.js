import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SecurityIcon from '@mui/icons-material/Security';
import SchemaIcon from '@mui/icons-material/Schema';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockIcon from '@mui/icons-material/Lock';
import CodeIcon from '@mui/icons-material/Code';
import TerminalIcon from '@mui/icons-material/Terminal';

// Drawer width
const drawerWidth = 260;

function Layout() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  
  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
  
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  // Navigation items with enhanced icons
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <DashboardIcon />,
      description: 'System overview & monitoring'
    },
    { 
      name: 'Agents', 
      path: '/agents', 
      icon: <SmartToyIcon />,
      description: 'Browse and manage agents'
    },
    { 
      name: 'Agent Workshop', 
      path: '/agent-workshop', 
      icon: <AddCircleOutlineIcon />,
      description: 'Create new intelligent agents'
    },
    { 
      name: 'Security Center', 
      path: '/security', 
      icon: <SecurityIcon />,
      description: 'Security monitoring & compliance'
    },
    { 
      name: 'Knowledge Graphs', 
      path: '/knowledge-graphs', 
      icon: <SchemaIcon />,
      description: 'Manage knowledge graphs'
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <SettingsIcon />,
      description: 'Configure system settings'
    },
  ];
  
  // Sample notifications with enhanced details
  const notifications = [
    { 
      id: 1, 
      text: 'Security validation completed', 
      read: false,
      icon: <SecurityIcon fontSize="small" color="success" />,
      time: '10 min ago'
    },
    { 
      id: 2, 
      text: 'New agent SecurityAnalyzer created', 
      read: false,
      icon: <SmartToyIcon fontSize="small" color="primary" />,
      time: '1 hour ago' 
    },
    { 
      id: 3, 
      text: 'CyberSecurity_KG updated', 
      read: true,
      icon: <SchemaIcon fontSize="small" />,
      time: '3 hours ago'
    },
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
        elevation={0}
      >
        <Toolbar sx={{ 
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.07)}`,
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 2,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                backgroundImage: 'linear-gradient(45deg, #4caf50, #2e7d32)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                mr: 1
              }}
            >
              SafeAI
            </Box>
            <Chip 
              label="MANAGEMENT CONSOLE" 
              size="small" 
              sx={{ 
                height: 20, 
                fontSize: '0.65rem', 
                fontWeight: 600,
                letterSpacing: '0.5px',
                color: alpha(theme.palette.common.white, 0.7),
                bgcolor: alpha(theme.palette.common.white, 0.05),
                border: '1px solid ' + alpha(theme.palette.common.white, 0.1),
              }} 
            />
          </Typography>
          
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit"
              onClick={handleNotificationsOpen}
              sx={{ 
                mx: 0.5,
                position: 'relative',
                '&::after': unreadCount > 0 ? {
                  content: '""',
                  position: 'absolute',
                  width: 6,
                  height: 6,
                  bgcolor: theme.palette.error.main,
                  borderRadius: '50%',
                  top: 12,
                  right: 12,
                } : {}
              }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Help */}
          <Tooltip title="Help">
            <IconButton 
              color="inherit"
              sx={{ mx: 0.5 }}
            >
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
          
          {/* User Menu */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleUserMenuOpen}
              color="inherit"
              sx={{ ml: 0.5 }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: theme.palette.primary.dark,
                  border: `2px solid ${alpha(theme.palette.common.white, 0.1)}`,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                A
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            whiteSpace: 'nowrap',
            overflowX: 'hidden',
            borderRight: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ...(!open && {
              width: theme.spacing(7),
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }),
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
            borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
            minHeight: '64px !important',
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              alignItems: 'center',
              ...(open ? { ml: 2 } : { display: 'none' })
            }}
          >
            <SecurityIcon 
              sx={{ 
                color: theme.palette.primary.main,
                backgroundImage: 'linear-gradient(45deg, #4caf50, #2e7d32)',
                borderRadius: '50%',
                p: 0.5,
                mr: 1.5,
                boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
              }}
            />
            <Box 
              component="span" 
              sx={{ 
                backgroundImage: 'linear-gradient(45deg, #4caf50, #2e7d32)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
              }}
            >
              SafeAI
            </Box>
          </Typography>
          <IconButton 
            onClick={handleDrawerClose}
            sx={{
              bgcolor: alpha(theme.palette.common.white, 0.02),
              '&:hover': {
                bgcolor: alpha(theme.palette.common.white, 0.05),
              }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.05) }} />
        <List sx={{ py: 1 }}>
          {navItems.map((item) => (
            <ListItem 
              key={item.name} 
              disablePadding 
              sx={{ 
                display: 'block',
                mb: 0.5,
              }}
              onClick={() => navigate(item.path)}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  py: 1,
                  mx: 1,
                  borderRadius: 1,
                  bgcolor: location.pathname === item.path ? 
                    alpha(theme.palette.primary.main, 0.15) : 
                    'transparent',
                  '&:hover': {
                    bgcolor: location.pathname === item.path ? 
                      alpha(theme.palette.primary.main, 0.25) : 
                      alpha(theme.palette.common.white, 0.05),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path ? 
                      theme.palette.primary.main : 
                      alpha(theme.palette.common.white, 0.7),
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.name} 
                  secondary={open ? item.description : null}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    color: location.pathname === item.path ? 
                      theme.palette.primary.main : 
                      theme.palette.text.primary,
                  }}
                  secondaryTypographyProps={{
                    fontSize: '0.7rem',
                    color: alpha(theme.palette.common.white, 0.5),
                  }}
                  sx={{ 
                    opacity: open ? 1 : 0,
                    ml: 0.5,
                  }} 
                />
                {open && location.pathname === item.path && (
                  <KeyboardArrowRightIcon 
                    fontSize="small" 
                    sx={{ 
                      color: theme.palette.primary.main,
                      opacity: 0.7, 
                    }} 
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ 
          mt: 'auto', 
          borderColor: alpha(theme.palette.common.white, 0.05) 
        }} />
        
        {/* Admin & System Menu */}
        {open && (
          <Box sx={{ p: 2 }}>
            <Typography 
              variant="overline" 
              sx={{ 
                color: alpha(theme.palette.common.white, 0.5),
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '0.5px',
                display: 'block',
                mb: 1,
              }}
            >
              SYSTEM
            </Typography>
            <List 
              dense
              sx={{
                '& .MuiListItemButton-root': {
                  borderRadius: 1,
                  mb: 0.5,
                }
              }}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <VpnKeyIcon fontSize="small" sx={{ color: alpha(theme.palette.common.white, 0.5) }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="API Keys" 
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LockIcon fontSize="small" sx={{ color: alpha(theme.palette.common.white, 0.5) }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Access Control" 
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <TerminalIcon fontSize="small" sx={{ color: alpha(theme.palette.common.white, 0.5) }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="System Logs" 
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        )}
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: 2,
            opacity: open ? 1 : 0,
          }}
        >
          <Typography 
            variant="caption" 
            sx={{
              color: alpha(theme.palette.common.white, 0.3),
              fontSize: '0.7rem',
            }}
          >
            SafeAI v1.0.0
          </Typography>
        </Box>
      </Drawer>
      
      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.3))',
            mt: 1.5,
            backgroundImage: 'linear-gradient(180deg, #222222 0%, #1a1a1a 100%)',
            border: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 18,
              width: 10,
              height: 10,
              bgcolor: '#222222',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              borderLeft: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
              borderTop: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{ py: 1.5 }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.dark }} /> 
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" fontWeight={500}>Admin User</Typography>
            <Typography variant="caption" sx={{ color: alpha(theme.palette.common.white, 0.6) }}>
              admin@safeai.org
            </Typography>
          </Box>
        </MenuItem>
        <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.05) }} />
        <MenuItem sx={{ py: 1 }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="My Profile"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
        <MenuItem sx={{ py: 1 }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Account Settings"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
        <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.05) }} />
        <MenuItem sx={{ py: 1 }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Logout"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.3))',
            mt: 1.5,
            width: 320,
            backgroundImage: 'linear-gradient(180deg, #222222 0%, #1a1a1a 100%)',
            border: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 18,
              width: 10,
              height: 10,
              bgcolor: '#222222',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              borderLeft: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
              borderTop: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography 
          variant="subtitle2" 
          sx={{ 
            p: 2, 
            pb: 0, 
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}
        >
          Notifications
        </Typography>
        <List sx={{ py: 1 }}>
          {notifications.map((notification) => (
            <ListItem 
              key={notification.id}
              sx={{ 
                px: 2,
                py: 1,
                bgcolor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.05),
                borderLeft: notification.read ? 'none' : `2px solid ${theme.palette.primary.main}`,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {notification.icon}
              </ListItemIcon>
              <ListItemText 
                primary={notification.text} 
                secondary={notification.time}
                primaryTypographyProps={{ 
                  variant: 'body2',
                  fontWeight: notification.read ? 400 : 500,
                }}
                secondaryTypographyProps={{ 
                  variant: 'caption',
                  color: alpha(theme.palette.common.white, 0.5),
                }}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.05) }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1.5 }}>
          <Typography
            variant="body2"
            color="primary"
            sx={{ 
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.8rem',
              '&:hover': {
                textDecoration: 'underline',
              }
            }}
          >
            View all notifications
          </Typography>
        </Box>
      </Menu>
      
      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          bgcolor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout; 