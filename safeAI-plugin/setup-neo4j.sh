#!/bin/bash

# Wait for Neo4j to be ready
until curl -s http://localhost:7474 > /dev/null; do
    echo "Waiting for Neo4j to be ready..."
    sleep 1
done

# Create initial database
cypher-shell -u neo4j -p password "CREATE DATABASE safeai IF NOT EXISTS"

# Set default database
cypher-shell -u neo4j -p password "ALTER SYSTEM SET server.default_database = 'safeai'"

# Create constraints and indexes
cypher-shell -u neo4j -p password "CREATE CONSTRAINT agent_id IF NOT EXISTS FOR (a:Agent) REQUIRE a.id IS UNIQUE"
cypher-shell -u neo4j -p password "CREATE CONSTRAINT knowledge_graph_id IF NOT EXISTS FOR (kg:KnowledgeGraph) REQUIRE kg.id IS UNIQUE"
cypher-shell -u neo4j -p password "CREATE CONSTRAINT task_id IF NOT EXISTS FOR (t:Task) REQUIRE t.id IS UNIQUE"

# Create indexes for better query performance
cypher-shell -u neo4j -p password "CREATE INDEX agent_name IF NOT EXISTS FOR (a:Agent) ON (a.name)"
cypher-shell -u neo4j -p password "CREATE INDEX knowledge_graph_name IF NOT EXISTS FOR (kg:KnowledgeGraph) ON (kg.name)"
cypher-shell -u neo4j -p password "CREATE INDEX task_status IF NOT EXISTS FOR (t:Task) ON (t.status)"

echo "Neo4j setup completed successfully" 