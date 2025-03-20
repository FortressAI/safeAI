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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import SchemaIcon from '@mui/icons-material/Schema';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import GavelIcon from '@mui/icons-material/Gavel';
import PsychologyIcon from '@mui/icons-material/Psychology';
import StorageIcon from '@mui/icons-material/Storage';
import FilterListIcon from '@mui/icons-material/FilterList';

// Sample Knowledge Graphs
const sampleKGs = [
  {
    id: 1,
    name: 'CyberSecurity_KG',
    description: 'Knowledge graph for cybersecurity patterns and threat detection',
    category: 'Security',
    nodes: 5243,
    relationships: 12876,
    lastUpdated: '2023-10-15 08:30:45',
    status: 'active',
  },
  {
    id: 2,
    name: 'DataPrivacySecurity_KG',
    description: 'Privacy protection frameworks and data security patterns',
    category: 'Privacy',
    nodes: 3156,
    relationships: 7845,
    lastUpdated: '2023-10-14 09:15:45',
    status: 'active',
  },
  {
    id: 3,
    name: 'Ethics_KG',
    description: 'Ethical principles and patterns for responsible AI',
    category: 'Ethics',
    nodes: 2789,
    relationships: 6234,
    lastUpdated: '2023-10-13 11:20:32',
    status: 'active',
  },
  {
    id: 4,
    name: 'LegalCompliance_KG',
    description: 'Legal and regulatory compliance frameworks',
    category: 'Legal',
    nodes: 4128,
    relationships: 9876,
    lastUpdated: '2023-10-12 16:45:10',
    status: 'active',
  },
  {
    id: 5,
    name: 'RiskManagement_KG',
    description: 'Risk assessment and mitigation patterns',
    category: 'Risk',
    nodes: 3652,
    relationships: 8245,
    lastUpdated: '2023-10-11 13:10:28',
    status: 'active',
  },
  {
    id: 6,
    name: 'CustomDomain_KG',
    description: 'Custom domain-specific knowledge patterns',
    category: 'Custom',
    nodes: 1245,
    relationships: 3456,
    lastUpdated: '2023-10-10 10:30:15',
    status: 'draft',
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

function KnowledgeGraphs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [tabValue, setTabValue] = useState(0);
  const [openKGDetail, setOpenKGDetail] = useState(false);
  const [selectedKG, setSelectedKG] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuKGId, setMenuKGId] = useState(null);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle KG detail dialog
  const handleOpenKGDetail = (kg) => {
    setSelectedKG(kg);
    setOpenKGDetail(true);
  };
  
  const handleCloseKGDetail = () => {
    setOpenKGDetail(false);
  };
  
  // Handle KG menu
  const handleMenuOpen = (event, kgId) => {
    setAnchorEl(event.currentTarget);
    setMenuKGId(kgId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuKGId(null);
  };
  
  // Filter KGs based on search term and category
  const filteredKGs = sampleKGs.filter(kg => {
    const matchesSearch = kg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        kg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || kg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Get KGs by tab selection
  const getTabKGs = () => {
    switch (tabValue) {
      case 0: // All KGs
        return filteredKGs;
      case 1: // Security KGs
        return filteredKGs.filter(kg => ['Security', 'Privacy', 'Risk'].includes(kg.category));
      case 2: // Compliance KGs
        return filteredKGs.filter(kg => ['Legal', 'Ethics'].includes(kg.category));
      case 3: // Custom KGs
        return filteredKGs.filter(kg => kg.category === 'Custom');
      default:
        return filteredKGs;
    }
  };
  
  // Get icon for KG category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Security':
        return <SecurityIcon color="primary" />;
      case 'Privacy':
        return <SecurityIcon color="info" />;
      case 'Ethics':
        return <PsychologyIcon color="secondary" />;
      case 'Legal':
        return <GavelIcon color="warning" />;
      case 'Risk':
        return <InfoIcon color="error" />;
      case 'Custom':
        return <SchemaIcon color="action" />;
      default:
        return <SchemaIcon />;
    }
  };
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Knowledge Graphs
      </Typography>
      
      {/* Search and Filter Bar */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search knowledge graphs..."
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
              <FilterListIcon color="action" sx={{ mr: 1 }} />
              <TextField
                select
                fullWidth
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
                variant="outlined"
              >
                {kgCategories.map((category) => (
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
              >
                Add New Knowledge Graph
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
          <Tab icon={<SchemaIcon />} label="All Knowledge Graphs" />
          <Tab icon={<SecurityIcon />} label="Security KGs" />
          <Tab icon={<GavelIcon />} label="Compliance KGs" />
          <Tab icon={<StorageIcon />} label="Custom KGs" />
        </Tabs>
        
        {/* All KGs Tab */}
        <TabPanel value={tabValue} index={0}>
          <KGTable kgs={getTabKGs()} 
                   handleOpenKGDetail={handleOpenKGDetail}
                   handleMenuOpen={handleMenuOpen}
                   getCategoryIcon={getCategoryIcon} />
        </TabPanel>
        
        {/* Security KGs Tab */}
        <TabPanel value={tabValue} index={1}>
          <KGTable kgs={getTabKGs()} 
                   handleOpenKGDetail={handleOpenKGDetail}
                   handleMenuOpen={handleMenuOpen}
                   getCategoryIcon={getCategoryIcon} />
        </TabPanel>
        
        {/* Compliance KGs Tab */}
        <TabPanel value={tabValue} index={2}>
          <KGTable kgs={getTabKGs()} 
                   handleOpenKGDetail={handleOpenKGDetail}
                   handleMenuOpen={handleMenuOpen}
                   getCategoryIcon={getCategoryIcon} />
        </TabPanel>
        
        {/* Custom KGs Tab */}
        <TabPanel value={tabValue} index={3}>
          <KGTable kgs={getTabKGs()} 
                   handleOpenKGDetail={handleOpenKGDetail}
                   handleMenuOpen={handleMenuOpen}
                   getCategoryIcon={getCategoryIcon} />
        </TabPanel>
      </Paper>
      
      {/* KG Detail Dialog */}
      {selectedKG && (
        <Dialog
          open={openKGDetail}
          onClose={handleCloseKGDetail}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {getCategoryIcon(selectedKG.category)}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {selectedKG.name}
              </Typography>
              {selectedKG.status === 'active' && (
                <Chip 
                  size="small" 
                  color="success" 
                  label="Active" 
                  sx={{ ml: 2 }}
                />
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
                  {selectedKG.description}
                </Typography>
                
                <Typography variant="h6" gutterBottom>
                  Metrics
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">Nodes</TableCell>
                        <TableCell align="right">{selectedKG.nodes.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Relationships</TableCell>
                        <TableCell align="right">{selectedKG.relationships.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Density</TableCell>
                        <TableCell align="right">
                          {(selectedKG.relationships / selectedKG.nodes).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">Last Updated</TableCell>
                        <TableCell align="right">{selectedKG.lastUpdated}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Typography variant="h6" gutterBottom>
                  Related Knowledge Graphs
                </Typography>
                <List>
                  {sampleKGs
                    .filter(kg => kg.id !== selectedKG.id)
                    .slice(0, 3)
                    .map(kg => (
                      <ListItem key={kg.id} button>
                        <ListItemIcon>
                          {getCategoryIcon(kg.category)}
                        </ListItemIcon>
                        <ListItemText 
                          primary={kg.name}
                          secondary={kg.description.substring(0, 60) + '...'}
                        />
                      </ListItem>
                    ))}
                </List>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Details
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="ID" secondary={selectedKG.id} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Category" secondary={selectedKG.category} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Status" secondary={
                        <Chip 
                          size="small" 
                          color={selectedKG.status === 'active' ? 'success' : 'default'}
                          label={selectedKG.status === 'active' ? 'Active' : 'Draft'}
                        />
                      } />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Last Updated" secondary={selectedKG.lastUpdated} />
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
                  startIcon={<VisibilityIcon />}
                  sx={{ mb: 2 }}
                >
                  Visualize Graph
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EditIcon />}
                  sx={{ mb: 2 }}
                >
                  Edit Graph
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CloudDownloadIcon />}
                  sx={{ mb: 2 }}
                >
                  Export Graph
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseKGDetail}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
      
      {/* KG Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          const kg = sampleKGs.find(k => k.id === menuKGId);
          handleOpenKGDetail(kg);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          Visualize
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <CloudDownloadIcon fontSize="small" />
          </ListItemIcon>
          Export
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}

// KG Table Component
function KGTable({ kgs, handleOpenKGDetail, handleMenuOpen, getCategoryIcon }) {
  if (kgs.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No knowledge graphs found matching your criteria
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
        >
          Add New Knowledge Graph
        </Button>
      </Paper>
    );
  }
  
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Nodes</TableCell>
            <TableCell>Relationships</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {kgs.map((kg) => (
            <TableRow key={kg.id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getCategoryIcon(kg.category)}
                  <Typography sx={{ ml: 1 }}>
                    {kg.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{kg.category}</TableCell>
              <TableCell>{kg.nodes.toLocaleString()}</TableCell>
              <TableCell>{kg.relationships.toLocaleString()}</TableCell>
              <TableCell>{kg.lastUpdated}</TableCell>
              <TableCell>
                <Chip 
                  size="small" 
                  color={kg.status === 'active' ? 'success' : 'default'}
                  label={kg.status === 'active' ? 'Active' : 'Draft'}
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="View Details">
                  <IconButton size="small" onClick={() => handleOpenKGDetail(kg)}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Visualize">
                  <IconButton size="small">
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, kg.id)}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default KnowledgeGraphs; 