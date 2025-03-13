# Query Patterns Reference

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