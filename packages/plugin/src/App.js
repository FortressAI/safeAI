import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          SafeAI Plugin
        </Typography>
        <Typography variant="body1">
          Welcome to the SafeAI Plugin interface.
        </Typography>
      </Container>
    </ThemeProvider>
  );
}

export default App; 