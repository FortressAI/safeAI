# UI Components Documentation
---
breadcrumb: [Home](../README.md) > [Technical Documentation](../technical/README.md) > [UI](../technical/ui/README.md) > [UI Components](../technical/ui/ui-components.md)
---

## Overview
This document provides detailed documentation for all UI components in the SafeAI platform, including their usage, props, and examples.

## Component Hierarchy

The following diagram illustrates the hierarchical relationship between different UI components:

![UI Component Hierarchy](../images/ui-component-hierarchy.svg)

## Layout Structure

The main layout structure of the application is shown below:

![UI Layout Structure](../images/ui-layout-structure.svg)

## Core Components

### MainLayout
The main layout component that provides the basic structure for the application.

```typescript
interface MainLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
}
```

### AgentWorkspace
The primary workspace for agent management and interaction.

```typescript
interface AgentWorkspaceProps {
  agent: Agent;
  onUpdate: (agent: Agent) => void;
  onDelete: (agentId: string) => void;
}
```

### KnowledgeGraphViewer
Component for visualizing and interacting with the agentic knowledge graph.

```typescript
interface KnowledgeGraphViewerProps {
  graph: KnowledgeGraph;
  onNodeClick: (nodeId: string) => void;
  onEdgeClick: (edgeId: string) => void;
}
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

The form components available in the platform are shown in the following diagram:

![UI Form Components](../images/ui-form-components.svg)

### Input
A versatile input component supporting various input types.

```typescript
interface InputProps {
  type: 'text' | 'password' | 'email' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
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
Button component with multiple variants and states.

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
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

The data display components and their relationships are shown below:

![UI Data Display](../images/ui-data-display.svg)

### Table
A flexible table component for displaying structured data.

```typescript
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  sortable?: boolean;
  pagination?: PaginationProps;
}
```

#### Usage
```typescript
<Table
  data={agents}
  columns={agentColumns}
  onRowClick={(agent) => handleAgentSelect(agent)}
/>
```

### Chart
Component for visualizing data using various chart types.

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
Shows the current location in the application hierarchy.

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
Tab navigation component for organizing content.

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
Notification component for displaying temporary messages.

```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
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
Dialog component for displaying important information or collecting user input.

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
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

1. **Component Composition**
   - Use composition over inheritance
   - Break down complex components into smaller, reusable pieces
   - Keep components focused on a single responsibility

2. **State Management**
   - Use local state for component-specific data
   - Implement Redux for global state management
   - Keep state as close as possible to where it's used

3. **Performance**
   - Implement React.memo for expensive renders
   - Use useCallback and useMemo for optimization
   - Lazy load components when possible

4. **Accessibility**
   - Include ARIA labels and roles
   - Ensure keyboard navigation works
   - Maintain sufficient color contrast
   - Provide alternative text for images

5. **Testing**
   - Write unit tests for components
   - Include integration tests for complex interactions
   - Test edge cases and error states

## Support
For component-related questions or issues:
- Create an issue in the UI repository
- Contact the UI team at ui@safeai.com
- Join the UI development channel in Slack

---
Last Updated: March 2024
© 2024 SafeAI. All rights reserved. 