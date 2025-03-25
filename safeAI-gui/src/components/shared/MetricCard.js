import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Avatar, Box, Typography, useTheme, alpha } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  color, 
  trend,
  trendDirection = 'up',
  onClick,
}) => {
  const theme = useTheme();
  
  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 16px ${alpha(color, 0.2)}`,
        } : {},
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.1),
              color: color,
              mr: 2,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
              {value}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>
          </Box>
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {trendDirection === 'up' ? (
              <TrendingUpIcon sx={{ color: theme.palette.success.main, mr: 0.5 }} />
            ) : (
              <TrendingDownIcon sx={{ color: theme.palette.error.main, mr: 0.5 }} />
            )}
            <Typography 
              variant="body2" 
              color={trendDirection === 'up' ? 'success.main' : 'error.main'}
            >
              {trend}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  trend: PropTypes.string,
  trendDirection: PropTypes.oneOf(['up', 'down']),
  onClick: PropTypes.func,
};

export default MetricCard; 