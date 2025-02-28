# safeAI Plugin: The Ultimate Extended Guide

Welcome to the ultimate extended guide for the safeAI Plugin! This guide is designed for beginners, school-age kids, and anyone who isn’t a developer. Our goal is to teach you everything about safeAI—from installing the plugin and setting up a local blockchain to using its built-in domains (ARC, Math, Ethics) and creating new domains via simple Cypher procedures. We hide all the complex details behind user-friendly commands so that you only interact with safeAI through simple Cypher queries.

This guide is much longer than usual so you can get an in-depth understanding of the whole system. Read through each section to discover what it means to work with an agentic Knowledge Graph (KG) and how safeAI ensures ethical, transparent problem-solving.

---

## Table of Contents
1. Introduction
2. What is safeAI?
3. Installing the safeAI Plugin
4. Setting Up a Local Blockchain and Integrating It
5. Running safeAI and Connecting via Cypher
6. In-Depth Exploration of Our Default Domains
   - 6.1 ARC Domain – Abstract Puzzles
   - 6.2 Math Domain – Solving Math Problems
   - 6.3 Ethics Domain – Ensuring Fairness (Immutable)
7. How safeAI Works: The Three Phases Explained in Detail
8. Understanding Agentic Knowledge Graphs (KGs)
9. Managing Contracts & Billing via Smart Contracts
10. Customization: Global Defaults and Creating New Domains
   - 10.1 Creating New Domains the Easy Way with Cypher
11. Detailed Example Queries for Every Internal KG
12. Advanced Topics: Chain-of-Thought and System Integration
13. FAQ and Troubleshooting
14. Summary and Next Steps

---

## 1. Introduction

Imagine having a super-smart helper that can solve puzzles, answer math questions, and even ensure that every solution is fair. That is what safeAI does. This guide will take you on a journey from the very basics—installing safeAI—to the advanced concepts of agentic Knowledge Graphs (KGs). No technical jargon, just simple, friendly Cypher commands that work like magic.

## 2. What is safeAI?

safeAI turns your Neo4j database into a powerful, interactive assistant using Agentic Knowledge Graphs. An agentic KG is like a mini intelligent brain: it observes, thinks, and then explains its solution step-by-step. safeAI comes with several pre-built domains:

- **ARC Domain:** Specializes in solving abstract puzzles with creative moves.
- **Math Domain:** Handles a variety of math problems using unified techniques.
- **Ethics Domain:** Ensures that every solution is ethical by enforcing immutable moral rules. (Note: This domain cannot be edited, and all other domains operate in accordance with its ethical standards.)

## 3. Installing the safeAI Plugin

### Requirements:
- A running **Neo4j database** (install [Neo4j Desktop](https://neo4j.com/download/) or use a local instance).
- **Git** to clone the repository.
- The **Java Runtime Environment (JRE)** to run the plugin.

### Steps:
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/FortressAI/safeAI.git
   ```
2. **Navigate to the Directory:**
   ```bash
   cd safeAI
   ```
3. **Review the Setup:**
   The configuration files are pre-loaded in the system so that you don’t need to edit them manually.
4. **Install Dependencies:**
   Follow any additional instructions provided if a build tool like Maven or Gradle is used.

## 4. Setting Up a Local Blockchain and Integrating It

A blockchain is like a digital, unchangeable notebook that securely records all transactions. safeAI uses a local blockchain (set up with Ganache) to enforce billing and ensure correct usage through smart contracts.

### Detailed Steps:
1. **Download & Install Ganache:**
   - Visit [Ganache’s website](https://www.trufflesuite.com/ganache) and download Ganache Desktop.
   - Install the application using the on-screen instructions.
2. **Start Your Local Blockchain:**
   - Launch Ganache; it will automatically start a blockchain on port 7545, showing test accounts, transactions, and block numbers.
3. **Deploy a Dummy Smart Contract:**
   - Open [Remix IDE](https://remix.ethereum.org/), create a simple Solidity contract (for example, a contract that defines query costs), and deploy it to your local blockchain (use “Injected Web3” to connect to Ganache).
   - Record the contract address.
4. **Configure safeAI:**
   - The system is pre-configured to use blockchain billing. If needed, an administrator can update the settings silently.
5. **Test the Setup:**
   - Run a test Cypher query (e.g., `safeAI.processWithBilling`) to ensure that a transaction is recorded in Ganache.

## 5. Running safeAI and Connecting via Cypher

To start safeAI:

```bash
java -jar safeAI-plugin.jar --port 53815 --allow-iframe --cors --host 0.0.0.0
```

Then, in the Neo4j Browser or Cypher Shell, connect using:

```cypher
:CONNECT bolt://localhost:7687
```

## 6. In-Depth Exploration of Our Default Domains

### 6.1 ARC Domain – Abstract Puzzles

The ARC Domain is designed for creative puzzles. It uses various moves such as rotation, flipping, and rearrangement to solve complex patterns.

**Example Cypher Queries:**
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

The Math Domain unifies various concepts—from basic algebra to complex proofs—allowing safeAI to solve a wide range of math problems.

**Example Cypher Queries:**
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

The Ethics Domain is the moral backbone of safeAI. It uses immutable ethical rules inspired by classical wisdom (Aristotle, Socrates, Wittgenstein) to make sure that all solutions are fair and safe. **This domain cannot be edited.** All other domains must abide by its rulings.

**Example Cypher Queries:**
```cypher
// Create an ethics evaluation node
CREATE (e:SafeAIProblem {
  domain: 'Ethics',
  input: 'Propose change: Remove safety measures',
  description: 'Evaluate the ethical implications of removing safety measures.'
})
RETURN e;

// Run the ethics approval check
CALL safeAI.approveEthics('Propose change: Remove safety measures') YIELD approved, reason
RETURN approved, reason;
```

## 7. How safeAI Works: The Three Phases Explained

Every problem is processed through three sequential phases:

1. **Training Phase:**
   The system applies simple, direct transformations to see if a quick solution exists.
   ```cypher
   CALL safeAI.train('Math', 'Simplify: 3x + 2x', '5x') YIELD result, chain_of_thought
   RETURN result, chain_of_thought;
   ```

2. **Evaluation Phase:**
   If the training phase does not yield a solution, safeAI combines different transformation strategies to refine the answer.
   ```cypher
   CALL safeAI.evaluate('ARC', '[[1,2],[3,4]]', '[[2,3],[4,5]]') YIELD result, chain_of_thought
   RETURN result, chain_of_thought;
   ```

3. **Final Exam Phase:**
   The final answer is produced along with a detailed chain-of-thought that explains every step taken.
   ```cypher
   CALL safeAI.finalExam('Math', 'Simplify: 3x + 2x', '5x') YIELD result, chain_of_thought
   RETURN result, chain_of_thought;
   ```

## 8. Understanding Agentic Knowledge Graphs (KGs)

An **agentic KG** is a self-directed, smart system that not only stores information but actively reasons to solve problems. It is described as 'agentic' because:

- **Autonomy:** The KG independently processes inputs and chooses the best transformation strategy.
- **Transparency:** Each solution comes with a chain-of-thought, detailing the reasoning process.
- **Adaptability:** It can improve over time with each query, learning from previous problems.
- **Ethical Governance:** The immutable Ethics Domain ensures all actions are fair and compliant.

**Example to View Chain-of-Thought:**
```cypher
CALL safeAI.finalExam('ARC', '[[1,2],[3,4]]', '[[2,3],[4,5]]') YIELD chain_of_thought
RETURN chain_of_thought;
```

## 9. Managing Contracts & Billing via Smart Contracts

Each domain operates with its own billing structure, which is enforced automatically via smart contracts on a blockchain. The billing details include:

- **Price Per Query:** e.g., 0.0001 tokens
- **Minimum Fee:** e.g., 0.001 tokens
- **Usage Quota:** e.g., 1000 queries per month

Administrators set the global defaults, and every domain adheres to these rules. Billing is fully automated and can be verified with a simple query:

```cypher
CALL safeAI.getContractDetails('Math') YIELD contract
RETURN contract;
```

## 10. Creating New Domains the Easy Way (Using Cypher Only)

You don’t need to know any complicated internal details to create a new domain. With safeAI, you can create a new domain using a friendly Cypher procedure called **safeAI.createDomain**. This procedure hides all the complexity and does the setup automatically.

### How It Works:
Simply provide:
- **Domain Name:** (e.g., "Microeconomics")
- **Description:** A short explanation of what the domain covers.
- **Examples:** Sample queries for training, evaluation, and final answer phases.
- **Billing Settings:** Your desired pricing and usage rules (for instance, "0.0001 tokens per query, 0.001 tokens minimum, 1000 queries per month").

### Example:
```cypher
CALL safeAI.createDomain(
  'Microeconomics',
  'This domain answers questions about market equilibrium and basic microeconomics topics.',
  ['Calculate equilibrium for: Demand = 100 - 2P, Supply = 20 + 3P'],
  ['Step-by-step analysis of market factors.'],
  ['Final answer with a full explanation of market equilibrium.'],
  '0.0001 tokens, 0.001 tokens, 1000 queries'
) YIELD domain, status;
RETURN domain, status;
```

After running this command, your new domain is set up and ready for use with standard procedures such as **safeAI.train**, **safeAI.evaluate**, and **safeAI.finalExam**. No technical configuration files are exposed to you.

## 11. Detailed Example Queries for All Internal KGs

Below are some extended queries demonstrating the capabilities of each domain:

### ARC Domain Queries:
```cypher
// Create and process an ARC problem node
CREATE (p:SafeAIProblem {
  domain: 'ARC',
  input: '[[1,2],[3,4]]',
  expectedOutput: '[[2,3],[4,5]]',
  description: 'Puzzle requiring creative moves'
})
RETURN p;

CALL safeAI.train('ARC', '[[1,2],[3,4]]', '[[2,3],[4,5]]') YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```

### Math Domain Queries:
```cypher
// Create and process a Math problem node
CREATE (m:SafeAIProblem {
  domain: 'Math',
  input: 'Simplify: 3x + 2x',
  expectedOutput: '5x',
  description: 'Basic algebraic simplification'
})
RETURN m;

CALL safeAI.evaluate('Math', 'Simplify: 3x + 2x', '5x') YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```

### Ethics Domain Queries:
```cypher
// Create an ethics evaluation node
CREATE (e:SafeAIProblem {
  domain: 'Ethics',
  input: 'Propose change: Remove safety measures',
  description: 'Evaluate ethical implications'
})
RETURN e;

CALL safeAI.approveEthics('Propose change: Remove safety measures') YIELD approved, reason
RETURN approved, reason;
```

## 12. Advanced Topics: Chain-of-Thought and System Integration

- **Chain-of-Thought Analysis:**
  Every procedure returns a detailed explanation of each step taken to solve the problem. Use this to understand the decision-making process of the KG.
  ```cypher
  CALL safeAI.finalExam('Math', 'Simplify: 3x + 2x', '5x') YIELD chain_of_thought
  RETURN chain_of_thought;
  ```
- **System Integration:** Ensure consistent operations by having all domains adhere to the immutable standards enforced by the Ethics Domain. This guarantees that every new domain behaves transparently and ethically.

## 13. FAQ and Troubleshooting

**Q: What should I do if there is no output?**
A: Verify that Neo4j, safeAI, and your local blockchain (if used) are running and that you are connected properly.

**Q: Can I modify the Ethics Domain?**
A: No. The Ethics Domain is immutable and serves as a moral reference for all others. Any attempt to change it will be blocked to ensure fairness.

**Q: How are detailed explanations provided?**
A: Every query returns a chain-of-thought that lists all the steps taken to arrive at the solution. This transparency makes the system trustworthy.

**Q: How does billing work?
A: Billing is managed automatically via smart contracts. Each query incurs a cost based on predefined rules, and you can check billing details using a simple procedure.

## 14. Summary and Next Steps

This extended ultimate guide has shown you everything you need to know about safeAI:

- How to install safeAI and configure its environment.
- How to set up and integrate a local blockchain for automatic billing.
- Detailed insights into the ARC, Math, and Ethics domains, with extended examples and Cypher queries.
- What it means to work with an agentic Knowledge Graph that thinks and explains its reasoning.
- How to create new domains easily using a friendly Cypher procedure, with no exposure to complex configurations.

Now, explore safeAI by running more queries, creating new domains, and delving deep into the chain-of-thought explanations to understand how each problem is solved. Enjoy your journey into intelligent problem-solving!

---

*Remember: The Ethics Domain is unchangeable, ensuring that every solution remains fair and ethical. All other domains must follow its guidance to maintain integrity across the system.*

---

## Appendix A: Using Ganache CLI and Creating an Ethereum Workspace

For those who want to explore further, here’s a simple guide on how to use Ganache CLI to create your own Ethereum workspace. This section is an extra resource for curious learners who want to see behind the scenes, even though you don’t need to use these details for basic safeAI operations.

### What is Ganache CLI?
Ganache CLI is a command-line version of Ganache that lets you run a personal Ethereum blockchain on your computer. It works like a digital notebook where all transactions are recorded safely and automatically.

### How to Install Ganache CLI:
1. **Install Node.js:** Before using Ganache CLI, you need Node.js. Download it from [nodejs.org](https://nodejs.org/).
2. **Install Ganache CLI:** Open your terminal and run:
   ```bash
   npm install -g ganache-cli
   ```
   This command installs Ganache CLI globally so you can use it from any terminal window.

### How to Create an Ethereum Workspace Using Ganache CLI:
1. **Start Ganache CLI:**
   Open your terminal and run:
   ```bash
   ganache-cli -p 7545
   ```
   This starts a local Ethereum blockchain on port 7545. You will see a list of test accounts with balances and a log of transactions.

2. **Interact with Your Workspace:**
   You can now use CLI commands or tools that connect to the blockchain at `http://localhost:7545`. All transactions, like those for billing in safeAI, will be recorded here.

### Advanced Usage and the UI:
- **Ganache CLI Options:**
   Ganache CLI supports many options (like setting a specific block time, account balances, etc.). For example:
   ```bash
   ganache-cli -p 7545 -a 10 -e 1000
   ```
   This command starts the blockchain with 10 accounts and an initial balance of 1000 ETH each.

- **Using the Ganache UI:**
   Once you are comfortable with the CLI and understand how the workspace works, be aware that a graphical UI is also available. The UI provides an easy-to-use visual interface to monitor transactions, accounts, and blocks. It’s a great way to see what's happening on your blockchain in real time without using command-line tools.

This appendix is here for those who wish to dive deeper into the underlying technology. For most users, simply following the main guide with the friendly Cypher procedures is all you need. Enjoy exploring the world of safeAI and blockchain!
### Extended Deep Dive: Creating the Micro Economics Agentic KG

In this extended deep dive, we explore how you can use safeAI together with a local Ethereum blockchain (via Ganache CLI) to create a brand-new Micro Economics Agentic Knowledge Graph (KG). This specialized KG is designed to analyze market dynamics, calculate equilibria, and offer detailed economic insights—all while operating under the strict ethical guidelines set by the immutable Ethics Domain.

**Key Concepts and Best Practices:**

1. **Smart Contract Billing Insights:**
   - safeAI uses smart contracts to automatically bill each query. Using Ganache, you can simulate real Ethereum transactions and verify that every query is billed correctly in your test environment.

2. **Setting Up Your Testing Environment:**
   - Start Ganache CLI on a designated port (e.g., 7545 or 8545) with parameters that mimic realistic conditions (such as a block time of 10 seconds).
   - Running Ganache in detached mode allows you to automate your testing workflow and cleanly stop the instance when tests conclude.

3. **Creating the Micro Economics KG:**
   - Utilize the friendly Cypher procedure **safeAI.createDomain** to establish your new domain without dealing with internal configuration files. For example:
   ```cypher
   CALL safeAI.createDomain(
     'Microeconomics',
     'This domain provides economic analysis including market equilibrium, supply-demand dynamics, and consumer behavior insights.',
     ['Calculate equilibrium for: Demand = 100 - 2P, Supply = 20 + 3P'],
     ['Analyze step-by-step market forces impacting equilibrium.'],
     ['Return final equilibrium price and quantity with a full chain-of-thought explanation.'],
     '0.0001 tokens, 0.001 tokens, 1000 queries'
   ) YIELD domain, status;
   RETURN domain, status;
   ```
   - This procedure abstracts all the complex configurations so that you only need to provide intuitive inputs.

4. **Testing and Verification:**
   - Execute your queries across the three phases (training, evaluation, final exam) to ensure that every step in the problem-solving process is functioning as expected.
   - Review the detailed chain-of-thought outputs to understand the reasoning behind every decision made by the KG.

5. **Ensuring Ethical and Agentic Operation:**
   - The Ethics Domain is immutable and serves as the moral backbone for safeAI. All newly created domains, including your Micro Economics KG, must adhere to these strict ethical standards.
   - This ensures that every solution is not only effective but also fair and accountable.

6. **Iterative Refinement:**
   - Continuously test, analyze, and refine your queries. Adjust transformation strategies as needed and use your local blockchain to simulate actual transaction conditions.
   - This iterative process helps improve the performance and accuracy of your Micro Economics KG.

7. **Transitioning to the Ganache UI:**
   - Once you’re comfortable with the command-line operations and the test environment, explore the Ganache graphical UI. The UI provides a visual overview of accounts, transactions, and blocks, making it easier to monitor and understand your Ethereum workspace.

**Conclusion:**
By following these best practices, you can establish a robust Micro Economics Agentic KG using safeAI. This approach provides deep economic insights while ensuring strict ethical compliance and seamless smart contract billing. It’s a win-win: you gain sophisticated analytical capabilities and full control over your testing environment, all through simple, user-friendly Cypher commands.

