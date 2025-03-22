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
        name: 'ui-management-console',
        content: `
graph TD
    subgraph Management Console
        A[Main Navigation] --> B[Dashboard]
        A --> C[Knowledge Graphs]
        A --> D[Agents]
        A --> E[Security]
        A --> F[Settings]
        
        B --> G[System Overview]
        B --> H[Quick Actions]
        B --> I[Recent Activity]
        
        C --> J[Graph Explorer]
        C --> K[Query Builder]
        C --> L[Data Management]
        
        D --> M[Agent List]
        D --> N[Agent Workshop]
        D --> O[Monitoring]
        
        E --> P[Security Dashboard]
        E --> Q[Audit Logs]
        E --> R[Access Control]
        
        F --> S[User Settings]
        F --> T[API Keys]
        F --> U[Preferences]
    end
    
    style Management Console fill:#f5f5f5,stroke:#333,stroke-width:2px
    style A fill:#e1f5fe,stroke:#333,stroke-width:2px
    style B fill:#e8f5e9,stroke:#333,stroke-width:2px
    style C fill:#fff3e0,stroke:#333,stroke-width:2px
    style D fill:#fce4ec,stroke:#333,stroke-width:2px
    style E fill:#f3e5f5,stroke:#333,stroke-width:2px
    style F fill:#e8eaf6,stroke:#333,stroke-width:2px
    `
    },
    {
        name: 'ui-agent-workshop',
        content: `
graph TD
    subgraph Agent Workshop
        A[Template Selection] --> B[Agent Editor]
        B --> C[Capability Configuration]
        B --> D[Security Settings]
        B --> E[Testing Interface]
        
        C --> F[Input/Output]
        C --> G[Processing Rules]
        C --> H[Resource Limits]
        
        D --> I[Access Control]
        D --> J[Ethical Guidelines]
        D --> K[Compliance Rules]
        
        E --> L[Test Cases]
        E --> M[Performance Metrics]
        E --> N[Validation Results]
    end
    
    style Agent Workshop fill:#f5f5f5,stroke:#333,stroke-width:2px
    style A fill:#e1f5fe,stroke:#333,stroke-width:2px
    style B fill:#e8f5e9,stroke:#333,stroke-width:2px
    style C fill:#fff3e0,stroke:#333,stroke-width:2px
    style D fill:#fce4ec,stroke:#333,stroke-width:2px
    style E fill:#f3e5f5,stroke:#333,stroke-width:2px
    `
    },
    {
        name: 'ui-math-atp',
        content: `
graph TD
    subgraph Math ATP Interface
        A[Theorem Editor] --> B[Proof Control]
        A --> C[Proof Steps]
        A --> D[Results View]
        
        B --> E[Start/Stop]
        B --> F[Strategy Selection]
        B --> G[Agent Control]
        
        C --> H[Step Sequence]
        C --> I[Interactive Guide]
        C --> J[Optimization]
        
        D --> K[Proof Results]
        D --> L[Performance Stats]
        D --> M[Knowledge Base]
    end
    
    style Math ATP Interface fill:#f5f5f5,stroke:#333,stroke-width:2px
    style A fill:#e1f5fe,stroke:#333,stroke-width:2px
    style B fill:#e8f5e9,stroke:#333,stroke-width:2px
    style C fill:#fff3e0,stroke:#333,stroke-width:2px
    style D fill:#fce4ec,stroke:#333,stroke-width:2px
    `
    },
    {
        name: 'ui-arc-prize',
        content: `
graph TD
    subgraph ARC Prize Interface
        A[Program Editor] --> B[Task Selection]
        A --> C[Solution Testing]
        A --> D[Results Analysis]
        
        B --> E[Task Library]
        B --> F[Custom Tasks]
        B --> G[Task Details]
        
        C --> H[Test Cases]
        C --> I[Performance]
        C --> J[Validation]
        
        D --> K[Score Analysis]
        D --> L[Improvements]
        D --> M[Submission]
    end
    
    style ARC Prize Interface fill:#f5f5f5,stroke:#333,stroke-width:2px
    style A fill:#e1f5fe,stroke:#333,stroke-width:2px
    style B fill:#e8f5e9,stroke:#333,stroke-width:2px
    style C fill:#fff3e0,stroke:#333,stroke-width:2px
    style D fill:#fce4ec,stroke:#333,stroke-width:2px
    `
    },
    {
        name: 'ui-knowledge-graph-explorer',
        content: `
graph TD
    subgraph Knowledge Graph Explorer
        A[Graph View] --> B[Node Panel]
        A --> C[Relationship Panel]
        A --> D[Query Panel]
        
        B --> E[Node Details]
        B --> F[Properties]
        B --> G[Actions]
        
        C --> H[Relationship Types]
        C --> I[Properties]
        C --> J[Actions]
        
        D --> K[Query Builder]
        D --> L[Results]
        D --> M[History]
    end
    
    style Knowledge Graph Explorer fill:#f5f5f5,stroke:#333,stroke-width:2px
    style A fill:#e1f5fe,stroke:#333,stroke-width:2px
    style B fill:#e8f5e9,stroke:#333,stroke-width:2px
    style C fill:#fff3e0,stroke:#333,stroke-width:2px
    style D fill:#fce4ec,stroke:#333,stroke-width:2px
    `
    },
    {
        name: 'ui-security-dashboard',
        content: `
graph TD
    subgraph Security Dashboard
        A[Overview] --> B[Monitoring]
        A --> C[Compliance]
        A --> D[Access Control]
        
        B --> E[Real-time Alerts]
        B --> F[Incidents]
        B --> G[Logs]
        
        C --> H[Checks]
        C --> I[Reports]
        C --> J[Audit]
        
        D --> K[Users]
        D --> L[Roles]
        D --> M[Permissions]
    end
    
    style Security Dashboard fill:#f5f5f5,stroke:#333,stroke-width:2px
    style A fill:#e1f5fe,stroke:#333,stroke-width:2px
    style B fill:#e8f5e9,stroke:#333,stroke-width:2px
    style C fill:#fff3e0,stroke:#333,stroke-width:2px
    style D fill:#fce4ec,stroke:#333,stroke-width:2px
    `
    },
    {
        name: 'ui-token-management',
        content: `
graph TD
    subgraph Token Management
        A[Wallet] --> B[Balance]
        A --> C[Transactions]
        A --> D[Staking]
        
        B --> E[Token List]
        B --> F[Value]
        B --> G[History]
        
        C --> H[Send]
        C --> I[Receive]
        C --> J[History]
        
        D --> K[Stake]
        D --> L[Rewards]
        D --> M[Unstake]
    end
    
    style Token Management fill:#f5f5f5,stroke:#333,stroke-width:2px
    style A fill:#e1f5fe,stroke:#333,stroke-width:2px
    style B fill:#e8f5e9,stroke:#333,stroke-width:2px
    style C fill:#fff3e0,stroke:#333,stroke-width:2px
    style D fill:#fce4ec,stroke:#333,stroke-width:2px
    `
    }
];

// Generate all diagrams
diagrams.forEach(diagram => {
    generateDiagram(diagram.content, diagram.name);
}); 