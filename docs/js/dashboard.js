const { 
    Box, Typography, Container, Grid, Paper, AppBar, Toolbar,
    IconButton, Icon, CircularProgress, Alert, Fab, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Stepper, Step, StepLabel, StepContent
} = MaterialUI;

// Learning scenarios
const scenarios = [
    {
        id: 'ethics-decision',
        title: 'Ethics Agent Decision Making',
        description: 'Watch how the Ethics Agent evaluates a potential AI decision',
        steps: [
            'Ethics Agent receives request',
            'Evaluates against ethical guidelines',
            'Consults with other agents',
            'Makes final decision'
        ]
    },
    {
        id: 'security-check',
        title: 'Security Protocol',
        description: 'See how the system maintains security across components',
        steps: [
            'Access request received',
            'Security Layer verification',
            'Smart Contract validation',
            'Permission granted/denied'
        ]
    }
];

// Tutorials
const tutorials = {
    'getting-started': [
        {
            step: 1,
            title: 'Understanding the Dashboard',
            content: 'Let\'s explore the main components of the SafeAI system...',
            highlight: '#knowledge-graph'
        },
        {
            step: 2,
            title: 'Monitoring Agent Activity',
            content: 'Watch how different agents work together...',
            highlight: '#agent-activity'
        }
    ]
};

// Real-world examples
const realWorldExamples = [
    {
        title: 'Content Moderation',
        description: 'See how the FreePress Agent evaluates content',
        metrics: {
            'Content Checked': 150,
            'Flagged Content': 3,
            'Action Taken': 'Review Required'
        }
    }
];

function Dashboard() {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [metrics, setMetrics] = React.useState({
        activeAgents: {
            ethics: 0,
            math: 0,
            arc: 0,
            freepress: 0
        },
        knowledgeNodes: {
            total: 0,
            ethics: 0,
            math: 0,
            arc: 0,
            freepress: 0
        },
        securityScore: {
            overall: 0,
            smartContracts: 0,
            accessControl: 0,
            encryption: 0
        },
        systemHealth: {
            overall: 0,
            api: 0,
            database: 0,
            network: 0
        }
    });
    const [lastUpdate, setLastUpdate] = React.useState(new Date());
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [helpDialog, setHelpDialog] = React.useState(false);
    const [learningMode, setLearningMode] = React.useState(false);
    const [currentScenario, setCurrentScenario] = React.useState(null);
    const [showExplanation, setShowExplanation] = React.useState(false);
    const [tutorialMode, setTutorialMode] = React.useState(false);
    const [currentStep, setCurrentStep] = React.useState(0);
    const [showExample, setShowExample] = React.useState(false);
    const [interactiveMode, setInteractiveMode] = React.useState(false);
    const [userProgress, setUserProgress] = React.useState({
        completedTutorials: [],
        viewedComponents: [],
        understandingLevel: 'beginner'
    });
    const [contextHelp, setContextHelp] = React.useState(null);

    const fetchData = React.useCallback(() => {
        // Simulate API call to fetch real data
        setLoading(true);
        setTimeout(() => {
            setMetrics({
                activeAgents: {
                    ethics: Math.floor(Math.random() * 3) + 1,
                    math: Math.floor(Math.random() * 3) + 1,
                    arc: Math.floor(Math.random() * 3) + 1,
                    freepress: Math.floor(Math.random() * 3) + 1
                },
                knowledgeNodes: {
                    total: Math.floor(Math.random() * 1000) + 1000,
                    ethics: Math.floor(Math.random() * 300) + 200,
                    math: Math.floor(Math.random() * 300) + 200,
                    arc: Math.floor(Math.random() * 300) + 200,
                    freepress: Math.floor(Math.random() * 300) + 200
                },
                securityScore: {
                    overall: Math.floor(Math.random() * 5) + 95,
                    smartContracts: Math.floor(Math.random() * 5) + 95,
                    accessControl: Math.floor(Math.random() * 5) + 95,
                    encryption: Math.floor(Math.random() * 5) + 95
                },
                systemHealth: {
                    overall: Math.floor(Math.random() * 5) + 95,
                    api: Math.floor(Math.random() * 5) + 95,
                    database: Math.floor(Math.random() * 5) + 95,
                    network: Math.floor(Math.random() * 5) + 95
                }
            });
            setLastUpdate(new Date());
            setLoading(false);
        }, 1000);
    }, []);

    React.useEffect(() => {
        fetchData();
        // Set up auto-refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const getStatusColor = (value) => {
        if (value >= 95) return 'status-good';
        if (value >= 90) return 'status-warning';
        return 'status-error';
    };

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setHelpDialog(true);
        trackProgress('viewedComponents', card);
    };

    const trackProgress = (action, value) => {
        setUserProgress(prev => ({
            ...prev,
            [action]: [...prev[action], value]
        }));
    };

    const simulateAgentActivity = () => {
        // Simulate agent activity
        setMetrics(prev => ({
            ...prev,
            activeAgents: {
                ...prev.activeAgents,
                ethics: Math.floor(Math.random() * 3) + 1,
                math: Math.floor(Math.random() * 3) + 1,
                arc: Math.floor(Math.random() * 3) + 1,
                freepress: Math.floor(Math.random() * 3) + 1
            }
        }));
    };

    const simulateSecurityEvent = () => {
        // Simulate security event
        setMetrics(prev => ({
            ...prev,
            securityScore: {
                ...prev.securityScore,
                overall: Math.floor(Math.random() * 5) + 95
            }
        }));
    };

    const startScenario = (scenarioId) => {
        setCurrentScenario(scenarios.find(s => s.id === scenarioId));
        setLearningMode(true);
    };

    const nextTutorialStep = () => {
        if (currentStep < tutorials['getting-started'].length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setTutorialMode(false);
            trackProgress('completedTutorials', 'getting-started');
        }
    };

    const showContextualHelp = (component) => {
        setContextHelp({
            component,
            content: getContextualHelp(component)
        });
    };

    const getCardContent = (card) => {
        switch (card) {
            case 'knowledge-graph':
                return {
                    title: 'Knowledge Graph',
                    content: `The knowledge graph shows how different AI agents and system components are connected. 
                    Each node represents an agent or component, and the lines show their relationships. 
                    This visualization helps understand the system's architecture and how information flows between components.`
                };
            case 'active-agents':
                return {
                    title: 'Active Agents',
                    content: `The system uses multiple specialized AI agents:
                    • Ethics Agent: Ensures AI decisions align with ethical guidelines
                    • Math Agent: Handles mathematical operations and verifications
                    • ARC Agent: Manages AI alignment and safety protocols
                    • FreePress Agent: Monitors content for misinformation`
                };
            case 'agent-activity':
                return {
                    title: 'Agent Activity Timeline',
                    content: `This timeline shows the activity patterns of different agents over time. 
                    It helps us understand:
                    • When agents are most active
                    • How agents coordinate their activities
                    • System load and performance patterns`
                };
            case 'security-status':
                return {
                    title: 'Security Status',
                    content: `The security dashboard monitors various aspects of system safety:
                    • Smart Contract Security: Ensures secure execution of AI operations
                    • Access Control: Manages permissions and authentication
                    • Data Encryption: Protects sensitive information
                    • Network Security: Monitors system communication`
                };
            default:
                return { title: '', content: '' };
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Icon>menu</Icon>
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        SafeAI System Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={() => setHelpDialog(true)}>
                        <Icon>help</Icon>
                    </IconButton>
                    <Button 
                        color="inherit" 
                        onClick={() => setTutorialMode(!tutorialMode)}
                        startIcon={<Icon>school</Icon>}
                    >
                        Tutorial
                    </Button>
                    <Typography variant="caption" color="inherit">
                        Last updated: {lastUpdate.toLocaleTimeString()}
                    </Typography>
                </Toolbar>
            </AppBar>

            <div className="dashboard-container">
                <div className="dashboard-card" onClick={() => handleCardClick('knowledge-graph')}>
                    <Typography variant="h6" gutterBottom>Knowledge Graph</Typography>
                    <div className="graph-container" id="knowledge-graph">
                        {/* Knowledge graph visualization will be rendered here */}
                    </div>
                </div>

                <div className="dashboard-card" onClick={() => handleCardClick('active-agents')}>
                    <Typography variant="h6" gutterBottom>System Metrics</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Paper className="metric-card">
                                <Typography variant="subtitle2">Active Agents</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography className="metric-value">
                                            {Object.values(metrics.activeAgents).reduce((a, b) => a + b, 0)}
                                        </Typography>
                                        <Typography className="metric-label">Total Active Agents</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box>
                                            <Typography variant="body2">Ethics: {metrics.activeAgents.ethics}</Typography>
                                            <Typography variant="body2">Math: {metrics.activeAgents.math}</Typography>
                                            <Typography variant="body2">ARC: {metrics.activeAgents.arc}</Typography>
                                            <Typography variant="body2">FreePress: {metrics.activeAgents.freepress}</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        {/* ... other metric cards ... */}
                    </Grid>
                </div>

                <div className="dashboard-card" onClick={() => handleCardClick('agent-activity')}>
                    <Typography variant="h6" gutterBottom>Agent Activity</Typography>
                    <div className="graph-container" id="agent-activity">
                        {/* Agent activity timeline will be rendered here */}
                    </div>
                </div>

                <div className="dashboard-card" onClick={() => handleCardClick('security-status')}>
                    <Typography variant="h6" gutterBottom>Security Status</Typography>
                    <div className="graph-container" id="security-status">
                        {/* Security metrics visualization will be rendered here */}
                    </div>
                </div>
            </div>

            <Fab 
                color="primary" 
                className="refresh-button"
                onClick={fetchData}
                disabled={loading}
            >
                <Icon>refresh</Icon>
            </Fab>

            <Dialog 
                open={helpDialog} 
                onClose={() => setHelpDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {selectedCard ? getCardContent(selectedCard).title : 'SafeAI System Overview'}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {selectedCard ? getCardContent(selectedCard).content : 
                        `Welcome to the SafeAI Interactive Demo! This dashboard shows you how the SafeAI system works in real-time.
                        You can click on any card to learn more about that specific component. The system uses multiple AI agents
                        working together to ensure safe and ethical AI operations.`}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setHelpDialog(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Learning Mode Dialog */}
            <Dialog 
                open={learningMode} 
                onClose={() => setLearningMode(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {currentScenario?.title}
                </DialogTitle>
                <DialogContent>
                    <Typography paragraph>
                        {currentScenario?.description}
                    </Typography>
                    <Stepper activeStep={currentStep} orientation="vertical">
                        {currentScenario?.steps.map((step, index) => (
                            <Step key={index}>
                                <StepLabel>{step}</StepLabel>
                                <StepContent>
                                    <Typography>{step}</Typography>
                                    <Box mt={2}>
                                        <Button
                                            variant="contained"
                                            onClick={() => setCurrentStep(index + 1)}
                                        >
                                            {index === currentScenario.steps.length - 1 ? 'Finish' : 'Next'}
                                        </Button>
                                    </Box>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                </DialogContent>
            </Dialog>

            {/* Tutorial Mode */}
            {tutorialMode && (
                <Box className="tutorial-overlay">
                    <Paper className="tutorial-content">
                        <Typography variant="h6">
                            {tutorials['getting-started'][currentStep].title}
                        </Typography>
                        <Typography paragraph>
                            {tutorials['getting-started'][currentStep].content}
                        </Typography>
                        <Box mt={2}>
                            <Button
                                variant="contained"
                                onClick={nextTutorialStep}
                            >
                                {currentStep === tutorials['getting-started'].length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            )}

            {/* Interactive Controls */}
            <Box className="interactive-controls">
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => setInteractiveMode(!interactiveMode)}
                >
                    {interactiveMode ? 'Exit Interactive Mode' : 'Enter Interactive Mode'}
                </Button>
                {interactiveMode && (
                    <Box className="control-panel">
                        <Typography variant="h6">System Controls</Typography>
                        <Button 
                            variant="outlined"
                            onClick={simulateAgentActivity}
                        >
                            Simulate Agent Activity
                        </Button>
                        <Button 
                            variant="outlined"
                            onClick={simulateSecurityEvent}
                        >
                            Simulate Security Event
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Progress Indicator */}
            <Box className="progress-indicator">
                <Typography variant="body2">
                    Understanding Level: {userProgress.understandingLevel}
                </Typography>
                <Typography variant="body2">
                    Tutorials Completed: {userProgress.completedTutorials.length}
                </Typography>
            </Box>
        </Box>
    );
}

// Knowledge Graph Visualization
function initKnowledgeGraph() {
    const width = document.getElementById('knowledge-graph').clientWidth;
    const height = 400;
    const svg = d3.select('#knowledge-graph')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Realistic data based on SafeAI components
    const data = {
        nodes: [
            { id: 1, label: 'Ethics Agent', type: 'agent' },
            { id: 2, label: 'Math Agent', type: 'agent' },
            { id: 3, label: 'ARC Agent', type: 'agent' },
            { id: 4, label: 'FreePress Agent', type: 'agent' },
            { id: 5, label: 'Knowledge Base', type: 'system' },
            { id: 6, label: 'Security Layer', type: 'system' },
            { id: 7, label: 'Smart Contracts', type: 'system' },
            { id: 8, label: 'API Gateway', type: 'system' }
        ],
        links: [
            { source: 1, target: 5, type: 'accesses' },
            { source: 2, target: 5, type: 'accesses' },
            { source: 3, target: 5, type: 'accesses' },
            { source: 4, target: 5, type: 'accesses' },
            { source: 5, target: 6, type: 'protected_by' },
            { source: 6, target: 7, type: 'enforces' },
            { source: 7, target: 8, type: 'exposes' }
        ]
    };

    // Create force simulation with adjusted parameters
    const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-150))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(50));

    // Create links with different styles based on type
    const link = svg.append('g')
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .attr('stroke', d => {
            switch(d.type) {
                case 'accesses': return '#4caf50';
                case 'protected_by': return '#f44336';
                case 'enforces': return '#ff9800';
                case 'exposes': return '#2196f3';
                default: return '#666';
            }
        })
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', d => d.type === 'protected_by' ? '5,5' : null);

    // Create nodes with different styles based on type
    const node = svg.append('g')
        .selectAll('circle')
        .data(data.nodes)
        .enter()
        .append('circle')
        .attr('r', d => d.type === 'agent' ? 25 : 20)
        .attr('fill', d => d.type === 'agent' ? '#2196f3' : '#4caf50')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    // Add labels with different styles
    const label = svg.append('g')
        .selectAll('text')
        .data(data.nodes)
        .enter()
        .append('text')
        .text(d => d.label)
        .attr('fill', '#fff')
        .attr('text-anchor', 'middle')
        .attr('dy', 4)
        .attr('font-size', d => d.type === 'agent' ? '12px' : '10px')
        .attr('font-weight', d => d.type === 'agent' ? 'bold' : 'normal');

    // Add tooltips
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    node.on('mouseover', function(event, d) {
        tooltip.transition()
            .duration(200)
            .style('opacity', .9);
        tooltip.html(`${d.label}<br/>Type: ${d.type}`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', function() {
        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    });

    // Update positions on each tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        label
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    });

    // Drag functions
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
}

// Agent Activity Timeline
function initAgentActivity() {
    const width = document.getElementById('agent-activity').clientWidth;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const svg = d3.select('#agent-activity')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Realistic agent activity data
    const agents = ['Ethics Agent', 'Math Agent', 'ARC Agent', 'FreePress Agent'];
    const data = agents.map(agent => ({
        name: agent,
        values: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            activity: Math.random() * 30 + 20 // Base activity between 20-50%
        }))
    }));

    const x = d3.scaleLinear()
        .domain([0, 23])
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.bottom, margin.top]);

    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(24))
        .attr('color', '#fff');

    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .attr('color', '#fff');

    // Add lines for each agent
    const colors = ['#2196f3', '#4caf50', '#ff9800', '#f44336'];
    const line = d3.line()
        .x(d => x(d.hour))
        .y(d => y(d.activity))
        .curve(d3.curveMonotoneX);

    data.forEach((agent, i) => {
        svg.append('path')
            .datum(agent.values)
            .attr('fill', 'none')
            .attr('stroke', colors[i])
            .attr('stroke-width', 2)
            .attr('d', line);

        // Add agent name to legend
        svg.append('text')
            .attr('x', width - margin.right + 10)
            .attr('y', margin.top + i * 20)
            .attr('fill', colors[i])
            .text(agent.name);
    });
}

// Security Status Visualization
function initSecurityStatus() {
    const width = document.getElementById('security-status').clientWidth;
    const height = 400;
    const svg = d3.select('#security-status')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Realistic security metrics based on SafeAI components
    const data = [
        { category: 'Smart Contract Security', value: 98 },
        { category: 'Agent Access Control', value: 95 },
        { category: 'Data Encryption', value: 97 },
        { category: 'Network Security', value: 96 },
        { category: 'Audit Compliance', value: 99 },
        { category: 'Ethics Enforcement', value: 94 }
    ];

    const radius = Math.min(width, height) / 2 * 0.8;
    const centerX = width / 2;
    const centerY = height / 2;

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.category))
        .range(['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0', '#00bcd4']);

    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius);

    const labelArc = d3.arc()
        .innerRadius(radius * 0.8)
        .outerRadius(radius * 0.8);

    // Create pie chart
    const g = svg.append('g')
        .attr('transform', `translate(${centerX},${centerY})`);

    const path = g.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.category))
        .attr('stroke', '#fff')
        .style('stroke-width', '2px')
        .style('opacity', 0.7);

    // Add labels with tooltips
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    path.on('mouseover', function(event, d) {
        tooltip.transition()
            .duration(200)
            .style('opacity', .9);
        tooltip.html(`${d.data.category}<br/>Score: ${d.data.value}%`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', function() {
        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    });

    // Add labels
    const label = g.selectAll('text')
        .data(pie(data))
        .enter()
        .append('text')
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .style('fill', '#fff')
        .text(d => `${d.data.category}: ${d.data.value}%`);
}

// Initialize all visualizations when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initKnowledgeGraph();
    initAgentActivity();
    initSecurityStatus();
}); 