import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography, Alert, AlertTitle } from '@mui/material';

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <Box sx={{ p: 3 }}>
    <Alert 
      severity="error" 
      action={
        <Button 
          color="inherit" 
          size="small" 
          onClick={resetErrorBoundary}
        >
          Try Again
        </Button>
      }
    >
      <AlertTitle>Something went wrong</AlertTitle>
      {error.message}
    </Alert>
  </Box>
);

ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

export default ErrorFallback; 