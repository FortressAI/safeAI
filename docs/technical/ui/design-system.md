# SafeAI Design System
---
breadcrumb: [Home](../README.md) > [Technical Documentation](../technical/README.md) > [UI Documentation](../technical/ui/README.md) > [Design System](../technical/ui/design-system.md)
---



## Overview
The SafeAI Design System provides a comprehensive set of design principles, tokens, and guidelines that ensure consistency and accessibility across the platform. This document details our design philosophy, visual language, and implementation guidelines.



## Design Principles
1. **Clarity**: Clear and intuitive interfaces that guide users through complex tasks
2. **Consistency**: Unified design language across all components and features
3. **Accessibility**: Inclusive design that works for all users
4. **Efficiency**: Optimized workflows and interactions
5. **Trust**: Professional and reliable appearance that builds user confidence
6. **Innovation**: Modern design that reflects cutting-edge AI technology
7. **Security**: Visual indicators that reinforce platform security
8. **Scalability**: Design patterns that work across different screen sizes and contexts

## Visual Language

### 1. Color System
```typescript
// Color tokens
const colors = {
  // Primary colors
  primary: {
    main: '#2563EB',
    light: '#60A5FA',
    dark: '#1E40AF',
    contrast: '#FFFFFF'
  },
  // Secondary colors
  secondary: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    contrast: '#FFFFFF'
  },
  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  // Neutral colors
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
};
```

### 2. Typography
```typescript
// Typography tokens
const typography = {
  fontFamily: {
    primary: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace'
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2
  }
};
```

### 3. Spacing
```typescript
// Spacing tokens
const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem'
};
```

### 4. Shadows
```typescript
// Shadow tokens
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};
```

### 5. Border Radius
```typescript
// Border radius tokens
const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px'
};
```

## Component Design

### 1. Buttons
```typescript
// Button styles
const buttonStyles = {
  base: {
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: 500,
    transition: 'all 0.2s'
  },
  variants: {
    primary: {
      backgroundColor: colors.primary.main,
      color: colors.primary.contrast,
      '&:hover': {
        backgroundColor: colors.primary.dark
      }
    },
    secondary: {
      backgroundColor: colors.secondary.main,
      color: colors.secondary.contrast,
      '&:hover': {
        backgroundColor: colors.secondary.dark
      }
    }
  }
};
```

### 2. Cards
```typescript
// Card styles
const cardStyles = {
  base: {
    backgroundColor: colors.neutral[50],
    borderRadius: '0.5rem',
    boxShadow: shadows.DEFAULT,
    padding: spacing[4]
  },
  variants: {
    elevated: {
      boxShadow: shadows.lg
    },
    outlined: {
      border: `1px solid ${colors.neutral[200]}`
    }
  }
};
```

### 3. Forms
```typescript
// Form styles
const formStyles = {
  input: {
    base: {
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      border: `1px solid ${colors.neutral[300]}`,
      '&:focus': {
        borderColor: colors.primary.main,
        boxShadow: `0 0 0 3px ${colors.primary.light}`
      }
    }
  },
  label: {
    base: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.neutral[700]
    }
  }
};
```

## Layout Guidelines

### 1. Grid System
```typescript
// Grid configuration
const grid = {
  container: {
    maxWidth: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    padding: {
      DEFAULT: spacing[4],
      sm: spacing[6],
      lg: spacing[8],
      xl: spacing[12]
    }
  },
  columns: 12,
  gap: {
    DEFAULT: spacing[4],
    sm: spacing[2],
    lg: spacing[6],
    xl: spacing[8]
  }
};
```

### 2. Responsive Breakpoints
```typescript
// Breakpoint configuration
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};
```

## Animation Guidelines

### 1. Transitions
```typescript
// Transition tokens
const transitions = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms'
  },
  timing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)'
  }
};
```

### 2. Animations
```typescript
// Animation tokens
const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  slideIn: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 }
  }
};
```

## Accessibility Guidelines

### 1. Color Contrast
- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text
- Minimum contrast ratio: 3:1 for UI components

### 2. Focus States
```typescript
// Focus styles
const focusStyles = {
  outline: 'none',
  boxShadow: `0 0 0 3px ${colors.primary.light}`,
  transition: `box-shadow ${transitions.duration.fast} ${transitions.timing.easeOut}`
};
```

### 3. Interactive Elements
- Minimum touch target size: 44x44px
- Minimum spacing between interactive elements: 8px
- Clear visual feedback for all interactive states

## Implementation

### 1. Theme Configuration
```typescript
// Theme configuration
const theme = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  grid,
  breakpoints,
  transitions,
  animations
};
```

### 2. Style Utilities
```typescript
// Style utility functions
const utils = {
  px: (value: number) => `${value}px`,
  rem: (value: number) => `${value}rem`,
  em: (value: number, base: number) => `${value / base}em`,
  rgba: (color: string, alpha: number) => `rgba(${color}, ${alpha})`
};
```

## Best Practices

### 1. Design Token Usage
- Use design tokens for all visual properties
- Maintain consistent naming conventions
- Document token usage and purpose
- Version control design tokens

### 2. Component Styling
- Follow atomic design principles
- Use composition over inheritance
- Implement responsive design patterns
- Maintain consistent spacing

### 3. Performance
- Optimize asset delivery
- Implement lazy loading
- Use efficient CSS selectors
- Minimize repaints and reflows

### 4. Maintenance
- Regular design system audits
- Version control documentation
- Component library updates
- Accessibility compliance checks

## Next Steps
1. Review the [Component Library](./component-library.md)
2. Study [Accessibility Guidelines](./accessibility.md)
3. Explore [Animation Guidelines](./animation.md)
4. Check [Icon System](./icon-system.md)

---
*Last updated: March 2024*
Copyright © 2024 SafeAI. All rights reserved. 