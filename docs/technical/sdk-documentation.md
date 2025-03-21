# SafeAI SDK Documentation
This guide provides comprehensive documentation for the SafeAI Software Development Kit (SDK), enabling developers to integrate SafeAI functionality into their applications.
## Table of Contents
1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Core Features](#core-features)
4. [Advanced Usage](#advanced-usage)
5. [Examples](#examples)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
## Installation
### Python
```bash
pip install safeai-sdk
```
### JavaScript/TypeScript
```bash
npm install @safeai/sdk
# or
yarn add @safeai/sdk
```
### Java
```xml
<dependency>
    <groupId>com.safeai</groupId>
    <artifactId>safeai-sdk</artifactId>
    <version>1.0.0</version>
</dependency>
```
## Quick Start
### Python
```python
from safeai import SafeAI

# Initialize the SDK
safeai = SafeAI(api_key="your-api-key")

# Create an agent
agent = safeai.agents.create(
    name="My Agent",
    type="general",
    configuration={
        "model": "gpt-4",
        "parameters": {"temperature": 0.7}
    }
)

# Query the knowledge graph
results = safeai.knowledge_graph.query(
    "MATCH (n) WHERE n.type = 'concept' RETURN n"
)

# Publish content
content = safeai.content.publish(
    title="My Article",
    content="Article content...",
    license="MIT"
)
```
### JavaScript
```javascript
import { SafeAI } from '@safeai/sdk';

// Initialize the SDK
const safeai = new SafeAI({
    apiKey: 'your-api-key'
});

// Create an agent
const agent = await safeai.agents.create({
    name: 'My Agent',
    type: 'general',
    configuration: {
        model: 'gpt-4',
        parameters: { temperature: 0.7 }
    }
});

// Query the knowledge graph
const results = await safeai.knowledgeGraph.query(
    'MATCH (n) WHERE n.type = "concept" RETURN n'
);

// Publish content
const content = await safeai.content.publish({
    title: 'My Article',
    content: 'Article content...',
    license: 'MIT'
});
```
## Core Features
### Agent Management
```python
# List agents
agents = safeai.agents.list()

# Get agent details
agent = safeai.agents.get(agent_id="agent-123")

# Update agent
updated_agent = safeai.agents.update(
    agent_id="agent-123",
    configuration={"temperature": 0.8}
)

# Delete agent
safeai.agents.delete(agent_id="agent-123")
```
### Knowledge Graph Operations
```python
# Execute Cypher query
results = safeai.knowledge_graph.query(
    query="MATCH (n) RETURN n LIMIT 10",
    parameters={"limit": 10}
)

# Get graph schema
schema = safeai.knowledge_graph.get_schema()

# Create node
node = safeai.knowledge_graph.create_node(
    labels=["Concept"],
    properties={"name": "AI", "type": "technology"}
)

# Create relationship
relationship = safeai.knowledge_graph.create_relationship(
    start_node_id="node-1",
    end_node_id="node-2",
    type="RELATES_TO",
    properties={"weight": 1.0}
)
```
### Content Management
```python
# Publish content
content = safeai.content.publish(
    title="My Article",
    content="Article content...",
    license="MIT",
    visibility="public"
)

# Get content
content = safeai.content.get(content_id="content-123")

# Update content
updated_content = safeai.content.update(
    content_id="content-123",
    content="Updated content..."
)

# Delete content
safeai.content.delete(content_id="content-123")
```
## Advanced Usage
### Event Handling
```python
# Subscribe to agent events
safeai.agents.on("status_change", lambda event: print(f"Agent {event.agent_id} status changed to {event.status}"))

# Subscribe to content events
safeai.content.on("published", lambda event: print(f"Content {event.content_id} published"))
```
### Batch Operations
```python
# Batch create nodes
nodes = safeai.knowledge_graph.batch_create_nodes([
    {"labels": ["Concept"], "properties": {"name": "AI"}},
    {"labels": ["Concept"], "properties": {"name": "ML"}}
])

# Batch create relationships
relationships = safeai.knowledge_graph.batch_create_relationships([
    {
        "start_node_id": "node-1",
        "end_node_id": "node-2",
        "type": "RELATES_TO"
    }
])
```
### Error Handling
```python
try:
    agent = safeai.agents.create(...)
except SafeAIError as e:
    print(f"Error creating agent: {e.message}")
    if e.code == "RATE_LIMIT_EXCEEDED":
        print("Please wait before trying again")
```
## Examples
### Complete Agent Workflow
```python
from safeai import SafeAI

def main():
    # Initialize SDK
    safeai = SafeAI(api_key="your-api-key")
    
    try:
        # Create agent
        agent = safeai.agents.create(
            name="Research Assistant",
            type="research",
            configuration={
                "model": "gpt-4",
                "parameters": {"temperature": 0.7}
            }
        )
        
        # Query knowledge graph
        results = safeai.knowledge_graph.query(
            "MATCH (n:Research) RETURN n LIMIT 5"
        )
        
        # Process results
        for node in results:
            print(f"Found research: {node.properties['title']}")
            
        # Publish findings
        content = safeai.content.publish(
            title="Research Summary",
            content="Summary of findings...",
            license="MIT"
        )
        
    except SafeAIError as e:
        print(f"Error: {e.message}")
    finally:
        # Cleanup
        safeai.agents.delete(agent.id)

if __name__ == "__main__":
    main()
```
### Content Publishing Workflow
```python
from safeai import SafeAI

def publish_article():
    safeai = SafeAI(api_key="your-api-key")
    
    try:
        # Create content
        content = safeai.content.publish(
            title="AI Ethics Guide",
            content="Content about AI ethics...",
            license="MIT",
            visibility="public"
        )
        
        # Add to knowledge graph
        node = safeai.knowledge_graph.create_node(
            labels=["Article"],
            properties={
                "id": content.id,
                "title": content.title,
                "author": "Your Name"
            }
        )
        
        print(f"Published article: {content.id}")
        return content.id
        
    except SafeAIError as e:
        print(f"Error publishing article: {e.message}")
        return None

if __name__ == "__main__":
    article_id = publish_article()
```
## Best Practices
### API Key Management
```python
# Use environment variables
import os
from safeai import SafeAI

api_key = os.getenv("SAFEAI_API_KEY")
safeai = SafeAI(api_key=api_key)
```
### Rate Limiting
```python
from safeai import SafeAI, RateLimitError

def create_agent_with_retry(safeai, max_retries=3):
    for attempt in range(max_retries):
        try:
            return safeai.agents.create(...)
        except RateLimitError:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)  # Exponential backoff
```
### Error Handling
```python
from safeai import SafeAI, SafeAIError

def safe_operation():
    safeai = SafeAI(api_key="your-api-key")
    
    try:
        result = safeai.some_operation()
        return result
    except SafeAIError as e:
        if e.code == "NOT_FOUND":
            print("Resource not found")
        elif e.code == "UNAUTHORIZED":
            print("Authentication failed")
        else:
            print(f"Unexpected error: {e.message}")
        return None
```
## Troubleshooting
### Common Issues
1. **Authentication Errors**
   - Verify API key is correct
   - Check API key permissions
   - Ensure API key is active
2. **Rate Limiting**
   - Implement exponential backoff
   - Monitor rate limit headers
   - Consider upgrading tier
3. **Network Issues**
   - Check internet connection
   - Verify API endpoint
   - Check firewall settings
### Getting Help
1. Check [API Status](https://status.safeAIcoin.com)
2. Join [Developer Discord](https://discord.gg/safeai)
3. Contact support@safeAIcoin.com
## Support
For SDK support:
1. Visit [SDK Documentation](https://docs.safeAIcoin.com/sdk)
2. Join [Developer Community](https://community.safeAIcoin.com)
3. Contact sdk-support@safeAIcoin.com 