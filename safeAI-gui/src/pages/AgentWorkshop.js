import React, { useState, useEffect } from 'react';
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
  Badge
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
  TestTube as TestIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';

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

// Agent types
const agentTypes = [
  { value: 'llm', label: 'LLM-based Agent' },
  { value: 'groovy', label: 'Groovy Script Agent' },
];

// Sample list of capabilities
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

// Add agent interface
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

const AgentWorkshop = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  // State management
  const [agent, setAgent] = useState(defaultAgent);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  
  // Load agent if editing
  useEffect(() => {
    if (id) {
      loadAgent(id);
    }
  }, [id]);

  // Load agent function
  const loadAgent = async (agentId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/agents/${agentId}`);
      setAgent(response.data);
      enqueueSnackbar('Agent loaded successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to load agent', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Save agent function
  const saveAgent = async () => {
    setIsSaving(true);
    try {
      if (id) {
        await axios.put(`/api/agents/${id}`, agent);
        enqueueSnackbar('Agent updated successfully', { variant: 'success' });
      } else {
        const response = await axios.post('/api/agents', agent);
        enqueueSnackbar('Agent created successfully', { variant: 'success' });
        navigate(`/agent-workshop/${response.data.id}`);
      }
    } catch (error) {
      enqueueSnackbar('Failed to save agent', { variant: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete agent function
  const deleteAgent = async () => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;
    
    try {
      await axios.delete(`/api/agents/${id}`);
      enqueueSnackbar('Agent deleted successfully', { variant: 'success' });
      navigate('/agent-workshop');
    } catch (error) {
      enqueueSnackbar('Failed to delete agent', { variant: 'error' });
    }
  };

  // Handle form changes
  const handleChange = (field) => (event) => {
    setAgent(prev => ({
      ...prev,
      [field]: event.target.value,
      updatedAt: new Date().toISOString()
    }));
  };

  // Handle capability selection
  const handleCapabilityToggle = (capabilityId) => {
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
  };

  // Handle ethical constraint selection
  const handleConstraintToggle = (constraint) => {
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
  };

  // Handle blockchain toggle
  const handleBlockchainToggle = (event) => {
    setAgent(prev => ({
      ...prev,
      blockchainEnabled: event.target.checked,
      updatedAt: new Date().toISOString()
    }));
  };

  // Handle next step
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      saveAgent();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Handle reset
  const handleReset = () => {
    setAgent(defaultAgent);
    setActiveStep(0);
    setShowPreview(false);
  };

  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Agent Name"
              value={agent.name}
              onChange={handleChange('name')}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={agent.description}
              onChange={handleChange('description')}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Agent Type</InputLabel>
              <Select
                value={agent.type}
                onChange={handleChange('type')}
                label="Agent Type"
              >
                {agentTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
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
                  <Card
                    sx={{
                      cursor: 'pointer',
                      background: agent.capabilities.includes(capability.id)
                        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                        : 'transparent',
                      border: `1px solid ${agent.capabilities.includes(capability.id)
                        ? alpha(theme.palette.primary.main, 0.2)
                        : alpha(theme.palette.common.white, 0.1)}`,
                      '&:hover': {
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                      },
                    }}
                    onClick={() => handleCapabilityToggle(capability.id)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: agent.capabilities.includes(capability.id)
                              ? alpha(theme.palette.primary.main, 0.1)
                              : alpha(theme.palette.common.white, 0.1),
                            color: agent.capabilities.includes(capability.id)
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
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Security Level
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Security Level</InputLabel>
              <Select
                value={agent.securityLevel}
                onChange={handleChange('securityLevel')}
                label="Security Level"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="subtitle1" gutterBottom>
              Ethical Constraints
            </Typography>
            <Grid container spacing={2}>
              {['Fairness', 'Transparency', 'Privacy', 'Accountability', 'Safety'].map((constraint) => (
                <Grid item xs={12} sm={6} key={constraint}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      background: agent.ethicalConstraints.includes(constraint)
                        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                        : 'transparent',
                      border: `1px solid ${agent.ethicalConstraints.includes(constraint)
                        ? alpha(theme.palette.primary.main, 0.2)
                        : alpha(theme.palette.common.white, 0.1)}`,
                      '&:hover': {
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                      },
                    }}
                    onClick={() => handleConstraintToggle(constraint)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: agent.ethicalConstraints.includes(constraint)
                              ? alpha(theme.palette.primary.main, 0.1)
                              : alpha(theme.palette.common.white, 0.1),
                            color: agent.ethicalConstraints.includes(constraint)
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
                </Grid>
              ))}
            </Grid>
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
                multiline
                rows={6}
                sx={{ mb: 2 }}
              />
            ) : (
              <TextField
                fullWidth
                label="Script Content"
                value={agent.scriptContent}
                onChange={handleChange('scriptContent')}
                multiline
                rows={6}
                sx={{ mb: 2 }}
              />
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={agent.blockchainEnabled}
                  onChange={handleBlockchainToggle}
                  color="primary"
                />
              }
              label="Enable Blockchain Verification"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
            {id ? 'Edit Agent' : 'Create New Agent'}
          </Typography>
          <Typography color="text.secondary">
            {id ? 'Modify your existing agent' : 'Configure a new AI agent'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {id && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={deleteAgent}
            >
              Delete
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveAgent}
            disabled={isSaving}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              },
            }}
          >
            {isSaving ? 'Saving...' : 'Save Agent'}
          </Button>
        </Box>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>
              <Typography variant="subtitle2">{step.label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Content */}
      <Card sx={{ p: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {renderStepContent(activeStep)}
            
            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={activeStep === steps.length - 1 && isSaving}
              >
                {activeStep === steps.length - 1 ? 'Save' : 'Next'}
              </Button>
            </Box>
          </>
        )}
      </Card>
    </Box>
  );
};

export default AgentWorkshop; 