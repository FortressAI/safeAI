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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`kg-tabpanel-${index}`}
      aria-labelledby={`kg-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MetricCard = ({ title, value, icon, color, trend }) => {
  const theme = useTheme();
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(color, 0.2)}`,
          borderRadius: 2,
          boxShadow: `0 4px 20px ${alpha(color, 0.1)}`,
          '&:hover': {
            boxShadow: `0 8px 30px ${alpha(color, 0.2)}`,
          },
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                bgcolor: alpha(color, 0.1),
                mr: 2,
              }}
            >
              {icon}
            </Box>
            <Typography variant="h6" color="textPrimary">
              {title}
            </Typography>
          </Box>
          <Typography variant="h4" color="textPrimary" gutterBottom>
            {value}
          </Typography>
          <Typography
            variant="body2"
            color={trend.startsWith('+') ? 'success.main' : 'error.main'}
          >
            {trend} from last update
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

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

  const handleDialogClose = useCallback(() => {
    setSelectedGraph(null);
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
      <Box sx={{ flexGrow: 1, maxWidth: '100%' }}>
        <PageHeader
          title="Knowledge Graphs"
          subtitle="Manage and monitor your knowledge graphs"
          onRefresh={handleRefresh}
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              }}
            >
              New Graph
            </Button>
          }
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

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {metrics.map((metric) => (
            <Grid item xs={12} sm={6} md={3} key={metric.title}>
              <MetricCard {...metric} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search knowledge graphs..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              },
            }}
          />
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            '& .MuiTabs-indicator': {
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            },
          }}
        >
          <Tab label="All Graphs" />
          <Tab label="Core" />
          <Tab label="Extensions" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {sampleKGs.map((graph) => (
              <Grid item xs={12} md={6} lg={4} key={graph.id}>
                <GraphCard graph={graph} onAction={handleGraphAction} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {sampleKGs
              .filter(graph => graph.status === 'active')
              .map((graph) => (
                <Grid item xs={12} md={6} lg={4} key={graph.id}>
                  <GraphCard graph={graph} onAction={handleGraphAction} />
                </Grid>
              ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {sampleKGs
              .filter(graph => graph.status !== 'active')
              .map((graph) => (
                <Grid item xs={12} md={6} lg={4} key={graph.id}>
                  <GraphCard graph={graph} onAction={handleGraphAction} />
                </Grid>
              ))}
          </Grid>
        </TabPanel>

        <Dialog
          open={Boolean(selectedGraph)}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
        >
          {selectedGraph && (
            <>
              <DialogTitle>
                {selectedGraph.name}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {selectedGraph.description}
                </DialogContentText>
                <TableContainer sx={{ mt: 2 }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={selectedGraph.status}
                            color={selectedGraph.status === 'active' ? 'success' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Nodes</TableCell>
                        <TableCell>{selectedGraph.nodes.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Edges</TableCell>
                        <TableCell>{selectedGraph.relationships.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Last Updated</TableCell>
                        <TableCell>{selectedGraph.lastUpdated}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Close</Button>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => handleGraphAction('edit', selectedGraph)}
                >
                  Edit
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </ErrorBoundary>
  );
}

export default KnowledgeGraphs; 