import React, { useState } from 'react';
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

const AgentWorkshop = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Form states
  const [agentDescription, setAgentDescription] = useState('');
  const [agentType, setAgentType] = useState('llm');
  const [activeStep, setActiveStep] = useState(0);
  
  // Blockchain validation states
  const [blockchainEnabled, setBlockchainEnabled] = useState(true);
  const [blockchainValidationStatus, setBlockchainValidationStatus] = useState(null);
  const [isValidatingBlockchain, setIsValidatingBlockchain] = useState(false);
  const [validationSteps, setValidationSteps] = useState([
    { label: 'Verify Agent Identity', completed: false, error: false },
    { label: 'Check Blockchain Connection', completed: false, error: false },
    { label: 'Validate Smart Contract', completed: false, error: false },
    { label: 'Register Agent', completed: false, error: false },
  ]);
  const [activeValidationStep, setActiveValidationStep] = useState(0);

  // Script/Prompt editing states
  const [editablePrompt, setEditablePrompt] = useState('');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [promptValidationError, setPromptValidationError] = useState(null);
  const [scriptContent, setScriptContent] = useState(
  `import org.neo4j.graphdb.GraphDatabaseService
import org.neo4j.logging.Log
import com.safeai.agent.AgentContext

class SecurityAnalyzerAgent {
    private final GraphDatabaseService db
    private final Log log
    
    SecurityAnalyzerAgent(AgentContext context) {
        this.db = context.graphDb
        this.log = context.log
    }
    
    def analyze(Map params) {
        log.info("Starting security analysis")
        
        // Agent implementation logic here
        
        return [
            status: "success",
            findings: []
        ]
    }
}`);
  const [scriptValidationResults, setScriptValidationResults] = useState(null);
  const [isValidatingScript, setIsValidatingScript] = useState(false);
  
  // Template selection states
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  
  // Example generated agent details
  const generatedAgent = {
    name: 'SecurityAnalyzer',
    type: 'llm',
    description: 'This agent analyzes code for security vulnerabilities, checking for common issues such as SQL injection, XSS, and buffer overflows. It provides detailed explanations of found vulnerabilities and suggests specific fixes.',
    capabilities: ['threat_detection', 'data_validation', 'compliance_check'],
    effectiveness_threshold: 0.85,
    ethics_guidelines: 'Follow established security best practices. Do not provide destructive exploit code. Always prioritize data protection.',
    security: {
      input_validation: true,
      output_validation: true,
      resource_monitoring: true
    },
    prompt_template: 'Analyze the following code for security vulnerabilities:\n\n{{code}}\n\nProvide a detailed report with:\n1. Identified vulnerabilities\n2. Severity rating\n3. Recommended fixes\n4. Security best practices'
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleAgentTypeChange = (event) => {
    setAgentType(event.target.value);
  };
  
  // Function to validate LLM prompt
  const validatePrompt = (prompt) => {
    // Check for placeholders
    if (!prompt.includes('{{') || !prompt.includes('}}')) {
      return "Warning: No input placeholders found. Your prompt should use {{variable}} syntax.";
    }
    
    // Check for instruction clarity
    if (prompt.length < 50) {
      return "Warning: Prompt seems too short. Consider providing more detailed instructions.";
    }
    
    return null;
  };

  // Function to validate Groovy script
  const validateGroovyScript = () => {
    setIsValidatingScript(true);
    
    // Simulate script validation
    setTimeout(() => {
      const hasError = Math.random() < 0.3; // 30% chance of error for demo
      
      if (hasError) {
        setScriptValidationResults({
          valid: false,
          errors: [
            { line: 15, message: "Missing semicolon at end of statement" },
            { line: 22, message: "Method 'analyze' should return a Map" }
          ]
        });
      } else {
        setScriptValidationResults({
          valid: true,
          warnings: [
            { line: 12, message: "Consider adding null check for parameters" }
          ]
        });
      }
      
      setIsValidatingScript(false);
    }, 2000);
  };

  // Handle prompt editing
  const handlePromptChange = (e) => {
    const newPrompt = e.target.value;
    setEditablePrompt(newPrompt);
    setPromptValidationError(validatePrompt(newPrompt));
  };

  // Handle script content change
  const handleScriptChange = (e) => {
    setScriptContent(e.target.value);
    setScriptValidationResults(null); // Reset validation when script changes
  };

  // Save edited prompt
  const savePromptChanges = () => {
    // In a real app, this would update the generatedAgent object
    setIsEditingPrompt(false);
  };
  
  // Simulate blockchain validation
  const simulateBlockchainValidation = () => {
    return new Promise((resolve) => {
      setIsValidatingBlockchain(true);
      setBlockchainValidationStatus('validating');
      setActiveValidationStep(0);
      
      // Reset all steps
      setValidationSteps(steps => steps.map(step => ({
        ...step,
        completed: false,
        error: false
      })));
      
      // Simulate the validation process with steps
      setTimeout(() => {
        // Step 1: Verify Agent Identity
        setValidationSteps(steps => {
          const newSteps = [...steps];
          newSteps[0].completed = true;
          return newSteps;
        });
        setActiveValidationStep(1);
        
        setTimeout(() => {
          // Step 2: Check Blockchain Connection
          setValidationSteps(steps => {
            const newSteps = [...steps];
            newSteps[1].completed = true;
            return newSteps;
          });
          setActiveValidationStep(2);
          
          setTimeout(() => {
            // Step 3: Validate Smart Contract
            setValidationSteps(steps => {
              const newSteps = [...steps];
              newSteps[2].completed = true;
              return newSteps;
            });
            setActiveValidationStep(3);
            
            setTimeout(() => {
              // Step 4: Register Agent
              setValidationSteps(steps => {
                const newSteps = [...steps];
                newSteps[3].completed = true;
                return newSteps;
              });
              
              // Final result
              setBlockchainValidationStatus('validated');
              setIsValidatingBlockchain(false);
              resolve();
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    });
  };
  
  // Enhanced create agent function with blockchain validation
  const handleCreateAgentWithBlockchain = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First validate on blockchain if enabled
      if (blockchainEnabled) {
        await simulateBlockchainValidation();
      }
      
      // Simulate API call to create agent
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
      setSuccess(true);
      setActiveStep(2);
    } catch (err) {
      setLoading(false);
      setError('Failed to create agent: ' + err.message);
    }
  };
  
  const handleCreateAgent = async () => {
    // Use the enhanced blockchain version
    await handleCreateAgentWithBlockchain();
  };
  
  const handleNext = () => {
    if (activeStep === 0) {
      // Move to preview step
      setActiveStep(1);
      setShowPreview(true);
      
      // If LLM agent, set editable prompt
      if (agentType === 'llm') {
        setEditablePrompt(generatedAgent.prompt_template);
      }
    } else if (activeStep === 1) {
      // Create the agent with blockchain validation
      handleCreateAgentWithBlockchain();
    }
  };
  
  const handleBack = () => {
    setActiveStep(activeStep - 1);
    if (activeStep === 1) {
      setShowPreview(false);
    }
  };
  
  const handleReset = () => {
    setAgentDescription('');
    setAgentType('llm');
    setActiveStep(0);
    setSuccess(false);
    setShowPreview(false);
    setBlockchainValidationStatus(null);
  };
  
  // Blockchain validation component
  const BlockchainValidationSection = () => (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <NetworkIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Blockchain Validation
          </Typography>
        </Box>
        
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={blockchainEnabled}
                onChange={(e) => setBlockchainEnabled(e.target.checked)}
                color="primary"
              />
            }
            label="Register agent on blockchain (recommended for production)"
          />
        </FormGroup>
        
        {blockchainEnabled && (
          <>
            <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
              Your agent will be registered on the blockchain, ensuring transparency and auditability.
            </Alert>
            
            {blockchainValidationStatus === 'validating' && (
              <Box sx={{ mt: 2 }}>
                <Stepper activeStep={activeValidationStep} orientation="vertical">
                  {validationSteps.map((step, index) => (
                    <Step key={step.label} completed={step.completed}>
                      <StepLabel 
                        error={step.error}
                        StepIconProps={{
                          icon: step.completed ? <CheckIcon color="success" /> : index + 1,
                        }}
                      >
                        {step.label}
                      </StepLabel>
                      {activeValidationStep === index && (
                        <StepContent>
                          <LinearProgress sx={{ mt: 1, mb: 1 }} />
                        </StepContent>
                      )}
                    </Step>
                  ))}
                </Stepper>
              </Box>
            )}
            
            {blockchainValidationStatus === 'validated' && (
              <Box sx={{ mt: 2, p: 2, bgcolor: alpha('#43a047', 0.05), borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" color="success.main">
                    Blockchain Validation Complete
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Your agent is ready to be registered on the blockchain during creation.
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    icon={<StarIcon />} 
                    label="Verified" 
                    color="success" 
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1 }} 
                  />
                  <Typography variant="caption" color="text.secondary">
                    Transaction hash: 0x7e8f9a...1b2c3d
                  </Typography>
                </Box>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
  
  // LLM Prompt editing component
  const LLMPromptEditor = () => (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CodeIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              LLM Prompt Template
            </Typography>
          </Box>
          <Button
            startIcon={isEditingPrompt ? <SaveIcon /> : <EditIcon />}
            size="small"
            onClick={() => isEditingPrompt ? savePromptChanges() : setIsEditingPrompt(true)}
          >
            {isEditingPrompt ? 'Save Changes' : 'Edit Prompt'}
          </Button>
        </Box>
        
        <TextField
          multiline
          rows={10}
          value={isEditingPrompt ? editablePrompt : generatedAgent.prompt_template}
          onChange={handlePromptChange}
          fullWidth
          variant="outlined"
          InputProps={{
            readOnly: !isEditingPrompt,
            sx: { fontFamily: 'monospace' }
          }}
        />
        
        {isEditingPrompt && promptValidationError && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {promptValidationError}
          </Alert>
        )}
        
        {isEditingPrompt && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Available Variables
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip label="{{code}}" size="small" onClick={() => setEditablePrompt(p => p + '{{code}}')} />
              <Chip label="{{context}}" size="small" onClick={() => setEditablePrompt(p => p + '{{context}}')} />
              <Chip label="{{request}}" size="small" onClick={() => setEditablePrompt(p => p + '{{request}}')} />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Click on variables to insert them at the cursor position
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Agent Name"
              value={agentDescription}
              onChange={(e) => setAgentDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={agentDescription}
              onChange={(e) => setAgentDescription(e.target.value)}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Agent Type</InputLabel>
              <Select
                value={agentType}
                onChange={(e) => setAgentType(e.target.value)}
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
                      background: agentType === 'script' && agentDescription.includes(capability.name)
                        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                        : 'transparent',
                      border: `1px solid ${agentType === 'script' && agentDescription.includes(capability.name)
                        ? alpha(theme.palette.primary.main, 0.2)
                        : alpha(theme.palette.common.white, 0.1)}`,
                      '&:hover': {
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                      },
                    }}
                    onClick={() => {
                      const newDescription = agentDescription.includes(capability.name)
                        ? agentDescription.replace(capability.name, '').trim()
                        : `${agentDescription} ${capability.name}`.trim();
                      setAgentDescription(newDescription);
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: agentType === 'script' && agentDescription.includes(capability.name)
                              ? alpha(theme.palette.primary.main, 0.1)
                              : alpha(theme.palette.common.white, 0.1),
                            color: agentType === 'script' && agentDescription.includes(capability.name)
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
                value={agentType === 'script' ? 'medium' : 'high'}
                onChange={(e) => {
                  if (agentType === 'script') {
                    setAgentType('script');
                  }
                }}
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
                      background: agentType === 'script' && agentDescription.includes(constraint)
                        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                        : 'transparent',
                      border: `1px solid ${agentType === 'script' && agentDescription.includes(constraint)
                        ? alpha(theme.palette.primary.main, 0.2)
                        : alpha(theme.palette.common.white, 0.1)}`,
                      '&:hover': {
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                      },
                    }}
                    onClick={() => {
                      const newDescription = agentDescription.includes(constraint)
                        ? agentDescription.replace(constraint, '').trim()
                        : `${agentDescription} ${constraint}`.trim();
                      setAgentDescription(newDescription);
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: agentType === 'script' && agentDescription.includes(constraint)
                              ? alpha(theme.palette.primary.main, 0.1)
                              : alpha(theme.palette.common.white, 0.1),
                            color: agentType === 'script' && agentDescription.includes(constraint)
                              ? theme.palette.primary.main
                              : theme.palette.text.secondary,
                          }}
                        >
                          <PsychologyIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1">{constraint}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Apply {constraint.toLowerCase()} constraints
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
      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Test Results
            </Typography>
            <Grid container spacing={2}>
              {[
                { name: 'Security Scan', status: 'success' },
                { name: 'Ethics Validation', status: 'success' },
                { name: 'Performance Test', status: 'warning' },
                { name: 'Integration Test', status: 'error' },
              ].map((test) => (
                <Grid item xs={12} sm={6} key={test.name}>
                  <Card
                    sx={{
                      background: `linear-gradient(135deg, ${alpha(
                        test.status === 'success'
                          ? theme.palette.success.main
                          : test.status === 'warning'
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                        0.1
                      )} 0%, ${alpha(
                        test.status === 'success'
                          ? theme.palette.success.main
                          : test.status === 'warning'
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                        0.05
                      )} 100%)`,
                      border: `1px solid ${alpha(
                        test.status === 'success'
                          ? theme.palette.success.main
                          : test.status === 'warning'
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                        0.2
                      )}`,
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(
                              test.status === 'success'
                                ? theme.palette.success.main
                                : test.status === 'warning'
                                ? theme.palette.warning.main
                                : theme.palette.error.main,
                              0.1
                            ),
                            color:
                              test.status === 'success'
                                ? theme.palette.success.main
                                : test.status === 'warning'
                                ? theme.palette.warning.main
                                : theme.palette.error.main,
                          }}
                        >
                          {test.status === 'success' ? (
                            <CheckIcon />
                          ) : test.status === 'warning' ? (
                            <WarningIcon />
                          ) : (
                            <ErrorIcon />
                          )}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1">{test.name}</Typography>
                          <Typography
                            variant="body2"
                            color={
                              test.status === 'success'
                                ? 'success.main'
                                : test.status === 'warning'
                                ? 'warning.main'
                                : 'error.main'
                            }
                          >
                            {test.status === 'success'
                              ? 'Passed'
                              : test.status === 'warning'
                              ? 'Warning'
                              : 'Failed'}
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
            Agent Workshop
          </Typography>
          <Typography color="text.secondary">
            Create and configure your AI agents
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            },
          }}
        >
          Save Agent
        </Button>
      </Box>

      {/* Stepper */}
      <Paper
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(
            theme.palette.background.paper,
            0.95
          )} 100%)`,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        }}
      >
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    color: activeStep >= index ? theme.palette.primary.main : theme.palette.text.secondary,
                  },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {step.description}
                </Typography>
                {renderStepContent(index)}
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mr: 1 }}
                    disabled={index === steps.length - 1}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button disabled={index === 0} onClick={handleBack}>
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Box>
  );
};

export default AgentWorkshop; 