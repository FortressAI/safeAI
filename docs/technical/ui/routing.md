# SafeAI Routing Documentation
---
breadcrumb: [Home](../README.md) > [Technical Documentation](../technical/README.md) > [UI Documentation](../technical/ui/README.md) > [Routing](../technical/ui/routing.md)
---
## Overview
The SafeAI platform uses React Router for client-side routing, implementing a comprehensive routing system that includes protected routes, dynamic routing, and navigation patterns. This document details our routing architecture, patterns, and best practices.
## Routing Architecture
### 1. Route Configuration
```typescript
// Route types
interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
  meta?: RouteMeta;
}

interface RouteMeta {
  requiresAuth: boolean;
  roles?: string[];
  title?: string;
}

// Route configuration
const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
        meta: {
          requiresAuth: true,
          title: 'Dashboard'
        }
      },
      {
        path: 'agents',
        element: <AgentManagement />,
        meta: {
          requiresAuth: true,
          roles: ['admin', 'agent-manager'],
          title: 'Agent Management'
        }
      },
      {
        path: 'knowledge-graph',
        element: <KnowledgeGraph />,
        meta: {
          requiresAuth: true,
          title: 'Knowledge Graph'
        }
      }
    ]
  }
];
```
### 2. Router Setup
```typescript
// Router configuration
const router = createBrowserRouter(routes, {
  basename: '/app',
  future: {
    v7_normalizeFormMethod: true
  }
});

// Router provider
const App: React.FC = () => {
  return (
    <RouterProvider router={router} />
  );
};
```
### 3. Route Protection
```typescript
// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
  meta: RouteMeta;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  meta
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (meta.roles && !meta.roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```
## Navigation Patterns
### 1. Programmatic Navigation
```typescript
// Navigation hooks
const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = useCallback((path: string, options?: NavigateOptions) => {
    navigate(path, options);
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const replace = useCallback((path: string) => {
    navigate(path, { replace: true });
  }, [navigate]);

  return {
    goTo,
    goBack,
    replace,
    location
  };
};
```
### 2. Link Components
```typescript
// Custom link component
interface SafeLinkProps extends LinkProps {
  to: string;
  children: React.ReactNode;
  activeClassName?: string;
}

const SafeLink: React.FC<SafeLinkProps> = ({
  to,
  children,
  activeClassName,
  ...props
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={clsx(props.className, {
        [activeClassName]: isActive
      })}
      {...props}
    >
      {children}
    </Link>
  );
};
```
### 3. Breadcrumb Navigation
```typescript
// Breadcrumb component
interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={item.path}>
            {index === items.length - 1 ? (
              <span>{item.label}</span>
            ) : (
              <Link to={item.path}>{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
```
## Dynamic Routing
### 1. Route Parameters
```typescript
// Dynamic route configuration
const dynamicRoutes: RouteConfig[] = [
  {
    path: 'agents/:id',
    element: <AgentDetails />,
    meta: {
      requiresAuth: true,
      title: 'Agent Details'
    }
  }
];

// Parameter handling
const AgentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { agent, loading } = useAgent(id);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1>{agent.name}</h1>
      {/* Agent details */}
    </div>
  );
};
```
### 2. Query Parameters
```typescript
// Query parameter handling
const useQueryParams = () => {
  const [searchParams] = useSearchParams();

  const getParam = useCallback((key: string) => {
    return searchParams.get(key);
  }, [searchParams]);

  const setParam = useCallback((key: string, value: string) => {
    searchParams.set(key, value);
  }, [searchParams]);

  return {
    getParam,
    setParam,
    searchParams
  };
};
```
## Route Guards
### 1. Authentication Guard
```typescript
// Authentication guard
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```
### 2. Role Guard
```typescript
// Role guard
interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles: string[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRoles
}) => {
  const { user } = useAuth();

  if (!user || !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```
### 3. Feature Flag Guard
```typescript
// Feature flag guard
interface FeatureGuardProps {
  children: React.ReactNode;
  feature: string;
}

const FeatureGuard: React.FC<FeatureGuardProps> = ({
  children,
  feature
}) => {
  const { isEnabled } = useFeatureFlag(feature);

  if (!isEnabled) {
    return <Navigate to="/feature-disabled" replace />;
  }

  return <>{children}</>;
};
```
## Error Handling
### 1. Error Boundaries
```typescript
// Route error boundary
class RouteErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} />;
    }
    return this.props.children;
  }
}
```
### 2. 404 Handling
```typescript
// 404 route
const NotFound: React.FC = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Go Home</Link>
    </div>
  );
};
```
## Performance Optimization
### 1. Code Splitting
```typescript
// Lazy loading routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AgentManagement = lazy(() => import('./pages/AgentManagement'));
const KnowledgeGraph = lazy(() => import('./pages/KnowledgeGraph'));

// Suspense wrapper
const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};
```
### 2. Route Preloading
```typescript
// Route preloading
const preloadRoute = (path: string) => {
  const route = routes.find(r => r.path === path);
  if (route) {
    const component = route.element as React.LazyExoticComponent<any>;
    component.preload();
  }
};
```
## Testing
### 1. Route Testing
```typescript
// Route test
describe('Route Configuration', () => {
  it('should render protected route when authenticated', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <ProtectedRoute meta={{ requiresAuth: true }}>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(container).toHaveTextContent('Protected Content');
  });
});
```
### 2. Navigation Testing
```typescript
// Navigation test
describe('Navigation', () => {
  it('should navigate to correct route', () => {
    const { container } = render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Dashboard'));
    expect(container).toHaveTextContent('Dashboard Content');
  });
});
```
## Best Practices
### 1. Route Organization
- Keep routes modular and organized
- Use consistent route naming
- Implement proper route protection
- Document route requirements
### 2. Navigation
- Use declarative navigation when possible
- Implement proper loading states
- Handle navigation errors
- Maintain navigation history
### 3. Performance
- Implement code splitting
- Use route preloading
- Optimize route transitions
- Monitor route performance
### 4. Security
- Protect sensitive routes
- Validate route parameters
- Handle unauthorized access
- Implement proper redirects
## Next Steps
1. Review the [Component Library](./component-library.md)
2. Study [State Management](./state-management.md)
3. Explore [Authentication](./authentication.md)
4. Check [Error Handling](./error-handling.md)
---
*Last updated: March 2024*
Copyright © 2024 SafeAI. All rights reserved. 