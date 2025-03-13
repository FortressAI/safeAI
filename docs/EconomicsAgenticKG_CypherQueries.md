# Economics Agentic KG – Eco101 & Eco102 Agents (Script and LLM)

This document provides a series of Cypher queries to introduce an Economics Agentic Knowledge Graph (KG) enriched with agents in two levels – Eco 101 and Eco 102 – with both Script and LLM implementations, incorporating robust security features and resource management.

- **Authorship vs. Usage:**
  - **Authorship:** Economists or developers can author different types of agents based on their expertise. Script agents are ideal for well-defined, calculative tasks (e.g., simple economic computations), while LLM agents offer narrative, context-driven insights.
  - **Usage:** End users can execute these agents to generate outputs. For instance, a Business Analyst might run a Script agent to derive quantitative insights, whereas an Economist might use an LLM agent to obtain qualitative analysis and forecasts.

- **Security Features:**
  - Input validation and sanitization
  - Resource usage monitoring and limits
  - Rate limiting for API calls
  - Secure transaction handling
  - Audit logging

---

## 1. Create the Main Knowledge Graph Node with Security Configuration

```cypher
CREATE (kg:KnowledgeGraph {
  name: "Economics Agentic KG",
  domain: "Economics",
  description: "A comprehensive knowledge graph integrating micro- and macro-economic agents, supporting both executable calculations and narrative analyses.",
  input_validation_enabled: true,
  input_max_length: 10000,
  input_allowed_chars: "^[a-zA-Z0-9\\s\\+\\-\\*\\/\\(\\)\\[\\]\\{\\}\\^\\=\\,\\.\\;]*$",
  input_timeout_ms: 30000,
  resource_limit_memory_mb: 1024,
  resource_limit_cpu_ms: 60000,
  resource_limit_disk_mb: 100,
  rate_limit_requests_per_min: 60,
  rate_limit_burst: 10
});
```

---

## 2. Create Secure Wallet and Economist Nodes

### Create a Wallet Node with Security Features

```cypher
CREATE (w:Wallet {
  wallet_id: "wallet-basic-001",
  balance: 5000000, 
  currency: "wei",
  description: "Wallet for supporting basic economic agent deployments.",
  security_transaction_validation: true,
  security_key_rotation_hours: 24,
  security_audit_trail: true,
  security_smart_contract_verification: true
});
```

### Create an Economist Node with Access Controls

```cypher
CREATE (e:Economist {
  name: "Alice Economist",
  affiliation: "Basic Economic Research",
  description: "Publishes and supports foundational economic agents for routine analysis.",
  access_level: "admin",
  permission_publish: true,
  permission_modify: true,
  permission_delete: true,
  permission_audit: true
});
```

---

## 3. Create Eco 101 Agents – Basic Examples (Microeconomic)

### Eco 101 Script Agent (Secure GDP Calculator)

```cypher
CREATE (a1:Agent {
  name: "Eco101_ScriptAgent",
  category: "Microeconomic",
  usage_count: 0,
  description: "A basic Script agent for Eco 101 that calculates an estimated GDP based on input parameters.",
  success_count: 0,
  agent_code: "def generateCandidate(input){\n  if (!validateInput(input)) { return 'error:Invalid input'; }\n  def resources = monitorResources();\n  def gdp = input.production - input.consumption;\n  if (!validateOutput(gdp)) { return 'error:Invalid output'; }\n  return 'result:' + gdp + '|method:Eco101_ScriptAgent|chain_of_thought:Subtract consumption from production|confidence:1.0';\n}",
  effectiveness_threshold: "0.95",
  ethics_guidelines: "Output must be fact-based and unbiased.",
  agent_type: "Script",
  security_input_validation: true,
  security_resource_monitoring: true,
  security_output_validation: true
});
```

### Eco 101 LLM Agent (Secure Narrative Economic Overview)

```cypher
CREATE (a2:Agent {
  name: "Eco101_LLMAgent",
  category: "Microeconomic",
  usage_count: 0,
  description: "A basic LLM agent for Eco 101 that delivers a narrative overview of local economic conditions.",
  success_count: 0,
  agent_code: "def generateCandidate(input){\n  if (!validateInput(input)) { return 'error:Invalid input'; }\n  def resources = monitorResources();\n  def narrative = generateEconomicNarrative(input);\n  if (!validateOutput(narrative)) { return 'error:Invalid output'; }\n  return 'result:' + narrative + '|method:Eco101_LLMAgent|chain_of_thought:Analyze local economic data|confidence:0.95';\n}",
  effectiveness_threshold: "0.95",
  ethics_guidelines: "Output should be clear, unbiased, and data-driven.",
  agent_type: "LLM",
  security_input_validation: true,
  security_resource_monitoring: true,
  security_output_validation: true
});
```

---

## 4. Create Eco 102 Agents – Advanced Examples (Macroeconomic)

### Eco 102 Script Agent (Secure Tax Impact Calculator)

```cypher
CREATE (a3:Agent {
  name: "Eco102_ScriptAgent",
  category: "Macroeconomic",
  usage_count: 0,
  description: "A Script agent for Eco 102 that calculates tax impact on economic output using predefined formulas.",
  success_count: 0,
  agent_code: "def generateCandidate(input){\n  if (!validateInput(input)) { return 'error:Invalid input'; }\n  def resources = monitorResources();\n  def taxImpact = calculateTaxImpact(input);\n  if (!validateOutput(taxImpact)) { return 'error:Invalid output'; }\n  return 'result:' + taxImpact + '|method:Eco102_ScriptAgent|chain_of_thought:Calculate tax impact|confidence:0.94';\n}",
  effectiveness_threshold: "0.95",
  ethics_guidelines: "Calculations must be precise and transparent.",
  agent_type: "Script",
  security_input_validation: true,
  security_resource_monitoring: true,
  security_output_validation: true
});
```

### Eco 102 LLM Agent (Secure Global Economic Analysis)

```cypher
CREATE (a4:Agent {
  name: "Eco102_LLMAgent",
  category: "Macroeconomic",
  usage_count: 0,
  description: "An LLM agent for Eco 102 that provides a comprehensive analytical commentary on global economic trends and fiscal policies.",
  success_count: 0,
  agent_code: "def generateCandidate(input){\n  if (!validateInput(input)) { return 'error:Invalid input'; }\n  def resources = monitorResources();\n  def analysis = generateGlobalAnalysis(input);\n  if (!validateOutput(analysis)) { return 'error:Invalid output'; }\n  return 'result:' + analysis + '|method:Eco102_LLMAgent|chain_of_thought:Synthesize global trends into analysis|confidence:0.93';\n}",
  effectiveness_threshold: "0.95",
  ethics_guidelines: "Analysis must be comprehensive, unbiased, and data-driven.",
  agent_type: "LLM",
  security_input_validation: true,
  security_resource_monitoring: true,
  security_output_validation: true
});
```

---

## 5. Establish Secure Relationships

### Link Agents to the Economics KG with Access Controls

```cypher
MATCH (kg:KnowledgeGraph {name: "Economics Agentic KG"}), (a:Agent)
WHERE a.name IN ["Eco101_ScriptAgent", "Eco101_LLMAgent", "Eco102_ScriptAgent", "Eco102_LLMAgent"]
CREATE (kg)-[:HAS_AGENT {
  required_permission: "execute",
  audit_logging_enabled: true
}]->(a);
```

### Link Economist to Agents with Ownership Controls

```cypher
MATCH (e:Economist {name: "Alice Economist"}), (a:Agent)
WHERE a.name IN ["Eco101_ScriptAgent", "Eco101_LLMAgent", "Eco102_ScriptAgent", "Eco102_LLMAgent"]
CREATE (e)-[:PUBLISHED_AGENT {
  transfer_requires_approval: true,
  audit_logging_enabled: true
}]->(a);
```

### Link Wallet to Support Agents with Transaction Security

```cypher
MATCH (w:Wallet {wallet_id: "wallet-basic-001"}), (a:Agent)
WHERE a.name IN ["Eco101_ScriptAgent", "Eco101_LLMAgent", "Eco102_ScriptAgent", "Eco102_LLMAgent"]
CREATE (w)-[:FUNDS_AGENT {
  smart_contract_verification: true,
  transaction_validation: true,
  audit_trail_enabled: true
}]->(a);
```

---

## Summary

This setup demonstrates a secure, dual-layered Economics Agentic KG featuring:

- **Security Features:**
  - All properties use primitive types (strings, numbers, booleans)
  - Input validation and sanitization with string patterns
  - Resource monitoring with numeric limits
  - Rate limiting with integer values
  - Audit logging with boolean flags

- **Agent Types:**
  - **Eco 101 Agents:** Secure microeconomic agents for immediate execution
  - **Eco 102 Agents:** Protected macroeconomic agents for detailed analysis

- **Access Controls:**
  - Wallet security features using boolean flags
  - Economist permissions as boolean flags
  - Relationship properties using primitive types

- **Data Format:**
  - Agent return values use pipe-delimited strings instead of nested objects
  - All property names use snake_case
  - No nested JSON structures anywhere

This model enables authors to create sophisticated economic agents with robust security measures while allowing users to safely harness these agents for analysis, decision-making, and strategic economic insights.
