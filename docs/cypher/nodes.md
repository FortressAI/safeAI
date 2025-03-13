# Node Creation Reference

## Overview

This guide provides all essential Cypher queries for creating and managing nodes in the SafeAI Platform. Each query includes:
- Required parameters
- Security constraints
- Usage examples
- Best practices

## Knowledge Graph Nodes

### 1. Root Knowledge Graph Node

```cypher
// Create a new Knowledge Graph
CREATE (kg:KnowledgeGraph {
  name: $name,                    // Required: Unique identifier
  domain: $domain,                // Required: Knowledge domain
  description: $description,      // Required: Detailed description
  
  // Security Configuration
  input_validation_enabled: true,
  input_max_length: 10000,
  input_allowed_chars: "^[a-zA-Z0-9\\s\\+\\-\\*\\/\\(\\)\\[\\]\\{\\}\\^\\=\\,\\.\\;]*$",
  input_timeout_ms: 30000,
  
  // Resource Limits
  resource_limit_memory_mb: 1024,
  resource_limit_cpu_ms: 60000,
  resource_limit_disk_mb: 100,
  rate_limit_requests_per_min: 60,
  rate_limit_burst: 10,
  
  // Metadata
  created_at: datetime(),
  updated_at: datetime(),
  version: "1.0"
})
RETURN kg;
```

Parameters:
- `name`: String, lowercase with underscores (e.g., "economics_kg")
- `domain`: String, lowercase (e.g., "economics")
- `description`: String, max 1000 chars

### 2. Domain Engine Node

```cypher
// Create a domain-specific processing engine
CREATE (e:Engine {
  name: $name,                    // Required: Unique identifier
  domain: $domain,                // Required: Matches KG domain
  engine_type: $type,            // Required: "processing"|"analysis"|"validation"
  
  // Configuration
  analysis_types: $types,        // Array of supported analysis types
  data_sources: $sources,        // Array of data source types
  
  // Performance Settings
  accuracy_threshold: 0.99,
  response_time_ms: 1000,
  batch_size: 100,
  
  // Security
  security_validation_enabled: true,
  security_audit_enabled: true,
  
  // Metadata
  created_at: datetime(),
  status: "active"
})
RETURN e;
```

Parameters:
- `name`: String, lowercase with underscores
- `domain`: String, must match parent KG
- `type`: String, engine type
- `types`: Array of strings
- `sources`: Array of strings

### 3. Agent Node

```cypher
// Create an agent node
CREATE (a:Agent {
  name: $name,                    // Required: Unique identifier
  category: $category,            // Required: Agent category
  agent_type: $type,             // Required: "script"|"llm"
  description: $description,      // Required: Detailed description
  
  // Performance Metrics
  effectiveness_threshold: 0.95,
  usage_count: 0,
  success_count: 0,
  
  // Security Features
  security_input_validation: true,
  security_resource_monitoring: true,
  security_output_validation: true,
  
  // Resource Management
  memory_limit_mb: 512,
  cpu_limit_ms: 30000,
  rate_limit_rpm: 30,
  
  // Metadata
  created_at: datetime(),
  status: "active",
  version: "1.0"
})
RETURN a;
```

Parameters:
- `name`: String, lowercase with underscores
- `category`: String, agent category
- `type`: String, agent type
- `description`: String, max 1000 chars

### 4. Wallet Node

```cypher
// Create a wallet node for transaction management
CREATE (w:Wallet {
  wallet_id: $id,                // Required: Unique identifier
  blockchain_address: $address,   // Required: Blockchain address
  
  // Security Features
  security_transaction_validation: true,
  security_key_rotation_hours: 24,
  security_audit_trail: true,
  security_smart_contract_verification: true,
  
  // Transaction Limits
  daily_limit_wei: 1000000000000000000,  // 1 ETH
  transaction_limit_wei: 100000000000000000,  // 0.1 ETH
  
  // Metadata
  created_at: datetime(),
  last_rotation: datetime(),
  status: "active"
})
RETURN w;
```

Parameters:
- `id`: String, unique wallet ID
- `address`: String, valid blockchain address

## Best Practices

1. **Naming Conventions**
   - Use snake_case for all node properties
   - Keep names lowercase and descriptive
   - Use consistent prefixes for related properties

2. **Security**
   - Always set input validation
   - Configure resource limits
   - Enable audit logging
   - Set appropriate permissions

3. **Performance**
   - Index key properties
   - Set reasonable rate limits
   - Monitor resource usage
   - Regular maintenance

4. **Maintenance**
   - Regular security updates
   - Performance monitoring
   - Resource optimization
   - Audit log review

## Common Queries

### Find Node by Name
```cypher
MATCH (n {name: $name})
RETURN n;
```

### Update Node Properties
```cypher
MATCH (n {name: $name})
SET n += $properties,
    n.updated_at = datetime()
RETURN n;
```

### Delete Node
```cypher
MATCH (n {name: $name})
WHERE NOT EXISTS((n)<-[:DEPENDS_ON]-())
DELETE n;
```

## Error Handling

Always validate node properties before creation:

```cypher
MATCH (n {name: $name})
WITH count(n) as exists
WHERE exists > 0
RETURN 'Node with name ' + $name + ' already exists' as error;
```

## See Also

- [Relationship Creation](./relationships.md)
- [Query Patterns](./queries.md)
- [Security Configuration](../security/configuration.md) 