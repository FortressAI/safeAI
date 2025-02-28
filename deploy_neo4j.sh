#!/bin/bash

# Build the plugin with Maven
mvn clean package || { echo "Build failed"; exit 1; }

# Create the neo4j-plugins folder if it doesn't exist
mkdir -p neo4j-plugins

# Copy the jar from the target folder to neo4j-plugins
JAR=$(ls target/*.jar | head -n 1)
if [ -z "$JAR" ]; then
  echo "Jar file not found. Exiting."
  exit 1
fi
cp "$JAR" neo4j-plugins/

# Deploy a local blockchain for testing using Ganache-cli

echo "Deploying local blockchain..."

# Remove any existing blockchain container named ganache
docker rm -f ganache 2>/dev/null

# Run Ganache-CLI container on port 8545
docker run -d --name ganache -p8545:8545 trufflesuite/ganache-cli

# Wait a few seconds for the blockchain to start
sleep 5

echo "Local blockchain deployed successfully at http://localhost:8545"

# Remove any existing container named neo4j-test
docker rm -f neo4j-test 2>/dev/null

# Create a data folder for Neo4j if it doesn't exist
mkdir -p neo4j-data

# Deploy a new Neo4j container for testing
docker run -d --name neo4j-test \
  -p7474:7474 -p7687:7687 \
  -v "$(pwd)/neo4j-data":/data \
  -v "$(pwd)/neo4j-plugins":/var/lib/neo4j/plugins \
  -e NEO4J_dbms_security_procedures_unrestricted=safeai.* \
  -e NEO4J_dbms_security_procedures_allowlist=safeai.* \
  -e NEO4JLABS_PLUGINS='["apoc"]' \
  -e NEO4J_dbms_connector_bolt_listen__address=0.0.0.0:7687 \
  neo4j:latest

echo "Neo4j container deployed successfully. Access Neo4j Browser at http://localhost:7474"
