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

// Define diagrams to generate
const diagrams = [
    {
        name: 'architecture-system',
        content: `
graph TD
    subgraph Frontend Layer
        A[React UI] --> B[TypeScript]
        A --> C[Redux]
        A --> D[Web3]
    end
    
    subgraph Backend Services
        E[Node.js API] --> F[Python AI]
        E --> G[GraphQL]
        E --> H[WebSocket]
    end
    
    subgraph Blockchain Layer
        I[Smart Contracts] --> J[IPFS]
        I --> K[Token System]
        I --> L[Consensus]
    end
    
    subgraph AI Layer
        M[Agent System] --> N[Knowledge Graph]
        M --> O[Theorem Prover]
        M --> P[NLP]
    end
    
    B --> E
    D --> I
    F --> M
    
    style Frontend Layer fill:#e1f5fe,stroke:#333,stroke-width:2px
    style Backend Services fill:#e8f5e9,stroke:#333,stroke-width:2px
    style Blockchain Layer fill:#fff3e0,stroke:#333,stroke-width:2px
    style AI Layer fill:#fce4ec,stroke:#333,stroke-width:2px
    `
    },
    {
        name: 'architecture-data-flow',
        content: `
graph LR
    subgraph User Layer
        A[User Input] --> B[Frontend]
        B --> C[Validation]
        C --> D[State Update]
    end
    
    subgraph Service Layer
        E[Business Logic] --> F[Data Persistence]
        F --> G[Component Coordination]
    end
    
    subgraph Blockchain Layer
        H[Transaction Processing] --> I[Smart Contracts]
        I --> J[Token Operations]
    end
    
    subgraph AI Layer
        K[Agent Operations] --> L[Knowledge Graph]
        L --> M[Theorem Proving]
    end
    
    D --> E
    G --> H
    J --> K
    
    style User Layer fill:#e1f5fe,stroke:#333,stroke-width:2px
    style Service Layer fill:#e8f5e9,stroke:#333,stroke-width:2px
    style Blockchain Layer fill:#fff3e0,stroke:#333,stroke-width:2px
    style AI Layer fill:#fce4ec,stroke:#333,stroke-width:2px
    `
    },
    {
        name: 'architecture-security',
        content: `
graph TD
    subgraph Authentication
        A[JWT Auth] --> B[RBAC]
        B --> C[MFA]
    end
    
    subgraph Data Protection
        D[E2E Encryption] --> E[Key Management]
        E --> F[Data Validation]
    end
    
    subgraph Network Security
        G[TLS] --> H[DDoS Protection]
        H --> I[Rate Limiting]
    end
    
    subgraph Smart Contract Security
        J[Formal Verification] --> K[Audit Logging]
        K --> L[Access Controls]
    end
    
    C --> D
    F --> G
    I --> J
    
    style Authentication fill:#e1f5fe,stroke:#333,stroke-width:2px
    style Data Protection fill:#e8f5e9,stroke:#333,stroke-width:2px
    style Network Security fill:#fff3e0,stroke:#333,stroke-width:2px
    style Smart Contract Security fill:#fce4ec,stroke:#333,stroke-width:2px
    `
    },
    {
        name: 'architecture-deployment',
        content: `
graph TD
    subgraph Development
        A[Local Setup] --> B[Testing]
        B --> C[CI/CD]
    end
    
    subgraph Staging
        D[Integration] --> E[Performance]
        E --> F[Security]
    end
    
    subgraph Production
        G[High Availability] --> H[Load Balancing]
        H --> I[Monitoring]
    end
    
    C --> D
    F --> G
    
    style Development fill:#e1f5fe,stroke:#333,stroke-width:2px
    style Staging fill:#e8f5e9,stroke:#333,stroke-width:2px
    style Production fill:#fff3e0,stroke:#333,stroke-width:2px
    `
    }
];

// Generate all diagrams
diagrams.forEach(diagram => {
    generateDiagram(diagram.content, diagram.name);
}); 