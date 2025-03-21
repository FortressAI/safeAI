# Cypher Query Guide for SafeAI: A Beginner's Introduction

## What is Cypher?

Cypher is the query language used by Neo4j, the graph database that powers the SafeAI platform. Think of Cypher as the "SQL for graph databases" - it allows you to create, read, update, and delete data in the database.

### Why Cypher?

Unlike traditional databases that store data in tables, Neo4j organizes information as a network of connected entities (nodes) and their relationships. Cypher is specifically designed to work with this structure, making it perfect for:

- Navigating complex connections between AI agents, knowledge graphs, and other components
- Finding patterns in your data that would be difficult to express in SQL
- Creating and managing intelligent agents and their capabilities
- Analyzing the performance and security of your SafeAI ecosystem

## Getting Started with Cypher

If you're new to Cypher, here are the basics:

1. **Nodes** are represented with parentheses: `(node)`
2. **Relationships** are represented with arrows: `-[relationship]->` 
3. **Properties** are represented like JSON: `{name: "value"}`
4. **Variables** let you reference entities: `(kg:KnowledgeGraph {name: "Ethics_KG"})`

In the examples above:
- `kg` is a variable name
- `:KnowledgeGraph` is a label (like a table name in SQL)
- `{name: "Ethics_KG"}` is a property with a value

### Accessing the Cypher Interface

1. Open the Neo4j Browser by navigating to http://localhost:7474 in your web browser
2. Log in with your credentials (default is username: neo4j, password: testpassword)
3. Enter Cypher queries in the command line at the top of the interface
4. Click the "Play" button or press Ctrl+Enter to execute the query

## Knowledge Graph Exploration Queries

Understanding the structure and content of your Knowledge Graphs is essential for working with SafeAI. Here are queries to help you explore them.

### Getting a Knowledge Graph Overview

This query gives you a high-level summary of a specific Knowledge Graph:

```cypher
// Find a knowledge graph by name and count its components
MATCH (kg:KnowledgeGraph {name: $kg_name})
OPTIONAL MATCH (kg)-[:CONTAINS]->(component)
RETURN kg,
       count(DISTINCT component) as component_count,
       collect(DISTINCT labels(component)) as component_types;
```

**What this does:**
- `MATCH (kg:KnowledgeGraph {name: $kg_name})` finds a knowledge graph with the specified name
- `OPTIONAL MATCH (kg)-[:CONTAINS]->(component)` finds all components contained in the knowledge graph
- `count(DISTINCT component)` counts the unique components
- `collect(DISTINCT labels(component))` gathers all the different types of components

**Example usage:**
```cypher
// Replace "Ethics_KG" with your knowledge graph name
MATCH (kg:KnowledgeGraph {name: "Ethics_KG"})
OPTIONAL MATCH (kg)-[:CONTAINS]->(component)
RETURN kg,
       count(DISTINCT component) as component_count,
       collect(DISTINCT labels(component)) as component_types;
```

### Listing All Components in a Knowledge Graph

To see all the individual components within a Knowledge Graph:

```cypher
// List all components in a knowledge graph with their details
MATCH (kg:KnowledgeGraph {name: $kg_name})-[:CONTAINS]->(component)
RETURN labels(component) as type,
       component.name as name,
       component.status as status,
       component.created_at as created;
```

**What this does:**
- Finds the knowledge graph with the specified name
- Follows all CONTAINS relationships to components
- Returns the type, name, status, and creation date of each component

**Example usage:**
```cypher
// See all components in the Ethics Knowledge Graph
MATCH (kg:KnowledgeGraph {name: "Ethics_KG"})-[:CONTAINS]->(component)
RETURN labels(component) as type,
       component.name as name,
       component.status as status,
       component.created_at as created;
```

### Understanding Resource Usage

To monitor resource usage across your knowledge graph:

```cypher
// Calculate total resource requirements for a knowledge graph
MATCH (kg:KnowledgeGraph {name: $kg_name})-[:CONTAINS]->(component)
WHERE component.resource_limit_memory_mb IS NOT NULL
RETURN sum(component.resource_limit_memory_mb) as total_memory_mb,
       sum(component.resource_limit_cpu_ms) as total_cpu_ms,
       count(component) as component_count;
```

**What this does:**
- Finds components with memory resource limits defined
- Calculates the total memory and CPU requirements
- Counts the number of components with resource limits

**Example usage:**
```cypher
// Check resource usage for CyberSecurity Knowledge Graph
MATCH (kg:KnowledgeGraph {name: "CyberSecurity_KG"})-[:CONTAINS]->(component)
WHERE component.resource_limit_memory_mb IS NOT NULL
RETURN sum(component.resource_limit_memory_mb) as total_memory_mb,
       sum(component.resource_limit_cpu_ms) as total_cpu_ms,
       count(component) as component_count;
```

**Results explained:**
- `total_memory_mb`: The total memory required by all components (in megabytes)
- `total_cpu_ms`: The total CPU time required (in milliseconds)
- `component_count`: Number of components included in the calculation

## Working with Agents

Agents are the workhorses of the SafeAI platform. These queries help you manage and understand them.

### Finding Available Agents

To see all active agents in the system:

```cypher
// List all active agents and their properties
MATCH (a:Agent)
WHERE a.status = 'active'
RETURN a.name as name,
       a.category as category,
       a.agent_type as type,
       a.effectiveness_threshold as effectiveness;
```

**What this does:**
- Finds all nodes with the Agent label
- Filters for only active agents
- Returns key properties for each agent

**Example usage:**
```cypher
// Find all active agents
MATCH (a:Agent)
WHERE a.status = 'active'
RETURN a.name as name,
       a.category as category,
       a.agent_type as type,
       a.effectiveness_threshold as effectiveness;
```

### Checking Agent Performance

This query helps you evaluate how well an agent is performing:

```cypher
// Calculate success rate for a specific agent
MATCH (a:Agent {name: $agent_name})
WHERE a.usage_count > 0
RETURN a.name as name,
       a.usage_count as total_uses,
       a.success_count as successes,
       toFloat(a.success_count) / a.usage_count as success_rate;
```

**What this does:**
- Finds an agent with the specified name
- Checks if it has been used at least once
- Calculates the success rate by dividing successful uses by total uses

**Example usage:**
```cypher
// Check performance of the vulnerability detection agent
MATCH (a:Agent {name: "vulnerability_detection_agent"})
WHERE a.usage_count > 0
RETURN a.name as name,
       a.usage_count as total_uses,
       a.success_count as successes,
       toFloat(a.success_count) / a.usage_count as success_rate;
```

### Understanding Agent Dependencies

To see what other components an agent depends on:

```cypher
// Find all dependencies for a specific agent
MATCH (a:Agent {name: $agent_name})-[r:DEPENDS_ON]->(dep)
RETURN dep.name as dependency,
       r.dependency_type as type,
       r.min_version as min_version,
       r.max_version as max_version;
```

**What this does:**
- Finds an agent with the specified name
- Follows all DEPENDS_ON relationships to other components
- Returns information about each dependency and version requirements

**Example usage:**
```cypher
// What does the ethical_analysis_agent depend on?
MATCH (a:Agent {name: "ethical_analysis_agent"})-[r:DEPENDS_ON]->(dep)
RETURN dep.name as dependency,
       r.dependency_type as type,
       r.min_version as min_version,
       r.max_version as max_version;
```

## Security Monitoring Queries

SafeAI prioritizes security. These queries help you ensure your system remains secure.

### Finding Nodes Without Security Validation

This query helps identify potential security risks:

```cypher
// Find nodes that may have security gaps
MATCH (n)
WHERE n.security_validation_enabled IS NULL
   OR n.security_validation_enabled = false
RETURN labels(n) as type,
       n.name as name,
       n.created_at as created;
```

**What this does:**
- Finds any node where security validation is not enabled
- Returns the node type, name, and creation date

**Example usage:**
```cypher
// Find security vulnerabilities in the system
MATCH (n)
WHERE n.security_validation_enabled IS NULL
   OR n.security_validation_enabled = false
RETURN labels(n) as type,
       n.name as name,
       n.created_at as created;
```

### Checking Security Audit Status

To review when security audits were last performed:

```cypher
// Find relationships with security auditing enabled and their last audit date
MATCH (n)-[r]->(m)
WHERE r.security_audit_enabled = true
RETURN type(r) as relationship,
       n.name as source,
       m.name as target,
       r.last_audit as last_audit,
       r.audit_interval_hours as interval;
```

**What this does:**
- Finds relationships with security auditing enabled
- Returns information about each relationship and when it was last audited

**Example usage:**
```cypher
// Check security audit status across the system
MATCH (n)-[r]->(m)
WHERE r.security_audit_enabled = true
RETURN type(r) as relationship,
       n.name as source,
       m.name as target,
       r.last_audit as last_audit,
       r.audit_interval_hours as interval;
```

## Performance Optimization Queries

These queries help you identify and address performance bottlenecks.

### Finding High Memory Usage Components

To identify components that might be using too much memory:

```cypher
// Find components with high memory requirements
MATCH (n)
WHERE n.resource_limit_memory_mb > 512
RETURN labels(n) as type,
       n.name as name,
       n.resource_limit_memory_mb as memory_limit;
```

**What this does:**
- Finds nodes with memory limits above 512 MB
- Returns the node type, name, and memory limit

**Example usage:**
```cypher
// Find memory-intensive components
MATCH (n)
WHERE n.resource_limit_memory_mb > 512
RETURN labels(n) as type,
       n.name as name,
       n.resource_limit_memory_mb as memory_limit;
```

### Identifying Rate-Limited Components

Rate limiting protects your system from overload. This query helps you check rate limit settings:

```cypher
// Find components with rate limiting
MATCH (n)
WHERE n.rate_limit_rpm IS NOT NULL
RETURN labels(n) as type,
       n.name as name,
       n.rate_limit_rpm as rpm,
       n.rate_limit_burst as burst;
```

**What this does:**
- Finds nodes with rate limits defined
- Returns the node type, name, and rate limit details

**Example usage:**
```cypher
// Check rate limiting across the platform
MATCH (n)
WHERE n.rate_limit_rpm IS NOT NULL
RETURN labels(n) as type,
       n.name as name,
       n.rate_limit_rpm as rpm,
       n.rate_limit_burst as burst;
```

## Using Parameters in Queries

In the examples above, you'll notice parameters like `$kg_name` or `$agent_name`. These are placeholders that you replace with actual values when running the query.

### In Neo4j Browser:

You can set parameters in the Neo4j Browser using the `:param` command:

```cypher
:param kg_name => "Ethics_KG"
```

Then run your query:

```cypher
MATCH (kg:KnowledgeGraph {name: $kg_name})
RETURN kg;
```

### In Application Code:

When using the Neo4j drivers in your code, you pass parameters as an object:

```javascript
// JavaScript example
session.run(
  'MATCH (kg:KnowledgeGraph {name: $kg_name}) RETURN kg',
  { kg_name: 'Ethics_KG' }
);
```

## Best Practices for SafeAI Cypher Queries

### 1. Query Performance

- **Use Specific Labels**: Always specify node labels (`Agent`, `KnowledgeGraph`, etc.) to improve performance
- **Filter Early**: Apply WHERE clauses as early as possible in your queries
- **Use OPTIONAL MATCH**: When relationship existence is uncertain, use OPTIONAL MATCH to prevent query failure
- **Limit Results**: For large result sets, use LIMIT to return a manageable number of records

### 2. Security Best Practices

- **Use Parameters**: Always use parameterized queries to prevent injection attacks
- **Check Permissions**: Validate that the user has appropriate permissions before running sensitive queries
- **Audit Sensitive Operations**: Log all operations that modify security settings or sensitive data
- **Validate Input**: Check that input parameters meet expected format and constraints

### 3. Learning Resources

- [Neo4j Cypher Manual](https://neo4j.com/docs/cypher-manual/current/)
- [Cypher Query Builder](https://neo4j.com/developer/cypher-query-builder/)
- [SafeAI Cypher Examples](../cypher/)

## Related Documents

- [Creating Nodes](./nodes.md) - Detailed guide for creating different types of nodes
- [Creating Relationships](./relationships.md) - How to establish connections between nodes
- [Security Configuration](../security/configuration.md) - Security settings and best practices 