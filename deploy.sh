#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Set default values
NEO4J_PASSWORD=${NEO4J_PASSWORD:-"password"}
HTTP_PORT=${HTTP_PORT:-7474}
BOLT_PORT=${BOLT_PORT:-7687}
GUI_PORT=${GUI_PORT:-3001}
DOCS_PORT=${DOCS_PORT:-8080}
MAX_RETRY=12
RETRY_INTERVAL=5

# Function to display messages with timestamps
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function for error handling
error_exit() {
    log "ERROR: $1"
    exit 1
}

# Stop any existing containers
log "Stopping existing containers..."
docker-compose down

# Build the SafeAI Plugin
log "Building SafeAI Plugin..."
cd safeAI-plugin
./check_env.sh || exit 1
mvn clean package -DskipTests || error_exit "Plugin build failed"
mkdir -p neo4j-plugins
cp target/safeai-plugin-*.jar neo4j-plugins/
cd ..

# Build the GUI with Hardhat contracts
log "Building SafeAI GUI..."
cd safeAI-gui

# Install dependencies and compile contracts
log "Installing dependencies and compiling contracts..."
npm install
npx hardhat compile || error_exit "Contract compilation failed"

# Build the React app
log "Building React app..."
CI=false npm run build
cd ..

# Build and start all containers
log "Building and starting all containers..."
docker-compose build --no-cache
docker-compose up -d

# Wait for Neo4j to start
log "Waiting for Neo4j to start..."
STARTED=false
for i in $(seq 1 $MAX_RETRY); do
    if curl -s http://localhost:${HTTP_PORT} > /dev/null; then
        STARTED=true
        log "Neo4j started successfully."
        break
    fi
    log "Waiting... ($i/$MAX_RETRY)"
    sleep $RETRY_INTERVAL
done

if [ "$STARTED" = false ]; then
    error_exit "Timed out waiting for Neo4j to start. Check logs with: docker-compose logs safeai-plugin"
fi

# Initialize Neo4j with Knowledge Graphs
log "Initializing Neo4j with Knowledge Graphs..."
cd safeAI-plugin
./deploy_neo4j.sh
cd ..

log "All services are ready!"
echo "Access points:"
echo "- SafeAI GUI: http://localhost:${GUI_PORT}"
echo "- Documentation: http://localhost:${DOCS_PORT}"
echo "- Neo4j Browser: http://localhost:${HTTP_PORT}"
echo "- Neo4j Bolt: bolt://localhost:${BOLT_PORT}" 