#!/bin/bash

# Create images directory if it doesn't exist
mkdir -p docs/images

# Function to extract and generate diagram
generate_diagram() {
    local file=$1
    local diagram_number=$2
    local output_name=$3
    
    # Extract the Mermaid diagram
    awk '/```mermaid/{f=1;next}/```/{f=0}f' "$file" | sed -n "${diagram_number}p" > "docs/images/${output_name}.mmd"
    
    # Generate the image
    mmdc -i "docs/images/${output_name}.mmd" -o "docs/images/${output_name}.png"
}

# UI Workflows
generate_diagram "docs/technical/ui/ui-workflows.md" 1 "ui-agent-management"
generate_diagram "docs/technical/ui/ui-workflows.md" 2 "ui-knowledge-graph"
generate_diagram "docs/technical/ui/ui-workflows.md" 3 "ui-content-publishing"

# Security Architecture
generate_diagram "docs/technical/security/security-architecture.md" 1 "security-network"
generate_diagram "docs/technical/security/security-architecture.md" 2 "security-access-control"

# Security Compliance
generate_diagram "docs/technical/security/security-compliance.md" 1 "compliance-access-control"
generate_diagram "docs/technical/security/security-compliance.md" 2 "compliance-data-protection"

# Security Operations
generate_diagram "docs/technical/security/security-operations.md" 1 "ops-incident-response"
generate_diagram "docs/technical/security/security-operations.md" 2 "ops-security-monitoring"

# Clean up temporary files
rm -f docs/images/*.mmd

echo "Diagram generation complete!" 