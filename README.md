# safeAI Plugin: Cypher Query Guide for Beginners

Welcome to the safeAI Plugin! This guide is written in simple language (even for grade school kids) and provides step-by-step Cypher query examples for installing, running, and using the safeAI plugin. If you communicate only via Cypher, this guide shows you exactly what to type in Neo4j’s Cypher Shell or Browser.

---

## Table of Contents
1. Introduction
2. Connecting to Neo4j
3. Creating a Problem Node
4. Running safeAI Procedures
   - ARC Domain
   - Math Domain
   - Ethics Domain
5. Detailed Step-by-Step Cypher Query Examples
6. Troubleshooting & Tips

---

## 1. Introduction

The safeAI Plugin turns your Neo4j database into a smart problem-solver. It can solve puzzles (ARC), handle math problems, and even check that solutions are ethical. This guide will tell you how to communicate with safeAI using Cypher queries only.

---

## 2. Connecting to Neo4j

First, start your Neo4j Browser or Cypher Shell and connect to your database. For example, in the Neo4j Browser, you might see a connection prompt. In the Cypher Shell, you can use:

```
:CONNECT bolt://localhost:7687
```

Make sure your database is running!

---

## 3. Creating a Problem Node

safeAI expects you to create nodes that describe a problem. A problem can be a puzzle in the ARC domain, a math problem, or an ethical evaluation query.

For example, to create an ARC problem node, run:

```cypher
CREATE (p:SafeAIProblem {
  domain: 'ARC',
  input: '[[1,2],[3,4]]',
  expectedOutput: '[[2,3],[4,5]]',
  description: 'Example ARC puzzle'
})
RETURN p;
```

Similarly, for a Math problem:

```cypher
CREATE (m:SafeAIProblem {
  domain: 'Math',
  input: 'Simplify: 3x + 2x',
  expectedOutput: '5x',
  description: 'Simplify the expression'
})
RETURN m;
```

And for an Ethics query (to check if a proposed change is ethical):

```cypher
CREATE (e:SafeAIProblem {
  domain: 'Ethics',
  input: 'Propose change: Remove safety checks',
  description: 'Test ethics evaluation'
})
RETURN e;
```

---

## 4. Running safeAI Procedures

The safeAI plugin exposes several procedures that you can call to process your problem nodes. Here are the typical phases:

### a) Training Phase

This phase tries simple transformations. To run it, use:

```cypher
CALL safeAI.train('ARC', '[[1,2],[3,4]]', '[[2,3],[4,5]]') YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```

For Math problems, you can call:

```cypher
CALL safeAI.train('Math', 'Simplify: 3x + 2x', '5x') YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```

### b) Evaluation Phase

If training fails, the plugin can combine transformations. Run:

```cypher
CALL safeAI.evaluate('ARC', '[[1,2],[3,4]]', '[[2,3],[4,5]]') YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```

For Math:

```cypher
CALL safeAI.evaluate('Math', 'Simplify: 3x + 2x', '5x') YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```

### c) Final Exam Phase

This phase produces the final answer along with a detailed explanation. Use:

```cypher
CALL safeAI.finalExam('ARC', '[[1,2],[3,4]]', '[[2,3],[4,5]]') YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```

And for Math:

```cypher
CALL safeAI.finalExam('Math', 'Simplify: 3x + 2x', '5x') YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```

### d) Ethics Approval

For ethical evaluation, the plugin checks if a proposed change is acceptable using the immutable Ethics KG. Run:

```cypher
CALL safeAI.approveEthics('Propose change: Remove safety checks') YIELD approved, reason
RETURN approved, reason;
```

---

## 5. Detailed Step-by-Step Cypher Query Examples

Let's walk through an example end-to-end for each domain.

### Example for ARC Domain:

1. **Create a Problem Node:**

```cypher
CREATE (arc:SafeAIProblem {
  domain: 'ARC',
  input: '[[1,2],[3,4]]',
  expectedOutput: '[[2,3],[4,5]]',
  description: 'Simple ARC puzzle'
})
RETURN arc;
```

2. **Run the Training Phase:**

```cypher
CALL safeAI.train(arc.domain, arc.input, arc.expectedOutput) YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```

3. **If Necessary, Run the Evaluation Phase:**

```cypher
CALL safeAI.evaluate(arc.domain, arc.input, arc.expectedOutput) YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```

4. **Obtain Final Answer with Explanation:**

```cypher
CALL safeAI.finalExam(arc.domain, arc.input, arc.expectedOutput) YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```

### Example for Math Domain:

1. **Create a Problem Node:**

```cypher
CREATE (math:SafeAIProblem {
  domain: 'Math',
  input: 'Simplify: 3x + 2x',
  expectedOutput: '5x',
  description: 'Simplify the algebraic expression'
})
RETURN math;
```

2. **Run the Training Phase:**

```cypher
CALL safeAI.train(math.domain, math.input, math.expectedOutput) YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```

3. **Run the Evaluation Phase (if needed):**

```cypher
CALL safeAI.evaluate(math.domain, math.input, math.expectedOutput) YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```

4. **Get Final Answer and Chain-of-Thought:**

```cypher
CALL safeAI.finalExam(math.domain, math.input, math.expectedOutput) YIELD result, chain_of_thought
RETURN result, chain_of_thought;
```





```cypher

  domain: 'Ethics',
  input: 'Propose change: Remove safety checks',
  description: 'Check if the change is ethical'
})
RETURN ethics;
```

2. **Run the Ethics Approval Check:**

```cypher
CALL safeAI.approveEthics(ethics.input) YIELD approved, reason
RETURN approved, reason;
```

---

## 6. Troubleshooting & Tips

- **No Output?** Double-check your syntax and that your Neo4j database is running.
- **Procedure Not Found?** Ensure the safeAI plugin is installed and that its procedures (like safeAI.train, safeAI.evaluate, safeAI.finalExam, and safeAI.approveEthics) are registered in your Neo4j instance.
- **Always Read the Chain-of-Thought:** The detailed explanation helps you understand what each transformation step did.

---

## 7. Summary

This guide has shown you, step-by-step, how to use Cypher queries to interact with the safeAI Plugin. By creating problem nodes and calling appropriate procedures, even a beginner can start solving puzzles, math problems, and ensuring ethical changes are approved—all using Cypher queries.

Happy querying and learning with safeAI!

## 13. Customization and Automatic Loading

The safeAI Plugin automatically loads a default configuration that includes pre-built Knowledge Graphs (KGs) for ARC, Math, and Ethics. This means that when you install safeAI, you get a fully functional system out of the box with:

- **ARC KG:** Preloaded with default puzzle transformation strategies for solving abstract puzzles.
- **Math KG:** A unified graph that consolidates various mathematical domains (arithmetic, algebra, calculus, geometry, number theory, combinatorics, matrices, and advanced proofs) with dedicated transformation agents.
- **Ethics KG:** An immutable KG loaded with classical ethical wisdom from Aristotle, Socrates, and Wittgenstein. This KG is locked to ensure ethical integrity.

**What is Loaded Automatically?**

- **Default KGs:** All default knowledge graphs (ARC, Math, and Ethics) are automatically loaded when safeAI starts.
- **Default Procedures:** safeAI procedures (e.g., safeAI.train, safeAI.evaluate, safeAI.finalExam, and safeAI.approveEthics) are registered automatically in Neo4j.
- **Immutable Ethics KG:** The Ethics KG is designed to be constant, ensuring that ethical principles remain unaltered and serve as a reliable benchmark.

**What Can New Domain Creators Do?**

- **Extend and Customize:** Domain Creators can add or modify transformation agents, update JSON endpoints to point to new data sources, and extend the chain-of-thought logic used in training and evaluation phases.
- **Add New Domains:** You can integrate additional domains (such as science, language, or social studies) using the safeAI framework as a template.
- **Preserve Integrity:** While customization is available for most domains, the Ethics KG is intentionally immutable to maintain ethical standards.


## 14. Building Your Own Dummy Agentic KG and Creating Contracts

In this section, we will explain, step-by-step, how you — as a new Domain Creator — can build your very own dummy Agentic Knowledge Graph (KG) and set up smart contracts for its use. This guide is written assuming you know only basic computer skills. We start with the end goal and work backwards, ensuring you understand every step along the way.

### 14.1 Define the End Goal

Before creating your dummy KG, ask yourself: "What is the final output I expect?" For example, you may want your KG to output a final answer (like "Final Answer: 42") along with a detailed chain-of-thought that explains every transformation step. This final answer is crucial because it is what the end user sees.

*Example End Goal:*
- For a Dummy Domain, the KG might output: "Final Answer: 42" with a chain-of-thought explaining that simple arithmetic was performed in steps to arrive at 42.

### 14.2 Work Backwards: Plan Your Workflow

Plan the workflow in three phases:

1. **Training Phase:** 
   - Try simple transformations or operations on your input. 
   - Define training examples that show what a correct transformation looks like.

2. **Evaluation Phase:**
   - If simple moves fail, combine several transformations. 
   - Define evaluation examples that represent more complex transformations.

3. **Final Exam Phase:**
   - Produce the final answer along with a detailed chain-of-thought that includes all attempted transformations.
   - Define final exam examples that demonstrate the full workflow from start to finish.

### 14.3 Create Your Dummy KG JSON File

You will create a JSON file that defines your dummy KG. It should include:

- **domain:** The name of your domain (e.g., "Dummy").
- **description:** A description of what your KG does.
- **endpoints:** Dummy URLs for accessing data, like "https://example.com/dummy_data".
- **trainingExamples, evaluationExamples, finalExamExamples:** Examples that demonstrate each phase of transformation.
- **scripts:** Groovy scripts that define the actions for each phase (you can start with simple placeholder scripts).
- **transformationAgents:** A list of fictitious agents (e.g., "dummyAgentBasic", "dummyAgentAdvanced").

*Sample JSON Structure:*

```json
{
  "domain": "Dummy",
  "description": "A dummy Agentic KG for demonstration, showing how to use transformation strategies to work backwards from an end goal.",
  "endpoints": {
    "data_folder": "https://example.com/dummy_data",
    "training": "https://example.com/dummy_data/training",
    "evaluation": "https://example.com/dummy_data/evaluation",
    "finalExam": "https://example.com/dummy_data/finalExam"
  },
  "trainingExamples": [
    { "input": "Start: 20 + 22", "expectedOutput": "42", "description": "Basic addition example." }
  ],
  "evaluationExamples": [
    { "input": "Combine: 20 + 22 step-by-step", "expectedOutput": "42", "description": "Step-by-step addition." }
  ],
  "finalExamExamples": [
    { "input": "Solve: What is the answer to life, the universe, and everything?", "expectedOutput": "42", "description": "Full transformation with chain-of-thought." }
  ],
  "scripts": {
    "trainingScript": "def process(input, expectedOutput, context) { return nlQuery('Apply basic dummy transformation on ' + input) }",
    "combinationScript": "def process(input, expectedOutput, context) { return nlQuery('Apply combined dummy transformations on ' + input) }",
    "evaluationScript": "def process(input, expectedOutput, context) { def result = trainingScript.process(input, expectedOutput, context); if(result == null) { result = combinationScript.process(input, expectedOutput, context) } return result }",
    "finalExamScript": "def process(input, expectedOutput, context) { return [result: evaluationScript.process(input, expectedOutput, context), chain_of_thought: 'Dummy chain-of-thought explanation'] }"
  },
  "transformationAgents": {
    "dummyAgentBasic": "Handles basic transformations for the Dummy domain.",
    "dummyAgentAdvanced": "Handles advanced, multi-step transformations."
  }
}
```

### 14.4 Creating Contracts and Cost Structures

Contracts define the service terms and cost for using a KG. When you build your own KG, you'll also create a smart contract that specifies:

- **Service Level:** The quality and speed of responses.
- **Cost:** The fee per query or per transformation step (e.g., 0.0001 tokens per step).
- **Usage Quota:** The number of queries allowed per month, with overage charges as needed.
- **Enforcement Rules:** Conditions so that any query violating ethical standards (especially in the Ethics domain) is rejected.

These terms are enforced via a blockchain-based smart contract that the safeAI plugin reads during runtime.

### 14.5 Step-by-Step Workflow Recap

1. **Final Goal:** Define the final output and chain-of-thought.
2. **Final Exam Phase:** Decide how to compile and display all transformation steps.
3. **Evaluation Phase:** Set up how to combine multiple transformations if needed.
4. **Training Phase:** Define simple examples for straightforward transformation.
5. **JSON Specification:** Write your domain’s JSON file (see sample above) with examples for each phase.
6. **Transformation Agents:** Describe the agents that will perform the transformations.
7. **Contracts:** Create smart contract details specifying cost and usage rules.
8. **Integrate and Test:** Load your dummy KG into safeAI, run test queries via Cypher, and validate the output.

This workflow ensures that even new creators can build their own Agentic KG and set up contracts, working from the final goal backwards to the detailed steps required.


## 15. Managing Contracts and Executing KG Solutions

Each Agentic Knowledge Graph (KG) in safeAI includes its own contract configuration. This contract information defines the pricing, usage limits, and rules under which queries are processed for that domain. It works together with a blockchain-based smart contract system to bill and verify each solution.

### 15.1 Admin Configuration

- **Global Defaults:** The system administrator configures default contract settings in a central configuration file (usually in Internal_KG.json). This includes parameters such as:
  - **Price Per Query:** For example, 0.0001 tokens per query.
  - **Minimum Fee:** For example, 0.001 tokens.
  - **Usage Quota:** For example, 1000 queries per month.
  - **Smart Contract Template:** A Solidity snippet that calculates cost based on the number of queries.

- **Domain-Specific Overrides:** Admins can override these global defaults for a specific KG by including a contract section in that KG's JSON file.

### 15.2 Domain Creator Setup

When you build or customize a KG, you can add a "contract" section directly into your KG's JSON file. For example:

```json
"contract": {
  "pricePerQuery": "0.0001 tokens",
  "minFee": "0.001 tokens",
  "usageQuota": "1000 queries per month",
  "smartContractTemplate": "function getCost(uint queryCount) public pure returns (uint) { return queryCount * 100; }"
}
```

This ensures that every query to your KG is billed according to the rules you set.

### 15.3 User Execution of Contracts

- When an end user runs a query (using procedures such as `safeAI.finalExam`), safeAI retrieves the contract details for the corresponding KG.
- The plugin then uses the smart contract template to calculate the cost of the query, processes a blockchain microtransaction, and returns the cost along with the result and detailed chain-of-thought.

### 15.4 Testing and Verification

- **For Admins:** Use Cypher queries to view contract settings for a KG:
  ```cypher
  CALL safeAI.getContractDetails('Math') YIELD contract
  RETURN contract;
  ```
- **For Domain Creators:** Test your customized KG by submitting queries and verifying that the cost calculation matches the contract.
- **For End Users:** Check the query output; it should include a "cost" field that confirms billing as per the contract rules.

\n<!-- Temporary update for validation -->

## 16. Creating New KG JSON Configuration with Helper Scripts

When you want to build a new Knowledge Graph (KG) for a new domain, you don't have to start from scratch. The safeAI system provides a helper script that automatically creates a compliant JSON configuration for your new KG. This helper script is included in the Internal KG and works like a magic template builder!

### Steps to Use the Helper Script:

1. **Enter Your OpenAI API Key:**
   - Open the file `Internal_KG.json` located in `safeAI-plugin/src/main/resources/`.
   - Find the field "openai_api_key" and replace "your_openai_api_key_here" with your actual OpenAI API key.

2. **Run the Helper Script:**
   - The helper script, named "jsonBuilderScript", is part of the "helperScripts" section in the Internal KG.
   - This script accepts parameters such as:
     - **domain:** The name of your new domain.
     - **description:** A brief description of your KG.
     - **endpoints:** URLs for training, evaluation, and final exam data.
     - **trainingExamples, evaluationExamples, finalExamExamples:** Example data for each phase.
     - **scripts:** Groovy scripts that define each phase of processing.
     - **transformationAgents:** A list of agents to handle domain-specific transformations.
     - **contract:** Contract information (like pricing and usage rules), similar to the defaults.
   - Running the script generates a nicely formatted JSON file that you can save as your new KG configuration.

3. **Validate and Deploy Your New KG:**
   - Review the generated JSON file to ensure it meets your needs.
   - Save the file in the directory `safeAI-plugin/src/main/resources/`.
   - Restart safeAI and run test queries to verify that your new KG is working properly.

Using this helper script hides the complexity of manually writing JSON configurations and allows even beginners to quickly create a well-formed KG configuration for any new domain.

