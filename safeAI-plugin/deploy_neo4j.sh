#!/bin/bash

# Build the plugin with Maven
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
docker-compose down -v

# Start the containers
docker-compose up -d

echo "Neo4j container deployed successfully. Access Neo4j Browser at http://localhost:7474"
echo "Waiting for Neo4j to start..."

# Wait for Neo4j to start (up to 60 seconds)
for i in {1..12}; do
  if docker logs neo4j-safeai 2>&1 | grep -q "Remote interface available at"; then
    echo "Neo4j started successfully."
    break
  fi
  if [ $i -eq 12 ]; then
    echo "Timed out waiting for Neo4j to start."
  fi
  echo "Waiting... ($i/12)"
  sleep 5
done

# Wait a bit more to ensure procedures are loaded
sleep 10

# Execute a default cypher command to initialize the Agent node in the database
# This command creates a default Agent node to verify that the Agents code is working correctly
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "CREATE (:Agent {name: 'DefaultAgent', created: timestamp()})"
echo "Default Agent node created."

echo "Checking Neo4j logs..."
docker logs neo4j-safeai

echo "Checking if plugin is loaded..."
docker exec neo4j-safeai ls -la /plugins

echo "Checking available procedures..."
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "SHOW PROCEDURES YIELD name WHERE name CONTAINS 'safeai' RETURN name;"

echo "Checking available functions..."
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "SHOW FUNCTIONS YIELD name WHERE name CONTAINS 'safeai' RETURN name;"

# Test if greeting procedure works
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "CALL safeai.debug.hello('Neo4j Test') YIELD output RETURN output;"
echo "Debug hello procedure executed."

# Test dynamic Groovy integration
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "CALL safeai.debug.testGroovyIntegration() YIELD output RETURN output;"
echo "Debug Groovy integration procedure executed."

# Test dynamic LLM integration
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "CALL safeai.debug.testLLMIntegration() YIELD output RETURN output;"
echo "Debug LLM integration procedure executed."

echo "Testing governance functions..."
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "RETURN safeai.governance.initiateVote('test-proposal') AS result;"
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "RETURN safeai.governance.recordVote('test-proposal', 1) AS result;"

echo "Checking all procedures and functions..."
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "SHOW PROCEDURES YIELD name, signature, description RETURN name, signature, description ORDER BY name;"
# Call the install procedure from the debug class to initialize plugin-specific data
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "CALL safeai.debug.loadAllKGs() YIELD output RETURN output;"
echo "Debug install procedure executed."

docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "SHOW FUNCTIONS YIELD name, signature, description RETURN name, signature, description ORDER BY name;"

echo "Done! Your plugin should now be available in Neo4j."
echo "Access Neo4j Browser at http://localhost:7474 with username 'neo4j' and password 'testpassword'"
