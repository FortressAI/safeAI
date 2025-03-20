#!/bin/bash

# SafeAI Neo4j Plugin Deployment Script (Production Ready)
# ------------------------------------------------------

# Exit immediately if a command exits with a non-zero status
set -e

# Set default values
CONTAINER_NAME=${CONTAINER_NAME:-"neo4j-safeai"}
NEO4J_VERSION=${NEO4J_VERSION:-"5.15.0"}
NEO4J_PASSWORD=${NEO4J_PASSWORD:-"password"}
HTTP_PORT=${HTTP_PORT:-7474}
BOLT_PORT=${BOLT_PORT:-7687}
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to clean up on error
cleanup_on_error() {
    log "Cleaning up after error..."
    docker stop ${CONTAINER_NAME} >/dev/null 2>&1 || true
    docker rm ${CONTAINER_NAME} >/dev/null 2>&1 || true
    log "Cleanup complete."
}

# Set trap for cleanup on error
trap cleanup_on_error ERR INT

# Check prerequisites
log "Checking prerequisites..."
command_exists docker || error_exit "Docker not installed. Please install Docker and try again."
command_exists mvn || error_exit "Maven not installed. Please install Maven and try again."

# Build the plugin with Maven
log "Building SafeAI plugin..."
mvn clean package || error_exit "Build failed. Please check Maven output for errors."

# Create the neo4j-plugins folder if it doesn't exist
mkdir -p neo4j-plugins

# Copy the jar from the target folder to neo4j-plugins
log "Locating plugin JAR..."
JAR=$(ls target/*.jar | grep -v "sources\|javadoc\|original" | head -n 1)
if [ -z "$JAR" ]; then
    error_exit "JAR file not found. Check if the build was successful."
fi

log "Copying $JAR to neo4j-plugins/"
cp "$JAR" neo4j-plugins/

# Stop any existing containers with the same name
if docker ps -a | grep -q ${CONTAINER_NAME}; then
    log "Stopping existing ${CONTAINER_NAME} container..."
    docker stop ${CONTAINER_NAME} >/dev/null 2>&1 || true
    docker rm ${CONTAINER_NAME} >/dev/null 2>&1 || true
fi

# Create configuration directory if it doesn't exist
mkdir -p config

# Ensure required config files exist
if [ ! -f "config/plugin-config.properties" ]; then
    log "WARNING: config/plugin-config.properties not found, creating default..."
    cat > config/plugin-config.properties << EOL
# Plugin Configuration for SafeAI Plugin (auto-generated)
openai.api.key=\${OPENAI_API_KEY}
admin.api.key=\${ADMIN_API_KEY}
blockchain.endpoint=\${BLOCKCHAIN_ENDPOINT:http://host.docker.internal:7545}
admin.wallet.key=\${ADMIN_WALLET_KEY}
llm.model=\${LLM_MODEL:gpt-4}
llm.temperature=\${LLM_TEMPERATURE:0.7}
llm.max_tokens=\${LLM_MAX_TOKENS:2000}
EOL
fi

# Start the Neo4j container
log "Starting Neo4j container with SafeAI plugin..."
CONTAINER_ID=$(docker run -d --name ${CONTAINER_NAME} \
    -p ${HTTP_PORT}:7474 -p ${BOLT_PORT}:7687 \
    -e NEO4J_AUTH=neo4j/${NEO4J_PASSWORD} \
    -e NEO4J_PLUGINS='["apoc", "graph-data-science"]' \
    -e NEO4J_dbms_security_procedures_unrestricted=apoc.*,gds.*,safeai.* \
    -e NEO4J_dbms_security_procedures_allowlist=apoc.*,gds.*,safeai.* \
    -e NEO4J_dbms_memory_heap_initial__size=512m \
    -e NEO4J_dbms_memory_heap_max__size=2G \
    -e OPENAI_API_KEY=${OPENAI_API_KEY} \
    -e ADMIN_API_KEY=${ADMIN_API_KEY} \
    -e BLOCKCHAIN_ENDPOINT=${BLOCKCHAIN_ENDPOINT} \
    -e ADMIN_WALLET_KEY=${ADMIN_WALLET_KEY} \
    -v $PWD/neo4j-plugins:/plugins \
    -v $PWD/config:/conf \
    --restart unless-stopped \
    neo4j:${NEO4J_VERSION})

if [ -z "$CONTAINER_ID" ]; then
    error_exit "Failed to start Neo4j container."
fi

log "Neo4j container started with ID: $CONTAINER_ID"
log "Access Neo4j Browser at http://localhost:${HTTP_PORT} (after startup)"
log "Waiting for Neo4j to start..."

# Wait for Neo4j to start
STARTED=false
for i in $(seq 1 $MAX_RETRY); do
    if docker logs ${CONTAINER_NAME} 2>&1 | grep -q "Remote interface available at"; then
        STARTED=true
        log "Neo4j started successfully."
        break
    fi
    log "Waiting... ($i/$MAX_RETRY)"
    sleep $RETRY_INTERVAL
done

if [ "$STARTED" = false ]; then
    error_exit "Timed out waiting for Neo4j to start. Check docker logs with: docker logs ${CONTAINER_NAME}"
fi

# Wait a bit more to ensure procedures are loaded
log "Waiting for procedures to load..."
sleep 10

# Verify plugin installation
log "Verifying plugin installation..."

# Check if plugin files are present
log "Checking plugin files..."
docker exec ${CONTAINER_NAME} ls -la /plugins

# Check available procedures
log "Checking available procedures..."
PROCEDURES=$(docker exec ${CONTAINER_NAME} cypher-shell -u neo4j -p ${NEO4J_PASSWORD} "SHOW PROCEDURES YIELD name WHERE name CONTAINS 'safeai' RETURN name;" 2>/dev/null)

if [ -z "$PROCEDURES" ]; then
    error_exit "No SafeAI procedures found. Plugin may not be loaded correctly."
fi
log "Found procedures: $PROCEDURES"

# Check available functions
log "Checking available functions..."
FUNCTIONS=$(docker exec ${CONTAINER_NAME} cypher-shell -u neo4j -p ${NEO4J_PASSWORD} "SHOW FUNCTIONS YIELD name WHERE name CONTAINS 'safeai' RETURN name;" 2>/dev/null)

if [ -z "$FUNCTIONS" ]; then
    log "WARNING: No SafeAI functions found. This may be expected if the plugin doesn't define functions."
fi

if [ -n "$FUNCTIONS" ]; then
    log "Found functions: $FUNCTIONS"
fi

# Test basic functionality
log "Testing basic functionality..."
docker exec ${CONTAINER_NAME} cypher-shell -u neo4j -p ${NEO4J_PASSWORD} "CALL safeai.debug.hello('Neo4j Test') YIELD value RETURN value;" || { 
    error_exit "Basic functionality test failed. Check if the debug procedure exists and is callable."
}

# Initialize the database with constraints
log "Initializing database with constraints..."
docker exec ${CONTAINER_NAME} cypher-shell -u neo4j -p ${NEO4J_PASSWORD} "CREATE CONSTRAINT unique_kg_name IF NOT EXISTS FOR (kg:KnowledgeGraph) REQUIRE kg.name IS UNIQUE;"
docker exec ${CONTAINER_NAME} cypher-shell -u neo4j -p ${NEO4J_PASSWORD} "CREATE CONSTRAINT unique_agent_name IF NOT EXISTS FOR (a:Agent) REQUIRE a.name IS UNIQUE;"
docker exec ${CONTAINER_NAME} cypher-shell -u neo4j -p ${NEO4J_PASSWORD} "CREATE CONSTRAINT unique_capability_name IF NOT EXISTS FOR (c:Capability) REQUIRE c.name IS UNIQUE;"

# Load and verify KG files
log "Loading Knowledge Graph files..."
KG_LOAD_RESULT=$(docker exec ${CONTAINER_NAME} cypher-shell -u neo4j -p ${NEO4J_PASSWORD} "CALL safeai.debug.loadKGFiles() YIELD value RETURN value;")
echo "$KG_LOAD_RESULT"

# Verify KG loading
log "Verifying Knowledge Graph loading..."
KG_COUNT=$(docker exec ${CONTAINER_NAME} cypher-shell -u neo4j -p ${NEO4J_PASSWORD} "MATCH (kg:KnowledgeGraph) RETURN count(kg) as count;")
if [[ $KG_COUNT == *"0"* ]]; then
    log "WARNING: No Knowledge Graphs were loaded. This may indicate an issue with KG files."
else
    log "Knowledge Graphs loaded successfully: $KG_COUNT"
fi

AGENT_COUNT=$(docker exec ${CONTAINER_NAME} cypher-shell -u neo4j -p ${NEO4J_PASSWORD} "MATCH (a:Agent) RETURN count(a) as count;")
log "Found $AGENT_COUNT agents"

CAPABILITY_COUNT=$(docker exec ${CONTAINER_NAME} cypher-shell -u neo4j -p ${NEO4J_PASSWORD} "MATCH (c:Capability) RETURN count(c) as count;")
log "Found $CAPABILITY_COUNT capabilities"

RELATIONSHIP_COUNT=$(docker exec ${CONTAINER_NAME} cypher-shell -u neo4j -p ${NEO4J_PASSWORD} "MATCH ()-[r:RELATES_TO]->() RETURN count(r) as count;")
log "Found $RELATIONSHIP_COUNT relationships"

# Perform production readiness check
log "Performing production readiness check..."
READINESS_CHECK=$(docker exec ${CONTAINER_NAME} cypher-shell -u neo4j -p ${NEO4J_PASSWORD} "CALL safeai.debug.checkProductionReadiness() YIELD value RETURN value;" 2>/dev/null || echo "Error: Production readiness check not available")

if [[ "$READINESS_CHECK" == *"Error"* ]]; then
    log "WARNING: Production readiness check not available or failed. This is not critical but recommended."
else 
    echo "Production Readiness Check Results:"
    echo "$READINESS_CHECK"
    
    # Check for production readiness errors
    if echo "$READINESS_CHECK" | grep -q "ERROR:"; then
        log "WARNING: Production readiness check found errors. Please address these before moving to production."
    else
        log "Production readiness check passed successfully."
    fi
fi

# Print connection details
log "----------------------------------------"
log "Deployment completed successfully!"
log "----------------------------------------"
log "Neo4j Browser: http://localhost:${HTTP_PORT}"
log "Bolt connection: bolt://localhost:${BOLT_PORT}"
log "Username: neo4j"
log "Password: ${NEO4J_PASSWORD}"
log "Container: ${CONTAINER_NAME}"
log "----------------------------------------"
log "To check logs: docker logs ${CONTAINER_NAME}"
log "To restart: docker restart ${CONTAINER_NAME}"
log "To stop: docker stop ${CONTAINER_NAME}"
log "To start: docker start ${CONTAINER_NAME}"
log "----------------------------------------"
