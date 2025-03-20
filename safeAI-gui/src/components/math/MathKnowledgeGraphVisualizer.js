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
  IconButton,
  TextField
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import * as d3 from 'd3';
import { TreeView, TreeItem } from '@mui/lab';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Mock API function - replace with actual API calls
const fetchMathKnowledgeGraph = () => {
  return Promise.resolve({
    domains: [
      {
        name: "Number Theory",
        description: "Study of integers and properties",
        concepts: [
          {
            id: "concept-1",
            name: "Prime Number",
            definition: "\\text{A natural number greater than 1 that is not a product of two smaller natural numbers}",
            examples: [
              { text: "2, 3, 5, 7, 11, 13, ...", notation: "\\{2, 3, 5, 7, 11, 13, \\ldots\\}" }
            ],
            theorems: [
              {
                id: "thm-1",
                name: "Euclid's Theorem",
                statement: "\\text{There are infinitely many prime numbers}",
                proof: "\\text{Suppose there are finitely many primes } p_1, p_2, \\ldots, p_n. \\text{ Consider } N = p_1 \\cdot p_2 \\cdot \\ldots \\cdot p_n + 1. \\text{ Either } N \\text{ is prime or it has a prime factor. This prime factor cannot be any of } p_1, p_2, \\ldots, p_n \\text{ (since dividing } N \\text{ by any of these would leave remainder 1). \\text{ Thus, there exists a prime not in our list, contradicting our assumption.}"
              },
              {
                id: "thm-2",
                name: "Fundamental Theorem of Arithmetic",
                statement: "\\text{Every integer greater than 1 can be represented as a product of primes in a unique way (up to the order of factors)}",
                proof: "\\text{The proof relies on the well-ordering principle and proceeds by induction...}"
              }
            ],
            relations: [
              { to: "concept-5", type: "subset" }
            ]
          },
          {
            id: "concept-2",
            name: "Perfect Number",
            definition: "\\text{A positive integer that is equal to the sum of its proper divisors}",
            examples: [
              { text: "6 = 1 + 2 + 3", notation: "6 = 1 + 2 + 3" },
              { text: "28 = 1 + 2 + 4 + 7 + 14", notation: "28 = 1 + 2 + 4 + 7 + 14" }
            ],
            theorems: [
              {
                id: "thm-3",
                name: "Euclid-Euler Theorem",
                statement: "\\text{An even number is perfect if and only if it has the form } 2^{n-1}(2^n - 1) \\text{ where } 2^n - 1 \\text{ is prime}",
                proof: "\\text{The proof involves algebraic manipulation and properties of Mersenne primes...}"
              }
            ],
            relations: [
              { to: "concept-5", type: "subset" }
            ]
          },
          {
            id: "concept-3",
            name: "Fibonacci Numbers",
            definition: "\\text{The sequence defined by the recurrence relation } F_n = F_{n-1} + F_{n-2} \\text{ with } F_0 = 0, F_1 = 1",
            examples: [
              { text: "0, 1, 1, 2, 3, 5, 8, 13, 21, ...", notation: "\\{0, 1, 1, 2, 3, 5, 8, 13, 21, \\ldots\\}" }
            ],
            theorems: [
              {
                id: "thm-4",
                name: "Binet's Formula",
                statement: "F_n = \\frac{\\phi^n - (1-\\phi)^n}{\\sqrt{5}} \\text{ where } \\phi = \\frac{1 + \\sqrt{5}}{2} \\text{ is the golden ratio}",
                proof: "\\text{The proof uses the characteristic equation of the recurrence relation...}"
              }
            ],
            relations: [
              { to: "concept-5", type: "subset" }
            ]
          }
        ]
      },
      {
        name: "Abstract Algebra",
        description: "Study of algebraic structures",
        concepts: [
          {
            id: "concept-4",
            name: "Group",
            definition: "\\text{A set } G \\text{ together with a binary operation } \\cdot \\text{ that satisfies closure, associativity, identity, and inverse properties}",
            examples: [
              { text: "Integers under addition", notation: "(\\mathbb{Z}, +)" },
              { text: "Non-zero real numbers under multiplication", notation: "(\\mathbb{R} \\setminus \\{0\\}, \\times)" }
            ],
            theorems: [
              {
                id: "thm-5",
                name: "Lagrange's Theorem",
                statement: "\\text{If } H \\text{ is a subgroup of a finite group } G \\text{, then the order of } H \\text{ divides the order of } G",
                proof: "\\text{The proof uses cosets and their properties...}"
              }
            ],
            relations: []
          }
        ]
      },
      {
        name: "Calculus",
        description: "Study of change and accumulation",
        concepts: [
          {
            id: "concept-5",
            name: "Derivative",
            definition: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
            examples: [
              { text: "Derivative of x^2 is 2x", notation: "\\frac{d}{dx}[x^2] = 2x" },
              { text: "Derivative of sin(x) is cos(x)", notation: "\\frac{d}{dx}[\\sin(x)] = \\cos(x)" }
            ],
            theorems: [
              {
                id: "thm-6",
                name: "Mean Value Theorem",
                statement: "\\text{If } f \\text{ is continuous on } [a,b] \\text{ and differentiable on } (a,b) \\text{, then there exists } c \\in (a,b) \\text{ such that } f'(c) = \\frac{f(b) - f(a)}{b-a}",
                proof: "\\text{The proof applies Rolle's Theorem to an auxiliary function...}"
              }
            ],
            relations: []
          }
        ]
      }
    ]
  });
};

// Colors for different node types
const nodeColors = {
  domain: '#4caf50',
  concept: '#2196f3',
  theorem: '#ff9800',
  example: '#9c27b0',
  relation: '#f44336'
};

const MathKnowledgeGraphVisualizer = () => {
  const svgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [kgData, setKgData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('graph');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedConcept, setSelectedConcept] = useState(null);
  
  // Fetch KG data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const kgResponse = await fetchMathKnowledgeGraph();
        setKgData(kgResponse);
        
        // Generate graph data from KG
        const graphData = generateGraphData(kgResponse);
        setGraphData(graphData);
      } catch (error) {
        console.error("Failed to load Mathematics Knowledge Graph data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Update graph visualization when data changes
  useEffect(() => {
    if (loading || !graphData.nodes.length) return;
    
    if (viewMode === 'graph') {
      renderGraph();
    }
  }, [graphData, loading, viewMode]);
  
  // Generate graph data from KG data
  const generateGraphData = (kg) => {
    const nodes = [];
    const links = [];
    
    // Add the KG itself as a central node
    nodes.push({
      id: 'math-kg',
      name: 'Math Knowledge Graph',
      type: 'knowledge_graph',
      status: 'root'
    });
    
    // Add domains
    kg.domains.forEach(domain => {
      const domainId = `domain-${domain.name.replace(/\s+/g, '-').toLowerCase()}`;
      
      // Add domain node
      nodes.push({
        id: domainId,
        name: domain.name,
        type: 'domain',
        details: domain
      });
      
      // Link to KG
      links.push({
        source: 'math-kg',
        target: domainId,
        type: 'contains'
      });
      
      // Add concepts for this domain
      domain.concepts.forEach(concept => {
        const conceptId = concept.id;
        
        // Add concept node
        nodes.push({
          id: conceptId,
          name: concept.name,
          type: 'concept',
          details: concept,
          domain: domain.name
        });
        
        // Link to domain
        links.push({
          source: domainId,
          target: conceptId,
          type: 'concept'
        });
        
        // Add theorems for this concept
        concept.theorems.forEach(theorem => {
          const theoremId = theorem.id;
          
          // Add theorem node
          nodes.push({
            id: theoremId,
            name: theorem.name,
            type: 'theorem',
            details: theorem,
            concept: concept.name
          });
          
          // Link to concept
          links.push({
            source: conceptId,
            target: theoremId,
            type: 'theorem'
          });
        });
        
        // Add examples for this concept
        if (concept.examples) {
          concept.examples.forEach((example, idx) => {
            const exampleId = `${conceptId}-example-${idx}`;
            
            // Add example node
            nodes.push({
              id: exampleId,
              name: example.text,
              type: 'example',
              details: example,
              concept: concept.name
            });
            
            // Link to concept
            links.push({
              source: conceptId,
              target: exampleId,
              type: 'example'
            });
          });
        }
        
        // Add relations for this concept
        if (concept.relations) {
          concept.relations.forEach((relation, idx) => {
            const relationId = `${conceptId}-relation-${idx}`;
            
            // Add relation link directly
            if (relation.to) {
              links.push({
                source: conceptId,
                target: relation.to,
                type: relation.type || 'relates'
              });
            }
          });
        }
      });
    });
    
    return { nodes, links };
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
    
    // Define arrowhead marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");
    
    // Initialize the simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(60));
    
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
      .attr("r", d => {
        if (d.type === 'knowledge_graph') return 40;
        if (d.type === 'domain') return 30;
        if (d.type === 'concept') return 20;
        return 15;
      })
      .attr("fill", d => nodeColors[d.type] || "#999")
      .on("click", (event, d) => {
        setSelectedNode(d);
        if (d.type === 'domain') {
          setSelectedDomain(d.details);
          setSelectedConcept(null);
        } else if (d.type === 'concept') {
          const domain = kgData.domains.find(domain => 
            domain.concepts.some(c => c.id === d.id)
          );
          if (domain) {
            setSelectedDomain(domain);
            setSelectedConcept(d.details);
          }
        }
      });
    
    // Add labels to nodes
    node.append("text")
      .attr("dy", d => {
        if (d.type === 'knowledge_graph') return 50;
        if (d.type === 'domain') return 40;
        if (d.type === 'concept') return 30;
        return 25;
      })
      .attr("text-anchor", "middle")
      .text(d => d.name)
      .attr("font-size", d => {
        if (d.type === 'knowledge_graph') return "14px";
        if (d.type === 'domain') return "12px";
        return "10px";
      })
      .attr("fill", "#fff")
      .call(wrap, 120);
    
    // Text wrapping function
    function wrap(text, width) {
      text.each(function() {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        const lineHeight = 1.1;
        const y = text.attr("y");
        const dy = parseFloat(text.attr("dy"));
        
        let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "px");
        let lineNumber = 0;
        let line = [];
        let word = words.pop();
        
        while (word) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            lineNumber += 1;
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${lineNumber * lineHeight + dy}px`).text(word);
          }
          word = words.pop();
        }
      });
    }
    
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
  
  // Format names or text for display
  const formatName = (name) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Search in the knowledge graph
  const handleSearch = () => {
    if (!searchQuery.trim() || !kgData) return;
    
    const query = searchQuery.toLowerCase();
    const results = [];
    
    // Search in domains
    kgData.domains.forEach(domain => {
      if (domain.name.toLowerCase().includes(query) || 
          domain.description.toLowerCase().includes(query)) {
        results.push({
          type: 'domain',
          name: domain.name,
          match: 'Domain name or description',
          item: domain
        });
      }
      
      // Search in concepts
      domain.concepts.forEach(concept => {
        if (concept.name.toLowerCase().includes(query) || 
            concept.definition.toLowerCase().includes(query)) {
          results.push({
            type: 'concept',
            name: concept.name,
            domain: domain.name,
            match: 'Concept name or definition',
            item: concept
          });
        }
        
        // Search in theorems
        concept.theorems.forEach(theorem => {
          if (theorem.name.toLowerCase().includes(query) || 
              theorem.statement.toLowerCase().includes(query)) {
            results.push({
              type: 'theorem',
              name: theorem.name,
              concept: concept.name,
              domain: domain.name,
              match: 'Theorem name or statement',
              item: theorem
            });
          }
        });
        
        // Search in examples
        if (concept.examples) {
          concept.examples.forEach(example => {
            if (example.text.toLowerCase().includes(query)) {
              results.push({
                type: 'example',
                text: example.text,
                concept: concept.name,
                domain: domain.name,
                match: 'Example text',
                item: example
              });
            }
          });
        }
      });
    });
    
    setSearchResults(results);
  };
  
  // Handle search result click
  const handleSearchResultClick = (result) => {
    if (result.type === 'domain') {
      setSelectedDomain(result.item);
      setSelectedConcept(null);
      setSelectedNode({
        id: `domain-${result.item.name.replace(/\s+/g, '-').toLowerCase()}`,
        name: result.item.name,
        type: 'domain',
        details: result.item
      });
    } else if (result.type === 'concept') {
      const domain = kgData.domains.find(d => d.name === result.domain);
      setSelectedDomain(domain);
      setSelectedConcept(result.item);
      setSelectedNode({
        id: result.item.id,
        name: result.item.name,
        type: 'concept',
        details: result.item
      });
    }
    
    setSearchResults([]);
    setSearchQuery('');
    setViewMode('detail');
  };
  
  // Render domain and concept details
  const renderDetailView = () => {
    if (!selectedDomain) {
      return (
        <Typography variant="body2" color="text.secondary">
          Select a domain or concept to view details
        </Typography>
      );
    }
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              {selectedDomain.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {selectedDomain.description}
            </Typography>
            {!selectedConcept && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Concepts in this domain:
                </Typography>
                <Grid container spacing={2}>
                  {selectedDomain.concepts.map(concept => (
                    <Grid item xs={12} sm={6} md={4} key={concept.id}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        onClick={() => setSelectedConcept(concept)}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {concept.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <InlineMath math={concept.definition} />
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {selectedConcept && (
          <>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    {selectedConcept.name}
                  </Typography>
                  <Button 
                    size="small" 
                    startIcon={<ChevronRightIcon />}
                    onClick={() => setSelectedConcept(null)}
                  >
                    Back to {selectedDomain.name}
                  </Button>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Definition:
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <BlockMath math={selectedConcept.definition} />
                  </Paper>
                </Box>
                
                {selectedConcept.examples && selectedConcept.examples.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Examples:
                    </Typography>
                    <List>
                      {selectedConcept.examples.map((example, idx) => (
                        <ListItem key={idx} divider={idx < selectedConcept.examples.length - 1}>
                          <ListItemText
                            primary={example.text}
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <InlineMath math={example.notation} />
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                
                {selectedConcept.theorems && selectedConcept.theorems.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Related Theorems:
                    </Typography>
                    <TreeView
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpandIcon={<ChevronRightIcon />}
                    >
                      {selectedConcept.theorems.map((theorem, idx) => (
                        <TreeItem 
                          key={theorem.id} 
                          nodeId={theorem.id} 
                          label={
                            <Typography variant="subtitle2">
                              {theorem.name}
                            </Typography>
                          }
                        >
                          <Box sx={{ pl: 2, pr: 2, pb: 2 }}>
                            <Typography variant="body2" gutterBottom>
                              Statement:
                            </Typography>
                            <Paper 
                              variant="outlined" 
                              sx={{ 
                                p: 2, 
                                mb: 2,
                                bgcolor: 'background.default'
                              }}
                            >
                              <BlockMath math={theorem.statement} />
                            </Paper>
                            
                            <Typography variant="body2" gutterBottom>
                              Proof:
                            </Typography>
                            <Paper 
                              variant="outlined" 
                              sx={{ 
                                p: 2,
                                bgcolor: 'background.default',
                                maxHeight: 200,
                                overflow: 'auto'
                              }}
                            >
                              <InlineMath math={theorem.proof} />
                            </Paper>
                          </Box>
                        </TreeItem>
                      ))}
                    </TreeView>
                  </Box>
                )}
              </Paper>
            </Grid>
          </>
        )}
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
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h5" gutterBottom>
                  Mathematics Knowledge Graph
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore mathematical concepts, theorems, and their relationships
                </Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={{ display: 'flex' }}>
                  <TextField
                    fullWidth
                    placeholder="Search for concepts, theorems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    variant="outlined"
                    size="small"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    sx={{ ml: 1 }}
                  >
                    <SearchIcon />
                  </Button>
                </Box>
                
                {/* Search results */}
                {searchResults.length > 0 && (
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      mt: 1, 
                      maxHeight: 300, 
                      overflow: 'auto',
                      position: 'absolute',
                      zIndex: 9999,
                      width: 'calc(100% - 95px)'
                    }}
                  >
                    <List dense>
                      {searchResults.map((result, idx) => (
                        <ListItem 
                          key={idx} 
                          button 
                          divider={idx < searchResults.length - 1}
                          onClick={() => handleSearchResultClick(result)}
                        >
                          <ListItemText
                            primary={result.name || result.text}
                            secondary={
                              <>
                                <Typography variant="caption" component="span">
                                  {result.type.charAt(0).toUpperCase() + result.type.slice(1)} in {result.domain}
                                  {result.concept && ` > ${result.concept}`}
                                </Typography>
                                <Chip 
                                  label={result.match} 
                                  size="small" 
                                  sx={{ ml: 1 }} 
                                  variant="outlined"
                                />
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Button
              variant={viewMode === 'graph' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('graph')}
              sx={{ mr: 1 }}
            >
              Graph View
            </Button>
            <Button
              variant={viewMode === 'detail' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('detail')}
            >
              Detail View
            </Button>
          </Box>
          
          {viewMode === 'graph' ? (
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
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
              <Grid item xs={12} lg={4}>
                {selectedNode ? (
                  <Card>
                    <CardHeader
                      title={selectedNode.name}
                      subheader={`Type: ${formatName(selectedNode.type)}`}
                    />
                    <CardContent>
                      {selectedNode.type === 'domain' && (
                        <>
                          <Typography variant="body1" paragraph>
                            {selectedNode.details.description}
                          </Typography>
                          <Button 
                            variant="outlined" 
                            onClick={() => {
                              setSelectedDomain(selectedNode.details);
                              setSelectedConcept(null);
                              setViewMode('detail');
                            }}
                          >
                            View Domain Details
                          </Button>
                        </>
                      )}
                      
                      {selectedNode.type === 'concept' && (
                        <>
                          <Typography variant="subtitle2" gutterBottom>
                            Definition:
                          </Typography>
                          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                            <BlockMath math={selectedNode.details.definition} />
                          </Paper>
                          
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Domain: {selectedNode.domain}
                          </Typography>
                          
                          <Button 
                            variant="outlined" 
                            onClick={() => {
                              const domain = kgData.domains.find(d => 
                                d.concepts.some(c => c.id === selectedNode.id)
                              );
                              if (domain) {
                                setSelectedDomain(domain);
                                setSelectedConcept(selectedNode.details);
                                setViewMode('detail');
                              }
                            }}
                          >
                            View Concept Details
                          </Button>
                        </>
                      )}
                      
                      {selectedNode.type === 'theorem' && (
                        <>
                          <Typography variant="subtitle2" gutterBottom>
                            Statement:
                          </Typography>
                          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                            <BlockMath math={selectedNode.details.statement} />
                          </Paper>
                          
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Related to concept: {selectedNode.concept}
                          </Typography>
                        </>
                      )}
                      
                      {selectedNode.type === 'example' && (
                        <>
                          <Typography variant="body1" paragraph>
                            {selectedNode.details.text}
                          </Typography>
                          
                          <Typography variant="subtitle2" gutterBottom>
                            Notation:
                          </Typography>
                          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                            <InlineMath math={selectedNode.details.notation} />
                          </Paper>
                          
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            Example of concept: {selectedNode.concept}
                          </Typography>
                        </>
                      )}
                      
                      {selectedNode.type === 'knowledge_graph' && (
                        <Typography variant="body1">
                          The Mathematics Knowledge Graph contains concepts, theorems, and examples from various mathematical domains.
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Click on a node in the graph to view its details
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            </Grid>
          ) : (
            renderDetailView()
          )}
          
          <Box sx={{ mt: 4 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" gutterBottom>
                About Mathematics Knowledge Graph
              </Typography>
              <Typography variant="body2">
                This Knowledge Graph represents mathematical knowledge across different domains, showcasing the relationships between concepts, theorems, and examples. It helps visualize the interconnected nature of mathematical knowledge and facilitates exploration of the mathematical universe.
              </Typography>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MathKnowledgeGraphVisualizer; 