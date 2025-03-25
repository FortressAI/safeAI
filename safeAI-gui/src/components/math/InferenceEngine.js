import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  TextField,
  IconButton,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const InferenceEngine = ({ 
  axioms = [], 
  theorems = [], 
  onApplyRule, 
  onAddAxiom,
  onProve,
  isRunning = false,
  onToggleRunning,
  onReset
}) => {
  const [selectedRule, setSelectedRule] = useState('');
  const [premises, setPremises] = useState([]);
  const [newAxiom, setNewAxiom] = useState('');
  const [inferenceSteps, setInferenceSteps] = useState([]);
  const [selectedPremise, setSelectedPremise] = useState(null);
  
  const rules = [
    { id: 'modus_ponens', name: 'Modus Ponens', description: 'From P and P→Q, infer Q' },
    { id: 'and_intro', name: 'Conjunction Introduction', description: 'From P and Q, infer P∧Q' },
    { id: 'and_elim', name: 'Conjunction Elimination', description: 'From P∧Q, infer P or Q' },
    { id: 'or_intro', name: 'Disjunction Introduction', description: 'From P, infer P∨Q' },
    { id: 'or_elim', name: 'Disjunction Elimination', description: 'From P∨Q and P→R and Q→R, infer R' },
    { id: 'impl_intro', name: 'Implication Introduction', description: 'If assuming P allows derivation of Q, infer P→Q' },
    { id: 'impl_elim', name: 'Implication Elimination', description: 'From P→Q, infer Q when P is true' },
    { id: 'not_intro', name: 'Negation Introduction', description: 'If assuming P leads to contradiction, infer ¬P' },
    { id: 'not_elim', name: 'Negation Elimination', description: 'From ¬¬P, infer P' },
    { id: 'contra', name: 'Proof by Contradiction', description: 'If ¬P leads to contradiction, infer P' },
  ];
  
  const handleSelectPremise = (premise) => {
    if (premises.some(p => p.id === premise.id)) {
      setPremises(premises.filter(p => p.id !== premise.id));
    } else {
      setPremises([...premises, premise]);
    }
  };
  
  const handleApplyRule = () => {
    if (!selectedRule || premises.length === 0) return;
    
    const rule = rules.find(r => r.id === selectedRule);
    if (!rule) return;
    
    const result = onApplyRule(rule, premises);
    
    if (result) {
      setInferenceSteps([...inferenceSteps, {
        id: `step_${inferenceSteps.length + 1}`,
        rule: rule.name,
        premises: premises.map(p => p.content),
        conclusion: result.conclusion,
        isValid: result.isValid
      }]);
      
      // Reset selection
      setPremises([]);
      setSelectedRule('');
    }
  };
  
  const handleAddAxiom = () => {
    if (!newAxiom.trim()) return;
    
    onAddAxiom(newAxiom);
    setNewAxiom('');
  };
  
  const isPremiseSelected = (premise) => {
    return premises.some(p => p.id === premise.id);
  };
  
  const renderAvailableStatements = () => {
    // Combine axioms and theorems
    const allStatements = [
      ...axioms.map(a => ({ id: a.id, content: a.content, type: 'axiom' })),
      ...theorems.map(t => ({ id: t.id, content: t.content, type: 'theorem' })),
      // Also include derived steps
      ...inferenceSteps
        .filter(step => step.isValid)
        .map(step => ({ 
          id: step.id, 
          content: step.conclusion, 
          type: 'derived',
          rule: step.rule
        }))
    ];
    
    return (
      <List dense sx={{ bgcolor: 'background.paper', maxHeight: 300, overflow: 'auto' }}>
        {allStatements.map((statement) => (
          <ListItem
            key={statement.id}
            button
            selected={isPremiseSelected(statement)}
            onClick={() => handleSelectPremise(statement)}
            secondaryAction={
              <Chip 
                label={statement.type} 
                size="small"
                color={
                  statement.type === 'axiom' ? 'primary' : 
                  statement.type === 'theorem' ? 'secondary' : 
                  'success'
                }
              />
            }
          >
            <ListItemIcon sx={{ minWidth: 35 }}>
              {isPremiseSelected(statement) && <CheckIcon color="primary" />}
            </ListItemIcon>
            <ListItemText 
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormatQuoteIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.6 }} />
                  <Typography variant="body2" component="span">
                    {statement.content}
                  </Typography>
                  <FormatQuoteIcon fontSize="small" sx={{ ml: 0.5, opacity: 0.6 }} />
                </Box>
              } 
              secondary={statement.rule ? `Derived by ${statement.rule}` : null}
            />
          </ListItem>
        ))}
      </List>
    );
  };
  
  const renderInferenceSteps = () => {
    return (
      <List dense sx={{ bgcolor: 'background.paper', maxHeight: 300, overflow: 'auto' }}>
        {inferenceSteps.map((step, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={
                <Box>
                  <Typography variant="subtitle2">
                    Step {index + 1}: {step.rule}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mt: 1 }}>
                    {step.premises.map((premise, i) => (
                      <React.Fragment key={i}>
                        <Chip
                          label={premise}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        {i < step.premises.length - 1 && (
                          <Typography variant="body2" sx={{ mr: 1, mb: 1 }}>
                            ,
                          </Typography>
                        )}
                      </React.Fragment>
                    ))}
                    <ArrowForwardIcon fontSize="small" sx={{ mx: 1, mb: 1 }} />
                    <Chip
                      label={step.conclusion}
                      color={step.isValid ? "success" : "error"}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Inference Engine
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Typography variant="subtitle2" gutterBottom>
            Available Statements
          </Typography>
          
          <Box sx={{ mb: 2, display: 'flex' }}>
            <TextField
              label="New Axiom"
              variant="outlined"
              size="small"
              fullWidth
              value={newAxiom}
              onChange={(e) => setNewAxiom(e.target.value)}
              sx={{ mr: 1 }}
            />
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddAxiom}
              disabled={!newAxiom.trim()}
            >
              Add
            </Button>
          </Box>
          
          {renderAvailableStatements()}
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Premises:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {premises.length > 0 ? (
                premises.map((premise, index) => (
                  <Chip
                    key={index}
                    label={premise.content}
                    onDelete={() => setPremises(premises.filter((_, i) => i !== index))}
                    color="primary"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No premises selected
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Inference Rules
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="rule-select-label">Select Rule</InputLabel>
              <Select
                labelId="rule-select-label"
                id="rule-select"
                value={selectedRule}
                label="Select Rule"
                onChange={(e) => setSelectedRule(e.target.value)}
              >
                {rules.map((rule) => (
                  <MenuItem key={rule.id} value={rule.id}>
                    {rule.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {selectedRule && (
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {rules.find(r => r.id === selectedRule)?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {rules.find(r => r.id === selectedRule)?.description}
                  </Typography>
                </CardContent>
              </Card>
            )}
            
            <Button
              variant="contained"
              color="primary"
              disabled={!selectedRule || premises.length === 0}
              onClick={handleApplyRule}
              fullWidth
            >
              Apply Rule
            </Button>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2">
                Inference Steps
              </Typography>
              
              <Box>
                <IconButton 
                  color={isRunning ? "secondary" : "primary"} 
                  onClick={onToggleRunning}
                  sx={{ mr: 1 }}
                >
                  {isRunning ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                
                <IconButton onClick={onReset}>
                  <ReplayIcon />
                </IconButton>
              </Box>
            </Box>
            
            {renderInferenceSteps()}
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="secondary"
                disabled={inferenceSteps.length === 0}
                onClick={onProve}
              >
                Verify Proof
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default InferenceEngine; 