import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';

/**
 * Component to display a status metric card with an icon
 * @param {string} title - The title of the metric
 * @param {string|number} value - The value to display
 * @param {string} subvalue - Optional secondary value to display
 * @param {node} icon - Icon to display
 * @param {string} color - Color theme for the card
 */
function ARCStatusCard({ title, value, subvalue, icon, color = 'primary' }) {
  return (
    <Paper 
      sx={{ 
        p: 2, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: 3,
        borderColor: `${color}.main`,
        background: (theme) => `linear-gradient(90deg, ${alpha(theme.palette[color].main, 0.12)} 0%, ${alpha(theme.palette[color].main, 0.04)} 100%)`,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: 3
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        {icon && (
          <Box 
            sx={{ 
              mr: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => alpha(theme.palette[color].main, 0.12),
              borderRadius: '50%',
              width: 32,
              height: 32,
            }}
          >
            {icon}
          </Box>
        )}
        <Typography 
          variant="subtitle2" 
          component="div"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {title}
        </Typography>
      </Box>
      
      <Typography 
        variant="h5" 
        component="div" 
        sx={{ 
          fontWeight: 600, 
          mt: 1,
          color: (theme) => theme.palette[color].main
        }}
      >
        {value}
      </Typography>
      
      {subvalue && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 0.5, fontSize: '0.75rem' }}
        >
          {subvalue}
        </Typography>
      )}
    </Paper>
  );
}

ARCStatusCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subvalue: PropTypes.string,
  icon: PropTypes.node,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info'])
};

export default ARCStatusCard; 