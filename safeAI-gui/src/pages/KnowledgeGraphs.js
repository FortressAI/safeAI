import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

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

const GraphCard = ({ graph }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Graph</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <RefreshIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Update Graph</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Graph</ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

function KnowledgeGraphs() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleGraphClick = (graph) => {
    setSelectedGraph(graph);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedGraph(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" color="textPrimary">
          Knowledge Graphs
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            },
          }}
        >
          Create New Graph
        </Button>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total Graphs"
            value="4"
            icon={<GraphIcon />}
            color={theme.palette.primary.main}
            trend="+1"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total Nodes"
            value="3,200"
            icon={<NodeIcon />}
            color={theme.palette.success.main}
            trend="+150"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total Edges"
            value="8,700"
            icon={<LinkIcon />}
            color={theme.palette.info.main}
            trend="+420"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Active Graphs"
            value="4"
            icon={<HubIcon />}
            color={theme.palette.warning.main}
            trend="0"
          />
        </Grid>
      </Grid>

      <Box mb={3}>
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
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: alpha(theme.palette.background.paper, 0.9),
              },
            },
          }}
        />
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          },
        }}
      >
        <Tab label="All Graphs" />
        <Tab label="Active" />
        <Tab label="Archived" />
      </Tabs>

      <Grid container spacing={3}>
        {sampleKGs.map((graph) => (
          <Grid item xs={12} md={6} lg={4} key={graph.id}>
            <GraphCard graph={graph} />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <DialogTitle>
          {selectedGraph ? 'Edit Knowledge Graph' : 'Create New Knowledge Graph'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Graph Name"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Active"
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleDialogClose}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              },
            }}
          >
            {selectedGraph ? 'Save Changes' : 'Create Graph'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default KnowledgeGraphs; 