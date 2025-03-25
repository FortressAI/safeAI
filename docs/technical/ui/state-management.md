# SafeAI State Management
---
breadcrumb: [Home](../README.md) > [Technical Documentation](../technical/README.md) > [UI Documentation](../technical/ui/README.md) > [State Management](../technical/ui/state-management.md)
---

## Overview
The SafeAI platform uses a comprehensive state management approach that combines Redux for global state, React Context for theme and authentication, and local state for component-specific data. This document details our state management patterns, implementation details, and best practices.

## State Management Architecture

### 1. Global State (Redux)
```typescript
// Root state type
interface RootState {
  agents: AgentState;
  knowledgeGraph: KnowledgeGraphState;
  content: ContentState;
  security: SecurityState;
  ui: UIState;
}

// Store configuration
const store = configureStore({
  reducer: {
    agents: agentReducer,
    knowledgeGraph: knowledgeGraphReducer,
    content: contentReducer,
    security: securityReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiMiddleware,
      loggerMiddleware
    )
});
```

### 2. Feature State Slices
```typescript
// Agent state slice
interface AgentState {
  agents: Agent[];
  selectedAgent: Agent | null;
  loading: boolean;
  error: string | null;
}

const agentSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setAgents: (state, action: PayloadAction<Agent[]>) => {
      state.agents = action.payload;
    },
    selectAgent: (state, action: PayloadAction<Agent>) => {
      state.selectedAgent = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});
```

### 3. Context State
```typescript
// Theme context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
});

// Auth context
interface AuthContextType {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {}
});
```

## State Management Patterns

### 1. Redux Thunks
```typescript
// Async action creator
export const fetchAgents = createAsyncThunk(
  'agents/fetchAgents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/agents');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk middleware
const thunkMiddleware = createThunkMiddleware();
```

### 2. Selectors
```typescript
// Memoized selectors
export const selectAgents = (state: RootState) => state.agents.agents;
export const selectSelectedAgent = (state: RootState) => state.agents.selectedAgent;
export const selectAgentLoading = (state: RootState) => state.agents.loading;
export const selectAgentError = (state: RootState) => state.agents.error;

// Complex selectors
export const selectActiveAgents = createSelector(
  [selectAgents],
  (agents) => agents.filter(agent => agent.status === 'active')
);
```

### 3. Custom Hooks
```typescript
// Agent management hook
export const useAgentManagement = () => {
  const dispatch = useDispatch();
  const agents = useSelector(selectAgents);
  const loading = useSelector(selectAgentLoading);
  const error = useSelector(selectAgentError);

  const fetchAgents = useCallback(() => {
    dispatch(fetchAgentsThunk());
  }, [dispatch]);

  const createAgent = useCallback((agent: Agent) => {
    dispatch(createAgentThunk(agent));
  }, [dispatch]);

  return {
    agents,
    loading,
    error,
    fetchAgents,
    createAgent
  };
};
```

## State Updates

### 1. Immutable Updates
```typescript
// Immutable state updates
const updateAgent = (state: AgentState, action: PayloadAction<Agent>) => {
  const index = state.agents.findIndex(a => a.id === action.payload.id);
  if (index !== -1) {
    state.agents[index] = action.payload;
  }
};
```

### 2. Batch Updates
```typescript
// Batch state updates
const batchUpdateAgents = (state: AgentState, action: PayloadAction<Agent[]>) => {
  const updates = action.payload.reduce((acc, agent) => {
    acc[agent.id] = agent;
    return acc;
  }, {} as Record<string, Agent>);

  state.agents = state.agents.map(agent => 
    updates[agent.id] || agent
  );
};
```

## Performance Optimization

### 1. Memoization
```typescript
// Memoized component
const AgentList = memo(({ agents, onSelect }: AgentListProps) => {
  return (
    <div>
      {agents.map(agent => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
});

// Memoized callback
const handleSelect = useCallback((agent: Agent) => {
  dispatch(selectAgent(agent));
}, [dispatch]);
```

### 2. State Normalization
```typescript
// Normalized state structure
interface NormalizedState<T> {
  entities: Record<string, T>;
  ids: string[];
}

// Normalized agent state
interface AgentState extends NormalizedState<Agent> {
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}
```

## Error Handling

### 1. Error States
```typescript
// Error handling in reducers
const handleError = (state: BaseState, action: PayloadAction<Error>) => {
  state.error = action.payload.message;
  state.loading = false;
};

// Error boundary component
class ErrorBoundary extends React.Component {
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

### 2. Error Recovery
```typescript
// Error recovery actions
export const recoverFromError = createAsyncThunk(
  'app/recoverFromError',
  async (_, { dispatch }) => {
    dispatch(resetErrorState());
    dispatch(initializeApp());
  }
);
```

## Testing

### 1. Reducer Tests
```typescript
// Reducer test
describe('agentReducer', () => {
  it('should handle setAgents', () => {
    const initialState = { agents: [], loading: false, error: null };
    const agents = [{ id: '1', name: 'Agent 1' }];
    
    const nextState = agentReducer(initialState, setAgents(agents));
    
    expect(nextState.agents).toEqual(agents);
  });
});
```

### 2. Thunk Tests
```typescript
// Thunk test
describe('fetchAgents thunk', () => {
  it('should fetch agents successfully', async () => {
    const agents = [{ id: '1', name: 'Agent 1' }];
    api.get.mockResolvedValueOnce({ data: agents });
    
    const dispatch = jest.fn();
    await fetchAgents()(dispatch, () => ({}), undefined);
    
    expect(dispatch).toHaveBeenCalledWith(setAgents(agents));
  });
});
```

## Best Practices

### 1. State Organization
- Keep state normalized
- Use appropriate state management solutions
- Implement proper error handling
- Follow immutable update patterns

### 2. Performance
- Use memoization effectively
- Implement proper state normalization
- Optimize re-renders
- Monitor state updates

### 3. Testing
- Write comprehensive tests
- Test edge cases
- Mock external dependencies
- Test error scenarios

### 4. Maintenance
- Document state structure
- Version control state changes
- Regular state audits
- Performance monitoring

## Next Steps
1. Review the [Component Library](./component-library.md)
2. Study [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
3. Explore [React Query Documentation](https://react-query.tanstack.com/)
4. Check [State Management Patterns](./patterns.md)

---
*Last updated: March 2024*
Copyright © 2024 SafeAI. All rights reserved. 