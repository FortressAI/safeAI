import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Snackbar,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Shield as ShieldIcon,
  Link as LinkIcon,
  EmojiObjects as PrincipleIcon,
  Rule as RuleIcon,
  Balance as BalanceIcon,
  Gavel as LegalIcon,
  Info as InfoIcon,
  Save as SaveIcon,
  ClearAll as ClearIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Sample Ethics Knowledge Graph Data
const ethicsPrinciples = [
  {
    id: 1,
    name: 'Beneficence',
    description: 'Maximizing benefits while minimizing harms',
    relatedPrinciples: ['Non-maleficence', 'Justice'],
    confidence: 0.95,
    icon: <PrincipleIcon />,
    color: '#4CAF50',
    active: true,
  },
  {
    id: 2,
    name: 'Non-maleficence',
    description: 'Avoiding harm to individuals and society',
    relatedPrinciples: ['Beneficence', 'Justice'],
    confidence: 0.92,
    icon: <ShieldIcon />,
    color: '#2196F3',
    active: true,
  },
  {
    id: 3,
    name: 'Autonomy',
    description: 'Respecting individual rights and choices',
    relatedPrinciples: ['Justice', 'Privacy'],
    confidence: 0.88,
    icon: <BalanceIcon />,
    color: '#9C27B0',
    active: true,
  },
  {
    id: 4,
    name: 'Justice',
    description: 'Fair distribution of benefits and burdens',
    relatedPrinciples: ['Beneficence', 'Non-maleficence'],
    confidence: 0.90,
    icon: <LegalIcon />,
    color: '#FF9800',
    active: true,
  },
];

const MetricCard = ({ title, value, icon, color, trend }) => {
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

const PrincipleCard = ({ principle, onEdit, onDelete }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(principle);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(principle.id);
    handleMenuClose();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${alpha(principle.color, 0.1)} 0%, ${alpha(principle.color, 0.05)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(principle.color, 0.2)}`,
          borderRadius: 2,
          boxShadow: `0 4px 20px ${alpha(principle.color, 0.1)}`,
          '&:hover': {
            boxShadow: `0 8px 30px ${alpha(principle.color, 0.2)}`,
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
                  bgcolor: alpha(principle.color, 0.1),
                  mr: 2,
                }}
              >
                {principle.icon}
              </Box>
              <Box>
                <Typography variant="h6" color="textPrimary">
                  {principle.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Confidence: {(principle.confidence * 100).toFixed(0)}%
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleMenuOpen} size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="textSecondary" paragraph>
            {principle.description}
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
            {principle.relatedPrinciples.map((related) => (
              <Chip
                key={related}
                label={related}
                size="small"
                sx={{
                  bgcolor: alpha(principle.color, 0.1),
                  color: principle.color,
                }}
              />
            ))}
          </Box>
          <LinearProgress
            variant="determinate"
            value={principle.confidence * 100}
            sx={{
              mt: 2,
              height: 6,
              borderRadius: 3,
              bgcolor: alpha(principle.color, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: principle.color,
              },
            }}
          />
          {!principle.active && (
            <Chip
              label="Inactive"
              size="small"
              sx={{
                mt: 2,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
              }}
            />
          )}
        </CardContent>
      </Card>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Principle</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <RefreshIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Update Confidence</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Principle</ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default function EthicsKG() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrinciple, setSelectedPrinciple] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [principles, setPrinciples] = useState(ethicsPrinciples);
  const [newPrinciple, setNewPrinciple] = useState({
    name: '',
    description: '',
    relatedPrinciples: '',
    active: true,
    color: '#4f46e5',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Simulate data fetching with loading state
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPrinciples(ethicsPrinciples);
        setFetchError(null);
      } catch (error) {
        setFetchError('Failed to load ethics principles. Please try again.');
        console.error('Error fetching principles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePrincipleClick = (principle) => {
    setSelectedPrinciple(principle);
    setDialogOpen(true);
    
    if (principle) {
      setNewPrinciple({
        name: principle.name,
        description: principle.description,
        relatedPrinciples: principle.relatedPrinciples.join(', '),
        active: principle.active,
        color: principle.color,
      });
    } else {
      setNewPrinciple({
        name: '',
        description: '',
        relatedPrinciples: '',
        active: true,
        color: '#4f46e5',
      });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedPrinciple(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setNewPrinciple(prev => ({
      ...prev,
      [name]: name === 'active' ? checked : value,
    }));
  };

  const handleSavePrinciple = () => {
    setLoading(true);
    
    try {
      const relatedPrinciplesArray = newPrinciple.relatedPrinciples
        .split(',')
        .map(p => p.trim())
        .filter(p => p);
      
      // Simulate saving to an API
      setTimeout(() => {
        if (selectedPrinciple) {
          // Update existing principle
          setPrinciples(prev => 
            prev.map(p => p.id === selectedPrinciple.id 
              ? {
                  ...p,
                  name: newPrinciple.name,
                  description: newPrinciple.description,
                  relatedPrinciples: relatedPrinciplesArray,
                  active: newPrinciple.active,
                  color: newPrinciple.color,
                }
              : p
            )
          );
          setSnackbar({
            open: true,
            message: 'Principle updated successfully!',
            severity: 'success',
          });
        } else {
          // Add new principle
          const newId = Math.max(...principles.map(p => p.id)) + 1;
          const principle = {
            id: newId,
            name: newPrinciple.name,
            description: newPrinciple.description,
            relatedPrinciples: relatedPrinciplesArray,
            confidence: 0.85, // Default confidence for new principles
            icon: <PrincipleIcon />,
            color: newPrinciple.color,
            active: newPrinciple.active,
          };
          
          setPrinciples(prev => [...prev, principle]);
          setSnackbar({
            open: true,
            message: 'New principle added successfully!',
            severity: 'success',
          });
        }
        
        setLoading(false);
        handleDialogClose();
      }, 1000);
    } catch (error) {
      console.error('Error saving principle:', error);
      setSnackbar({
        open: true,
        message: 'Error saving principle. Please try again.',
        severity: 'error',
      });
      setLoading(false);
    }
  };

  const handleDeletePrinciple = (id) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPrinciples(prev => prev.filter(p => p.id !== id));
      setSnackbar({
        open: true,
        message: 'Principle deleted successfully!',
        severity: 'success',
      });
      setLoading(false);
    }, 800);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Filter principles based on search query and active tab
  const filteredPrinciples = principles.filter(principle => {
    const matchesSearch = principle.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        principle.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 0) return matchesSearch;
    if (activeTab === 1) return matchesSearch && principle.active;
    if (activeTab === 2) return matchesSearch && principle.relatedPrinciples.length > 0;
    
    return matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" color="textPrimary">
            Ethics Knowledge Graph
          </Typography>
          <Box display="flex" gap={2}>
            <Tooltip title="Refresh data">
              <IconButton onClick={() => window.location.reload()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handlePrincipleClick(null)}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                },
              }}
            >
              Add New Principle
            </Button>
          </Box>
        </Box>

        {fetchError && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {fetchError}
          </Alert>
        )}

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Total Principles"
              value={principles.length.toString()}
              icon={<PrincipleIcon />}
              color={theme.palette.primary.main}
              trend={"+1"}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Relationships"
              value={principles.reduce((sum, p) => sum + p.relatedPrinciples.length, 0).toString()}
              icon={<LinkIcon />}
              color={theme.palette.success.main}
              trend={"+2"}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Avg. Confidence"
              value={`${Math.round(principles.reduce((sum, p) => sum + p.confidence, 0) / principles.length * 100)}%`}
              icon={<CheckIcon />}
              color={theme.palette.info.main}
              trend={"+2%"}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Active Rules"
              value="12"
              icon={<RuleIcon />}
              color={theme.palette.warning.main}
              trend={"+3"}
            />
          </Grid>
        </Grid>

        <Box mb={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search ethical principles..."
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
          <Tab label="All Principles" />
          <Tab label="Core Principles" />
          <Tab label="Derived Rules" />
        </Tabs>

        {loading && principles.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <AnimatePresence mode="wait">
            <Grid container spacing={3}>
              {filteredPrinciples.map((principle) => (
                <Grid item xs={12} md={6} lg={4} key={principle.id}>
                  <PrincipleCard 
                    principle={principle} 
                    onEdit={handlePrincipleClick} 
                    onDelete={handleDeletePrinciple}
                  />
                </Grid>
              ))}
              {filteredPrinciples.length === 0 && !loading && (
                <Grid item xs={12}>
                  <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    p={4}
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.paper, 0.5),
                    }}
                  >
                    <InfoIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                    <Typography>
                      {searchQuery ? 'No principles match your search criteria.' : 'No principles found.'}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </AnimatePresence>
        )}

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
            {selectedPrinciple ? 'Edit Ethical Principle' : 'Add New Ethical Principle'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                name="name"
                label="Principle Name"
                variant="outlined"
                value={newPrinciple.name}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                name="description"
                label="Description"
                variant="outlined"
                multiline
                rows={3}
                value={newPrinciple.description}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                name="relatedPrinciples"
                label="Related Principles (comma separated)"
                variant="outlined"
                value={newPrinciple.relatedPrinciples}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                helperText="Enter principle names separated by commas"
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Color Theme</InputLabel>
                <Select
                  name="color"
                  value={newPrinciple.color}
                  onChange={handleInputChange}
                  label="Color Theme"
                >
                  <MenuItem value="#4f46e5">Indigo</MenuItem>
                  <MenuItem value="#4CAF50">Green</MenuItem>
                  <MenuItem value="#2196F3">Blue</MenuItem>
                  <MenuItem value="#9C27B0">Purple</MenuItem>
                  <MenuItem value="#FF9800">Orange</MenuItem>
                  <MenuItem value="#f43f5e">Red</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch 
                    name="active"
                    checked={newPrinciple.active} 
                    onChange={handleInputChange}
                  />
                }
                label="Active"
                sx={{ mb: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleDialogClose}
              startIcon={<ClearIcon />}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSavePrinciple}
              startIcon={<SaveIcon />}
              disabled={!newPrinciple.name || !newPrinciple.description || loading}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                selectedPrinciple ? 'Save Changes' : 'Add Principle'
              )}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </motion.div>
  );
}