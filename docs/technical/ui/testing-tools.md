# SafeAI UI Testing Tools Documentation
---
breadcrumb: [Home](../README.md) > [Technical Documentation](../technical/README.md) > [UI Documentation](../technical/ui/README.md) > [Testing Tools](../technical/ui/testing-tools.md)
---
## Overview
The SafeAI platform uses a comprehensive suite of testing tools to ensure code quality, maintainability, and reliability. This document details the testing tools used, their configuration, and best practices.
## Testing Framework
### 1. Jest
```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx'
  ]
};
```
### 2. React Testing Library
```typescript
// setupTests.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```
## Component Testing
### 1. Storybook
```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button'
  }
};
```
### 2. Testing Library Queries
```typescript
// Component test example
describe('Component Queries', () => {
  it('should find elements by role', () => {
    const { getByRole } = render(<Component />);
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should find elements by text', () => {
    const { getByText } = render(<Component />);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('should find elements by test id', () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId('submit-button')).toBeInTheDocument();
  });
});
```
## API Testing
### 1. MSW (Mock Service Worker)
```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/agents', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: '1', name: 'Agent 1' },
        { id: '2', name: 'Agent 2' }
      ])
    );
  })
];
```
### 2. Axios Mock Adapter
```typescript
// mocks/axios.ts
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

const mock = new MockAdapter(axios);

mock.onGet('/api/agents').reply(200, [
  { id: '1', name: 'Agent 1' },
  { id: '2', name: 'Agent 2' }
]);
```
## End-to-End Testing
### 1. Cypress
```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: true
  }
});
```
### 2. Playwright
```typescript
// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    }
  ]
};

export default config;
```
## Accessibility Testing
### 1. Axe Core
```typescript
// accessibility.test.ts
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```
### 2. Lighthouse CI
```typescript
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000'],
      numberOfRuns: 5
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }]
      }
    }
  }
};
```
## Performance Testing
### 1. Lighthouse
```typescript
// performance.test.ts
import lighthouse from 'lighthouse';

describe('Performance', () => {
  it('should meet performance budgets', async () => {
    const results = await lighthouse('http://localhost:3000', {
      output: 'json',
      onlyCategories: ['performance']
    });
    
    expect(results.lhr.categories.performance.score).toBeGreaterThan(0.9);
  });
});
```
### 2. Web Vitals
```typescript
// web-vitals.ts
import { getCLS, getFID, getLCP } from 'web-vitals';

export function reportWebVitals(metric: any) {
  console.log(metric);
  // Send to analytics
}

getCLS(reportWebVitals);
getFID(reportWebVitals);
getLCP(reportWebVitals);
```
## Test Coverage
### 1. Istanbul
```typescript
// coverage.config.js
module.exports = {
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```
### 2. Codecov
```yaml
# .codecov.yml
coverage:
  status:
    project:
      default:
        target: 80%
        threshold: 1%
    patch:
      default:
        target: 80%
        threshold: 1%
```
## Test Utilities
### 1. Test Helpers
```typescript
// test-utils.tsx
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import { store } from './store';
import { theme } from './theme';

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: RenderOptions
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </Provider>
    ),
    ...options
  });
};
```
### 2. Mock Data
```typescript
// mock-data.ts
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin'
};

export const mockAgents = Array(10).fill(null).map((_, index) => ({
  id: String(index + 1),
  name: `Agent ${index + 1}`,
  status: 'active',
  createdAt: new Date().toISOString()
}));
```
## Best Practices
### 1. Tool Selection
- Choose appropriate tools for each testing type
- Consider tool integration and compatibility
- Evaluate tool maintenance and community support
- Consider licensing and cost implications
### 2. Configuration
- Maintain consistent configuration across projects
- Document configuration decisions
- Version control configuration files
- Regular configuration reviews
### 3. Integration
- Ensure tools work together seamlessly
- Maintain clear separation of concerns
- Implement proper error handling
- Regular integration testing
### 4. Maintenance
- Keep tools up to date
- Monitor tool performance
- Regular maintenance reviews
- Document tool-specific issues
## Next Steps
1. Review the [Testing Documentation](./testing.md)
2. Explore [Test Automation](./test-automation.md)
3. Check [Performance Testing](./performance-testing.md)
4. Study [Component Testing](./component-testing.md)
---
*Last updated: March 2024*
Copyright © 2024 SafeAI. All rights reserved. 