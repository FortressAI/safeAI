import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Typography } from '@mui/material';
import { Memory, Speed, NetworkCheck, CheckCircle } from '@mui/icons-material';
import MetricCard from './shared/MetricCard';

const defaultMetrics = {
  cpu: 0,
  memory: 0,
  network: 0,
  status: 'idle'
};

const AgentBrowser = ({ agent = null }) => {
  const [metrics, setMetrics] = useState(defaultMetrics);

  useEffect(() => {
    if (!agent || !agent.metrics) {
      setMetrics(defaultMetrics);
    } else {
      setMetrics({
        cpu: agent.metrics.cpu || 0,
        memory: agent.metrics.memory || 0,
        network: agent.metrics.network || 0,
        status: agent.metrics.status || 'idle'
      });
    }
  }, [agent]);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="CPU Usage"
            value={`${metrics.cpu}%`}
            icon={<Memory />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Memory Usage"
            value={`${metrics.memory}%`}
            icon={<Speed />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Network Activity"
            value={`${metrics.network} MB/s`}
            icon={<NetworkCheck />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Status"
            value={metrics.status}
            icon={<CheckCircle />}
            color="success"
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