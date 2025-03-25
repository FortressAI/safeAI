# Cypher Queries: A Beginner's Guide to SafeAI

## Introduction

Cypher is the query language used to interact with SafeAI's knowledge graphs. This guide will help you understand how to use Cypher effectively, even if you're new to databases or programming.

## What is Cypher?

Cypher is a powerful query language designed specifically for graph databases. Think of it as a way to:
- Find information in your knowledge graphs
- Create new connections between data
- Update existing information
- Delete unwanted data
- Manage relationships between different pieces of information

## Basic Concepts

### Nodes
Nodes are the basic units of information in a graph database. They can represent:
- AI agents
- Users
- Concepts
- Documents
- Any other entity in your system

Example of a node:
```cypher
CREATE (agent:Agent {
    name: "Math Tutor",
    type: "LLM",
    capabilities: ["problem_solving", "explanation"]
})
```

### Relationships
Relationships connect nodes and show how they're related. They can have:
- Types (like "BELONGS_TO" or "KNOWS")
- Properties (like "since" or "confidence")
- Directions (one-way or bidirectional)

Example of a relationship:
```cypher
CREATE (agent:Agent)-[:BELONGS_TO {
    since: datetime(),
    role: "tutor"
}]->(user:User)
```

### Properties
Properties are key-value pairs that store information about nodes or relationships.

Example of properties:
```cypher
CREATE (concept:Concept {
    name: "Algebra",
    difficulty: "intermediate",
    prerequisites: ["basic_math"],
    description: "Study of mathematical symbols"
})
```

## Common Queries

### 1. Finding Information

#### Basic Search
```cypher
// Find all agents
MATCH (agent:Agent)
RETURN agent.name, agent.type

// Find specific agent
MATCH (agent:Agent {name: "Math Tutor"})
RETURN agent
```

#### Pattern Matching
```cypher
// Find agents belonging to a user
MATCH (agent:Agent)-[:BELONGS_TO]->(user:User {name: "John"})
RETURN agent.name, user.name

// Find connected concepts
MATCH (concept1:Concept)-[:RELATES_TO]->(concept2:Concept)
RETURN concept1.name, concept2.name
```

### 2. Creating New Data

#### Creating Nodes
```cypher
// Create a new agent
CREATE (agent:Agent {
    name: "Science Tutor",
    type: "LLM",
    capabilities: ["physics", "chemistry"]
})

// Create multiple nodes
CREATE 
    (math:Concept {name: "Mathematics"}),
    (physics:Concept {name: "Physics"}),
    (chemistry:Concept {name: "Chemistry"})
```

#### Creating Relationships
```cypher
// Connect concepts
MATCH 
    (math:Concept {name: "Mathematics"}),
    (physics:Concept {name: "Physics"})
CREATE (math)-[:PREREQUISITE_FOR]->(physics)

// Create bidirectional relationship
CREATE (a:Agent)-[:KNOWS]-(b:Agent)
```

### 3. Updating Data

#### Modifying Properties
```cypher
// Update agent capabilities
MATCH (agent:Agent {name: "Math Tutor"})
SET agent.capabilities = agent.capabilities + ["calculus"]
RETURN agent

// Update relationship properties
MATCH (agent:Agent)-[r:BELONGS_TO]->(user:User)
SET r.role = "primary_tutor"
RETURN agent.name, user.name, r.role
```

#### Adding Properties
```cypher
// Add new property to node
MATCH (concept:Concept {name: "Algebra"})
SET concept.difficulty_level = "advanced"
RETURN concept

// Add property to relationship
MATCH (agent:Agent)-[r:TEACHES]->(subject:Subject)
SET r.effectiveness = 0.95
RETURN agent.name, subject.name, r.effectiveness
```

### 4. Deleting Data

#### Removing Nodes
```cypher
// Delete specific node
MATCH (agent:Agent {name: "Old Tutor"})
DELETE agent

// Delete connected nodes
MATCH (user:User {name: "John"})
OPTIONAL MATCH (user)-[r]-()
DELETE r, user
```

#### Removing Relationships
```cypher
// Delete specific relationship
MATCH (agent:Agent)-[r:TEACHES]->(subject:Subject)
WHERE agent.name = "Math Tutor"
DELETE r

// Delete all relationships of a type
MATCH ()-[r:OLD_RELATIONSHIP]-()
DELETE r
```

## Advanced Queries

### 1. Path Finding

```cypher
// Find shortest path between concepts
MATCH path = shortestPath(
    (start:Concept {name: "Algebra"})-[:RELATES_TO*]-(end:Concept {name: "Calculus"})
)
RETURN path

// Find all paths between nodes
MATCH path = (start:Agent)-[:KNOWS*1..3]-(end:Agent)
WHERE start.name = "Math Tutor"
RETURN path
```

### 2. Aggregation

```cypher
// Count agents by type
MATCH (agent:Agent)
RETURN agent.type, count(*) as count
ORDER BY count DESC

// Average effectiveness by subject
MATCH (agent:Agent)-[r:TEACHES]->(subject:Subject)
RETURN subject.name, avg(r.effectiveness) as avg_effectiveness
```

### 3. Conditional Queries

```cypher
// Find agents with specific capabilities
MATCH (agent:Agent)
WHERE "calculus" IN agent.capabilities
RETURN agent.name, agent.type

// Complex conditions
MATCH (agent:Agent)-[r:TEACHES]->(subject:Subject)
WHERE r.effectiveness > 0.8 AND agent.type = "LLM"
RETURN agent.name, subject.name, r.effectiveness
```

## Best Practices

1. **Use Clear Names**
   - Use descriptive names for nodes and relationships
   - Follow consistent naming conventions
   - Use meaningful property names

2. **Optimize Queries**
   - Use indexes for frequently queried properties
   - Limit the depth of path queries
   - Use WHERE clauses to filter early

3. **Security Considerations**
   - Validate input data
   - Use parameterized queries
   - Implement proper access controls

4. **Performance Tips**
   - Use appropriate indexes
   - Limit result sets
   - Avoid unnecessary relationships

## Common Errors and Solutions

1. **Syntax Errors**
   ```cypher
   // Incorrect
   MATCH (n) WHERE n.name = "Test"
   
   // Correct
   MATCH (n)
   WHERE n.name = "Test"
   ```

2. **Missing Nodes**
   ```cypher
   // Incorrect
   CREATE (a)-[:RELATES_TO]->(b)
   
   // Correct
   CREATE (a:Node {name: "A"})-[:RELATES_TO]->(b:Node {name: "B"})
   ```

3. **Relationship Direction**
   ```cypher
   // Incorrect
   MATCH (a)-[:KNOWS]-(b)
   
   // Correct (if direction matters)
   MATCH (a)-[:KNOWS]->(b)
   ```

## Resources for Learning More

1. **Documentation**
   - SafeAI Platform Guide
   - Neo4j Documentation
   - Cypher Reference Manual

2. **Tools**
   - SafeAI Query Editor
   - Neo4j Browser
   - Query Profiler

3. **Community**
   - SafeAI Forums
   - Neo4j Community
   - Stack Overflow

## Practice Exercises

1. **Basic Queries**
   ```cypher
   // Exercise 1: Create a new user and connect them to an agent
   CREATE (user:User {name: "Alice"})
   MATCH (agent:Agent {name: "Math Tutor"})
   CREATE (user)-[:BELONGS_TO]->(agent)
   
   // Exercise 2: Find all agents teaching mathematics
   MATCH (agent:Agent)-[:TEACHES]->(subject:Subject {name: "Mathematics"})
   RETURN agent.name, agent.type
   ```

2. **Intermediate Queries**
   ```cypher
   // Exercise 3: Find the most effective tutors
   MATCH (agent:Agent)-[r:TEACHES]->(subject:Subject)
   WITH agent, avg(r.effectiveness) as avg_effectiveness
   WHERE avg_effectiveness > 0.9
   RETURN agent.name, avg_effectiveness
   
   // Exercise 4: Find prerequisite chains
   MATCH path = (start:Concept)-[:PREREQUISITE_FOR*]->(end:Concept)
   WHERE start.name = "Basic Math"
   RETURN path
   ```

3. **Advanced Queries**
   ```cypher
   // Exercise 5: Find circular dependencies
   MATCH path = (start:Concept)-[:PREREQUISITE_FOR*]->(end:Concept)
   WHERE start = end
   RETURN path
   
   // Exercise 6: Analyze learning paths
   MATCH (user:User {name: "Alice"})-[:BELONGS_TO]->(agent:Agent)
   MATCH path = (agent)-[:TEACHES*1..3]->(subject:Subject)
   RETURN path
   ```

## Tips for Writing Efficient Queries

1. **Use Indexes**
   ```cypher
   // Create index for frequently queried property
   CREATE INDEX ON :Agent(name)
   
   // Use index in query
   MATCH (agent:Agent)
   WHERE agent.name STARTS WITH "Math"
   RETURN agent
   ```

2. **Limit Results**
   ```cypher
   // Limit number of results
   MATCH (agent:Agent)
   RETURN agent.name
   LIMIT 10
   
   // Skip results
   MATCH (agent:Agent)
   RETURN agent.name
   SKIP 20 LIMIT 10
   ```

3. **Use WITH for Intermediate Results**
   ```cypher
   // Process intermediate results
   MATCH (agent:Agent)-[r:TEACHES]->(subject:Subject)
   WITH agent, count(*) as subject_count
   WHERE subject_count > 2
   RETURN agent.name, subject_count
   ```

## Security Best Practices

1. **Input Validation**
   ```cypher
   // Use parameters instead of string concatenation
   MATCH (agent:Agent)
   WHERE agent.name = $name
   RETURN agent
   ```

2. **Access Control**
   ```cypher
   // Check user permissions
   MATCH (user:User {name: $username})-[:HAS_PERMISSION]->(permission:Permission)
   WHERE permission.name = "READ_AGENTS"
   RETURN count(*) > 0 as has_access
   ```

3. **Audit Logging**
   ```cypher
   // Log query execution
   CREATE (log:AuditLog {
    timestamp: datetime(),
    user: $username,
    query: $query,
    result_count: $count
   })
   ```

## Maintenance and Optimization

1. **Regular Maintenance**
   ```cypher
   // Remove orphaned nodes
   MATCH (n)
   WHERE NOT (n)-[]-()
   DELETE n
   
   // Clean up old relationships
   MATCH ()-[r:OLD_RELATIONSHIP]-()
   DELETE r
   ```

2. **Performance Optimization**
   ```cypher
   // Create appropriate indexes
   CREATE INDEX ON :Agent(type)
   CREATE INDEX ON :Subject(difficulty)
   
   // Remove unused indexes
   DROP INDEX ON :Agent(unused_property)
   ```

3. **Data Validation**
   ```cypher
   // Check for invalid data
   MATCH (agent:Agent)
   WHERE agent.effectiveness < 0 OR agent.effectiveness > 1
   RETURN agent.name, agent.effectiveness
   ```

## Query Patterns Reference

## Overview

This guide provides essential Cypher query patterns for working with the SafeAI Platform. Each pattern includes:
- Use case description
- Query template
- Parameters
- Example usage
- Performance considerations

## Knowledge Graph Queries

### 1. Knowledge Graph Analysis

#### Get Knowledge Graph Overview
```cypher
MATCH (kg:KnowledgeGraph {name: $kg_name})
OPTIONAL MATCH (kg)-[:CONTAINS]->(component)
RETURN kg,
       count(DISTINCT component) as component_count,
       collect(DISTINCT labels(component)) as component_types;
```

#### List All Components
```cypher
MATCH (kg:KnowledgeGraph {name: $kg_name})-[:CONTAINS]->(component)
RETURN labels(component) as type,
       component.name as name,
       component.status as status,
       component.created_at as created;
```

#### Find Resource Usage
```cypher
MATCH (kg:KnowledgeGraph {name: $kg_name})-[:CONTAINS]->(component)
WHERE component.resource_limit_memory_mb IS NOT NULL
RETURN sum(component.resource_limit_memory_mb) as total_memory_mb,
       sum(component.resource_limit_cpu_ms) as total_cpu_ms,
       count(component) as component_count;
```

## Agent Queries

### 1. Agent Management

#### Find Available Agents
```cypher
MATCH (a:Agent)
WHERE a.status = 'active'
RETURN a.name as name,
       a.category as category,
       a.agent_type as type,
       a.effectiveness_threshold as effectiveness;
```

#### Get Agent Performance Metrics
```cypher
MATCH (a:Agent {name: $agent_name})
RETURN a.name as name,
       a.usage_count as total_uses,
       a.success_count as successes,
       toFloat(a.success_count) / a.usage_count as success_rate
WHERE a.usage_count > 0;
```

#### Find Agent Dependencies
```cypher
MATCH (a:Agent {name: $agent_name})-[r:DEPENDS_ON]->(dep)
RETURN dep.name as dependency,
       r.dependency_type as type,
       r.min_version as min_version,
       r.max_version as max_version;
```

### 2. Agent Interactions

#### Get Agent Interaction Network
```cypher
MATCH (a1:Agent)-[r:INTERACTS_WITH]->(a2:Agent)
RETURN a1.name as source,
       a2.name as target,
       r.interaction_type as type,
       r.protocol as protocol;
```

#### Find High-Traffic Interactions
```cypher
MATCH (a1:Agent)-[r:INTERACTS_WITH]->(a2:Agent)
WHERE r.rate_limit_rpm > 30
RETURN a1.name as source,
       a2.name as target,
       r.rate_limit_rpm as rpm,
       r.burst_limit as burst;
```

## Security Queries

### 1. Security Auditing

#### Find Nodes Without Security Validation
```cypher
MATCH (n)
WHERE n.security_validation_enabled IS NULL
   OR n.security_validation_enabled = false
RETURN labels(n) as type,
       n.name as name,
       n.created_at as created;
```

#### Get Security Audit Status
```cypher
MATCH (n)-[r]->(m)
WHERE r.security_audit_enabled = true
RETURN type(r) as relationship,
       n.name as source,
       m.name as target,
       r.last_audit as last_audit,
       r.audit_interval_hours as interval;
```

### 2. Permission Management

#### List Node Permissions
```cypher
MATCH (kg:KnowledgeGraph)-[r:CONTAINS]->(n)
RETURN kg.name as knowledge_graph,
       n.name as node,
       r.permission_level as permission;
```

#### Find Admin Access
```cypher
MATCH (n)-[r]->(m)
WHERE r.permission_level = 'admin'
RETURN type(r) as relationship,
       n.name as source,
       m.name as target;
```

## Performance Queries

### 1. Resource Monitoring

#### Get High Memory Usage
```cypher
MATCH (n)
WHERE n.resource_limit_memory_mb > 512
RETURN labels(n) as type,
       n.name as name,
       n.resource_limit_memory_mb as memory_limit;
```

#### Find Rate Limited Components
```cypher
MATCH (n)
WHERE n.rate_limit_rpm IS NOT NULL
RETURN labels(n) as type,
       n.name as name,
       n.rate_limit_rpm as rpm,
       n.rate_limit_burst as burst;
```

### 2. Performance Analysis

#### Get Slow Components
```cypher
MATCH (n)
WHERE n.timeout_ms > 5000
RETURN labels(n) as type,
       n.name as name,
       n.timeout_ms as timeout;
```

#### Find Retry Patterns
```cypher
MATCH (n)-[r]->(m)
WHERE r.retry_count > 3
RETURN type(r) as relationship,
       n.name as source,
       m.name as target,
       r.retry_count as retries,
       r.backoff_ms as backoff;
```

## Best Practices

1. **Query Performance**
   - Use appropriate indexes
   - Filter early in the query
   - Use OPTIONAL MATCH for nullable paths
   - Limit result sets when possible

2. **Security**
   - Always validate input parameters
   - Check permissions before queries
   - Use parameterized queries
   - Audit sensitive operations

3. **Maintenance**
   - Regular performance monitoring
   - Clean up unused relationships
   - Update metadata timestamps
   - Monitor query patterns

4. **Error Handling**
   - Validate input parameters
   - Handle null cases
   - Use appropriate error messages
   - Implement retry logic

## Common Parameters

- `kg_name`: Knowledge Graph name
- `agent_name`: Agent name
- `component_name`: Component name
- `type`: Type identifier
- `status`: Status value
- `permission`: Permission level

## See Also

- [Node Creation](./nodes.md)
- [Relationship Creation](./relationships.md)
- [Security Configuration](../security/configuration.md) 