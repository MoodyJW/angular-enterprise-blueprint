# ADR-014: Strict Layering with ESLint Boundaries

## Status

Accepted

## Date

2025-12-24

## Context

In large frontend codebases, spaghetti code often emerges when modules import from each other indiscriminately. This creates circular dependencies and makes refactoring (or extracting micro-frontends) a nightmare.

We need to enforce architectural boundaries.

### Options Considered

1. **Convention / Code Review**:
   - _Pros_: Flexible.
   - _Cons_: Falls apart under pressure; rely on human vigilance.
2. **Nx / Monorepo Tools**:
   - _Pros_: Native enforcement of library boundaries.
   - _Cons_: We are currently using a standard Angular CLI setup, not Nx.
3. **`eslint-plugin-boundaries`**:
   - _Pros_: Works with standard CLI, configurable via JSON.

## Decision

We chose **`eslint-plugin-boundaries`** to enforce strict architectural layering with automated build-time validation.

### Rationale

1. **Prevents Circular Dependencies**: Enforces unidirectional data flow, making it impossible for features to become tangled.
2. **Scalability**: As the team grows, automated enforcement prevents architectural violations that code reviews might miss.
3. **Maintainability**: Clear boundaries make it easier to understand, test, and refactor individual layers without ripple effects.
4. **Future-Proofing**: Well-defined layers facilitate potential extraction into micro-frontends or separate packages.
5. **CI/CD Integration**: Violations fail the build immediately, catching problems before they reach production.

### The Layering Rules

1. **Shared Layer**: Can be used by anyone. CANNOT import from Feature or Core.
   - Purpose: Reusable UI components and utilities
   - Example: Buttons, inputs, cards, utility functions

2. **Core Layer**: Can only import from Shared. Contains singleton services.
   - Purpose: Application-wide infrastructure and services
   - Example: Auth, analytics, logging, theming, error handling

3. **Features Layer**: Can import from Shared and Core. CANNOT import from other Features (siblings).
   - Purpose: Feature-specific business logic and smart components
   - Example: Dashboard, modules catalog, profile, contact

## Implementation

`.eslintrc.json` configuration:

```json
{
  "plugins": ["boundaries"],
  "settings": {
    "boundaries/elements": [
      { "type": "core", "pattern": "app/core/*" },
      { "type": "shared", "pattern": "app/shared/*" },
      { "type": "feature", "pattern": "app/features/*" }
    ]
  },
  "rules": {
    "boundaries/element-types": [
      2,
      {
        "default": "disallow",
        "rules": [
          { "from": "core", "allow": ["shared"] },
          { "from": "feature", "allow": ["core", "shared"] },
          { "from": "shared", "allow": [] }
        ]
      }
    ]
  }
}
```

## Consequences

### Positive

- **Decoupling**: Features are truly independent.
- **Maintainability**: Low coupling, high cohesion.

### Negative

- **Friction**: Sometimes you _really_ want to share a type between Feature A and Feature B. This forces you to move IT to `Shared`, which is the correct architectural move but feels like extra work in the moment.

### Neutral

- **Industry Best Practice**: Enforced layering is standard in enterprise applications, whether through linters (like we use), monorepo tools (Nx), or module systems.
- **Architectural Investment**: The initial setup cost pays dividends as the codebase grows—teams that skip this step often face costly refactoring later.

## References

- [ESLint Plugin Boundaries](https://github.com/javierbrea/eslint-plugin-boundaries)
