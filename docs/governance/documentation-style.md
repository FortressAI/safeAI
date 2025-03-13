# Documentation Style Guide

## Introduction

This guide establishes consistent standards for writing documentation in the SafeAI Platform using Neo4j's Cypher query language. Following these guidelines helps create clear, maintainable, and user-friendly documentation.

## General Principles

### 1. Writing Style

```cypher
// Create Writing Style Guidelines Template
CREATE (wsg:WritingStyleGuidelines {
    name: 'documentation_style_template',
    version: '1.0',
    
    // Clarity Guidelines
    clarity_description: 'Write clear, concise content',
    clarity_guideline1: 'Use simple language',
    clarity_guideline2: 'Avoid jargon',
    clarity_guideline3: 'Define technical terms',
    clarity_guideline4: 'Use active voice',
    
    // Consistency Guidelines
    consistency_description: 'Maintain consistent style',
    consistency_guideline1: 'Follow naming conventions',
    consistency_guideline2: 'Use consistent formatting',
    consistency_guideline3: 'Maintain consistent tone',
    consistency_guideline4: 'Use standard terminology',
    
    // Completeness Guidelines
    completeness_description: 'Provide comprehensive information',
    completeness_guideline1: 'Cover all features',
    completeness_guideline2: 'Include examples',
    completeness_guideline3: 'Address edge cases',
    completeness_guideline4: 'Link related content',
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN wsg;

// Create Writing Style Guidelines Instance
MATCH (wsg:WritingStyleGuidelines {name: 'documentation_style_template'})
CREATE (guidelines:WritingStyleGuidelinesInstance {
    name: 'current_guidelines',
    template_version: wsg.version,
    
    // Guidelines Status
    clarity_implemented: false,
    consistency_implemented: false,
    completeness_implemented: false,
    
    // Metadata
    created_at: datetime()
})
CREATE (wsg)-[:TEMPLATE_FOR]->(guidelines)
RETURN guidelines;
```

## Document Structure

### 1. Standard Sections

```cypher
// Create Document Structure Template
CREATE (dst:DocumentStructure {
    name: 'standard_sections_template',
    version: '1.0',
    
    // Overview Section
    overview_purpose: 'Introduce the topic',
    overview_element1: 'Brief description',
    overview_element2: 'Key features',
    overview_element3: 'Prerequisites',
    
    // Main Content Section
    main_content_purpose: 'Detailed information',
    main_content_element1: 'Concepts',
    main_content_element2: 'Instructions',
    main_content_element3: 'Examples',
    
    // Reference Section
    reference_purpose: 'Additional details',
    reference_element1: 'API reference',
    reference_element2: 'Configuration options',
    reference_element3: 'Related topics',
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN dst;

// Create Document Instance
MATCH (dst:DocumentStructure {name: 'standard_sections_template'})
CREATE (doc:DocumentInstance {
    name: 'example_document',
    template_version: dst.version,
    
    // Section Status
    overview_status: 'draft',
    overview_completion_percent: 0,
    main_content_status: 'draft',
    main_content_completion_percent: 0,
    reference_status: 'draft',
    reference_completion_percent: 0,
    
    // Metadata
    created_at: datetime(),
    status: 'in_progress'
})
CREATE (dst)-[:TEMPLATE_FOR]->(doc)
RETURN doc;
```

### 2. Content Organization

```cypher
// Create Content Organization Template
CREATE (cog:ContentOrganization {
    name: 'content_organization_template',
    version: '1.0',
    
    // Hierarchy Structure
    h1_purpose: 'Document title',
    h2_purpose: 'Major sections',
    h3_purpose: 'Subsections',
    h4_purpose: 'Detailed topics',
    
    // Navigation Elements
    toc_required: true,
    section_links_required: true,
    breadcrumbs_required: true,
    
    // Metadata Requirements
    tag1: 'category',
    tag2: 'level',
    tag3: 'version',
    last_updated_required: true,
    contributors_required: true,
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN cog;

// Create Organization Status Instance
MATCH (cog:ContentOrganization {name: 'content_organization_template'})
MATCH (doc:DocumentInstance)
WHERE doc.status = 'in_progress'
WITH cog, doc
CREATE (org:OrganizationStatusInstance {
    document_id: doc.name,
    template_version: cog.version,
    
    // Organization Status
    title_complete: false,
    sections_complete: false,
    subsections_complete: false,
    topics_complete: false,
    
    // Navigation Status
    toc_complete: false,
    links_complete: false,
    breadcrumbs_complete: false,
    
    // Metadata Status
    tags_complete: false,
    last_updated_complete: false,
    contributors_complete: false,
    
    // Overall Status
    status: 'in_progress',
    created_at: datetime()
})
CREATE (doc)-[:HAS_ORGANIZATION]->(org)
RETURN org;
```

## Formatting Guidelines

### 1. Text Formatting

```cypher
// Create Text Formatting Rules Template
CREATE (tfr:TextFormattingRules {
    name: 'formatting_guidelines_template',
    version: '1.0',
    
    // Heading Rules
    title_case_required: true,
    max_title_length: 60,
    numbering_required: false,
    
    // Paragraph Rules
    max_paragraph_length: 80,
    paragraph_spacing: 'single',
    paragraph_alignment: 'left',
    
    // List Rules
    bullet_style: '- ',
    numbering_style: '1. ',
    max_list_depth: 3,
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN tfr;

// Create Formatting Validation Instance
MATCH (tfr:TextFormattingRules {name: 'formatting_guidelines_template'})
MATCH (doc:DocumentInstance)
WHERE doc.status = 'in_progress'
WITH tfr, doc
CREATE (fmt:FormattingValidationInstance {
    document_id: doc.name,
    template_version: tfr.version,
    
    // Validation Status
    headings_valid: false,
    paragraphs_valid: false,
    lists_valid: false,
    
    // Metadata
    created_at: datetime()
})
CREATE (doc)-[:HAS_FORMATTING]->(fmt)
RETURN fmt;
```

## Writing Guidelines

### 1. Voice and Tone

```cypher
// Create Voice and Tone Guidelines
CREATE (vtg:VoiceAndTone {
    name: 'voice_guidelines',
    version: '1.0',
    
    // General Tone
    general_tone: {
        description: 'Professional but approachable',
        guidelines: [
            'Be friendly but not casual',
            'Stay technical but clear',
            'Maintain consistency',
            'Be inclusive'
        ]
    },
    
    // Writing Style
    writing_style: {
        description: 'Clear and direct',
        guidelines: [
            'Use active voice',
            'Write in present tense',
            'Be concise',
            'Use second person'
        ]
    },
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN vtg;

// Track Voice and Tone Compliance
MATCH (vtg:VoiceAndTone {name: 'voice_guidelines'})
MATCH (doc:Document)
WHERE doc.status = 'in_progress'
WITH vtg, doc
CREATE (vt:VoiceValidation {
    document_id: doc.name,
    guidelines_version: vtg.version,
    
    // Compliance Status
    tone_compliant: false,
    style_compliant: false,
    
    // Issues Found
    issues: [],
    
    // Validation Status
    status: 'pending',
    validated_at: datetime()
})
CREATE (doc)-[:HAS_VOICE_VALIDATION]->(vt)
RETURN vt;
```

### 2. Technical Writing

```cypher
// Create Technical Writing Guidelines
CREATE (twg:TechnicalWriting {
    name: 'technical_writing',
    version: '1.0',
    
    // Terminology Rules
    terminology: {
        use_consistent_terms: true,
        define_technical_terms: true,
        maintain_glossary: true
    },
    
    // Explanation Rules
    explanations: {
        start_simple: true,
        build_complexity: true,
        provide_context: true
    },
    
    // Example Rules
    examples: {
        use_real_world: true,
        show_common_uses: true,
        include_edge_cases: true
    },
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN twg;

// Track Technical Writing Compliance
MATCH (twg:TechnicalWriting {name: 'technical_writing'})
MATCH (doc:Document)
WHERE doc.status = 'in_progress'
WITH twg, doc
CREATE (tw:TechnicalValidation {
    document_id: doc.name,
    guidelines_version: twg.version,
    
    // Compliance Status
    terminology_compliant: false,
    explanations_compliant: false,
    examples_compliant: false,
    
    // Issues Found
    issues: [],
    
    // Validation Status
    status: 'pending',
    validated_at: datetime()
})
CREATE (doc)-[:HAS_TECHNICAL_VALIDATION]->(tw)
RETURN tw;
```

## Documentation Types

### 1. API Documentation

```cypher
// Create API Documentation Template
CREATE (apid:APIDocumentation {
    name: 'api_documentation',
    version: '1.0',
    
    // Structure
    structure: {
        overview: {
            description: true,
            authentication: true,
            base_url: true
        },
        endpoints: {
            method: true,
            path: true,
            parameters: true,
            responses: true
        },
        examples: {
            request: true,
            response: true,
            error_handling: true
        }
    },
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN apid;
```

### 2. User Guides

```cypher
// Create User Guide Template
CREATE (ug:UserGuides {
    name: 'user_guides',
    version: '1.0',
    
    // Structure
    guide_structure: {
        getting_started: {
            introduction: true,
            prerequisites: true,
            quick_start: true
        },
        main_content: {
            step_by_step: true,
            screenshots: true,
            troubleshooting: true
        },
        advanced: {
            best_practices: true,
            tips_and_tricks: true,
            common_issues: true
        }
    },
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN ug;
```

## Review Process

### 1. Documentation Review

```cypher
// Create Documentation Review Template
CREATE (dr:DocumentationReview {
    name: 'documentation_review',
    version: '1.0',
    
    // Checklist
    review_checklist: {
        technical_accuracy: {
            verify_content: true,
            check_code_examples: true,
            validate_links: true
        },
        writing_quality: {
            check_grammar: true,
            verify_style: true,
            ensure_clarity: true
        },
        completeness: {
            check_sections: true,
            verify_examples: true,
            validate_references: true
        }
    },
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN dr;
```

## Best Practices

### 1. Documentation Maintenance

```cypher
// Create Documentation Maintenance Template
CREATE (dm:DocumentationMaintenance {
    name: 'documentation_maintenance',
    version: '1.0',
    
    // Practices
    maintenance_practices: {
        regular_updates: {
            schedule_reviews: true,
            track_changes: true,
            version_control: true
        },
        quality_control: {
            automated_checks: true,
            peer_reviews: true,
            user_feedback: true
        },
        improvement: {
            collect_metrics: true,
            analyze_feedback: true,
            implement_changes: true
        }
    },
    
    // Metadata
    created_at: datetime(),
    status: 'active'
})
RETURN dm;
```

## Additional Resources

- [Markdown Guide](./markdown-guide.md)
- [API Documentation Template](./api-template.md)
- [User Guide Template](./user-guide-template.md)
- [Technical Writing Guide](./technical-writing.md)

## See Also

- [Node Creation](../cypher/nodes.md)
- [Relationship Creation](../cypher/relationships.md)
- [Query Patterns](../cypher/queries.md) 