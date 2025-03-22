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
        name: 'ui-architecture',
        content: `
graph TD
    A[SafeAI UI] --> B[Core Components]
    A --> C[Blockchain Integration]
    A --> D[Agent Management]
    
    B --> E[AgentWorkspace]
    B --> F[KnowledgeGraphViewer]
    B --> G[ContentPublisher]
    
    C --> H[WalletConnector]
    C --> I[TransactionMonitor]
    
    D --> J[AgentDashboard]
    D --> K[AgentConfigurator]
    
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
        `
    },
    {
        name: 'ui-state-management',
        content: `
graph TD
    A[Redux Store] --> B[Agents State]
    A --> C[Knowledge Graph State]
    A --> D[Content State]
    A --> E[Blockchain State]
    
    B --> F[Active Agents]
    B --> G[Agent Configurations]
    
    C --> H[Nodes]
    C --> I[Relationships]
    C --> J[Query History]
    
    D --> K[Drafts]
    D --> L[Published Content]
    D --> M[Licenses]
    
    E --> N[Wallet State]
    E --> O[Transactions]
    
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
        `
    },
    {
        name: 'ui-knowledge-graph',
        content: `
graph TD
    A[Knowledge Graph Viewer] --> B[Graph Canvas]
    A --> C[Graph Controls]
    A --> D[Query Panel]
    
    B --> E[Node Rendering]
    B --> F[Edge Rendering]
    B --> G[Interaction Handlers]
    
    C --> H[Zoom Controls]
    C --> I[Layout Controls]
    C --> J[Filter Controls]
    
    D --> K[Query Input]
    D --> L[Query History]
    D --> M[Results Display]
    
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
        `
    },
    {
        name: 'ui-arc-prize',
        content: `
graph TD
    A[ARC Prize Dashboard] --> B[Submission List]
    A --> C[Submission Form]
    A --> D[Voting Panel]
    
    B --> E[Submission Cards]
    B --> F[Sorting Controls]
    B --> G[Filtering Controls]
    
    C --> H[Form Fields]
    C --> I[Validation]
    C --> J[Submission Preview]
    
    D --> K[Vote Controls]
    D --> L[Vote History]
    D --> M[Vote Analytics]
    
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
        `
    }
];

// Generate all diagrams
diagrams.forEach(diagram => {
    generateDiagram(diagram.content, diagram.name);
}); 