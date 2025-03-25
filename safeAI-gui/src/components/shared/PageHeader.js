import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton, Tooltip, useTheme, alpha } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const PageHeader = ({ 
  title, 
  subtitle, 
  onRefresh, 
  action,
  gradientColors = ['#4f46e5', '#4338ca'],
  icon
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'flex-start',
        mb: 4,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 1,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            {icon}
          </Box>
        )}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      {subtitle && (
        <Typography variant="subtitle1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  onRefresh: PropTypes.func,
  action: PropTypes.node,
  gradientColors: PropTypes.arrayOf(PropTypes.string),
  icon: PropTypes.node
};

export default PageHeader; 