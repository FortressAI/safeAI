import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Typography, Grid, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

/**
 * Component for displaying ARC puzzle grids
 */
const ARCPuzzleDisplay = ({ puzzleData }) => {
  const theme = useTheme();
  
  // Color palette for grid cells
  const colorMap = [
    '#000000', // 0: Black
    '#0074D9', // 1: Blue
    '#FF4136', // 2: Red
    '#2ECC40', // 3: Green
    '#FFDC00', // 4: Yellow
    '#B10DC9', // 5: Purple
    '#FF851B', // 6: Orange
    '#7FDBFF', // 7: Light Blue
    '#F012BE', // 8: Magenta
    '#39CCCC'  // 9: Cyan
  ];
  
  // If no puzzle data is provided, show a placeholder
  if (!puzzleData) {
    return (
      <Paper 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          bgcolor: alpha(theme.palette.common.black, 0.05) 
        }}
      >
        <Typography color="text.secondary">
          Select a puzzle to display
        </Typography>
      </Paper>
    );
  }
  
  const { id, input, output } = puzzleData;
  
  // Function to render a single grid
  const renderGrid = (grid, title) => {
    // Check if the grid is valid
    if (!grid || !Array.isArray(grid) || grid.length === 0) {
      return (
        <Box>
          <Typography variant="caption" color="text.secondary">
            {title} (No data)
          </Typography>
          <Box sx={{ height: 100, bgcolor: alpha(theme.palette.common.black, 0.05), borderRadius: 1 }} />
        </Box>
      );
    }
    
    // Get the grid dimensions
    const height = grid.length;
    const width = grid[0].length;
    
    return (
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          {title} ({width}×{height})
        </Typography>
        
        <Box 
          sx={{ 
            display: 'inline-block',
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          {grid.map((row, rowIndex) => (
            <Box 
              key={rowIndex} 
              sx={{ 
                display: 'flex'
              }}
            >
              {row.map((cell, cellIndex) => (
                <Box 
                  key={cellIndex}
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: colorMap[cell] || theme.palette.grey[800],
                    border: `1px solid ${alpha(theme.palette.common.black, 0.2)}`,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      zIndex: 1
                    }
                  }}
                />
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Puzzle: {id}
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          {renderGrid(input, 'Input')}
        </Grid>
        <Grid item xs={12} sm={6}>
          {renderGrid(output, 'Output')}
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Tip: Hover over cells to see them more clearly
        </Typography>
      </Box>
    </Paper>
  );
};

ARCPuzzleDisplay.propTypes = {
  puzzleData: PropTypes.shape({
    id: PropTypes.string,
    input: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    output: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
  })
};

export default ARCPuzzleDisplay; 