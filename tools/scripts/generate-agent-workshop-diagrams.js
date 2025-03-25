const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure images directory exists
const imagesDir = path.join(__dirname, '../docs/images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to generate diagram using Mermaid CLI
function generateDiagram(content, filename) {
    const mmdFile = path.join(imagesDir, `${filename}.mmd`);
    const svgFile = path.join(imagesDir, `${filename}.svg`);
    
    // Write Mermaid content to temporary file
    fs.writeFileSync(mmdFile, content);
    
    try {
        // Generate SVG using Mermaid CLI
        execSync(`npx @mermaid-js/mermaid-cli -i ${mmdFile} -o ${svgFile}`);
        console.log(`Generated ${filename}`);
        
        // Clean up temporary file
        fs.unlinkSync(mmdFile);
    } catch (error) {
        console.error(`Error generating ${filename}:`, error);
        // Clean up temporary file even if generation fails
        if (fs.existsSync(mmdFile)) {
            fs.unlinkSync(mmdFile);
        }
    }
}

// Define diagrams to generate
const diagrams = [
    {
        name: 'agent-workshop-interface',
        content: `
graph TD
    A[Template Gallery] --> B[Agent Editor]
    B --> C[Capability Manager]
    C --> D[Security Controls]
    D --> E[Testing Environment]
    E --> F[Deployment Controls]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#fbb,stroke:#333,stroke-width:2px
    style E fill:#fbf,stroke:#333,stroke-width:2px
    style F fill:#bff,stroke:#333,stroke-width:2px
        `
    },
    {
        name: 'agent-template-categories',
        content: `
graph LR
    A[Template Gallery] --> B[Data Processing]
    A --> C[Security Monitoring]
    A --> D[Knowledge Query]
    A --> E[Creative]
    A --> F[Mathematical Reasoning]
    A --> G[Ethical Compliance]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#fbb,stroke:#333,stroke-width:2px
    style E fill:#fbf,stroke:#333,stroke-width:2px
    style F fill:#bff,stroke:#333,stroke-width:2px
    style G fill:#fbb,stroke:#333,stroke-width:2px
        `
    },
    {
        name: 'agent-capabilities',
        content: `
graph TD
    A[Capability Manager] --> B[Data Access]
    A --> C[Reasoning]
    A --> D[Communication]
    A --> E[Integration]
    A --> F[Security]
    A --> G[Compliance]
    
    B --> H[Knowledge Graph Query]
    C --> I[Logical Inference]
    D --> J[User Interaction]
    E --> K[External Systems]
    F --> L[Threat Detection]
    G --> M[Ethical Oversight]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#fbb,stroke:#333,stroke-width:2px
    style E fill:#fbf,stroke:#333,stroke-width:2px
    style F fill:#bff,stroke:#333,stroke-width:2px
    style G fill:#fbb,stroke:#333,stroke-width:2px
        `
    },
    {
        name: 'agent-security-controls',
        content: `
graph TD
    A[Security Controls] --> B[Access Control]
    A --> C[Resource Limits]
    A --> D[Rate Limiting]
    A --> E[Data Handling]
    A --> F[Audit Settings]
    A --> G[Blockchain Verification]
    
    B --> H[User Permissions]
    C --> I[CPU/Memory Limits]
    D --> J[Request Limits]
    E --> K[Data Policies]
    F --> L[Logging Rules]
    G --> M[On-chain Verification]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#fbb,stroke:#333,stroke-width:2px
    style E fill:#fbf,stroke:#333,stroke-width:2px
    style F fill:#bff,stroke:#333,stroke-width:2px
    style G fill:#fbb,stroke:#333,stroke-width:2px
        `
    },
    {
        name: 'agent-collaboration',
        content: `
graph TD
    A[Agent Collaboration] --> B[Agent 1]
    A --> C[Agent 2]
    A --> D[Agent 3]
    
    B <--> E[Communication Protocol]
    C <--> E
    D <--> E
    
    E --> F[Security Layer]
    F --> G[Data Sharing Rules]
    F --> H[Coordination Pattern]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#fbb,stroke:#333,stroke-width:2px
    style E fill:#fbf,stroke:#333,stroke-width:2px
    style F fill:#bff,stroke:#333,stroke-width:2px
    style G fill:#fbb,stroke:#333,stroke-width:2px
    style H fill:#fbb,stroke:#333,stroke-width:2px
        `
    }
];

// Generate all diagrams
diagrams.forEach(diagram => {
    generateDiagram(diagram.content, diagram.name);
}); 