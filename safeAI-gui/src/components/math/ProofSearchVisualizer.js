import React, { useRef, useEffect } from 'react';
import { Paper, Typography, Box, CircularProgress, Chip } from '@mui/material';
import * as d3 from 'd3';

const ProofSearchVisualizer = ({ data, loading, searchStrategy = 'depth-first' }) => {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (loading || !data || !data.nodes || !data.links) return;
    
    const width = 800;
    const height = 400;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");
      
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));
    
    // Create a gradient for nodes
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "node-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");
      
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#6573c3");
      
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#3f51b5");
      
    // Draw links
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value || 1));
      
    // Draw nodes
    const node = svg.append("g")
      .selectAll(".node")
      .data(data.nodes)
      .join("g")
      .attr("class", "node")
      .call(drag(simulation));
      
    // Node circles
    node.append("circle")
      .attr("r", d => (d.type === 'theorem' ? 12 : d.type === 'axiom' ? 10 : 7))
      .attr("fill", d => {
        if (d.type === 'theorem') return "url(#node-gradient)";
        if (d.type === 'axiom') return "#4caf50";
        if (d.visited) return "#ff9800";
        return "#e0e0e0";
      })
      .attr("stroke", d => d.proven ? "#4caf50" : "#999")
      .attr("stroke-width", d => d.proven ? 3 : 1);
      
    // Node labels
    node.append("text")
      .attr("x", 0)
      .attr("y", d => (d.type === 'theorem' ? 20 : d.type === 'axiom' ? 18 : 15))
      .attr("text-anchor", "middle")
      .text(d => d.name)
      .attr("font-size", "10px")
      .attr("fill", "#333");
      
    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
        
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
    
    // Drag functionality
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
    
    return () => {
      simulation.stop();
    };
  }, [data, loading]);
  
  // Strategy description
  const getStrategyDescription = () => {
    switch (searchStrategy) {
      case 'depth-first':
        return 'Depth-first search explores as far as possible along each branch before backtracking.';
      case 'breadth-first':
        return 'Breadth-first search explores all nodes at the present depth before moving to nodes at the next depth level.';
      case 'heuristic':
        return 'Heuristic search uses a problem-specific scoring function to determine which paths to explore first.';
      default:
        return 'Search strategy explores the proof space to find valid derivations.';
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Proof Search Visualization
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mr: 2 }}>
          Search Strategy:
        </Typography>
        <Chip 
          label={searchStrategy.replace('-', ' ')} 
          color="primary" 
          variant="outlined" 
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {getStrategyDescription()}
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <svg ref={svgRef} style={{ display: 'block', margin: '0 auto' }}></svg>
          
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                bgcolor: 'primary.main', 
                borderRadius: '50%', 
                mr: 1 
              }}></Box>
              <Typography variant="caption">Theorem</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                bgcolor: 'success.main', 
                borderRadius: '50%', 
                mr: 1 
              }}></Box>
              <Typography variant="caption">Axiom</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                bgcolor: 'warning.main', 
                borderRadius: '50%', 
                mr: 1 
              }}></Box>
              <Typography variant="caption">Visited</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                bgcolor: '#e0e0e0', 
                borderRadius: '50%', 
                mr: 1 
              }}></Box>
              <Typography variant="caption">Unvisited</Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default ProofSearchVisualizer; 