import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import SchemaIcon from '@mui/icons-material/Schema';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

// Sample data - in a real app, this would come from API calls
const systemHealth = [
  { name: 'Neo4j Database', status: 'healthy', value: 100 },
  { name: 'Knowledge Graphs', status: 'healthy', value: 100 },
  { name: 'Agent Service', status: 'warning', value: 75 },
  { name: 'Blockchain Connection', status: 'healthy', value: 90 },
];

const securityStatus = {
  score: 85,
  lastCheck: '2023-10-15 08:30:45',
  issues: [
    { severity: 'warning', message: 'Agent security capabilities need updating' },
    { severity: 'info', message: 'Blockchain integration verified' },
  ]
};

const recentActivity = [
  { type: 'kg', text: 'CyberSecurity_KG updated', time: '10 minutes ago' },
  { type: 'agent', text: 'New SecurityAnalyzer agent created', time: '1 hour ago' },
  { type: 'security', text: 'Security validation completed', time: '2 hours ago' },
  { type: 'agent', text: 'Compliance agent executed', time: '3 hours ago' },
];

function StatusIcon({ status }) {
  if (status === 'healthy') return <CheckCircleIcon color="success" />;
  if (status === 'warning') return <WarningIcon color="warning" />;
  return <ErrorIcon color="error" />;
}

function Dashboard() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* System Health */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              System Health
            </Typography>
            {systemHealth.map((item) => (
              <Box key={item.name} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{item.name}</Typography>
                  <StatusIcon status={item.status} />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={item.value} 
                  color={item.status === 'healthy' ? 'success' : item.status === 'warning' ? 'warning' : 'error'}
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
            ))}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" size="small">View Details</Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Security Status */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Security Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    border: '10px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -10,
                      left: -10,
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      border: '10px solid',
                      borderColor: securityStatus.score > 80 ? 'success.main' : securityStatus.score > 60 ? 'warning.main' : 'error.main',
                      borderTopColor: 'transparent',
                      borderRightColor: 'transparent',
                      transform: `rotate(${securityStatus.score * 3.6}deg)`,
                    }
                  }}
                >
                  <Typography variant="h4">{securityStatus.score}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last check: {securityStatus.lastCheck}
                </Typography>
                {securityStatus.issues.map((issue, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {issue.severity === 'warning' ? (
                      <WarningIcon fontSize="small" color="warning" sx={{ mr: 1 }} />
                    ) : (
                      <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 1 }} />
                    )}
                    <Typography variant="body2">
                      {issue.message}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" size="small">Run Validation</Button>
              <Button variant="contained" color="primary" size="small">Security Center</Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Knowledge Graph Stats */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <SchemaIcon />
                </Avatar>
                <Typography variant="h6">
                  Knowledge Graphs
                </Typography>
              </Box>
              <Typography variant="h3" component="div" align="center" sx={{ my: 2 }}>
                8
              </Typography>
              <Typography variant="body2" color="text.secondary">
                5 Domain-specific KGs, 3 Custom KGs
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Button variant="text" fullWidth>
                View Knowledge Graphs
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Agent Stats */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <SmartToyIcon />
                </Avatar>
                <Typography variant="h6">
                  Agents
                </Typography>
              </Box>
              <Typography variant="h3" component="div" align="center" sx={{ my: 2 }}>
                12
              </Typography>
              <Typography variant="body2" color="text.secondary">
                5 LLM-based, 7 Groovy Script
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Button variant="text" fullWidth>
                Agent Workshop
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Compliance Stats */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <SecurityIcon />
                </Avatar>
                <Typography variant="h6">
                  Compliance
                </Typography>
              </Box>
              <Typography variant="h3" component="div" align="center" sx={{ my: 2 }}>
                96%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                21/22 compliance requirements met
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Button variant="text" fullWidth>
                Compliance Report
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map((activity, index) => (
                <ListItem key={index} divider={index < recentActivity.length - 1}>
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: activity.type === 'kg' ? 'primary.main' : 
                              activity.type === 'agent' ? 'secondary.main' : 'success.main' 
                    }}>
                      {activity.type === 'kg' ? <SchemaIcon /> : 
                       activity.type === 'agent' ? <SmartToyIcon /> : <SecurityIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={activity.text} 
                    secondary={activity.time}
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button variant="text">View All Activity</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard; 