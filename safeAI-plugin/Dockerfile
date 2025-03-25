# Build stage for the plugin
FROM maven:3.8.4-openjdk-19-slim AS build

WORKDIR /build
COPY pom.xml .
COPY src ./src

# Build the plugin
RUN mvn clean package

# Neo4j stage
FROM neo4j:4.4.42-enterprise

# Accept the license for enterprise edition
ENV NEO4J_ACCEPT_LICENSE_AGREEMENT=yes

# Copy plugin JAR
COPY --from=build /build/target/safeai-plugin-*.jar /var/lib/neo4j/plugins/

# Copy Neo4j configuration
COPY neo4j.conf /var/lib/neo4j/conf/

# Set environment variables for plugins
ENV NEO4J_dbms_security_procedures_unrestricted=apoc.*,safeai.*
ENV NEO4J_dbms_security_procedures_whitelist=apoc.*,safeai.*

# Install APOC and GDS plugins
RUN cd /var/lib/neo4j/plugins && \
    wget https://github.com/neo4j/apoc/releases/download/4.4.0.13/apoc-4.4.0.13-all.jar && \
    wget https://graphdatascience.ninja/neo4j-graph-data-science-2.4.1.jar

# Expose ports for HTTP, HTTPS and Bolt
EXPOSE 7474 7473 7687

# Set data directory
VOLUME /data

# Command to run Neo4j
CMD ["neo4j"] 