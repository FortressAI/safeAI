#!/bin/bash

# Build and start the containers
echo "Starting Docker Compose services..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Run Neo4j plugin setup
echo "Setting up Neo4j plugin..."
./setup-neo4j.sh

echo "Deployment completed!"
echo "Access points:"
echo "- SafeAI GUI: http://localhost:3001"
echo "- Documentation: http://localhost:8080"
echo "- Neo4j Browser: http://localhost:7474"
echo "- Neo4j Bolt: bolt://localhost:7687" 