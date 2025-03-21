# Building an Economics Knowledge Graph: A Beginner's Guide

## What is an Economics Knowledge Graph?

An Economics Knowledge Graph is a specialized database that connects economic concepts, data, and AI agents that can analyze and process economic information. Think of it as a digital brain that understands economic relationships and can perform economic calculations and analysis.

This guide will show you how to create a simple but powerful Economics Knowledge Graph with AI agents that can:
- Calculate basic economic metrics (using Script agents)
- Provide narrative analysis of economic conditions (using LLM agents)

![Economics Knowledge Graph](../images/economics-kg-example.png)
*Example of an Economics Knowledge Graph with agents, concepts, and relationships*

## What You'll Learn

By following this guide, you'll be able to:
1. Create a foundational Economics Knowledge Graph
2. Add different types of AI agents to your graph
3. Connect these components with secure relationships
4. Understand the difference between script-based and LLM-based agents

## Types of AI Agents in This Example

We'll create two levels of economic agents:

1. **Eco101 Agents** (Basic economic concepts):
   - A **Script Agent** that calculates simple GDP estimates
   - An **LLM Agent** that provides basic economic narratives

2. **Eco102 Agents** (More advanced concepts):
   - A **Script Agent** that calculates tax impacts on economic output
   - An **LLM Agent** that analyzes global economic trends

### What's the Difference Between Script and LLM Agents?

- **Script Agents**: Code-based agents that perform specific calculations with well-defined formulas. They're great for exact, repeatable economic calculations.
- **LLM Agents**: Language model-based agents that can analyze, summarize, and generate narrative content about economic conditions. They're ideal for producing reports and analyses.

## Step-by-Step Implementation

### Step 1: Create the Main Knowledge Graph Node

First, we'll create the central node that will represent our Economics Knowledge Graph:

```cypher
CREATE (kg:KnowledgeGraph {
  name: "Economics Agentic KG",              // Name of our knowledge graph
  domain: "Economics",                        // The subject domain
  description: "A comprehensive knowledge graph integrating micro- and macro-economic agents",
  
  // Security settings (you can adjust these based on your needs)
  input_validation_enabled: true,             // Checks that inputs are valid
  input_max_length: 10000,                    // Maximum input size
  input_allowed_chars: "^[a-zA-Z0-9\\s\\+\\-\\*\\/\\(\\)\\[\\]\\{\\}\\^\\=\\,\\.\\;]*$",
  
  // Resource limits to prevent overuse
  resource_limit_memory_mb: 1024,             // Maximum memory usage
  resource_limit_cpu_ms: 60000,               // Maximum CPU time
  rate_limit_requests_per_min: 60             // Maximum requests per minute
});
```

**What this does:**
- Creates a node with the label `KnowledgeGraph`
- Sets the name, domain, and description
- Configures security settings to validate inputs
- Sets resource limits to prevent system overuse

### Step 2: Create a Wallet and an Economist

Next, we'll create a wallet (for transactions) and an economist (a user who can create agents):

```cypher
// Create a wallet to fund our agents
CREATE (w:Wallet {
  wallet_id: "wallet-basic-001",              // Unique ID for this wallet
  balance: 5000000,                           // Starting balance
  currency: "wei",                            // Currency unit
  description: "Wallet for supporting economic agent deployments",
  
  // Security features
  security_transaction_validation: true,       // Validates transactions
  security_audit_trail: true                   // Keeps a record of all transactions
});

// Create an economist who will manage our agents
CREATE (e:Economist {
  name: "Alice Economist",                     // User name
  affiliation: "Basic Economic Research",      // Organization
  description: "Creates and manages economic agents",
  
  // Permissions
  access_level: "admin",                       // Admin level access
  permission_publish: true,                    // Can publish new agents
  permission_modify: true                      // Can modify existing agents
});
```

**What this does:**
- Creates a wallet node with funds and security settings
- Creates an economist node representing a user with admin permissions

### Step 3: Create Eco101 Agents (Basic Level)

Now we'll create our first two agents - a script agent and an LLM agent for basic economics:

```cypher
// Create a basic Script agent for GDP calculation
CREATE (a1:Agent {
  name: "Eco101_ScriptAgent",                  // Unique name
  category: "Microeconomic",                   // Category
  description: "Calculates estimated GDP based on input parameters",
  agent_type: "Script",                        // This is a code-based agent
  
  // Example code for this agent (simplified)
  agent_code: "def generateCandidate(input){\n  if (!validateInput(input)) { return 'error:Invalid input'; }\n  def gdp = input.production - input.consumption;\n  return 'result:' + gdp;\n}",
  
  // Performance and security settings
  effectiveness_threshold: "0.95",             // Minimum acceptable performance
  security_input_validation: true,             // Validates inputs
  security_output_validation: true             // Validates outputs
});

// Create a basic LLM agent for economic narratives
CREATE (a2:Agent {
  name: "Eco101_LLMAgent",                     // Unique name
  category: "Microeconomic",                   // Category
  description: "Delivers a narrative overview of local economic conditions",
  agent_type: "LLM",                           // This is a language model agent
  
  // Example code for this agent (simplified)
  agent_code: "def generateCandidate(input){\n  if (!validateInput(input)) { return 'error:Invalid input'; }\n  def narrative = generateEconomicNarrative(input);\n  return 'result:' + narrative;\n}",
  
  // Performance and security settings
  effectiveness_threshold: "0.95",             // Minimum acceptable performance
  security_input_validation: true,             // Validates inputs
  security_output_validation: true             // Validates outputs
});
```

**What this does:**
- Creates a Script agent that can calculate GDP
- Creates an LLM agent that can generate economic narratives
- Sets security and performance parameters for both agents

### Step 4: Create Eco102 Agents (Advanced Level)

Now let's create two more advanced agents:

```cypher
// Create an advanced Script agent for tax impact calculations
CREATE (a3:Agent {
  name: "Eco102_ScriptAgent",                  // Unique name
  category: "Macroeconomic",                   // Category
  description: "Calculates tax impact on economic output using predefined formulas",
  agent_type: "Script",                        // This is a code-based agent
  
  // Example code for this agent (simplified)
  agent_code: "def generateCandidate(input){\n  if (!validateInput(input)) { return 'error:Invalid input'; }\n  def taxImpact = calculateTaxImpact(input);\n  return 'result:' + taxImpact;\n}",
  
  // Performance and security settings
  effectiveness_threshold: "0.95",             // Minimum acceptable performance
  security_input_validation: true,             // Validates inputs
  security_output_validation: true             // Validates outputs
});

// Create an advanced LLM agent for global economic analysis
CREATE (a4:Agent {
  name: "Eco102_LLMAgent",                     // Unique name
  category: "Macroeconomic",                   // Category
  description: "Provides comprehensive analytical commentary on global economic trends",
  agent_type: "LLM",                           // This is a language model agent
  
  // Example code for this agent (simplified)
  agent_code: "def generateCandidate(input){\n  if (!validateInput(input)) { return 'error:Invalid input'; }\n  def analysis = generateGlobalAnalysis(input);\n  return 'result:' + analysis;\n}",
  
  // Performance and security settings
  effectiveness_threshold: "0.95",             // Minimum acceptable performance
  security_input_validation: true,             // Validates inputs
  security_output_validation: true             // Validates outputs
});
```

**What this does:**
- Creates a more advanced Script agent that calculates tax impacts
- Creates a more advanced LLM agent that analyzes global economic trends
- Both agents are categorized as "Macroeconomic" (more complex than microeconomic)

### Step 5: Connect Everything Together

Finally, we'll connect all the nodes with relationships:

```cypher
// Connect agents to the knowledge graph
MATCH (kg:KnowledgeGraph {name: "Economics Agentic KG"}), (a:Agent)
WHERE a.name IN ["Eco101_ScriptAgent", "Eco101_LLMAgent", "Eco102_ScriptAgent", "Eco102_LLMAgent"]
CREATE (kg)-[:CONTAINS {
  created_at: datetime()                       // When this relationship was created
}]->(a);

// Show which economist published these agents
MATCH (e:Economist {name: "Alice Economist"}), (a:Agent)
WHERE a.name IN ["Eco101_ScriptAgent", "Eco101_LLMAgent", "Eco102_ScriptAgent", "Eco102_LLMAgent"]
CREATE (e)-[:PUBLISHED {
  created_at: datetime(),                      // When this relationship was created
  audit_logging_enabled: true                  // Track changes to this relationship
}]->(a);

// Connect the wallet to fund these agents
MATCH (w:Wallet {wallet_id: "wallet-basic-001"}), (a:Agent)
WHERE a.name IN ["Eco101_ScriptAgent", "Eco101_LLMAgent", "Eco102_ScriptAgent", "Eco102_LLMAgent"]
CREATE (w)-[:FUNDS {
  created_at: datetime(),                      // When this relationship was created
  transaction_validation: true                 // Validate all transactions
}]->(a);
```

**What this does:**
- Connects all agents to the knowledge graph with CONTAINS relationships
- Shows which economist published each agent with PUBLISHED relationships
- Links the wallet to each agent with FUNDS relationships

## How to Use Your Economics Knowledge Graph

Now that you've built your Economics Knowledge Graph, here's how you can use it:

### Finding All Economic Agents

To see all the agents in your knowledge graph:

```cypher
MATCH (kg:KnowledgeGraph {name: "Economics Agentic KG"})-[:CONTAINS]->(a:Agent)
RETURN a.name, a.category, a.description, a.agent_type
```

### Finding Basic vs. Advanced Agents

To find agents by their category:

```cypher
MATCH (a:Agent)
WHERE a.category = "Microeconomic"  // Change to "Macroeconomic" for advanced agents
RETURN a.name, a.description, a.agent_type
```

### Finding Script vs. LLM Agents

To find agents by their type:

```cypher
MATCH (a:Agent)
WHERE a.agent_type = "Script"  // Change to "LLM" for language model agents
RETURN a.name, a.category, a.description
```

## What to Try Next

After creating your Economics Knowledge Graph, you might want to:

1. **Add Economic Concepts** - Create nodes for concepts like "inflation," "unemployment," etc.
2. **Add More Relationships** - Connect agents to specific economic concepts they can analyze
3. **Create User Roles** - Add different types of users with varying access levels
4. **Create Agent Chains** - Make agents that can work together by calling each other

## Summary

Congratulations! You've built a basic Economics Knowledge Graph with:

- A central knowledge graph node
- Four different AI agents (two basic, two advanced)
- Two different agent types (Script and LLM)
- A wallet to fund the agents
- An economist who manages the agents
- Proper relationships connecting everything

This structure lets you organize economic knowledge and AI capabilities in a flexible, secure way. As you get more comfortable, you can expand this graph with more agents, concepts, and relationships to create a powerful economic analysis system.
