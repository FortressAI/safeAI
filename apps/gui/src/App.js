import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Layout components
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import AgentBrowser from './pages/AgentBrowser';
import AgentWorkshop from './pages/AgentWorkshop';
import SecurityCenter from './pages/SecurityCenter';
import KnowledgeGraphs from './pages/KnowledgeGraphs';
import Settings from './pages/Settings';
import ARCPrize from './pages/ARCPrize';
import MathATP from './pages/MathATP';
import MathKG from './pages/MathKG';
import EthicsKG from './pages/EthicsKG';
import FreePress from './pages/FreePress';

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3', // Match interactive demo blue
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#4caf50', // Match interactive demo green
      light: '#81c784',
      dark: '#388e3c',
    },
    background: {
      default: '#121212', // Exactly match the interactive demo background
      paper: '#1e1e1e',   // Slightly lighter for UI elements
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#ff9800', // Match interactive demo orange
    },
    success: {
      main: '#4caf50', // Match interactive demo green
    },
    info: {
      main: '#2196f3', // Match interactive demo blue
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Match interactive demo font
    h1: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0,0,0,0.5)', // Match interactive demo AppBar
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: 'rgba(255,255,255,0.05)', // Match interactive demo cards
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)', // Match interactive demo hover effect
            boxShadow: '0 12px 20px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.3s ease',
        },
        contained: {
          boxShadow: '0 4px 6px -1px rgba(33, 150, 243, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 8px -1px rgba(33, 150, 243, 0.3)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(255,255,255,0.05)', // Match interactive demo papers
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#121212', // Match interactive demo background
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: props => props.color || '#2196f3', // Make avatars use colors like in demos
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    // ... keep remaining shadow values
  ],
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="agents" element={<AgentBrowser />} />
              <Route path="agent-workshop" element={<AgentWorkshop />} />
              <Route path="arc-prize" element={<ARCPrize />} />
              <Route path="math-atp" element={<MathATP />} />
              <Route path="math-kg" element={<MathKG />} />
              <Route path="security" element={<SecurityCenter />} />
              <Route path="knowledge-graphs" element={<KnowledgeGraphs />} />
              <Route path="settings" element={<Settings />} />
              <Route path="ethics-kg" element={<EthicsKG />} />
              <Route path="free-press" element={<FreePress />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 