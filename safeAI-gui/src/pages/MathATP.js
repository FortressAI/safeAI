import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Divider, 
  Card, 
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  AppBar,
  LinearProgress,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SaveIcon from '@mui/icons-material/Save';
import HistoryIcon from '@mui/icons-material/History';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CodeIcon from '@mui/icons-material/Code';
import SchemaIcon from '@mui/icons-material/Schema';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import BookIcon from '@mui/icons-material/Book';
import DownloadIcon from '@mui/icons-material/Download';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Import math-specific components
import TheoremEditor from '../components/math/TheoremEditor';
import ProofSearchVisualizer from '../components/math/ProofSearchVisualizer';
import InferenceEngine from '../components/math/InferenceEngine';
import KnowledgeGraphVisualizer from '../components/math/KnowledgeGraphVisualizer';
import TabPanel from '../components/common/TabPanel';
import { fetchMathKnowledgeGraph, invokeMathAgent, getATPAgents } from '../utils/api';

const MathATP = () => {
  const theme = useTheme();
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [theorem, setTheorem] = useState({
    name: '',
    formalLanguage: 'first_order_logic',
    statement: '',
    references: []
  });
  const [validationStatus, setValidationStatus] = useState(null);
  const [isProving, setIsProving] = useState(false);
  const [searchStrategy, setSearchStrategy] = useState('heuristic');
  const [proofSteps, setProofSteps] = useState([]);
  const [visualizationData, setVisualizationData] = useState({ nodes: [], links: [] });
  const [atpAgents, setAtpAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [proofResults, setProofResults] = useState([]);
  const [savedTheorems, setSavedTheorems] = useState([]);
  const [proofHistory, setProofHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSavedTheoremsOpen, setIsSavedTheoremsOpen] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState({
    axioms: [],
    theorems: []
  });
  const [problemStatement, setProblemStatement] = useState('');
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  
  // Fetch ATP agents from Knowledge Graph
  useEffect(() => {
    const loadATPAgents = async () => {
      try {
        const agents = await getATPAgents();
        setAtpAgents(agents);
        // Select the composite agent by default
        const compositeAgent = agents.find(agent => agent.name === 'CompositeATPAgent');
        if (compositeAgent) {
          setSelectedAgents([compositeAgent.name]);
        }
      } catch (error) {
        console.error('Failed to load ATP agents:', error);
      }
    };
    
    const loadKnowledgeBase = async () => {
      try {
        const kg = await fetchMathKnowledgeGraph();
        // Extract axioms and theorems from the knowledge graph
        const axioms = kg.proof_systems?.first_order_logic?.axioms || [];
        setKnowledgeBase({
          axioms: axioms.map(axiom => ({ id: axiom, statement: axiom })),
          theorems: []
        });
      } catch (error) {
        console.error('Failed to load knowledge base:', error);
      }
    };
    
    loadATPAgents();
    loadKnowledgeBase();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setTabValue(newValue);
  };

  // Handle theorem changes
  const handleTheoremChange = (newTheorem) => {
    setTheorem(prev => ({ ...prev, ...newTheorem }));
    // Reset validation when theorem changes
    setValidationStatus(null);
  };

  // Validate theorem
  const validateTheorem = useCallback(async () => {
    if (!theorem.statement.trim()) {
      setValidationStatus({ valid: false, message: 'Theorem statement cannot be empty' });
      return false;
    }
    
    try {
      // We would typically call an API endpoint here to validate the theorem
      // For now, we'll simulate a successful validation
      setValidationStatus({ valid: true, message: 'Theorem is well-formed' });
      return true;
    } catch (error) {
      setValidationStatus({ valid: false, message: error.message || 'Validation failed' });
      return false;
    }
  }, [theorem]);

  // Start proof search
  const startProof = async () => {
    const isValid = await validateTheorem();
    if (!isValid) return;
    
    setIsProving(true);
    setProofSteps([]);
    setVisualizationData({ nodes: [], links: [] });
    
    try {
      // Invoke the selected ATP agents
      const results = await Promise.all(
        selectedAgents.map(agentName => 
          invokeMathAgent(agentName, {
            theorem: theorem.statement,
            formalLanguage: theorem.formalLanguage,
            searchStrategy: searchStrategy,
            timeLimit: 30 // seconds
          })
        )
      );
      
      // Process results
      const processedResults = results.map((result, index) => ({
        agentName: selectedAgents[index],
        isProven: result.metadata?.confidence > 0.8,
        confidence: result.metadata?.confidence || 0,
        steps: result.metadata?.proof_steps || [],
        chainOfThought: result.metadata?.chain_of_thought || '',
        message: result.candidate
      }));
      
      setProofResults(processedResults);
      
      // Update proof history
      const historyEntry = {
        timestamp: new Date().toISOString(),
        theorem: { ...theorem },
        results: processedResults,
        agents: selectedAgents
      };
      setProofHistory(prev => [historyEntry, ...prev]);
      
      // Take the most successful result for visualization
      const bestResult = processedResults.sort((a, b) => b.confidence - a.confidence)[0];
      
      if (bestResult && bestResult.steps) {
        setProofSteps(bestResult.steps);
        
        // Generate visualization data
        const vizData = generateVisualizationData(bestResult.steps, theorem.statement);
        setVisualizationData(vizData);
      }
    } catch (error) {
      console.error('Proof search failed:', error);
      setProofResults([{
        agentName: 'System',
        isProven: false,
        confidence: 0,
        message: `Error: ${error.message || 'Unknown error occurred'}`
      }]);
    } finally {
      setIsProving(false);
    }
  };

  // Stop proof search
  const stopProof = () => {
    // This would typically call an API to stop the proof search
    setIsProving(false);
  };

  // Save theorem
  const saveTheorem = () => {
    const theoremToSave = {
      ...theorem,
      timestamp: new Date().toISOString(),
      id: `theorem-${Date.now()}`
    };
    
    setSavedTheorems(prev => [theoremToSave, ...prev]);
    
    // Also add to knowledge base
    setKnowledgeBase(prev => ({
      ...prev,
      theorems: [...prev.theorems, { id: theoremToSave.id, statement: theorem.statement }]
    }));
  };

  // Load a saved theorem
  const loadTheorem = (savedTheorem) => {
    setTheorem(savedTheorem);
    setIsSavedTheoremsOpen(false);
  };

  // Load a proof from history
  const loadFromHistory = (historyItem) => {
    setTheorem(historyItem.theorem);
    setSelectedAgents(historyItem.agents);
    setProofResults(historyItem.results);
    
    // If the history item has steps, visualize them
    const bestResult = historyItem.results.sort((a, b) => b.confidence - a.confidence)[0];
    if (bestResult && bestResult.steps) {
      setProofSteps(bestResult.steps);
      const vizData = generateVisualizationData(bestResult.steps, historyItem.theorem.statement);
      setVisualizationData(vizData);
    }
    
    setIsHistoryOpen(false);
  };

  // Generate visualization data from proof steps
  const generateVisualizationData = (steps, goal) => {
    const nodes = [];
    const links = [];
    
    // Add goal node
    nodes.push({
      id: 'goal',
      name: goal,
      type: 'theorem',
      status: 'target'
    });
    
    // Process proof steps
    steps.forEach((step, index) => {
      const nodeId = `step-${index}`;
      
      // Add node for this step
      nodes.push({
        id: nodeId,
        name: step.conclusion || step.statement,
        type: step.type || 'intermediate',
        status: step.status || 'visited'
      });
      
      // Add links from premises to this node
      if (step.premises) {
        step.premises.forEach(premise => {
          // Find the node that corresponds to this premise
          const premiseNodeId = findNodeIdForStatement(nodes, premise);
          if (premiseNodeId) {
            links.push({
              source: premiseNodeId,
              target: nodeId,
              type: step.rule || 'inference'
            });
          }
        });
      }
      
      // If this is the final step, link to goal
      if (index === steps.length - 1) {
        links.push({
          source: nodeId,
          target: 'goal',
          type: 'conclusion'
        });
      }
    });
    
    return { nodes, links };
  };

  // Helper to find node id for a statement
  const findNodeIdForStatement = (nodes, statement) => {
    const node = nodes.find(n => n.name === statement);
    return node ? node.id : null;
  };

  // Apply a logical rule using the inference engine
  const handleApplyRule = (rule, premises) => {
    // This would call an API to apply the rule and get the result
    // For now, we'll simulate adding a new step
    const newStep = {
      rule: rule.name,
      premises: premises.map(p => p.statement),
      conclusion: `Result of applying ${rule.name}`,
      timestamp: new Date().toISOString()
    };
    
    setProofSteps(prev => [...prev, newStep]);
    
    // Update visualization
    const updatedVizData = {
      nodes: [
        ...visualizationData.nodes,
        {
          id: `step-${proofSteps.length}`,
          name: newStep.conclusion,
          type: 'intermediate',
          status: 'visited'
        }
      ],
      links: [
        ...visualizationData.links,
        ...premises.map(premise => {
          const premiseNodeId = findNodeIdForStatement(visualizationData.nodes, premise.statement);
          return {
            source: premiseNodeId || 'axiom',
            target: `step-${proofSteps.length}`,
            type: rule.name
          };
        })
      ]
    };
    
    setVisualizationData(updatedVizData);
  };

  // Reset the current proof
  const handleReset = () => {
    setProofSteps([]);
    setVisualizationData({ nodes: [], links: [] });
    setProofResults([]);
  };

  const startProving = () => {
    setIsProving(true);
    setResult(null);
    addLog('info', 'Starting proof attempt...');
    
    // Simulate proof attempt
    setTimeout(() => {
      const success = Math.random() > 0.3;
      if (success) {
        setResult({
          proved: true,
          method: 'Resolution',
          steps: generateProofSteps(),
          time: Math.floor(Math.random() * 2000) + 500,
        });
        addLog('info', 'Proof successful!');
      } else {
        setResult({
          proved: false,
          reason: 'Could not find a contradiction within time limit',
          partialResults: ['Attempted resolution refutation', 'Attempted model finding'],
        });
        addLog('error', 'Proof failed: Could not find a contradiction within time limit');
      }
      setIsProving(false);
    }, 3000);
  };

  const stopProving = () => {
    setIsProving(false);
    addLog('warn', 'Proof attempt stopped by user');
  };

  const addLog = (level, message) => {
    setLogs(prevLogs => [...prevLogs, { 
      level, 
      message, 
      timestamp: new Date().getTime() 
    }]);
  };

  const generateProofSteps = () => {
    // Generate random proof steps
    const steps = [];
    const numSteps = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 1; i <= numSteps; i++) {
      steps.push({
        stepNumber: i,
        formula: `Step ${i}: ${["∀x(P(x) → Q(x))", "∃y(R(y) ∧ S(y))", "P(a) ∧ ¬Q(a)", "¬R(b) ∨ S(b)"][i % 4]}`,
        rule: ["Assumption", "Modus Ponens", "Universal Instantiation", "Existential Elimination"][i % 4],
        justification: `From steps ${Math.max(1, i-2)}, ${Math.max(1, i-1)}`
      });
    }
    
    return steps;
  };

  // Example predefined problems
  const exampleProblems = [
    "∀x(P(x) → Q(x)), ∀x(Q(x) → R(x)) ⊢ ∀x(P(x) → R(x))",
    "∀x(P(x) → Q(x)), P(a) ⊢ Q(a)",
    "∀x(P(x) ∨ Q(x)), ∀x(¬P(x)) ⊢ ∀x(Q(x))",
    "∃x(P(x) ∧ Q(x)) ⊢ ∃x(P(x)) ∧ ∃x(Q(x))",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Mathematical Theorem Prover
          </Typography>
          
          <AppBar position="static" color="default" sx={{ borderRadius: 1 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Theorem Editor" />
              <Tab label="Proof Visualization" />
              <Tab label="Inference Engine" />
              <Tab label="Results" />
              <Tab label="Knowledge Graph" icon={<SchemaIcon />} iconPosition="start" />
            </Tabs>
          </AppBar>
          
          {/* Theorem Editor Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Theorem Definition
                    </Typography>
                    <TheoremEditor
                      value={theorem.statement}
                      formalLanguage={theorem.formalLanguage}
                      onChange={(newValue) => handleTheoremChange({ statement: newValue })}
                      validationStatus={validationStatus}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Formal Language</InputLabel>
                      <Select
                        value={theorem.formalLanguage}
                        onChange={(e) => handleTheoremChange({ formalLanguage: e.target.value })}
                      >
                        <MenuItem value="first_order_logic">First-Order Logic</MenuItem>
                        <MenuItem value="higher_order_logic">Higher-Order Logic</MenuItem>
                        <MenuItem value="set_theory">Set Theory</MenuItem>
                        <MenuItem value="peano_arithmetic">Peano Arithmetic</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <TextField
                      fullWidth
                      label="Theorem Name"
                      value={theorem.name}
                      onChange={(e) => handleTheoremChange({ name: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      ATP Configuration
                    </Typography>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Search Strategy</InputLabel>
                      <Select
                        value={searchStrategy}
                        onChange={(e) => setSearchStrategy(e.target.value)}
                      >
                        <MenuItem value="depth-first">Depth-First Search</MenuItem>
                        <MenuItem value="breadth-first">Breadth-First Search</MenuItem>
                        <MenuItem value="heuristic">Heuristic Search</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>ATP Agents</InputLabel>
                      <Select
                        multiple
                        value={selectedAgents}
                        onChange={(e) => setSelectedAgents(e.target.value)}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                      >
                        {atpAgents.map((agent) => (
                          <MenuItem key={agent.name} value={agent.name}>
                            {agent.name} - {agent.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PlayArrowIcon />}
                        onClick={startProof}
                        disabled={isProving}
                        sx={{ mr: 1 }}
                      >
                        Prove
                      </Button>
                      
                      {isProving && (
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<StopIcon />}
                          onClick={stopProof}
                        >
                          Stop
                        </Button>
                      )}
                    </Box>
                    
                    <Box>
                      <Button
                        variant="outlined"
                        startIcon={<SaveIcon />}
                        onClick={saveTheorem}
                        sx={{ mr: 1 }}
                      >
                        Save
                      </Button>
                      
                      <Button
                        variant="outlined"
                        startIcon={<HistoryIcon />}
                        onClick={() => setIsHistoryOpen(true)}
                        sx={{ mr: 1 }}
                      >
                        History
                      </Button>
                      
                      <Button
                        variant="outlined"
                        startIcon={<BookmarkIcon />}
                        onClick={() => setIsSavedTheoremsOpen(true)}
                      >
                        Saved
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Proof Visualization Tab */}
          <TabPanel value={activeTab} index={1}>
            <Paper sx={{ p: 3, minHeight: 500 }}>
              <Typography variant="h6" gutterBottom>
                Proof Search Visualization
              </Typography>
              
              <ProofSearchVisualizer
                data={visualizationData}
                loading={isProving}
                searchStrategy={searchStrategy}
              />
            </Paper>
          </TabPanel>
          
          {/* Inference Engine Tab */}
          <TabPanel value={activeTab} index={2}>
            <Paper sx={{ p: 3, minHeight: 500 }}>
              <Typography variant="h6" gutterBottom>
                Manual Inference Steps
              </Typography>
              
              <InferenceEngine
                axioms={knowledgeBase.axioms}
                theorems={knowledgeBase.theorems}
                onApplyRule={handleApplyRule}
                onAddAxiom={(axiom) => {
                  setKnowledgeBase(prev => ({
                    ...prev,
                    axioms: [...prev.axioms, { id: `axiom-${Date.now()}`, statement: axiom }]
                  }));
                }}
                onProve={startProof}
                onToggleRunning={() => isProving ? stopProof() : startProof()}
                onReset={handleReset}
              />
            </Paper>
          </TabPanel>
          
          {/* Results Tab */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Proof Results
                  </Typography>
                  
                  {isProving ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                      <Typography variant="body1" sx={{ ml: 2 }}>
                        Searching for proof...
                      </Typography>
                    </Box>
                  ) : proofResults.length > 0 ? (
                    proofResults.map((result, index) => (
                      <Card key={index} sx={{ mb: 2 }}>
                        <CardHeader
                          title={`${result.agentName} ${result.isProven ? '✓' : '✗'}`}
                          subheader={`Confidence: ${(result.confidence * 100).toFixed(1)}%`}
                        />
                        <CardContent>
                          <Typography variant="body1" gutterBottom>
                            {result.message}
                          </Typography>
                          
                          {result.chainOfThought && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle1">
                                Chain of Thought:
                              </Typography>
                              <Typography variant="body2" component="pre" sx={{ 
                                p: 2, 
                                bgcolor: 'grey.100', 
                                borderRadius: 1,
                                whiteSpace: 'pre-wrap'
                              }}>
                                {result.chainOfThought}
                              </Typography>
                            </Box>
                          )}
                          
                          {result.steps && result.steps.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle1">
                                Proof Steps:
                              </Typography>
                              <List>
                                {result.steps.map((step, stepIdx) => (
                                  <ListItem key={stepIdx} divider={stepIdx < result.steps.length - 1}>
                                    <ListItemText
                                      primary={step.conclusion || step.statement}
                                      secondary={`Rule: ${step.rule || 'N/A'}`}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body1">
                      No proof results yet. Configure and start a proof from the Theorem Editor tab.
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Knowledge Graph Tab */}
          <TabPanel value={activeTab} index={4}>
            <Paper sx={{ p: 3, minHeight: 500 }}>
              <KnowledgeGraphVisualizer />
            </Paper>
          </TabPanel>
        </Box>
        
        {/* Dialogs */}
        <Dialog open={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Proof History</DialogTitle>
          <DialogContent>
            {proofHistory.length > 0 ? (
              <List>
                {proofHistory.map((item, index) => (
                  <ListItem 
                    key={index} 
                    button 
                    onClick={() => loadFromHistory(item)}
                    divider={index < proofHistory.length - 1}
                  >
                    <ListItemText
                      primary={item.theorem.name || `Theorem ${index + 1}`}
                      secondary={`${new Date(item.timestamp).toLocaleString()} - Agents: ${item.agents.join(', ')}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1">No proof history yet.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsHistoryOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
        
        <Dialog open={isSavedTheoremsOpen} onClose={() => setIsSavedTheoremsOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Saved Theorems</DialogTitle>
          <DialogContent>
            {savedTheorems.length > 0 ? (
              <List>
                {savedTheorems.map((item, index) => (
                  <ListItem 
                    key={index} 
                    button 
                    onClick={() => loadTheorem(item)}
                    divider={index < savedTheorems.length - 1}
                  >
                    <ListItemText
                      primary={item.name || `Unnamed Theorem ${index + 1}`}
                      secondary={`${new Date(item.timestamp).toLocaleString()} - Language: ${item.formalLanguage}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1">No saved theorems yet.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsSavedTheoremsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>

      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Mathematical Theorem Prover
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Automated theorem proving for mathematical statements
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Tooltip title="Refresh">
              <IconButton onClick={() => window.location.reload()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              onClick={startProving}
              disabled={isProving || !problemStatement.trim()}
              startIcon={<PlayArrowIcon />}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                },
              }}
            >
              Prove Theorem
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} lg={8}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Problem Statement
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <TextField
                    label="Enter logical statement or theorem to prove"
                    fullWidth
                    multiline
                    rows={4}
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="e.g. ∀x(P(x) → Q(x)), P(a) ⊢ Q(a)"
                    disabled={isProving}
                    sx={{ mb: 2 }}
                  />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Use standard first-order logic notation with ∀, ∃, →, ∧, ∨, ¬ symbols
                    </Typography>
                    <Box>
                      <Button
                        variant="contained"
                        onClick={startProving}
                        disabled={isProving || !problemStatement.trim()}
                        startIcon={<PlayArrowIcon />}
                        sx={{
                          mr: 1,
                          background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                        }}
                      >
                        Start Proof
                      </Button>
                      <Button
                        variant="contained"
                        onClick={stopProving}
                        disabled={!isProving}
                        startIcon={<StopIcon />}
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                        }}
                      >
                        Stop
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} lg={4}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 2,
                  height: '100%',
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Example Problems
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {exampleProblems.map((problem, index) => (
                      <Button
                        key={index}
                        variant="outlined"
                        onClick={() => setProblemStatement(problem)}
                        sx={{
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            borderColor: theme.palette.primary.main,
                          }
                        }}
                      >
                        <Typography noWrap variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {problem}
                        </Typography>
                      </Button>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Proof Results Section */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Proof Results
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          {isProving && (
            <Box mb={3}>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Running proof attempt...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This may take some time depending on problem complexity
                </Typography>
              </Box>
              <LinearProgress 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  }
                }}
              />
            </Box>
          )}

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${result.proved 
                      ? alpha(theme.palette.success.main, 0.3) 
                      : alpha(theme.palette.error.main, 0.3)}`,
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">
                        {result.proved ? 'Theorem Proved' : 'Proof Attempt Failed'}
                      </Typography>
                      <Chip 
                        label={result.proved ? 'SUCCESS' : 'FAILED'} 
                        color={result.proved ? 'success' : 'error'} 
                      />
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Problem Statement:
                      </Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                        {problemStatement}
                      </Typography>
                      
                      {result.proved ? (
                        <>
                          <Typography variant="subtitle1" gutterBottom>
                            Proof Method: {result.method}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Proof completed in {result.time}ms
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="subtitle1" gutterBottom>
                            Reason: {result.reason}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Attempted approaches: {result.partialResults.join(', ')}
                          </Typography>
                        </>
                      )}
                    </Box>

                    {result.proved && (
                      <Box>
                        <Tabs 
                          value={tabValue} 
                          onChange={handleTabChange}
                          sx={{ 
                            mb: 2,
                            '& .MuiTab-root': {
                              minWidth: 120,
                            }
                          }}
                        >
                          <Tab 
                            icon={<CodeIcon />} 
                            label="PROOF STEPS" 
                            id="tab-0"
                            aria-controls="tabpanel-0"
                          />
                          <Tab 
                            icon={<BookIcon />} 
                            label="EXPLANATION" 
                            id="tab-1"
                            aria-controls="tabpanel-1"
                          />
                        </Tabs>
                        
                        <Box
                          role="tabpanel"
                          hidden={tabValue !== 0}
                          id="tabpanel-0"
                          aria-labelledby="tab-0"
                        >
                          {tabValue === 0 && (
                            <Paper 
                              sx={{ 
                                p: 2, 
                                bgcolor: alpha(theme.palette.background.paper, 0.5),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                              }}
                            >
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>Formal Proof:</Typography>
                              {result.steps.map((step, index) => (
                                <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                                  <Typography variant="body2" sx={{ width: 40, fontWeight: 'bold' }}>
                                    {step.stepNumber}.
                                  </Typography>
                                  <Typography variant="body2" sx={{ flex: 1, fontFamily: 'monospace' }}>
                                    {step.formula}
                                  </Typography>
                                  <Typography variant="body2" sx={{ width: 150, color: 'text.secondary' }}>
                                    {step.rule}
                                  </Typography>
                                  <Typography variant="body2" sx={{ width: 150, color: 'text.secondary' }}>
                                    {step.justification}
                                  </Typography>
                                </Box>
                              ))}
                            </Paper>
                          )}
                        </Box>
                        
                        <Box
                          role="tabpanel"
                          hidden={tabValue !== 1}
                          id="tabpanel-1"
                          aria-labelledby="tab-1"
                        >
                          {tabValue === 1 && (
                            <Paper 
                              sx={{ 
                                p: 2, 
                                bgcolor: alpha(theme.palette.background.paper, 0.5),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                              }}
                            >
                              <Typography variant="body1" sx={{ mb: 2 }}>
                                The theorem was proven using {result.method} method. The proof establishes 
                                the validity of the statement through a sequence of logical deductions.
                              </Typography>
                              <Typography variant="body1">
                                Key insight: The proof relies on the transitive nature of implication
                                and the correct application of quantifier rules in first-order logic.
                              </Typography>
                            </Paper>
                          )}
                        </Box>
                      </Box>
                    )}
                    
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Button 
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        sx={{
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          }
                        }}
                      >
                        Export Proof
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {!result && !isProving && (
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="center" 
                p={4} 
                sx={{ 
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                }}
              >
                <InfoIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                <Typography>
                  Enter a theorem statement and start proving to see results here.
                </Typography>
              </Box>
            )}
          </AnimatePresence>
        </Box>

        {/* Logs Section */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Proof Logs
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 2,
              maxHeight: '200px',
              overflow: 'auto',
            }}
          >
            <CardContent>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <Box 
                    key={index} 
                    mb={1} 
                    sx={{ 
                      color: log.level === 'error' 
                        ? theme.palette.error.main 
                        : log.level === 'warn' 
                          ? theme.palette.warning.main 
                          : 'inherit'
                    }}
                  >
                    <Typography variant="body2" fontFamily="monospace">
                      [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No logs yet. Proof attempts will be logged here.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
};

export default MathATP; 