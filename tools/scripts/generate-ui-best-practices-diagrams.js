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
        name: 'ui-design-principles',
        content: `
graph TD
    A[Design Principles] --> B[Consistency]
    A --> C[Accessibility]
    A --> D[Responsiveness]
    
    B --> E[Visual Consistency]
    B --> F[Interaction Consistency]
    
    C --> G[WCAG Compliance]
    C --> H[Color and Contrast]
    
    D --> I[Mobile First]
    D --> J[Performance]
    
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
        `
    },
    {
        name: 'ui-coding-standards',
        content: `
graph TD
    A[Coding Standards] --> B[Component Structure]
    A --> C[State Management]
    A --> D[Error Handling]
    
    B --> E[TypeScript Types]
    B --> F[Component Hooks]
    B --> G[Styling]
    
    C --> H[Redux Best Practices]
    C --> I[Local State]
    
    D --> J[Error Boundaries]
    D --> K[Form Validation]
    
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
        name: 'ui-performance-optimization',
        content: `
graph TD
    A[Performance Optimization] --> B[Code Splitting]
    A --> C[Caching]
    A --> D[Monitoring]
    
    B --> E[Route-based Splitting]
    B --> F[Component Splitting]
    
    C --> G[Data Caching]
    C --> H[Asset Caching]
    
    D --> I[Performance Metrics]
    D --> J[Error Tracking]
    
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
        `
    }
];

// Generate all diagrams
diagrams.forEach(diagram => {
    generateDiagram(diagram.content, diagram.name);
}); 