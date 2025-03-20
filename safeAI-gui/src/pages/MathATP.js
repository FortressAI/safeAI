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
  AppBar
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SaveIcon from '@mui/icons-material/Save';
import HistoryIcon from '@mui/icons-material/History';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import CodeIcon from '@mui/icons-material/Code';
import SchemaIcon from '@mui/icons-material/Schema';

// Import math-specific components
import TheoremEditor from '../components/math/TheoremEditor';
import ProofSearchVisualizer from '../components/math/ProofSearchVisualizer';
import InferenceEngine from '../components/math/InferenceEngine';
import KnowledgeGraphVisualizer from '../components/math/KnowledgeGraphVisualizer';
import { fetchMathKnowledgeGraph, invokeMathAgent, getATPAgents } from '../utils/api';

// TabPanel component for tabbed interface
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`math-atp-tabpanel-${index}`}
      aria-labelledby={`math-atp-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MathATP = () => {
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

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Math Automated Theorem Proving
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
  );
};

export default MathATP; 