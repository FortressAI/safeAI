# SafeAI Neo4j Knowledge Graph Plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

The SafeAI Neo4j Knowledge Graph Plugin provides seamless integration for creating, loading, and managing knowledge graphs (KGs) within Neo4j. It enables users to define domain-specific knowledge graphs with embedded agent logic directly from JSON files.

## Key Features

- **Security & Integrity:** Digital signatures with hashes stored on blockchain for tamper-proof records
- **Dynamic Licensing:** Real-time token cost calculations and automated revenue sharing
- **Decentralized Governance:** Expert-driven updates and transparent decision-making
- **Adaptive Learning:** Dynamic agents continuously refining KGs based on training data
- **Conversational Interface:** Natural language queries translated directly into Cypher queries
- **Blockchain Integration:** Immutable transaction logging and verification of agent activities

## Architecture

### Modules

- **Crypto Module:** Digital signing and quantum-resistant cryptographic methods
- **Blockchain Module:** Immutable transaction logging and smart contract management
- **Licensing Module:** Token pricing, revenue calculation, and usage reporting
- **Governance Module:** Decentralized voting and policy updates
- **Learning Module:** ARC KG management, puzzle solving, and natural language interactions

## Quick Start Guide

### Requirements

- Java 17+
- Maven 3.6+
- Neo4j 5.x
- Docker (recommended for easy deployment)
- OpenAI API key (for LLM functions)

### Installation Options

#### Option 1: Automated Docker Deployment (Recommended)

The simplest way to get started is using our automated deployment script, which handles building and deploying the plugin in a Docker container:

```bash
# Clone the repository
git clone https://github.com/FortressAI/safeAI.git
cd safeAI/safeAI-plugin

# Set environment variables for configuration (optional)
export OPENAI_API_KEY=your-openai-api-key
export ADMIN_API_KEY=your-admin-api-key
export BLOCKCHAIN_ENDPOINT=http://host.docker.internal:7545

# Run the deployment script
chmod +x deploy_neo4j.sh
./deploy_neo4j.sh
```

This will:
1. Build the plugin from source
2. Launch a Neo4j 5.15.0 Docker container with the plugin installed
3. Configure and initialize the database
4. Load knowledge graphs
5. Run validation tests

You can access Neo4j Browser at http://localhost:7474 with username `neo4j` and password `password`.

#### Option 2: Manual Installation

```bash
# Clone the repository
git clone https://github.com/FortressAI/safeAI.git
cd safeAI/safeAI-plugin

# Build with Maven
mvn clean package

# Copy the plugin to your Neo4j plugins folder
cp target/safeai-plugin-1.0.0.jar /path/to/neo4j/plugins/
```

Update your Neo4j config (`neo4j.conf`):

```
dbms.security.procedures.unrestricted=com.safeai.neo4jplugin.*
dbms.security.procedures.allowlist=com.safeai.neo4jplugin.*
```

Restart Neo4j to apply changes.

### Configuration

The plugin uses a configuration file located at `config/plugin-config.properties`. Key settings include:

```properties
# API Keys
openai.api.key=${OPENAI_API_KEY}
admin.api.key=${ADMIN_API_KEY}

# Blockchain Settings
blockchain.endpoint=${BLOCKCHAIN_ENDPOINT:http://host.docker.internal:7545}
admin.wallet.key=${ADMIN_WALLET_KEY}

# LLM Configuration
llm.model=${LLM_MODEL:gpt-4}
llm.temperature=${LLM_TEMPERATURE:0.7}
llm.max_tokens=${LLM_MAX_TOKENS:2000}
```

Environment variables (recommended) or direct edits can be used to configure these settings.

## Usage

### Knowledge Graph Management

```cypher
// List available KG files
CALL safeai.debug.listKGFiles() YIELD value RETURN value;

// Load all KG files
CALL safeai.debug.loadKGFiles() YIELD value RETURN value;

// View loaded KGs
MATCH (kg:KnowledgeGraph) RETURN kg.name, kg.description;
```

### Agent Creation

```cypher
// Create an agent from natural language description
CALL safeai.agents.createFromDescription(
  "Create an agent that analyzes code for security vulnerabilities and suggests fixes", 
  "llm"
) YIELD value, agent RETURN value, agent;

// Validate an existing agent
CALL safeai.agents.validateAgent("SecurityAnalyzer") YIELD value, agent RETURN value, agent;
```

### Conversational Queries

```cypher
// Execute a natural language query
CALL safeai.nlq.executeQuery("Find all security agents and their capabilities") 
YIELD query, results RETURN query, results;
```

### Security and Compliance

```cypher
// Run a security validation
CALL safeai.debug.validateSecurity() YIELD value RETURN value;

// Check production readiness
CALL safeai.debug.checkProductionReadiness() YIELD value RETURN value;
```

## Knowledge Graph JSON Structure

Knowledge graphs are defined in JSON files with the following structure:

```json
{
  "domain": "CyberSecurity",
  "description": "Knowledge graph for cybersecurity concepts and agents",
  "agents": [
    {
      "name": "VulnerabilityScanner",
      "category": "Security",
      "description": "Scans code for common security vulnerabilities",
      "capabilities": ["code_analysis", "threat_detection"],
      "agent_type": "llm",
      "llm_prompt": "Analyze the following code for security vulnerabilities: {{code}}"
    }
  ],
  "capabilities": [
    {
      "name": "code_analysis",
      "description": "Ability to analyze code patterns"
    },
    {
      "name": "threat_detection",
      "description": "Ability to identify security threats"
    }
  ],
  "relationships": [
    {
      "from": "VulnerabilityScanner",
      "to": "code_analysis",
      "type": "HAS_CAPABILITY",
      "description": "Scanner can analyze code"
    }
  ]
}
```

## GUI Integration

The SafeAI plugin can be managed through our dedicated GUI application that provides an intuitive interface for:
- Agent creation and management
- Knowledge graph visualization
- Security validation
- Blockchain transaction verification

See the [safeAI-gui](../safeAI-gui) folder for details.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For questions and support, please:
- Open an issue on GitHub
- Contact support@fortressai.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

