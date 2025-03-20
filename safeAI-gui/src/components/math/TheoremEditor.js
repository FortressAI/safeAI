import React, { useState } from 'react';
import { Paper, TextField, Typography, Button, Box, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { mathematica } from '@replit/codemirror-lang-mathematica';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const TheoremEditor = ({ 
  value, 
  onChange, 
  onSubmit, 
  formalLanguage = 'first-order-logic',
  readOnly = false,
  validationStatus = null 
}) => {
  const [name, setName] = useState('');
  const [references, setReferences] = useState([]);
  const [newReference, setNewReference] = useState('');

  const handleAddReference = () => {
    if (newReference.trim()) {
      setReferences([...references, newReference.trim()]);
      setNewReference('');
    }
  };

  const handleDeleteReference = (index) => {
    const newRefs = [...references];
    newRefs.splice(index, 1);
    setReferences(newRefs);
  };

  const getLanguageExtension = () => {
    switch (formalLanguage) {
      case 'mathematica':
        return mathematica();
      default:
        return markdown();
    }
  };

  const handleSubmit = () => {
    onSubmit({
      theorem: value,
      name,
      references,
      language: formalLanguage
    });
  };

  const renderValidationStatus = () => {
    if (validationStatus === null) return null;
    
    return (
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
        {validationStatus.valid ? (
          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
        ) : (
          <Chip 
            label={validationStatus.error || "Invalid syntax"} 
            color="error" 
            size="small" 
            sx={{ mr: 1 }}
          />
        )}
        <Typography variant="body2" color={validationStatus.valid ? "success.main" : "error"}>
          {validationStatus.valid ? "Syntax valid" : "Syntax error"}
        </Typography>
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {readOnly ? "Theorem Viewer" : "Theorem Editor"}
      </Typography>
      
      <TextField
        label="Theorem Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        InputProps={{
          readOnly: readOnly,
        }}
      />
      
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        Formal Definition ({formalLanguage})
      </Typography>
      
      <CodeMirror
        value={value}
        height="200px"
        extensions={[getLanguageExtension()]}
        onChange={onChange}
        readOnly={readOnly}
        theme="dark"
        style={{ border: '1px solid #ccc', borderRadius: '4px' }}
      />
      
      {renderValidationStatus()}
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          References
        </Typography>
        
        {!readOnly && (
          <Box sx={{ display: 'flex', mb: 2 }}>
            <TextField
              label="Add Reference"
              variant="outlined"
              size="small"
              value={newReference}
              onChange={(e) => setNewReference(e.target.value)}
              fullWidth
              sx={{ mr: 1 }}
            />
            <Button 
              variant="outlined" 
              onClick={handleAddReference}
              disabled={!newReference.trim()}
            >
              Add
            </Button>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {references.map((ref, index) => (
            <Chip
              key={index}
              label={ref}
              onDelete={!readOnly ? () => handleDeleteReference(index) : undefined}
              color="primary"
              variant="outlined"
            />
          ))}
          {references.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No references added
            </Typography>
          )}
        </Box>
      </Box>
      
      {!readOnly && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!value.trim() || !name.trim()}
          >
            Submit Theorem
          </Button>
        </Box>
      )}
      
      {readOnly && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title="Copy theorem">
            <IconButton onClick={() => navigator.clipboard.writeText(value)}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Paper>
  );
};

export default TheoremEditor; 