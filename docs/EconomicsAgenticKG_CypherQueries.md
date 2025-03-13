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
  security_config: {
    input_validation: {
      sanitization: true,
      max_input_length: 10000,
      allowed_characters: "^[a-zA-Z0-9\\s\\+\\-\\*\\/\\(\\)\\[\\]\\{\\}\\^\\=\\,\\.\\;]*$",
      timeout_ms: 30000
    },
    resource_limits: {
      max_memory_mb: 1024,
      max_cpu_time_ms: 60000,
      max_disk_io_mb: 100
    },
    rate_limiting: {
      requests_per_minute: 60,
      burst_limit: 10
    }
  }
});
```

---

## 2. Create Secure Wallet and Economist Nodes

### Create a Wallet Node with Security Features

```cypher
CREATE (w:Wallet {
  walletId: "wallet-basic-001",
  balance: 5000000, 
  currency: "wei",
  description: "Wallet for supporting basic economic agent deployments.",
  security: {
    transaction_validation: true,
    key_rotation_interval_hours: 24,
    audit_trail: true,
    smart_contract_verification: true
  }
});
```

### Create an Economist Node with Access Controls

```cypher
CREATE (e:Economist {
  name: "Alice Economist",
  affiliation: "Basic Economic Research",
  description: "Publishes and supports foundational economic agents for routine analysis.",
  access_level: "admin",
  permissions: ["publish", "modify", "delete", "audit"]
});
```

---

## 3. Create Eco 101 Agents – Basic Examples (Microeconomic)

### Eco 101 Script Agent (Secure GDP Calculator)

```cypher
CREATE (a1:Agent {
  name: "Eco101_ScriptAgent",
  category: "Microeconomic",
  usageCount: 0,
  description: "A basic Script agent for Eco 101 that calculates an estimated GDP based on input parameters.",
  successCount: 0,
  agent_code: "def generateCandidate(input){\n  // Input validation\n  if (!validateInput(input)) {\n    throw new SecurityException('Invalid input');\n  }\n  // Resource monitoring\n  def resources = startResourceMonitoring();\n  // GDP calculation\n  def gdp = input.production - input.consumption;\n  // Validate output\n  if (!validateOutput(gdp)) {\n    throw new ValidationException('Invalid output');\n  }\n  return [candidate: 'Estimated GDP: ' + gdp, metadata: [method: 'Eco101_ScriptAgent', chain_of_thought: 'Subtract consumption from production', confidence: 1.0]];\n}",
  approvalCriteria: "{\"effectivenessThreshold\":\"0.95\", \"ethicsGuidelines\":\"Output must be fact-based and unbiased.\"}",
  agent_type: "Script",
  security_config: {
    input_validation: true,
    resource_monitoring: true,
    output_validation: true
  }
});
```

### Eco 101 LLM Agent (Secure Narrative Economic Overview)

```cypher
CREATE (a2:Agent {
  name: "Eco101_LLMAgent",
  category: "Microeconomic",
  usageCount: 0,
  description: "A basic LLM agent for Eco 101 that delivers a narrative overview of local economic conditions.",
  successCount: 0,
  agent_code: "def generateCandidate(input){\n  // Input validation\n  if (!validateInput(input)) {\n    throw new SecurityException('Invalid input');\n  }\n  // Resource monitoring\n  def resources = startResourceMonitoring();\n  // Generate narrative\n  def narrative = generateEconomicNarrative(input);\n  // Validate output\n  if (!validateOutput(narrative)) {\n    throw new ValidationException('Invalid output');\n  }\n  return [candidate: narrative, metadata: [method: 'Eco101_LLMAgent', chain_of_thought: 'Analyze local economic data', confidence: 0.95]];\n}",
  approvalCriteria: "{\"effectivenessThreshold\":\"0.95\", \"ethicsGuidelines\":\"Output should be clear, unbiased, and data-driven.\"}",
  agent_type: "LLM",
  security_config: {
    input_validation: true,
    resource_monitoring: true,
    output_validation: true
  }
});
```

---

## 4. Create Eco 102 Agents – Advanced Examples (Macroeconomic)

### Eco 102 Script Agent (Secure Tax Impact Calculator)

```cypher
CREATE (a3:Agent {
  name: "Eco102_ScriptAgent",
  category: "Macroeconomic",
  usageCount: 0,
  description: "A Script agent for Eco 102 that calculates tax impact on economic output using predefined formulas.",
  successCount: 0,
  agent_code: "def generateCandidate(input){\n  // Input validation\n  if (!validateInput(input)) {\n    throw new SecurityException('Invalid input');\n  }\n  // Resource monitoring\n  def resources = startResourceMonitoring();\n  // Calculate tax impact\n  def taxImpact = calculateTaxImpact(input);\n  // Validate output\n  if (!validateOutput(taxImpact)) {\n    throw new ValidationException('Invalid output');\n  }\n  return [candidate: 'Tax Impact: ' + taxImpact, metadata: [method: 'Eco102_ScriptAgent', chain_of_thought: 'Calculate tax impact', confidence: 0.94]];\n}",
  approvalCriteria: "{\"effectivenessThreshold\":\"0.95\", \"ethicsGuidelines\":\"Calculations must be precise and transparent.\"}",
  agent_type: "Script",
  security_config: {
    input_validation: true,
    resource_monitoring: true,
    output_validation: true
  }
});
```

### Eco 102 LLM Agent (Secure Global Economic Analysis)

```cypher
CREATE (a4:Agent {
  name: "Eco102_LLMAgent",
  category: "Macroeconomic",
  usageCount: 0,
  description: "An LLM agent for Eco 102 that provides a comprehensive analytical commentary on global economic trends and fiscal policies.",
  successCount: 0,
  agent_code: "def generateCandidate(input){\n  // Input validation\n  if (!validateInput(input)) {\n    throw new SecurityException('Invalid input');\n  }\n  // Resource monitoring\n  def resources = startResourceMonitoring();\n  // Generate analysis\n  def analysis = generateGlobalAnalysis(input);\n  // Validate output\n  if (!validateOutput(analysis)) {\n    throw new ValidationException('Invalid output');\n  }\n  return [candidate: analysis, metadata: [method: 'Eco102_LLMAgent', chain_of_thought: 'Synthesize global trends into analysis', confidence: 0.93]];\n}",
  approvalCriteria: "{\"effectivenessThreshold\":\"0.95\", \"ethicsGuidelines\":\"Analysis must be comprehensive, unbiased, and data-driven.\"}",
  agent_type: "LLM",
  security_config: {
    input_validation: true,
    resource_monitoring: true,
    output_validation: true
  }
});
```

---

## 5. Establish Secure Relationships

### Link Agents to the Economics KG with Access Controls

```cypher
MATCH (kg:KnowledgeGraph {name: "Economics Agentic KG"}), (a:Agent)
WHERE a.name IN ["Eco101_ScriptAgent", "Eco101_LLMAgent", "Eco102_ScriptAgent", "Eco102_LLMAgent"]
CREATE (kg)-[:HAS_AGENT {
  access_control: {
    required_permissions: ["execute"],
    audit_logging: true
  }
}]->(a);
```

### Link Economist to Agents with Ownership Controls

```cypher
MATCH (e:Economist {name: "Alice Economist"}), (a:Agent)
WHERE a.name IN ["Eco101_ScriptAgent", "Eco101_LLMAgent", "Eco102_ScriptAgent", "Eco102_LLMAgent"]
CREATE (e)-[:PUBLISHED_AGENT {
  ownership_control: {
    transfer_requires_approval: true,
    audit_logging: true
  }
}]->(a);
```

### Link Wallet to Support Agents with Transaction Security

```cypher
MATCH (w:Wallet {walletId: "wallet-basic-001"}), (a:Agent)
WHERE a.name IN ["Eco101_ScriptAgent", "Eco101_LLMAgent", "Eco102_ScriptAgent", "Eco102_LLMAgent"]
CREATE (w)-[:FUNDS_AGENT {
  transaction_security: {
    smart_contract_verification: true,
    transaction_validation: true,
    audit_trail: true
  }
}]->(a);
```

---

## Summary

This setup demonstrates a secure, dual-layered Economics Agentic KG featuring:

- **Security Features:**
  - Comprehensive input validation and sanitization
  - Resource usage monitoring and limits
  - Rate limiting for API calls
  - Secure transaction handling
  - Audit logging and compliance tracking

- **Agent Types:**
  - **Eco 101 Agents:** Secure microeconomic agents for immediate execution
  - **Eco 102 Agents:** Protected macroeconomic agents for detailed analysis

- **Access Controls:**
  - Wallet security features for financial transactions
  - Economist permissions and access levels
  - Relationship-level security controls

This model enables authors to create sophisticated economic agents with robust security measures while allowing users to safely harness these agents for analysis, decision-making, and strategic economic insights.
