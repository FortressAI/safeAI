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
  useMediaQuery,
  ListItemAvatar,
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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FunctionsIcon from '@mui/icons-material/Functions';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CalculateIcon from '@mui/icons-material/Calculate';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@mui/material';
import ExternalLinks from './ExternalLinks';

// Update drawer width for better proportions
const drawerWidth = 260;

function Layout() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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
  
  // Enhanced navigation items with modern icons and descriptions
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <DashboardIcon />,
      description: 'System overview & monitoring',
      color: '#4f46e5'
    },
    { 
      name: 'Agents', 
      path: '/agents', 
      icon: <SmartToyIcon />,
      description: 'Browse and manage agents',
      color: '#10b981'
    },
    { 
      name: 'Agent Workshop', 
      path: '/agent-workshop', 
      icon: <AddCircleOutlineIcon />,
      description: 'Create new intelligent agents',
      color: '#3b82f6'
    },
    { 
      name: 'ARC Prize', 
      path: '/arc-prize', 
      icon: <EmojiEventsIcon />,
      description: 'Test agents on ARC competition',
      color: '#f59e0b'
    },
    { 
      name: 'Math ATP', 
      path: '/math-atp', 
      icon: <CodeIcon />,
      description: 'Automated Theorem Proving with Agentic KG',
      color: '#8b5cf6'
    },
    { 
      name: 'Math KG', 
      path: '/math-kg', 
      icon: <FunctionsIcon />,
      description: 'Mathematics Knowledge Graph Explorer',
      color: '#ec4899'
    },
    { 
      name: 'Security Center', 
      path: '/security', 
      icon: <SecurityIcon />,
      description: 'Security monitoring & compliance',
      color: '#ef4444'
    },
    { 
      name: 'Knowledge Graphs', 
      path: '/knowledge-graphs', 
      icon: <SchemaIcon />,
      description: 'Manage knowledge graphs',
      color: '#14b8a6'
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <SettingsIcon />,
      description: 'Configure system settings',
      color: '#6b7280'
    },
    {
      name: 'Ethics KG',
      path: '/ethics-kg',
      icon: <PsychologyIcon />,
      description: 'Ethics Knowledge Graph Explorer',
      color: '#f97316'
    },
    {
      name: 'FreePress',
      path: '/free-press',
      icon: <NewspaperIcon />,
      description: 'Decentralized News Platform',
      color: '#22c55e'
    }
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
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
          background: alpha(theme.palette.background.default, 0.7),
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
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
          minHeight: 64,
          px: { xs: 2, sm: 3 },
          gap: 2,
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
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
              gap: 1,
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                fontSize: '1.25rem',
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
                background: alpha(theme.palette.primary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                color: theme.palette.primary.main,
              }}
            />
          </Typography>
          
          <ExternalLinks />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationsOpen}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account settings">
              <IconButton
                color="inherit"
                onClick={handleUserMenuOpen}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                  }}
                >
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          position: 'fixed',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ...(open ? {
              width: drawerWidth,
              overflowX: 'hidden',
            } : {
              width: theme.spacing(7),
              overflowX: 'hidden',
            }),
          },
        }}
      >
        <Toolbar sx={{ minHeight: 64 }} />
        <Box sx={{ overflow: 'auto', py: 2 }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    minHeight: 44,
                    '&.Mui-selected': {
                      background: `linear-gradient(135deg, ${alpha(item.color, 0.2)} 0%, ${alpha(item.color, 0.1)} 100%)`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${alpha(item.color, 0.3)} 0%, ${alpha(item.color, 0.2)} 100%)`,
                      },
                      '& .MuiListItemIcon-root': {
                        color: item.color,
                      },
                      '& .MuiListItemText-primary': {
                        color: item.color,
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: alpha(theme.palette.common.white, 0.7) }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.name}
                    secondary={open ? item.description : null}
                    primaryTypographyProps={{
                      sx: { 
                        fontWeight: 500,
                        color: alpha(theme.palette.common.white, 0.9),
                      }
                    }}
                    secondaryTypographyProps={{
                      sx: { 
                        fontSize: '0.75rem',
                        color: alpha(theme.palette.common.white, 0.5),
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      {/* Main content */}
      <Box
        component="main"
        className="MuiBox-root css-1fbxgmf"
        sx={{
          flexGrow: 1,
          width: '100%',
          maxWidth: '100%',
          marginLeft: '0px',
          marginRight: 'auto',
          mt: '64px', // Height of AppBar
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default',
          transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            transition: theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Box
          className="MuiBox-root css-19kzrtu"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            width: '100%',
            maxWidth: '100%',
            height: 'auto',
            p: { xs: 2, sm: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 360,
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <List sx={{ p: 0 }}>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              sx={{
                py: 2,
                px: 2,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                '&:last-child': {
                  borderBottom: 'none',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'transparent' }}>
                  {notification.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={notification.text}
                secondary={notification.time}
                primaryTypographyProps={{
                  sx: { fontWeight: notification.read ? 400 : 600 }
                }}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button fullWidth variant="text">
            View All Notifications
          </Button>
        </Box>
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 200,
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }
        }}
      >
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Layout; 