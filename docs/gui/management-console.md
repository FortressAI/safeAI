# SafeAI Management Console: A Beginner's Guide

## What is the SafeAI Management Console?

The SafeAI Management Console is a user-friendly web application that lets you interact with the SafeAI platform. Think of it as a control center where you can:

- Create and manage AI agents
- Check if your AI systems are behaving ethically
- Store and organize knowledge in specialized databases (Knowledge Graphs)
- Keep track of security issues
- Publish content in a decentralized way

This guide will help you understand how to use the Management Console, even if you're new to SafeAI or blockchain technology.

![SafeAI Management Console Dashboard](../images/dashboard-overview.png)
*The SafeAI Management Console dashboard showing system health, active agents, and recent activity*

## Getting Started

### How to Access the Console

1. Open your web browser and navigate to your SafeAI installation URL
2. Connect your digital wallet (like MetaMask) by clicking "Connect Wallet" in the upper right corner
3. Once connected, you'll see your address and account balance in the navigation bar

![Connecting your wallet](../images/wallet-connection.png)
*The wallet connection process showing the MetaMask popup*

### Understanding the Interface

The console has a navigation sidebar with these main sections:

- **Dashboard**: Overview of your system
- **Knowledge Graphs**: Manage different types of knowledge databases
- **Agent Workshop**: Create and manage AI agents
- **Security Center**: Monitor and address security concerns
- **Settings**: Configure your account and system preferences

## Working with Knowledge Graphs

Knowledge Graphs are specialized databases that store information in a way that shows relationships between different pieces of data. The SafeAI platform uses several types of Knowledge Graphs:

### Ethics Knowledge Graph

**What it does**: Helps ensure your AI agents behave ethically by storing ethical principles and evaluation criteria.

**Common tasks**:

1. **Auditing an Agent for Ethical Compliance**:
   - Navigate to Knowledge Graphs → Ethics KG
   - Click "Audit Agent"
   - Select the agent from the dropdown menu
   - Click "Start Audit"
   - Review the results, including overall score and recommendations

![Ethics Audit Process](../images/ethics-audit.png)
*The ethics audit interface showing audit results for an agent*

2. **Viewing Ethical Principles**:
   - Navigate to Knowledge Graphs → Ethics KG → Principles
   - Browse the list of ethical frameworks and principles
   - Click on any principle to see detailed information

### CyberSecurity Knowledge Graph

**What it does**: Keeps track of security vulnerabilities, incidents, and best practices to help protect your AI systems.

**Common tasks**:

1. **Adding a New Security Vulnerability**:
   - Navigate to Knowledge Graphs → CyberSecurity KG → Vulnerabilities
   - Click "Add Vulnerability"
   - Fill in the details (name, description, severity, etc.)
   - Click "Save"

2. **Viewing Security Incidents**:
   - Navigate to Knowledge Graphs → CyberSecurity KG → Incidents
   - Browse the list of recorded incidents
   - Filter by date, severity, or status
   - Click on any incident to see detailed information

### Math Knowledge Graph

**What it does**: Organizes mathematical concepts, problems, and proofs to help AI agents with mathematical reasoning.

**Common tasks**:

1. **Adding a Mathematical Concept**:
   - Navigate to Knowledge Graphs → Math KG → Concepts
   - Click "Add Concept"
   - Fill in the details (name, description, category, etc.)
   - Add relationships to other concepts if needed
   - Click "Save"

2. **Browsing Math Problems**:
   - Navigate to Knowledge Graphs → Math KG → Problems
   - Browse the list of problems
   - Filter by difficulty, category, or status
   - Click on any problem to see detailed information

## Creating and Managing AI Agents

The Agent Workshop lets you create, configure, and monitor AI agents.

### Creating a New Agent

1. Navigate to Agent Workshop → Create Agent
2. Provide basic information:
   - Name: A unique name for your agent
   - Description: What the agent does
   - Purpose: The agent's main goal
3. Select capabilities (what the agent can do):
   - Natural Language Processing
   - Mathematical Reasoning
   - Ethical Decision Making
   - etc.
4. Configure Knowledge Graph access:
   - Select which Knowledge Graphs the agent can access
   - Set permission levels (read, write, admin)
5. Click "Create Agent"

![Agent Creation Process](../images/create-agent.png)
*The agent creation interface showing capability selection*

### Monitoring Agent Performance

1. Navigate to Agent Workshop → My Agents
2. Select an agent from the list
3. Review the performance dashboard:
   - Usage statistics
   - Success rate
   - Response time
   - Ethical compliance score

### Improving an Agent

1. Navigate to Agent Workshop → My Agents
2. Select an agent from the list
3. Click "Train Agent"
4. Upload training data or use the interactive training interface
5. Monitor progress and results

## Understanding Blockchain Integration

The SafeAI platform uses blockchain technology to ensure transparency, security, and decentralization. Here's what you need to know:

### What is a Wallet?

A digital wallet (like MetaMask) stores your digital identity and allows you to interact with blockchain applications. In the SafeAI platform, your wallet:

- Authenticates you (proves who you are)
- Signs transactions (confirms your actions)
- Stores tokens that may be needed for certain operations

### Connecting Your Wallet

1. Click "Connect Wallet" in the upper right corner
2. Select your wallet provider (MetaMask, etc.)
3. Approve the connection request in your wallet
4. Your address will appear in the navigation bar

### Understanding Transactions

When you perform certain actions in the SafeAI platform (like creating an agent or adding knowledge), you'll need to approve a transaction:

1. The platform will show a transaction preview
2. Click "Submit" to proceed
3. Your wallet will ask you to confirm the transaction
4. Once confirmed, the transaction will be processed
5. Wait for the confirmation (this may take a few seconds)

![Transaction Process](../images/transaction-confirmation.png)
*The transaction confirmation process showing the MetaMask approval dialog*

## Decentralized Storage with IPFS

The SafeAI platform uses IPFS (InterPlanetary File System) to store content in a decentralized way.

### What is IPFS?

IPFS is a system for storing and sharing files across a distributed network, rather than on a single server. This makes the content:

- Resilient (available even if some computers go offline)
- Censorship-resistant (difficult to block or remove)
- Verifiable (you can confirm the content hasn't been tampered with)

### Uploading Content to IPFS

1. Navigate to the appropriate section (depends on what you're uploading)
2. Click "Upload" or "Add File"
3. Select the file from your computer
4. Wait for the upload to complete
5. The system will display an IPFS hash (a unique identifier for your content)

### Viewing IPFS Content

1. Navigate to the section containing your content
2. Click on the content to view it
3. If you want to view it directly on IPFS, click the IPFS icon next to the content

## Common Tasks Guide

### Task 1: Auditing an Agent for Ethical Compliance

1. Navigate to Knowledge Graphs → Ethics KG
2. Click "Audit Agent"
3. Select the agent from the dropdown menu
4. Click "Start Audit"
5. Review the results:
   - Overall ethical score
   - Category-by-category breakdown
   - Critical issues (if any)
   - Recommendations for improvement
6. Click "Generate Report" to create a downloadable report
7. Apply recommended labels by clicking "Apply Labels"

### Task 2: Adding a Security Vulnerability

1. Navigate to Knowledge Graphs → CyberSecurity KG → Vulnerabilities
2. Click "Add Vulnerability"
3. Fill in the details:
   - Name: A descriptive name for the vulnerability
   - Description: Detailed explanation
   - Severity: How serious the vulnerability is (Low, Medium, High, Critical)
   - Affected Components: Which parts of your system are affected
   - Status: Current status (Open, In Progress, Resolved)
   - Mitigation: Steps to address the vulnerability
4. Click "Save"

### Task 3: Creating and Configuring an Agent

1. Navigate to Agent Workshop → Create Agent
2. Provide basic information:
   - Name: A unique name for your agent
   - Description: What the agent does
   - Purpose: The agent's main goal
3. Select capabilities
4. Configure Knowledge Graph access
5. Set resource limits (memory, CPU, etc.)
6. Click "Create Agent"
7. Once created, navigate to the agent's detail page
8. Click "Configure" to adjust settings
9. Test the agent by clicking "Test Agent" and entering a prompt

## Troubleshooting

### Common Issues and Solutions

#### Wallet Connection Issues

**Problem**: Can't connect your wallet or wallet keeps disconnecting.

**Solution**:
1. Make sure your wallet extension is installed and updated
2. Try refreshing the page
3. Ensure you're on the correct network in your wallet settings
4. Clear browser cache and try again

#### Transaction Failures

**Problem**: Transactions fail or get stuck.

**Solution**:
1. Check that you have enough funds for gas fees
2. Ensure you're on the correct network
3. Try increasing the gas limit/price
4. If a transaction is stuck, you may need to "speed up" or "cancel" it from your wallet

#### Content Not Loading

**Problem**: IPFS content doesn't load or takes too long.

**Solution**:
1. Check your internet connection
2. Try a different IPFS gateway by clicking the gateway selector
3. Refresh the page
4. If the content was recently added, it may still be propagating through the network

## Glossary of Terms

- **Agent**: An AI system designed to perform specific tasks
- **Blockchain**: A distributed ledger technology that records transactions across multiple computers
- **Ethical Audit**: The process of evaluating an AI agent against ethical principles
- **Gas Fees**: Small amounts of cryptocurrency required to perform transactions on a blockchain
- **IPFS**: InterPlanetary File System, a protocol for storing and sharing data in a distributed file system
- **Knowledge Graph**: A specialized database that shows relationships between data points
- **MetaMask**: A popular cryptocurrency wallet that works as a browser extension
- **Smart Contract**: Self-executing code that runs on a blockchain
- **Token**: A digital asset on a blockchain that can represent value or access rights
- **Wallet**: Software that stores private keys and allows interactions with blockchain applications

## Getting Help

If you need additional assistance:

- Click the "Help" icon in the lower left corner of the console
- Visit the [SafeAI Community Forums](https://github.com/FortressAI/safeAI/discussions)
- Check the [Video Tutorials](https://www.youtube.com/c/SafeAI) for step-by-step guidance
- Contact support at support@safeai.org

## Next Steps

Now that you're familiar with the basics of the SafeAI Management Console, you might want to:

1. Explore the [Advanced User Guide](./advanced-guide.md) for more complex operations
2. Learn about [Cypher queries](../cypher/queries.md) for advanced knowledge graph interactions
3. Understand [node creation](../cypher/nodes.md) and [relationships](../cypher/relationships.md) in the knowledge graph
4. Explore the [API Documentation](../api/overview.md) for programmatic access 