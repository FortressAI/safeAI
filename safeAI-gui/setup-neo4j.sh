#!/bin/bash

# Wait for Neo4j to be ready
echo "Waiting for Neo4j to be ready..."
until curl -s http://localhost:7474 > /dev/null; do
    sleep 1
done

# Create plugins directory if it doesn't exist
mkdir -p neo4j-plugins

# Check if plugin files exist
if [ -d "../safeAI-neo4j-plugin/target" ] && [ -f "../safeAI-neo4j-plugin/target/"*.jar ]; then
    echo "Found Neo4j plugin files, copying to plugins directory..."
    cp -r ../safeAI-neo4j-plugin/target/*.jar neo4j-plugins/
else
    echo "Warning: Neo4j plugin files not found in ../safeAI-neo4j-plugin/target/"
    echo "Please build the plugin first or ensure it's in the correct location."
    echo "Continuing without plugin installation..."
fi

# Restart Neo4j container to load the plugin
echo "Restarting Neo4j container..."
docker-compose restart neo4j

echo "Neo4j setup completed!" 