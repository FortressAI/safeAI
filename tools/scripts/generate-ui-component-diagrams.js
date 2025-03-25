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
        name: 'ui-component-hierarchy',
        content: `
graph TD
    A[MainLayout] --> B[Header]
    A --> C[Sidebar]
    A --> D[MainContent]
    
    D --> E[AgentWorkspace]
    D --> F[KnowledgeGraphViewer]
    D --> G[ContentPublisher]
    
    E --> H[Card]
    F --> H
    G --> H
    
    H --> I[Input]
    H --> J[Button]
    H --> K[Table]
    H --> L[Chart]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#fbb,stroke:#333,stroke-width:2px
    style E fill:#fbf,stroke:#333,stroke-width:2px
    style F fill:#bff,stroke:#333,stroke-width:2px
    style G fill:#fbb,stroke:#333,stroke-width:2px
    style H fill:#bfb,stroke:#333,stroke-width:2px
    style I fill:#bbf,stroke:#333,stroke-width:2px
    style J fill:#fbf,stroke:#333,stroke-width:2px
    style K fill:#bff,stroke:#333,stroke-width:2px
    style L fill:#fbb,stroke:#333,stroke-width:2px
        `
    },
    {
        name: 'ui-layout-structure',
        content: `
graph TD
    A[MainLayout] --> B[Header]
    A --> C[Sidebar]
    A --> D[MainContent]
    
    B --> E[Navigation]
    B --> F[UserMenu]
    B --> G[Notifications]
    
    C --> H[MenuItems]
    C --> I[QuickActions]
    C --> J[RecentItems]
    
    D --> K[ContentArea]
    D --> L[StatusBar]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#fbb,stroke:#333,stroke-width:2px
    style E fill:#fbf,stroke:#333,stroke-width:2px
    style F fill:#bff,stroke:#333,stroke-width:2px
    style G fill:#fbb,stroke:#333,stroke-width:2px
    style H fill:#bbf,stroke:#333,stroke-width:2px
    style I fill:#bfb,stroke:#333,stroke-width:2px
    style J fill:#fbb,stroke:#333,stroke-width:2px
    style K fill:#fbf,stroke:#333,stroke-width:2px
    style L fill:#bff,stroke:#333,stroke-width:2px
        `
    },
    {
        name: 'ui-form-components',
        content: `
graph LR
    A[Form Components] --> B[Input]
    A --> C[Button]
    A --> D[Select]
    A --> E[Checkbox]
    A --> F[Radio]
    A --> G[TextArea]
    
    B --> H[Text Input]
    B --> I[Password Input]
    B --> J[Email Input]
    
    C --> K[Primary Button]
    C --> L[Secondary Button]
    C --> M[Outline Button]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#fbb,stroke:#333,stroke-width:2px
    style E fill:#fbf,stroke:#333,stroke-width:2px
    style F fill:#bff,stroke:#333,stroke-width:2px
    style G fill:#fbb,stroke:#333,stroke-width:2px
    style H fill:#bbf,stroke:#333,stroke-width:2px
    style I fill:#bfb,stroke:#333,stroke-width:2px
    style J fill:#fbb,stroke:#333,stroke-width:2px
    style K fill:#fbf,stroke:#333,stroke-width:2px
    style L fill:#bff,stroke:#333,stroke-width:2px
    style M fill:#fbb,stroke:#333,stroke-width:2px
        `
    },
    {
        name: 'ui-data-display',
        content: `
graph TD
    A[Data Display] --> B[Table]
    A --> C[Chart]
    A --> D[List]
    A --> E[Card]
    
    B --> F[Sortable Columns]
    B --> G[Pagination]
    B --> H[Row Selection]
    
    C --> I[Line Chart]
    C --> J[Bar Chart]
    C --> K[Pie Chart]
    
    D --> L[Ordered List]
    D --> M[Unordered List]
    D --> N[Grid List]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#fbb,stroke:#333,stroke-width:2px
    style E fill:#fbf,stroke:#333,stroke-width:2px
    style F fill:#bbf,stroke:#333,stroke-width:2px
    style G fill:#bfb,stroke:#333,stroke-width:2px
    style H fill:#fbb,stroke:#333,stroke-width:2px
    style I fill:#fbf,stroke:#333,stroke-width:2px
    style J fill:#bff,stroke:#333,stroke-width:2px
    style K fill:#fbb,stroke:#333,stroke-width:2px
    style L fill:#bbf,stroke:#333,stroke-width:2px
    style M fill:#bfb,stroke:#333,stroke-width:2px
    style N fill:#fbb,stroke:#333,stroke-width:2px
        `
    }
];

// Generate all diagrams
diagrams.forEach(diagram => {
    generateDiagram(diagram.content, diagram.name);
}); 