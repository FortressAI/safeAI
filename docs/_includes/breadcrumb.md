# Breadcrumb Navigation Template

This template provides consistent navigation across all documentation files. The breadcrumb should be placed at the top of each document, right after the title.

## Usage

Add the following YAML frontmatter to each markdown file:

```yaml
---
breadcrumb: [Home](../README.md) > [Section](../section/README.md) > [Subsection](../section/subsection.md) > [Current Page](../section/subsection/current-page.md)
---
```

## Examples

### User Documentation
```yaml
---
breadcrumb: [Home](../README.md) > [User Documentation](../docs/README.md) > [Getting Started](../docs/getting-started.md) > [Current Page](../docs/getting-started/current-page.md)
---
```

### Technical Documentation
```yaml
---
breadcrumb: [Home](../README.md) > [Technical Documentation](../technical/README.md) > [API](../technical/api/README.md) > [Current Page](../technical/api/current-page.md)
---
```

### Domain Documentation
```yaml
---
breadcrumb: [Home](../README.md) > [Domain Documentation](../domains/README.md) > [Security](../domains/cybersecurity-guide.md) > [Current Page](../domains/security/current-page.md)
---
```

## Guidelines

1. **Structure**
   - Start with "Home" linking to the root README.md
   - Include all parent sections in the hierarchy
   - End with the current page name
   - Use relative paths for all links

2. **Formatting**
   - Use square brackets for link text
   - Use parentheses for URLs
   - Separate items with " > "
   - Keep the breadcrumb on a single line

3. **Naming**
   - Use clear, concise names
   - Maintain consistent capitalization
   - Use proper markdown file extensions
   - Avoid special characters in file names

4. **Links**
   - All links should be relative
   - Use "../" to navigate up directories
   - Include the full path to the file
   - Ensure all links are valid

## Implementation

1. **Add to Existing Files**
   - Review current navigation structure
   - Add breadcrumb to each file
   - Verify all links work
   - Update any broken references

2. **New Files**
   - Add breadcrumb when creating new files
   - Follow the established hierarchy
   - Test all navigation paths
   - Update related documentation

3. **Maintenance**
   - Regular link checking
   - Update when structure changes
   - Verify after file moves
   - Keep consistent across updates

## Example Implementation

```markdown
# Page Title
---
breadcrumb: [Home](../README.md) > [Section](../section/README.md) > [Current Page](../section/current-page.md)
---

## Content
...
```

## Support

For questions about implementing breadcrumb navigation:
- Email: docs@safeai.com
- Documentation Portal: docs.safeai.com
- Contact: +1-XXX-XXX-XXXX

---
*Last updated: March 2024*
Copyright © 2024 SafeAI. All rights reserved. 