# Knowledge Graph Implementation Guide: A Beginner's Guide

## What is a Knowledge Graph?

A Knowledge Graph is a structured way to organize information that shows how different pieces of data relate to each other. Unlike traditional databases that store data in tables, knowledge graphs use a network structure with:

- **Nodes**: These represent entities like agents, concepts, or users
- **Relationships**: These are the connections between nodes, showing how they relate to each other
- **Properties**: These are attributes that describe nodes and relationships

Think of a knowledge graph like a digital map of information that shows not just the "places" (nodes) but also the "roads" (relationships) connecting them.

![Knowledge Graph Structure](../images/knowledge-graph-structure.png)
*Visual representation of a knowledge graph with nodes and relationships*

## Why Use Knowledge Graphs?

Knowledge graphs are particularly useful for:

1. **Connecting Information**: Easily see how different pieces of data relate to each other
2. **Flexible Structure**: Add new types of data without redesigning your entire database
3. **Powerful Queries**: Ask complex questions that involve multiple steps or connections
4. **AI Integration**: Provide a knowledge foundation for intelligent agents to access
5. **Security**: Implement granular access controls based on relationships

## Getting Started with SafeAI Knowledge Graphs

In the SafeAI platform, you can create and interact with knowledge graphs using:

1. **The Management Console**: A user-friendly web interface
2. **Cypher Queries**: A query language specifically designed for graph databases

This guide will focus on using Cypher to work with knowledge graphs directly. Don't worry if you're new to Cypher - we'll walk through each step with explanations.

## Basic Knowledge Graph Structure in SafeAI

Every knowledge graph in the SafeAI platform starts with a root node that defines its domain and basic settings:

```cypher
CREATE (kg:KnowledgeGraph {
  name: "economics_kg",                // A unique name for your knowledge graph
  domain: "economics",                 // The subject domain
  description: "Knowledge graph for economic concepts and relationships"
})
```

What this does:
- Creates a new node with the label `KnowledgeGraph`
- Sets properties like `name`, `domain`, and `description`
- This becomes the central node that all other components connect to

## Creating Different Types of Nodes

Nodes represent the entities in your knowledge graph. Here are the most common types:

### 1. Creating an Agent Node

Agents are AI components that can perform tasks within your knowledge graph:

```cypher
CREATE (a:Agent {
  name: "economic_forecasting_agent",  // A unique name for the agent
  category: "forecasting",             // What category it belongs to
  description: "Predicts economic trends based on historical data",
  agent_type: "llm",                   // Type: "llm" for language models, "script" for code-based agents
  effectiveness_threshold: 0.85        // Minimum acceptable performance level
})
```

What this does:
- Creates a new node with the label `Agent`
- Sets basic properties to define what the agent does
- Will later be connected to the knowledge graph and other components

### 2. Creating a Concept Node

Concepts represent ideas, terms, or entities in your domain:

```cypher
CREATE (c:Concept {
  name: "inflation",                   // Name of the concept
  description: "Increase in prices and fall in purchasing value of money",
  category: "economic_indicators",     // Category it belongs to
  verified: true                       // Whether this concept is verified
})
```

What this does:
- Creates a new node with the label `Concept`
- Defines the concept with its properties
- Can later be connected to other concepts and agents

### 3. Creating a User Node

Users represent people who interact with the knowledge graph:

```cypher
CREATE (u:User {
  name: "jane_doe",                    // Username
  affiliation: "Economic Research Institute",
  access_level: "editor",              // What they can do: "viewer", "editor", "admin"
  permission_publish: true,            // Whether they can publish content
  permission_modify: true              // Whether they can modify existing content
})
```

What this does:
- Creates a new node with the label `User`
- Sets permissions and information about the user
- Will be used for access control and tracking changes

## Connecting Nodes with Relationships

The real power of knowledge graphs comes from the relationships between nodes. Here's how to create them:

### 1. Connecting a Knowledge Graph to an Agent

```cypher
MATCH (kg:KnowledgeGraph {name: "economics_kg"})
MATCH (a:Agent {name: "economic_forecasting_agent"})
CREATE (kg)-[r:CONTAINS {
  created_at: datetime(),              // When this relationship was created
  permission_level: "write"            // What the agent can do in this KG
}]->(a)
```

What this does:
- Finds the knowledge graph and agent nodes using MATCH
- Creates a relationship of type CONTAINS from the knowledge graph to the agent
- Sets properties on the relationship, like when it was created and what permissions it grants

### 2. Connecting Concepts to Each Other

```cypher
MATCH (c1:Concept {name: "inflation"})
MATCH (c2:Concept {name: "interest_rates"})
CREATE (c1)-[r:RELATES_TO {
  relationship_type: "affects",        // How these concepts relate
  strength: 0.8,                       // How strong the relationship is (0-1)
  description: "Inflation typically leads to higher interest rates"
}]->(c2)
```

What this does:
- Finds two concept nodes
- Creates a RELATES_TO relationship between them
- Describes how they're related with properties

### 3. Connecting a User to an Agent

```cypher
MATCH (u:User {name: "jane_doe"})
MATCH (a:Agent {name: "economic_forecasting_agent"})
CREATE (u)-[r:CAN_USE {
  permission_level: "execute",         // What the user can do with this agent
  created_at: datetime()               // When this permission was granted
}]->(a)
```

What this does:
- Finds a user and an agent
- Creates a CAN_USE relationship indicating the user can use this agent
- Sets permission details

## Adding Security Features

Security is important in knowledge graphs. Here's how to add security features:

### 1. Adding Input Validation to an Agent

Input validation helps prevent security issues by checking that data meets certain criteria:

```cypher
MATCH (a:Agent {name: "economic_forecasting_agent"})
SET a.input_validation_enabled = true,                         // Turn on input validation
    a.input_max_length = 10000,                                // Maximum input length
    a.input_allowed_chars = "^[a-zA-Z0-9\\s\\.,\\-\\(\\)]*$",  // Allowed characters (regex)
    a.input_timeout_ms = 30000                                 // Timeout in milliseconds
```

What this does:
- Finds an agent node
- Adds properties that control input validation
- Sets limits on input size, character types, and processing time

### 2. Adding Resource Limits

Resource limits prevent a single agent from using too many system resources:

```cypher
MATCH (a:Agent {name: "economic_forecasting_agent"})
SET a.resource_limit_memory_mb = 1024,         // Maximum memory usage in MB
    a.resource_limit_cpu_ms = 60000,           // Maximum CPU time in milliseconds
    a.rate_limit_requests_per_min = 60         // Maximum requests per minute
```

What this does:
- Finds an agent node
- Sets limits on how much memory and CPU time it can use
- Controls how many requests can be made per minute to prevent overload

## Querying Your Knowledge Graph

Once you've created nodes and relationships, you can query your knowledge graph to find information:

### 1. Finding All Agents in a Knowledge Graph

```cypher
MATCH (kg:KnowledgeGraph {name: "economics_kg"})-[:CONTAINS]->(a:Agent)
RETURN a.name, a.description, a.agent_type
```

What this does:
- Finds the knowledge graph with the specified name
- Follows CONTAINS relationships to agent nodes
- Returns the name, description, and type of each agent

### 2. Finding Related Concepts

```cypher
MATCH (c:Concept {name: "inflation"})-[r:RELATES_TO]->(related:Concept)
RETURN related.name, r.relationship_type, r.strength
ORDER BY r.strength DESC
```

What this does:
- Starts with the concept "inflation"
- Follows RELATES_TO relationships to other concepts
- Returns information about related concepts, sorted by relationship strength

### 3. Finding Paths Between Concepts

```cypher
MATCH path = shortestPath(
  (start:Concept {name: "inflation"})-[*1..3]->(end:Concept {name: "unemployment"})
)
RETURN path
```

What this does:
- Finds the shortest path between two concepts
- Limits the search to paths with 1-3 relationships
- Returns the entire path for visualization or further processing

## Step-by-Step Examples

### Example 1: Creating an Economics Knowledge Graph

Let's create a simple economics knowledge graph with concepts and relationships:

1. **Create the knowledge graph node**:
   ```cypher
   CREATE (kg:KnowledgeGraph {
     name: "economics_kg",
     domain: "economics",
     description: "Knowledge graph for economic concepts and relationships"
   })
   ```

2. **Add economic concepts**:
   ```cypher
   CREATE (c1:Concept {name: "inflation", description: "Rising prices and falling purchasing power"})
   CREATE (c2:Concept {name: "interest_rates", description: "Cost of borrowing money"})
   CREATE (c3:Concept {name: "unemployment", description: "Measure of people without jobs"})
   CREATE (c4:Concept {name: "gdp", description: "Gross Domestic Product - measure of economic output"})
   ```

3. **Connect concepts with relationships**:
   ```cypher
   MATCH (kg:KnowledgeGraph {name: "economics_kg"})
   MATCH (c:Concept)
   WHERE c.name IN ["inflation", "interest_rates", "unemployment", "gdp"]
   CREATE (kg)-[:CONTAINS]->(c)
   ```

4. **Create relationships between concepts**:
   ```cypher
   MATCH (inflation:Concept {name: "inflation"})
   MATCH (interest:Concept {name: "interest_rates"})
   MATCH (unemployment:Concept {name: "unemployment"})
   MATCH (gdp:Concept {name: "gdp"})
   
   CREATE (inflation)-[:AFFECTS {strength: 0.8}]->(interest)
   CREATE (inflation)-[:AFFECTS {strength: 0.6}]->(unemployment)
   CREATE (unemployment)-[:AFFECTS {strength: 0.7}]->(gdp)
   CREATE (interest)-[:AFFECTS {strength: 0.5}]->(gdp)
   ```

5. **Create an agent that works with these concepts**:
   ```cypher
   CREATE (a:Agent {
     name: "economic_analyzer",
     description: "Analyzes economic indicators and their relationships",
     agent_type: "llm"
   })
   
   MATCH (kg:KnowledgeGraph {name: "economics_kg"})
   MATCH (a:Agent {name: "economic_analyzer"})
   CREATE (kg)-[:CONTAINS]->(a)
   ```

6. **Query to find how all concepts relate to GDP**:
   ```cypher
   MATCH path = (c:Concept)-[r:AFFECTS*1..2]->(gdp:Concept {name: "gdp"})
   RETURN path
   ```

### Example 2: Building a Security-Focused Agent

Let's create an agent with security features:

1. **Create the agent**:
   ```cypher
   CREATE (a:Agent {
     name: "secure_economic_forecaster",
     description: "Forecasts economic trends with enhanced security",
     agent_type: "llm",
     effectiveness_threshold: 0.9
   })
   ```

2. **Add the agent to a knowledge graph**:
   ```cypher
   MATCH (kg:KnowledgeGraph {name: "economics_kg"})
   MATCH (a:Agent {name: "secure_economic_forecaster"})
   CREATE (kg)-[:CONTAINS {
     permission_level: "write",
     created_at: datetime()
   }]->(a)
   ```

3. **Add security features**:
   ```cypher
   MATCH (a:Agent {name: "secure_economic_forecaster"})
   SET a.input_validation_enabled = true,
       a.input_max_length = 5000,
       a.input_allowed_chars = "^[a-zA-Z0-9\\s\\.,\\-\\(\\)]*$",
       a.input_timeout_ms = 20000,
       a.resource_limit_memory_mb = 512,
       a.resource_limit_cpu_ms = 30000,
       a.rate_limit_requests_per_min = 30,
       a.security_audit_enabled = true
   ```

4. **Connect the agent to relevant concepts**:
   ```cypher
   MATCH (a:Agent {name: "secure_economic_forecaster"})
   MATCH (c:Concept)
   WHERE c.name IN ["inflation", "interest_rates", "gdp"]
   CREATE (a)-[:USES_CONCEPT {
     access_level: "read",
     created_at: datetime()
   }]->(c)
   ```

5. **Query to check the agent's security settings**:
   ```cypher
   MATCH (a:Agent {name: "secure_economic_forecaster"})
   RETURN a.name,
          a.input_validation_enabled,
          a.input_max_length,
          a.resource_limit_memory_mb,
          a.rate_limit_requests_per_min
   ```

## Best Practices for Beginners

1. **Start Small**
   - Begin with a focused domain
   - Add a few key concepts and relationships
   - Expand gradually as you get comfortable

2. **Design Before Implementation**
   - Sketch your knowledge graph on paper first
   - Identify the main concepts and how they relate
   - Plan your node types and relationship structure

3. **Use Consistent Naming**
   - Use snake_case for property names (e.g., `resource_limit_memory_mb`)
   - Use CamelCase for node labels (e.g., `KnowledgeGraph`)
   - Use UPPERCASE with underscores for relationship types (e.g., `RELATES_TO`)

4. **Add Security from the Beginning**
   - Always enable input validation
   - Set appropriate resource limits
   - Don't leave sensitive access unprotected

5. **Document Your Structure**
   - Keep notes on your node types and their purposes
   - Document which relationships can exist between which nodes
   - Maintain a glossary of terms used in your knowledge graph

## Common Errors and How to Fix Them

### Error: Node Not Found

**Problem**: `Cannot merge node using null property value for name`

**Solution**: Make sure you're using the correct node name in your MATCH statement:
```cypher
// Check if the node exists first
MATCH (c:Concept {name: "inflation"})
RETURN c
```

### Error: Relationship Type Mismatch

**Problem**: `Type mismatch: expected String but was Float`

**Solution**: Make sure property values match their expected types:
```cypher
// Use a string value for a string property
CREATE (c1)-[r:RELATES_TO {strength: 0.8, description: "Strong correlation"}]->(c2)
```

### Error: Property Doesn't Exist

**Problem**: `Unknown property key 'age' for node with labels Concept`

**Solution**: Double-check your property names and that the node has that property:
```cypher
// Add the property if it doesn't exist
MATCH (c:Concept {name: "inflation"})
SET c.importance = 5
```

## Next Steps

Now that you understand the basics of knowledge graphs in SafeAI, you might want to:

1. Learn about [Cypher queries](cypher/queries.md) for more advanced graph operations
2. Explore [node creation patterns](cypher/nodes.md) for different types of nodes
3. Study [relationship types](cypher/relationships.md) for connecting nodes effectively
4. Try the [Management Console](gui/management-console.md) for a visual interface to your knowledge graphs

Remember that knowledge graphs are powerful tools for organizing information, but they require thoughtful design. Start with a clear goal, build incrementally, and focus on creating meaningful relationships between your nodes. 