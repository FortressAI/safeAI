# SafeAI UI Performance Testing Documentation
---
breadcrumb: [Home](../README.md) > [Technical Documentation](../technical/README.md) > [UI Documentation](../technical/ui/README.md) > [Performance Testing](../technical/ui/performance-testing.md)
---
## Overview
The SafeAI platform implements comprehensive performance testing to ensure optimal user experience and application responsiveness. This document details our performance testing strategies, tools, and best practices.
## Performance Metrics
### 1. Core Web Vitals
```typescript
// web-vitals.ts
import { getCLS, getFID, getLCP } from 'web-vitals';

export const reportWebVitals = (metric: any) => {
  // Send to analytics
  console.log(metric);
  
  // Performance budgets
  const budgets = {
    LCP: 2500, // 2.5 seconds
    FID: 100,  // 100 milliseconds
    CLS: 0.1   // 0.1
  };
  
  if (metric.name === 'LCP' && metric.value > budgets.LCP) {
    console.warn('LCP exceeded budget:', metric.value);
  }
};

getCLS(reportWebVitals);
getFID(reportWebVitals);
getLCP(reportWebVitals);
```
### 2. Custom Performance Metrics
```typescript
// performance-metrics.ts
export const measureComponentPerformance = (componentName: string) => {
  const startTime = performance.now();
  
  return {
    end: () => {
      const duration = performance.now() - startTime;
      console.log(`${componentName} render time:`, duration);
      return duration;
    }
  };
};
```
## Load Testing
### 1. k6 Configuration
```typescript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up
    { duration: '1m', target: 20 },  // Stay at peak
    { duration: '30s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.1'],    // Less than 10% of requests can fail
  },
};

export default function () {
  const res = http.get('http://localhost:3000');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```
### 2. Artillery Configuration
```yaml
# artillery.yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 50
      name: "Ramp up load"
  payload:
    path: "users.csv"
    fields:
      - "email"
      - "password"
  variables:
    token: ""
  plugins:
    metrics-by-endpoint: {}

scenarios:
  - name: "User journey"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
      - think: 3
      - get:
          url: "/api/user/profile"
          headers:
            Authorization: "Bearer {{ token }}"
```
## Performance Monitoring
### 1. Real User Monitoring (RUM)
```typescript
// rum.ts
export const initRUM = () => {
  // Navigation timing
  window.addEventListener('load', () => {
    const timing = performance.getEntriesByType('navigation')[0];
    console.log('Page load time:', timing.loadEventEnd - timing.navigationStart);
  });
  
  // Resource timing
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.initiatorType === 'fetch') {
        console.log('API call duration:', entry.duration);
      }
    });
  });
  
  observer.observe({ entryTypes: ['resource'] });
};
```
### 2. Synthetic Monitoring
```typescript
// synthetic-monitoring.ts
export const runSyntheticTests = async () => {
  const tests = [
    {
      name: 'Homepage load',
      url: '/',
      threshold: 2000
    },
    {
      name: 'Agent creation',
      url: '/agents/create',
      threshold: 3000
    }
  ];
  
  for (const test of tests) {
    const startTime = performance.now();
    await fetch(test.url);
    const duration = performance.now() - startTime;
    
    if (duration > test.threshold) {
      console.warn(`${test.name} exceeded threshold:`, duration);
    }
  }
};
```
## Performance Optimization
### 1. Code Splitting
```typescript
// App.tsx
import { lazy, Suspense } from 'react';

const AgentManagement = lazy(() => import('./features/AgentManagement'));
const UserProfile = lazy(() => import('./features/UserProfile'));

export const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/agents" element={<AgentManagement />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  </Suspense>
);
```
### 2. Image Optimization
```typescript
// ImageOptimizer.tsx
import { Image } from 'next/image';

export const OptimizedImage = ({ src, alt, ...props }) => (
  <Image
    src={src}
    alt={alt}
    loading="lazy"
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    {...props}
  />
);
```
## Performance Budgets
### 1. Budget Configuration
```typescript
// performance-budgets.ts
export const performanceBudgets = {
  firstContentfulPaint: 1800,    // 1.8 seconds
  largestContentfulPaint: 2500,  // 2.5 seconds
  firstInputDelay: 100,          // 100ms
  cumulativeLayoutShift: 0.1,    // 0.1
  timeToInteractive: 3500,       // 3.5 seconds
  totalBlockingTime: 300,        // 300ms
  speedIndex: 3400,              // 3.4 seconds
  resourceSize: {
    js: 170000,                  // 170KB
    css: 50000,                  // 50KB
    images: 500000,              // 500KB
    fonts: 100000                // 100KB
  }
};
```
### 2. Budget Monitoring
```typescript
// budget-monitor.ts
export const monitorPerformanceBudgets = () => {
  const metrics = {
    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
    lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime,
    fid: performance.getEntriesByName('first-input-delay')[0]?.duration,
    cls: performance.getEntriesByName('layout-shift')[0]?.value
  };
  
  Object.entries(metrics).forEach(([metric, value]) => {
    if (value > performanceBudgets[metric]) {
      console.warn(`${metric} exceeded budget:`, value);
    }
  });
};
```
## Performance Testing Tools
### 1. Lighthouse CI
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
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-input-delay': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }]
      }
    }
  }
};
```
### 2. WebPageTest
```typescript
// webpagetest.ts
import { WebPageTest } from 'webpagetest';

const wpt = new WebPageTest('YOUR_API_KEY');

export const runWebPageTest = async (url: string) => {
  const result = await wpt.runTest(url, {
    location: 'Dulles:Chrome',
    connectivity: '4G',
    runs: 3,
    video: true,
    lighthouse: true
  });
  
  return result;
};
```
## Best Practices
### 1. Performance Testing
- Define clear performance budgets
- Monitor core web vitals
- Test under various conditions
- Regular performance reviews
### 2. Performance Optimization
- Implement code splitting
- Optimize assets
- Use caching strategies
- Monitor bundle size
### 3. Performance Monitoring
- Set up real user monitoring
- Implement synthetic testing
- Monitor error rates
- Track performance trends
### 4. Performance Maintenance
- Regular performance audits
- Update performance budgets
- Optimize based on metrics
- Document performance decisions
## Next Steps
1. Review the [Testing Documentation](./testing.md)
2. Explore [Testing Tools](./testing-tools.md)
3. Check [Test Automation](./test-automation.md)
4. Study [Component Testing](./component-testing.md)
---
*Last updated: March 2024*
Copyright © 2024 SafeAI. All rights reserved. 