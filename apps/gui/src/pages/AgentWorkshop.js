import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  TextField, 
  Button, 
  Tabs, 
  Tab, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormGroup,
  FormControlLabel,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Stack,
  Collapse,
  OutlinedInput,
  Avatar,
  useTheme,
  Badge,
  Container
} from '@mui/material';
import { alpha } from '@mui/material/styles';
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
  Save as SaveIcon,
  Build as BuildIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Help as HelpIcon,
  AddCircleOutline as AddCircleOutlineIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import PageHeader from '../components/shared/PageHeader';
import TabPanel from '../components/shared/TabPanel';
import ErrorFallback from '../components/shared/ErrorFallback';
import MetricCard from '../components/shared/MetricCard';
import AgentConfigCard from '../components/shared/AgentConfigCard';

/**
 * ErrorFallback component for error boundary
 * @param {object} props - Component props
 * @returns {JSX.Element} ErrorFallback component
 */
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

/**
 * CapabilityCard component for displaying agent capabilities
 * @param {object} props - Component props
 * @returns {JSX.Element} CapabilityCard component
 */
const CapabilityCard = ({ capability, isSelected, onClick, theme }) => (
  <Card
    sx={{
      cursor: 'pointer',
      background: isSelected
        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
        : 'transparent',
      border: `1px solid ${isSelected
        ? alpha(theme.palette.primary.main, 0.2)
        : alpha(theme.palette.common.white, 0.1)}`,
      '&:hover': {
        borderColor: alpha(theme.palette.primary.main, 0.3),
      },
    }}
    onClick={onClick}
    aria-pressed={isSelected}
    role="button"
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: isSelected
              ? alpha(theme.palette.primary.main, 0.1)
              : alpha(theme.palette.common.white, 0.1),
            color: isSelected
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
          }}
        >
          <SmartToyIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1">{capability.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {capability.description}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

CapabilityCard.propTypes = {
  capability: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};

/**
 * ConstraintCard component for displaying ethical constraints
 * @param {object} props - Component props
 * @returns {JSX.Element} ConstraintCard component
 */
const ConstraintCard = ({ constraint, isSelected, onClick, theme }) => (
  <Card
    sx={{
      cursor: 'pointer',
      background: isSelected
        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
        : 'transparent',
      border: `1px solid ${isSelected
        ? alpha(theme.palette.primary.main, 0.2)
        : alpha(theme.palette.common.white, 0.1)}`,
      '&:hover': {
        borderColor: alpha(theme.palette.primary.main, 0.3),
      },
    }}
    onClick={onClick}
    aria-pressed={isSelected}
    role="button"
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: isSelected
              ? alpha(theme.palette.primary.main, 0.1)
              : alpha(theme.palette.common.white, 0.1),
            color: isSelected
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
          }}
        >
          <SecurityIcon />
        </Avatar>
        <Typography variant="subtitle1">{constraint}</Typography>
      </Box>
    </CardContent>
  </Card>
);

ConstraintCard.propTypes = {
  constraint: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};

// Constants
const agentTypes = [
  { value: 'llm', label: 'LLM-based Agent' },
  { value: 'groovy', label: 'Groovy Script Agent' },
];

const availableCapabilities = [
  { id: 1, name: 'data_analysis', description: 'Analyze data patterns and anomalies' },
  { id: 2, name: 'threat_detection', description: 'Identify security threats in data' },
  { id: 3, name: 'compliance_check', description: 'Validate compliance with standards' },
  { id: 4, name: 'query_optimization', description: 'Optimize Cypher queries' },
  { id: 5, name: 'kg_integration', description: 'Integrate with knowledge graphs' },
  { id: 6, name: 'blockchain_tx', description: 'Execute blockchain transactions' },
  { id: 7, name: 'audit_logging', description: 'Create detailed audit logs' },
  { id: 8, name: 'data_validation', description: 'Validate data integrity and quality' },
];

const ethicalConstraints = [
  'Fairness', 
  'Transparency', 
  'Privacy', 
  'Accountability', 
  'Safety'
];

const steps = [
  {
    label: 'Basic Information',
    description: 'Set up the basic configuration for your agent',
  },
  {
    label: 'Capabilities',
    description: 'Define what your agent can do',
  },
  {
    label: 'Security & Ethics',
    description: 'Configure security and ethical constraints',
  },
  {
    label: 'Testing',
    description: 'Test your agent before deployment',
  },
];

const securityLevels = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const defaultAgent = {
  id: '',
  name: '',
  description: '',
  type: 'llm',
  capabilities: [],
  securityLevel: 'high',
  ethicalConstraints: [],
  promptTemplate: '',
  scriptContent: '',
  blockchainEnabled: true,
  version: '1.0.0',
  createdAt: '',
  updatedAt: '',
};

/**
 * Validates the agent object
 * @param {object} agent - The agent to validate
 * @returns {object} Validation errors object
 */
const validateAgent = (agent) => {
  const errors = {};
  if (!agent.name.trim()) errors.name = 'Name is required';
  if (!agent.description.trim()) errors.description = 'Description is required';
  if (!agent.type) errors.type = 'Type is required';
  if (agent.type === 'llm' && !agent.promptTemplate.trim()) {
    errors.promptTemplate = 'Prompt template is required for LLM agents';
  }
  if (agent.type === 'groovy' && !agent.scriptContent.trim()) {
    errors.scriptContent = 'Script content is required for Groovy agents';
  }
  return errors;
};

/**
 * Main component for creating and editing agent configurations
 * @returns {JSX.Element} AgentWorkshop component
 */
const AgentWorkshop = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  
  // State management
  const [agent, setAgent] = useState(defaultAgent);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [validationEnabled, setValidationEnabled] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    type: '',
    description: '',
  });
  
  // Load agent if editing
  useEffect(() => {
    if (id) {
      loadAgent(id);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [id]);

  // Memoized values
  const isEditMode = useMemo(() => Boolean(id), [id]);
  const isFormValid = useMemo(() => Object.keys(validateAgent(agent)).length === 0, [agent]);
  const activeStepData = useMemo(() => steps[activeStep] || {}, [activeStep]);

  // Load agent function with controller for cancellation and timeout
  const loadAgent = useCallback(async (agentId) => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 10000); // 10s timeout
      setTimeoutId(tid);

      const response = await axios.get(`/api/agents/${agentId}`, {
        signal: controller.signal
      });
      
      if (response.data) {
        setAgent(response.data);
        enqueueSnackbar('Agent loaded successfully', { variant: 'success' });
      } else {
        throw new Error('Agent data not found');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        enqueueSnackbar('Request timed out. Please try again.', { variant: 'error' });
      } else if (error.response) {
        const statusCode = error.response.status;
        let errorMessage = 'Failed to load agent';
        
        if (statusCode === 404) {
          errorMessage = 'Agent not found';
        } else if (statusCode === 403) {
          errorMessage = 'You do not have permission to access this agent';
        }
        
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } else {
        enqueueSnackbar('Failed to load agent: ' + (error.message || 'Unknown error'), { variant: 'error' });
      }
    } finally {
      setIsLoading(false);
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  }, [enqueueSnackbar]);

  // Save agent function with validation
  const saveAgent = useCallback(async () => {
    setValidationEnabled(true);
    const validationErrors = validateAgent(agent);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      enqueueSnackbar('Please fix the validation errors', { variant: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      const requestData = {
        ...agent,
        updatedAt: new Date().toISOString()
      };

      if (id) {
        await axios.put(`/api/agents/${id}`, requestData);
        enqueueSnackbar('Agent updated successfully', { variant: 'success' });
      } else {
        requestData.createdAt = new Date().toISOString();
        const response = await axios.post('/api/agents', requestData);
        enqueueSnackbar('Agent created successfully', { variant: 'success' });
        navigate(`/agent-workshop/${response.data.id}`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save agent';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsSaving(false);
    }
  }, [agent, id, navigate, enqueueSnackbar]);

  // Open confirmation dialog before deleting
  const confirmDelete = useCallback(() => {
    setConfirmDialogOpen(true);
  }, []);

  // Delete agent function with confirmation and error handling
  const deleteAgent = useCallback(async () => {
    setConfirmDialogOpen(false);
    setIsDeleting(true);
    
    try {
      await axios.delete(`/api/agents/${id}`);
      enqueueSnackbar('Agent deleted successfully', { variant: 'success' });
      navigate('/agent-workshop');
    } catch (error) {
      const statusCode = error.response?.status;
      let errorMessage = 'Failed to delete agent';
      
      if (statusCode === 404) {
        errorMessage = 'Agent not found';
      } else if (statusCode === 403) {
        errorMessage = 'You do not have permission to delete this agent';
      }
      
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsDeleting(false);
    }
  }, [id, navigate, enqueueSnackbar]);

  // Handle form changes with validation
  const handleChange = useCallback((field) => (event) => {
    const value = event.target.value;
    setAgent(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
    
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Handle capability selection
  const handleCapabilityToggle = useCallback((capabilityId) => {
    setAgent(prev => {
      const capabilities = prev.capabilities.includes(capabilityId)
        ? prev.capabilities.filter(id => id !== capabilityId)
        : [...prev.capabilities, capabilityId];
      return {
        ...prev,
        capabilities,
        updatedAt: new Date().toISOString()
      };
    });
  }, []);

  // Handle ethical constraint selection
  const handleConstraintToggle = useCallback((constraint) => {
    setAgent(prev => {
      const ethicalConstraints = prev.ethicalConstraints.includes(constraint)
        ? prev.ethicalConstraints.filter(c => c !== constraint)
        : [...prev.ethicalConstraints, constraint];
      return {
        ...prev,
        ethicalConstraints,
        updatedAt: new Date().toISOString()
      };
    });
  }, []);

  // Handle blockchain toggle
  const handleBlockchainToggle = useCallback((event) => {
    setAgent(prev => ({
      ...prev,
      blockchainEnabled: event.target.checked,
      updatedAt: new Date().toISOString()
    }));
  }, []);

  // Handle next step with validation
  const handleNext = useCallback(() => {
    if (activeStep === steps.length - 1) {
      saveAgent();
    } else {
      if (activeStep === 0) {
        // Validate basic info before proceeding
        const basicInfoErrors = {
          name: !agent.name.trim() ? 'Name is required' : undefined,
          description: !agent.description.trim() ? 'Description is required' : undefined,
          type: !agent.type ? 'Type is required' : undefined
        };
        
        const hasErrors = Object.values(basicInfoErrors).some(error => error !== undefined);
        
        if (hasErrors) {
          setErrors(prev => ({
            ...prev,
            ...basicInfoErrors
          }));
          setValidationEnabled(true);
          enqueueSnackbar('Please fill in required fields', { variant: 'error' });
          return;
        }
      }
      
      setActiveStep(prev => prev + 1);
    }
  }, [activeStep, agent, saveAgent, enqueueSnackbar]);

  // Handle back step
  const handleBack = useCallback(() => {
    setActiveStep(prev => prev - 1);
  }, []);

  // Handle reset
  const handleReset = useCallback(() => {
    setAgent(defaultAgent);
    setActiveStep(0);
    setShowPreview(false);
    setErrors({});
    setValidationEnabled(false);
  }, []);

  // Handle cancellation and navigation back
  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Toggle preview mode
  const togglePreview = useCallback(() => {
    setShowPreview(prev => !prev);
  }, []);

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // TODO: Implement actual refresh logic
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to refresh agents:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleCreateDialogOpen = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const handleCreateDialogClose = useCallback(() => {
    setIsCreateDialogOpen(false);
    setActiveStep(0);
    setNewAgent({ name: '', type: '', description: '' });
  }, []);

  // Render step content with improved separation of concerns
  const renderStepContent = useCallback((step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Agent Name"
              value={agent.name}
              onChange={handleChange('name')}
              error={validationEnabled && !!errors.name}
              helperText={validationEnabled && errors.name}
              sx={{ mb: 2 }}
              inputProps={{
                'aria-label': 'Agent name',
                'aria-required': 'true',
                'aria-invalid': validationEnabled && !!errors.name
              }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={agent.description}
              onChange={handleChange('description')}
              error={validationEnabled && !!errors.description}
              helperText={validationEnabled && errors.description}
              multiline
              rows={3}
              sx={{ mb: 2 }}
              inputProps={{
                'aria-label': 'Agent description',
                'aria-required': 'true',
                'aria-invalid': validationEnabled && !!errors.description
              }}
              required
            />
            <FormControl 
              fullWidth 
              error={validationEnabled && !!errors.type}
              required
            >
              <InputLabel id="agent-type-label">Agent Type</InputLabel>
              <Select
                labelId="agent-type-label"
                id="agent-type-select"
                value={agent.type}
                onChange={handleChange('type')}
                label="Agent Type"
                inputProps={{
                  'aria-label': 'Agent type',
                  'aria-required': 'true',
                  'aria-invalid': validationEnabled && !!errors.type
                }}
              >
                {agentTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
              {validationEnabled && errors.type && (
                <Typography color="error" variant="caption">
                  {errors.type}
                </Typography>
              )}
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Select Capabilities
            </Typography>
            <Grid container spacing={2}>
              {availableCapabilities.map((capability) => (
                <Grid item xs={12} sm={6} key={capability.id}>
                  <CapabilityCard
                    capability={capability}
                    isSelected={agent.capabilities.includes(capability.id)}
                    onClick={() => handleCapabilityToggle(capability.id)}
                    theme={theme}
                  />
                </Grid>
              ))}
            </Grid>
            {agent.capabilities.length === 0 && validationEnabled && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <AlertTitle>No capabilities selected</AlertTitle>
                <Typography variant="body2">
                  It's recommended to select at least one capability for your agent.
                </Typography>
              </Alert>
            )}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Security Level
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="security-level-label">Security Level</InputLabel>
              <Select
                labelId="security-level-label"
                id="security-level-select"
                value={agent.securityLevel}
                onChange={handleChange('securityLevel')}
                label="Security Level"
                inputProps={{
                  'aria-label': 'Security level'
                }}
              >
                {securityLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="subtitle1" gutterBottom>
              Ethical Constraints
            </Typography>
            <Grid container spacing={2}>
              {ethicalConstraints.map((constraint) => (
                <Grid item xs={12} sm={6} key={constraint}>
                  <ConstraintCard
                    constraint={constraint}
                    isSelected={agent.ethicalConstraints.includes(constraint)}
                    onClick={() => handleConstraintToggle(constraint)}
                    theme={theme}
                  />
                </Grid>
              ))}
            </Grid>
            {agent.ethicalConstraints.length === 0 && validationEnabled && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <AlertTitle>No ethical constraints selected</AlertTitle>
                <Typography variant="body2">
                  It's recommended to select at least one ethical constraint for your agent.
                </Typography>
              </Alert>
            )}
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            {agent.type === 'llm' ? (
              <TextField
                fullWidth
                label="Prompt Template"
                value={agent.promptTemplate}
                onChange={handleChange('promptTemplate')}
                error={validationEnabled && !!errors.promptTemplate}
                helperText={validationEnabled && errors.promptTemplate}
                multiline
                rows={6}
                sx={{ mb: 2 }}
                inputProps={{
                  'aria-label': 'Prompt template for LLM agent',
                  'aria-required': 'true',
                  'aria-invalid': validationEnabled && !!errors.promptTemplate
                }}
                required
              />
            ) : (
              <TextField
                fullWidth
                label="Script Content"
                value={agent.scriptContent}
                onChange={handleChange('scriptContent')}
                error={validationEnabled && !!errors.scriptContent}
                helperText={validationEnabled && errors.scriptContent}
                multiline
                rows={6}
                sx={{ mb: 2 }}
                inputProps={{
                  'aria-label': 'Script content for Groovy agent',
                  'aria-required': 'true',
                  'aria-invalid': validationEnabled && !!errors.scriptContent
                }}
                required
              />
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={agent.blockchainEnabled}
                  onChange={handleBlockchainToggle}
                  color="primary"
                  inputProps={{
                    'aria-label': 'Enable blockchain verification'
                  }}
                />
              }
              label="Enable Blockchain Verification"
            />
            
            <Box sx={{ mt: 3 }}>
              <Alert severity="info">
                <AlertTitle>Testing Instructions</AlertTitle>
                <Typography variant="body2">
                  Before deploying your agent, it's recommended to test it in a controlled environment.
                  This will help ensure that it functions as expected and meets your security requirements.
                </Typography>
              </Alert>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  }, [
    agent, 
    errors, 
    theme, 
    handleChange, 
    handleCapabilityToggle, 
    handleConstraintToggle, 
    handleBlockchainToggle,
    validationEnabled
  ]);

  // Confirm dialog component for delete operation
  const renderConfirmDialog = useCallback(() => (
    <Dialog
      open={confirmDialogOpen}
      onClose={() => setConfirmDialogOpen(false)}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography id="confirm-dialog-description">
          Are you sure you want to delete this agent? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setConfirmDialogOpen(false)} 
          color="primary"
          aria-label="Cancel deletion"
        >
          Cancel
        </Button>
        <Button 
          onClick={deleteAgent} 
          color="error" 
          variant="contained"
          disabled={isDeleting}
          aria-label="Confirm deletion"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  ), [confirmDialogOpen, isDeleting, deleteAgent]);

  const stepsForNewAgent = [
    {
      label: 'Basic Information',
      content: (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Agent Name"
            value={newAgent.name}
            onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Agent Type</InputLabel>
            <Select
              value={newAgent.type}
              label="Agent Type"
              onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value })}
            >
              {agentTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={newAgent.description}
            onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
          />
        </Box>
      ),
    },
    {
      label: 'Configuration',
      content: (
        <Box sx={{ mt: 2 }}>
          {/* Add configuration fields here */}
          <Typography color="text.secondary">
            Configure agent parameters and capabilities
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Review',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Review your agent configuration
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Name: {newAgent.name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Type: {agentTypes.find(t => t.value === newAgent.type)?.label}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Description: {newAgent.description}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      ),
    },
  ];

  const handleSubmit = () => {
    console.log('Submitting agent configuration');
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Box sx={{ width: '100%' }}>
        <PageHeader
          title="Agent Workshop"
          subtitle="Create and manage intelligent agents"
          icon={<SmartToyIcon />}
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
            <Tab label="All Agents" />
            <Tab label="Running" />
            <Tab label="Idle" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {agents.map((agent, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <AgentConfigCard
                  name={agent.name}
                  description={agent.description}
                  status={agent.status}
                  metrics={agent.metrics}
                  onAction={(action) => handleAgentAction(action, agent)}
                />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {agents.filter(agent => agent.status === 'active').map((agent, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <AgentConfigCard
                  name={agent.name}
                  description={agent.description}
                  status={agent.status}
                  metrics={agent.metrics}
                  onAction={(action) => handleAgentAction(action, agent)}
                />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {agents.filter(agent => agent.status === 'idle').map((agent, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <AgentConfigCard
                  name={agent.name}
                  description={agent.description}
                  status={agent.status}
                  metrics={agent.metrics}
                  onAction={(action) => handleAgentAction(action, agent)}
                />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Create Agent Dialog */}
        <Dialog
          open={isCreateDialogOpen}
          onClose={handleCreateDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AddCircleOutlineIcon color="primary" />
              <Typography variant="h6">Create New Agent</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              <Step>
                <StepLabel>Basic Information</StepLabel>
              </Step>
              <Step>
                <StepLabel>Configuration</StepLabel>
              </Step>
              <Step>
                <StepLabel>Review</StepLabel>
              </Step>
            </Stepper>

            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Agent Name"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={newAgent.description}
                    onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={newAgent.type}
                      onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value })}
                      label="Type"
                    >
                      <MenuItem value="task">Task Agent</MenuItem>
                      <MenuItem value="monitor">Monitor Agent</MenuItem>
                      <MenuItem value="analyzer">Analyzer Agent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Configuration"
                    value={newAgent.config}
                    onChange={(e) => setNewAgent({ ...newAgent, config: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newAgent.autoStart}
                        onChange={(e) => setNewAgent({ ...newAgent, autoStart: e.target.checked })}
                      />
                    }
                    label="Auto-start on creation"
                  />
                </Grid>
              </Grid>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>Review Configuration</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                    <Typography>{newAgent.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                    <Typography>{newAgent.type}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                    <Typography>{newAgent.description}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Configuration</Typography>
                    <Typography>{newAgent.config}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Auto-start</Typography>
                    <Typography>{newAgent.autoStart ? 'Yes' : 'No'}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            {activeStep > 0 && (
              <Button onClick={handleBack}>Back</Button>
            )}
            {activeStep < 2 ? (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button variant="contained" onClick={handleCreate}>
                Create
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
      
      {renderConfirmDialog()}
    </ErrorBoundary>
  );
};

export default AgentWorkshop; 