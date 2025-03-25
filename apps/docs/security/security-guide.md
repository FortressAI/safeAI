# Security Guide

## Overview

This guide details the security implementation for the SafeAI Platform using Neo4j's Cypher query language. All security measures are implemented directly in the knowledge graph to ensure consistent enforcement and auditability.

## Table of Contents

1. [Access Control](#access-control)
2. [Authentication](#authentication)
3. [Authorization](#authorization)
4. [Audit Logging](#audit-logging)
5. [Threat Detection](#threat-detection)
6. [Security Policies](#security-policies)

## Access Control

### 1. Role-Based Access Control (RBAC)

```cypher
// Create Role
CREATE (r:Role {
    name: 'admin',
    description: 'Administrative access',
    
    // Permissions
    permissions: [
        'read',
        'write',
        'execute',
        'manage_users',
        'manage_roles'
    ],
    
    // Access Levels
    access_level: 100,
    requires_mfa: true,
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN r;

// Assign Role to User
MATCH (u:User {id: $user_id})
MATCH (r:Role {name: $role_name})
CREATE (u)-[a:HAS_ROLE {
    assigned_at: datetime(),
    assigned_by: $admin_id,
    expires_at: datetime() + duration('P90D'),
    status: 'active'
}]->(r)
RETURN a;
```

### 2. Permission Management

```cypher
// Create Permission
CREATE (p:Permission {
    name: 'manage_agents',
    description: 'Manage AI agents',
    
    // Access Control
    resource_type: 'agent',
    operations: ['create', 'read', 'update', 'delete'],
    
    // Restrictions
    requires_approval: true,
    approval_level: 'supervisor',
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN p;

// Check User Permissions
MATCH (u:User {id: $user_id})
MATCH (u)-[:HAS_ROLE]->(r:Role)
MATCH (r)-[:INCLUDES]->(p:Permission)
WHERE p.resource_type = $resource_type
  AND p.status = 'active'
RETURN DISTINCT p.operations as allowed_operations;
```

## Authentication

### 1. Multi-Factor Authentication

```cypher
// Setup MFA
MATCH (u:User {id: $user_id})
CREATE (m:MFADevice {
    id: apoc.create.uuid(),
    type: 'totp',
    
    // Device Details
    secret: $encrypted_secret,
    backup_codes: $encrypted_backup_codes,
    
    // Status
    verified: false,
    last_used: null,
    
    // Security
    max_attempts: 3,
    current_attempts: 0,
    
    // Metadata
    created_at: datetime(),
    status: 'pending'
})
CREATE (u)-[r:USES_MFA {
    enabled_at: datetime(),
    required: true
}]->(m)
RETURN m;

// Verify MFA Token
MATCH (u:User {id: $user_id})
MATCH (u)-[:USES_MFA]->(m:MFADevice)
WHERE m.status = 'active'
  AND m.current_attempts < m.max_attempts
SET m.current_attempts = 
    CASE 
        WHEN $token_valid THEN 0
        ELSE m.current_attempts + 1
    END,
    m.last_used = CASE
        WHEN $token_valid THEN datetime()
        ELSE m.last_used
    END,
    m.status = CASE
        WHEN m.current_attempts + 1 >= m.max_attempts THEN 'locked'
        ELSE m.status
    END
RETURN m.status, m.current_attempts;
```

### 2. Session Management

```cypher
// Create Session
MATCH (u:User {id: $user_id})
CREATE (s:Session {
    id: apoc.create.uuid(),
    
    // Session Details
    token: $session_token,
    ip_address: $ip_address,
    user_agent: $user_agent,
    
    // Security
    mfa_verified: false,
    requires_mfa: true,
    
    // Expiration
    created_at: datetime(),
    expires_at: datetime() + duration('PT4H'),
    last_active: datetime(),
    
    // Status
    status: 'active'
})
CREATE (u)-[r:HAS_SESSION {
    created_at: datetime()
}]->(s)
RETURN s;

// Validate Session
MATCH (s:Session {id: $session_id})
WHERE s.status = 'active'
  AND s.expires_at > datetime()
SET s.last_active = datetime()
RETURN s.id, s.mfa_verified, s.requires_mfa;
```

## Authorization

### 1. Access Control Lists (ACL)

```cypher
// Create ACL
CREATE (acl:ACL {
    resource_id: $resource_id,
    resource_type: $resource_type,
    
    // Access Rules
    read_roles: ['user', 'admin'],
    write_roles: ['admin'],
    execute_roles: ['service_account'],
    
    // Inheritance
    inherit_from: $parent_resource_id,
    
    // Metadata
    created_at: datetime(),
    modified_at: datetime()
})
RETURN acl;

// Check Access
MATCH (u:User {id: $user_id})
MATCH (u)-[:HAS_ROLE]->(r:Role)
MATCH (acl:ACL {resource_id: $resource_id})
WHERE r.name IN acl.read_roles
RETURN count(r) > 0 as has_access;
```

### 2. Security Groups

```cypher
// Create Security Group
CREATE (g:SecurityGroup {
    name: 'data_scientists',
    description: 'Data Science Team',
    
    // Access Control
    allowed_resources: ['models', 'datasets'],
    allowed_operations: ['read', 'train', 'evaluate'],
    
    // Restrictions
    max_members: 100,
    requires_approval: true,
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN g;

// Add User to Group
MATCH (u:User {id: $user_id})
MATCH (g:SecurityGroup {name: $group_name})
WHERE size((g)<-[:MEMBER_OF]-()) < g.max_members
CREATE (u)-[m:MEMBER_OF {
    joined_at: datetime(),
    approved_by: $approver_id,
    status: 'active'
}]->(g)
RETURN m;
```

## Audit Logging

### 1. Security Events

```cypher
// Log Security Event
CREATE (e:SecurityEvent {
    id: apoc.create.uuid(),
    
    // Event Details
    type: $event_type,
    severity: $severity,
    description: $description,
    
    // Context
    user_id: $user_id,
    resource_id: $resource_id,
    ip_address: $ip_address,
    
    // Metadata
    occurred_at: datetime(),
    recorded_at: datetime()
})
RETURN e;

// Query Security Events
MATCH (e:SecurityEvent)
WHERE e.occurred_at > datetime() - duration('P1D')
  AND e.severity IN ['high', 'critical']
RETURN e.type,
       count(e) as event_count,
       collect(DISTINCT e.user_id) as affected_users
ORDER BY event_count DESC;
```

### 2. Access Logs

```cypher
// Log Access Attempt
CREATE (a:AccessLog {
    id: apoc.create.uuid(),
    
    // Access Details
    user_id: $user_id,
    resource_id: $resource_id,
    operation: $operation,
    
    // Request Details
    ip_address: $ip_address,
    user_agent: $user_agent,
    
    // Result
    success: $success,
    failure_reason: $failure_reason,
    
    // Metadata
    timestamp: datetime()
})
RETURN a;

// Analyze Access Patterns
MATCH (a:AccessLog)
WHERE a.timestamp > datetime() - duration('PT1H')
RETURN a.user_id,
       count(*) as access_count,
       sum(CASE WHEN a.success THEN 1 ELSE 0 END) as successful_attempts,
       collect(DISTINCT a.resource_id) as accessed_resources
ORDER BY access_count DESC;
```

## Threat Detection

### 1. Anomaly Detection

```cypher
// Create Baseline
MATCH (a:AccessLog)
WHERE a.timestamp > datetime() - duration('P30D')
WITH a.user_id as user_id,
     count(*) / 30 as avg_daily_access,
     stddev(count(*)) as std_dev_access
CREATE (b:Baseline {
    user_id: user_id,
    metric: 'daily_access',
    avg_value: avg_daily_access,
    std_dev: std_dev_access,
    calculated_at: datetime()
})
RETURN b;

// Detect Anomalies
MATCH (b:Baseline {metric: 'daily_access'})
MATCH (a:AccessLog)
WHERE a.user_id = b.user_id
  AND a.timestamp > datetime() - duration('PT24H')
WITH b, count(a) as today_access
WHERE abs(today_access - b.avg_value) > 2 * b.std_dev
CREATE (al:Alert {
    type: 'anomaly',
    user_id: b.user_id,
    metric: b.metric,
    expected: b.avg_value,
    actual: today_access,
    severity: 'high',
    created_at: datetime()
})
RETURN al;
```

### 2. Threat Response

```cypher
// Create Security Block
MATCH (u:User {id: $user_id})
WHERE exists((u)<-[:TRIGGERED_BY]-(:Alert {severity: 'critical'}))
CREATE (b:SecurityBlock {
    id: apoc.create.uuid(),
    user_id: u.id,
    
    // Block Details
    reason: 'suspicious_activity',
    severity: 'high',
    
    // Duration
    created_at: datetime(),
    expires_at: datetime() + duration('PT24H'),
    
    // Status
    active: true,
    requires_review: true
})
CREATE (u)-[r:BLOCKED_BY {
    created_at: datetime()
}]->(b)
RETURN b;

// Review Security Blocks
MATCH (b:SecurityBlock)
WHERE b.active = true
  AND b.created_at < datetime() - duration('PT4H')
RETURN b.id,
       b.user_id,
       b.reason,
       b.created_at,
       [(b)<-[:TRIGGERED_BY]-(a:Alert) | {
           type: a.type,
           severity: a.severity,
           created_at: a.created_at
       }] as triggering_alerts;
```

## Security Policies

### 1. Password Policy

```cypher
// Create Password Policy
CREATE (p:PasswordPolicy {
    name: 'default_policy',
    
    // Requirements
    min_length: 12,
    require_uppercase: true,
    require_lowercase: true,
    require_numbers: true,
    require_special: true,
    
    // History
    password_history: 5,
    min_age_days: 1,
    max_age_days: 90,
    
    // Lockout
    max_attempts: 5,
    lockout_duration_minutes: 30,
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN p;

// Enforce Password Policy
MATCH (u:User {id: $user_id})
MATCH (p:PasswordPolicy {name: 'default_policy'})
WHERE u.password_updated_at < datetime() - duration({days: p.max_age_days})
SET u.requires_password_change = true
RETURN u.id, u.password_updated_at;
```

### 2. Security Configuration

```cypher
// Create Security Config
CREATE (c:SecurityConfig {
    name: 'global_config',
    
    // Authentication
    mfa_required: true,
    session_timeout_minutes: 240,
    
    // Access Control
    max_concurrent_sessions: 3,
    ip_whitelist_enabled: true,
    
    // Monitoring
    log_retention_days: 90,
    alert_threshold: 'medium',
    
    // Metadata
    created_at: datetime(),
    updated_at: datetime()
})
RETURN c;

// Apply Security Config
MATCH (c:SecurityConfig {name: 'global_config'})
MATCH (s:Session)
WHERE s.created_at < datetime() - duration({minutes: c.session_timeout_minutes})
SET s.status = 'expired'
RETURN count(s) as expired_sessions;
```

## Best Practices

### 1. Performance Optimization

```cypher
// Create Indexes
CREATE INDEX user_id IF NOT EXISTS FOR (u:User) ON (u.id);
CREATE INDEX session_id IF NOT EXISTS FOR (s:Session) ON (s.id);
CREATE INDEX security_event_timestamp IF NOT EXISTS FOR (e:SecurityEvent) ON (e.occurred_at);
CREATE INDEX access_log_timestamp IF NOT EXISTS FOR (a:AccessLog) ON (a.timestamp);
```

### 2. Monitoring

```cypher
// Monitor Security Status
MATCH (e:SecurityEvent)
WHERE e.occurred_at > datetime() - duration('PT1H')
RETURN e.severity,
       count(e) as event_count,
       collect(DISTINCT e.type) as event_types
ORDER BY event_count DESC;

// Track Authentication Failures
MATCH (a:AccessLog)
WHERE a.timestamp > datetime() - duration('PT1H')
  AND NOT a.success
RETURN a.failure_reason,
       count(*) as failure_count,
       collect(DISTINCT a.ip_address) as source_ips
ORDER BY failure_count DESC;
```

## See Also

- [Authentication Guide](./authentication.md)
- [Access Control Guide](./access-control.md)
- [Audit Guide](./audit.md) 