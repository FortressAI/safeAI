#!/bin/bash

# Exit on error
set -e

# Function to display messages with timestamps
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Create network if it doesn't exist
log "Creating docker network..."
docker network create safeai-network 2>/dev/null || true

# Deploy Neo4j with plugin
log "Deploying Neo4j..."
cd plugin
docker-compose down -v 2>/dev/null || true
docker-compose up -d

# Wait for Neo4j
log "Waiting for Neo4j to start..."
sleep 10

# Deploy GUI
log "Deploying GUI..."
cd ../gui
docker-compose down -v 2>/dev/null || true
docker-compose up -d

# Deploy Documentation
log "Deploying Documentation..."
cd ../docs
docker-compose down -v 2>/dev/null || true
docker-compose up -d

log "Deployment completed! Services should be available at:"
log "- Neo4j Browser: http://localhost:7474"
log "- GUI: http://localhost:3001"
log "- Documentation: http://localhost:8080"

# Show running containers
log "Running containers:"
docker ps 