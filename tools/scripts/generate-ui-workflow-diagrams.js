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
        name: 'ui-navigation-patterns',
        content: `
graph TD
    A[Navigation Patterns] --> B[Breadcrumb Navigation]
    A --> C[Tab Navigation]
    A --> D[Modal Dialogs]
    
    B --> E[Show Current Location]
    B --> F[Parent Page Access]
    B --> G[Maintain Hierarchy]
    
    C --> H[Group Related Content]
    C --> I[Show Active State]
    C --> J[Keyboard Navigation]
    
    D --> K[Focused Actions]
    D --> L[Clear Exit Options]
    D --> M[Maintain Context]
    
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
        name: 'ui-feedback-patterns',
        content: `
graph TD
    A[Feedback Patterns] --> B[Loading States]
    A --> C[Success Messages]
    A --> D[Error Handling]
    
    B --> E[Progress Indicators]
    B --> F[Disable Interactive Elements]
    B --> G[Cancel Options]
    
    C --> H[Concise Messages]
    C --> I[Auto-dismiss]
    C --> J[Undo Options]
    
    D --> K[Specific Error Messages]
    D --> L[Recovery Options]
    D --> M[Error Logging]
    
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
        name: 'ui-form-patterns',
        content: `
graph TD
    A[Form Patterns] --> B[Input Validation]
    A --> C[Auto-save]
    A --> D[Multi-step Forms]
    
    B --> E[Real-time Validation]
    B --> F[Clear Error Messages]
    B --> G[Prevent Invalid Submission]
    
    C --> H[Periodic Saving]
    C --> I[Save Status]
    C --> J[Conflict Handling]
    
    D --> K[Progress Tracking]
    D --> L[Step Navigation]
    D --> M[Step Validation]
    
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
    }
];

// Generate all diagrams
diagrams.forEach(diagram => {
    generateDiagram(diagram.content, diagram.name);
}); 