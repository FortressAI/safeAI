# Cybersecurity Knowledge Graph Implementation

## Overview

This guide provides Cypher queries for implementing a Cybersecurity Knowledge Graph in the SafeAI Platform. Each section includes:
- Node creation
- Relationship definitions
- Analysis queries
- Monitoring patterns

## Knowledge Graph Setup

### 1. Create Cybersecurity KG

```cypher
CREATE (kg:KnowledgeGraph:Cybersecurity {
    name: 'cybersecurity_kg',
    domain: 'cybersecurity',
    description: 'Threat detection and security analysis knowledge graph',
    
    // Domain Configuration
    threat_levels: ['low', 'medium', 'high', 'critical'],
    alert_categories: ['network', 'system', 'application', 'user'],
    update_frequency_seconds: 60,
    
    // Security Configuration
    input_validation_enabled: true,
    input_max_length: 10000,
    input_allowed_chars: "^[a-zA-Z0-9\\s\\+\\-\\*\\/\\(\\)\\[\\]\\{\\}\\^\\=\\,\\.\\;\\:\\@]*$",
    
    // Resource Limits
    resource_limit_memory_mb: 4096,
    resource_limit_cpu_ms: 120000,
    rate_limit_requests_per_min: 1000,
    
    // Metadata
    created_at: datetime(),
    updated_at: datetime(),
    version: "1.0"
})
RETURN kg;
```

## Security Agents

### 1. Threat Detection Agent

```cypher
CREATE (tda:Agent:ThreatDetectionAgent {
    name: 'threat_detection_agent',
    category: 'security',
    agent_type: 'detection',
    description: 'Analyzes patterns for potential security threats',
    
    // Detection Configuration
    detection_types: ['anomaly', 'signature', 'behavior', 'heuristic'],
    data_sources: ['network', 'logs', 'system', 'user'],
    alert_thresholds: {
        low: 0.3,
        medium: 0.6,
        high: 0.8,
        critical: 0.95
    },
    
    // Performance Settings
    effectiveness_threshold: 0.99,
    false_positive_threshold: 0.01,
    max_detection_time_ms: 1000,
    
    // Security
    security_validation_enabled: true,
    security_audit_enabled: true,
    
    // Resource Management
    memory_limit_mb: 1024,
    rate_limit_rpm: 600,
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN tda;
```

### 2. Response Agent

```cypher
CREATE (ra:Agent:ResponseAgent {
    name: 'security_response_agent',
    category: 'security',
    agent_type: 'response',
    description: 'Executes response actions for security threats',
    
    // Response Configuration
    response_types: ['block', 'isolate', 'notify', 'investigate'],
    automation_levels: ['manual', 'semi-auto', 'automatic'],
    priority_levels: ['low', 'medium', 'high', 'critical'],
    
    // Action Settings
    max_auto_response_severity: 'medium',
    require_approval_threshold: 0.8,
    max_response_time_ms: 5000,
    
    // Security
    security_validation_enabled: true,
    security_action_validation: true,
    
    // Resource Management
    memory_limit_mb: 512,
    rate_limit_rpm: 100,
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN ra;
```

## Security Components

### 1. Threat Node

```cypher
CREATE (t:Threat {
    id: $threat_id,
    type: $type,                    // 'malware', 'intrusion', 'anomaly'
    severity: $severity,            // 'low', 'medium', 'high', 'critical'
    
    // Threat Details
    source_ip: $source_ip,
    target_ip: $target_ip,
    protocol: $protocol,
    port: $port,
    
    // Detection Info
    detection_method: $method,
    confidence: $confidence,
    signature_id: $sig_id,
    
    // Impact Assessment
    potential_impact: $impact,
    affected_systems: $systems,
    mitigation_available: $has_mitigation,
    
    // Metadata
    created_at: datetime(),
    updated_at: datetime(),
    status: 'active'
})
RETURN t;
```

### 2. Alert Node

```cypher
CREATE (a:Alert {
    id: $alert_id,
    threat_id: $threat_id,
    severity: $severity,
    
    // Alert Details
    alert_type: $type,
    description: $description,
    triggered_rule: $rule_id,
    
    // Context
    source_data: $data,
    environment: $env,
    affected_assets: $assets,
    
    // Response
    requires_action: true,
    response_deadline: datetime() + duration($deadline),
    assigned_team: $team,
    
    // Metadata
    created_at: datetime(),
    status: 'open'
})
RETURN a;
```

## Relationships

### 1. Detection Relationships

```cypher
// Connect Threat Detection to Threat
MATCH (tda:ThreatDetectionAgent {name: $agent_name})
MATCH (t:Threat {id: $threat_id})
CREATE (tda)-[r:DETECTED {
    created_at: datetime(),
    detection_type: $type,
    confidence: $confidence,
    
    // Detection Details
    detection_method: $method,
    detection_rule: $rule,
    
    // Validation
    security_validation_enabled: true,
    detection_verified: true
}]->(t)
RETURN r;

// Link Related Threats
MATCH (t1:Threat {id: $threat1_id})
MATCH (t2:Threat {id: $threat2_id})
CREATE (t1)-[r:RELATED_TO {
    relationship_type: $type,        // 'similar', 'parent', 'child'
    confidence: $confidence,
    evidence: $evidence,
    created_at: datetime()
}]->(t2)
RETURN r;
```

### 2. Response Relationships

```cypher
// Connect Response Agent to Alert
MATCH (ra:ResponseAgent {name: $agent_name})
MATCH (a:Alert {id: $alert_id})
CREATE (ra)-[r:RESPONDS_TO {
    created_at: datetime(),
    response_type: $type,
    priority: $priority,
    
    // Action Details
    actions_taken: $actions,
    automation_level: $auto_level,
    
    // Validation
    security_validation_enabled: true,
    response_verified: true
}]->(a)
RETURN r;

// Link Alert to Threat
MATCH (a:Alert {id: $alert_id})
MATCH (t:Threat {id: $threat_id})
CREATE (a)-[r:ALERTS_ON {
    created_at: datetime(),
    alert_type: $type,
    severity: $severity,
    
    // Validation
    security_validation_enabled: true,
    alert_verified: true
}]->(t)
RETURN r;
```

## Analysis Queries

### 1. Threat Analysis

```cypher
// Get Active Threats
MATCH (t:Threat)
WHERE t.status = 'active'
  AND t.severity IN ['high', 'critical']
RETURN t.id,
       t.type,
       t.severity,
       t.source_ip,
       t.confidence,
       t.created_at
ORDER BY t.severity DESC, t.confidence DESC;

// Find Related Threats
MATCH (t:Threat {id: $threat_id})-[r:RELATED_TO*1..3]-(related:Threat)
RETURN t.id,
       collect(related.id) as related_threats,
       collect(related.type) as threat_types,
       count(related) as relationship_count;
```

### 2. Alert Analysis

```cypher
// Get Open Alerts
MATCH (a:Alert)-[:ALERTS_ON]->(t:Threat)
WHERE a.status = 'open'
RETURN a.id,
       a.severity,
       t.id as threat_id,
       t.type as threat_type,
       a.created_at,
       a.response_deadline
ORDER BY a.severity DESC, a.response_deadline;

// Get Response Statistics
MATCH (ra:ResponseAgent)-[r:RESPONDS_TO]->(a:Alert)
WHERE r.created_at > datetime() - duration('P1D')
RETURN ra.name,
       count(r) as responses,
       avg(r.response_time_ms) as avg_response_time,
       collect(DISTINCT r.response_type) as action_types;
```

## Monitoring Queries

### 1. System Health

```cypher
// Monitor Detection Performance
MATCH (tda:ThreatDetectionAgent)-[r:DETECTED]->(t:Threat)
WHERE r.created_at > datetime() - duration('PT1H')
RETURN tda.name,
       count(r) as detections,
       avg(r.confidence) as avg_confidence,
       collect(DISTINCT t.type) as threat_types;

// Check Response Times
MATCH (ra:ResponseAgent)-[r:RESPONDS_TO]->(a:Alert)
WHERE r.created_at > datetime() - duration('PT1H')
RETURN ra.name,
       count(r) as responses,
       avg(r.response_time_ms) as avg_response_time,
       max(r.response_time_ms) as max_response_time;
```

### 2. Quality Metrics

```cypher
// Check False Positives
MATCH (tda:ThreatDetectionAgent)-[r:DETECTED]->(t:Threat)
WHERE r.created_at > datetime() - duration('P1D')
  AND r.false_positive = true
RETURN tda.name,
       count(r) as false_positives,
       collect(t.type) as threat_types,
       avg(r.confidence) as avg_confidence;

// Validate Detection Quality
MATCH (t:Threat)
WHERE t.created_at > datetime() - duration('P1D')
RETURN t.detection_method,
       count(t) as threats,
       avg(t.confidence) as avg_confidence,
       sum(CASE WHEN t.verified = true THEN 1 ELSE 0 END) * 100.0 / count(t) as verification_rate;
```

## Best Practices

1. **Detection Configuration**
   - Set appropriate confidence thresholds
   - Configure detection rules
   - Enable multi-source validation
   - Regular rule updates

2. **Response Management**
   - Define clear response procedures
   - Set automation thresholds
   - Monitor response times
   - Regular procedure reviews

3. **Performance Optimization**
   - Index threat and alert properties
   - Optimize detection patterns
   - Monitor resource usage
   - Regular maintenance

4. **Security**
   - Validate all detections
   - Verify response actions
   - Maintain audit trails
   - Regular security reviews

## See Also

- [Node Creation](../cypher/nodes.md)
- [Relationship Creation](../cypher/relationships.md)
- [Query Patterns](../cypher/queries.md) 