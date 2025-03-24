// Configuration for external services
export const config = {
  // Documentation URL
  docsUrl: process.env.REACT_APP_DOCS_URL || 'http://localhost:8080',
  
  // Neo4j Browser URL
  neo4jBrowserUrl: process.env.REACT_APP_NEO4J_BROWSER_URL || 'http://localhost:7474',
  
  // Neo4j Bolt URL
  neo4jBoltUrl: process.env.REACT_APP_NEO4J_BOLT_URL || 'bolt://localhost:7687',
  
  // Neo4j credentials
  neo4jUsername: process.env.REACT_APP_NEO4J_USERNAME || 'neo4j',
  neo4jPassword: process.env.REACT_APP_NEO4J_PASSWORD || 'safeai123',
  
  // API endpoints
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
    docs: '/docs',
    neo4j: '/neo4j'
  }
};

export default config; 