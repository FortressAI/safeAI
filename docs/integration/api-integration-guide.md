# API Integration Guide

## Overview

This guide details how to integrate with the SafeAI Platform's Knowledge Graph API using Neo4j's Cypher query language. All interactions with the platform are performed through Cypher queries to ensure consistency and security.

## Table of Contents

1. [Authentication](#authentication)
2. [Core Endpoints](#core-endpoints)
3. [Data Models](#data-models)
4. [Integration Patterns](#integration-patterns)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)

## Authentication

### 1. Create API Client

```cypher
// Create API Client Node
CREATE (c:APIClient {
    client_id: apoc.create.uuid(),
    name: 'example_client',
    description: 'Example integration client',
    
    // Authentication
    auth_type: 'oauth2',
    client_secret_hash: $hashed_secret,
    
    // Permissions
    scopes: ['read', 'write', 'execute'],
    rate_limit: 1000,
    
    // Security
    ip_whitelist: ['192.168.1.0/24'],
    require_ssl: true,
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN c;
```

### 2. Generate Access Token

```cypher
// Create Access Token
MATCH (c:APIClient {client_id: $client_id})
WHERE c.status = 'active'
CREATE (t:AccessToken {
    token_id: apoc.create.uuid(),
    client_id: c.client_id,
    
    // Token Details
    token_hash: $token_hash,
    expires_at: datetime() + duration('PT1H'),
    
    // Scopes
    scopes: c.scopes,
    
    // Metadata
    created_at: datetime(),
    last_used: datetime(),
    status: 'active'
})
CREATE (c)-[r:HAS_TOKEN {
    created_at: datetime()
}]->(t)
RETURN t.token_id;
```

## Core Endpoints

### 1. Knowledge Graph Access

```cypher
// Query Knowledge Graph
MATCH (n:KnowledgeNode)
WHERE n.domain IN $authorized_domains
  AND n.access_level <= $client_access_level
RETURN n.id,
       n.type,
       n.properties,
       [(n)-[r]->(m) | {
           type: type(r),
           target_id: m.id,
           properties: r.properties
       }] as relationships
LIMIT 100;

// Create Knowledge Node
CREATE (n:KnowledgeNode {
    id: apoc.create.uuid(),
    type: $node_type,
    properties: $properties,
    
    // Metadata
    created_by: $client_id,
    created_at: datetime(),
    access_level: $access_level
})
RETURN n;
```

### 2. Agent Interaction

```cypher
// Execute Agent Action
MATCH (a:Agent {id: $agent_id})
WHERE a.status = 'active'
  AND $client_id IN a.authorized_clients
CREATE (e:Execution {
    id: apoc.create.uuid(),
    agent_id: a.id,
    client_id: $client_id,
    
    // Execution Details
    action: $action,
    parameters: $parameters,
    
    // State
    status: 'pending',
    started_at: datetime(),
    
    // Security
    validation_required: true,
    validated: false
})
CREATE (a)-[r:EXECUTES {
    created_at: datetime()
}]->(e)
RETURN e;

// Monitor Execution
MATCH (e:Execution {id: $execution_id})
RETURN e.status,
       e.started_at,
       e.completed_at,
       e.result,
       e.error;
```

## Data Models

### 1. Define Schema

```cypher
// Create Node Types
CREATE CONSTRAINT node_type_name IF NOT EXISTS
FOR (n:NodeType) REQUIRE n.name IS UNIQUE;

// Define Node Type
CREATE (nt:NodeType {
    name: 'ExampleType',
    version: '1.0',
    
    // Schema
    required_properties: ['name', 'description'],
    optional_properties: ['tags', 'metadata'],
    property_types: {
        name: 'string',
        description: 'string',
        tags: 'list<string>',
        metadata: 'map'
    },
    
    // Validation
    constraints: [
        'name_length_max:100',
        'description_length_max:1000'
    ],
    
    // Metadata
    created_at: datetime()
})
RETURN nt;
```

### 2. Validate Data

```cypher
// Validate Node Properties
MATCH (n:ExampleType)
WHERE n.created_at > $last_check
RETURN n.id,
       n.name IS NOT NULL AND size(n.name) <= 100 as valid_name,
       n.description IS NOT NULL AND size(n.description) <= 1000 as valid_description,
       ALL(tag IN n.tags WHERE tag IS NOT NULL) as valid_tags;
```

## Integration Patterns

### 1. Batch Processing

```cypher
// Create Batch Job
CREATE (b:BatchJob {
    id: apoc.create.uuid(),
    client_id: $client_id,
    
    // Job Details
    type: 'data_import',
    status: 'pending',
    total_items: $item_count,
    processed_items: 0,
    
    // Configuration
    batch_size: 1000,
    retry_count: 3,
    
    // Tracking
    started_at: datetime(),
    last_updated: datetime()
})
RETURN b;

// Process Batch
MATCH (b:BatchJob {id: $batch_id})
WHERE b.status = 'pending'
  AND b.processed_items < b.total_items
WITH b
UNWIND $items as item
CREATE (n:BatchItem {
    batch_id: b.id,
    data: item,
    processed: false,
    created_at: datetime()
})
WITH b, collect(n) as new_items
SET b.last_updated = datetime(),
    b.processed_items = b.processed_items + size(new_items)
RETURN b.processed_items, b.total_items;
```

### 2. Event Streaming

```cypher
// Create Event Stream
CREATE (s:EventStream {
    id: apoc.create.uuid(),
    name: 'example_stream',
    
    // Stream Config
    event_types: ['data_change', 'agent_action'],
    buffer_size: 1000,
    retention_hours: 24,
    
    // Security
    authorized_clients: $client_ids,
    require_encryption: true,
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN s;

// Publish Event
MATCH (s:EventStream {id: $stream_id})
WHERE s.status = 'active'
CREATE (e:Event {
    id: apoc.create.uuid(),
    stream_id: s.id,
    
    // Event Data
    type: $event_type,
    payload: $payload,
    
    // Metadata
    published_at: datetime(),
    publisher_id: $client_id,
    processed: false
})
CREATE (s)-[r:CONTAINS {
    created_at: datetime()
}]->(e)
RETURN e;
```

## Error Handling

### 1. Error Logging

```cypher
// Log Error
CREATE (e:Error {
    id: apoc.create.uuid(),
    client_id: $client_id,
    
    // Error Details
    type: $error_type,
    message: $error_message,
    stack_trace: $stack_trace,
    
    // Context
    request_id: $request_id,
    endpoint: $endpoint,
    parameters: $parameters,
    
    // Metadata
    occurred_at: datetime(),
    severity: $severity,
    resolved: false
})
RETURN e;

// Track Error Patterns
MATCH (e:Error)
WHERE e.occurred_at > datetime() - duration('P1D')
RETURN e.type,
       count(e) as error_count,
       collect(DISTINCT e.client_id) as affected_clients,
       avg(size((e)<-[:CAUSED_BY]-(:Request))) as avg_requests_affected
ORDER BY error_count DESC;
```

### 2. Circuit Breaking

```cypher
// Check Service Health
MATCH (s:Service {name: $service_name})
MATCH (e:Error)-[:AFFECTS]->(s)
WHERE e.occurred_at > datetime() - duration('PT5M')
WITH s, count(e) as recent_errors
SET s.status = CASE
    WHEN recent_errors > s.error_threshold THEN 'degraded'
    ELSE 'healthy'
END
RETURN s.name, s.status, recent_errors;
```

## Best Practices

### 1. Performance Optimization

```cypher
// Create Indexes
CREATE INDEX client_id IF NOT EXISTS FOR (c:APIClient) ON (c.client_id);
CREATE INDEX token_id IF NOT EXISTS FOR (t:AccessToken) ON (t.token_id);
CREATE INDEX execution_id IF NOT EXISTS FOR (e:Execution) ON (e.id);
CREATE INDEX batch_job_id IF NOT EXISTS FOR (b:BatchJob) ON (b.id);
```

### 2. Monitoring

```cypher
// Monitor API Usage
MATCH (c:APIClient)
MATCH (r:Request)-[:MADE_BY]->(c)
WHERE r.timestamp > datetime() - duration('PT1H')
RETURN c.name,
       count(r) as request_count,
       avg(r.response_time) as avg_response_time,
       sum(CASE WHEN r.status_code >= 400 THEN 1 ELSE 0 END) as error_count
ORDER BY request_count DESC;

// Track Rate Limits
MATCH (c:APIClient)
MATCH (r:Request)-[:MADE_BY]->(c)
WHERE r.timestamp > datetime() - duration('PT1M')
WITH c, count(r) as recent_requests
WHERE recent_requests > c.rate_limit
SET c.status = 'rate_limited',
    c.rate_limit_until = datetime() + duration('PT1M')
RETURN c.client_id, c.name, recent_requests, c.rate_limit;
```

## See Also

- [Authentication Guide](../security/authentication.md)
- [Error Codes Reference](../reference/error-codes.md)
- [Performance Tuning](../operations/performance.md) 