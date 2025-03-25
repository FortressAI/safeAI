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
  Avatar,
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
  CircularProgress,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  useTheme,
  Badge,
  alpha,
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
  SmartToy as SmartToyIcon,
  Code as CodeIcon,
  Psychology as PsychologyIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  NetworkCheck as NetworkIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Sample agent data
const sampleAgents = [
  {
    id: 1,
    name: 'SecurityAnalyzer',
    description: 'Analyzes system security and identifies potential vulnerabilities',
    category: 'Security',
    type: 'script',
    capabilities: ['security_analysis', 'threat_detection', 'vulnerability_assessment'],
    securityLevel: 'high',
    lastRun: '2023-10-15 14:30:22',
    favorite: true,
  },
  {
    id: 2,
    name: 'DataPrivacyChecker',
    description: 'Checks for data privacy compliance issues in the knowledge graph',
    category: 'Compliance',
    type: 'llm',
    capabilities: ['data_privacy', 'compliance_check', 'gdpr_validation'],
    securityLevel: 'high',
    lastRun: '2023-10-14 09:15:45',
    favorite: false,
  },
  {
    id: 3,
    name: 'KGEnhancer',
    description: 'Enhances knowledge graphs with additional metadata and relationships',
    category: 'Knowledge',
    type: 'script',
    capabilities: ['graph_enhancement', 'relationship_discovery', 'metadata_enrichment'],
    securityLevel: 'medium',
    lastRun: '2023-10-13 11:20:32',
    favorite: true,
  },
  {
    id: 4,
    name: 'RiskAssessor',
    description: 'Assesses risks associated with particular actions or knowledge patterns',
    category: 'Risk',
    type: 'llm',
    capabilities: ['risk_assessment', 'impact_analysis', 'mitigation_suggestion'],
    securityLevel: 'high',
    lastRun: '2023-10-12 16:45:10',
    favorite: false,
  },
  {
    id: 5,
    name: 'ComplianceAuditor',
    description: 'Audits system for regulatory compliance across multiple frameworks',
    category: 'Compliance',
    type: 'script',
    capabilities: ['compliance_audit', 'regulatory_check', 'audit_reporting'],
    securityLevel: 'high',
    lastRun: '2023-10-11 13:10:28',
    favorite: false,
  },
  {
    id: 6,
    name: 'EthicsAdvisor',
    description: 'Provides ethics insights and advice on AI decisions and actions',
    category: 'Ethics',
    type: 'llm',
    capabilities: ['ethics_analysis', 'bias_detection', 'fairness_assessment'],
    securityLevel: 'medium',
    lastRun: '2023-10-10 10:30:15',
    favorite: true,
  },
];

// Sample agent categories for filtering
const agentCategories = [
  'All',
  'Security',
  'Compliance',
  'Knowledge',
  'Risk',
  'Ethics',
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`agent-tabpanel-${index}`}
      aria-labelledby={`agent-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AgentBrowser() {
  const theme = useTheme();
  const [agents, setAgents] = useState(sampleAgents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [tabValue, setTabValue] = useState(0);
  const [openAgentDetail, setOpenAgentDetail] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAgentId, setMenuAgentId] = useState(null);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle agent detail dialog
  const handleOpenAgentDetail = (agent) => {
    setSelectedAgent(agent);
    setOpenAgentDetail(true);
  };
  
  const handleCloseAgentDetail = () => {
    setOpenAgentDetail(false);
  };
  
  // Handle agent menu
  const handleMenuOpen = (event, agentId) => {
    setAnchorEl(event.currentTarget);
    setMenuAgentId(agentId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuAgentId(null);
  };
  
  // Toggle favorite
  const handleToggleFavorite = (agentId) => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, favorite: !agent.favorite } 
        : agent
    ));
    handleMenuClose();
  };
  
  // Filter agents based on search term and category
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Get agents by tab selection
  const getTabAgents = () => {
    switch (tabValue) {
      case 0: // All Agents
        return filteredAgents;
      case 1: // Favorites
        return filteredAgents.filter(agent => agent.favorite);
      case 2: // Script Agents
        return filteredAgents.filter(agent => agent.type === 'script');
      case 3: // LLM Agents
        return filteredAgents.filter(agent => agent.type === 'llm');
      default:
        return filteredAgents;
    }
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
            Agent Browser
          </Typography>
          <Typography color="text.secondary">
            Browse and manage your AI agents
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            },
          }}
        >
          Create New Agent
        </Button>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                sx={{
                  borderColor: alpha(theme.palette.common.white, 0.1),
                  '&:hover': {
                    borderColor: alpha(theme.palette.common.white, 0.2),
                  },
                }}
              >
                Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<SortIcon />}
                sx={{
                  borderColor: alpha(theme.palette.common.white, 0.1),
                  '&:hover': {
                    borderColor: alpha(theme.palette.common.white, 0.2),
                  },
                }}
              >
                Sort
              </Button>
              <IconButton>
                <RefreshIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Agent Types Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: alpha(theme.palette.common.white, 0.1), mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
            },
          }}
        >
          <Tab
            value="all"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                All Agents
                <Badge
                  badgeContent={filteredAgents.length}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    },
                  }}
                />
              </Box>
            }
          />
          <Tab
            value="favorites"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Favorites
                <Badge
                  badgeContent={filteredAgents.filter(a => a.favorite).length}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    },
                  }}
                />
              </Box>
            }
          />
          <Tab
            value="script"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Script Agents
                <Badge
                  badgeContent={filteredAgents.filter(a => a.type === 'script').length}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    },
                  }}
                />
              </Box>
            }
          />
          <Tab
            value="llm"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                LLM Agents
                <Badge
                  badgeContent={filteredAgents.filter(a => a.type === 'llm').length}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    },
                  }}
                />
              </Box>
            }
          />
        </Tabs>
      </Box>

      {/* Agent Grid */}
      <Grid container spacing={3}>
        <AnimatePresence>
          {filteredAgents.map((agent) => (
            <Grid item xs={12} md={6} lg={4} key={agent.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AgentCard agent={agent} />
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    </Box>
  );
}

// Agent Grid Component
function AgentGrid({ agents, handleOpenAgentDetail, handleMenuOpen }) {
  return (
    <Grid container spacing={3}>
      {agents.length > 0 ? (
        agents.map((agent) => (
          <Grid item xs={12} sm={6} md={4} key={agent.id}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              {agent.favorite && (
                <StarIcon
                  color="warning"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                  }}
                />
              )}
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: agent.type === 'script' ? 'primary.main' : 'secondary.main',
                      width: 48,
                      height: 48,
                      mr: 2,
                    }}
                  >
                    {agent.type === 'script' ? <CodeIcon /> : <PsychologyIcon />}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div">
                      {agent.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={agent.category}
                      sx={{ mr: 1 }}
                    />
                    {agent.securityLevel === 'high' && (
                      <Chip
                        size="small"
                        icon={<SecurityIcon fontSize="small" />}
                        label="High Security"
                        color="success"
                      />
                    )}
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {agent.description}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {agent.capabilities.slice(0, 2).map((capability) => (
                    <Chip
                      key={capability}
                      label={capability.replace('_', ' ')}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                  {agent.capabilities.length > 2 && (
                    <Chip
                      label={`+${agent.capabilities.length - 2} more`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button
                  size="small"
                  onClick={() => handleOpenAgentDetail(agent)}
                >
                  View Details
                </Button>
                <Box>
                  <Tooltip title="Run Agent">
                    <IconButton size="small" color="primary">
                      <PlayIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, agent.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No agents found matching your criteria
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
              href="#/agent-workshop"
            >
              Create New Agent
            </Button>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
}

const MetricCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 16px ${alpha(color, 0.2)}`,
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.1),
              color: color,
              mr: 1,
              width: 32,
              height: 32,
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
        </Box>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const AgentCard = ({ agent }) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getAgentIcon = (type) => {
    switch (type) {
      case 'llm':
        return <CodeIcon />;
      case 'ethics':
        return <PsychologyIcon />;
      case 'security':
        return <SecurityIcon />;
      default:
        return <SmartToyIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'idle':
        return theme.palette.grey[500];
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                mr: 2,
                width: 48,
                height: 48,
              }}
            >
              {getAgentIcon(agent.type)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {agent.name}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {agent.description}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleDialogOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            label={agent.status}
            size="small"
            sx={{
              bgcolor: alpha(getStatusColor(agent.status), 0.1),
              color: getStatusColor(agent.status),
            }}
          />
          <Chip
            label={`${agent.performance}% Performance`}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.main,
            }}
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <MetricCard
              title="CPU Usage"
              value={`${agent.metrics.cpu}%`}
              icon={<SpeedIcon />}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={6}>
            <MetricCard
              title="Memory Usage"
              value={`${agent.metrics.memory}%`}
              icon={<MemoryIcon />}
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid item xs={6}>
            <MetricCard
              title="Storage Usage"
              value={`${agent.metrics.storage}%`}
              icon={<StorageIcon />}
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid item xs={6}>
            <MetricCard
              title="Network Usage"
              value={`${agent.metrics.network}%`}
              icon={<NetworkIcon />}
              color={theme.palette.info.main}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Last active: {agent.lastActive}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={agent.status === 'active' ? 'Stop Agent' : 'Start Agent'}>
              <IconButton
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                {agent.status === 'active' ? <StopIcon /> : <PlayIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          }
        }}
      >
        <MenuItem onClick={handleDialogOpen}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Agent</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDialogClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Agent</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          }
        }}
      >
        <DialogTitle>Edit Agent</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Agent Name"
              defaultValue={agent.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              defaultValue={agent.description}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Type"
              defaultValue={agent.type}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogClose}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default AgentBrowser; 