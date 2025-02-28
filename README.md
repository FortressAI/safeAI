# safeAI Plugin: The Ultimate Beginner's Guide

Welcome to the safeAI Plugin! This guide is written for beginners and young students. It explains everything from installing safeAI, connecting to Neo4j, using its built-in domains, to creating new domains via simple Cypher procedures. All the technical details are hidden from you.

## Table of Contents
1. Introduction
2. What is safeAI?
3. Installing the safeAI Plugin
4. Setting Up a Local Blockchain and Integrating It
5. Running safeAI and Connecting via Cypher
6. Our Default Domains
   - ARC Domain – Abstract Puzzles
   - Math Domain – Solving Math Problems
   - Ethics Domain – Keeping Everything Fair
7. How safeAI Works: Three Phases
8. Managing Contracts & Billing
9. Customization: Global Defaults vs. New Domains
10. Creating New Domains the Easy Way
    - Using a Friendly Cypher Procedure
11. Testing and Validation
12. FAQ and Troubleshooting
13. Summary and Next Steps

## 1. Introduction
Imagine a super-smart robot that helps you solve puzzles, do your math homework, and ensures every answer is fair. That’s safeAI!

## 2. What is safeAI?
safeAI transforms your Neo4j database into an interactive assistant using Agentic Knowledge Graphs (KGs). It comes with built-in domains such as:
- **ARC Domain:** Solves creative puzzles.
- **Math Domain:** Answers math questions, from simple arithmetic to advanced proofs.
- **Ethics Domain:** Ensures every solution is fair using immutable ethical rules.

## 3. Installing the safeAI Plugin
Follow simple steps to install safeAI by cloning the repository, checking prerequisites, and installing dependencies.

## 4. Setting Up a Local Blockchain and Integrating It
A blockchain is like a digital, unchangeable notebook that records every transaction. safeAI uses a local blockchain (set up with Ganache) to automatically enforce billing and usage rules via smart contracts. Follow the provided steps to set up Ganache, deploy a simple contract, configure safeAI, and test the integration.

## 5. Running safeAI and Connecting via Cypher
Start safeAI using a simple command and connect using the Neo4j Browser or Cypher Shell.

## 6. Our Default Domains
- **ARC Domain:** Solves abstract puzzles by trying different moves until the solution is found.
- **Math Domain:** Provides answers to various math problems in a unified way.
- **Ethics Domain:** Enforces fair and ethical solutions using immutable rules.

## 7. How safeAI Works: Three Phases
safeAI processes problems in three phases: Training, Evaluation, and Final Exam, providing both the final answer and a detailed chain-of-thought explanation.

## 8. Managing Contracts & Billing
Each domain has its own billing configuration, which defines the cost per query, minimum fee, and usage limits. Billing is automatically handled via smart contracts on a connected blockchain.

## 9. Customization: Global Defaults vs. New Domains
Admins set global defaults, and you can create new domains without any technical hassle. Everything is managed behind the scenes.

## 10. Creating New Domains the Easy Way
You don’t need to worry about complex configurations. Use the friendly Cypher procedure **safeAI.createDomain** to set up a new domain automatically!

### How It Works:
Simply provide:
- **Domain Name:** (e.g., "Microeconomics")
- **Description:** A short explanation of what your new domain covers.
- **Examples:** Sample queries for training, evaluation, and final output.
- **Billing Settings:** Rules for query cost and usage (e.g., "0.0001 tokens per query, 0.001 tokens minimum, 1000 queries per month").

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

After running this command, your new domain is set up and ready to use with procedures like **safeAI.train**, **safeAI.evaluate**, and **safeAI.finalExam**.

## 11. Testing and Validation
Use Cypher commands to create problem nodes and run safeAI procedures to ensure that each domain, including new ones, works correctly and that billing is handled as expected.

## 12. FAQ and Troubleshooting
- **No Output?** Check that Neo4j and safeAI are running and that you’re connected properly.
- **API or Billing Settings?** These are managed automatically; just use the friendly procedures.
- **Billing Details?** Each query is billed via smart contracts on the local blockchain.

## 13. Summary and Next Steps
This guide has shown you how to install safeAI, set up a local blockchain, use its built-in domains, and create new domains easily with simple Cypher commands. Enjoy exploring safeAI and its problem-solving abilities!
