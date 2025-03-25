@echo off
echo Waiting for Neo4j to be ready...
:wait_loop
curl -s http://localhost:7474 > nul
if errorlevel 1 (
    timeout /t 1 /nobreak > nul
    goto wait_loop
)

echo Creating plugins directory...
if not exist "neo4j-plugins" mkdir neo4j-plugins

echo Checking for Neo4j plugin files...
if exist "..\safeAI-neo4j-plugin\target\*.jar" (
    echo Found Neo4j plugin files, copying to plugins directory...
    copy /Y "..\safeAI-neo4j-plugin\target\*.jar" "neo4j-plugins\"
) else (
    echo Warning: Neo4j plugin files not found in ..\safeAI-neo4j-plugin\target\
    echo Please build the plugin first or ensure it's in the correct location.
    echo Continuing without plugin installation...
)

echo Restarting Neo4j container...
docker compose restart neo4j

echo Neo4j setup completed! 