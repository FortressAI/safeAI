# Security Configuration Guide

## Overview

This guide provides all Cypher queries needed to configure and manage security in the SafeAI Platform. Each section includes:
- Configuration queries
- Validation queries
- Monitoring queries
- Maintenance queries

## Access Control Configuration

### 1. Role-Based Access Control

#### Create Role Node
```cypher
CREATE (r:Role {
    name: $role_name,
    description: $description,
    
    // Permissions
    can_create_kg: true,
    can_modify_kg: false,
    can_delete_kg: false,
    can_create_agents: false,
    can_modify_agents: false,
    can_delete_agents: false,
    
    // Audit
    created_at: datetime(),
    updated_at: datetime(),
    audit_enabled: true
})
RETURN r;
```

#### Assign Role to User
```cypher
MATCH (u:User {name: $user_name})
MATCH (r:Role {name: $role_name})
CREATE (u)-[rel:HAS_ROLE {
    assigned_at: datetime(),
    assigned_by: $admin_name,
    expires_at: datetime() + duration('P90D'),
    audit_enabled: true
}]->(r)
RETURN rel;
```

### 2. Resource Limits

#### Configure Global Limits
```cypher
MATCH (kg:KnowledgeGraph)
SET kg.global_memory_limit_mb = 2048,
    kg.global_cpu_limit_ms = 120000,
    kg.global_storage_limit_mb = 5000,
    kg.global_rate_limit_rpm = 100,
    kg.updated_at = datetime()
RETURN kg;
```

#### Set Component-Specific Limits
```cypher
MATCH (c {name: $component_name})
SET c.memory_limit_mb = $memory_limit,
    c.cpu_limit_ms = $cpu_limit,
    c.rate_limit_rpm = $rate_limit,
    c.burst_limit = $burst_limit,
    c.updated_at = datetime()
RETURN c;
```

## Input Validation

### 1. Configure Validation Rules

#### Set Global Validation Rules
```cypher
CREATE (v:ValidationRules {
    name: 'global_rules',
    max_string_length: 10000,
    allowed_chars_pattern: "^[a-zA-Z0-9\\s\\+\\-\\*\\/\\(\\)\\[\\]\\{\\}\\^\\=\\,\\.\\;]*$",
    max_array_length: 1000,
    max_number_value: 1e9,
    min_number_value: -1e9,
    created_at: datetime(),
    updated_at: datetime()
})
RETURN v;
```

#### Apply Rules to Component
```cypher
MATCH (c {name: $component_name})
MATCH (v:ValidationRules {name: 'global_rules'})
CREATE (c)-[r:USES_VALIDATION {
    enabled: true,
    override_max_string_length: $custom_length,
    created_at: datetime()
}]->(v)
RETURN r;
```

## Audit Configuration

### 1. Setup Audit Logging

#### Create Audit Log Node
```cypher
CREATE (al:AuditLog {
    name: 'system_audit',
    retention_days: 90,
    log_level: 'INFO',
    include_read_ops: false,
    include_write_ops: true,
    blockchain_verification: true,
    created_at: datetime()
})
RETURN al;
```

#### Enable Component Auditing
```cypher
MATCH (c {name: $component_name})
MATCH (al:AuditLog {name: 'system_audit'})
CREATE (c)-[r:LOGS_TO {
    enabled: true,
    custom_retention_days: $retention,
    created_at: datetime()
}]->(al)
RETURN r;
```

## Blockchain Integration

### 1. Configure Transaction Verification

#### Create Verification Node
```cypher
CREATE (v:VerificationConfig {
    name: 'blockchain_verify',
    chain_id: $chain_id,
    contract_address: $contract_address,
    min_confirmations: 12,
    max_gas_price_gwei: 100,
    retry_interval_seconds: 60,
    created_at: datetime()
})
RETURN v;
```

#### Link Component to Verification
```cypher
MATCH (c {name: $component_name})
MATCH (v:VerificationConfig {name: 'blockchain_verify'})
CREATE (c)-[r:USES_VERIFICATION {
    enabled: true,
    custom_confirmations: $confirmations,
    created_at: datetime()
}]->(v)
RETURN r;
```

## Monitoring Queries

### 1. Security Status

#### Check Component Security
```cypher
MATCH (c {name: $component_name})
RETURN c.name as name,
       c.security_validation_enabled as validation_enabled,
       c.security_audit_enabled as audit_enabled,
       c.security_resource_monitoring as resource_monitoring,
       c.last_security_update as last_update;
```

#### List Security Violations
```cypher
MATCH (n)
WHERE n.security_validation_enabled = false
   OR n.security_audit_enabled = false
RETURN labels(n) as type,
       n.name as name,
       n.created_at as created,
       n.last_security_update as last_update;
```

### 2. Resource Usage

#### Monitor Resource Consumption
```cypher
MATCH (n)
WHERE n.resource_limit_memory_mb IS NOT NULL
RETURN labels(n) as type,
       n.name as name,
       n.resource_limit_memory_mb as memory_limit,
       n.resource_limit_cpu_ms as cpu_limit,
       n.rate_limit_rpm as rate_limit;
```

## Maintenance Queries

### 1. Security Updates

#### Update Security Settings
```cypher
MATCH (n)
SET n.security_validation_enabled = true,
    n.security_audit_enabled = true,
    n.security_resource_monitoring = true,
    n.last_security_update = datetime()
RETURN count(n) as updated_nodes;
```

#### Rotate Security Keys
```cypher
MATCH (n)
WHERE n.security_key_rotation_hours <= duration.inHours(datetime() - n.last_key_rotation).hours
SET n.last_key_rotation = datetime(),
    n.security_key = apoc.crypto.generateUUID()
RETURN count(n) as rotated_keys;
```

### 2. Audit Maintenance

#### Clean Old Audit Logs
```cypher
MATCH (al:AuditLog)-[r:CONTAINS]->(entry:AuditEntry)
WHERE duration.inDays(datetime() - entry.created_at).days > al.retention_days
DELETE entry
RETURN count(entry) as deleted_entries;
```

#### Verify Audit Trail
```cypher
MATCH (entry:AuditEntry)
WHERE entry.blockchain_verification = true
  AND entry.verified = false
CALL apoc.blockchain.verify(entry.transaction_hash) YIELD isValid
SET entry.verified = isValid,
    entry.verification_date = datetime()
RETURN count(entry) as verified_entries;
```

## Best Practices

1. **Security Configuration**
   - Always enable input validation
   - Set appropriate resource limits
   - Enable audit logging
   - Configure blockchain verification

2. **Monitoring**
   - Regular security status checks
   - Resource usage monitoring
   - Audit log verification
   - Key rotation tracking

3. **Maintenance**
   - Regular security updates
   - Key rotation
   - Audit log cleanup
   - Verification checks

## See Also

- [Node Creation](../cypher/nodes.md)
- [Relationship Creation](../cypher/relationships.md)
- [Query Patterns](../cypher/queries.md) 