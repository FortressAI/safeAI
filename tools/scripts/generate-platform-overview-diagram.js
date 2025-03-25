const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure images directory exists
const imagesDir = path.join(__dirname, '../assets/images');
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

// Define diagram to generate
const diagram = {
    name: 'platform-overview',
    content: `
graph TD
    A[SafeAI Platform] --> B[Core Components]
    A --> C[Security Layer]
    A --> D[Blockchain Integration]
    
    B --> E[Agent Management]
    B --> F[Knowledge Graphs]
    B --> G[Content Publishing]
    
    C --> H[Access Control]
    C --> I[Data Protection]
    C --> J[Audit Trails]
    
    D --> K[Smart Contracts]
    D --> L[Token System]
    D --> M[Governance]
    
    E --> N[Agent Creation]
    E --> O[Agent Monitoring]
    E --> P[Agent Configuration]
    
    F --> Q[Graph Visualization]
    F --> R[Query Interface]
    F --> S[Data Management]
    
    G --> T[Content Editor]
    G --> U[License Management]
    G --> V[Distribution]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#fbb,stroke:#333,stroke-width:2px
    style E fill:#fbf,stroke:#333,stroke-width:2px
    style F fill:#bff,stroke:#333,stroke-width:2px
    style G fill:#bbf,stroke:#333,stroke-width:2px
    style H fill:#bfb,stroke:#333,stroke-width:2px
    style I fill:#fbb,stroke:#333,stroke-width:2px
    style J fill:#fbf,stroke:#333,stroke-width:2px
    style K fill:#bff,stroke:#333,stroke-width:2px
    style L fill:#bbf,stroke:#333,stroke-width:2px
    style M fill:#bfb,stroke:#333,stroke-width:2px
    style N fill:#fbb,stroke:#333,stroke-width:2px
    style O fill:#fbf,stroke:#333,stroke-width:2px
    style P fill:#bff,stroke:#333,stroke-width:2px
    style Q fill:#bbf,stroke:#333,stroke-width:2px
    style R fill:#bfb,stroke:#333,stroke-width:2px
    style S fill:#fbb,stroke:#333,stroke-width:2px
    style T fill:#fbf,stroke:#333,stroke-width:2px
    style U fill:#bff,stroke:#333,stroke-width:2px
    style V fill:#bbf,stroke:#333,stroke-width:2px
    `
};

// Generate diagram
generateDiagram(diagram.content, diagram.name); 