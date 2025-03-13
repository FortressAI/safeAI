#!/bin/bash

# Build the plugin with Maven
echo "Building plugin..."
mvn clean package || { echo "Build failed"; exit 1; }

# Create the neo4j-plugins folder if it doesn't exist
mkdir -p neo4j-plugins

# Copy the jar from the target folder to neo4j-plugins
JAR=$(ls target/*.jar | grep -v "sources\|javadoc\|original" | head -n 1)
if [ -z "$JAR" ]; then
  echo "Jar file not found. Exiting."
  exit 1
fi
echo "Copying $JAR to neo4j-plugins/"
cp "$JAR" neo4j-plugins/

# Stop any existing containers and remove volumes
echo "Stopping existing containers..."
docker-compose down -v

# Start the containers
echo "Starting Neo4j container..."
docker-compose up -d

echo "Neo4j container deployed. Access Neo4j Browser at http://localhost:7474"
echo "Waiting for Neo4j to start..."

# Wait for Neo4j to start (up to 60 seconds)
for i in {1..12}; do
  if docker logs neo4j-safeai 2>&1 | grep -q "Remote interface available at"; then
    echo "Neo4j started successfully."
    break
  fi
  if [ $i -eq 12 ]; then
    echo "Timed out waiting for Neo4j to start."
    exit 1
  fi
  echo "Waiting... ($i/12)"
  sleep 5
done

# Wait a bit more to ensure procedures are loaded
echo "Waiting for procedures to load..."
sleep 10

echo "Verifying plugin installation..."

# Check if plugin is loaded
echo "Checking plugin files..."
docker exec neo4j-safeai ls -la /plugins

# Check available procedures
echo "Checking available procedures..."
PROCEDURES=$(docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "SHOW PROCEDURES YIELD name WHERE name CONTAINS 'safeai' RETURN name;")
if [ -z "$PROCEDURES" ]; then
  echo "No SafeAI procedures found. Plugin may not be loaded correctly."
  exit 1
fi
echo "Found procedures: $PROCEDURES"

# Check available functions
echo "Checking available functions..."
FUNCTIONS=$(docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "SHOW FUNCTIONS YIELD name WHERE name CONTAINS 'safeai' RETURN name;")
if [ -z "$FUNCTIONS" ]; then
  echo "No SafeAI functions found. Plugin may not be loaded correctly."
  exit 1
fi
echo "Found functions: $FUNCTIONS"

# Test basic functionality
echo "Testing basic functionality..."
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "CALL safeai.debug.hello('Neo4j Test') YIELD value RETURN value;" || { echo "Basic functionality test failed"; exit 1; }

# Initialize the database
echo "Initializing database..."
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "CREATE CONSTRAINT unique_kg_name IF NOT EXISTS FOR (kg:KnowledgeGraph) REQUIRE kg.name IS UNIQUE;"
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "CREATE CONSTRAINT unique_agent_name IF NOT EXISTS FOR (a:Agent) REQUIRE a.name IS UNIQUE;"
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "CREATE CONSTRAINT unique_capability_name IF NOT EXISTS FOR (c:Capability) REQUIRE c.name IS UNIQUE;"

# Load and verify KG files
echo "Loading Knowledge Graph files..."
KG_LOAD_RESULT=$(docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "CALL safeai.debug.loadKGFiles() YIELD value RETURN value;")
echo "$KG_LOAD_RESULT"

# Verify KG loading
echo "Verifying Knowledge Graph loading..."
KG_COUNT=$(docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "MATCH (kg:KnowledgeGraph) RETURN count(kg) as count;")
if [[ $KG_COUNT == *"0"* ]]; then
  echo "No Knowledge Graphs were loaded. Please check the logs for errors."
  exit 1
fi

AGENT_COUNT=$(docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "MATCH (a:Agent) RETURN count(a) as count;")
echo "Found $AGENT_COUNT agents"

CAPABILITY_COUNT=$(docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "MATCH (c:Capability) RETURN count(c) as count;")
echo "Found $CAPABILITY_COUNT capabilities"

RELATIONSHIP_COUNT=$(docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "MATCH ()-[r:RELATES_TO]->() RETURN count(r) as count;")
echo "Found $RELATIONSHIP_COUNT relationships"

# Verify KG structure
echo "Verifying Knowledge Graph structure..."
STRUCTURE_CHECK=$(docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "
MATCH (kg:KnowledgeGraph)
OPTIONAL MATCH (kg)-[:HAS_AGENT]->(a:Agent)
OPTIONAL MATCH (kg)-[:HAS_CAPABILITY]->(c:Capability)
OPTIONAL MATCH (a)-[:HAS_CAPABILITY]->(c)
WITH kg.name as name,
     count(DISTINCT a) as agents,
     count(DISTINCT c) as capabilities,
     count(DISTINCT (a)-[:HAS_CAPABILITY]->(c)) as agent_capabilities
RETURN name, agents, capabilities, agent_capabilities
ORDER BY name;")
echo "Knowledge Graph Structure:"
echo "$STRUCTURE_CHECK"

# Test Groovy integration
echo "Testing Groovy integration..."
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "CALL safeai.debug.testGroovyIntegration() YIELD value RETURN value;" || { echo "Groovy integration test failed"; exit 1; }

# Test LLM integration
echo "Testing LLM integration..."
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "CALL safeai.debug.testLLMIntegration() YIELD value RETURN value;" || { echo "LLM integration test failed"; exit 1; }

# Test governance functions
echo "Testing governance functions..."
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "RETURN safeai.governance.initiateVote('test-proposal') AS result;" || { echo "Governance function test failed"; exit 1; }
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "RETURN safeai.governance.recordVote('test-proposal', 1) AS result;" || { echo "Governance function test failed"; exit 1; }

echo "Deployment completed successfully!"
echo "Access Neo4j Browser at http://localhost:7474 with username 'neo4j' and password 'testpassword'"
echo "Knowledge Graphs have been loaded and verified."
