import React, { useState, useCallback } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  SmartToy as SmartToyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Dashboard as DashboardIcon,
  Memory as MemoryIcon,
  NetworkCheck as NetworkIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PageHeader from '../components/shared/PageHeader';
import ErrorFallback from '../components/shared/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

// Sample data - replace with actual API calls
const systemHealth = {
  cpu: 45,
  memory: 60,
  storage: 75,
  network: 85,
  status: 'healthy',
  lastUpdated: '2 minutes ago',
};

const securityStatus = {
  threats: 0,
  vulnerabilities: 2,
  compliance: 98,
  lastScan: '1 hour ago',
};

const knowledgeGraphs = [
  { name: 'Mathematics', size: '2.5GB', nodes: '1.2M', edges: '3.5M' },
  { name: 'Ethics', size: '1.8GB', nodes: '850K', edges: '2.1M' },
  { name: 'Physics', size: '3.1GB', nodes: '1.5M', edges: '4.2M' },
];

const agents = [
  { name: 'Math Solver', status: 'active', tasks: 12, performance: 95 },
  { name: 'Ethics Analyzer', status: 'idle', tasks: 0, performance: 92 },
  { name: 'Security Monitor', status: 'active', tasks: 8, performance: 98 },
];

const complianceStats = {
  gdpr: 100,
  hipaa: 98,
  pci: 100,
  iso27001: 95,
};

const recentActivity = [
  {
    id: 1,
    type: 'success',
    message: 'New theorem proved in Mathematics KG',
    time: '5 minutes ago',
    icon: <CheckCircleIcon />,
  },
  {
    id: 2,
    type: 'warning',
    message: 'Security scan completed - 2 vulnerabilities found',
    time: '1 hour ago',
    icon: <WarningIcon />,
  },
  {
    id: 3,
    type: 'info',
    message: 'New agent deployed: Ethics Analyzer v2.0',
    time: '2 hours ago',
    icon: <InfoIcon />,
  },
];

const StatusIcon = ({ status }) => {
  const theme = useTheme();
  const icons = {
    healthy: <CheckCircleIcon sx={{ color: theme.palette.success.main }} />,
    warning: <WarningIcon sx={{ color: theme.palette.warning.main }} />,
    error: <ErrorIcon sx={{ color: theme.palette.error.main }} />,
  };
  return icons[status] || icons.healthy;
};

const MetricCard = ({ title, value, icon, color, trend }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 16px ${alpha(color, 0.2)}`,
        },
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
            <TrendingUpIcon sx={{ color: theme.palette.success.main, mr: 0.5 }} />
            <Typography variant="body2" color="success.main">
              {trend}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const ActivityItem = ({ activity }) => {
  const theme = useTheme();
  const colors = {
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderRadius: 2,
        mb: 1,
        background: `linear-gradient(135deg, ${alpha(colors[activity.type], 0.1)} 0%, ${alpha(colors[activity.type], 0.05)} 100%)`,
        border: `1px solid ${alpha(colors[activity.type], 0.2)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateX(4px)',
          background: `linear-gradient(135deg, ${alpha(colors[activity.type], 0.15)} 0%, ${alpha(colors[activity.type], 0.1)} 100%)`,
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: alpha(colors[activity.type], 0.1),
          color: colors[activity.type],
          mr: 2,
          width: 40,
          height: 40,
        }}
      >
        {activity.icon}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {activity.message}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {activity.time}
        </Typography>
      </Box>
    </Box>
  );
};

function Dashboard() {
  const theme = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Define metrics array
  const metrics = [
    {
      title: 'CPU Usage',
      value: `${systemHealth.cpu}%`,
      icon: <SpeedIcon />,
      color: theme.palette.info.main,
      trend: '+2.5% from last hour'
    },
    {
      title: 'Memory Usage',
      value: `${systemHealth.memory}%`,
      icon: <MemoryIcon />,
      color: theme.palette.success.main,
      trend: '-1.2% from last hour'
    },
    {
      title: 'Storage Usage',
      value: `${systemHealth.storage}%`,
      icon: <StorageIcon />,
      color: theme.palette.warning.main,
      trend: '+5.3% from last week'
    },
    {
      title: 'Network Usage',
      value: `${systemHealth.network}%`,
      icon: <NetworkIcon />,
      color: theme.palette.primary.main,
      trend: '+8.1% from last hour'
    }
  ];

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // TODO: Implement actual data refresh logic
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Box sx={{ width: '100%' }}>
        <PageHeader
          title="Dashboard"
          subtitle="System Overview"
          icon={<DashboardIcon />}
        />
        
        {/* System Health Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MetricCard
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                color={metric.color}
                trend={metric.trend}
              />
            </Grid>
          ))}
        </Grid>

        {/* Security Status */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`,
            border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Security Status
          </Typography>
          <Grid container spacing={2}>
            {securityChecks.map((check, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {check.icon}
                    <Typography variant="subtitle2" sx={{ ml: 1 }}>
                      {check.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {check.status}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Recent Activity */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.05)} 100%)`,
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <List>
            {recentActivity.map((activity, index) => (
              <ListItem
                key={index}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}>
                    {activity.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.title}
                  secondary={activity.description}
                  primaryTypographyProps={{ variant: 'subtitle2' }}
                  secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                />
                <Typography variant="caption" color="text.secondary">
                  {activity.time}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </ErrorBoundary>
  );
}

export default Dashboard; 