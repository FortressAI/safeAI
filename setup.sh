#!/bin/bash

# Create directories
mkdir -p plugin/neo4j/{data,logs,import,plugins}
mkdir -p plugin/target
mkdir -p gui
mkdir -p docs

# Create dummy plugin
touch plugin/target/safeAI-plugin.jar

# Create docker-compose files
echo 'version: "3.8"

services:
  neo4j:
    image: neo4j:latest
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      - NEO4J_AUTH=neo4j/password
      - NEO4J_apoc_export_file_enabled=true
      - NEO4J_apoc_import_file_enabled=true
      - NEO4J_apoc_import_file_use__neo4j__config=true
    volumes:
      - ./neo4j/data:/data
      - ./neo4j/logs:/logs
      - ./neo4j/import:/var/lib/neo4j/import
      - ./neo4j/plugins:/plugins
    networks:
      - safeai-network

networks:
  safeai-network:
    external: true' > plugin/docker-compose.yml

echo 'version: "3.8"

services:
  gui:
    image: nginx:alpine
    ports:
      - "3001:80"
    volumes:
      - ./:/usr/share/nginx/html
    networks:
      - safeai-network

networks:
  safeai-network:
    external: true' > gui/docker-compose.yml

echo 'version: "3.8"

services:
  docs:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./:/usr/share/nginx/html
    networks:
      - safeai-network

networks:
  safeai-network:
    external: true' > docs/docker-compose.yml

# Create dummy content
echo '<!DOCTYPE html>
<html>
<head>
    <title>SafeAI GUI</title>
</head>
<body>
    <h1>SafeAI GUI Placeholder</h1>
</body>
</html>' > gui/index.html

echo '<!DOCTYPE html>
<html>
<head>
    <title>SafeAI Documentation</title>
</head>
<body>
    <h1>SafeAI Documentation Placeholder</h1>
</body>
</html>' > docs/index.html

chmod +x deploy.sh 