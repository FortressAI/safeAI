# safeAI Plugin: The Ultimate Extended Guide

Welcome to the ultimate extended guide for the safeAI Plugin! This guide is designed for everyone—from beginners and school-age kids to advanced developers. Our goal is to explain every aspect of safeAI: from installation and blockchain setup to using its built-in domains (ARC, Math, Ethics) and how our Agentic Knowledge Graphs (KGs) not only log every reasoning step but also continuously learn through language games—a unique capability that sets us apart.

---

## Table of Contents

1. [Introduction](#introduction)
2. [What is safeAI?](#what-is-safeai)
3. [Installing the safeAI Plugin](#installing-the-safeai-plugin)
4. [Setting Up a Local Blockchain and Integrating It](#setting-up-a-local-blockchain-and-integrating-it)
5. [Running safeAI and Connecting via Cypher](#running-safeai-and-connecting-via-cypher)
6. [In-Depth Exploration of Our Default Domains](#in-depth-exploration-of-our-default-domains)
   - 6.1 [ARC Domain – Abstract Puzzles](#arc-domain)
   - 6.2 [Math Domain – Solving Math Problems](#math-domain)
   - 6.3 [Ethics Domain – Ensuring Fairness (Immutable)](#ethics-domain)
7. [How safeAI Works: The Three Phases Explained](#how-safeai-works-the-three-phases-explained)
8. [Understanding Agentic Knowledge Graphs (KGs)](#understanding-agentic-knowledge-graphs-kgs)
   - 8.1 [Agentic KG Learning via Language Games](#agentic-kg-learning-via-language-games)
9. [Managing Contracts & Billing via Smart Contracts](#managing-contracts--billing-via-smart-contracts)
10. [Customizing and Extending safeAI](#customizing-and-extending-safeai)
    - 10.1 [Creating New Domains Using Cypher](#creating-new-domains-using-cypher)
11. [Advanced Topics: Chain-of-Thought, System Integration, and Debugging](#advanced-topics)
12. [FAQ and Troubleshooting](#faq-and-troubleshooting)
13. [Summary and Next Steps](#summary-and-next-steps)
14. [Appendices](#appendices)
    - Appendix A: [Using Ganache CLI and Creating an Ethereum Workspace](#appendix-a)
    - Appendix B: [From DevTest to Production – Deploying safeAI KG and Blockchain on AWS](#appendix-b)
    - Appendix C: [Wallets, Microtransactions, and Agentic KG Billing](#appendix-c)

---

## 1. Introduction

safeAI is a pioneering plugin for Neo4j that transforms a graph database into a full AI reasoning engine. It records every inference step in a transparent chain-of-thought while continuously refining its reasoning through playful language games. This adaptive, “agentic” approach ensures that safeAI not only provides verifiable answers but also learns over time—giving it a dynamic, self-improving quality that sets it apart.

---

## 2. What is safeAI?

The safeAI Plugin integrates AI reasoning with graph technology and blockchain. Its mission is twofold:
- To produce an AI that “thinks out loud”, storing every step of its reasoning in a dynamic knowledge graph.
- To empower its agentic KG to learn from interactions via language games, continuously refining its internal transformation strategies. This unique capability makes safeAI ethical, transparent, and auditable.

---

## 3. Installing the safeAI Plugin

1. **Locate Neo4j’s Plugins Folder:** Navigate to your Neo4j installation’s `plugins` directory.
2. **Copy the safeAI JAR:** Place the `safeai-plugin.jar` (and any dependencies such as APOC) into that folder.
3. **Update Neo4j Configuration:** Edit `neo4j.conf` to permit custom procedures:
   ```ini
   dbms.security.procedures.allowlist=*
   dbms.security.procedures.unrestricted=*
   ```
4. **Install Dependencies:** Follow additional instructions if a build tool (Maven/Gradle) is used.
5. **Start Neo4j:** Launch your Neo4j instance and verify via logs that the safeAI plugin loads.
6. **Verify Installation:** In the Neo4j Browser (e.g., [http://localhost:7474](http://localhost:7474)), run:
   ```cypher
   CALL dbms.procedures() YIELD name
   WHERE name CONTAINS 'safeai'
   RETURN name;
   ```

---

## 4. Setting Up a Local Blockchain and Integrating It

safeAI uses a blockchain to enforce secure billing via microtransactions. For local testing, you can use Ganache:
1. **Install Ganache:** Download Ganache Desktop or use Ganache CLI.
2. **Start the Blockchain:** For example, with Docker:
   ```bash
   docker run -d -p 8545:8545 --name ganache trufflesuite/ganache-cli:latest
   ```
3. **Deploy a Dummy Smart Contract:** Use Remix IDE to deploy a contract defining query costs; record its address.
4. **Configure safeAI:** The plugin comes pre-configured for blockchain billing; adjust settings only if necessary.
5. **Test:** Execute a test query (e.g., `CALL safeAI.processWithBilling`) to verify transaction recording.

---

## 5. Running safeAI and Connecting via Cypher

Start safeAI:
```bash
java -jar safeAI-plugin.jar --port 53815 --allow-iframe --cors --host 0.0.0.0
```
Then connect with Neo4j Browser or Cypher Shell:
```cypher
:CONNECT bolt://localhost:7687
```

---

## 6. In-Depth Exploration of Our Default Domains

safeAI includes specialized domains for solving various problems.

### 6.1 ARC Domain – Abstract Puzzles

The ARC Domain is tailored for creative puzzles that demand pattern recognition, spatial reasoning, and innovative transformation strategies. It processes problems in three phases:

- **Training Phase:** Applies direct transformations using the ARC training URL and generates an initial chain-of-thought.
- **Evaluation Phase:** If the initial approach is unsatisfactory, multiple strategies (via the ARC evaluation URL) are applied to refine the solution.
- **Final Exam Phase:** Processes the ARC final exam URL and returns the final solution in a standardized JSON format (compatible with arcprize.org).

Additionally, our ARC Agentic KG is implemented in Groovy to enable dynamic puzzle evaluation, allowing safeAI not only to log its reasoning but also to learn through language games.

Sample queries:
```cypher
// Create an ARC puzzle node
CREATE (p:SafeAIProblem {
  domain: 'ARC',
  input: '[[1,2],[3,4]]',
  expectedOutput: '[[2,3],[4,5]]',
  description: 'A simple puzzle requiring innovative moves.'
})
RETURN p;

// Run the training phase for ARC
CALL safeAI.train('ARC', '[[1,2],[3,4]]', '[[2,3],[4,5]]') YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```

### 6.2 Math Domain – Solving Math Problems

Handles tasks from basic algebra to complex proofs.
```cypher
// Create a math problem node
CREATE (m:SafeAIProblem {
  domain: 'Math',
  input: 'Simplify: 3x + 2x',
  expectedOutput: '5x',
  description: 'Basic algebraic simplification.'
})
RETURN m;

// Run the evaluation phase for Math
CALL safeAI.evaluate('Math', 'Simplify: 3x + 2x', '5x') YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```

### 6.3 Ethics Domain – Ensuring Fairness (Immutable)

Contains immutable ethical principles that all other domains must adhere to.
```cypher
// Create an ethics evaluation node
CREATE (e:SafeAIProblem {
  domain: 'Ethics',
  input: 'Propose change: Remove safety measures',
  description: 'Evaluate the ethical implications of removing safety measures.'
})
RETURN e;

CALL safeAI.approveEthics('Propose change: Remove safety measures') YIELD approved, reason
RETURN approved, reason;
```

---

## 7. How safeAI Works: The Three Phases Explained

safeAI processes each query using a three-phase approach:

1. **Training Phase:** 
   The system explores multiple transformation strategies using hypothesis nodes.
   ```cypher
   CALL safeAI.train('Math', 'Simplify: 3x + 2x', '5x') YIELD result, chain_of_thought
   RETURN result, chain_of_thought;
   ```

2. **Evaluation Phase:** 
   It refines and selects the best hypothesis by testing each strategy.
   ```cypher
   CALL safeAI.evaluate('ARC', '[[1,2],[3,4]]', '[[2,3],[4,5]]') YIELD result, chain_of_thought
   RETURN result, chain_of_thought;
   ```

3. **Final Exam Phase:** 
   The system commits to a final solution and returns the complete chain-of-thought.
   ```cypher
   CALL safeAI.finalExam('Math', 'Simplify: 3x + 2x', '5x') YIELD result, chain_of_thought
   RETURN result, chain_of_thought;
   ```

---

## 8. Understanding Agentic Knowledge Graphs (KGs)

safeAI’s agentic KG records every reasoning step and learns adaptively from interactions.

### 8.1 Agentic KG Learning via Language Games

Our KGs engage in language games—structured interactions that pit alternative reasoning paths against each other. This process enables:
- **Adaptive Learning:** Refinement of transformation rules over time.
- **Complete Transparency:** Every inference, from arithmetic to complex puzzle solutions, is recorded and can be queried.
- **Unique Self-Improvement:** Unlike typical systems, our KG continuously learns from these language interactions, updating its internal state.

Example to view the chain-of-thought:
```cypher
CALL safeAI.finalExam('ARC', '[[1,2],[3,4]]', '[[2,3],[4,5]]') YIELD chain_of_thought
RETURN chain_of_thought;
```

---

## 9. Managing Contracts & Billing via Smart Contracts

Each query is billed through blockchain microtransactions. Key parameters include:
- **Price Per Query:** e.g., 0.0001 tokens
- **Minimum Fee:** e.g., 0.001 tokens
- **Usage Quota:** e.g., 1000 queries per month

Retrieve contract details with:
```cypher
CALL safeAI.getContractDetails('Math') YIELD contract
RETURN contract;
```

---

## 10. Customizing and Extending safeAI

safeAI is fully extendable via simple Cypher commands.

### 10.1 Creating New Domains Using Cypher

For example, create a new domain with:
```cypher
CALL safeAI.createDomain(
  'Microeconomics',
  'This domain provides economic analysis including market equilibrium and consumer behavior insights.',
  ['Calculate equilibrium for: Demand = 100 - 2P, Supply = 20 + 3P'],
  ['Analyze step-by-step market forces impacting equilibrium.'],
  ['Return final equilibrium with a full chain-of-thought explanation.'],
  '0.0001 tokens, 0.001 tokens, 1000 queries'
) YIELD domain, status;
RETURN domain, status;
```
This sets up your domain and configures billing automatically.

---

## 11. Advanced Topics: Chain-of-Thought, System Integration, and Debugging

- **Chain-of-Thought Analysis:** Retrieve the complete reasoning path:
  ```cypher
  MATCH (p:Problem {id:123})-[:LEADS_TO|APPLY_RULE*]->(a:Answer {problemId:123})
  RETURN nodes(path) AS steps;
  ```
- **System Integration:** Ensure all domains adhere to immutable ethical guidelines while benefitting from adaptive learning.
- **Debugging:** Enable verbose logs, use Neo4j’s `PROFILE` command, and prune old session data to optimize performance.

---

## 12. FAQ and Troubleshooting

**Q: What should I do if there is no output?**  
A: Ensure Neo4j, safeAI, and your blockchain (Ganache) are running and properly connected.

**Q: Can I modify the Ethics Domain?**  
A: No. The Ethics Domain is immutable to ensure fairness; attempts to modify it are blocked.

**Q: How are explanations provided?**  
A: Every query returns a detailed chain-of-thought that documents each reasoning step.

**Q: How does billing work?**  
A: Each query triggers a smart contract-based microtransaction, with details verifiable via the KG and blockchain logs.

**Q: What if safeAI cannot solve a problem?**  
A: The chain-of-thought will highlight gaps in knowledge, enabling you to update the KG.

---

## 13. Summary and Next Steps

This guide has explained:
- How to install and configure the safeAI Plugin.
- Setting up a local blockchain (Ganache) for secure billing.
- Using built-in domains (ARC, Math, Ethics) with ARC-specific interactive processes.
- How our Agentic KGs learn adaptively via language games.
- How to customize safeAI and manage billing through smart contracts.

Experiment with safeAI by running queries, creating new domains, and observing how its chain-of-thought evolves as the system learns. Good luck with your final submission!

---

## 14. Appendices

### Appendix A: Using Ganache CLI and Creating an Ethereum Workspace
Detailed steps for installing Ganache CLI, setting up your Ethereum workspace, and simulating transactions.

### Appendix B: From DevTest to Production – Deploying safeAI KG and Blockchain on AWS
Instructions for containerizing safeAI, pushing images to AWS ECR, and deploying on AWS Fargate/ECS with auto-scaling.

### Appendix C: Wallets, Microtransactions, and Agentic KG Billing
Explains how billing is handled:
1. **System-Wide Wallet:** Configure a central admin wallet:
   ```cypher
   CALL safeAI.configureSystemWallet({
     walletAddress: '0xADMIN_WALLET_ADDRESS',
     privateKey: 'admin-private-key',
     name: 'AdminWallet'
   });
   ```
2. **Agentic KG Billing:** New domains record the creator's wallet, automatically routing billing to the admin wallet.
3. **Microtransaction Billing:** Every query across training, evaluation, and final exam triggers a microtransaction with a lubrication fee, ensuring smooth, automated billing.
4. **Verification:** Billing details are transparent and verifiable via the KG and blockchain logs.

---

*Remember: The Ethics Domain is immutable—ensuring every solution remains fair and ethical. Moreover, our Agentic KGs continuously learn and adapt through language games, evolving to deliver ever more accurate solutions.*

---

Thank you for exploring safeAI—the only AI plugin that reasons transparently and learns adaptively through language games. Enjoy your journey into intelligent problem-solving!
