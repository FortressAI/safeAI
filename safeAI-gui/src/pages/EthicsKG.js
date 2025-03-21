import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import EthicsKnowledgeGraphVisualizer from '../components/ethics/EthicsKnowledgeGraphVisualizer';

const EthicsKG = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Ethics Knowledge Graph
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Explore the interconnected concepts, principles, and examples in AI ethics through this interactive knowledge graph visualization.
        </Typography>
        
        <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
          <EthicsKnowledgeGraphVisualizer />
        </Paper>
      </Box>
    </Container>
  );
};

export default EthicsKG; 