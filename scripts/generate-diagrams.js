const fs = require('fs');
const path = require('path');
const https = require('https');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../docs/images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to generate diagram using Mermaid Live Editor API
async function generateDiagram(diagram, outputFile) {
    const options = {
        hostname: 'mermaid.ink',
        path: `/svg/${encodeURIComponent(diagram)}`,
        method: 'GET'
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                fs.writeFileSync(outputFile, data);
                resolve();
            });
        });

        req.on('error', (error) => reject(error));
        req.end();
    });
}

// Diagrams to generate
const diagrams = [
    {
        name: 'ui-agent-management',
        content: `sequenceDiagram
    participant User
    participant UI
    participant AgentService
    participant Blockchain

    User->>UI: Open Agent Dashboard
    UI->>AgentService: Fetch Agent List
    AgentService->>Blockchain: Query Agent Registry
    Blockchain-->>AgentService: Return Agent Data
    AgentService-->>UI: Update Agent List
    UI-->>User: Display Agent Dashboard

    User->>UI: Select Agent
    UI->>UI: Show Agent Details
    User->>UI: Update Agent Settings
    UI->>AgentService: Validate Changes
    AgentService->>Blockchain: Update Agent
    Blockchain-->>AgentService: Confirm Update
    AgentService-->>UI: Update UI State
    UI-->>User: Show Success Message`
    },
    {
        name: 'security-network',
        content: `graph TD
    A[Client] -->|HTTPS| B[Load Balancer]
    B -->|WAF| C[API Gateway]
    C -->|Internal Network| D[Application Servers]
    D -->|Secure Connection| E[Database]
    D -->|Secure Connection| F[Blockchain]
    
    G[Security Monitoring] -->|Logs| B
    G -->|Logs| C
    G -->|Logs| D
    G -->|Alerts| H[Security Team]`
    },
    {
        name: 'security-access-control',
        content: `graph TD
    A[User] -->|Authentication| B[Identity Provider]
    B -->|JWT| C[API Gateway]
    C -->|RBAC| D[Application]
    D -->|Permissions| E[Resources]
    
    F[Audit Log] -->|Logs| B
    F -->|Logs| C
    F -->|Logs| D`
    },
    {
        name: 'ops-incident-response',
        content: `graph TD
    A[Incident Detection] -->|Alert| B[Initial Assessment]
    B -->|Triage| C[Response Team]
    C -->|Investigation| D[Root Cause]
    D -->|Resolution| E[Recovery]
    E -->|Review| F[Lessons Learned]
    
    G[Documentation] -->|Logs| B
    G -->|Logs| C
    G -->|Logs| D
    G -->|Logs| E`
    }
];

// Generate all diagrams
async function generateAllDiagrams() {
    for (const diagram of diagrams) {
        console.log(`Generating ${diagram.name}...`);
        await generateDiagram(
            diagram.content,
            path.join(imagesDir, `${diagram.name}.svg`)
        );
    }
    console.log('All diagrams generated successfully!');
}

generateAllDiagrams().catch(console.error); 