import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import MetricCard from './MetricCard';
import SpeedIcon from '@mui/icons-material/Speed';
import MemoryIcon from '@mui/icons-material/Memory';
import NetworkIcon from '@mui/icons-material/NetworkCheck';
import StatusIcon from '@mui/icons-material/Status';

const defaultMetrics = {
  cpu: 0,
  memory: 0,
  network: 0,
  status: 'idle'
};

const AgentBrowser = ({ agent = null }) => {
  const theme = useTheme();
  const [metrics, setMetrics] = useState(defaultMetrics);

  useEffect(() => {
    // Initialize metrics with default values if agent is null or metrics are undefined
    if (!agent || !agent.metrics) {
      setMetrics(defaultMetrics);
    } else {
      setMetrics(agent.metrics);
    }
  }, [agent]);

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="CPU Usage"
            value={`${metrics.cpu}%`}
            icon={<SpeedIcon />}
            color={theme.palette.primary.main}
            trend={metrics.cpu > 80 ? 'High' : 'Normal'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Memory Usage"
            value={`${metrics.memory}%`}
            icon={<MemoryIcon />}
            color={theme.palette.secondary.main}
            trend={metrics.memory > 80 ? 'High' : 'Normal'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Network Activity"
            value={`${metrics.network} MB/s`}
            icon={<NetworkIcon />}
            color={theme.palette.success.main}
            trend={metrics.network > 10 ? 'High' : 'Normal'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Status"
            value={metrics.status}
            icon={<StatusIcon />}
            color={theme.palette.info.main}
            trend="Active"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

AgentBrowser.propTypes = {
  agent: PropTypes.shape({
    metrics: PropTypes.shape({
      cpu: PropTypes.number,
      memory: PropTypes.number,
      network: PropTypes.number,
      status: PropTypes.string
    })
  })
};

AgentBrowser.defaultProps = {
  agent: null
};

export default AgentBrowser; 