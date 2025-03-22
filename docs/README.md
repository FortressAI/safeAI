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

## Serving Documentation Locally

To properly view the interactive demos and documentation (especially if you see a blank screen when opening from disk), it is recommended to serve the docs folder with a local web server. You can use one of the following methods:

### Unix/Linux/MacOS
1. Open a terminal and navigate to the `docs` directory.
2. (Optional) If `serve_docs.sh` is not executable, run the following command to set the execute permission:
   ```bash
   chmod +x serve_docs.sh
   ```
3. Run the following command:
   ```bash
   ./serve_docs.sh
   ```
4. Open your browser and navigate to `http://localhost:8000/interactive-demos/index.html`.

### Windows
1. Open a Command Prompt and navigate to the `docs` directory.
2. Run the following command:
   ```bat
   serve_docs.bat
   ```
3. Open your browser and navigate to `http://localhost:8000/interactive-demos/index.html`.

---
*Last updated: March 2024*

Copyright © 2024 SafeAI. All rights reserved. 
