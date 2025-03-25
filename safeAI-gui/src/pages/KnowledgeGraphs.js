import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  useTheme,
  alpha,
  Badge,
  Alert,
  FormControlLabel,
  Switch,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  NetworkCheck as NetworkIcon,
  Star as StarIcon,
  Save as SaveIcon,
  Build as BuildIcon,
  TestTube as TestIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Key as KeyIcon,
  BugReport as BugIcon,
  AccountTree as GraphIcon,
  Timeline as TimelineIcon,
  Schema as SchemaIcon,
  Link as LinkIcon,
  Circle as NodeIcon,
  Hub as HubIcon,
  Psychology as EthicsIcon,
  Functions as MathIcon,
  Gavel as LogicIcon,
  Security as SafetyIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import PageHeader from '../components/shared/PageHeader';
import TabPanel from '../components/shared/TabPanel';
import ErrorFallback from '../components/shared/ErrorFallback';
import MetricCard from '../components/shared/MetricCard';

// Sample Knowledge Graphs
const sampleKGs = [
  {
    id: 1,
    name: 'Ethics Knowledge Graph',
    description: 'Comprehensive graph of ethical principles and their relationships',
    nodes: 1250,
    relationships: 3500,
    lastUpdated: '2024-03-15',
    status: 'active',
    icon: <EthicsIcon />,
    color: '#4CAF50',
  },
  {
    id: 2,
    name: 'Mathematics Knowledge Graph',
    description: 'Mathematical concepts and their hierarchical relationships',
    nodes: 850,
    relationships: 2200,
    lastUpdated: '2024-03-14',
    status: 'active',
    icon: <MathIcon />,
    color: '#2196F3',
  },
  {
    id: 3,
    name: 'Logic Knowledge Graph',
    description: 'Logical relationships and inference rules',
    nodes: 650,
    relationships: 1800,
    lastUpdated: '2024-03-13',
    status: 'active',
    icon: <LogicIcon />,
    color: '#9C27B0',
  },
  {
    id: 4,
    name: 'Safety Knowledge Graph',
    description: 'Safety protocols and risk assessment relationships',
    nodes: 450,
    relationships: 1200,
    lastUpdated: '2024-03-12',
    status: 'active',
    icon: <SafetyIcon />,
    color: '#FF9800',
  },
];

// Sample KG Categories
const kgCategories = [
  'All',
  'Security',
  'Privacy',
  'Ethics',
  'Legal',
  'Risk',
  'Custom',
];



const GraphCard = ({ graph, onAction }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    handleMenuClose();
    onAction(action, graph);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${alpha(graph.color, 0.1)} 0%, ${alpha(graph.color, 0.05)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(graph.color, 0.2)}`,
          borderRadius: 2,
          boxShadow: `0 4px 20px ${alpha(graph.color, 0.1)}`,
          '&:hover': {
            boxShadow: `0 8px 30px ${alpha(graph.color, 0.2)}`,
          },
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1,
                  bgcolor: alpha(graph.color, 0.1),
                  mr: 2,
                }}
              >
                {graph.icon}
              </Box>
              <Box>
                <Typography variant="h6" color="textPrimary">
                  {graph.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Last updated: {graph.lastUpdated}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="textSecondary" paragraph>
            {graph.description}
          </Typography>
          <Box display="flex" gap={2} mt={2}>
            <Chip
              icon={<NodeIcon />}
              label={`${graph.nodes} nodes`}
              size="small"
              sx={{
                bgcolor: alpha(graph.color, 0.1),
                color: graph.color,
                '& .MuiChip-icon': {
                  color: graph.color,
                },
              }}
            />
            <Chip
              icon={<LinkIcon />}
              label={`${graph.relationships} edges`}
              size="small"
              sx={{
                bgcolor: alpha(graph.color, 0.1),
                color: graph.color,
                '& .MuiChip-icon': {
                  color: graph.color,
                },
              }}
            />
            <Chip
              icon={<CheckIcon />}
              label={graph.status}
              size="small"
              color="success"
            />
          </Box>
        </CardContent>
      </Card>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('view')}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('download')}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

function KnowledgeGraphs() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleGraphAction = useCallback((action, graph) => {
    console.log(`Action ${action} on graph:`, graph);
    if (action === 'view') {
      setSelectedGraph(graph);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // TODO: Implement actual refresh logic
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to refresh graphs:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Box sx={{ width: '100%' }}>
        <PageHeader
          title="Knowledge Graphs"
          subtitle="Manage and explore knowledge graphs"
          icon={<SchemaIcon />}
        />

        {isRefreshing && (
          <LinearProgress 
            sx={{ 
              mb: 3,
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 1,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              },
            }} 
          />
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All Graphs" />
            <Tab label="Core" />
            <Tab label="Extensions" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {sampleKGs.map((graph, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <GraphCard
                  graph={graph}
                  onAction={(action) => handleGraphAction(action, graph)}
                />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {sampleKGs.filter(graph => graph.status === 'active').map((graph, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <GraphCard
                  graph={graph}
                  onAction={(action) => handleGraphAction(action, graph)}
                />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {sampleKGs.filter(graph => graph.status !== 'active').map((graph, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <GraphCard
                  graph={graph}
                  onAction={(action) => handleGraphAction(action, graph)}
                />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <Dialog
          open={Boolean(selectedGraph)}
          onClose={() => setSelectedGraph(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchemaIcon color="primary" />
              <Typography variant="h6">{selectedGraph?.name}</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    label={selectedGraph?.status}
                    color={selectedGraph?.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Nodes
                  </Typography>
                  <Typography variant="h6">{selectedGraph?.nodes}</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Edges
                  </Typography>
                  <Typography variant="h6">{selectedGraph?.relationships}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Size
                  </Typography>
                  <Typography variant="h6">{selectedGraph?.relationships.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Last Updated
                  </Typography>
                  <Typography variant="h6">{selectedGraph?.lastUpdated}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Type
                  </Typography>
                  <Chip
                    label={selectedGraph?.status === 'active' ? 'Core' : 'Extension'}
                    color={selectedGraph?.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedGraph(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ErrorBoundary>
  );
}

export default KnowledgeGraphs; 