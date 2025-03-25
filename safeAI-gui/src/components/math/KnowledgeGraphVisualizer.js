import React, { useEffect, useRef, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Chip, 
  Grid, 
  Card, 
  CardHeader, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import * as d3 from 'd3';
import { fetchMathKnowledgeGraph, getATPAgents } from '../../utils/api';

// Colors for different node types
const nodeColors = {
  agent: '#4caf50',
  axiom: '#2196f3',
  theorem: '#ff9800',
  inference_rule: '#9c27b0',
  proof_system: '#f44336'
};

const KnowledgeGraphVisualizer = () => {
  const svgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [kgData, setKgData] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('graph');
  const [selectedProofSystem, setSelectedProofSystem] = useState('first_order_logic');
  
  // Fetch KG data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [kgResponse, agentsResponse] = await Promise.all([
          fetchMathKnowledgeGraph(),
          getATPAgents()
        ]);
        
        setKgData(kgResponse);
        setAgents(agentsResponse);
        
        // Generate graph data from KG
        const graphData = generateGraphData(kgResponse, agentsResponse);
        setGraphData(graphData);
      } catch (error) {
        console.error("Failed to load Knowledge Graph data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Update graph visualization when data changes
  useEffect(() => {
    if (loading || !graphData.nodes.length) return;
    
    renderGraph();
  }, [graphData, loading, viewMode]);
  
  // Generate graph data from KG data
  const generateGraphData = (kg, agents) => {
    const nodes = [];
    const links = [];
    const addedNodes = new Set();
    
    // Add the KG itself as a central node
    nodes.push({
      id: 'math-kg',
      name: 'Math Knowledge Graph',
      type: 'knowledge_graph',
      status: 'root'
    });
    
    // Add proof systems
    Object.keys(kg.proof_systems || {}).forEach(systemName => {
      const systemId = `system-${systemName}`;
      
      // Add proof system node
      nodes.push({
        id: systemId,
        name: formatName(systemName),
        type: 'proof_system',
        details: kg.proof_systems[systemName]
      });
      
      // Link to KG
      links.push({
        source: 'math-kg',
        target: systemId,
        type: 'contains'
      });
      
      // Add axioms for this system
      const axioms = kg.proof_systems[systemName].axioms || [];
      axioms.forEach((axiom, index) => {
        const axiomId = `${systemName}-axiom-${index}`;
        
        // Add axiom node
        nodes.push({
          id: axiomId,
          name: axiom.length > 30 ? axiom.substring(0, 30) + '...' : axiom,
          fullText: axiom,
          type: 'axiom',
          system: systemName
        });
        
        // Link to system
        links.push({
          source: systemId,
          target: axiomId,
          type: 'axiom'
        });
      });
      
      // Add inference rules for this system
      const rules = kg.proof_systems[systemName].inference_rules || [];
      rules.forEach((rule, index) => {
        const ruleId = `${systemName}-rule-${index}`;
        
        // Add rule node
        nodes.push({
          id: ruleId,
          name: rule.name,
          type: 'inference_rule',
          details: rule,
          system: systemName
        });
        
        // Link to system
        links.push({
          source: systemId,
          target: ruleId,
          type: 'rule'
        });
      });
    });
    
    // Add ATP agents
    agents.forEach(agent => {
      const agentId = `agent-${agent.name}`;
      
      // Add agent node
      nodes.push({
        id: agentId,
        name: agent.name,
        type: 'agent',
        details: agent
      });
      
      // Link to KG
      links.push({
        source: 'math-kg',
        target: agentId,
        type: 'agent'
      });
    });
    
    return { nodes, links };
  };
  
  // Format system name for display
  const formatName = (name) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Render the graph visualization using D3
  const renderGraph = () => {
    const width = svgRef.current.clientWidth;
    const height = 600;
    
    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    
    // Create a group for the graph
    const g = svg.append("g");
    
    // Create a zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    // Apply zoom behavior to SVG
    svg.call(zoom);
    
    // Initialize the simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(50));
    
    // Define arrowhead marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");
    
    // Create links
    const link = g.append("g")
      .selectAll("line")
      .data(graphData.links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrowhead)");
    
    // Create node groups
    const node = g.append("g")
      .selectAll(".node")
      .data(graphData.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    // Add circles to nodes
    node.append("circle")
      .attr("r", d => d.type === 'knowledge_graph' ? 30 : 15)
      .attr("fill", d => nodeColors[d.type] || "#999")
      .on("click", (event, d) => {
        setSelectedNode(d);
      });
    
    // Add labels to nodes
    node.append("text")
      .attr("dy", 30)
      .attr("text-anchor", "middle")
      .text(d => d.name)
      .attr("font-size", "10px")
      .attr("fill", "#fff");
    
    // Define drag behavior functions
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
    
    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
  };
  
  // Render node details panel
  const renderNodeDetails = () => {
    if (!selectedNode) {
      return (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Click on a node in the graph to view its details
            </Typography>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card variant="outlined">
        <CardHeader
          title={selectedNode.name}
          subheader={`Type: ${formatName(selectedNode.type)}`}
        />
        <CardContent>
          {selectedNode.type === 'agent' && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Agent Details:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Description" 
                    secondary={selectedNode.details?.description || "No description available"} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Category" 
                    secondary={selectedNode.details?.category || "N/A"} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Usage Count" 
                    secondary={selectedNode.details?.usageCount || 0} 
                  />
                </ListItem>
              </List>
              {selectedNode.details?.agent_code && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Agent Code Preview:
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 1, 
                      maxHeight: 150, 
                      overflow: 'auto',
                      bgcolor: 'grey.900'
                    }}
                  >
                    <Typography variant="body2" component="pre" sx={{ 
                      fontSize: '0.75rem',
                      whiteSpace: 'pre-wrap',
                      color: 'success.light'
                    }}>
                      {selectedNode.details.agent_code.substring(0, 300)}...
                    </Typography>
                  </Paper>
                </Box>
              )}
            </>
          )}
          
          {selectedNode.type === 'axiom' && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Axiom:
              </Typography>
              <Paper variant="outlined" sx={{ p: 1, bgcolor: 'grey.900' }}>
                <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'info.light' }}>
                  {selectedNode.fullText}
                </Typography>
              </Paper>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Proof System: {formatName(selectedNode.system)}
              </Typography>
            </>
          )}
          
          {selectedNode.type === 'inference_rule' && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Inference Rule:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Description" 
                    secondary={selectedNode.details?.description || "No description available"} 
                  />
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem>
                  <ListItemText 
                    primary="Premises" 
                    secondary={
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {selectedNode.details?.premises?.map((premise, idx) => (
                          <Chip key={idx} label={premise} size="small" />
                        )) || "None"}
                      </Box>
                    } 
                  />
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem>
                  <ListItemText 
                    primary="Conclusion" 
                    secondary={selectedNode.details?.conclusion || "N/A"} 
                  />
                </ListItem>
              </List>
            </>
          )}
          
          {selectedNode.type === 'proof_system' && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Proof System:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Axioms" 
                    secondary={`${selectedNode.details?.axioms?.length || 0} axioms defined`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Inference Rules" 
                    secondary={`${selectedNode.details?.inference_rules?.length || 0} rules defined`} 
                  />
                </ListItem>
                {selectedNode.details?.induction_schema && (
                  <ListItem>
                    <ListItemText 
                      primary="Induction Schema" 
                      secondary={
                        <Typography variant="body2" component="pre" sx={{ 
                          fontSize: '0.75rem',
                          whiteSpace: 'pre-wrap',
                          mt: 0.5,
                          p: 1,
                          bgcolor: 'grey.900',
                          borderRadius: 1,
                          color: 'warning.light'
                        }}>
                          {selectedNode.details.induction_schema}
                        </Typography>
                      } 
                    />
                  </ListItem>
                )}
              </List>
            </>
          )}
          
          {selectedNode.type === 'knowledge_graph' && (
            <>
              <Typography variant="body2" paragraph>
                The Math Knowledge Graph contains formal representations of mathematical concepts, 
                axioms, inference rules, and automated theorem proving agents.
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Structure:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Proof Systems" 
                      secondary={`${Object.keys(kgData?.proof_systems || {}).length} systems defined`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="ATP Agents" 
                      secondary={`${agents.length} agents available`} 
                    />
                  </ListItem>
                </List>
              </Box>
            </>
          )}
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              size="small" 
              onClick={() => setSelectedNode(null)}
            >
              Close
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  // Render structured view
  const renderStructuredView = () => {
    if (!kgData) return null;
    
    const system = kgData.proof_systems?.[selectedProofSystem];
    
    if (!system) {
      return (
        <Typography variant="body2" color="error">
          Selected proof system not found
        </Typography>
      );
    }
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="proof-system-select-label">Proof System</InputLabel>
            <Select
              labelId="proof-system-select-label"
              value={selectedProofSystem}
              label="Proof System"
              onChange={(e) => setSelectedProofSystem(e.target.value)}
            >
              {Object.keys(kgData.proof_systems || {}).map((name) => (
                <MenuItem key={name} value={name}>
                  {formatName(name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Axioms" 
              subheader={`${system.axioms?.length || 0} axioms defined`}
            />
            <CardContent>
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {system.axioms?.map((axiom, idx) => (
                  <ListItem key={idx} divider={idx < system.axioms.length - 1}>
                    <ListItemText 
                      primary={
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {axiom}
                        </Typography>
                      } 
                    />
                  </ListItem>
                )) || (
                  <ListItem>
                    <ListItemText primary="No axioms defined" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Inference Rules" 
              subheader={`${system.inference_rules?.length || 0} rules defined`}
            />
            <CardContent>
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {system.inference_rules?.map((rule, idx) => (
                  <ListItem key={idx} divider={idx < system.inference_rules.length - 1}>
                    <ListItemText 
                      primary={rule.name}
                      secondary={
                        <>
                          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                            {rule.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                              {rule.premises.join(', ')}
                            </Typography>
                            <Typography variant="body2" component="span">
                              ⊢ {rule.conclusion}
                            </Typography>
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                )) || (
                  <ListItem>
                    <ListItemText primary="No inference rules defined" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="ATP Agents" 
              subheader={`${agents.length} agents available`}
              action={
                <Tooltip title="ATP agents use the axioms and inference rules to prove theorems">
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                {agents.map((agent, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          {agent.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {agent.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={agent.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Chip 
                            label={`Used: ${agent.usageCount || 0}`} 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Agentic Process Flow" 
              subheader="How agentic knowledge graph works for theorem proving"
            />
            <CardContent>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Typography variant="subtitle2">1. Input</Typography>
                    <Typography variant="body2">
                      Input a theorem in formal mathematical language
                    </Typography>
                  </Grid>
                  <Grid item>→</Grid>
                  <Grid item xs>
                    <Typography variant="subtitle2">2. Analyze</Typography>
                    <Typography variant="body2">
                      Analyze theorem structure and select appropriate agents
                    </Typography>
                  </Grid>
                  <Grid item>→</Grid>
                  <Grid item xs>
                    <Typography variant="subtitle2">3. Prove</Typography>
                    <Typography variant="body2">
                      Apply axioms and inference rules to construct proof
                    </Typography>
                  </Grid>
                  <Grid item>→</Grid>
                  <Grid item xs>
                    <Typography variant="subtitle2">4. Result</Typography>
                    <Typography variant="body2">
                      Return proof results with chain of reasoning
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };
  
  return (
    <Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Math Knowledge Graph Structure
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore the components and relationships in the Math Agentic Knowledge Graph
              </Typography>
            </Box>
            <Box>
              <Button
                variant={viewMode === 'graph' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('graph')}
                sx={{ mr: 1 }}
              >
                Graph View
              </Button>
              <Button
                variant={viewMode === 'structured' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('structured')}
              >
                Structured View
              </Button>
            </Box>
          </Box>

          {viewMode === 'graph' ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper 
                  sx={{ 
                    width: '100%', 
                    height: 600, 
                    overflow: 'hidden',
                    borderRadius: 2,
                    bgcolor: 'background.paper' 
                  }}
                >
                  <svg 
                    ref={svgRef} 
                    style={{ width: '100%', height: '100%' }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                {renderNodeDetails()}
              </Grid>
            </Grid>
          ) : (
            renderStructuredView()
          )}
          
          <Box sx={{ mt: 4 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" gutterBottom>
                About Agentic Knowledge Graphs
              </Typography>
              <Typography variant="body2">
                An Agentic Knowledge Graph combines structured knowledge with autonomous agents that can reason over and act upon that knowledge. In the Math ATP domain, the Knowledge Graph stores mathematical axioms, inference rules, and proof systems, while agents apply various theorem proving strategies.
              </Typography>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};

export default KnowledgeGraphVisualizer; 