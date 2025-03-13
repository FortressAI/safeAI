# Relationship Creation Reference

## Overview

This guide details all relationship types in the SafeAI Platform and provides Cypher queries for creating and managing them. Each relationship type includes:
- Required properties
- Security constraints
- Usage examples
- Best practices

## Core Relationships

### 1. CONTAINS Relationship

Links a Knowledge Graph to its components (Engines, Agents, etc.)

```cypher
MATCH (kg:KnowledgeGraph {name: $kg_name})
MATCH (component {name: $component_name})
CREATE (kg)-[r:CONTAINS {
    created_at: datetime(),
    permission_level: $permission,     // Required: "read"|"write"|"admin"
    audit_enabled: true,
    audit_interval_hours: 24
}]->(component)
RETURN r;
```

Parameters:
- `kg_name`: String, Knowledge Graph name
- `component_name`: String, component name
- `permission`: String, permission level

### 2. DEPENDS_ON Relationship

Establishes dependencies between nodes

```cypher
MATCH (source {name: $source_name})
MATCH (target {name: $target_name})
CREATE (source)-[r:DEPENDS_ON {
    created_at: datetime(),
    dependency_type: $type,           // Required: "required"|"optional"
    min_version: $min_version,        // Required: Semantic version
    max_version: $max_version,        // Required: Semantic version
    
    // Security
    security_validation_enabled: true,
    security_version_check: true,
    
    // Performance
    timeout_ms: 5000,
    retry_count: 3
}]->(target)
RETURN r;
```

Parameters:
- `source_name`: String, source node name
- `target_name`: String, target node name
- `type`: String, dependency type
- `min_version`: String, minimum version
- `max_version`: String, maximum version

### 3. INTERACTS_WITH Relationship

Defines interaction patterns between agents

```cypher
MATCH (a1:Agent {name: $agent1_name})
MATCH (a2:Agent {name: $agent2_name})
CREATE (a1)-[r:INTERACTS_WITH {
    created_at: datetime(),
    interaction_type: $type,          // Required: "sync"|"async"
    protocol: $protocol,              // Required: "request-response"|"event"
    
    // Security
    security_validation_enabled: true,
    security_audit_enabled: true,
    
    // Rate Limiting
    rate_limit_rpm: 60,
    burst_limit: 10,
    
    // Performance
    timeout_ms: 5000,
    retry_count: 3,
    backoff_ms: 1000
}]->(a2)
RETURN r;
```

Parameters:
- `agent1_name`: String, source agent name
- `agent2_name`: String, target agent name
- `type`: String, interaction type
- `protocol`: String, interaction protocol

### 4. MANAGES Relationship

Establishes management hierarchy between nodes

```cypher
MATCH (manager {name: $manager_name})
MATCH (managed {name: $managed_name})
CREATE (manager)-[r:MANAGES {
    created_at: datetime(),
    management_type: $type,           // Required: "direct"|"delegated"
    permission_level: $permission,     // Required: "read"|"write"|"admin"
    
    // Security
    security_audit_enabled: true,
    security_validation_enabled: true,
    
    // Audit
    audit_interval_hours: 24,
    last_audit: datetime()
}]->(managed)
RETURN r;
```

Parameters:
- `manager_name`: String, manager node name
- `managed_name`: String, managed node name
- `type`: String, management type
- `permission`: String, permission level

## Best Practices

1. **Relationship Properties**
   - Always set created_at timestamp
   - Include security validation flags
   - Set appropriate permissions
   - Enable audit logging where needed

2. **Security**
   - Validate node existence before creating relationships
   - Check permission levels
   - Enable security validation
   - Set up audit trails

3. **Performance**
   - Set reasonable timeouts
   - Configure retry policies
   - Enable rate limiting
   - Monitor relationship usage

4. **Maintenance**
   - Regular audit reviews
   - Clean up orphaned relationships
   - Update security settings
   - Monitor performance metrics

## Common Queries

### Find All Relationships Between Nodes
```cypher
MATCH (source {name: $source_name})-[r]->(target {name: $target_name})
RETURN type(r), r;
```

### Update Relationship Properties
```cypher
MATCH (source {name: $source_name})-[r:RELATIONSHIP_TYPE]->(target {name: $target_name})
SET r += $properties,
    r.updated_at = datetime()
RETURN r;
```

### Delete Relationship
```cypher
MATCH (source {name: $source_name})-[r:RELATIONSHIP_TYPE]->(target {name: $target_name})
DELETE r;
```

## Error Handling

Always validate nodes before creating relationships:

```cypher
MATCH (source {name: $source_name})
MATCH (target {name: $target_name})
WITH count(source) as source_exists, count(target) as target_exists
WHERE source_exists = 0 OR target_exists = 0
RETURN CASE 
    WHEN source_exists = 0 THEN 'Source node not found'
    WHEN target_exists = 0 THEN 'Target node not found'
    ELSE 'Unknown error'
END as error;
```

## See Also

- [Node Creation](./nodes.md)
- [Query Patterns](./queries.md)
- [Security Configuration](../security/configuration.md) 