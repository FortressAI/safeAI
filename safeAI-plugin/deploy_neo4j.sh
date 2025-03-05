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

# Create docker-compose.yml file
cat > docker-compose.yml << 'EOL'
version: "3.8"

services:
  neo4j:
    image: neo4j:2025.01
    container_name: neo4j-safeai
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      - NEO4J_AUTH=neo4j/testpassword
      - NEO4J_apoc_export_file_enabled=true
      - NEO4J_apoc_import_file_enabled=true
      - NEO4J_apoc_import_file_use__neo4j__config=true
      - NEO4J_PLUGINS=["apoc"]
      - NEO4J_dbms_security_procedures_unrestricted=com.safeai.neo4jplugin.*,apoc.*
      - NEO4J_dbms_security_procedures_allowlist=com.safeai.neo4jplugin.*,apoc.*
    volumes:
      - neo4j_data:/data
      - neo4j_logs:/logs
      - neo4j_import:/var/lib/neo4j/import
      - ./neo4j-plugins:/plugins
    restart: on-failure

volumes:
  neo4j_data:
  neo4j_logs:
  neo4j_import:
EOL

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

echo "Checking Neo4j logs..."
docker logs neo4j-safeai

echo "Checking if plugin is loaded..."
docker exec neo4j-safeai ls -la /plugins

echo "Checking available procedures..."
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "CALL dbms.procedures() YIELD name WHERE name CONTAINS 'safeai' RETURN name;"

echo "Checking available functions..."
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "CALL dbms.functions() YIELD name WHERE name CONTAINS 'safeai' RETURN name;"

echo "Testing governance functions..."
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "RETURN safeai.governance.initiateVote('test-proposal') AS result;"
docker exec neo4j-safeai cypher-shell -u neo4j -p testpassword "RETURN safeai.governance.recordVote('test-proposal', 1) AS result;"

echo "Done! Your plugin should now be available in Neo4j."
echo "Access Neo4j Browser at http://localhost:7474 with username 'neo4j' and password 'testpassword'"
