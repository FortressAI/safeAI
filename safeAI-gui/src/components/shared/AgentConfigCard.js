import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Grid,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

const AgentConfigCard = ({
  name,
  description,
  status,
  metrics,
  onAction,
}) => {
  const theme = useTheme();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'running':
        return theme.palette.success.main;
      case 'idle':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const handleAction = (action) => {
    if (onAction) {
      onAction(action);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {name}
            </Typography>
            <Chip
              size="small"
              label={status}
              sx={{
                backgroundColor: alpha(getStatusColor(status), 0.1),
                color: getStatusColor(status),
                borderRadius: 1,
              }}
            />
          </Box>
          <Box>
            <Tooltip title={status === 'running' ? 'Stop Agent' : 'Start Agent'}>
              <IconButton
                size="small"
                onClick={() => handleAction(status === 'running' ? 'stop' : 'start')}
                sx={{
                  mr: 1,
                  backgroundColor: alpha(
                    status === 'running' ? theme.palette.error.main : theme.palette.success.main,
                    0.1
                  ),
                  '&:hover': {
                    backgroundColor: alpha(
                      status === 'running' ? theme.palette.error.main : theme.palette.success.main,
                      0.2
                    ),
                  },
                }}
              >
                {status === 'running' ? <StopIcon /> : <PlayIcon />}
              </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              onClick={() => handleAction('more')}
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>

        <Grid container spacing={2}>
          {metrics.map((metric) => (
            <Grid item xs={6} key={metric.label}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                {metric.label}
              </Typography>
              {metric.type === 'progress' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={metric.value}
                    sx={{
                      flexGrow: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {metric.value}%
                  </Typography>
                </Box>
              ) : (
                <Typography variant="subtitle1" fontWeight="medium">
                  {metric.value}
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

AgentConfigCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      type: PropTypes.oneOf(['text', 'progress']),
    })
  ).isRequired,
  onAction: PropTypes.func,
};

export default AgentConfigCard; 