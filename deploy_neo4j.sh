#!/bin/bash
# deploy_neo4j.sh: Script to load KG JSON files into Neo4j

# Usage: ./deploy_neo4j.sh <neo4j_username> <neo4j_password> <neo4j_bolt_uri>
# Example: ./deploy_neo4j.sh neo4j password bolt://localhost:7687

if [ $# -ne 3 ]; then
  echo "Usage: $0 <neo4j_username> <neo4j_password> <neo4j_bolt_uri>"
  exit 1
fi

USERNAME=$1
PASSWORD=$2
BOLT_URI=$3

# Load all KG JSON files into Neo4j by invoking the custom plugin procedure safeai.loadKGFile
for file in $(find safeAI-plugin/src/main/resources -type f -name "*_KG.json")
do
  echo "Loading $file into Neo4j..."
  cypher-shell -u $USERNAME -p $PASSWORD -a $BOLT_URI "CALL safeai.loadKGFile('$file')"
done
