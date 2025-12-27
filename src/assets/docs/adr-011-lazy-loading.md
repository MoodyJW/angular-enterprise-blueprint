# ADR-011: Lazy Loading & Code Splitting Strategy

## Status

Accepted

## Date

2025-12-22

## Context

As the application grows, the initial bundle size can destroy load performance, especially on mobile networks. We need a strategy to split the code into smaller chunks that are loaded only when needed.

### Options Considered

1. **Eager Loading**: Include everything in `main.js`.
   - _Pros_: Simple routing.
   - _Cons_: Massive initial download, slow TTI (Time to Interactive).
2. **NgModule Lazy Loading**: The legacy Angular way.
   - _Pros_: Battle-tested.
   - _Cons_: Heavy boilerplate (Module files, routing modules).
3. **Standalone Component Lazy Loading**: The modern Angular way using `loadComponent`.
   - _Pros_: Zero boilerplate, fine-grained control, optimized tree-shaking.

## Decision

We chose **Option 3: Standalone Component Lazy Loading**.

### Rationale

1. **Performance**: Only the code for the requested route is downloaded.
2. **Architecture**: Forces loose coupling between features (you can't import what you haven't loaded).
3. **Simplicity**: One line configuration in `app.routes.ts`.

## Implementation

```typescript
// src/app/app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/settings/settings.routes').then((m) => m.routes),
  },
];
```

We also enforce limits on bundle sizes via `angular.json` budgets:

- **Initial**: 1MB maximum warning.
- **Any Component Style**: 4KB maximum warning.

## Consequences

### Positive

- **Start-up Time**: Drastically reduced.
- **Maintainability**: Clear separation of features.

### Negative

- **Network Latency**: User might see a brief delay when navigating to a new feature for the first time (mitigated by preloading strategies, though currently we rely on rapid network fetching).

### Neutral

- **Standard Pattern in Modern Angular**: Lazy loading with standalone components is the recommended approach in Angular 14+.
- **Future-Proof**: This pattern aligns with Angular's long-term roadmap and will remain supported as the framework evolves.

## References

- [Angular Lazy Loading Guide](https://angular.dev/guide/routing/lazy-loading)
