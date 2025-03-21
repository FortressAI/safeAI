# Creating Nodes in SafeAI: A Beginner's Guide

## What Are Nodes?

In a graph database like Neo4j, **nodes** are the fundamental building blocks that represent entities in your data. Think of nodes as the "nouns" in your data model - they represent things like:

- Knowledge Graphs
- AI Agents
- Concepts
- Capabilities
- Security Components
- Wallet/Blockchain identities

Each node can have:
- **Labels**: Categories that identify the type of node (like `Agent` or `KnowledgeGraph`)
- **Properties**: Key-value pairs that store information about the node
- **Relationships**: Connections to other nodes (covered in [relationships.md](./relationships.md))

## Why Nodes Matter in SafeAI

The SafeAI platform uses nodes to create a flexible, interconnected structure that can:

1. **Represent complex knowledge**: Organize domain-specific knowledge in a way that AI agents can understand
2. **Define intelligent agents**: Create agents with specific capabilities and permissions
3. **Establish security boundaries**: Control what different components can access
4. **Track performance**: Monitor the effectiveness of different parts of the system
5. **Enable governance**: Support transparent, auditable AI operations

## Understanding Node Creation

Before creating nodes, it's helpful to understand the pattern:

```cypher
CREATE (variable:Label {
    property1: value1,
    property2: value2,
    // more properties...
})
```

Where:
- `variable` is a temporary reference to the node
- `:Label` assigns a category to the node
- The curly braces `{ }` contain properties

## Creating Your First Knowledge Graph Node

The Knowledge Graph is the foundation of the SafeAI platform. Let's create one step by step:

```cypher
// Create a new Knowledge Graph
CREATE (kg:KnowledgeGraph {
  name: "economics_kg",               // Required: Unique identifier
  domain: "economics",                // Required: Knowledge domain
  description: "Knowledge graph for economic analysis and decision-making",  // Required: Description
  
  // Security Configuration
  input_validation_enabled: true,     // Validates inputs to prevent attacks
  input_max_length: 10000,            // Maximum size of inputs
  input_allowed_chars: "^[a-zA-Z0-9\\s\\+\\-\\*\\/\\(\\)\\[\\]\\{\\}\\^\\=\\,\\.\\;]*$",  // Allowed characters
  input_timeout_ms: 30000,            // Timeout in milliseconds
  
  // Resource Limits
  resource_limit_memory_mb: 1024,     // Maximum memory usage (MB)
  resource_limit_cpu_ms: 60000,       // Maximum CPU time (ms)
  resource_limit_disk_mb: 100,        // Maximum disk usage (MB)
  rate_limit_requests_per_min: 60,    // Maximum requests per minute
  rate_limit_burst: 10,               // Maximum burst of requests
  
  // Metadata
  created_at: datetime(),             // Creation timestamp
  updated_at: datetime(),             // Last update timestamp
  version: "1.0"                      // Version number
})
RETURN kg;  // Returns the newly created node
```

Let's break this down:

### Essential Fields:
- **name**: A unique identifier (use lowercase with underscores)
- **domain**: The knowledge area this graph covers
- **description**: A detailed explanation of the graph's purpose

### Security Settings:
- **input_validation_enabled**: When true, all inputs will be checked for security issues
- **input_max_length**: Prevents overly large inputs
- **input_allowed_chars**: A regular expression defining safe characters (prevents injection attacks)
- **input_timeout_ms**: Maximum time an operation can take

### Resource Controls:
- **resource_limit_memory_mb**: Prevents memory exhaustion
- **resource_limit_cpu_ms**: Prevents CPU overuse
- **rate_limit_requests_per_min**: Controls how many requests can be processed

### Metadata:
- **created_at**: When this node was created (using Neo4j's `datetime()` function)
- **updated_at**: When this node was last modified
- **version**: For tracking changes over time

## Creating Different Types of Nodes

### 1. Creating an Engine Node

Engines provide processing capabilities for knowledge graphs:

```cypher
// Create a domain-specific processing engine
CREATE (e:Engine {
  name: "economics_analysis_engine",  // Required: Unique identifier
  domain: "economics",                // Required: Must match parent KG
  engine_type: "analysis",            // Required: Type of engine
  
  // Capabilities
  analysis_types: ["predictive", "descriptive", "prescriptive"],  // Supported analysis types
  data_sources: ["structured", "unstructured", "time_series"],    // Supported data types
  
  // Performance Settings
  accuracy_threshold: 0.95,           // Minimum acceptable accuracy
  response_time_ms: 500,              // Target response time
  batch_size: 100,                    // Number of items processed together
  
  // Security
  security_validation_enabled: true,  // Validates operations
  security_audit_enabled: true,       // Enables security auditing
  
  // Metadata
  created_at: datetime(),             // Creation timestamp
  status: "active"                    // Current status
})
RETURN e;
```

Key aspects of an Engine node:
- The domain should match its parent Knowledge Graph
- engine_type categorizes what the engine does
- Analysis types and data sources define capabilities
- Performance settings help monitor and optimize

### 2. Creating an Agent Node

Agents are the active components that perform tasks in the SafeAI platform:

```cypher
// Create an agent node
CREATE (a:Agent {
  name: "economic_forecasting_agent",  // Required: Unique identifier
  category: "forecasting",             // Required: Agent category
  agent_type: "llm",                   // Required: "script" or "llm"
  description: "Predicts economic indicators using historical data",  // Required: Description
  
  // Performance Metrics
  effectiveness_threshold: 0.90,       // Minimum acceptable effectiveness
  usage_count: 0,                      // Times the agent has been used
  success_count: 0,                    // Successful operations
  
  // Security Features
  security_input_validation: true,     // Validates inputs
  security_resource_monitoring: true,  // Monitors resource usage
  security_output_validation: true,    // Validates outputs
  
  // Resource Management
  memory_limit_mb: 256,                // Maximum memory usage
  cpu_limit_ms: 15000,                 // Maximum CPU time
  rate_limit_rpm: 20,                  // Requests per minute
  
  // Metadata
  created_at: datetime(),              // Creation timestamp
  status: "active",                    // Current status
  version: "1.0"                       // Version number
})
RETURN a;
```

Important aspects of Agent nodes:
- `agent_type` can be "script" (code-based) or "llm" (language model)
- Performance metrics track how well the agent performs
- Security features protect against misuse
- Resource management prevents overuse of system resources

### 3. Creating a Wallet Node

Wallet nodes manage blockchain integration for the platform:

```cypher
// Create a wallet node for transaction management
CREATE (w:Wallet {
  wallet_id: "main_treasury",         // Required: Unique identifier
  blockchain_address: "0x1234567890abcdef1234567890abcdef12345678",  // Required: Blockchain address
  
  // Security Features
  security_transaction_validation: true,        // Validates transactions
  security_key_rotation_hours: 24,              // How often keys rotate
  security_audit_trail: true,                   // Records all transactions
  security_smart_contract_verification: true,   // Verifies contract code
  
  // Transaction Limits
  daily_limit_wei: 1000000000000000000,         // 1 ETH in wei
  transaction_limit_wei: 100000000000000000,    // 0.1 ETH in wei
  
  // Metadata
  created_at: datetime(),                       // Creation timestamp
  last_rotation: datetime(),                    // Last key rotation
  status: "active"                              // Current status
})
RETURN w;
```

Key aspects of Wallet nodes:
- The wallet_id is an internal identifier
- blockchain_address is the public address on the blockchain
- Security features protect cryptocurrency assets
- Transaction limits prevent catastrophic loss

## Working with Existing Nodes

### Finding a Node by Name

To find a node with a specific name:

```cypher
// Find a knowledge graph named "economics_kg"
MATCH (kg:KnowledgeGraph {name: "economics_kg"})
RETURN kg;
```

### Updating Node Properties

To change properties on an existing node:

```cypher
// Update the description of an agent
MATCH (a:Agent {name: "economic_forecasting_agent"})
SET a.description = "Updated forecasting model with improved accuracy",
    a.updated_at = datetime(),
    a.version = "1.1"
RETURN a;
```

### Deleting a Node

To remove a node (only if it has no dependencies):

```cypher
// Delete an agent that is no longer needed
MATCH (a:Agent {name: "old_forecasting_agent"})
WHERE NOT EXISTS((a)<-[:DEPENDS_ON]-())  // Ensure nothing depends on this
DELETE a;
```

## Best Practices for Node Creation

### 1. Naming Conventions

- Use `snake_case` for all property names (e.g., `resource_limit_memory_mb`)
- Keep node names lowercase with underscores
- Use descriptive names that reflect purpose
- Be consistent with naming patterns

### 2. Security Considerations

- Always enable security validation for all nodes
- Set appropriate resource limits
- Configure input validation
- Enable audit logging for sensitive operations

### 3. Performance Tips

- Add only the properties you need
- Set reasonable resource limits
- Create indexes for frequently queried properties
- Monitor performance regularly

### 4. Maintenance Best Practices

- Document all custom node types
- Perform regular security audits
- Clean up unused nodes
- Keep metadata (like version and updated_at) current

## Error Handling and Validation

Always check for existing nodes before creating new ones:

```cypher
// Check if a node exists before creating it
MATCH (a:Agent {name: "economic_forecasting_agent"})
WITH count(a) as exists
RETURN CASE 
    WHEN exists > 0 THEN "Agent already exists"
    ELSE "Agent does not exist"
END as result;
```

For more complex validation, you can create a procedure that:
1. Checks if a node with the name already exists
2. Validates all required properties
3. Creates the node only if validation passes

## Connecting Nodes

After creating nodes, you'll want to connect them. For example, to add an agent to a knowledge graph:

```cypher
// Connect an agent to a knowledge graph
MATCH (kg:KnowledgeGraph {name: "economics_kg"})
MATCH (a:Agent {name: "economic_forecasting_agent"})
CREATE (kg)-[r:CONTAINS {
    created_at: datetime(),
    permission_level: "write"
}]->(a)
RETURN type(r), kg.name, a.name;
```

To learn more about relationships, see the [Relationship Creation Guide](./relationships.md).

## Next Steps

Now that you understand how to create nodes in the SafeAI platform, you might want to:

1. Learn about [creating relationships](./relationships.md) between nodes
2. Explore [common query patterns](./queries.md) for working with your data
3. Understand [security configuration](../security/configuration.md) for your nodes

## Troubleshooting

### Common Issues

1. **"Already exists" errors**: Node names must be unique within their label. Use `MERGE` instead of `CREATE` to avoid duplicates:
   ```cypher
   MERGE (kg:KnowledgeGraph {name: "economics_kg"})
   ON CREATE SET kg.created_at = datetime()
   RETURN kg;
   ```

2. **Missing required properties**: Always include all required properties when creating nodes
3. **Type conversion errors**: Ensure property values match their expected types (strings, numbers, booleans, etc.)
4. **Security validation failures**: Check that property values meet security requirements

### Getting Help

For more assistance:
- Review the [Neo4j Cypher documentation](https://neo4j.com/docs/cypher-manual/current/)
- Check the [SafeAI community forums](https://github.com/FortressAI/safeAI/discussions)
- Use the SafeAI Management Console's built-in help 