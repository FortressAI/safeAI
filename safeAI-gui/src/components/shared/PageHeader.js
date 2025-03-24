import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton, Tooltip, useTheme, alpha } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const PageHeader = ({ 
  title, 
  subtitle, 
  onRefresh, 
  action,
  gradientColors = ['#4f46e5', '#4338ca']
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 4,
    }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 600, 
          mb: 1,
          background: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography color="text.secondary" variant="subtitle1">
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {action}
        {onRefresh && (
          <Tooltip title="Refresh data">
            <IconButton 
              onClick={onRefresh}
              sx={{
                background: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  onRefresh: PropTypes.func,
  action: PropTypes.node,
  gradientColors: PropTypes.arrayOf(PropTypes.string),
};

export default PageHeader; 