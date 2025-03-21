import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert
} from '@mui/material';
import EthicsKnowledgeGraphVisualizer from '../components/ethics/EthicsKnowledgeGraphVisualizer';
import EthicalAuditResults from '../components/ethics/EthicalAuditResults';
import EthicsAuditService from '../services/EthicsAuditService';

const EthicsKG = () => {
    const [selectedAgent, setSelectedAgent] = useState('');
    const [availableAgents, setAvailableAgents] = useState([]);
    const [auditResults, setAuditResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAvailableAgents();
    }, []);

    const fetchAvailableAgents = async () => {
        try {
            const response = await fetch('/api/agents');
            const agents = await response.json();
            setAvailableAgents(agents);
        } catch (error) {
            console.error('Error fetching agents:', error);
            setError('Failed to load available agents');
        }
    };

    const handleAgentSelect = (event) => {
        setSelectedAgent(event.target.value);
        setAuditResults(null);
    };

    const handleRunAudit = async () => {
        if (!selectedAgent) {
            setError('Please select an agent to audit');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const agent = availableAgents.find(a => a.name === selectedAgent);
            const results = await EthicsAuditService.auditAgent(agent);
            setAuditResults(results);
        } catch (error) {
            console.error('Error running ethical audit:', error);
            setError('Failed to complete ethical audit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Ethics Knowledge Graph
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                    Explore the interconnected concepts, principles, and examples in AI ethics through this interactive knowledge graph visualization.
                    Use the ethical audit tool to evaluate and label agents across all knowledge graphs.
                </Typography>

                <Grid container spacing={3}>
                    {/* Agent Selection and Audit Controls */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="agent-select-label">Select Agent to Audit</InputLabel>
                                        <Select
                                            labelId="agent-select-label"
                                            value={selectedAgent}
                                            onChange={handleAgentSelect}
                                            label="Select Agent to Audit"
                                        >
                                            {availableAgents.map((agent) => (
                                                <MenuItem key={agent.name} value={agent.name}>
                                                    {agent.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleRunAudit}
                                        disabled={!selectedAgent || loading}
                                        fullWidth
                                    >
                                        {loading ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            'Run Ethical Audit'
                                        )}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Error Display */}
                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}

                    {/* Audit Results */}
                    {auditResults && (
                        <Grid item xs={12}>
                            <EthicalAuditResults auditResults={auditResults} />
                        </Grid>
                    )}

                    {/* Knowledge Graph Visualization */}
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <EthicsKnowledgeGraphVisualizer />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default EthicsKG; 