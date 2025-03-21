# UI Components Documentation
---
breadcrumb: [Home](../README.md) > [Technical Documentation](../technical/README.md) > [UI](../technical/ui/README.md) > [UI Components](../technical/ui/ui-components.md)
---

## Overview
This document provides detailed documentation for all UI components in the SafeAI platform, including their usage, props, and examples.

## Core Components

### AgentWorkspace
The main workspace component for agent interaction and management.

```typescript
interface AgentWorkspaceProps {
  agentId: string;
  onAgentSelect: (agent: Agent) => void;
  onAgentUpdate: (agent: Agent) => void;
}
```

#### Usage
```typescript
<AgentWorkspace
  agentId="agent-123"
  onAgentSelect={(agent) => handleAgentSelect(agent)}
  onAgentUpdate={(agent) => handleAgentUpdate(agent)}
/>
```

### KnowledgeGraphViewer
Component for visualizing and interacting with the knowledge graph.

```typescript
interface KnowledgeGraphViewerProps {
  graphData: GraphData;
  onNodeSelect: (node: GraphNode) => void;
  onEdgeSelect: (edge: GraphEdge) => void;
}
```

#### Usage
```typescript
<KnowledgeGraphViewer
  graphData={graphData}
  onNodeSelect={(node) => handleNodeSelect(node)}
  onEdgeSelect={(edge) => handleEdgeSelect(edge)}
/>
```

### ContentPublisher
Component for publishing and managing content.

```typescript
interface ContentPublisherProps {
  content: Content;
  onPublish: (content: Content) => void;
  onUpdate: (content: Content) => void;
}
```

#### Usage
```typescript
<ContentPublisher
  content={content}
  onPublish={(content) => handlePublish(content)}
  onUpdate={(content) => handleUpdate(content)}
/>
```

## Layout Components

### MainLayout
The primary layout component that provides the application structure.

```typescript
interface MainLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}
```

#### Usage
```typescript
<MainLayout
  sidebar={<Sidebar />}
  header={<Header />}
>
  <MainContent />
</MainLayout>
```

### Card
A versatile container component for content grouping.

```typescript
interface CardProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}
```

#### Usage
```typescript
<Card
  title="Agent Details"
  variant="elevated"
>
  <AgentInfo agent={agent} />
</Card>
```

## Form Components

### Input
A reusable input component with various styles and states.

```typescript
interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'password' | 'email';
  error?: string;
}
```

#### Usage
```typescript
<Input
  label="Agent Name"
  value={agentName}
  onChange={(value) => setAgentName(value)}
  error={errors.agentName}
/>
```

### Button
A versatile button component with multiple variants.

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}
```

#### Usage
```typescript
<Button
  variant="primary"
  onClick={() => handleSubmit()}
  loading={isSubmitting}
>
  Submit
</Button>
```

## Data Display Components

### Table
A flexible table component for displaying structured data.

```typescript
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowSelect?: (row: T) => void;
}
```

#### Usage
```typescript
<Table
  data={agents}
  columns={agentColumns}
  onRowSelect={(agent) => handleAgentSelect(agent)}
/>
```

### Chart
A component for displaying various types of charts and graphs.

```typescript
interface ChartProps {
  type: 'line' | 'bar' | 'pie';
  data: ChartData;
  options?: ChartOptions;
}
```

#### Usage
```typescript
<Chart
  type="line"
  data={performanceData}
  options={chartOptions}
/>
```

## Navigation Components

### Breadcrumb
A navigation component showing the current location in the hierarchy.

```typescript
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onItemClick: (item: BreadcrumbItem) => void;
}
```

#### Usage
```typescript
<Breadcrumb
  items={breadcrumbItems}
  onItemClick={(item) => handleNavigation(item)}
/>
```

### Tabs
A component for organizing content into tabs.

```typescript
interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}
```

#### Usage
```typescript
<Tabs
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' }
  ]}
  activeTab={currentTab}
  onTabChange={(tabId) => setCurrentTab(tabId)}
/>
```

## Feedback Components

### Toast
A notification component for displaying temporary messages.

```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
```

#### Usage
```typescript
<Toast
  message="Agent updated successfully"
  type="success"
  duration={3000}
/>
```

### Modal
A dialog component for displaying important information or actions.

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

#### Usage
```typescript
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Confirm Action"
>
  <ModalContent />
</Modal>
```

## Best Practices

### Component Usage
1. Always provide proper TypeScript types for props
2. Include error handling and loading states
3. Follow accessibility guidelines
4. Implement proper event handling
5. Use consistent naming conventions

### Performance
1. Implement proper memoization
2. Use lazy loading for heavy components
3. Optimize re-renders
4. Follow React best practices

### Accessibility
1. Include proper ARIA labels
2. Ensure keyboard navigation
3. Maintain proper focus management
4. Support screen readers

## Support
For component-related questions or issues:
- Create an issue in the UI repository
- Contact the UI team at ui@safeai.com
- Join the UI development channel in Slack

---
Last Updated: March 2024
© 2024 SafeAI. All rights reserved. 