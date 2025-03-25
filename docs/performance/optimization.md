# Performance Optimization Guide

## Overview

This guide provides Cypher queries for optimizing and monitoring performance in the SafeAI Platform. Each section includes:
- Index creation
- Query optimization
- Resource monitoring
- Performance tuning

## Index Management

### 1. Core Indexes

#### Create Node Indexes
```cypher
// Index on Knowledge Graph names
CREATE INDEX kg_name IF NOT EXISTS
FOR (kg:KnowledgeGraph)
ON (kg.name);

// Index on Agent names
CREATE INDEX agent_name IF NOT EXISTS
FOR (a:Agent)
ON (a.name);

// Index on Engine names
CREATE INDEX engine_name IF NOT EXISTS
FOR (e:Engine)
ON (e.name);

// Composite index for security status
CREATE INDEX security_status IF NOT EXISTS
FOR (n)
ON (n.security_validation_enabled, n.security_audit_enabled);
```

#### Create Relationship Indexes
```cypher
// Index on relationship creation timestamps
CREATE INDEX rel_timestamp IF NOT EXISTS
FOR ()-[r:CONTAINS|DEPENDS_ON|INTERACTS_WITH|MANAGES]-()
ON (r.created_at);

// Index on permission levels
CREATE INDEX permission_level IF NOT EXISTS
FOR ()-[r:CONTAINS|MANAGES]-()
ON (r.permission_level);
```

### 2. Performance Indexes

#### Create Resource Management Indexes
```cypher
// Index on memory limits
CREATE INDEX memory_limit IF NOT EXISTS
FOR (n)
ON (n.resource_limit_memory_mb);

// Index on rate limits
CREATE INDEX rate_limit IF NOT EXISTS
FOR (n)
ON (n.rate_limit_rpm);
```

## Query Optimization

### 1. Pattern Optimization

#### Use Efficient Path Patterns
```cypher
// Inefficient: Full graph scan
MATCH (n)-[r]->(m)
WHERE type(r) = 'CONTAINS'
RETURN n, r, m;

// Optimized: Use labels and indexes
MATCH (kg:KnowledgeGraph)-[r:CONTAINS]->(component)
RETURN kg.name, type(component), component.name;
```

#### Optimize Relationship Traversal
```cypher
// Inefficient: Multiple pattern matches
MATCH (a1:Agent)-[r1]->(m)
MATCH (a2:Agent)-[r2]->(m)
WHERE a1 <> a2
RETURN a1.name, a2.name, m.name;

// Optimized: Single pattern match
MATCH (m)<-[r1]-(a1:Agent)
MATCH (m)<-[r2]-(a2:Agent)
WHERE id(a1) < id(a2)
RETURN a1.name, a2.name, m.name;
```

### 2. Aggregation Optimization

#### Efficient Counting
```cypher
// Inefficient: Count all relationships
MATCH (n)-[r]->(m)
RETURN count(r);

// Optimized: Count specific relationships with index
MATCH (:KnowledgeGraph)-[r:CONTAINS]->(:Agent)
RETURN count(r);
```

#### Optimize Group Operations
```cypher
// Inefficient: Group after collection
MATCH (n)-[r]->(m)
WITH collect(r) as rels
RETURN size(rels);

// Optimized: Count during match
MATCH (n)-[r]->(m)
RETURN count(r);
```

## Resource Management

### 1. Memory Management

#### Monitor Memory Usage
```cypher
MATCH (n)
WHERE n.resource_limit_memory_mb IS NOT NULL
WITH sum(n.resource_limit_memory_mb) as total_memory
MATCH (kg:KnowledgeGraph)
SET kg.current_memory_usage_mb = total_memory,
    kg.memory_last_updated = datetime()
RETURN kg.name, kg.current_memory_usage_mb;
```

#### Optimize Memory Allocation
```cypher
MATCH (n)
WHERE n.resource_limit_memory_mb > n.actual_memory_usage_mb * 2
SET n.resource_limit_memory_mb = n.actual_memory_usage_mb * 1.5,
    n.updated_at = datetime()
RETURN n.name, n.resource_limit_memory_mb as new_limit;
```

### 2. Rate Limiting

#### Configure Rate Limits
```cypher
MATCH (n)
WHERE n.rate_limit_rpm IS NOT NULL
SET n.burst_limit = CASE
    WHEN n.rate_limit_rpm < 30 THEN 5
    WHEN n.rate_limit_rpm < 60 THEN 10
    ELSE 20
END,
n.updated_at = datetime()
RETURN n.name, n.rate_limit_rpm, n.burst_limit;
```

#### Monitor Rate Limit Violations
```cypher
MATCH (n)-[r:RATE_LIMIT_VIOLATION]->(log:RateLog)
WHERE r.created_at > datetime() - duration('PT1H')
RETURN n.name,
       count(r) as violations,
       max(r.request_count) as max_requests,
       n.rate_limit_rpm as limit;
```

## Performance Monitoring

### 1. Query Performance

#### Monitor Slow Queries
```cypher
MATCH (q:QueryLog)
WHERE q.execution_time_ms > 1000
RETURN q.query_text,
       q.execution_time_ms,
       q.created_at
ORDER BY q.execution_time_ms DESC
LIMIT 10;
```

#### Track Resource Usage
```cypher
MATCH (n)
WHERE n.performance_metrics_enabled = true
RETURN n.name,
       n.avg_response_time_ms,
       n.p95_response_time_ms,
       n.p99_response_time_ms,
       n.error_rate,
       n.last_updated;
```

### 2. System Health

#### Check System Status
```cypher
MATCH (kg:KnowledgeGraph)
RETURN kg.name,
       kg.current_memory_usage_mb,
       kg.current_cpu_usage_ms,
       kg.current_storage_usage_mb,
       kg.health_status,
       kg.last_health_check;
```

#### Monitor Error Rates
```cypher
MATCH (n)-[r:ERROR_OCCURRED]->(log:ErrorLog)
WHERE r.created_at > datetime() - duration('PT24H')
RETURN n.name,
       count(r) as error_count,
       collect(DISTINCT log.error_type) as error_types
ORDER BY error_count DESC;
```

## Best Practices

1. **Index Management**
   - Create indexes for frequently queried properties
   - Monitor index usage
   - Remove unused indexes
   - Update statistics regularly

2. **Query Optimization**
   - Use specific labels in patterns
   - Filter early in queries
   - Use parameterized queries
   - Avoid cartesian products

3. **Resource Management**
   - Monitor memory usage
   - Configure appropriate rate limits
   - Set reasonable timeouts
   - Clean up unused resources

4. **Performance Monitoring**
   - Regular health checks
   - Monitor error rates
   - Track query performance
   - Analyze resource usage

## See Also

- [Node Creation](../cypher/nodes.md)
- [Relationship Creation](../cypher/relationships.md)
- [Query Patterns](../cypher/queries.md) 