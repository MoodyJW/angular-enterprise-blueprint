# ADR-001: SignalStore for State Management

## Status

Accepted

## Date

2025-12-15

## Context

The Angular Enterprise Blueprint requires a robust state management solution that:

- Integrates seamlessly with Angular's signals
- Provides type-safe state containers
- Supports computed/derived state
- Works well with standalone components
- Has minimal boilerplate

### Options Considered

1. **NgRx Store** - Full Redux implementation with actions, reducers, effects
2. **NgRx SignalStore** - Lightweight signal-based state management
3. **RxAngular** - RxJS-focused state management
4. **Plain Services with Signals** - Custom signal-based services

## Decision

We chose **NgRx SignalStore** (`@ngrx/signals`) as our primary state management solution.

### Rationale

1. **Signal-First Design**: Built specifically for Angular 17+ signals, providing reactive state without RxJS complexity.

2. **Minimal Boilerplate**: Unlike traditional NgRx, SignalStore requires no actions, reducers, or effects files.

3. **Type Safety**: Full TypeScript inference for state, computed properties, and methods.

4. **Entity Management**: `withEntities()` feature provides CRUD operations out of the box.

5. **RxJS Integration**: `rxMethod()` allows seamless integration with observables for async operations.

## Implementation

```typescript
// Example: ModulesStore
export const ModulesStore = signalStore(
  withState({ entities: [], filter: '', isLoading: false, error: null }),
  withComputed((store) => ({
    filteredModules: computed(() => {
      const filter = store.filter().toLowerCase();
      return store.entities().filter((m) => m.title.includes(filter));
    }),
  })),
  withMethods((store, service = inject(ModulesService)) => ({
    loadModules: rxMethod<void>(
      pipe(
        switchMap(() => service.getModules()),
        tapResponse({
          next: (entities) => patchState(store, { entities }),
          error: (err) => patchState(store, { error: err.message }),
        }),
      ),
    ),
  })),
);
```

## Consequences

### Positive

- Reduced boilerplate compared to traditional NgRx
- Better integration with Angular's signal-based change detection
- Easier onboarding for developers unfamiliar with Redux patterns
- Computed properties are memoized and efficient

### Negative

- Less ecosystem tooling compared to NgRx Store (e.g., DevTools limited)
- Newer pattern with fewer community examples
- Custom patterns needed for complex side effects

### Neutral

- Different mental model than traditional Redux
- Migration path exists from NgRx Store if needed

## References

- [NgRx SignalStore Documentation](https://ngrx.io/guide/signals)
- [Angular Signals RFC](https://github.com/angular/angular/discussions/49685)
