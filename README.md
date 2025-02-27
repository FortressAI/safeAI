# SafeAI Plugin 

## Overview
The SafeAI Plugin is a decentralized Neo4j plugin designed to secure, manage, and monetize knowledge graphs (KGs) using blockchain technology. It features robust digital signatures, immutable blockchain-based audit trails, dynamic token-based licensing, decentralized governance, and an integrated natural language interface for both technical and non-technical users.

## Key Features
- Security & Integrity: All updates are digitally signed with cryptographic hashes stored on a blockchain sidechain.
- Dynamic Licensing: Token costs and revenue sharing are calculated in real time.
- Decentralized Governance: Domain experts vote on KG updates through custom procedures.
- Adaptive Learning: Transformation agents dynamically improve KG updates.
- Secure Administration: Configuration includes ARC folder paths and secure API key setup.
- User-Friendly Interface: A ConversationalAgent translates natural language into Cypher queries.

## Architecture Overview
The project is divided into these core modules:
- **Crypto Module:** Implements digital signing (DigitalSignatureUtil) and quantum-upgradeable mechanisms.
- **Aggregation & Blockchain Modules:** Compute hashes and interact with the blockchain via BlockchainConnector and SmartContractHandler.
- **Licensing Module:** Manages dynamic token pricing and revenue sharing.
- **Governance Module:** Provides decentralized voting (GovernanceProcedures, VoteManager).
- **Learning Module:** Handles ARC KG installation/updates with LearningKGManager, PuzzleSolver, and ConversationalAgent.
- **Administration Module:** Provides procedures (e.g., safeai.configureApiKeys) for secure API key configuration.


## Developer Documentation
- Source code is organized under `src/main/java/com/safeai/neo4jplugin/`.
- To run tests:

   mvn test

Ensure that Maven dependencies are resolved and the JDK is configured for Java 11 or higher.

## Administrator & End-User Documentation
- **Administrators**:  
  • Set secure API keys using environment variables.  
  • Adjust `config/plugin-config.properties` for ARC folders and blockchain endpoints.  
  • Deploy using the Docker instructions provided above and update the neo4j.conf if not using Docker.
- **End Users**:  
  • Access the Neo4j Browser (http://localhost:7474) to run custom Cypher queries leveraging SafeAI procedures.  
  • Use the ConversationalAgent to translate plain language queries into Cypher.

For further support, please contact [support@fortressai.com](mailto:support@fortressai.com).

# SafeAI Plugin

## Overview

SafeAI Plugin is a decentralized Neo4j plugin that secures, manages, and monetizes knowledge graphs (KGs) using blockchain technology. It integrates robust digital signatures, immutable blockchain-based audit trails, dynamic token-based licensing, and decentralized governance. A foundational Ethics Node is at the core of the system, enabling self-validation of KGs by comparing candidate solutions against ethical and moral standards. This plugin is designed not only to solve abstract puzzles (such as ARC puzzles) but also to serve as a safeguard for AI in high-risk domains by providing transparent, human-readable, and auditable KGs.

## System Goals

- **Security & Integrity:**  
  Every update is digitally signed and hashed, with the hash stored on a blockchain sidechain for tamper‑proof auditability.
  
- **Dynamic Token-Based Licensing:**  
  Token costs are dynamically computed based on real‑time usage and transformation parameters. Smart contracts handle licensing transactions, ensuring low fees for learning modules and scalable revenue sharing.
  
- **Decentralized Governance:**  
  Domain experts use a distributed voting mechanism to manage and update KGs, ensuring that control remains transparent and human‑centric.
  
- **Foundational Ethics & Self-Validation:**  
  A central Ethics Node validates candidate solutions against ethical standards. The system automatically approves trivial cases and flags high-risk scenarios for further review.
  
- **Adaptive Learning & Transformation:**  
  A suite of over 20 transformation agents—plus dynamic combination agents and an LLM backup—continually refines the system through training on puzzles from both evaluation and training datasets.
  
- **Enhanced User Interaction:**  
  Users can interact with the system via standard Cypher queries augmented by custom procedures, as well as through a natural language interface that translates plain-language questions into Cypher queries.

## Architecture Overview

### Core Modules

- **MainPlugin:**  
  The entry point that registers custom procedures via Neo4j’s META-INF/services mechanism.

- **Crypto Module:**  
  Provides digital signing (DigitalSignatureUtil) and an abstraction layer (QuantumUpgradeable) for future quantum-resistant upgrades.

- **Aggregation Module:**  
  Aggregates transactions (TransactionAggregator) and computes cryptographic hashes (HashCalculator) to create immutable records.

- **Blockchain Module:**  
  Manages blockchain connectivity (BlockchainConnector) and smart contract interactions (SmartContractHandler).

- **Licensing Module:**  
  Dynamically calculates token costs (TokenPricingEngine) and revenue sharing (RevenueSharingManager), with procedures exposed via LicensingProcedures.

- **Usage Module:**  
  Tracks usage (UsageTracker) and generates detailed reports (UsageReporting).

- **Governance Module:**  
  Facilitates decentralized voting through GovernanceProcedures and VoteManager.

- **Authentication Module:**  
  Provides user authentication (AuthenticationService) and blockchain wallet integration (WalletIntegration).

### Learning Module

- **LearningKGManager:**  
  Initializes and installs the ARC KG and a foundational Ethics KG. It integrates security, blockchain synchronization, and smart contract deployment for licensing.

- **PuzzleSolver:**  
  Processes abstract puzzles (language games) using transformation agents. It logs transformation outcomes and helps train the system.

- **ConversationalAgent:**  
  Offers a natural language interface for querying the KG. It leverages an integrated LLM backup to translate plain language into Cypher queries and provide human-readable results.

### Dynamic Agent Generation

- **Adaptive Transformation Agents:**  
  The system tracks agent performance and automatically generates new transformation agents (or combination strategies) stored in the KG. This enables continuous learning and improvement.
  
- **Executable Code Storage:**  
  Code snippets (representing transformation logic or ethical reasoning) are stored in the KG and dynamically instantiated at runtime.

## User Interaction & Enhanced Querying

### Standard Cypher and Custom Procedures

Users can still run standard Cypher queries via the Neo4j Browser, but the SafeAI Plugin extends Neo4j's functionality by:
- Providing custom procedures (e.g., for licensing, governance, and ethical validation).
- Allowing queries that return detailed information about transformation performance, token pricing, and audit trails.

### Natural Language Interface

The **ConversationalAgent** offers an intuitive way for users to interact with the KG without writing Cypher manually:
- Users type queries in plain language (e.g., "What is the current token cost for the learning KG?" or "Show me the latest ethical validation report").
- The agent translates these into Cypher queries using the integrated LLM backup, executes them, and returns comprehensive, human‑readable responses.
  
### Blockchain-Backed Audit Trail

Every transaction—whether a transformation, licensing event, or governance vote—is cryptographically hashed and stored on a blockchain sidechain:
- This ensures that all data is immutable and fully auditable.
- Third parties can verify the integrity of the KG by comparing on-chain hashes with the KG data.

### Self-Validation Through the Ethics Node

The foundational Ethics Node:
- Aggregates ethical principles, moral dilemmas, and logical fallacies.
- Validates candidate solutions generated by transformation agents.
- Automatically approves solutions with minimal ethical impact while flagging those with significant moral implications for further review.

## Workflow

1. **Initialization:**
   - The plugin initializes by creating the foundational Ethics Node and loading core ethical standards.
   - The LearningKGManager installs the ARC KG (or equivalent) from designated sources.
   - Smart contracts for licensing are deployed with minimal fees to facilitate low-cost learning.

2. **Puzzle Ingestion & Processing:**
   - The system reads puzzles from both training and evaluation directories.
   - The PuzzleSolver processes these puzzles using a suite of transformation agents.
   - Candidate solutions are validated against the Ethics Node.
   - A dynamic combination agent may merge outputs to optimize accuracy, with LLM backup providing fallback solutions.

3. **User Interaction:**
   - Domain experts and learners interact with the KG via enhanced Cypher queries and natural language through the ConversationalAgent.
   - Users can retrieve audit trails, check licensing data, and view governance outcomes, all of which are stored on the blockchain.

4. **Continuous Learning & Governance:**
   - Performance data is continuously logged, and new agents may be generated based on training outcomes.
   - Decentralized governance allows domain experts to vote on updates, ensuring the system remains aligned with human-centric ethical standards.

## Setup & Deployment

### Prerequisites
- Java JDK 11+
- Maven 3.8+
- Neo4j Desktop or Enterprise (for Neo4j Browser)
- Docker & Docker Compose
- Git

### Quick Start

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/FortressAI/safeAI-plugin.git
   cd safeAI-plugin
   ```

2. **Run the Setup Script:**
   ```bash
   chmod +x create_project.sh
   ./create_project.sh
   ```

3. **Build the Project:**
   ```bash
   mvn clean package
   ```

4. **Deploy to Neo4j:**
   - Copy `target/safeai-plugin-1.0.0.jar` to your Neo4j `plugins/` directory.
   - Update `neo4j.conf`:
     ```ini
     dbms.security.procedures.unrestricted=com.safeai.neo4jplugin.*
     dbms.security.procedures.allowlist=com.safeai.neo4jplugin.*
     ```
   - Restart Neo4j.

5. **Configure Environment:**
   - Edit `config/plugin-config.properties` with your blockchain endpoint, licensing parameters, ARC KG URL, etc.

6. **Run Tests:**
   ```bash
   mvn test
   ```

### CI/CD & Production Deployment

- **Docker & Kubernetes:**  
  Use the Dockerfile in the `CI` directory and Kubernetes manifests in `CI/k8s/` for containerized deployment.
- **CI/CD Pipeline:**  
  The CI/CD pipeline configuration (`CI/ci-cd-pipeline.yml`) automates build, test, and deployment processes.

## Future Directions

- **Dynamic Agent Generation:**  
  Future versions will allow domain experts to dynamically submit and update transformation code stored in the KG.
- **Multi-Domain Expansion:**  
  The framework is designed to support multiple domains by extending the foundational Ethics Node.
- **Quantum-Resistant Upgrades:**  
  The modular cryptographic design allows seamless transitions to quantum-resistant algorithms.

## Contact

For support or further information, please contact FortressAI at [support@fortressai.com](mailto:support@fortressai.com).

---


## User Guide

### Overview
The **safeAI plugin** integrates advanced natural language processing (NLP) capabilities with your Neo4j database. Powered by a Large Language Model (LLM), it allows you to transform natural language queries into raw Cypher queries, execute these queries on your graph, and even interpret the results—all from within the Neo4j Browser or an interactive CLI.

### System Design and Architecture
The plugin is composed of several key components:

- **Custom Procedures:** Several Neo4j procedures (e.g., `nl.query` and `nl.queryAndExecute`) are registered through the `META-INF/services/org.neo4j.procedure.Procedure` file. These procedures enable you to either translate natural language commands into Cypher queries or generate and execute them directly.

- **LLM Integration:** An integrated LLM (via the OpenAI API) converts natural language input into Cypher. To use this feature, you must have the `OPENAI_API_KEY` environment variable set with a valid API key.

- **Interactive Shell:** The plugin includes an interactive shell provided by the `KGConversationalAgent` class. This shell guides you through generating queries, executing them, and reviewing the outputs.

- **Security and Tokens:**
  - A simple token-based mechanism is used to restrict access to internal knowledge graphs (e.g., the `InternalKGService` uses the token "AUTHORIZED").
  - The OpenAI API key is critical for LLM functionality and must be securely stored in the `OPENAI_API_KEY` environment variable.
  - Role management is differentiated between administrators (who configure system settings and tokens) and end users (who execute queries).

### Available Queries and Procedures (End User Queries)
Once the plugin is installed and your Neo4j server is configured, you can use the following procedures from the Neo4j Browser:

1. **Generate Cypher Query from Natural Language**
   - **Procedure:** `nl.query`
   - **Example:**
     ```cypher
     CALL nl.query("Describe the current schema")
     YIELD generatedQuery
     RETURN generatedQuery;
     ```
   - **Description:** This procedure converts a natural language prompt into a raw Cypher query without executing it.

2. **Generate and Execute Natural Language Query**
   - **Procedure:** `nl.queryAndExecute`
   - **Example:**
     ```cypher
     CALL nl.queryAndExecute("Get all puzzles solved by AI")
     YIELD result
     RETURN result;
     ```
   - **Description:** This procedure generates a Cypher query from your natural language request and then executes the query, returning the actual results.

3. **Additional Procedures:**
   Other domain-specific procedures exist (e.g., licensing, governance, usage tracking). Refer to the `META-INF/services/org.neo4j.procedure.Procedure` file for the complete list.

### How It Works from an End User's Perspective
1. **Query Generation:** For example, when you run:
   ```cypher
   CALL nl.query("Describe the current schema")
   YIELD generatedQuery
   RETURN generatedQuery;
   ```
   Your natural language prompt is sent to the LLM, which returns a raw Cypher query, giving you a preview before execution.

2. **Query Execution:** Using the `nl.queryAndExecute` procedure, the plugin automatically executes the generated Cypher query against your Neo4j database and returns the results.

3. **Result Interpretation:** The interactive shell provided by `KGConversationalAgent` can also interpret raw query results into plain language explanations to help you understand the output.

### Roles and Access
- **Administrators:** Responsible for configuring the system, managing security tokens, and ensuring the proper setup of API keys and database connections.

- **End Users:** Use the system via the Neo4j Browser or interactive CLI to generate, execute, and review natural language queries.

### Getting Started
- **Prerequisites:**
  - Set the `OPENAI_API_KEY` environment variable with a valid API key.
  - Ensure your Neo4j server is running and accessible.

- **Installation:**
  - Deploy the safeAI plugin JAR into your Neo4j plugins folder.
  - Update your `neo4j.conf` to allow custom procedures and configure necessary options (e.g., CORS, iframe settings).
  - Restart your Neo4j server and verify that the procedures are available.

- **Usage:**
  - Open the Neo4j Browser and run the example queries provided above.
  - Optionally, use the interactive CLI via `KGConversationalAgent` for a guided experience.


## Domain KG Examples

The safeAI plugin supports several domain-specific Knowledge Graphs (KGs) that empower users to explore a wide range of queries. Below are example queries for each domain, demonstrating how to generate and execute queries using the natural language procedures. These examples illustrate how the plugin functions as a new paradigm for SafeAI, integrating fully functioning KGs with LLM backup.

### ARC Puzzle KG
- **Resource File:** ARC_Puzzle_Agent_Definitions.json
- **Example Queries:**
  - **Generate Query:**
    ```cypher
    CALL nl.query("Retrieve ARC puzzle training examples")
    YIELD generatedQuery
    RETURN generatedQuery;
    ```
  - **Generate and Execute:**
    ```cypher
    CALL nl.queryAndExecute("Show all ARC puzzle definitions and training examples")
    YIELD result
    RETURN result;
    ```

### Ethics KG
- **Resource Files:** Ethics_KG.json, Foundational_Ethical_KG_Definitions.json
- **Example Queries:**
  - **Generate Query:**
    ```cypher
    CALL nl.query("List all ethical guidelines from the Ethics KG")
    YIELD generatedQuery
    RETURN generatedQuery;
    ```
  - **Generate and Execute:**
    ```cypher
    CALL nl.queryAndExecute("Fetch detailed ethical standards and guidelines")
    YIELD result
    RETURN result;
    ```

### CyberSecurity KG
- **Resource File:** CyberSecurity_KG.json
- **Example Queries:**
  - **Generate Query:**
    ```cypher
    CALL nl.query("Show me cybersecurity best practices")
    YIELD generatedQuery
    RETURN generatedQuery;
    ```
  - **Generate and Execute:**
    ```cypher
    CALL nl.queryAndExecute("Get detailed cybersecurity policies and procedures")
    YIELD result
    RETURN result;
    ```

### Combinatorics KG
- **Resource File:** Combinatorics_KG.json
- **Example Queries:**
  - **Generate Query:**
    ```cypher
    CALL nl.query("What are the key combinatorial challenges?")
    YIELD generatedQuery
    RETURN generatedQuery;
    ```
  - **Generate and Execute:**
    ```cypher
    CALL nl.queryAndExecute("List all combinatorial puzzles and problems")
    YIELD result
    RETURN result;
    ```

### Geometry KG
- **Resource File:** Geometry_KG.json
- **Example Queries:**
  - **Generate Query:**
    ```cypher
    CALL nl.query("Retrieve geometry puzzle definitions")
    YIELD generatedQuery
    RETURN generatedQuery;
    ```
  - **Generate and Execute:**
    ```cypher
    CALL nl.queryAndExecute("Show geometric puzzles and their properties")
    YIELD result
    RETURN result;
    ```

### Number Theory KG
- **Resource File:** NumberTheory_KG.json
- **Example Queries:**
  - **Generate Query:**
    ```cypher
    CALL nl.query("List number theory challenges")
    YIELD generatedQuery
    RETURN generatedQuery;
    ```
  - **Generate and Execute:**
    ```cypher
    CALL nl.queryAndExecute("Fetch number theory puzzles and examples")
    YIELD result
    RETURN result;
    ```

### Advanced Math Proof KG
- **Resource File:** AdvancedMathProof_KG.json
- **Example Queries:**
  - **Generate Query:**
    ```cypher
    CALL nl.query("Retrieve advanced mathematical proof challenges")
    YIELD generatedQuery
    RETURN generatedQuery;
    ```
  - **Generate and Execute:**
    ```cypher
    CALL nl.queryAndExecute("Show advanced math proofs and derivations")
    YIELD result
    RETURN result;
    ```

### Math KG
- **Resource File:** Math_KG.json
- **Example Queries:**
  - **Generate Query:**
    ```cypher
    CALL nl.query("Get general math puzzles and examples")
    YIELD generatedQuery
    RETURN generatedQuery;
    ```
  - **Generate and Execute:**
    ```cypher
    CALL nl.queryAndExecute("List general mathematical problems and solutions")
    YIELD result
    RETURN result;
    ```

### Integration Across Domains
The safeAI plugin supports an iterative and integrated workflow:
- **Step 1:** Use `nl.query` to generate a raw Cypher query from a natural language prompt, allowing you to review the translation.
- **Step 2:** Use `nl.queryAndExecute` to run the generated query directly against your Neo4j database.
- **Step 3:** Use the interactive shell (`KGConversationalAgent`) for continuous query refinement and plain language interpretation of results.

This approach provides a fully functioning environment where domain-specific KGs and LLM-powered query generation combine to form a powerful tool for exploring and managing your data in a natural and intuitive manner.

