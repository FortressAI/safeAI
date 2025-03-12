# Economics Agentic KG – Eco101 & Eco102 Agents (Script and LLM)

This document provides a series of Cypher queries to introduce an Economics Agentic Knowledge Graph (KG) enriched with agents in two levels – Eco 101 and Eco 102 – with both Script and LLM implementations. This model demonstrates:

- **Authorship vs. Usage:**
  - **Authorship:** Economists or developers can author different types of agents based on their expertise. Script agents are ideal for well-defined, calculative tasks (e.g., simple economic computations), while LLM agents offer narrative, context-driven insights.
  - **Usage:** End users can execute these agents to generate outputs. For instance, a Business Analyst might run a Script agent to derive quantitative insights, whereas an Economist might use an LLM agent to obtain qualitative analysis and forecasts.

- **Value Proposition:**
  By supporting both agent types, the system enables:
  - **Direct execution:** Immediate, executable responses via Script agents.
  - **Interpretative dialogue:** Rich, natural language outputs via LLM agents.

This document further explains wallet functionality, agent ownership, and the role of the Economist in publishing and supporting agents, covering both micro- and macro-economic aspects.

---

## 1. Create the Main Knowledge Graph Node

```cypher
CREATE (kg:KnowledgeGraph {
  name: "Economics Agentic KG",
  domain: "Economics",
  description: "A comprehensive knowledge graph integrating micro- and macro-economic agents, supporting both executable calculations and narrative analyses."
});
```

---

## 2. Create Wallet and Economist Nodes

Wallets represent financial support for agents. Economists publish and maintain these agents.

### Create a Wallet Node

```cypher
CREATE (w:Wallet {
  walletId: "wallet-basic-001",
  balance: 5000000, 
  currency: "wei",
  description: "Wallet for supporting basic economic agent deployments."
});
```

### Create an Economist Node

```cypher
CREATE (e:Economist {
  name: "Alice Economist",
  affiliation: "Basic Economic Research",
  description: "Publishes and supports foundational economic agents for routine analysis."
});
```

### Link Economist to Wallet

```cypher
MATCH (e:Economist {name: "Alice Economist"}), (w:Wallet {walletId: "wallet-basic-001"})
CREATE (e)-[:OWNS_WALLET]->(w);
```

---

## 3. Create Eco 101 Agents – Basic Examples (Microeconomic)

### Eco 101 Script Agent (Simple GDP Calculator)

```cypher
CREATE (a1:Agent {
  name: "Eco101_ScriptAgent",
  category: "Microeconomic",
  usageCount: 0,
  description: "A basic Script agent for Eco 101 that calculates an estimated GDP based on input parameters.",
  successCount: 0,
  agent_code: "def generateCandidate(input){\n  // Assume input is an object with 'production' and 'consumption' figures\n  def gdp = input.production - input.consumption;\n  return [candidate: 'Estimated GDP: ' + gdp, metadata: [method: 'Eco101_ScriptAgent', chain_of_thought: 'Subtract consumption from production', confidence: 1.0]];\n}",
  approvalCriteria: "{\"effectivenessThreshold\":\"0.95\", \"ethicsGuidelines\":\"Output must be fact-based and unbiased.\"}",
  agent_type: "Script"
});
```

### Eco 101 LLM Agent (Narrative Economic Overview)

```cypher
CREATE (a2:Agent {
  name: "Eco101_LLMAgent",
  category: "Microeconomic",
  usageCount: 0,
  description: "A basic LLM agent for Eco 101 that delivers a narrative overview of local economic conditions.",
  successCount: 0,
  agent_code: "def generateCandidate(input){\n  // Provide a narrative overview using local market data\n  return [candidate: 'Narrative Overview: Local markets show moderate growth with stable consumer behavior.', metadata: [method: 'Eco101_LLMAgent', chain_of_thought: 'Analyze local economic data', confidence: 0.95]];\n}",
  approvalCriteria: "{\"effectivenessThreshold\":\"0.95\", \"ethicsGuidelines\":\"Output should be clear, unbiased, and data-driven.\"}",
  agent_type: "LLM"
});
```

---

## 4. Create Eco 102 Agents – Advanced Examples (Macroeconomic)

### Eco 102 Script Agent (Tax Impact Calculator)

```cypher
CREATE (a3:Agent {
  name: "Eco102_ScriptAgent",
  category: "Macroeconomic",
  usageCount: 0,
  description: "A Script agent for Eco 102 that calculates tax impact on economic output using predefined formulas.",
  successCount: 0,
  agent_code: "def generateCandidate(input){\n  // Assume input contains 'output' and 'taxRate'\n  def taxImpact = input.output * input.taxRate;\n  return [candidate: 'Tax Impact: ' + taxImpact, metadata: [method: 'Eco102_ScriptAgent', chain_of_thought: 'Calculate tax impact', confidence: 0.94]];\n}",
  approvalCriteria: "{\"effectivenessThreshold\":\"0.95\", \"ethicsGuidelines\":\"Calculations must be precise and transparent.\"}",
  agent_type: "Script"
});
```

### Eco 102 LLM Agent (Global Economic Analysis)

```cypher
CREATE (a4:Agent {
  name: "Eco102_LLMAgent",
  category: "Macroeconomic",
  usageCount: 0,
  description: "An LLM agent for Eco 102 that provides a comprehensive analytical commentary on global economic trends and fiscal policies.",
  successCount: 0,
  agent_code: "def generateCandidate(input){\n  // Generate a detailed narrative analysis based on global economic data\n  return [candidate: 'Global Economic Analysis: Emerging markets exhibit volatility in response to shifting policies.', metadata: [method: 'Eco102_LLMAgent', chain_of_thought: 'Synthesize global trends into analysis', confidence: 0.93]];\n}",
  approvalCriteria: "{\"effectivenessThreshold\":\"0.95\", \"ethicsGuidelines\":\"Analysis must be comprehensive, unbiased, and data-driven.\"}",
  agent_type: "LLM"
});
```

---

## 5. Establish Relationships

### Link Agents to the Economics KG

```cypher
MATCH (kg:KnowledgeGraph {name: "Economics Agentic KG"}), (a:Agent)
WHERE a.name IN ["Eco101_ScriptAgent", "Eco101_LLMAgent", "Eco102_ScriptAgent", "Eco102_LLMAgent"]
CREATE (kg)-[:HAS_AGENT]->(a);
```

### Link Economist to Agents (Publishing / Ownership)

```cypher
MATCH (e:Economist {name: "Alice Economist"}), (a:Agent)
WHERE a.name IN ["Eco101_ScriptAgent", "Eco101_LLMAgent", "Eco102_ScriptAgent", "Eco102_LLMAgent"]
CREATE (e)-[:PUBLISHED_AGENT]->(a);
```

### Link Wallet to Support Agents

```cypher
MATCH (w:Wallet {walletId: "wallet-basic-001"}), (a:Agent)
WHERE a.name IN ["Eco101_ScriptAgent", "Eco101_LLMAgent", "Eco102_ScriptAgent", "Eco102_LLMAgent"]
CREATE (w)-[:FUNDS_AGENT]->(a);
```

---

## Summary

This setup demonstrates a dual-layered Economics Agentic KG featuring:

- **Eco 101 Agents:** Basic, microeconomic agents for immediate execution (both Script and LLM types).
- **Eco 102 Agents:** Advanced, macroeconomic agents offering detailed quantitative and qualitative analysis.
- **Wallet & Economist:** Financial support and publishing relationships that expose agent ownership and funding.

This model enables authors to create sophisticated economic agents and allows users to harness these agents for analysis, decision-making, and strategic economic insights.
