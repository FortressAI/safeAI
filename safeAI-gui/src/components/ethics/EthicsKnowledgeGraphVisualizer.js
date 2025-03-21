import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, IconButton, Paper } from '@mui/material';
import * as d3 from 'd3';
import SearchIcon from '@mui/icons-material/Search';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

// Mock API function - replace with actual API call
const fetchEthicsKnowledgeGraph = () => {
  return {
    nodes: [
      { id: 'ethics', label: 'Ethics', type: 'domain' },
      { id: 'autonomy', label: 'Autonomy', type: 'concept' },
      { id: 'responsibility', label: 'Responsibility', type: 'concept' },
      { id: 'transparency', label: 'Transparency', type: 'principle' },
      { id: 'accountability', label: 'Accountability', type: 'principle' },
      { id: 'fairness', label: 'Fairness', type: 'principle' },
    ],
    links: [
      { source: 'ethics', target: 'autonomy' },
      { source: 'ethics', target: 'responsibility' },
      { source: 'autonomy', target: 'transparency' },
      { source: 'responsibility', target: 'accountability' },
      { source: 'ethics', target: 'fairness' },
    ],
  };
};

const nodeColors = {
  domain: '#4CAF50',
  concept: '#2196F3',
  principle: '#FFC107',
  example: '#9C27B0',
};

const EthicsKnowledgeGraphVisualizer = () => {
  const svgRef = useRef(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEthicsKnowledgeGraph();
        setGraphData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching graph data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && graphData.nodes.length > 0) {
      renderGraph();
    }
  }, [graphData, loading]);

  const renderGraph = () => {
    const width = 800;
    const height = 600;

    // Clear existing SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    // Create force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw links
    const links = g.selectAll('.link')
      .data(graphData.links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .style('stroke', '#999')
      .style('stroke-opacity', 0.6)
      .style('stroke-width', 1);

    // Draw nodes
    const nodes = g.selectAll('.node')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    nodes.append('circle')
      .attr('r', 10)
      .style('fill', d => nodeColors[d.type])
      .style('stroke', '#fff')
      .style('stroke-width', 1.5);

    nodes.append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .text(d => d.label);

    // Add title for hover effect
    nodes.append('title')
      .text(d => `${d.label} (${d.type})`);

    // Update positions on each tick
    simulation.on('tick', () => {
      links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      nodes
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  const handleSearch = () => {
    if (!searchTerm) return;
    const node = graphData.nodes.find(n => 
      n.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSelectedNode(node || null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Search nodes"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mr: 1 }}
        />
        <IconButton onClick={handleSearch} color="primary">
          <SearchIcon />
        </IconButton>
      </Box>

      {selectedNode && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{selectedNode.label}</Typography>
          <Typography variant="body2">Type: {selectedNode.type}</Typography>
        </Paper>
      )}

      {loading ? (
        <Typography>Loading graph...</Typography>
      ) : (
        <svg ref={svgRef} style={{ border: '1px solid #ccc' }} />
      )}
    </Box>
  );
};

export default EthicsKnowledgeGraphVisualizer; 