# Welcome to SafeAI: Your Guide to Ethical AI

## What is SafeAI?

SafeAI is a comprehensive platform that helps you create, manage, and monitor AI systems with a focus on ethics, security, and knowledge organization. It consists of two main parts:

1. **Neo4j Plugin**: A powerful extension for the Neo4j graph database that handles the backend processing
2. **Management Console**: A user-friendly web interface for interacting with the system

Think of SafeAI as an "operating system" for AI that makes sure your intelligent agents behave properly and work together effectively.

![SafeAI Overview](images/safeai-overview.png)
*SafeAI combines knowledge graphs, ethical frameworks, and security monitoring in one platform*

## Why Use SafeAI?

- **Ensure Ethical AI**: Built-in tools to audit AI agents against ethical frameworks
- **Organize Knowledge**: Structure information in specialized knowledge graphs
- **Enhance Security**: Monitor and manage security vulnerabilities
- **Simplify Management**: Create and monitor AI agents through an intuitive interface
- **Blockchain Integration**: Leverage decentralized technologies for transparency and trust

## Getting Started (For Beginners)

### What You'll Need

- A computer with at least 8GB RAM
- Basic familiarity with running commands in a terminal
- Neo4j database (version 5.x or newer)
- Node.js (version 18.x or newer) for the web interface

### Step 1: Install Neo4j

1. Download Neo4j Desktop from [neo4j.com/download](https://neo4j.com/download/)
2. Install and open Neo4j Desktop
3. Create a new database by clicking "Add Database"
4. Choose a name and password (remember this password!)
5. Start the database

### Step 2: Install the SafeAI Plugin

1. Open a terminal or command prompt
2. Clone the SafeAI repository:
   ```bash
   git clone https://github.com/FortressAI/safeAI.git
   cd safeAI
   ```

3. Build and install the plugin:
   ```bash
   cd safeAI-plugin
   ./install_plugin.sh
   ```
   
   This will automatically build the plugin and install it in your Neo4j database.

### Step 3: Set Up the Management Console

1. Navigate to the GUI directory:
   ```bash
   cd ../safeAI-gui
   ```

2. Install the required packages:
   ```bash
   npm install
   ```

3. Set up your configuration:
   ```bash
   cp .env.example .env
   ```
   
   Open the `.env` file in a text editor and update:
   - `NEO4J_URI`: The address of your Neo4j database (usually `bolt://localhost:7687`)
   - `NEO4J_USER`: Your Neo4j username (usually `neo4j`)
   - `NEO4J_PASSWORD`: The password you set when creating the database

4. Start the web interface:
   ```bash
   npm start
   ```

5. Open your web browser and go to http://localhost:3000

### Step 4: Explore the Platform

Now that you're up and running, take time to explore:

1. **Dashboard**: View the overall status of your system
2. **Knowledge Graphs**: Explore the Ethics, CyberSecurity, and Math knowledge graphs
3. **Agent Workshop**: Create your first AI agent
4. **Security Center**: Monitor security vulnerabilities

## Detailed Documentation

After getting familiar with the basics, you might want to explore specific areas in more depth:

### Management Console Guide
- [Complete User Guide](gui/management-console.md) - Learn how to use all features of the web interface

### Knowledge Graph Guides
- [Cypher Query Guide](cypher/queries.md) - Learn how to query the knowledge graphs
- [Node Creation Guide](cypher/nodes.md) - Understand how to create nodes in the graphs
- [Relationships Guide](cypher/relationships.md) - Learn about connecting nodes with relationships

### Technical Documentation
- [Plugin Architecture](technical/plugin-architecture.md) - Understand how the Neo4j plugin works
- [API References](technical/api-reference.md) - Complete API documentation
- [Blockchain Integration](integration/blockchain-integration.md) - Details on the blockchain components

### Governance and Community
- [Contributing Guidelines](governance/contributing.md) - How to contribute to the project
- [Code of Conduct](governance/code-of-conduct.md) - Community guidelines
- [Testing Guide](governance/testing-guide.md) - How to test the system

## Common Tasks

### Creating Your First Agent

1. Open the Management Console in your browser
2. Navigate to "Agent Workshop" → "Create Agent"
3. Fill in the basic information:
   - Name: "MyFirstAgent"
   - Description: "A test agent to explore SafeAI capabilities"
   - Purpose: "Learning and experimentation"
4. Select basic capabilities like "Natural Language Processing"
5. Click "Create Agent"
6. Test your agent by clicking "Test Agent" and typing a simple request

### Performing an Ethical Audit

1. Navigate to "Knowledge Graphs" → "Ethics KG"
2. Click "Audit Agent"
3. Select your agent from the dropdown
4. Click "Start Audit"
5. Review the results and recommendations

## Getting Help

If you encounter any issues or have questions:

- Check the [Troubleshooting Guide](technical/troubleshooting.md)
- Visit our [GitHub Discussions](https://github.com/FortressAI/safeAI/discussions)
- Join our [Discord Community](https://discord.gg/safeai)
- Email support at help@safeai.org

## Project Structure

For developers interested in the codebase organization:

```
safeAI/
├── safeAI-plugin/          # Neo4j plugin code
├── safeAI-gui/             # Web interface code
├── docs/                   # Documentation
│   ├── cypher/             # Cypher query guides
│   ├── gui/                # Management Console guides
│   ├── governance/         # Contribution guidelines
│   └── technical/          # Technical documentation
└── README.md               # This file
```

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Acknowledgments

- The Neo4j Community for their excellent graph database
- All contributors who have helped build SafeAI
- Our users who provide valuable feedback and insights 