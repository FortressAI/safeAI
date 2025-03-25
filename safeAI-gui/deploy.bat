@echo off
echo Starting Docker Compose services...
docker compose up -d

echo Waiting for services to be ready...
timeout /t 10 /nobreak

echo Setting up Neo4j plugin...
call setup-neo4j.bat

echo Deployment completed!
echo Access points:
echo - SafeAI GUI: http://localhost:3001
echo - Documentation: http://localhost:8080
echo - Neo4j Browser: http://localhost:7474
echo - Neo4j Bolt: bolt://localhost:7687 