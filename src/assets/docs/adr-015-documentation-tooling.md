# ADR-015: Documentation Tooling Strategy

## Status

Accepted

## Date

2025-12-25

## Context

Code is read much more often than it is written. Without proper documentation, knowledge is lost as the team scales or rotates. We need tools to document:

1. UI Components (Visual regression, props usage).
2. Application Architecture (High-level decisions).
3. API / Methods (TSDoc).

### Options Considered

1. **Wiki (Confluence/Notion)**:
   - _Pros_: Easy for non-devs.
   - _Cons_: Always goes out of date; disconnected from code versions.
2. **In-Repo Markdown**:
   - _Pros_: Version controlled with code.
   - _Cons_: Static.
3. **Specialized Tools (Compodoc, Storybook)**:
   - _Pros_: Interactive, auto-generated from code.

## Decision

We chose a hybrid approach:

- **Storybook** for UI Components.
- **Compodoc** for Code/Module structure.
- **Markdown (ADRs)** for Architectural Decisions.

### Rationale

1. **Storybook**: It's the industry standard for component development. It allows "Visual Testing" and isolates components development.
2. **Compodoc**: Specifically designed for Angular. Generates relationship graphs (Module A imports Module B) which are invaluable for onboarding.
3. **ADRs**: Stored as markdown next to code, ensuring that the "Why" travels with the "How".

## Implementation

- `docs/` folder contains all ADRs and specifications.
- `.storybook/` contains Storybook config.
- `npm run docs:build` generates the static sites.

## Consequences

### Positive

- **Onboarding**: New engineers can browse the Compodoc diagrams to understand the app structure in minutes.
- **Design System**: Storybook serves as a living style guide.

### Negative

- **Build Time**: Generating documentation takes time in CI.
- **Maintenance**: Stories must be updated when component inputs change.

### Neutral

- **Industry Standard**: The combination of Storybook (components) + technical docs (architecture) + API docs (code) is the conventional approach in modern frontend teams.
- **Tool Maturity**: Both Storybook and Compodoc are well-maintained with large communities, reducing the risk of abandonment.

## References

- [Compodoc](https://compodoc.app/)
- [Storybook for Angular](https://storybook.js.org/docs/angular/get-started/introduction)
