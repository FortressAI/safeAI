# SafeAI Neo4j Plugin Documentation

## Overview
The SafeAI Neo4j Plugin is a powerful extension that enables intelligent agent-based interactions within Neo4j databases. It provides a comprehensive framework for managing knowledge graphs, dynamic agents, and governance systems. The ecosystem includes both a Neo4j plugin for backend processing and a modern web-based Management Console for user interaction.

## Table of Contents

### Core Components
- [Knowledge Graph Management](governance/knowledge-graph-management.md)
  - Loading and managing knowledge graphs
  - Agent definitions and capabilities
  - Relationship management
- [Dynamic Agent System](governance/dynamic-agent-system.md)
  - Agent creation and management
  - Capability integration
  - Agent interactions

### Governance Framework
- [Code Review Guide](governance/code-review.md)
- [Development Setup](governance/development-setup.md)
- [Code of Conduct](governance/code-of-conduct.md)
- [Contributing Guidelines](governance/contributing.md)
- [Testing Guide](governance/testing-guide.md)
- [Documentation Style](governance/documentation-style.md)
- [Community Guidelines](governance/community-guidelines.md)
- [Governance Framework](governance/governance-framework-guide.md)

### Integration Guides
- [Groovy Integration](integration/groovy-integration.md)
- [LLM Integration](integration/llm-integration.md)
- [Blockchain Integration](integration/blockchain-integration.md)

### Management Console
- [Web Interface Overview](../safeAI-gui/README.md)
- [Knowledge Graph Modules](../safeAI-gui/README.md#user-guides)
- [Deployment Guide](../safeAI-gui/README.md#production-deployment-on-aws)
- [Blockchain Integration](../safeAI-gui/README.md#connecting-to-safeaicoincom-blockchain)

## Quick Start

### Prerequisites
- Neo4j 5.x or later
- Java 11 or later
- Maven 3.6 or later
- Node.js 18.x or later (for Management Console)

### Plugin Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/FortressAI/safeAI.git
   cd safeAI/safeAI-plugin
   ```

2. Build the plugin:
   ```bash
   mvn clean package
   ```

3. Deploy using the provided script:
   ```bash
   ./deploy_neo4j.sh
   ```

### Management Console Setup
1. Navigate to the GUI directory:
   ```bash
   cd ../safeAI-gui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Access the console at http://localhost:3000

### Basic Usage
1. Access Neo4j Browser at http://localhost:7474
2. Login with default credentials:
   - Username: neo4j
   - Password: testpassword

3. Load knowledge graphs:
   ```cypher
   CALL safeai.debug.loadKGFiles()
   ```

4. Test basic functionality:
   ```cypher
   CALL safeai.debug.hello('World')
   ```

5. Use the Management Console to interact with the system through a user-friendly interface.

## Development

### Project Structure
```
safeAI/
├── safeAI-plugin/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/safeai/neo4jplugin/
│   │   │   │       ├── debug/
│   │   │   │       ├── graph_rag/
│   │   │   │       ├── governance/
│   │   │   │       └── integration/
│   │   │   └── resources/
│   │   │       └── *.json
│   │   └── test/
│   └── pom.xml
├── safeAI-gui/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── contracts/
│   │   └── utils/
│   ├── public/
│   ├── scripts/
│   └── package.json
├── docs/
└── README.md
```

### Key Components
- **Plugin**:
  - `DebugProcedure.java`: Core debugging and initialization procedures
  - `GraphRAG.java`: Knowledge graph management and RAG implementation
  - `DynamicAgentCreator.java`: Dynamic agent creation and management
  - Knowledge Graph JSON files: Pre-defined agent and capability definitions

- **Management Console**:
  - Blockchain integration with Hardhat and Solidity contracts
  - Service classes for interfacing with knowledge graph contracts
  - React components for interactive UI
  - IPFS integration for decentralized storage

### Testing
Run the plugin test suite:
```bash
cd safeAI-plugin
mvn test
```

Run the GUI tests:
```bash
cd safeAI-gui
npm test
```

## Contributing
Please read our [Contributing Guidelines](governance/contributing.md) before submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Support
For support and questions:
1. Check the [documentation](governance/)
2. Open an issue on GitHub
3. Join our community discussions

## Acknowledgments
- Neo4j Community
- SafeAI Team
- All contributors to this project 