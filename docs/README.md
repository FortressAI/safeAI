# SafeAI Documentation

Welcome to the SafeAI documentation. This comprehensive guide will help you understand and use the SafeAI platform effectively.

## Table of Contents

### User Documentation
- [Getting Started Guide](getting-started.md)
- [Basic Concepts](basic-concepts.md)
- [User Manual](user-manual.md)
- [User Guide](user-guide.md)
- [User Journey Maps](user-journeys/user-journey-maps.md)
- [New User Journey](user-journeys/new-user-journey.md)

### Developer Documentation
- [Developer Journey](developer-journeys/developer-journey.md)
- [Architecture Overview](technical/architecture/architecture.md)
- [Technical Implementation Guide](technical/development/implementation-guide.md)
- [Contributing Guide](technical/contributing-guide.md)
- [API Reference](technical/api/api-reference.md)
- [Smart Contract Audit](technical/security/smart-contract-audit.md)
- [Testing Guide](technical/testing/testing-guide.md)
- [UI Implementation Guide](technical/ui/ui-implementation.md)
- [Blockchain Integration](technical/blockchain-integration.md)

### Domain Expert Documentation
- [Domain Expert Journey](domain-expert-journeys/domain-expert-journey.md)
- [Domain-Specific Guides](domains/)
- [Integration Guides](integration/)
- [Best Practices](roles/)

### Support and Resources
- [FAQ](support/faq.md)
- [Troubleshooting Guide](support/troubleshooting.md)
- [Contact Information](support/contact.md)

### Legal and Compliance
- [Legal Documentation](legal/)
- [Governance](governance/)
- [Compliance Guide](legal/compliance-guide.md)

### Community
- [Community Guidelines](community/guidelines.md)
- [Community Resources](community/resources.md)

## Interactive Demos

Explore our interactive demos to learn more about the SafeAI system in a hands-on way:

- [Dashboard Interactive Demo](interactive-demos/dashboard.html)
- [Agent Browser Demo](interactive-demos/agent-browser.html)
- [Agent Workshop Demo](interactive-demos/agent-workshop.html)
- [ARC Prize Challenge Demo](interactive-demos/arc-prize.html)
- [MathATP Demo](interactive-demos/mathatp.html)
- [FreePress Demo](interactive-demos/freepress.html)
- [Knowledge Graphs Demo](interactive-demos/knowledge-graphs.html)
- [Security Center Demo](interactive-demos/security-center.html)

Visit our [Interactive Demos Index](interactive-demos/index.html) for a complete listing.

## Documentation Updates
This documentation is regularly updated to reflect the latest features and improvements. Check back frequently for updates.

## Contributing
We welcome contributions to our documentation. Please see our [Contributing Guide](technical/contributing-guide.md) for details on how to submit improvements.

## Contact
For questions or feedback about this documentation, please contact our documentation team at docs@safeai.com.

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)

### Running Documentation Locally

To properly view the interactive demos and documentation (especially if you see a blank screen when opening from disk), it is recommended to serve the docs folder with a local web server.

#### Unix/Linux/MacOS
1. Open a terminal and navigate to the `docs` directory
2. Make the serve script executable:
   ```bash
   chmod +x serve_docs.sh
   ```
3. Run the server:
   ```bash
   ./serve_docs.sh
   ```
4. Open your browser and navigate to `http://localhost:8000`

#### Windows
1. Open a Command Prompt and navigate to the `docs` directory
2. Run the server:
   ```bat
   serve_docs.bat
   ```
3. Open your browser and navigate to `http://localhost:8000`

## Docker-Based Deployment

SafeAI supports a streamlined Docker-based deployment approach that sets up all components automatically.

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/FortressAI/safeAI.git
   cd safeAI
   ```

2. Run the deployment script:
   ```bash
   # For Unix/Linux/MacOS:
   ./scripts/deploy.sh

   # For Windows:
   scripts/deploy.bat
   ```

### Access Points
After deployment, you can access the following services:
- SafeAI GUI: http://localhost:3001
- Documentation: http://localhost:8080
- Neo4j Browser: http://localhost:7474
- Neo4j Bolt: bolt://localhost:7687

### Container Management
```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Restart a specific service
docker compose restart [service-name]
```

### Troubleshooting
If you encounter any issues during deployment:
1. Check the container logs using `docker compose logs`
2. Ensure all required ports are available
3. Verify Docker and Docker Compose are properly installed
4. Check the [Troubleshooting Guide](support/troubleshooting.md) for common issues

---
*Last updated: March 2024*

Copyright © 2024 SafeAI. All rights reserved. 
