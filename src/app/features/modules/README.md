# Modules Feature

The Modules feature displays the "Reference Modules" catalog - a showcase of enterprise-grade Angular patterns and implementations.

## Purpose

This feature serves as a portfolio of reusable Angular patterns, complete with descriptions, code examples, and documentation. It demonstrates:

- Signal-based state management with NgRx SignalStore
- Debounced search/filtering
- Lazy-loaded routes with detail views
- Responsive grid layouts

## State

**Store:** `ModulesStore` (`@ngrx/signals`)

- `entities: Module[]` - All loaded modules
- `filter: string` - Current search filter
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message if loading fails
- `filteredModules()` - Computed: filtered modules based on search
- `getModuleById()` - Computed: function to get module by ID

## Routes

| Path           | Component               | Description                         |
| -------------- | ----------------------- | ----------------------------------- |
| `/modules`     | `ModulesComponent`      | Module catalog with search/filter   |
| `/modules/:id` | `ModuleDetailComponent` | Individual module details with tabs |

## Key Components

### ModulesComponent

The main catalog page featuring:

- Search input with 300ms debounce
- Grid of module cards with status and category badges
- Loading, error, and empty states

### ModuleDetailComponent

The detail page featuring:

- Module header with title and badges
- Action buttons (Launch Demo, View Source)
- Tabbed content: Overview, Technical Specs, Code Snippet

## Data Source

Mock data is loaded from `src/assets/data/modules.json`.

### Module Interface

```typescript
interface Module {
  id: string;
  title: string;
  description: string;
  category: 'state-management' | 'security' | 'ui' | 'infrastructure';
  status: 'production' | 'beta' | 'experimental';
  tags: string[];
  repoUrl: string | null;
  demoUrl: string | null;
  features: string[];
  techStack: string[];
}
```
