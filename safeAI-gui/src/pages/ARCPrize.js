import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import StorageIcon from '@mui/icons-material/Storage';
import ARCStatusCard from '../components/arc/ARCStatusCard';
import ARCPuzzleDisplay from '../components/arc/ARCPuzzleDisplay';
import axios from 'axios';

// Logging levels
const LogLevel = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug'
};

// Logging utility
const log = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    data
  };

  // Log to console with appropriate level
  switch (level) {
    case LogLevel.ERROR:
      console.error(`[${timestamp}] ERROR: ${message}`, data || '');
      break;
    case LogLevel.WARN:
      console.warn(`[${timestamp}] WARN: ${message}`, data || '');
      break;
    case LogLevel.DEBUG:
      console.debug(`[${timestamp}] DEBUG: ${message}`, data || '');
      break;
    default:
      console.log(`[${timestamp}] INFO: ${message}`, data || '');
  }

  // In a production environment, you might want to send logs to a server
  if (process.env.NODE_ENV === 'production') {
    axios.post('/api/arc/logs', logEntry).catch(err => {
      console.error('Failed to send log to server:', err);
    });
  }
};

// Error types
const ErrorType = {
  NETWORK: 'NetworkError',
  VALIDATION: 'ValidationError',
  PROCESSING: 'ProcessingError',
  KG: 'KnowledgeGraphError'
};

// Custom error class
class ARCError extends Error {
  constructor(type, message, details = null) {
    super(message);
    this.type = type;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// Retry utility
const withRetry = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      log(LogLevel.WARN, `Operation failed (attempt ${attempt}/${maxRetries})`, { error: err });
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError;
};

// Load agent definitions from KG
const loadAgentDefinitions = async () => {
  log(LogLevel.INFO, 'Loading agent definitions from KG');
  
  try {
    const response = await withRetry(async () => {
      const result = await axios.get('/api/arc/kg/agents');
      log(LogLevel.DEBUG, 'Loaded agent definitions', { count: result.data.agents.length });
      return result;
    });
    
    return response.data.agents;
  } catch (err) {
    const error = new ARCError(
      ErrorType.KG,
      'Failed to load agent definitions from Knowledge Graph',
      { originalError: err }
    );
    log(LogLevel.ERROR, error.message, error);
    throw error;
  }
};

// Fetch puzzles from a directory
const fetchPuzzlesFromDirectory = async (directoryUrl) => {
  log(LogLevel.INFO, 'Fetching puzzles from directory', { url: directoryUrl });
  
  try {
    const response = await withRetry(async () => {
      const result = await axios.get(directoryUrl);
      log(LogLevel.DEBUG, 'Fetched puzzles', { count: result.data.length });
      return result;
    });
    
    const puzzles = response.data.map(file => ({
      id: file.name.replace('.json', ''),
      url: file.download_url
    }));
    
    log(LogLevel.INFO, 'Successfully processed puzzle list', { count: puzzles.length });
    return puzzles;
  } catch (err) {
    const error = new ARCError(
      ErrorType.NETWORK,
      `Failed to fetch puzzles from ${directoryUrl}`,
      { url: directoryUrl, originalError: err }
    );
    log(LogLevel.ERROR, error.message, error);
    throw error;
  }
};

// Fetch puzzle data from URL
const fetchPuzzleData = async (puzzleUrl) => {
  log(LogLevel.INFO, 'Fetching puzzle data', { url: puzzleUrl });
  
  try {
    const response = await withRetry(async () => {
      const result = await axios.get(puzzleUrl);
      log(LogLevel.DEBUG, 'Fetched puzzle data', { 
        inputSize: result.data.input ? result.data.input.length : 'unknown',
        outputSize: result.data.output ? result.data.output.length : 'unknown'
      });
      return result;
    });
    
    // Validate puzzle data
    if (!response.data.input || !response.data.output) {
      throw new ARCError(
        ErrorType.VALIDATION,
        'Invalid puzzle data: missing input or output',
        { url: puzzleUrl, data: response.data }
      );
    }
    
    return response.data;
  } catch (err) {
    const error = err instanceof ARCError ? err : new ARCError(
      ErrorType.NETWORK,
      `Failed to fetch puzzle data from ${puzzleUrl}`,
      { url: puzzleUrl, originalError: err }
    );
    log(LogLevel.ERROR, error.message, error);
    throw error;
  }
};

// Groovy code validation
const validateGroovyCode = (code) => {
  const requiredElements = [
    'def generateCandidate',
    'return [candidate:',
    'metadata:',
    'method:',
    'chain_of_thought:',
    'confidence:'
  ];
  
  const hasAllElements = requiredElements.every(element => code.includes(element));
  if (!hasAllElements) {
    throw new ARCError(
      ErrorType.VALIDATION,
      'Invalid Groovy agent code: missing required elements',
      { missingElements: requiredElements.filter(e => !code.includes(e)) }
    );
  }
  
  // Validate code structure
  try {
    const functionMatch = code.match(/def\s+generateCandidate\s*\(\s*input\s*\)\s*\{[\s\S]*\}/);
    if (!functionMatch) {
      throw new Error('Invalid function structure');
    }
    
    // Check for proper return structure
    const returnMatch = code.match(/return\s*\[\s*candidate:[\s\S]*metadata:\s*\[[\s\S]*\]\s*\]/);
    if (!returnMatch) {
      throw new Error('Invalid return structure');
    }
  } catch (err) {
    throw new ARCError(
      ErrorType.VALIDATION,
      'Invalid Groovy code structure',
      { originalError: err }
    );
  }
  
  return true;
};

// Generate combinations of N agents
const generateCombinations = (agents, n) => {
  if (n === 1) return agents.map(a => [a]);
  
  const combinations = [];
  for (let i = 0; i < agents.length - n + 1; i++) {
    const head = agents[i];
    const subcombinations = generateCombinations(
      agents.slice(i + 1),
      n - 1
    );
    subcombinations.forEach(subcomb => {
      combinations.push([head, ...subcomb]);
    });
  }
  return combinations;
};

// Agent performance tracking
const AgentPerformanceTracker = {
  singleAgents: new Map(),
  combinations: new Map(),
  puzzlePatterns: new Map(),
  
  trackSingleAgent: function(agentName, success, puzzleId, confidence) {
    if (!this.singleAgents.has(agentName)) {
      this.singleAgents.set(agentName, {
        successes: 0,
        attempts: 0,
        successRate: 0,
        avgConfidence: 0,
        successfulPuzzles: new Set(),
        patterns: new Map(),
        recentResults: []
      });
    }
    
    const stats = this.singleAgents.get(agentName);
    stats.attempts++;
    stats.recentResults.push({ success, confidence });
    if (stats.recentResults.length > 10) stats.recentResults.shift();
    
    if (success) {
      stats.successes++;
      stats.successfulPuzzles.add(puzzleId);
      this.updatePatterns(agentName, puzzleId);
    }
    
    stats.successRate = (stats.successes / stats.attempts) * 100;
    stats.avgConfidence = ((stats.avgConfidence * (stats.attempts - 1)) + confidence) / stats.attempts;
  },
  
  trackCombination: function(agents, success, puzzleId, confidence) {
    const key = agents.sort().join('+');
    if (!this.combinations.has(key)) {
      this.combinations.set(key, {
        agents: agents,
        successes: 0,
        attempts: 0,
        successRate: 0,
        avgConfidence: 0,
        successfulPuzzles: new Set(),
        synergy: 0,
        recentResults: []
      });
    }
    
    const stats = this.combinations.get(key);
    stats.attempts++;
    stats.recentResults.push({ success, confidence });
    if (stats.recentResults.length > 10) stats.recentResults.shift();
    
    if (success) {
      stats.successes++;
      stats.successfulPuzzles.add(puzzleId);
      this.updateSynergy(agents, puzzleId);
    }
    
    stats.successRate = (stats.successes / stats.attempts) * 100;
    stats.avgConfidence = ((stats.avgConfidence * (stats.attempts - 1)) + confidence) / stats.attempts;
  },
  
  updatePatterns: function(agentName, puzzleId) {
    const stats = this.singleAgents.get(agentName);
    const pattern = this.analyzePuzzle(puzzleId);
    
    if (!stats.patterns.has(pattern)) {
      stats.patterns.set(pattern, { count: 0, successes: 0 });
    }
    
    const patternStats = stats.patterns.get(pattern);
    patternStats.count++;
    patternStats.successes++;
  },
  
  updateSynergy: function(agents, puzzleId) {
    const key = agents.sort().join('+');
    const stats = this.combinations.get(key);
    
    const individualRates = agents.map(agent => 
      this.singleAgents.get(agent)?.successRate || 0
    );
    const avgIndividualRate = individualRates.reduce((a, b) => a + b, 0) / agents.length;
    
    // Calculate synergy as the ratio of combined success to individual success
    const synergyScore = stats.successRate / (avgIndividualRate || 1);
    stats.synergy = (stats.synergy * 0.7) + (synergyScore * 0.3);
  },
  
  analyzePuzzle: function(puzzleId) {
    // Simplified puzzle pattern analysis
    // In a full implementation, this would analyze grid size, color distribution, etc.
    return puzzleId.split('_')[0] || 'default';
  },
  
  getAgentScore: function(agentName, puzzlePattern) {
    const stats = this.singleAgents.get(agentName);
    if (!stats) return 0;
    
    const recentSuccess = stats.recentResults
      .reduce((sum, result) => sum + (result.success ? 1 : 0), 0) / 
      (stats.recentResults.length || 1);
    
    const patternSuccess = stats.patterns.get(puzzlePattern)?.successes || 0;
    
    return (
      (stats.successRate * 0.4) +
      (stats.avgConfidence * 0.2) +
      (recentSuccess * 100 * 0.2) +
      (patternSuccess * 10 * 0.2)
    );
  },
  
  getCombinationScore: function(agents) {
    const key = agents.sort().join('+');
    const stats = this.combinations.get(key);
    if (!stats) return 0;
    
    const recentSuccess = stats.recentResults
      .reduce((sum, result) => sum + (result.success ? 1 : 0), 0) / 
      (stats.recentResults.length || 1);
    
    return (
      (stats.successRate * 0.3) +
      (stats.avgConfidence * 0.2) +
      (recentSuccess * 100 * 0.2) +
      (stats.synergy * 100 * 0.3)
    );
  },
  
  recommendCombinations: function(puzzleId, maxAgents = 3) {
    const pattern = this.analyzePuzzle(puzzleId);
    
    // Score all agents
    const agentScores = new Map();
    for (const [agentName] of this.singleAgents) {
      agentScores.set(agentName, this.getAgentScore(agentName, pattern));
    }
    
    // Get top agents
    const topAgents = Array.from(agentScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([agent]) => agent);
    
    // Generate and score combinations
    const recommendations = [];
    for (let n = 1; n <= maxAgents; n++) {
      const combinations = generateCombinations(topAgents, n);
      combinations.forEach(combo => {
        const score = this.getCombinationScore(combo);
        if (score > 0) {
          recommendations.push({ agents: combo, score });
        }
      });
    }
    
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  },
  
  getSummary: function() {
    const singleAgentStats = Array.from(this.singleAgents.entries())
      .map(([name, stats]) => ({
        name,
        ...stats,
        score: this.getAgentScore(name),
        successfulPuzzlesCount: stats.successfulPuzzles.size
      }))
      .sort((a, b) => b.score - a.score);

    const combinationStats = Array.from(this.combinations.entries())
      .map(([key, stats]) => ({
        name: key,
        ...stats,
        score: this.getCombinationScore(stats.agents),
        successfulPuzzlesCount: stats.successfulPuzzles.size
      }))
      .sort((a, b) => b.score - a.score);

    return {
      singleAgents: singleAgentStats,
      combinations: combinationStats,
      topPerformer: [...singleAgentStats, ...combinationStats]
        .reduce((best, current) => 
          current.score > (best?.score || 0) ? current : best
        , null)
    };
  },
  
  reset: function() {
    this.singleAgents.clear();
    this.combinations.clear();
    this.puzzlePatterns.clear();
  }
};

// Update processCombinations to use intelligent selection
const processCombinations = async (successfulResults, puzzleData, maxAgents = 3) => {
  log(LogLevel.INFO, 'Processing agent combinations with intelligent selection', { maxAgents });
  
  // Get recommended combinations
  const recommendations = AgentPerformanceTracker.recommendCombinations(puzzleData.id, maxAgents);
  
  // Convert results to agent objects
  const agents = successfulResults.map(r => ({
    name: r.value.data.metadata.method,
    result: r.value.data.candidate,
    confidence: r.value.data.metadata.confidence
  }));
  
  // Try recommended combinations first
  for (const recommendation of recommendations) {
    const combo = recommendation.agents
      .map(name => agents.find(a => a.name === name))
      .filter(Boolean);
    
    if (combo.length === recommendation.agents.length) {
      log(LogLevel.DEBUG, 'Testing recommended combination', {
        agents: combo.map(a => a.name),
        score: recommendation.score
      });
      
      let currentResult = puzzleData.input;
      let combinedConfidence = 1;
      
      for (const agent of combo) {
        const result = await combineAgentResults(
          currentResult,
          agent.result,
          puzzleData.input
        );
        currentResult = result.prediction;
        combinedConfidence *= agent.confidence;
      }
      
      const success = isCorrectSolution(currentResult, puzzleData.output);
      
      AgentPerformanceTracker.trackCombination(
        combo.map(a => a.name),
        success,
        puzzleData.id,
        Math.pow(combinedConfidence, 1/combo.length)
      );
      
      if (success) {
        return {
          success: true,
          prediction: currentResult,
          agent: combo.map(a => a.name).join('+'),
          confidence: Math.pow(combinedConfidence, 1/combo.length),
          chainOfThought: `Combined solution using recommended agents: ${combo.map(a => a.name).join(', ')}`
        };
      }
    }
  }
  
  return null;
};

// Modify processPuzzleWithAgents function
const processPuzzleWithAgents = async (puzzleData, phase) => {
  log(LogLevel.INFO, 'Processing puzzle with agents', { phase });
  
  try {
    // 1. Load agent definitions
    const agents = await loadAgentDefinitions();
    log(LogLevel.DEBUG, 'Loaded agents for processing', { count: agents.length });
    
    // Validate Groovy code for all agents
    for (const agent of agents) {
      try {
        validateGroovyCode(agent.agent_code);
      } catch (err) {
        log(LogLevel.WARN, `Invalid Groovy code for agent ${agent.name}`, err);
        // Skip this agent
        continue;
      }
    }
    
    // 2. Create a list of promises for each agent to process the puzzle
    const agentPromises = agents.map(agent => {
      log(LogLevel.DEBUG, 'Running agent', { agent: agent.name });
      
      return withRetry(async () => {
        const result = await axios.post('/api/arc/process', {
          puzzle: puzzleData,
          agent: agent.name,
          phase: phase,
          agent_code: agent.agent_code
        });
        
        // Track single agent performance
        const success = isCorrectSolution(result.data.candidate, puzzleData.output);
        AgentPerformanceTracker.trackSingleAgent(
          agent.name,
          success,
          puzzleData.id,
          result.data.metadata.confidence
        );
        
        log(LogLevel.DEBUG, 'Agent processing complete', { 
          agent: agent.name,
          success,
          confidence: result.data.metadata.confidence
        });
        
        return result;
      });
    });

    // 3. Run all agents in parallel
    const results = await Promise.allSettled(agentPromises);
    
    // Log results summary
    const successfulResults = results.filter(r => r.status === 'fulfilled');
    log(LogLevel.INFO, 'Agent processing summary', {
      total: results.length,
      successful: successfulResults.length,
      failed: results.length - successfulResults.length
    });
    
    // 4. Check for successful single agent
    const successfulSingleAgent = successfulResults.find(r => 
      isCorrectSolution(r.value.data.candidate, puzzleData.output)
    );

    if (successfulSingleAgent) {
      const result = successfulSingleAgent.value;
      return {
        success: true,
        prediction: result.data.candidate,
        agent: result.data.metadata.method,
        confidence: result.data.metadata.confidence,
        chainOfThought: result.data.metadata.chain_of_thought
      };
    }

    // 5. Try combinations of agents
    log(LogLevel.INFO, 'No successful single agent, trying combinations');
    const combinationResult = await processCombinations(successfulResults, puzzleData);
    
    if (combinationResult) {
      return combinationResult;
    }
    
    // 6. If no solution found, return the highest confidence result
    const bestResult = successfulResults
      .map(r => r.value)
      .reduce((best, current) => {
        if (!best || current.data.metadata.confidence > best.data.metadata.confidence) {
          return current;
        }
        return best;
      }, null);
    
    if (!bestResult) {
      throw new ARCError(
        ErrorType.PROCESSING,
        'No successful agent results',
        { phase, puzzleId: puzzleData.id }
      );
    }
    
    log(LogLevel.INFO, 'No solution found, using highest confidence result', {
      agent: bestResult.data.metadata.method,
      confidence: bestResult.data.metadata.confidence
    });

    return {
      success: false,
      prediction: bestResult.data.candidate,
      agent: bestResult.data.metadata.method,
      confidence: bestResult.data.metadata.confidence,
      chainOfThought: bestResult.data.metadata.chain_of_thought
    };
  } catch (err) {
    const error = err instanceof ARCError ? err : new ARCError(
      ErrorType.PROCESSING,
      'Failed to process puzzle with agents',
      { phase, puzzleData, originalError: err }
    );
    log(LogLevel.ERROR, error.message, error);
    throw error;
  }
};

// Helper function to check if a solution is correct
const isCorrectSolution = (prediction, expected) => {
  if (!prediction || !expected) return false;
  if (prediction.length !== expected.length) return false;
  
  return prediction.every((row, i) => 
    row.length === expected[i].length &&
    row.every((cell, j) => cell === expected[i][j])
  );
};

// Helper function to combine agent results
const combineAgentResults = async (result1, result2, originalInput) => {
  try {
    const response = await axios.post('/api/arc/combine', {
      result1,
      result2,
      input: originalInput
    });
    
    return {
      prediction: response.data.prediction,
      confidence: response.data.confidence
    };
  } catch (err) {
    log(LogLevel.ERROR, 'Failed to combine agent results', err);
    return {
      prediction: result1,
      confidence: 0.5
    };
  }
};

function ARCPrize() {
  // State for directory URLs
  const [directories, setDirectories] = useState({
    training: '',
    evaluation: '',
    final: ''
  });

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [progress, setProgress] = useState({
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0
  });
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [error, setError] = useState(null);
  const [showPerformance, setShowPerformance] = useState(false);
  const [performanceSummary, setPerformanceSummary] = useState(null);

  // Handle directory URL changes
  const handleDirectoryChange = (phase) => (event) => {
    setDirectories(prev => ({
      ...prev,
      [phase]: event.target.value
    }));
  };

  // Start processing puzzles
  const startProcessing = async () => {
    setIsProcessing(true);
    setError(null);
    setProgress({
      total: 0,
      processed: 0,
      successful: 0,
      failed: 0
    });
    AgentPerformanceTracker.reset();

    try {
      // Process each phase sequentially
      for (const phase of ['training', 'evaluation', 'final']) {
        if (!directories[phase]) {
          throw new Error(`${phase} directory URL is required`);
        }

        setCurrentPhase(phase);
        await processPuzzlesInPhase(phase, directories[phase]);
      }
      
      // Update performance summary
      setPerformanceSummary(AgentPerformanceTracker.getSummary());
      setShowPerformance(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
      setCurrentPhase(null);
    }
  };

  // Process puzzles in a specific phase
  const processPuzzlesInPhase = async (phase, directoryUrl) => {
    try {
      // 1. Fetch puzzle list from directory
      const puzzles = await fetchPuzzlesFromDirectory(directoryUrl);
      setProgress(prev => ({ ...prev, total: puzzles.length }));

      // 2. Process each puzzle
      for (const puzzle of puzzles) {
        setCurrentPuzzle(puzzle);
        
        try {
          // 3. Load puzzle data
          const puzzleData = await fetchPuzzleData(puzzle.url);
          
          // 4. Process with agents from KG
          const result = await processPuzzleWithAgents(puzzleData, phase);
          
          // 5. Store results in KG
          await storePuzzleResults(puzzle.id, result, phase);
          
          setProgress(prev => ({
            ...prev,
            processed: prev.processed + 1,
            successful: prev.successful + 1
          }));
        } catch (err) {
          console.error(`Error processing puzzle ${puzzle.id}:`, err);
          setProgress(prev => ({
            ...prev,
            processed: prev.processed + 1,
            failed: prev.failed + 1
          }));
        }
      }
    } catch (err) {
      throw new Error(`Error in ${phase} phase: ${err.message}`);
    }
  };

  // Stop processing
  const stopProcessing = () => {
    setIsProcessing(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        ARC Prize Puzzle Processing
      </Typography>

      <Grid container spacing={3}>
        {/* Directory Configuration */}
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Puzzle Directories" 
              subheader="Configure the URLs for each puzzle set"
              avatar={<StorageIcon />}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Training Puzzles Directory URL"
                    value={directories.training}
                    onChange={handleDirectoryChange('training')}
                    disabled={isProcessing}
                    helperText="URL to directory containing training puzzle JSON files"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Evaluation Puzzles Directory URL"
                    value={directories.evaluation}
                    onChange={handleDirectoryChange('evaluation')}
                    disabled={isProcessing}
                    helperText="URL to directory containing evaluation puzzle JSON files"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Final Puzzles Directory URL"
                    value={directories.final}
                    onChange={handleDirectoryChange('final')}
                    disabled={isProcessing}
                    helperText="URL to directory containing final puzzle JSON files"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Processing Status */}
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Processing Status"
              action={
                <Button
                  variant="contained"
                  color={isProcessing ? "error" : "primary"}
                  startIcon={isProcessing ? <StopIcon /> : <PlayArrowIcon />}
                  onClick={isProcessing ? stopProcessing : startProcessing}
                  disabled={!directories.training || !directories.evaluation || !directories.final}
                >
                  {isProcessing ? "Stop Processing" : "Start Processing"}
                </Button>
              }
            />
            <CardContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {isProcessing && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Current Phase: {currentPhase}
                  </Typography>
                  <CircularProgress 
                    variant="determinate" 
                    value={(progress.processed / progress.total) * 100} 
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <ARCStatusCard
                    title="Total Puzzles"
                    value={progress.total.toString()}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <ARCStatusCard
                    title="Processed"
                    value={progress.processed.toString()}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <ARCStatusCard
                    title="Successful"
                    value={progress.successful.toString()}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <ARCStatusCard
                    title="Failed"
                    value={progress.failed.toString()}
                  />
                </Grid>
              </Grid>

              {currentPuzzle && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Current Puzzle: {currentPuzzle.id}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Input</Typography>
                      <ARCPuzzleDisplay grid={currentPuzzle.input} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Expected Output</Typography>
                      <ARCPuzzleDisplay grid={currentPuzzle.output} />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Agent Performance Analysis */}
        {showPerformance && performanceSummary && (
          <Grid item xs={12}>
            <Card>
              <CardHeader 
                title="Agent Performance Analysis"
                subheader={`Top Performer: ${performanceSummary.topPerformer.name} (${performanceSummary.topPerformer.successRate.toFixed(1)}% success rate)`}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>Single Agents</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Agent</TableCell>
                        <TableCell align="right">Success Rate</TableCell>
                        <TableCell align="right">Puzzles Solved</TableCell>
                        <TableCell align="right">Avg Confidence</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {performanceSummary.singleAgents.map((agent) => (
                        <TableRow key={agent.name}>
                          <TableCell>{agent.name}</TableCell>
                          <TableCell align="right">{agent.successRate.toFixed(1)}%</TableCell>
                          <TableCell align="right">{agent.successfulPuzzlesCount}</TableCell>
                          <TableCell align="right">{agent.avgConfidence.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Agent Combinations</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Combination</TableCell>
                        <TableCell align="right">Success Rate</TableCell>
                        <TableCell align="right">Puzzles Solved</TableCell>
                        <TableCell align="right">Avg Confidence</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {performanceSummary.combinations.map((combo) => (
                        <TableRow key={combo.name}>
                          <TableCell>{combo.name}</TableCell>
                          <TableCell align="right">{combo.successRate.toFixed(1)}%</TableCell>
                          <TableCell align="right">{combo.successfulPuzzlesCount}</TableCell>
                          <TableCell align="right">{combo.avgConfidence.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default ARCPrize; 