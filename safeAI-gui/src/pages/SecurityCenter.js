import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GavelIcon from '@mui/icons-material/Gavel';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SchemaIcon from '@mui/icons-material/Schema';

// Sample Security Check Results
const securityChecks = [
  { id: 1, name: 'Required Security KGs', status: 'passed', details: 'All required KGs are present' },
  { id: 2, name: 'Agent Security Capabilities', status: 'warning', details: 'Some agents missing required capabilities' },
  { id: 3, name: 'Compliance Requirements', status: 'passed', details: 'All compliance requirements satisfied' },
  { id: 4, name: 'Blockchain Integration', status: 'passed', details: 'Blockchain integration verified' },
  { id: 5, name: 'Access Control', status: 'passed', details: 'Access control properly configured' },
  { id: 6, name: 'Encryption', status: 'warning', details: 'Some data not properly encrypted' },
];

// Sample Missing Security Components
const missingComponents = [
  { type: 'agent_capability', name: 'SecurityAnalyzer', issue: 'Missing output_validation capability' },
  { type: 'encryption', name: 'Personal Data Fields', issue: 'Not using end-to-end encryption' },
];

// Sample Audit Logs
const auditLogs = [
  { id: 1, timestamp: '2023-10-15 08:30:45', user: 'admin', action: 'Security Validation', details: 'Executed security validation check' },
  { id: 2, timestamp: '2023-10-15 07:15:22', user: 'system', action: 'Agent Creation', details: 'Created new SecurityAnalyzer agent' },
  { id: 3, timestamp: '2023-10-14 14:42:10', user: 'admin', action: 'KG Update', details: 'Updated CyberSecurity_KG' },
  { id: 4, timestamp: '2023-10-14 10:10:33', user: 'system', action: 'Security Alert', details: 'Detected unusual access pattern' },
];

// Sample Compliance Requirements
const complianceRequirements = [
  { id: 1, name: 'GDPR Data Protection', status: 'compliant', details: 'Personal data properly protected' },
  { id: 2, name: 'HIPAA Compliance', status: 'compliant', details: 'Medical data handling meets requirements' },
  { id: 3, name: 'NIST Cybersecurity', status: 'partial', details: 'Some security controls need updates' },
  { id: 4, name: 'SOC 2 Type II', status: 'compliant', details: 'Access controls and monitoring in place' },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`security-tabpanel-${index}`}
      aria-labelledby={`security-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function SecurityCenter() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleRunValidation = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setValidationResult({
      score: 85,
      passedChecks: 4,
      totalChecks: 6,
      warnings: 2,
      errors: 0,
      timestamp: new Date().toLocaleString(),
    });
    
    setLoading(false);
  };
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Security Center
      </Typography>
      
      <Grid container spacing={3}>
        {/* Security Summary Card */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SecurityIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                    <div>
                      <Typography variant="h5" gutterBottom>
                        Security Status
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last validated: {validationResult ? validationResult.timestamp : 'Not yet validated'}
                      </Typography>
                    </div>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  {validationResult && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box position="relative" display="inline-flex">
                        <CircularProgress
                          variant="determinate"
                          value={validationResult.score}
                          size={80}
                          thickness={4}
                          color={validationResult.score > 80 ? "success" : validationResult.score > 60 ? "warning" : "error"}
                        />
                        <Box
                          top={0}
                          left={0}
                          bottom={0}
                          right={0}
                          position="absolute"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Typography variant="h6" component="div" color="text.secondary">
                            {validationResult.score}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PlayArrowIcon />}
                      onClick={handleRunValidation}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Run Validation'}
                    </Button>
                  </Box>
                </Grid>
                
                {validationResult && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" color="success.main">
                            {validationResult.passedChecks}/{validationResult.totalChecks}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Checks Passed
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" color="warning.main">
                            {validationResult.warnings}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Warnings
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" color="error.main">
                            {validationResult.errors}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Errors
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Security Tabs */}
        <Grid item xs={12}>
          <Paper elevation={2}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab icon={<VerifiedUserIcon />} label="Security Checks" />
              <Tab icon={<GavelIcon />} label="Compliance" />
              <Tab icon={<PrivacyTipIcon />} label="Audit Logs" />
              <Tab icon={<AccountBalanceIcon />} label="Governance" />
            </Tabs>
            
            {/* Security Checks Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                {/* Security Checks List */}
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    Security Validation Results
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Check</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Details</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {securityChecks.map((check) => (
                          <TableRow key={check.id}>
                            <TableCell>{check.name}</TableCell>
                            <TableCell>
                              {check.status === 'passed' ? (
                                <Chip 
                                  icon={<CheckCircleIcon />} 
                                  label="Passed" 
                                  color="success" 
                                  size="small" 
                                />
                              ) : check.status === 'warning' ? (
                                <Chip 
                                  icon={<WarningIcon />} 
                                  label="Warning" 
                                  color="warning" 
                                  size="small" 
                                />
                              ) : (
                                <Chip 
                                  icon={<ErrorIcon />} 
                                  label="Failed" 
                                  color="error" 
                                  size="small" 
                                />
                              )}
                            </TableCell>
                            <TableCell>{check.details}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                
                {/* Issues and Resolutions */}
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    Detected Issues
                  </Typography>
                  {missingComponents.length > 0 ? (
                    <>
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        <AlertTitle>Security Components Missing</AlertTitle>
                        Some security components need attention.
                      </Alert>
                      <List>
                        {missingComponents.map((component, index) => (
                          <React.Fragment key={index}>
                            <ListItem>
                              <ListItemIcon>
                                {component.type === 'agent_capability' ? (
                                  <SecurityIcon color="warning" />
                                ) : (
                                  <PrivacyTipIcon color="warning" />
                                )}
                              </ListItemIcon>
                              <ListItemText
                                primary={component.name}
                                secondary={component.issue}
                              />
                              <Tooltip title="Fix Issue">
                                <IconButton size="small">
                                  <RefreshIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </ListItem>
                            {index < missingComponents.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </>
                  ) : (
                    <Alert severity="success">
                      <AlertTitle>All Security Checks Passed</AlertTitle>
                      No security issues detected.
                    </Alert>
                  )}
                  
                  <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
                    Required Security KGs
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <SchemaIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="CyberSecurity_KG"
                        secondary="Security patterns and threat detection"
                      />
                      <Chip label="Active" color="success" size="small" />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <SchemaIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="DataPrivacySecurity_KG"
                        secondary="Privacy protection frameworks"
                      />
                      <Chip label="Active" color="success" size="small" />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <SchemaIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="LegalCompliance_KG"
                        secondary="Regulatory compliance patterns"
                      />
                      <Chip label="Active" color="success" size="small" />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <SchemaIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="RiskManagement_KG"
                        secondary="Risk assessment and mitigation"
                      />
                      <Chip label="Active" color="success" size="small" />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Compliance Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Compliance Requirements
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Requirement</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {complianceRequirements.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>{req.name}</TableCell>
                        <TableCell>
                          {req.status === 'compliant' ? (
                            <Chip 
                              icon={<CheckCircleIcon />} 
                              label="Compliant" 
                              color="success" 
                              size="small" 
                            />
                          ) : req.status === 'partial' ? (
                            <Chip 
                              icon={<WarningIcon />} 
                              label="Partial" 
                              color="warning" 
                              size="small" 
                            />
                          ) : (
                            <Chip 
                              icon={<ErrorIcon />} 
                              label="Non-Compliant" 
                              color="error" 
                              size="small" 
                            />
                          )}
                        </TableCell>
                        <TableCell>{req.details}</TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
                Compliance Report
              </Typography>
              <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                Generate Full Report
              </Button>
              <Button variant="outlined">
                Export Compliance Data
              </Button>
            </TabPanel>
            
            {/* Audit Logs Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Audit Logs
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button color="primary">Load More</Button>
              </Box>
            </TabPanel>
            
            {/* Governance Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>
                Governance Status
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                <AlertTitle>Blockchain Integration Active</AlertTitle>
                Smart contract-based governance is currently active and functioning properly.
              </Alert>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Voting System
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Current voting system is active with 3 active proposals.
                      </Typography>
                      <Button variant="outlined" size="small">View Active Proposals</Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Licensing
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Smart contract licensing system is properly configured and active.
                      </Typography>
                      <Button variant="outlined" size="small">Manage Licenses</Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                    Recent Governance Activities
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <AccountBalanceIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="New security policy proposal created"
                        secondary="2023-10-15 14:30:22"
                      />
                      <Button size="small" variant="text">View</Button>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <AccountBalanceIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Data retention policy vote completed"
                        secondary="2023-10-14 09:15:45"
                      />
                      <Button size="small" variant="text">View</Button>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <AccountBalanceIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="New license agreement deployed"
                        secondary="2023-10-12 16:22:10"
                      />
                      <Button size="small" variant="text">View</Button>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default SecurityCenter; 