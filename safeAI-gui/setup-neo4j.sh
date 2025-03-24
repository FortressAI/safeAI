#!/bin/bash

# Wait for Neo4j to be ready
echo "Waiting for Neo4j to be ready..."
until curl -s http://localhost:7474 > /dev/null; do
    sleep 1
done

# Create plugins directory if it doesn't exist
mkdir -p neo4j-plugins

# Copy the plugin files to the plugins volume
cp -r ../safeAI-neo4j-plugin/target/*.jar neo4j-plugins/

# Restart Neo4j container to load the plugin
docker-compose restart neo4j

echo "Neo4j plugin setup completed!" 