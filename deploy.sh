#!/bin/bash

# Build and start the containers with force rebuild
echo "Starting Docker Compose services with rebuild..."
docker-compose down

# Build and start GUI
echo "Building and starting GUI..."
cd safeAI-gui
docker-compose build --no-cache
docker-compose up -d
cd ..

# Build and start Plugin
echo "Building and starting Plugin..."
cd safeAI-plugin
docker-compose build --no-cache
docker-compose up -d
cd ..

# Build and start Docs
echo "Building and starting Documentation..."
cd docs
docker-compose build --no-cache
docker-compose up -d
cd ..

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 15

# Run Neo4j plugin setup
echo "Setting up Neo4j plugin..."
cd safeAI-plugin && ./setup-neo4j.sh && cd ..

echo "Deployment completed!"
echo "Access points:"
echo "- SafeAI GUI: http://localhost:3001"
echo "- Documentation: http://localhost:8080"
echo "- Neo4j Browser: http://localhost:7474"
echo "- Neo4j Bolt: bolt://localhost:7687" 