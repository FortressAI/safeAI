# Economics Knowledge Graph Implementation

## Overview

This guide provides Cypher queries for implementing an Economics Knowledge Graph in the SafeAI Platform. Each section includes:
- Node creation
- Relationship definitions
- Analysis queries
- Monitoring patterns

## Knowledge Graph Setup

### 1. Create Economics KG

```cypher
CREATE (kg:KnowledgeGraph:Economics {
    name: 'economics_kg',
    domain: 'economics',
    description: 'Economic analysis and modeling knowledge graph',
    
    // Domain Configuration
    base_currency: 'USD',
    time_zone: 'UTC',
    update_frequency_minutes: 15,
    
    // Security Configuration
    input_validation_enabled: true,
    input_max_length: 10000,
    input_allowed_chars: "^[a-zA-Z0-9\\s\\+\\-\\*\\/\\(\\)\\[\\]\\{\\}\\^\\=\\,\\.\\;\\$]*$",
    
    // Resource Limits
    resource_limit_memory_mb: 2048,
    resource_limit_cpu_ms: 60000,
    rate_limit_requests_per_min: 100,
    
    // Metadata
    created_at: datetime(),
    updated_at: datetime(),
    version: "1.0"
})
RETURN kg;
```

## Economic Agents

### 1. Market Agent

```cypher
CREATE (ma:Agent:MarketAgent {
    name: 'market_analysis_agent',
    category: 'economic',
    agent_type: 'analysis',
    description: 'Analyzes market trends and patterns',
    
    // Analysis Configuration
    analysis_types: ['price', 'volume', 'trend', 'sentiment'],
    time_frames: ['1m', '5m', '15m', '1h', '4h', '1d'],
    indicators: ['MA', 'RSI', 'MACD', 'BB'],
    
    // Performance Settings
    effectiveness_threshold: 0.95,
    confidence_threshold: 0.85,
    max_analysis_time_ms: 5000,
    
    // Security
    security_validation_enabled: true,
    security_audit_enabled: true,
    
    // Resource Management
    memory_limit_mb: 512,
    rate_limit_rpm: 60,
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN ma;
```

### 2. Trading Agent

```cypher
CREATE (ta:Agent:TradingAgent {
    name: 'trading_execution_agent',
    category: 'economic',
    agent_type: 'execution',
    description: 'Executes trading strategies based on analysis',
    
    // Trading Configuration
    supported_markets: ['forex', 'crypto', 'stocks'],
    position_types: ['long', 'short'],
    risk_tolerance: 0.15,
    max_position_size: 100000,
    
    // Risk Management
    stop_loss_percent: 2.0,
    take_profit_ratio: 3.0,
    max_drawdown_percent: 10.0,
    
    // Security
    security_validation_enabled: true,
    security_transaction_validation: true,
    
    // Resource Management
    memory_limit_mb: 256,
    rate_limit_rpm: 30,
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN ta;
```

## Market Components

### 1. Asset Node

```cypher
CREATE (a:Asset {
    symbol: $symbol,
    name: $name,
    asset_type: $type,              // 'currency', 'stock', 'crypto'
    
    // Market Data
    current_price: $price,
    volume_24h: $volume,
    market_cap: $market_cap,
    
    // Risk Metrics
    volatility_30d: $volatility,
    beta: $beta,
    sharpe_ratio: $sharpe,
    
    // Trading Info
    min_trade_size: $min_size,
    max_trade_size: $max_size,
    trading_fee_percent: $fee,
    
    // Metadata
    created_at: datetime(),
    updated_at: datetime(),
    status: 'active'
})
RETURN a;
```

### 2. Market Data Node

```cypher
CREATE (md:MarketData {
    asset_symbol: $symbol,
    timestamp: datetime(),
    
    // Price Data
    open: $open,
    high: $high,
    low: $low,
    close: $close,
    volume: $volume,
    
    // Technical Indicators
    ma_20: $ma20,
    ma_50: $ma50,
    rsi_14: $rsi,
    macd: $macd,
    
    // Market Metrics
    volatility: $vol,
    liquidity: $liq,
    spread: $spread,
    
    // Metadata
    data_source: $source,
    verified: true
})
RETURN md;
```

## Relationships

### 1. Trading Relationships

```cypher
// Connect Market Agent to Trading Agent
MATCH (ma:MarketAgent {name: $market_agent})
MATCH (ta:TradingAgent {name: $trading_agent})
CREATE (ma)-[r:SIGNALS_TO {
    created_at: datetime(),
    signal_type: 'trade',
    confidence_threshold: 0.85,
    
    // Rate Limiting
    rate_limit_rpm: 30,
    burst_limit: 5,
    
    // Security
    security_validation_enabled: true,
    security_audit_enabled: true
}]->(ta)
RETURN r;

// Connect Trading Agent to Asset
MATCH (ta:TradingAgent {name: $trading_agent})
MATCH (a:Asset {symbol: $symbol})
CREATE (ta)-[r:TRADES {
    created_at: datetime(),
    position_type: $type,           // 'long' or 'short'
    size: $size,
    entry_price: $entry,
    stop_loss: $stop,
    take_profit: $profit,
    
    // Risk Management
    risk_percent: $risk,
    margin_required: $margin,
    
    // Security
    security_validation_enabled: true,
    security_transaction_validation: true
}]->(a)
RETURN r;
```

### 2. Analysis Relationships

```cypher
// Connect Market Data to Asset
MATCH (md:MarketData {asset_symbol: $symbol})
MATCH (a:Asset {symbol: $symbol})
CREATE (md)-[r:PRICE_DATA {
    created_at: datetime(),
    timeframe: $timeframe,
    data_quality: $quality,
    
    // Validation
    security_validation_enabled: true,
    data_verified: true
}]->(a)
RETURN r;

// Connect Analysis Results
MATCH (ma:MarketAgent {name: $market_agent})
MATCH (a:Asset {symbol: $symbol})
CREATE (ma)-[r:ANALYZES {
    created_at: datetime(),
    analysis_type: $type,
    timeframe: $timeframe,
    confidence: $confidence,
    
    // Results
    trend: $trend,
    strength: $strength,
    signals: $signals,
    
    // Validation
    security_validation_enabled: true,
    analysis_verified: true
}]->(a)
RETURN r;
```

## Analysis Queries

### 1. Market Analysis

```cypher
// Get Market Overview
MATCH (a:Asset)
WHERE a.status = 'active'
RETURN a.symbol,
       a.current_price,
       a.volume_24h,
       a.volatility_30d,
       a.updated_at
ORDER BY a.market_cap DESC;

// Get Trading Signals
MATCH (ma:MarketAgent)-[r:ANALYZES]->(a:Asset)
WHERE r.created_at > datetime() - duration('PT1H')
  AND r.confidence > 0.8
RETURN a.symbol,
       r.analysis_type,
       r.trend,
       r.strength,
       r.confidence,
       r.created_at
ORDER BY r.confidence DESC;
```

### 2. Performance Analysis

```cypher
// Get Agent Performance
MATCH (ta:TradingAgent)-[r:TRADES]->(a:Asset)
WHERE r.created_at > datetime() - duration('P30D')
RETURN ta.name,
       count(r) as trade_count,
       avg(r.profit_loss) as avg_pl,
       sum(CASE WHEN r.profit_loss > 0 THEN 1 ELSE 0 END) * 100.0 / count(r) as win_rate;

// Get Risk Metrics
MATCH (a:Asset)
WHERE a.status = 'active'
RETURN a.symbol,
       a.volatility_30d,
       a.beta,
       a.sharpe_ratio,
       a.max_drawdown_percent;
```

## Monitoring Queries

### 1. System Health

```cypher
// Check Agent Status
MATCH (n:Agent)
WHERE n.category = 'economic'
RETURN n.name,
       n.status,
       n.effectiveness_threshold,
       n.memory_limit_mb,
       n.rate_limit_rpm,
       n.updated_at;

// Monitor Trading Activity
MATCH (ta:TradingAgent)-[r:TRADES]->(a:Asset)
WHERE r.created_at > datetime() - duration('PT1H')
RETURN ta.name,
       count(r) as trades,
       sum(r.size) as total_volume,
       avg(r.risk_percent) as avg_risk;
```

### 2. Data Quality

```cypher
// Verify Market Data
MATCH (md:MarketData)-[r:PRICE_DATA]->(a:Asset)
WHERE md.created_at > datetime() - duration('PT24H')
  AND (md.verified = false OR md.data_quality < 0.9)
RETURN a.symbol,
       md.timestamp,
       md.data_source,
       md.data_quality,
       md.verified;

// Check Missing Data
MATCH (a:Asset)
WHERE a.status = 'active'
OPTIONAL MATCH (md:MarketData)-[r:PRICE_DATA]->(a)
WHERE md.created_at > datetime() - duration('PT1H')
WITH a, count(md) as data_points
WHERE data_points = 0
RETURN a.symbol, a.last_update, data_points;
```

## Best Practices

1. **Data Management**
   - Regular market data updates
   - Data quality validation
   - Historical data maintenance
   - Performance metrics tracking

2. **Risk Management**
   - Position size limits
   - Stop-loss enforcement
   - Exposure monitoring
   - Drawdown tracking

3. **Performance Optimization**
   - Index frequently queried properties
   - Optimize analysis patterns
   - Monitor resource usage
   - Regular maintenance

4. **Security**
   - Transaction validation
   - Data verification
   - Access control
   - Audit logging

## See Also

- [Node Creation](../cypher/nodes.md)
- [Relationship Creation](../cypher/relationships.md)
- [Query Patterns](../cypher/queries.md) 