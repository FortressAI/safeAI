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

### Example for Ethics Domain:

1. **Create an Ethics Query Node:**

```cypher
CREATE (ethics:SafeAIProblem {
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
