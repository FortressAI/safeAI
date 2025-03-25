import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

// Styled component for the code editor
const CodeEditor = styled('div')(({ theme }) => ({
  width: '100%',
  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
  fontSize: '14px',
  lineHeight: 1.5,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.1),
  overflow: 'hidden',
}));

// Styled component for the line numbers
const LineNumbers = styled('div')(({ theme }) => ({
  width: '40px',
  padding: '8px 0',
  textAlign: 'right',
  borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  color: theme.palette.text.secondary,
  fontSize: '12px',
  userSelect: 'none',
  float: 'left',
  height: '100%',
}));

// Styled component for the code content
const CodeContent = styled('div')(({ theme }) => ({
  marginLeft: '40px',
  padding: '8px 12px',
  minHeight: '400px',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  height: '100%',
  color: theme.palette.text.primary,
}));

// Styled component for the textarea
const CodeTextarea = styled('textarea')(({ theme }) => ({
  width: '100%',
  minHeight: '400px',
  resize: 'vertical',
  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
  fontSize: '14px',
  lineHeight: 1.5,
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  border: 'none',
  outline: 'none',
  padding: '8px',
  '&:focus': {
    outline: 'none',
  },
}));

/**
 * Component for viewing and editing agent programs with syntax highlighting
 */
const ARCProgramViewer = ({ code, readOnly = true, onChange }) => {
  const [codeLines, setCodeLines] = useState([]);
  
  useEffect(() => {
    if (code) {
      setCodeLines(code.split('\n'));
    }
  }, [code]);

  const handleChange = (e) => {
    const newCode = e.target.value;
    if (onChange) {
      onChange(newCode);
    }
  };

  // Color code keywords for syntax highlighting
  const colorizeCode = (line) => {
    // Keywords to highlight
    const keywords = ['class', 'def', 'return', 'import', 'if', 'else', 'for', 'while', 'try', 'catch', 'new', 'true', 'false', 'null'];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    
    // Replace patterns with colored spans
    let coloredLine = line
      // Comments
      .replace(/\/\/(.*?)$/g, '<span style="color: #6c8ebf;">// $1</span>')
      // Strings
      .replace(/"(.*?)"/g, '<span style="color: #ce9178;">"$1"</span>')
      .replace(/'(.*?)'/g, '<span style="color: #ce9178;">\'$1\'</span>')
      // Keywords
      .replace(keywordRegex, '<span style="color: #569cd6;">$1</span>')
      // Numbers
      .replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #b5cea8;">$1</span>')
      // Functions
      .replace(/\b(\w+)\(/g, '<span style="color: #dcdcaa;">$1</span>(')
      // Parentheses, brackets
      .replace(/(\(|\)|\[|\]|\{|\})/g, '<span style="color: #d4d4d4;">$1</span>');
    
    return coloredLine;
  };

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        mb: 2,
      }}
    >
      <Box sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), p: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 500 }}>
          {readOnly ? 'Agent Program (Read Only)' : 'Agent Program (Edit Mode)'}
        </Typography>
      </Box>
      
      <CodeEditor>
        {readOnly ? (
          <>
            <LineNumbers>
              {codeLines.map((_, i) => (
                <div key={i} style={{ padding: '0 8px' }}>{i + 1}</div>
              ))}
            </LineNumbers>
            <CodeContent>
              {codeLines.map((line, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: colorizeCode(line) || '&nbsp;' }} />
              ))}
            </CodeContent>
          </>
        ) : (
          <CodeTextarea
            value={code}
            onChange={handleChange}
            spellCheck="false"
          />
        )}
      </CodeEditor>
    </Paper>
  );
};

ARCProgramViewer.propTypes = {
  code: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
};

export default ARCProgramViewer; 