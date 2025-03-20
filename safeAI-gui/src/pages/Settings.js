import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Switch,
  FormGroup,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Collapse,
  Stack,
  Chip,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import ApiIcon from '@mui/icons-material/Api';
import StorageIcon from '@mui/icons-material/Storage';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TuneIcon from '@mui/icons-material/Tune';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import ResetIcon from '@mui/icons-material/RotateLeft';
import CodeIcon from '@mui/icons-material/Code';
import EditIcon from '@mui/icons-material/Edit';
import PsychologyIcon from '@mui/icons-material/Psychology';
import KeyIcon from '@mui/icons-material/Key';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DataObjectIcon from '@mui/icons-material/DataObject';
import MemoryIcon from '@mui/icons-material/Memory';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import VerifiedIcon from '@mui/icons-material/Verified';
import { alpha } from '@mui/material/styles';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Blockchain integration status
function BlockchainStatusIndicator({ status, blockchainSettings }) {
  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <CheckCircleIcon color="success" />,
          label: 'Connected',
          color: 'success',
          text: `Connected to ${getNetworkName(blockchainSettings.networkId)}`
        };
      case 'connecting':
        return {
          icon: <CircularProgress size={16} />,
          label: 'Connecting',
          color: 'info',
          text: 'Establishing connection...'
        };
      case 'error':
        return {
          icon: <ErrorIcon color="error" />,
          label: 'Error',
          color: 'error',
          text: 'Unable to connect to blockchain'
        };
      case 'warning':
        return {
          icon: <WarningIcon color="warning" />,
          label: 'Warning',
          color: 'warning',
          text: 'Connected with warnings'
        };
      default:
        return {
          icon: <InfoIcon color="disabled" />,
          label: 'Not Connected',
          color: 'default',
          text: 'Blockchain connection not established'
        };
    }
  };

  const getNetworkName = (networkId) => {
    const networks = {
      '1': 'Ethereum Mainnet',
      '5': 'Goerli Testnet',
      '11155111': 'Sepolia Testnet',
      '137': 'Polygon Mainnet',
      '80001': 'Mumbai Testnet',
    };
    return networks[networkId] || `Network ${networkId}`;
  };

  const info = getStatusInfo();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Chip 
        icon={info.icon} 
        label={info.label} 
        color={info.color} 
        variant="outlined" 
        sx={{ mr: 2 }} 
      />
      <Typography variant="body2" color="text.secondary">
        {info.text}
      </Typography>
    </Box>
  );
}

// Sample transaction data
const sampleTransactions = [
  { hash: '0x1a2b3c...4d5e6f', type: 'Contract Creation', status: 'success', time: '10 min ago', block: 12345678 },
  { hash: '0x7e8f9a...1b2c3d', type: 'License Update', status: 'success', time: '1 day ago', block: 12345650 },
  { hash: '0x4e5f6a...7b8c9d', type: 'Agent Registration', status: 'success', time: '3 days ago', block: 12345600 },
];

// Sample smart contract data
const sampleContracts = [
  { 
    name: 'SafeAILicense', 
    address: '0x1234567890abcdef1234567890abcdef12345678',
    verified: true,
    deployedOn: '2023-09-15',
    functions: ['issueLicense', 'revokeLicense', 'checkLicenseStatus']
  },
  { 
    name: 'AgentRegistry', 
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    verified: true,
    deployedOn: '2023-09-15',
    functions: ['registerAgent', 'deactivateAgent', 'updateAgent']
  },
  { 
    name: 'GovernanceVoting', 
    address: '0x7890abcdef1234567890abcdef1234567890abcd',
    verified: true,
    deployedOn: '2023-09-15',
    functions: ['createProposal', 'vote', 'executeProposal']
  },
];

function Settings() {
  const [tabValue, setTabValue] = useState(0);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showWalletKey, setShowWalletKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [blockchainConnectionStatus, setBlockchainConnectionStatus] = useState('not_connected');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [blockchainValidationSteps, setBlockchainValidationSteps] = useState([
    { label: 'Verify Endpoint', completed: false, error: false },
    { label: 'Check Network', completed: false, error: false },
    { label: 'Validate Contract', completed: false, error: false },
    { label: 'Test Transaction', completed: false, error: false },
  ]);
  const [activeValidationStep, setActiveValidationStep] = useState(0);
  const [showBlockchainValidation, setShowBlockchainValidation] = useState(false);
  const [blockchainTestResults, setBlockchainTestResults] = useState(null);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  
  // Sample settings data
  const [generalSettings, setGeneralSettings] = useState({
    pluginName: 'SafeAI Plugin',
    databaseUrl: 'bolt://localhost:7687',
    databaseUsername: 'neo4j',
    databasePassword: '********',
    logLevel: 'INFO',
    debugMode: false,
    autoUpdate: true,
  });
  
  const [apiSettings, setApiSettings] = useState({
    openaiApiKey: 'sk-***************************************',
    safeAiApiKey: 'sai-***************************************',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    useExternalModel: false,
    externalModelEndpoint: '',
  });
  
  const [blockchainSettings, setBlockchainSettings] = useState({
    blockchainEndpoint: 'https://mainnet.infura.io/v3/your-infura-key',
    adminWalletKey: '0x**************************************',
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    networkId: '1',
    gasLimit: 100000,
    enableBlockchain: true,
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    enforceStrictValidation: true,
    requireKGVerification: true,
    automaticSecurityUpdates: true,
    minSecurityLevel: 'high',
    allowExternalAgents: false,
    enableAuditLogs: true,
  });
  
  // Sample available models
  const availableModels = [
    'gpt-4',
    'gpt-4-turbo',
    'gpt-3.5-turbo',
    'claude-3-opus',
    'claude-3-sonnet',
  ];
  
  // Sample blockchain networks
  const blockchainNetworks = [
    { id: '1', name: 'Ethereum Mainnet' },
    { id: '5', name: 'Goerli Testnet' },
    { id: '11155111', name: 'Sepolia Testnet' },
    { id: '137', name: 'Polygon Mainnet' },
    { id: '80001', name: 'Mumbai Testnet' },
  ];
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle form changes
  const handleGeneralSettingChange = (key, value) => {
    setGeneralSettings({ ...generalSettings, [key]: value });
  };
  
  const handleApiSettingChange = (key, value) => {
    setApiSettings({ ...apiSettings, [key]: value });
  };
  
  const handleBlockchainSettingChange = (key, value) => {
    setBlockchainSettings({ ...blockchainSettings, [key]: value });
  };
  
  const handleSecuritySettingChange = (key, value) => {
    setSecuritySettings({ ...securitySettings, [key]: value });
  };
  
  // Handle save
  const handleSave = () => {
    // Simulate API call for saving settings
    setTimeout(() => {
      setSaveSuccess(true);
    }, 1000);
  };
  
  // Handle reset dialog
  const handleOpenResetDialog = () => {
    setResetDialogOpen(true);
  };
  
  const handleCloseResetDialog = () => {
    setResetDialogOpen(false);
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSaveSuccess(false);
  };
  
  // Handle blockchain connection test
  const handleTestBlockchainConnection = () => {
    setIsTestingConnection(true);
    setShowBlockchainValidation(true);
    setBlockchainConnectionStatus('connecting');
    
    // Reset validation steps
    setBlockchainValidationSteps(steps => steps.map(step => ({
      ...step, 
      completed: false,
      error: false
    })));
    setActiveValidationStep(0);
    
    // Simulate the validation process with steps
    setTimeout(() => {
      // Step 1: Verify Endpoint
      setBlockchainValidationSteps(steps => {
        const newSteps = [...steps];
        newSteps[0].completed = true;
        return newSteps;
      });
      setActiveValidationStep(1);
      
      setTimeout(() => {
        // Step 2: Check Network
        setBlockchainValidationSteps(steps => {
          const newSteps = [...steps];
          newSteps[1].completed = true;
          return newSteps;
        });
        setActiveValidationStep(2);
        
        setTimeout(() => {
          // Step 3: Validate Contract
          setBlockchainValidationSteps(steps => {
            const newSteps = [...steps];
            newSteps[2].completed = true;
            return newSteps;
          });
          setActiveValidationStep(3);
          
          setTimeout(() => {
            // Step 4: Test Transaction
            setBlockchainValidationSteps(steps => {
              const newSteps = [...steps];
              newSteps[3].completed = true;
              return newSteps;
            });
            
            // Final result
            setBlockchainConnectionStatus('connected');
            setIsTestingConnection(false);
            setBlockchainTestResults({
              networkId: blockchainSettings.networkId,
              latency: '45ms',
              contracts: sampleContracts.length,
              balance: '1.25 ETH',
              timestamp: new Date().toLocaleString(),
            });
          }, 1500);
        }, 1500);
      }, 1500);
    }, 1500);
  };
  
  // Handle smart contract dialog
  const handleOpenContractDialog = (contract) => {
    setSelectedContract(contract);
    setContractDialogOpen(true);
  };
  
  const handleCloseContractDialog = () => {
    setContractDialogOpen(false);
  };
  
  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a snackbar notification here
  };
  
  // Get block explorer URL based on network
  const getBlockExplorerUrl = (networkId, address) => {
    const explorers = {
      '1': 'https://etherscan.io',
      '5': 'https://goerli.etherscan.io',
      '11155111': 'https://sepolia.etherscan.io',
      '137': 'https://polygonscan.com',
      '80001': 'https://mumbai.polygonscan.com',
    };
    
    const baseUrl = explorers[networkId] || explorers['1'];
    return `${baseUrl}/address/${address}`;
  };
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Paper elevation={2}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<SettingsIcon />} label="General" />
          <Tab icon={<ApiIcon />} label="API & LLM" />
          <Tab icon={<AccountBalanceIcon />} label="Blockchain" />
          <Tab icon={<SecurityIcon />} label="Security" />
          <Tab icon={<TuneIcon />} label="Advanced" />
        </Tabs>
        
        {/* General Settings Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Plugin Name"
                value={generalSettings.pluginName}
                onChange={(e) => handleGeneralSettingChange('pluginName', e.target.value)}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Database URL"
                value={generalSettings.databaseUrl}
                onChange={(e) => handleGeneralSettingChange('databaseUrl', e.target.value)}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Database Username"
                value={generalSettings.databaseUsername}
                onChange={(e) => handleGeneralSettingChange('databaseUsername', e.target.value)}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Database Password"
                type={showApiKey ? 'text' : 'password'}
                value={generalSettings.databasePassword}
                onChange={(e) => handleGeneralSettingChange('databasePassword', e.target.value)}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowApiKey(!showApiKey)}
                        edge="end"
                      >
                        {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Log Level</InputLabel>
                <Select
                  value={generalSettings.logLevel}
                  onChange={(e) => handleGeneralSettingChange('logLevel', e.target.value)}
                  label="Log Level"
                >
                  <MenuItem value="DEBUG">DEBUG</MenuItem>
                  <MenuItem value="INFO">INFO</MenuItem>
                  <MenuItem value="WARN">WARN</MenuItem>
                  <MenuItem value="ERROR">ERROR</MenuItem>
                </Select>
              </FormControl>
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={generalSettings.debugMode}
                      onChange={(e) => handleGeneralSettingChange('debugMode', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Debug Mode"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={generalSettings.autoUpdate}
                      onChange={(e) => handleGeneralSettingChange('autoUpdate', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Auto Update"
                />
              </FormGroup>
              
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Plugin Information
                  </Typography>
                  <Typography variant="body2">
                    <strong>Version:</strong> 1.0.0
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> Active
                  </Typography>
                  <Typography variant="body2">
                    <strong>Installed:</strong> 2023-10-15
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* API & LLM Settings Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                API & LLM Settings
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="OpenAI API Key"
                type={showApiKey ? 'text' : 'password'}
                value={apiSettings.openaiApiKey}
                onChange={(e) => handleApiSettingChange('openaiApiKey', e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowApiKey(!showApiKey)}
                        edge="end"
                      >
                        {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="SafeAI API Key"
                type={showApiKey ? 'text' : 'password'}
                value={apiSettings.safeAiApiKey}
                onChange={(e) => handleApiSettingChange('safeAiApiKey', e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowApiKey(!showApiKey)}
                        edge="end"
                      >
                        {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>LLM Model</InputLabel>
                <Select
                  value={apiSettings.model}
                  onChange={(e) => handleApiSettingChange('model', e.target.value)}
                  label="LLM Model"
                >
                  {availableModels.map(model => (
                    <MenuItem key={model} value={model}>{model}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={apiSettings.useExternalModel}
                      onChange={(e) => handleApiSettingChange('useExternalModel', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Use External Model"
                />
              </FormGroup>
              
              {apiSettings.useExternalModel && (
                <TextField
                  fullWidth
                  label="External Model Endpoint"
                  value={apiSettings.externalModelEndpoint}
                  onChange={(e) => handleApiSettingChange('externalModelEndpoint', e.target.value)}
                  margin="normal"
                />
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Model Parameters
              </Typography>
              
              <TextField
                fullWidth
                label="Temperature"
                type="number"
                value={apiSettings.temperature}
                onChange={(e) => handleApiSettingChange('temperature', parseFloat(e.target.value))}
                margin="normal"
                InputProps={{
                  inputProps: { min: 0, max: 1, step: 0.1 },
                }}
                helperText="Controls randomness: 0 is deterministic, 1 is creative"
              />
              
              <TextField
                fullWidth
                label="Max Tokens"
                type="number"
                value={apiSettings.maxTokens}
                onChange={(e) => handleApiSettingChange('maxTokens', parseInt(e.target.value))}
                margin="normal"
                InputProps={{
                  inputProps: { min: 100, step: 100 },
                }}
                helperText="Maximum length of generated responses"
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Test API Connection
              </Typography>
              
              <Button 
                variant="outlined" 
                startIcon={<ApiIcon />}
                sx={{ mr: 1 }}
              >
                Test Connection
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                startIcon={<PsychologyIcon />}
              >
                Test LLM Integration
              </Button>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                API settings are used for agent operations and natural language processing.
              </Alert>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Blockchain Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Blockchain Settings
              </Typography>
              
              <BlockchainStatusIndicator 
                status={blockchainConnectionStatus} 
                blockchainSettings={blockchainSettings}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Blockchain Endpoint"
                value={blockchainSettings.blockchainEndpoint}
                onChange={(e) => handleBlockchainSettingChange('blockchainEndpoint', e.target.value)}
                margin="normal"
                helperText="Provider URL (Infura, Alchemy, or custom RPC endpoint)"
              />
              
              <TextField
                fullWidth
                label="Admin Wallet Key"
                type={showWalletKey ? 'text' : 'password'}
                value={blockchainSettings.adminWalletKey}
                onChange={(e) => handleBlockchainSettingChange('adminWalletKey', e.target.value)}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowWalletKey(!showWalletKey)}
                        edge="end"
                      >
                        {showWalletKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText="Private key for admin operations (kept secure and never shared)"
              />
              
              <TextField
                fullWidth
                label="Contract Address"
                value={blockchainSettings.contractAddress}
                onChange={(e) => handleBlockchainSettingChange('contractAddress', e.target.value)}
                margin="normal"
                helperText="Main SafeAI contract address on the blockchain"
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Network</InputLabel>
                <Select
                  value={blockchainSettings.networkId}
                  onChange={(e) => handleBlockchainSettingChange('networkId', e.target.value)}
                  label="Network"
                >
                  {blockchainNetworks.map(network => (
                    <MenuItem key={network.id} value={network.id}>{network.name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Select the blockchain network to connect to
                </FormHelperText>
              </FormControl>
              
              <TextField
                fullWidth
                label="Gas Limit"
                type="number"
                value={blockchainSettings.gasLimit}
                onChange={(e) => handleBlockchainSettingChange('gasLimit', parseInt(e.target.value))}
                margin="normal"
                helperText="Maximum gas for transactions (100,000 recommended)"
              />
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={blockchainSettings.enableBlockchain}
                      onChange={(e) => handleBlockchainSettingChange('enableBlockchain', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable Blockchain Integration"
                />
              </FormGroup>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Blockchain Validation</Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Test and validate your blockchain connection to ensure proper integration with SafeAI.
                  </Typography>
                  
                  <Button 
                    variant="contained" 
                    startIcon={isTestingConnection ? <CircularProgress size={20} color="inherit" /> : <LinkIcon />}
                    onClick={handleTestBlockchainConnection}
                    disabled={isTestingConnection || !blockchainSettings.enableBlockchain}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {isTestingConnection ? 'Testing Connection...' : 'Test Blockchain Connection'}
                  </Button>
                  
                  <Collapse in={showBlockchainValidation}>
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Stepper activeStep={activeValidationStep} orientation="vertical">
                        {blockchainValidationSteps.map((step, index) => (
                          <Step key={step.label} completed={step.completed} expanded>
                            <StepLabel 
                              error={step.error}
                              StepIconProps={{
                                icon: step.completed ? <CheckCircleIcon color="success" /> : index + 1,
                              }}
                            >
                              {step.label}
                            </StepLabel>
                            <StepContent>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {index === activeValidationStep && isTestingConnection ? (
                                  <LinearProgress sx={{ width: '100%', my: 1 }} />
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    {step.completed ? 'Completed successfully' : 
                                     step.error ? 'Failed - See details below' : 'Waiting...'}
                                  </Typography>
                                )}
                              </Box>
                            </StepContent>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                    
                    {blockchainTestResults && (
                      <Card variant="outlined" sx={{ mt: 2, bgcolor: alpha('#43a047', 0.05) }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight={500}>
                              Connection Successful
                            </Typography>
                          </Box>
                          
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Network:</Typography>
                              <Typography variant="body2">
                                {blockchainNetworks.find(n => n.id === blockchainTestResults.networkId)?.name}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Latency:</Typography>
                              <Typography variant="body2">{blockchainTestResults.latency}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Smart Contracts:</Typography>
                              <Typography variant="body2">{blockchainTestResults.contracts} verified</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Wallet Balance:</Typography>
                              <Typography variant="body2">{blockchainTestResults.balance}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">
                                Last checked: {blockchainTestResults.timestamp}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    )}
                  </Collapse>
                </CardContent>
              </Card>
              
              <Accordion variant="outlined">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <DataObjectIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle1">Smart Contracts</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer sx={{ maxHeight: 240 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Contract</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sampleContracts.map((contract) => (
                          <TableRow key={contract.address} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="body2" fontWeight={500}>{contract.name}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {contract.address.substring(0, 8)}...{contract.address.substring(36)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                icon={contract.verified ? <VerifiedIcon /> : <WarningIcon />} 
                                label={contract.verified ? "Verified" : "Unverified"} 
                                size="small" 
                                color={contract.verified ? "success" : "warning"}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenContractDialog(contract)}
                                title="View Details"
                              >
                                <InfoIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                onClick={() => copyToClipboard(contract.address)}
                                title="Copy Address"
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                href={getBlockExplorerUrl(blockchainSettings.networkId, contract.address)}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View on Block Explorer"
                              >
                                <OpenInNewIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Button
                    variant="outlined"
                    startIcon={<IntegrationInstructionsIcon />}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Deploy Smart Contracts
                  </Button>
                </AccordionDetails>
              </Accordion>
              
              <Accordion variant="outlined" sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <ReceiptLongIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle1">Recent Transactions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer sx={{ maxHeight: 240 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Transaction</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sampleTransactions.map((tx) => (
                          <TableRow key={tx.hash} hover>
                            <TableCell>
                              <Typography variant="caption">
                                {tx.hash}
                              </Typography>
                            </TableCell>
                            <TableCell>{tx.type}</TableCell>
                            <TableCell>
                              <Chip 
                                size="small" 
                                color={tx.status === 'success' ? 'success' : 'error'} 
                                label={tx.status === 'success' ? 'Success' : 'Failed'}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{tx.time}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="text"
                      startIcon={<RefreshIcon />}
                      size="small"
                    >
                      Refresh
                    </Button>
                    <Button
                      variant="text"
                      endIcon={<OpenInNewIcon />}
                      size="small"
                    >
                      View All
                    </Button>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Grid>
            
            <Grid item xs={12}>
              <Alert 
                severity="info" 
                sx={{ mt: 1 }}
                action={
                  <Button color="inherit" size="small">
                    Learn More
                  </Button>
                }
              >
                The blockchain integration enables smart contract-based licensing, governance, and audit trails for your SafeAI deployment.
              </Alert>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Security Settings Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.enforceStrictValidation}
                      onChange={(e) => handleSecuritySettingChange('enforceStrictValidation', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enforce Strict Validation"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.requireKGVerification}
                      onChange={(e) => handleSecuritySettingChange('requireKGVerification', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Require Knowledge Graph Verification"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.automaticSecurityUpdates}
                      onChange={(e) => handleSecuritySettingChange('automaticSecurityUpdates', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Automatic Security Updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.allowExternalAgents}
                      onChange={(e) => handleSecuritySettingChange('allowExternalAgents', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Allow External Agents"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.enableAuditLogs}
                      onChange={(e) => handleSecuritySettingChange('enableAuditLogs', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable Audit Logs"
                />
              </FormGroup>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Minimum Security Level</InputLabel>
                <Select
                  value={securitySettings.minSecurityLevel}
                  onChange={(e) => handleSecuritySettingChange('minSecurityLevel', e.target.value)}
                  label="Minimum Security Level"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Security Actions
              </Typography>
              
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<SecurityIcon />}
                sx={{ mr: 1, mb: 1 }}
              >
                Run Security Validation
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                startIcon={<CodeIcon />}
                sx={{ mb: 1 }}
              >
                Update Security Knowledge Graphs
              </Button>
              
              <Divider sx={{ my: 2 }} />
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <AlertTitle>Security Guidelines</AlertTitle>
                Enabling strict security validation ensures all agents and knowledge graphs meet
                security requirements before use. We recommend keeping automatic security updates
                enabled for production environments.
              </Alert>
              
              <Alert severity="warning">
                <AlertTitle>External Agents Warning</AlertTitle>
                Allowing external agents introduces additional security risks. Only enable this
                option if you have proper security measures in place.
              </Alert>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Advanced Settings Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Advanced Settings
              </Typography>
              <Alert severity="warning" sx={{ mb: 3 }}>
                These settings are for advanced users only. Incorrect configuration may affect system stability.
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                System Operations
              </Typography>
              
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<RestartAltIcon />}
                sx={{ mr: 1, mb: 1 }}
              >
                Restart Plugin
              </Button>
              
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<ResetIcon />}
                onClick={handleOpenResetDialog}
                sx={{ mb: 1 }}
              >
                Reset to Defaults
              </Button>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Cache Settings
              </Typography>
              
              <FormGroup>
                <FormControlLabel
                  control={<Switch defaultChecked color="primary" />}
                  label="Enable Response Caching"
                />
                <FormControlLabel
                  control={<Switch defaultChecked color="primary" />}
                  label="Cache Knowledge Graph Queries"
                />
              </FormGroup>
              
              <TextField
                fullWidth
                label="Cache Time-to-Live (seconds)"
                type="number"
                defaultValue={3600}
                margin="normal"
                InputProps={{
                  inputProps: { min: 60 },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Advanced Performance Tuning
              </Typography>
              
              <TextField
                fullWidth
                label="Thread Pool Size"
                type="number"
                defaultValue={10}
                margin="normal"
                InputProps={{
                  inputProps: { min: 1 },
                }}
              />
              
              <TextField
                fullWidth
                label="Request Timeout (seconds)"
                type="number"
                defaultValue={30}
                margin="normal"
                InputProps={{
                  inputProps: { min: 1 },
                }}
              />
              
              <TextField
                fullWidth
                label="Max Connection Pool Size"
                type="number"
                defaultValue={50}
                margin="normal"
                InputProps={{
                  inputProps: { min: 1 },
                }}
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    System Information
                  </Typography>
                  <Typography variant="body2">
                    <strong>Java Version:</strong> 17.0.6
                  </Typography>
                  <Typography variant="body2">
                    <strong>Neo4j Version:</strong> 5.13.0
                  </Typography>
                  <Typography variant="body2">
                    <strong>Memory Usage:</strong> 1.2GB / 4GB
                  </Typography>
                  <Typography variant="body2">
                    <strong>Active Connections:</strong> 3
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
      
      {/* Save Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          sx={{ mr: 1 }}
          startIcon={<RestartAltIcon />}
        >
          Reset Changes
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </Box>
      
      {/* Save Success Snackbar */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Settings saved successfully!
        </Alert>
      </Snackbar>
      
      {/* Reset Confirmation Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={handleCloseResetDialog}
      >
        <DialogTitle>Reset Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset all settings to their default values? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetDialog}>Cancel</Button>
          <Button color="error" onClick={handleCloseResetDialog}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Contract Details Dialog */}
      <Dialog
        open={contractDialogOpen}
        onClose={handleCloseContractDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedContract && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DataObjectIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">{selectedContract.name}</Typography>
                {selectedContract.verified && (
                  <Chip 
                    icon={<VerifiedIcon />} 
                    label="Verified"
                    color="success" 
                    size="small" 
                    sx={{ ml: 2 }}
                  />
                )}
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Contract Address</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, mb: 2 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {selectedContract.address}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => copyToClipboard(selectedContract.address)}
                      sx={{ ml: 1 }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      href={getBlockExplorerUrl(blockchainSettings.networkId, selectedContract.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ ml: 0.5 }}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Deployed On</Typography>
                  <Typography variant="body2">{selectedContract.deployedOn}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Network</Typography>
                  <Typography variant="body2">
                    {blockchainNetworks.find(n => n.id === blockchainSettings.networkId)?.name}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Contract Functions
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedContract.functions.map(func => (
                      <Chip 
                        key={func} 
                        label={func} 
                        icon={<MemoryIcon />} 
                        variant="outlined" 
                        sx={{ 
                          borderColor: alpha(theme => theme.palette.primary.main, 0.3),
                          mb: 1
                        }} 
                      />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Contract Verification
                  </Typography>
                  <Alert severity="success" variant="outlined">
                    Contract is verified on {blockchainNetworks.find(n => n.id === blockchainSettings.networkId)?.name}.
                    The code has been verified and matches the deployed bytecode.
                  </Alert>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" href={getBlockExplorerUrl(blockchainSettings.networkId, selectedContract.address)} target="_blank" startIcon={<OpenInNewIcon />}>
                View on Block Explorer
              </Button>
              <Button onClick={handleCloseContractDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}

export default Settings; 