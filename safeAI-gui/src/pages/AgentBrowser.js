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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CodeIcon from '@mui/icons-material/Code';
import PsychologyIcon from '@mui/icons-material/Psychology';
import InfoIcon from '@mui/icons-material/Info';

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
    <div>
      <Typography variant="h4" gutterBottom>
        Agent Browser
      </Typography>
      
      {/* Search and Filter Bar */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
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
          
          <Grid item xs={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CategoryIcon color="action" sx={{ mr: 1 }} />
              <TextField
                select
                fullWidth
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
                variant="outlined"
              >
                {agentCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                href="#/agent-workshop"
              >
                Create New Agent
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs */}
      <Paper elevation={2}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<SmartToyIcon />} label="All Agents" />
          <Tab icon={<StarIcon />} label="Favorites" />
          <Tab icon={<CodeIcon />} label="Script Agents" />
          <Tab icon={<PsychologyIcon />} label="LLM Agents" />
        </Tabs>
        
        {/* All Agents Tab */}
        <TabPanel value={tabValue} index={0}>
          <AgentGrid agents={getTabAgents()} 
                    handleOpenAgentDetail={handleOpenAgentDetail}
                    handleMenuOpen={handleMenuOpen} />
        </TabPanel>
        
        {/* Favorites Tab */}
        <TabPanel value={tabValue} index={1}>
          <AgentGrid agents={getTabAgents()} 
                    handleOpenAgentDetail={handleOpenAgentDetail}
                    handleMenuOpen={handleMenuOpen} />
        </TabPanel>
        
        {/* Script Agents Tab */}
        <TabPanel value={tabValue} index={2}>
          <AgentGrid agents={getTabAgents()} 
                    handleOpenAgentDetail={handleOpenAgentDetail}
                    handleMenuOpen={handleMenuOpen} />
        </TabPanel>
        
        {/* LLM Agents Tab */}
        <TabPanel value={tabValue} index={3}>
          <AgentGrid agents={getTabAgents()} 
                    handleOpenAgentDetail={handleOpenAgentDetail}
                    handleMenuOpen={handleMenuOpen} />
        </TabPanel>
      </Paper>
      
      {/* Agent Detail Dialog */}
      {selectedAgent && (
        <Dialog
          open={openAgentDetail}
          onClose={handleCloseAgentDetail}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {selectedAgent.type === 'script' ? (
                <CodeIcon color="primary" sx={{ mr: 1 }} />
              ) : (
                <PsychologyIcon color="primary" sx={{ mr: 1 }} />
              )}
              {selectedAgent.name}
              {selectedAgent.favorite && (
                <StarIcon color="warning" sx={{ ml: 1 }} fontSize="small" />
              )}
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedAgent.description}
                </Typography>
                
                <Typography variant="h6" gutterBottom>
                  Capabilities
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {selectedAgent.capabilities.map((capability) => (
                    <Chip
                      key={capability}
                      label={capability.replace('_', ' ')}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PlayArrowIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Agent execution completed successfully"
                      secondary={`Last run: ${selectedAgent.lastRun}`}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemIcon>
                      <EditIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Agent configuration updated"
                      secondary="2023-10-10 09:45:18"
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedUserIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Security validation passed"
                      secondary="2023-10-08 14:20:33"
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Agent Details
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="ID" secondary={selectedAgent.id} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Category" secondary={selectedAgent.category} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Type" secondary={selectedAgent.type === 'script' ? 'Script Agent' : 'LLM Agent'} />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Security Level" 
                        secondary={
                          <Chip
                            size="small"
                            label={selectedAgent.securityLevel.toUpperCase()}
                            color={
                              selectedAgent.securityLevel === 'high'
                                ? 'success'
                                : selectedAgent.securityLevel === 'medium'
                                ? 'warning'
                                : 'error'
                            }
                          />
                        } 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Last Run" secondary={selectedAgent.lastRun} />
                    </ListItem>
                  </List>
                </Paper>
                
                <Typography variant="h6" gutterBottom>
                  Actions
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  sx={{ mb: 2 }}
                >
                  Run Agent
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EditIcon />}
                  sx={{ mb: 2 }}
                >
                  Edit Agent
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  startIcon={selectedAgent.favorite ? <StarBorderIcon /> : <StarIcon />}
                  sx={{ mb: 2 }}
                  onClick={() => handleToggleFavorite(selectedAgent.id)}
                >
                  {selectedAgent.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAgentDetail}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
      
      {/* Agent Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          const agent = agents.find(a => a.id === menuAgentId);
          handleOpenAgentDetail(agent);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleToggleFavorite(menuAgentId)}>
          <ListItemIcon>
            {agents.find(a => a.id === menuAgentId)?.favorite 
              ? <StarBorderIcon fontSize="small" />
              : <StarIcon fontSize="small" />
            }
          </ListItemIcon>
          {agents.find(a => a.id === menuAgentId)?.favorite 
            ? 'Remove from Favorites' 
            : 'Add to Favorites'
          }
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <PlayArrowIcon fontSize="small" />
          </ListItemIcon>
          Run Agent
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Agent
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Delete Agent</Typography>
        </MenuItem>
      </Menu>
    </div>
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
                      <PlayArrowIcon />
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

export default AgentBrowser; 