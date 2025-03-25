import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  IconButton, 
  LinearProgress,
  useTheme,
  alpha,
  Button,
  Tooltip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { 
  Refresh as RefreshIcon, 
  Functions as FunctionsIcon,
  Calculate as CalculateIcon,
  Category as CategoryIcon,
  Timeline as TimelineIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import MathKnowledgeGraphVisualizer from '../components/math/MathKnowledgeGraphVisualizer';

// Sample metrics data
const mathMetrics = {
  nodes: 8542,
  edges: 12763,
  concepts: 3201,
  theorems: 1520,
  lemmas: 957,
  proofs: 2864,
  lastUpdated: '3 hours ago'
};

const MetricCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(color, 0.2)}`,
          borderRadius: 2,
          boxShadow: `0 4px 20px ${alpha(color, 0.1)}`,
          '&:hover': {
            boxShadow: `0 8px 30px ${alpha(color, 0.2)}`,
          },
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                bgcolor: alpha(color, 0.1),
                mr: 2,
              }}
            >
              {icon}
            </Box>
            <Typography variant="h6" color="textPrimary">
              {title}
            </Typography>
          </Box>
          <Typography variant="h4" color="textPrimary" gutterBottom>
            {value.toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const MathKG = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Simulate loading the graph data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="xl" sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Mathematics Knowledge Graph
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Explore mathematical concepts, theorems, and their relationships
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Tooltip title="Refresh data">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                },
              }}
            >
              Export Graph
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6} lg={2}>
            <MetricCard
              title="Total Nodes"
              value={mathMetrics.nodes}
              icon={<CategoryIcon />}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <MetricCard
              title="Total Edges"
              value={mathMetrics.edges}
              icon={<TimelineIcon />}
              color={theme.palette.info.main}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <MetricCard
              title="Concepts"
              value={mathMetrics.concepts}
              icon={<FunctionsIcon />}
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <MetricCard
              title="Theorems"
              value={mathMetrics.theorems}
              icon={<CalculateIcon />}
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <MetricCard
              title="Lemmas"
              value={mathMetrics.lemmas}
              icon={<InfoIcon />}
              color={theme.palette.error.main}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <MetricCard
              title="Proofs"
              value={mathMetrics.proofs}
              icon={<CheckCircleIcon />}
              color={theme.palette.secondary.main}
            />
          </Grid>
        </Grid>

        <Box mb={3}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              mb: 3,
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 3,
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              },
            }}
          >
            <Tab label="Graph View" />
            <Tab label="Concept Map" />
            <Tab label="Theorem Browser" />
          </Tabs>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label="Algebra" color="primary" variant="outlined" />
            <Chip label="Geometry" color="secondary" variant="outlined" />
            <Chip label="Calculus" color="info" variant="outlined" />
            <Chip label="Logic" color="success" variant="outlined" />
            <Chip label="Topology" color="warning" variant="outlined" />
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading Mathematics Knowledge Graph...
            </Typography>
          </Box>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper 
                elevation={0} 
                sx={{ 
                  mt: 1, 
                  p: 0, 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  height: '70vh',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                {refreshing && <LinearProgress />}
                <MathKnowledgeGraphVisualizer />
              </Paper>
            </motion.div>
          </AnimatePresence>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {mathMetrics.lastUpdated}
          </Typography>
          <Box>
            <Tooltip title="Share graph">
              <IconButton size="small">
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
};

export default MathKG; 