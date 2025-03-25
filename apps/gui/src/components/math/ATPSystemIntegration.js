import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Stepper,
  Step,
  StepLabel,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SaveIcon from '@mui/icons-material/Save';
import CodeIcon from '@mui/icons-material/Code';
import SchemaIcon from '@mui/icons-material/Schema';

const atpSystems = [
  { id: 'resolution', name: 'Resolution-based', description: 'Uses resolution principle for automated deduction' },
  { id: 'rewriting', name: 'Term Rewriting', description: 'Applies term rewriting rules to derive new terms' },
  { id: 'tableaux', name: 'Semantic Tableaux', description: 'Constructs proof trees by breaking down formulas' },
  { id: 'model_checking', name: 'Model Checking', description: 'Verifies properties by exploring state space' },
];

const searchStrategies = [
  { id: 'depth-first', name: 'Depth-First Search', description: 'Explores as far as possible along each branch before backtracking' },
  { id: 'breadth-first', name: 'Breadth-First Search', description: 'Explores all nodes at current depth before moving deeper' },
  { id: 'heuristic', name: 'Heuristic Search', description: 'Uses problem-specific scoring to determine exploration order' },
];

const ATPSystemIntegration = ({ 
  theorem, 
  onRunProver,
  onUpdateKnowledgeGraph,
  knowledgeGraphAgents = []
}) => {
  const [selectedSystem, setSelectedSystem] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('depth-first');
  const [timeLimit, setTimeLimit] = useState(30);
  const [activeStep, setActiveStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agentCode, setAgentCode] = useState('');
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [error, setError] = useState(null);
  
  const steps = ['Configure Prover', 'Execute Proof Search', 'Verify & Save Results'];
  
  useEffect(() => {
    // Generate template agent code when system and strategy are selected
    if (selectedSystem && selectedStrategy) {
      const template = generateAgentCodeTemplate(selectedSystem, selectedStrategy, timeLimit);
      setAgentCode(template);
    }
  }, [selectedSystem, selectedStrategy, timeLimit]);
  
  const handleRunProver = async () => {
    if (!selectedSystem || !theorem) {
      setError('Please select a proof system and provide a theorem');
      return;
    }
    
    setError(null);
    setLoading(true);
    setIsRunning(true);
    
    try {
      // This would connect to the KG
      const proofResult = await onRunProver({
        theorem,
        system: selectedSystem,
        strategy: selectedStrategy,
        timeLimit,
        agentCode
      });
      
      setResult(proofResult);
      setActiveStep(2); // Move to verification step
    } catch (err) {
      setError(err.message || 'Failed to run the proof system');
    } finally {
      setLoading(false);
      setIsRunning(false);
    }
  };
  
  const handleStop = () => {
    setIsRunning(false);
    // Would connect to API to stop the running process
  };
  
  const handleSaveToKG = async () => {
    if (!result) return;
    
    try {
      await onUpdateKnowledgeGraph({
        theorem,
        proof: result.proof,
        system: selectedSystem,
        strategy: selectedStrategy,
        agent_code: agentCode
      });
      
      // Reset state after successful save
      setActiveStep(0);
      setResult(null);
    } catch (err) {
      setError(err.message || 'Failed to save to Knowledge Graph');
    }
  };
  
  const generateAgentCodeTemplate = (system, strategy, timeLimit) => {
    return `def generateCandidate(input) {
  // ATP Agent using ${system} with ${strategy} strategy
  // Time limit: ${timeLimit} seconds
  
  // Parse the theorem
  def theorem = input.theorem;
  
  // Set up the proof environment
  def proofEngine = initializeProofEngine("${system}", "${strategy}");
  proofEngine.setTimeLimit(${timeLimit});
  
  // Add axioms and inference rules
  proofEngine.addAxioms(getSystemAxioms());
  proofEngine.addInferenceRules(getInferenceRules());
  
  // Run the proof search
  def proofResult = proofEngine.prove(theorem);
  
  // Process the result
  def isProven = proofResult.isProven();
  def proofSteps = proofResult.getSteps();
  def chainOfThought = proofResult.getReasoningChain();
  
  // Return the result
  return [
    candidate: isProven ? "Theorem is proven." : "Unable to prove theorem.",
    metadata: [
      method: "${system}+${strategy}",
      chain_of_thought: chainOfThought,
      confidence: isProven ? 1.0 : proofResult.getConfidence(),
      proof_steps: proofSteps
    ]
  ];
}`;
  };
  
  const renderSystemConfiguration = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="system-select-label">Proof System</InputLabel>
            <Select
              labelId="system-select-label"
              id="system-select"
              value={selectedSystem}
              label="Proof System"
              onChange={(e) => setSelectedSystem(e.target.value)}
            >
              {atpSystems.map((system) => (
                <MenuItem key={system.id} value={system.id}>
                  {system.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="strategy-select-label">Search Strategy</InputLabel>
            <Select
              labelId="strategy-select-label"
              id="strategy-select"
              value={selectedStrategy}
              label="Search Strategy"
              onChange={(e) => setSelectedStrategy(e.target.value)}
            >
              {searchStrategies.map((strategy) => (
                <MenuItem key={strategy.id} value={strategy.id}>
                  {strategy.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Time Limit (seconds)"
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Math.max(1, parseInt(e.target.value) || 1))}
            fullWidth
            sx={{ mb: 2 }}
          />
          
          <Button 
            variant="outlined" 
            startIcon={<CodeIcon />} 
            onClick={() => setShowCodeDialog(true)}
            fullWidth
          >
            View/Edit Agent Code
          </Button>
        </Grid>
        
        <Grid item xs={12} md={6}>
          {selectedSystem && (
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2">
                  {atpSystems.find(s => s.id === selectedSystem)?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {atpSystems.find(s => s.id === selectedSystem)?.description}
                </Typography>
              </CardContent>
            </Card>
          )}
          
          {selectedStrategy && (
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2">
                  {searchStrategies.find(s => s.id === selectedStrategy)?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchStrategies.find(s => s.id === selectedStrategy)?.description}
                </Typography>
              </CardContent>
            </Card>
          )}
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Active Knowledge Graph Agents:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {knowledgeGraphAgents.length > 0 ? (
                knowledgeGraphAgents.map((agent, index) => (
                  <Chip
                    key={index}
                    label={agent.name}
                    color="primary"
                    variant="outlined"
                    icon={<SchemaIcon />}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No theorem proving agents found in Knowledge Graph
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    );
  };
  
  const renderProofExecution = () => {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        {loading ? (
          <Box>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Running Proof Search...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Using {atpSystems.find(s => s.id === selectedSystem)?.name} with {searchStrategies.find(s => s.id === selectedStrategy)?.name}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<StopIcon />}
              onClick={handleStop}
              sx={{ mt: 3 }}
            >
              Stop Execution
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Ready to Execute Proof Search
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              The system will attempt to prove your theorem using the selected configuration.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrowIcon />}
              onClick={handleRunProver}
              size="large"
            >
              Run Proof Search
            </Button>
          </Box>
        )}
      </Box>
    );
  };
  
  const renderProofVerification = () => {
    if (!result) return null;
    
    return (
      <Box>
        <Alert 
          severity={result.proven ? "success" : "info"} 
          sx={{ mb: 3 }}
        >
          {result.proven 
            ? "Theorem successfully proven!" 
            : "Could not find a proof within the given constraints"}
        </Alert>
        
        {result.proof && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Proof Steps:
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                  {result.proof}
                </pre>
              </CardContent>
            </Card>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() => setActiveStep(0)}
          >
            Start Over
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveToKG}
            disabled={!result.proven}
          >
            Save to Knowledge Graph
          </Button>
        </Box>
      </Box>
    );
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return renderSystemConfiguration();
      case 1:
        return renderProofExecution();
      case 2:
        return renderProofVerification();
      default:
        return null;
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Automated Theorem Proving System
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {renderStepContent(activeStep)}
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0 || isRunning}
          onClick={() => setActiveStep((prev) => prev - 1)}
        >
          Back
        </Button>
        
        <Button
          variant="contained"
          disabled={activeStep === 2 || isRunning || (activeStep === 0 && !selectedSystem)}
          onClick={() => {
            if (activeStep === 1) {
              handleRunProver();
            } else {
              setActiveStep((prev) => prev + 1);
            }
          }}
        >
          {activeStep === 1 ? 'Run Prover' : 'Next'}
        </Button>
      </Box>
      
      <Dialog
        open={showCodeDialog}
        onClose={() => setShowCodeDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>ATP Agent Code</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={20}
            value={agentCode}
            onChange={(e) => setAgentCode(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mt: 1, fontFamily: 'monospace' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCodeDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setShowCodeDialog(false);
              // Could validate code here
            }} 
            variant="contained"
          >
            Save Code
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ATPSystemIntegration; 