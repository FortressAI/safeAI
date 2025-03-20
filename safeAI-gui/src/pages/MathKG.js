import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import MathKnowledgeGraphVisualizer from '../components/math/MathKnowledgeGraphVisualizer';

const MathKG = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mathematics Knowledge Graph
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Explore mathematical concepts, theorems, and their relationships
        </Typography>
        
        <Paper elevation={0} sx={{ mt: 3, p: 0, borderRadius: 2, overflow: 'hidden' }}>
          <MathKnowledgeGraphVisualizer />
        </Paper>
      </Box>
    </Container>
  );
};

export default MathKG; 