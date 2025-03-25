import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, IconButton, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import * as d3 from 'd3';
import SearchIcon from '@mui/icons-material/Search';
import Web3 from 'web3';
import { ethers } from 'ethers';

// Smart Contract ABI - Replace with actual ABI after deployment
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "registerPublisher",
    "outputs": [{"type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "string"}],
    "name": "publishContent",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const CONTRACT_ADDRESS = "0x..."; // Replace with actual contract address

const nodeColors = {
  publisher: '#4CAF50',
  article: '#2196F3',
  topic: '#FFC107',
  license: '#9C27B0',
};

const FreePressKnowledgeGraphVisualizer = () => {
  const svgRef = useRef(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [publishDialog, setPublishDialog] = useState(false);
  const [newContent, setNewContent] = useState({
    title: '',
    content: '',
    price: ''
  });

  useEffect(() => {
    initializeBlockchain();
    fetchGraphData();
  }, []);

  const initializeBlockchain = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        
        setWeb3(web3Instance);
        setContract(contractInstance);
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error initializing blockchain:', error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const fetchGraphData = async () => {
    try {
      // Replace with actual API call
      const mockData = {
        nodes: [
          { id: 'nyt', label: 'New York Times', type: 'publisher' },
          { id: 'article1', label: 'Breaking News', type: 'article' },
          { id: 'politics', label: 'Politics', type: 'topic' },
          { id: 'license1', label: 'Content License', type: 'license' }
        ],
        links: [
          { source: 'nyt', target: 'article1' },
          { source: 'article1', target: 'politics' },
          { source: 'article1', target: 'license1' }
        ]
      };
      setGraphData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching graph data:', error);
      setLoading(false);
    }
  };

  const publishContent = async () => {
    if (!contract || !account) return;
    
    try {
      const contentHash = ethers.utils.id(JSON.stringify(newContent));
      await contract.methods.publishContent(contentHash).send({ from: account });
      
      // Update graph data
      const newNode = {
        id: contentHash,
        label: newContent.title,
        type: 'article'
      };
      
      setGraphData(prev => ({
        nodes: [...prev.nodes, newNode],
        links: [...prev.links, { source: account, target: contentHash }]
      }));
      
      setPublishDialog(false);
      setNewContent({ title: '', content: '', price: '' });
    } catch (error) {
      console.error('Error publishing content:', error);
    }
  };

  useEffect(() => {
    if (!loading && graphData.nodes.length > 0) {
      renderGraph();
    }
  }, [graphData, loading]);

  const renderGraph = () => {
    const width = 800;
    const height = 600;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const links = g.selectAll('.link')
      .data(graphData.links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .style('stroke', '#999')
      .style('stroke-opacity', 0.6)
      .style('stroke-width', 1);

    const nodes = g.selectAll('.node')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .on('click', (event, d) => setSelectedNode(d))
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

    nodes.append('title')
      .text(d => `${d.label} (${d.type})`);

    simulation.on('tick', () => {
      links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      nodes
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Search nodes"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 1 }}
          />
          <IconButton onClick={() => {}} color="primary">
            <SearchIcon />
          </IconButton>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => setPublishDialog(true)}
          disabled={!account}
        >
          Publish Content
        </Button>
      </Box>

      {selectedNode && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{selectedNode.label}</Typography>
          <Typography variant="body2">Type: {selectedNode.type}</Typography>
          {selectedNode.type === 'article' && (
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 1 }}
              onClick={() => {}}
            >
              Purchase License
            </Button>
          )}
        </Paper>
      )}

      {loading ? (
        <Typography>Loading graph...</Typography>
      ) : (
        <svg ref={svgRef} style={{ border: '1px solid #ccc' }} />
      )}

      <Dialog open={publishDialog} onClose={() => setPublishDialog(false)}>
        <DialogTitle>Publish New Content</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newContent.title}
            onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={newContent.content}
            onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Price (ETH)"
            fullWidth
            type="number"
            value={newContent.price}
            onChange={(e) => setNewContent(prev => ({ ...prev, price: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialog(false)}>Cancel</Button>
          <Button onClick={publishContent} color="primary">Publish</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FreePressKnowledgeGraphVisualizer; 