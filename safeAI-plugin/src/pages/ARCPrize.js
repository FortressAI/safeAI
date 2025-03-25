import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  LinearProgress,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import ARCPuzzleDisplay from '../components/arc/ARCPuzzleDisplay';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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

// Fetch puzzles from a directory
const _fetchPuzzlesFromDirectory = async (directoryUrl) => {
  log(LogLevel.INFO, 'Fetching puzzles from directory', { url: directoryUrl });
  
  try {
    const response = await withRetry(async () => {
      const result = await axios.get(directoryUrl);
      log(LogLevel.DEBUG, 'Fetched puzzles', {count: result.data.length });
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
const _fetchPuzzleData = async (puzzleUrl) => {
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

// Modify processPuzzleWithAgents function
const _processPuzzleWithAgents = async (puzzleData, phase) => {
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

function ARCPrize() {
  const theme = useTheme();
  // Define necessary states
  const [trainingDirectory, setTrainingDirectory] = useState('');
  const [evaluationDirectory, setEvaluationDirectory] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, _setCurrentStage] = useState('Training');
  const [currentItem, setCurrentItem] = useState(0);
  const [totalItems, setTotalItems] = useState(100);
  const [successfulResults, _setSuccessfulResults] = useState([]);
  const [logs, setLogs] = useState([]);

  // Handle directory changes
  const handleDirectoryChange = (type) => (event) => {
    if (type === 'training') {
      setTrainingDirectory(event.target.value);
    } else if (type === 'evaluation') {
      setEvaluationDirectory(event.target.value);
    }
  };

  // Start processing function
  const startProcessing = () => {
    setIsProcessing(true);
    setCurrentItem(0);
    setTotalItems(100);
    // Add initial log
    addLog('info', 'Starting processing...');
  };

  // Stop processing function
  const stopProcessing = () => {
    setIsProcessing(false);
    addLog('info', 'Processing stopped by user.');
  };

  // Add log function
  const addLog = (level, message) => {
    setLogs(prevLogs => [...prevLogs, { 
      level, 
      message, 
      timestamp: new Date().getTime() 
    }]);
  };

  // ... existing code ...
} 