import React from 'react';
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
} from '@mui/icons-material';
import { motion } from 'framer-motion';

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

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
            Dashboard
          </Typography>
          <Typography color="text.secondary">
            Welcome back! Here's what's happening with your system.
          </Typography>
        </Box>
        <Tooltip title="Refresh data">
          <IconButton>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* System Health */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <MetricCard
            title="CPU Usage"
            value={`${systemHealth.cpu}%`}
            icon={<SpeedIcon />}
            color={theme.palette.primary.main}
            trend="+2.5% from last hour"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <MetricCard
            title="Memory Usage"
            value={`${systemHealth.memory}%`}
            icon={<StorageIcon />}
            color={theme.palette.success.main}
            trend="-1.2% from last hour"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <MetricCard
            title="Storage Usage"
            value={`${systemHealth.storage}%`}
            icon={<StorageIcon />}
            color={theme.palette.warning.main}
            trend="+5.3% from last week"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <MetricCard
            title="Network Usage"
            value={`${systemHealth.network}%`}
            icon={<SpeedIcon />}
            color={theme.palette.info.main}
            trend="+8.1% from last hour"
          />
        </Grid>
      </Grid>

      {/* Security Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              height: '100%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <CardHeader
              title="Security Status"
              avatar={
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  <SecurityIcon />
                </Avatar>
              }
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Active Threats
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {securityStatus.threats}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Vulnerabilities
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {securityStatus.vulnerabilities}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Compliance Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ flexGrow: 1, mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={securityStatus.compliance}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {securityStatus.compliance}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <CardHeader
              title="Recent Activity"
              avatar={
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                  <InfoIcon />
                </Avatar>
              }
            />
            <CardContent>
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Knowledge Graphs & Agents */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <CardHeader
              title="Knowledge Graphs"
              avatar={
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }}>
                  <StorageIcon />
                </Avatar>
              }
            />
            <CardContent>
              {knowledgeGraphs.map((graph) => (
                <Box
                  key={graph.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    mb: 1,
                    background: alpha(theme.palette.common.white, 0.05),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: alpha(theme.palette.common.white, 0.1),
                    },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {graph.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {graph.nodes} nodes • {graph.edges} edges
                    </Typography>
                  </Box>
                  <Chip
                    label={graph.size}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <CardHeader
              title="Active Agents"
              avatar={
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                  <SmartToyIcon />
                </Avatar>
              }
            />
            <CardContent>
              {agents.map((agent) => (
                <Box
                  key={agent.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    mb: 1,
                    background: alpha(theme.palette.common.white, 0.05),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: alpha(theme.palette.common.white, 0.1),
                    },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {agent.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {agent.tasks} active tasks
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={agent.status}
                      size="small"
                      sx={{
                        bgcolor: agent.status === 'active'
                          ? alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.grey[500], 0.1),
                        color: agent.status === 'active'
                          ? theme.palette.success.main
                          : theme.palette.grey[500],
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {agent.performance}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 