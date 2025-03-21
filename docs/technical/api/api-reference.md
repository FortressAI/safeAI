# SafeAI API Reference
This document provides detailed information about the SafeAI platform's API endpoints, authentication, and usage.

## Table of Contents
1. [Authentication](#authentication)
2. [Base URL](#base-url)
3. [Endpoints](#endpoints)
4. [Rate Limits](#rate-limits)
5. [Error Handling](#error-handling)
6. [Examples](#examples)

## Authentication
All API requests require authentication using a Bearer token:

```http
Authorization: Bearer <your-api-key>
```

### Obtaining an API Key
1. Log in to the SafeAI Management Console
2. Navigate to Settings > API Keys
3. Click "Generate New Key"
4. Copy and securely store your API key

## Base URL
```
https://api.safeAIcoin.com/v1
```

## Endpoints

### Agents

#### List Agents
```http
GET /agents
```

**Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page
- `type` (optional): Filter by agent type
- `status` (optional): Filter by agent status

**Response:**
```json
{
  "agents": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "status": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

#### Get Agent Details
```http
GET /agents/{agent_id}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "type": "string",
  "status": "string",
  "configuration": {
    "model": "string",
    "parameters": "object"
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Create Agent
```http
POST /agents
```

**Request Body:**
```json
{
  "name": "string",
  "type": "string",
  "configuration": {
    "model": "string",
    "parameters": "object"
  }
}
```

### Knowledge Graphs

#### Query Graph
```http
POST /knowledge-graph/query
```

**Request Body:**
```json
{
  "query": "string",
  "parameters": "object"
}
```

**Response:**
```json
{
  "results": "array",
  "metadata": {
    "execution_time": "number",
    "nodes_accessed": "number"
  }
}
```

#### Get Graph Schema
```http
GET /knowledge-graph/schema
```

**Response:**
```json
{
  "nodes": [
    {
      "type": "string",
      "properties": "array"
    }
  ],
  "relationships": [
    {
      "type": "string",
      "start": "string",
      "end": "string",
      "properties": "array"
    }
  ]
}
```

### Content Publishing

#### Publish Content
```http
POST /content
```

**Request Body:**
```json
{
  "title": "string",
  "content": "string",
  "license": "string",
  "visibility": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "hash": "string",
  "transaction_id": "string",
  "created_at": "timestamp"
}
```

#### Get Content
```http
GET /content/{content_id}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "license": "string",
  "visibility": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## Rate Limits
- Free tier: 100 requests per minute
- Pro tier: 1000 requests per minute
- Enterprise tier: Custom limits

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1623456789
```

## Error Handling
All errors follow this format:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

Common error codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Examples

### Python
```python
import requests

API_KEY = "your-api-key"
BASE_URL = "https://api.safeAIcoin.com/v1"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# List agents
response = requests.get(f"{BASE_URL}/agents", headers=headers)
agents = response.json()

# Create agent
agent_data = {
    "name": "My Agent",
    "type": "general",
    "configuration": {
        "model": "gpt-4",
        "parameters": {
            "temperature": 0.7
        }
    }
}
response = requests.post(f"{BASE_URL}/agents", headers=headers, json=agent_data)
new_agent = response.json()
```

### JavaScript
```javascript
const API_KEY = "your-api-key";
const BASE_URL = "https://api.safeAIcoin.com/v1";

const headers = {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
};

// List agents
fetch(`${BASE_URL}/agents`, { headers })
    .then(response => response.json())
    .then(agents => console.log(agents));

// Create agent
const agentData = {
    name: "My Agent",
    type: "general",
    configuration: {
        model: "gpt-4",
        parameters: {
            temperature: 0.7
        }
    }
};

fetch(`${BASE_URL}/agents`, {
    method: "POST",
    headers,
    body: JSON.stringify(agentData)
})
    .then(response => response.json())
    .then(newAgent => console.log(newAgent));
```

## Support
For API support:
1. Check our [API Status Page](https://status.safeAIcoin.com)
2. Join our [Developer Discord](https://discord.gg/safeai)
3. Contact api-support@safeAIcoin.com 