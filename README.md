# SafeAI: Secure, Transparent, and Ethical AI Plugin for Neo4j
Welcome to SafeAI! This plugin transforms your Neo4j database into a secure, transparent, and ethical AI reasoning engine. Whether you're a developer, researcher, or business user, SafeAI makes it easy to leverage AI capabilities while maintaining security and ethical standards.

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### One-Line Setup
```bash
git clone https://github.com/FortressAI/safeAI.git && cd safeAI && docker compose up -d
```

### Access Points
After setup, you can access:
- SafeAI GUI: http://localhost:3001
- Documentation: http://localhost:8080
- Neo4j Browser: http://localhost:7474

## What is SafeAI?

SafeAI is a Neo4j plugin that combines:
- 🤖 Advanced AI capabilities
- 🔒 Robust security measures
- ⚖️ Ethical compliance frameworks
- ⛓️ Blockchain-based governance

### Key Features
- **Built-in Knowledge Graphs**: Pre-configured for various domains
- **Web-based Management Console**: Modern UI for easy interaction
- **Security-First Architecture**: Continuous monitoring and protection
- **Transparent Reasoning**: Complete chain-of-thought logging
- **Production Ready**: Includes all necessary security features

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/FortressAI/safeAI.git
cd safeAI
```

### 2. Start the Services
```bash
docker compose up -d
```

This will start:
- SafeAI GUI (port 3001)
- Documentation server (port 8080)
- Neo4j database with SafeAI plugin (ports 7474, 7687)

### 3. Access the Interface
1. Open http://localhost:3001 in your browser
2. Log in with default credentials:
   - Username: neo4j
   - Password: safeai123

### 4. Explore Knowledge Graphs
The GUI provides easy access to:
- Dashboard
- Agent Browser
- Agent Workshop
- Security Center
- Knowledge Graphs Explorer

## Built-in Knowledge Graphs

SafeAI comes with several pre-configured knowledge graphs:
- **CyberSecurity_KG**: Security patterns and threat detection
- **Ethics_KG**: Ethical decision-making principles
- **Math_KG**: Mathematical concepts and proofs
- **FreePress**: Decentralized content platform

## Development Setup

### Local Development
1. Install dependencies:
```bash
cd safeAI-gui
npm install
```

2. Start the development server:
```bash
npm start
```

### Building from Source
```bash
cd safeAI-plugin
mvn clean package
```

## Troubleshooting

### Common Issues
1. **Can't access the GUI?**
   - Check if Docker containers are running: `docker compose ps`
   - Verify ports 3001, 8080, and 7474 are available

2. **Neo4j connection issues?**
   - Default credentials: neo4j/safeai123
   - Check Neo4j logs: `docker compose logs neo4j`

3. **Documentation not loading?**
   - Verify the docs container is running
   - Check nginx logs: `docker compose logs docs`

For more help, visit our [Troubleshooting Guide](docs/support/troubleshooting.md).

## Resources

- [User Manual](docs/user-manual.md)
- [API Reference](docs/technical/api/api-reference.md)
- [Security Guide](docs/technical/security/smart-contract-audit.md)
- [Contributing Guide](docs/technical/contributing-guide.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: http://localhost:8080
- GitHub Issues: [Report a bug](https://github.com/FortressAI/safeAI/issues)
- Email: support@safeai.com

---

*Last updated: March 2024*

