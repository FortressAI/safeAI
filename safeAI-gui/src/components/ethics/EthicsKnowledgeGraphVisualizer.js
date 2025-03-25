import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

const EthicsKnowledgeGraphVisualizer = () => {
    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fgRef = useRef();

    useEffect(() => {
        fetchGraphData();
    }, []);

    const fetchGraphData = async () => {
        try {
            const response = await fetch('/api/ethics/kg');
            const data = await response.json();
            
            // Transform data into format expected by react-force-graph
            const nodes = [];
            const links = [];
            
            // Add Ethics Agents
            data.agents.forEach(agent => {
                nodes.push({
                    id: agent.id,
                    name: agent.name,
                    type: 'agent',
                    status: agent.status,
                    score: agent.ethicalScore,
                    color: getNodeColor(agent.status)
                });
            });

            // Add Ethical Principles
            data.principles.forEach(principle => {
                nodes.push({
                    id: principle.id,
                    name: principle.name,
                    type: 'principle',
                    color: '#4CAF50'  // Green for principles
                });
            });

            // Add Relationships
            data.relationships.forEach(rel => {
                links.push({
                    source: rel.source,
                    target: rel.target,
                    type: rel.type,
                    strength: rel.strength
                });
            });

            setGraphData({ nodes, links });
        } catch (err) {
            console.error('Error fetching graph data:', err);
            setError('Failed to load Ethics Knowledge Graph data');
        } finally {
            setLoading(false);
        }
    };

    const getNodeColor = (status) => {
        switch (status) {
            case 'EXCELLENT':
                return '#2196F3';  // Blue
            case 'GOOD':
                return '#4CAF50';  // Green
            case 'ACCEPTABLE':
                return '#FFC107';  // Amber
            case 'NEEDS_IMPROVEMENT':
                return '#FF9800';  // Orange
            case 'FAILED':
                return '#F44336';  // Red
            default:
                return '#9E9E9E';  // Grey
        }
    };

    const handleNodeClick = (node) => {
        if (fgRef.current) {
            // Aim at node from outside
            const distance = 40;
            const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

            fgRef.current.centerAt(
                node.x * distRatio,
                node.y * distRatio,
                1000
            );
            fgRef.current.zoom(2.5, 1000);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ my: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Ethics Knowledge Graph Visualization
            </Typography>
            <Box sx={{ height: '600px', border: '1px solid #ddd', borderRadius: '4px' }}>
                {graphData && (
                    <ForceGraph2D
                        ref={fgRef}
                        graphData={graphData}
                        nodeLabel="name"
                        nodeColor={node => node.color}
                        nodeRelSize={6}
                        linkWidth={link => link.strength}
                        linkColor={() => '#999'}
                        onNodeClick={handleNodeClick}
                        cooldownTicks={100}
                        linkDirectionalParticles={2}
                        linkDirectionalParticleSpeed={0.005}
                    />
                )}
            </Box>
        </Box>
    );
};

export default EthicsKnowledgeGraphVisualizer; 