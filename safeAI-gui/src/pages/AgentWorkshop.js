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
  Collapse
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LinkIcon from '@mui/icons-material/Link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import VerifiedIcon from '@mui/icons-material/Verified';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';

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

function AgentWorkshop() {
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
  
  // Steps for the agent creation
  const steps = ['Describe Agent', 'Review & Validate', 'Create Agent'];
  
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
          <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
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
                          icon: step.completed ? <CheckCircleIcon color="success" /> : index + 1,
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
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" color="success.main">
                    Blockchain Validation Complete
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Your agent is ready to be registered on the blockchain during creation.
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    icon={<VerifiedIcon />} 
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
            <DescriptionIcon color="primary" sx={{ mr: 1 }} />
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
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Agent Workshop
      </Typography>
      
      <Paper elevation={2} sx={{ mt: 2, mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<PsychologyIcon />} label="Create from Description" />
          <Tab icon={<SmartToyIcon />} label="Create from Template" />
          <Tab icon={<CodeIcon />} label="Custom Script" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid>
            
            {activeStep === 0 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Describe Your Agent
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Describe what you want your agent to do in natural language. Our system will generate a complete agent definition based on your description.
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Agent Description"
                    multiline
                    rows={6}
                    value={agentDescription}
                    onChange={(e) => setAgentDescription(e.target.value)}
                    fullWidth
                    placeholder="Create an agent that analyzes code for security vulnerabilities. It should check for common issues like SQL injection, XSS, and buffer overflows. The agent should provide detailed explanations of found vulnerabilities and suggest fixes."
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Agent Type</InputLabel>
                    <Select
                      value={agentType}
                      label="Agent Type"
                      onChange={handleAgentTypeChange}
                    >
                      {agentTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            
            {activeStep === 1 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Review Generated Agent
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Please review the generated agent definition below. You can proceed to create the agent or go back to modify your description.
                  </Alert>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <SmartToyIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">
                          {generatedAgent.name}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Type:</strong> {agentType === 'llm' ? 'LLM-based Agent' : 'Groovy Script Agent'}
                      </Typography>
                      
                      <Typography variant="body2" paragraph>
                        {generatedAgent.description}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Capabilities:</strong>
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        {generatedAgent.capabilities.map((cap) => (
                          <Chip 
                            key={cap} 
                            label={cap} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Effectiveness Threshold:</strong> {generatedAgent.effectiveness_threshold}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Ethics Guidelines:</strong>
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {generatedAgent.ethics_guidelines}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SecurityIcon color="success" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="success.main">
                          Security Validation Passed
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                  
                  {/* Add Blockchain Validation Section */}
                  {blockchainEnabled && (
                    <BlockchainValidationSection />
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  {agentType === 'llm' ? (
                    <LLMPromptEditor />
                  ) : (
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CodeIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">
                            Groovy Script
                          </Typography>
                        </Box>
                        
                        <TextField
                          multiline
                          rows={10}
                          value={scriptContent}
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            readOnly: true,
                            sx: { fontFamily: 'monospace' }
                          }}
                        />
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </>
            )}
            
            {activeStep === 2 && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Agent Created Successfully!
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Your agent "{generatedAgent.name}" has been created and is ready to use.
                  </Typography>
                  <Button variant="contained" color="primary" onClick={handleReset} sx={{ mt: 2 }}>
                    Create Another Agent
                  </Button>
                </Box>
              </Grid>
            )}
            
            {activeStep < 2 && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  {activeStep > 0 && (
                    <Button 
                      onClick={handleBack} 
                      sx={{ mr: 1 }}
                      disabled={loading}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={loading || (activeStep === 0 && !agentDescription.trim())}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : activeStep === 1 ? 'Create Agent' : 'Next'}
                  </Button>
                </Box>
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </Grid>
            )}
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Create from Template
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Choose from pre-defined agent templates to quickly create specialized agents.
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search Templates"
                value={templateSearchQuery}
                onChange={(e) => setTemplateSearchQuery(e.target.value)}
                placeholder="Search by name, capability, or description..."
                sx={{ mb: 3 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {/* Template Cards */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined" sx={{ 
                    height: '100%',
                    transition: 'all 0.2s ease',
                    '&:hover': { boxShadow: 3 },
                    cursor: 'pointer',
                    borderColor: selectedTemplate === 'security' ? 'primary.main' : 'inherit',
                    bgcolor: selectedTemplate === 'security' ? alpha('#43a047', 0.05) : 'inherit'
                  }}
                  onClick={() => setSelectedTemplate('security')}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <SecurityIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Security Analyzer</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Analyzes code and data for security vulnerabilities and suggests fixes.
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        <Chip label="threat_detection" size="small" />
                        <Chip label="data_validation" size="small" />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Uses: LLM with Security Plugin
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined" sx={{ 
                    height: '100%',
                    transition: 'all 0.2s ease',
                    '&:hover': { boxShadow: 3 },
                    cursor: 'pointer',
                    borderColor: selectedTemplate === 'kg' ? 'primary.main' : 'inherit',
                    bgcolor: selectedTemplate === 'kg' ? alpha('#43a047', 0.05) : 'inherit'
                  }}
                  onClick={() => setSelectedTemplate('kg')}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <SmartToyIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Knowledge Graph Explorer</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Traverses knowledge graphs to extract insights and answer questions.
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        <Chip label="kg_integration" size="small" />
                        <Chip label="query_optimization" size="small" />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Uses: Cypher + LLM
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined" sx={{ 
                    height: '100%',
                    transition: 'all 0.2s ease',
                    '&:hover': { boxShadow: 3 },
                    cursor: 'pointer',
                    borderColor: selectedTemplate === 'audit' ? 'primary.main' : 'inherit',
                    bgcolor: selectedTemplate === 'audit' ? alpha('#43a047', 0.05) : 'inherit'
                  }}
                  onClick={() => setSelectedTemplate('audit')}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <VerifiedIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Compliance Auditor</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Verifies compliance with regulatory standards and generates reports.
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        <Chip label="compliance_check" size="small" />
                        <Chip label="audit_logging" size="small" />
                        <Chip label="blockchain_tx" size="small" />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Uses: Groovy Script
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined" sx={{ 
                    height: '100%', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px dashed grey',
                    transition: 'all 0.2s ease',
                    '&:hover': { borderColor: 'primary.main' },
                    cursor: 'pointer'
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <AddIcon color="action" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body1">Create Custom Template</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            
            {selectedTemplate && (
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SecurityIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Customize Template
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Agent Name"
                          defaultValue={selectedTemplate === 'security' ? 'SecurityAnalyzer' : 
                                        selectedTemplate === 'kg' ? 'KnowledgeGraphExplorer' : 'ComplianceAuditor'}
                          margin="normal"
                        />
                        
                        <TextField
                          fullWidth
                          label="Description"
                          multiline
                          rows={2}
                          defaultValue={selectedTemplate === 'security' ? 
                            'Analyzes code and data for security vulnerabilities and suggests fixes.' : 
                            'Custom description'}
                          margin="normal"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Effectiveness Threshold</InputLabel>
                          <Select
                            defaultValue={0.85}
                            label="Effectiveness Threshold"
                          >
                            <MenuItem value={0.75}>0.75 - Standard</MenuItem>
                            <MenuItem value={0.85}>0.85 - High</MenuItem>
                            <MenuItem value={0.95}>0.95 - Very High</MenuItem>
                          </Select>
                        </FormControl>
                        
                        <FormGroup sx={{ mt: 2 }}>
                          <FormControlLabel
                            control={<Switch defaultChecked />}
                            label="Register on blockchain"
                          />
                          <FormControlLabel
                            control={<Switch defaultChecked />}
                            label="Enable security validation"
                          />
                        </FormGroup>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button
                            variant="outlined"
                            sx={{ mr: 1 }}
                            onClick={() => setSelectedTemplate(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SmartToyIcon />}
                          >
                            Create Agent
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Custom Groovy Script
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Write custom Groovy script to implement your agent's behavior. The script should define a class with required methods.
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1">
                      Script Editor
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={isValidatingScript ? <CircularProgress size={20} /> : <PlayArrowIcon />}
                      onClick={validateGroovyScript}
                      disabled={isValidatingScript}
                    >
                      {isValidatingScript ? 'Validating...' : 'Validate Script'}
                    </Button>
                  </Box>
                  
                  <TextField
                    multiline
                    rows={15}
                    value={scriptContent}
                    onChange={handleScriptChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: { fontFamily: 'monospace' }
                    }}
                  />
                  
                  {scriptValidationResults && (
                    <Box sx={{ mt: 2 }}>
                      {scriptValidationResults.valid ? (
                        <Alert severity="success" icon={<CheckCircleIcon />}>
                          Script validation successful!
                        </Alert>
                      ) : (
                        <Alert severity="error" icon={<ErrorIcon />}>
                          Script contains errors that need to be fixed.
                        </Alert>
                      )}
                      
                      {(scriptValidationResults.errors || scriptValidationResults.warnings) && (
                        <TableContainer sx={{ mt: 2 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Line</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Message</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {scriptValidationResults.errors && scriptValidationResults.errors.map((error, index) => (
                                <TableRow key={`error-${index}`}>
                                  <TableCell>{error.line}</TableCell>
                                  <TableCell>
                                    <Chip size="small" color="error" label="Error" />
                                  </TableCell>
                                  <TableCell>{error.message}</TableCell>
                                </TableRow>
                              ))}
                              {scriptValidationResults.warnings && scriptValidationResults.warnings.map((warning, index) => (
                                <TableRow key={`warning-${index}`}>
                                  <TableCell>{warning.line}</TableCell>
                                  <TableCell>
                                    <Chip size="small" color="warning" label="Warning" />
                                  </TableCell>
                                  <TableCell>{warning.message}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Script Requirements & Documentation</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle2" gutterBottom>Required Structure</Typography>
                  <Typography variant="body2" paragraph>
                    Your script must define a class with a constructor that accepts an AgentContext parameter and an execute method.
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>Available APIs</Typography>
                  <ul>
                    <li>GraphDatabaseService - For Neo4j operations</li>
                    <li>AgentContext - Provides access to resources</li>
                    <li>SecurityUtils - Helper methods for security validations</li>
                  </ul>
                </AccordionDetails>
              </Accordion>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={blockchainEnabled}
                      onChange={(e) => setBlockchainEnabled(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Register on blockchain"
                />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!scriptValidationResults?.valid}
                  startIcon={<SaveIcon />}
                >
                  Create Agent
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
      
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Your Agents
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <SmartToyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="SecurityAnalyzer" 
                  secondary="Analyzes code for security vulnerabilities"
                />
                <Chip label="LLM" size="small" color="primary" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemIcon>
                  <SmartToyIcon color="secondary" />
                </ListItemIcon>
                <ListItemText 
                  primary="DataValidator" 
                  secondary="Validates data integrity and structure"
                />
                <Chip label="Groovy" size="small" color="secondary" />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemIcon>
                  <SmartToyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="ComplianceChecker" 
                  secondary="Verifies compliance with regulations"
                />
                <Chip label="LLM" size="small" color="primary" />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default AgentWorkshop; 