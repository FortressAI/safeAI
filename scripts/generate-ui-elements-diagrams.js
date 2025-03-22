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
        name: 'ui-dashboard',
        content: `
graph TD
    subgraph Dashboard
        A[System Health Status] --> B[Active Agents]
        A --> C[Knowledge Graph Stats]
        A --> D[Recent Activities]
        
        B --> E[Agent List]
        B --> F[Performance Metrics]
        
        C --> G[Graph Size]
        C --> H[Query Stats]
        
        D --> I[Activity Log]
        D --> J[Notifications]
    end
    
    style Dashboard fill:#f5f5f5,stroke:#333,stroke-width:2px
    style A fill:#e1f5fe,stroke:#333,stroke-width:2px
    style B fill:#e8f5e9,stroke:#333,stroke-width:2px
    style C fill:#fff3e0,stroke:#333,stroke-width:2px
    style D fill:#fce4ec,stroke:#333,stroke-width:2px
    `
    },
    {
        name: 'ui-navigation',
        content: `
graph TD
    subgraph Navigation
        A[Navigation Bar] --> B[Quick Access]
        A --> C[Account Info]
        A --> D[Notifications]
        A --> E[Search]
        
        F[Sidebar] --> G[Main Menu]
        F --> H[Recent Items]
        F --> I[Favorites]
        F --> J[Quick Actions]
        
        K[Status Bar] --> L[System Health]
        K --> M[Notifications]
        K --> N[Quick Actions]
    end
    
    style Navigation fill:#f5f5f5,stroke:#333,stroke-width:2px
    style A fill:#e1f5fe,stroke:#333,stroke-width:2px
    style F fill:#e8f5e9,stroke:#333,stroke-width:2px
    style K fill:#fff3e0,stroke:#333,stroke-width:2px
    `
    },
    {
        name: 'ui-agent-management',
        content: `
graph TD
    subgraph Agent Management
        A[Agent Dashboard] --> B[Create Agent]
        A --> C[Monitor Agents]
        A --> D[Configure Agents]
        
        B --> E[Agent Template]
        B --> F[Configuration]
        B --> G[Capabilities]
        
        C --> H[Performance]
        C --> I[Resource Usage]
        C --> J[Activity Log]
        
        D --> K[Permissions]
        D --> L[Settings]
        D --> M[Integration]
    end
    
    style Agent Management fill:#f5f5f5,stroke:#333,stroke-width:2px
    style A fill:#e1f5fe,stroke:#333,stroke-width:2px
    style B fill:#e8f5e9,stroke:#333,stroke-width:2px
    style C fill:#fff3e0,stroke:#333,stroke-width:2px
    style D fill:#fce4ec,stroke:#333,stroke-width:2px
    `
    },
    {
        name: 'ui-knowledge-graph',
        content: `
graph TD
    subgraph Knowledge Graph Interface
        A[Graph Viewer] --> B[Visualization]
        A --> C[Query Panel]
        A --> D[Controls]
        
        B --> E[Node Display]
        B --> F[Relationship View]
        B --> G[Layout Options]
        
        C --> H[Query Editor]
        C --> I[Results View]
        C --> J[History]
        
        D --> K[Zoom]
        D --> L[Pan]
        D --> M[Filter]
    end
    
    style Knowledge Graph Interface fill:#f5f5f5,stroke:#333,stroke-width:2px
    style A fill:#e1f5fe,stroke:#333,stroke-width:2px
    style B fill:#e8f5e9,stroke:#333,stroke-width:2px
    style C fill:#fff3e0,stroke:#333,stroke-width:2px
    style D fill:#fce4ec,stroke:#333,stroke-width:2px
    `
    },
    {
        name: 'ui-content-publishing',
        content: `
graph TD
    subgraph Content Publishing
        A[Content Editor] --> B[Create Content]
        A --> C[Edit Content]
        A --> D[Preview]
        
        B --> E[Title]
        B --> F[Content]
        B --> G[Metadata]
        
        C --> H[Formatting]
        C --> I[Media]
        C --> J[Links]
        
        D --> K[Preview Mode]
        D --> L[Responsive View]
        D --> M[Print View]
    end
    
    style Content Publishing fill:#f5f5f5,stroke:#333,stroke-width:2px
    style A fill:#e1f5fe,stroke:#333,stroke-width:2px
    style B fill:#e8f5e9,stroke:#333,stroke-width:2px
    style C fill:#fff3e0,stroke:#333,stroke-width:2px
    style D fill:#fce4ec,stroke:#333,stroke-width:2px
    `
    },
    {
        name: 'ui-security',
        content: `
graph TD
    subgraph Security Dashboard
        A[Security Overview] --> B[Monitoring]
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
    }
];

// Generate all diagrams
diagrams.forEach(diagram => {
    generateDiagram(diagram.content, diagram.name);
}); 