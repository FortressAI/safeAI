# safeAI - Agentic Knowledge Graph Plugin

safeAI is a powerful plugin that transforms your Neo4j instance by integrating and managing Agentic Knowledge Graphs (KGs). Unlike standalone applications or UIs, safeAI focuses exclusively on backend functionality—developing, managing, and optimizing KGs via advanced natural language processing (NLP) and agent-based querying. UIs are not our business; we provide the core engine for domain experts and administrators to harness and refine agentic KGs.

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Installation and Setup](#installation-and-setup)
- [Deploying the Plugin](#deploying-the-plugin)
- [Knowledge Graph Domains](#knowledge-graph-domains)
  - [ARC Domain](#arc-domain)
  - [Math Domain](#math-domain)
  - [Ethics Domain](#ethics-domain)
  - [Internal KG](#internal-kg)
- [Role-Based Interactions](#role-based-interactions)
- [Developer Workflow Guidelines](#developer-workflow-guidelines)
- [Future Directions](#future-directions)
- [License](#license)

## Overview

The safeAI plugin provides a backend solution for managing Agentic Knowledge Graphs within Neo4j. It is designed for integration into existing systems, providing advanced query capabilities and continuous learning without the overhead of developing and maintaining a separate user interface.

Key benefits include:
- **Agent-Based Querying:** Deploy specialized agents to generate, refine, and execute queries against domain-specific KGs.
- **Dynamic Security:** Secure blockchain-based microtransactions with quantum-resistant cryptographic protocols.
- **Focused on Core Functionality:** We build and maintain the engine for KG management—UI development is not our focus.

## Key Features

- **Agent-Based Querying:** Tailored agents that enhance querying and reasoning for multiple KG domains.
- **Secure Blockchain Integration:** Leverages smart contracts for dynamic microtransactions and licensing, with a focus on quantum-resilient cryptography.
- **Diverse Domain Coverage:** Supports ARC puzzles, a consolidated Math KG, Ethics, and an Internal KG for administrative purposes. Each domain follows structured training, evaluation, and final evaluation workflows.
- **Continuous Learning:** Detailed chain-of-thought outputs facilitate iterative improvement and self-optimization of KG agents.

## Installation and Setup

1. **Prerequisites:**
   - Java (JDK 11 or higher)
   - Maven
   - Docker (for deploying Neo4j and blockchain environments)

2. **Build the Plugin:**
   ```bash
   mvn clean package
   ```

3. **Configuration:**
   - Set necessary environment variables (e.g., `OPENAI_API_KEY`).
   - Securely manage private keys and blockchain settings as described in the Internal KG documentation.

## Deploying the Plugin

Deploy the plugin using the provided `deploy_neo4j.sh` script which:
- Builds the safeAI plugin using Maven.
- Deploys a local blockchain with Ganache-CLI on port 8545 (for testing smart contracts and microtransactions).
- Launches a Neo4j Docker container with the safeAI plugin pre-loaded.

To deploy:
```bash
./deploy_neo4j.sh
```

## Knowledge Graph Domains

### ARC Domain

Designed for tackling complex ARC puzzles, the ARC KG supports:

- **Training:** Learn from input-output grid examples.
- **Evaluation:** Validate system performance with unseen puzzles.
- **Final Exam:** Export comprehensive solutions with detailed chain-of-thought reasoning.

*Example Query:*
```cypher
CALL nl.queryAndExecute("Fetch ARC training examples")
YIELD result
RETURN result;
```

### Math Domain

The consolidated "Maths" KG integrates various mathematical topics—arithmetic, algebra, calculus, geometry, and advanced proofs. It supports:

- **Training:** Examples covering basic operations and algebraic transformations.
- **Evaluation:** Test queries validating arithmetic and logical consistency.
- **Final Exam:** Rigorous proofs (e.g., the Fundamental Theorem of Algebra) with detailed reasoning.

*Example Query:*
```cypher
CALL nl.queryAndExecute("Retrieve training examples for math operations")
YIELD result
RETURN result;
```

### Ethics Domain

The Ethics KG provides guidelines, principles, and policy standards:

- **Training:** Access ethical theories and foundational guidelines.
- **Evaluation:** Fetch detailed policies and governance standards.

*Example Query:*
```cypher
CALL nl.query("List ethical guidelines")
YIELD generatedQuery
RETURN generatedQuery;
```

### Internal KG

This KG holds administrative data including:

- **User Role Metadata:** Information on Admins, Domain Creators, and Users with secure wallet addresses and access tokens.
- **Security Policies:** Best practices for key management and blockchain integration.
- **Microtransaction Configurations:** Dynamic pricing models, contract details, and related parameters.

## Role-Based Interactions

- **Admin:**
  - Full control over system functionalities and all KGs.
  - Manages blockchain contracts, secure key policies, and global configurations.
  - Reviews and approves changes from Domain Creators.
  - Accesses training, evaluation, and final exam data across all domains.

- **Domain Creators (KG Creators):**
  - Develop, update, and validate domain-specific KG agents (e.g., for ARC puzzles, Math operations, Ethics).
  - Curate training data, define test scenarios, and design final exam assessments.
  - Validate KG performance and accuracy before releasing them to Users.

- **Users:**
  - Query approved, agentic KGs via natural language procedures.
  - Pay for access through secure blockchain-backed microtransactions.
  - Benefit from detailed, explainable chain-of-thought outputs from training and testing phases.

## Developer Workflow Guidelines

- **Branching Strategy:**
  - Develop in feature-specific branches (never on main).
  - Merge updated branches on the remote and delete them post-merge.

- **Pruning Remote References:**
  - Run `git fetch --prune` regularly to remove stale remote-tracking branches.

- **Pull Requests:**
  - Always open a PR for feature updates to ensure code review and testing.

- **Testing and Continuous Improvement:**
  - Utilize the deploy script to verify end-to-end functionality.
  - Leverage the KGConversationalAgent for iterative query refinement and learning.

## Future Directions

- **Enhanced Quantum-Resistant Security:**
  - Continually update cryptographic modules to integrate quantum-resistant digital signatures and key exchanges.

- **Domain Expansion:**
  - Add new Knowledge Graphs for emerging domains while maintaining a uniform training-evaluation-final exam structure.

- **AI-Driven Optimization:**
  - Improve NLP accuracy and agent-based reasoning to optimize query generation and system responses.

- **Dynamic Microtransaction Models:**
  - Develop real-time pricing mechanisms that adjust based on system load and demand.

- **Continuous Learning:**
  - Implement feedback loops to enable the system to evolve using live performance metrics and user data.

## License

This project is licensed under the terms specified in the LICENSE file.
