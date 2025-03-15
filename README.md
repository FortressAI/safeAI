# SafeAI: Secure, Transparent, and Ethical AI Plugin for Neo4j

Welcome to SafeAI, a pioneering Neo4j plugin that transforms graph databases into secure, transparent, and ethical AI reasoning engines. SafeAI combines advanced AI capabilities with robust security measures, comprehensive compliance frameworks, and blockchain-based governance.

## Table of Contents

1. [Features](#features)
2. [Security Framework](#security-framework)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Built-in Knowledge Graphs](#built-in-knowledge-graphs)
6. [Security and Compliance](#security-and-compliance)
7. [Usage Examples](#usage-examples)
8. [Development](#development)
9. [Production Deployment](#production-deployment)
10. [Troubleshooting](#troubleshooting)

## Features

- **Agentic Knowledge Graphs (KGs)**: Built-in domain-specific KGs for various applications
- **Security-First Architecture**: Comprehensive security framework with continuous monitoring
- **Blockchain Integration**: Smart contract-based licensing and governance
- **Compliance Framework**: Built-in compliance checks and audit trails
- **Dynamic Agent Creation**: Support for both Groovy and LLM-based agents
- **Transparent Reasoning**: Complete chain-of-thought logging and verification
- **Production Ready**: Includes all necessary security and compliance features

## Security Framework

SafeAI implements a comprehensive security framework:

- **Access Control**: Role-based access control with blockchain verification
- **Data Protection**: End-to-end encryption for sensitive data
- **Audit Trails**: Complete logging of all operations and reasoning steps
- **Compliance Checks**: Automated compliance verification
- **Incident Response**: Built-in security incident handling
- **Privacy Protection**: GDPR-compliant data handling

## Installation

### Prerequisites

- Neo4j 5.x or later
- Java 17 or later
- Docker and Docker Compose
- Node.js 18.x or later (for blockchain integration)

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/FortressAI/safeAI.git
   cd safeAI
   ```

2. Copy the sample configuration:
   ```bash
   cp config/plugin-config.properties.sample plugin-config.properties
   ```
   Then edit `plugin-config.properties` with your settings (see [Configuration](#configuration) section below).

3. Deploy using Docker Compose:
   ```bash
   cd safeAI-plugin
   ./deploy_neo4j.sh
   ```

## Configuration

The plugin is configured through `plugin-config.properties` in the Neo4j configuration directory:

```properties
# API Key Configuration
openai.api.key=your-openai-api-key
admin.api.key=your-safeai-api-key

# Blockchain Settings
blockchain.endpoint=http://host.docker.internal:7545
admin.wallet.key=your-admin-wallet-key

# LLM Configuration
llm.model=o3-mini
llm.temperature=0.7
llm.max_tokens=2000

# Security Settings
security.input.validation=true
security.resource.monitoring=true
security.output.validation=true

# Plugin Settings
plugin.name=safeai
plugin.version=1.0.0
plugin.author=FortressAI

# Neo4j Integration
neo4j.procedure.allowlist=safeai.*
neo4j.procedure.unrestricted=safeai.security.*,safeai.agents.*
```

### Configuration Properties

| Property | Description | Default |
|----------|-------------|---------|
| `openai.api.key` | OpenAI API key for LLM functionality | Required |
| `admin.api.key` | SafeAI admin API key | Required |
| `blockchain.endpoint` | Blockchain network endpoint | http://host.docker.internal:7545 |
| `admin.wallet.key` | Admin wallet private key | Required |
| `llm.model` | LLM model to use | o3-mini |
| `llm.temperature` | LLM temperature setting | 0.7 |
| `llm.max_tokens` | Maximum tokens for LLM responses | 2000 |
| `security.input.validation` | Enable input validation | true |
| `security.resource.monitoring` | Enable resource monitoring | true |
| `security.output.validation` | Enable output validation | true |

## Built-in Knowledge Graphs

SafeAI comes with several built-in Knowledge Graphs:

- **CyberSecurity_KG**: Security patterns and threat detection
- **DataPrivacySecurity_KG**: Privacy protection frameworks
- **Ethics_KG**: Ethical decision-making principles
- **LegalCompliance_KG**: Regulatory compliance patterns
- **RiskManagement_KG**: Risk assessment and mitigation
- And many more domain-specific KGs

## Security and Compliance

### Security Validation

```cypher
CALL safeai.debug.validateSecurity() YIELD value
RETURN value;
```

### Production Readiness Check

```cypher
CALL safeai.debug.checkProductionReadiness() YIELD value
RETURN value;
```

## Usage Examples

### Creating a New Agent

```cypher
CALL safeai.createAgent({
  name: 'SecurityAgent',
  description: 'Agent for security monitoring',
  capabilities: ['threat_detection', 'incident_response'],
  blockchainIntegration: true
}) YIELD agent
RETURN agent;
```

### Running Security Checks

```cypher
CALL safeai.security.runSecurityCheck('data_access_patterns')
YIELD result
RETURN result;
```

## Creating Agents Using Natural Language

SafeAI now supports creating and validating agents using natural language descriptions. This makes it easier for users to create secure and effective agents without needing to write code or complex configurations.

### Creating a New Agent

Use the `safeai.agents.createFromDescription` procedure:

```cypher
CALL safeai.agents.createFromDescription(
    "Create an agent that analyzes code for security vulnerabilities. 
     It should check for common issues like SQL injection, XSS, and 
     buffer overflows. The agent should provide detailed explanations 
     of found vulnerabilities and suggest fixes.",
    "llm"  // or "groovy" for script-based agents
) YIELD value, agent
RETURN value, agent
```

The procedure will:
1. Generate a complete agent definition using GPT-4
2. Validate the definition for security and effectiveness
3. Create the agent with appropriate security settings
4. Link required capabilities
5. Return the created agent configuration

### Validating Existing Agents

Use the `safeai.agents.validateAgent` procedure to validate existing agents:

```cypher
CALL safeai.agents.validateAgent("SecurityAnalyzer")
YIELD value, agent
RETURN value, agent
```

This will check the agent for:
- Security vulnerabilities
- Ethical compliance
- Performance implications
- Resource usage
- Code/prompt safety

### Example Agent Types

1. **LLM-based Agents** (type: "llm")
   - Code analysis agents
   - Data validation agents
   - Natural language processing agents
   - Decision support agents

2. **Groovy Script Agents** (type: "groovy")
   - Data transformation agents
   - Integration agents
   - Monitoring agents
   - Automation agents

### Best Practices

1. **Descriptive Names**: Use clear, descriptive names for your agents
2. **Detailed Descriptions**: Provide comprehensive descriptions of agent functionality
3. **Security First**: Always include security requirements in your descriptions
4. **Capability Specification**: List all required capabilities explicitly
5. **Ethics Guidelines**: Include clear ethical guidelines and constraints
6. **Resource Limits**: Specify resource usage limits and effectiveness thresholds

## Development

### Building from Source

     ```bash
cd safeAI-plugin
mvn clean package
```

### Running Tests

     ```bash
mvn test
```

## Production Deployment

1. Set up environment variables
2. Configure security settings
3. Run deployment script:
     ```bash
   ./deploy_neo4j.sh
   ```
4. Verify installation:
     ```cypher
   CALL safeai.debug.checkProductionReadiness()
   ```

## Troubleshooting

### Common Issues

1. **Configuration Issues**
   - Ensure `plugin-config.properties` is in the Neo4j configuration directory
   - Verify all required properties are set correctly
   - Check Neo4j logs for configuration-related errors

2. **Blockchain Connection Issues**
   - Verify blockchain endpoint is accessible
   - Check admin wallet key configuration
   - Ensure blockchain network is running

3. **Security Validation Failures**
   - Review security validation output
   - Ensure all required security KGs are loaded
   - Check compliance requirements

### Getting Help

- Submit issues on GitHub
- Check documentation in `/docs`
- Contact support team

## License

Copyright © 2024 FortressAI. All rights reserved.

## Contributing

Please read our [Development Guidelines](MICROAGENT_DEV_GUIDELINES.md) and [Knowledge Graph Implementation Guide](docs/KnowledgeGraph_Implementation_Guide.md).

