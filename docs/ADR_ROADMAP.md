# ADR Implementation Roadmap

This document outlines additional Architecture Decision Records (ADRs) that should be documented based on the implemented features in the Angular Enterprise Blueprint.

**Status**: Planning
**Last Updated**: 2025-12-26

---

## High Priority (Core Architecture Decisions)

These ADRs document critical architectural decisions that are already implemented and form the foundation of the application.

### ADR-006: Analytics Strategy Pattern

**Status**: Not Started
**Estimated Effort**: 2-3 hours
**Dependencies**: None

**Scope:**

- Decision to use Strategy Pattern for analytics providers
- Swappable implementations (ConsoleAnalyticsProvider, GoogleAnalyticsProvider)
- Environment-based provider selection (`provideAnalytics()`)
- Router tracking integration (`withAnalyticsRouterTracking()`)
- Event tracking API design
- Page view tracking strategy

**Key Implementation Details:**

- `AnalyticsProvider` interface as the contract
- `ConsoleAnalyticsProvider` for development/debugging
- `GoogleAnalyticsProvider` for GA4 production integration
- Factory function for provider selection based on environment
- Automatic router navigation tracking
- 77 tests across analytics suite

**Files to Reference:**

- `src/app/core/services/analytics/analytics.service.ts`
- `src/app/core/services/analytics/analytics.provider.ts`
- `src/app/core/services/analytics/providers/console-analytics.provider.ts`
- `src/app/core/services/analytics/providers/google-analytics.provider.ts`
- `src/app/core/services/analytics/analytics-router.provider.ts`

---

### ADR-007: SEO Management Approach

**Status**: Not Started
**Estimated Effort**: 2-3 hours
**Dependencies**: None

**Scope:**

- Comprehensive SEO service architecture
- Title management with site name suffix
- Meta tags (description, keywords, robots, author)
- Canonical URL management for duplicate content prevention
- Open Graph tags for social media sharing
- Twitter Cards for Twitter-specific sharing
- JSON-LD structured data for rich snippets
- Server-side rendering considerations (or deliberate exclusion)

**Key Implementation Details:**

- Signal-based reactive state management
- Meta tag update strategies
- Social sharing optimization
- Search engine crawler support
- 49 comprehensive tests

**Files to Reference:**

- `src/app/core/services/seo/seo.service.ts`
- `src/app/core/services/seo/seo.service.spec.ts`

---

### ADR-008: I18n Strategy with Transloco

**Status**: Not Started
**Estimated Effort**: 2-3 hours
**Dependencies**: None

**Scope:**

- Choice of Transloco over Angular's built-in i18n
- HTTP loader vs compile-time translation approach
- Translation file structure (`assets/i18n/en.json`)
- Translation key naming conventions (e.g., `home.systemStatus.operationalStatus`)
- Missing translation handling strategy
- Language switching mechanism
- Default language configuration

**Key Implementation Details:**

- `@jsverse/transloco` library integration
- HTTP-based translation loading
- Lazy loading of translation files
- Translation scope organization
- Template usage patterns (`*transloco="let t"`)

**Files to Reference:**

- `src/app/app.config.ts` (Transloco configuration)
- `src/assets/i18n/en.json`
- Example usage in any feature component templates

**Rationale to Cover:**

- Runtime language switching without recompilation
- Smaller bundle sizes (translations loaded on demand)
- Better developer experience with JSON files
- Easier integration with translation services

---

### ADR-009: Testing Strategy

**Status**: Not Started
**Estimated Effort**: 3-4 hours
**Dependencies**: None

**Scope:**

- Vitest adoption over Karma/Jasmine
- Playwright for E2E testing
- Coverage thresholds (85% minimum)
- Test file organization patterns
- Mocking strategies (services, HTTP, stores)
- Component testing approach
- Integration vs unit test boundaries
- CI/CD test integration

**Key Implementation Details:**

- Vitest configuration in `vitest.config.ts`
- Playwright configuration in `playwright.config.ts`
- Test naming conventions
- Fixture patterns for complex setups
- SignalStore testing patterns
- HTTP testing with `provideHttpClientTesting()`

**Files to Reference:**

- `vitest.config.ts`
- `playwright.config.ts`
- Example test files in any `.spec.ts` file
- `.github/workflows/ci.yml` (test execution)
- `.github/workflows/e2e.yml` (E2E test execution)

**Metrics to Include:**

- 2059 tests passing
- 62 test files
- Coverage targets and enforcement

---

### ADR-010: CI/CD Pipeline Architecture

**Status**: Not Started
**Estimated Effort**: 3-4 hours
**Dependencies**: None

**Scope:**

- GitHub Actions workflow structure
- Parallel job execution strategy
- Security scanning (CodeQL)
- Lighthouse CI integration for performance
- Dependency review automation
- Deployment strategy to GitHub Pages
- Branch protection rules
- PR checks and gates

**Key Implementation Details:**

- CI workflow: Lint → Test → Build (parallel where possible)
- CodeQL security scanning with build output exclusions
- Lighthouse CI with performance budgets
- E2E test execution on PRs
- Automated deployment on `main` branch
- Dependency vulnerability scanning

**Files to Reference:**

- `.github/workflows/ci.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/lighthouse.yml`
- `.github/workflows/deploy.yml`
- `.github/workflows/dependency-review.yml`
- `.github/workflows/e2e.yml`

---

## Medium Priority (Implementation Patterns)

These ADRs document important implementation patterns that support the core architecture.

### ADR-011: Lazy Loading & Code Splitting Strategy

**Status**: Not Started
**Estimated Effort**: 2 hours
**Dependencies**: None

**Scope:**

- Feature module lazy loading strategy
- Route-based code splitting approach
- Bundle size budgets in `angular.json`
- Dynamic imports for features
- Preloading strategies (if any)
- Initial bundle optimization

**Key Implementation Details:**

- Standalone component lazy loading
- `loadComponent` and `loadChildren` patterns
- Bundle analysis with `source-map-explorer`
- Bundle budget configuration

**Files to Reference:**

- `src/app/app.routes.ts`
- `angular.json` (budgets section)
- Package.json scripts for bundle analysis

---

### ADR-012: Form Management Pattern

**Status**: Not Started
**Estimated Effort**: 2-3 hours
**Dependencies**: None

**Scope:**

- Reactive Forms over Template-driven forms
- `ControlValueAccessor` implementation for custom form controls
- Validation strategy (built-in validators + custom)
- Form state management patterns
- Error message handling
- Async validation approach

**Key Implementation Details:**

- Custom form components implementing CVA
- Validation utilities
- Form field composition
- Signal-based form value tracking
- Accessibility in forms (ARIA attributes, labels)

**Files to Reference:**

- `src/app/shared/components/input/input.component.ts`
- `src/app/shared/components/checkbox/checkbox.component.ts`
- `src/app/shared/components/select/select.component.ts`
- `src/app/shared/components/form-field/form-field.component.ts`
- `src/app/features/auth/login/login.component.ts` (form usage)

---

### ADR-013: Logging & Monitoring Strategy

**Status**: Not Started
**Estimated Effort**: 1-2 hours
**Dependencies**: None

**Scope:**

- `LoggerService` abstraction layer
- Console logging in development
- Future Sentry/observability integration preparation
- Structured logging format
- Log levels (debug, info, warn, error)
- Context enrichment for logs

**Key Implementation Details:**

- Environment-aware logging
- Log message formatting
- Performance considerations
- Privacy considerations (no PII in logs)

**Files to Reference:**

- `src/app/core/services/logger/logger.service.ts`
- `src/app/core/services/logger/logger.service.spec.ts`
- Usage examples throughout the codebase

---

### ADR-014: Strict Layering with ESLint Boundaries

**Status**: Not Started
**Estimated Effort**: 2-3 hours
**Dependencies**: None

**Scope:**

- Feature-to-Feature import prohibition
- Core/Shared/Features layer definitions
- Dependency graph enforcement via `eslint-plugin-boundaries`
- Import path conventions
- Barrel exports strategy
- Enforcement in CI/CD

**Key Implementation Details:**

- ESLint boundaries configuration
- Layer dependency rules:
  - Features can import from Core and Shared
  - Core can import from Shared
  - Shared has no dependencies on Core or Features
  - Features CANNOT import from other Features
- Violation detection and prevention

**Files to Reference:**

- `.eslintrc.json` (boundaries configuration)
- `tsconfig.json` (path mappings)
- `.github/workflows/ci.yml` (lint enforcement)

**Rationale to Cover:**

- Prevents circular dependencies
- Enforces unidirectional data flow
- Makes codebase more maintainable
- Facilitates future microservices extraction

---

## Lower Priority (Tooling & Developer Experience)

These ADRs document tooling decisions that improve developer experience and code quality.

### ADR-015: Documentation Tooling Strategy

**Status**: Not Started
**Estimated Effort**: 2 hours
**Dependencies**: None

**Scope:**

- Compodoc for core architecture documentation
- Storybook for component library documentation
- Markdown for ADRs and architectural docs
- README.md standards per feature module
- Code comments vs external documentation
- API documentation generation

**Key Implementation Details:**

- Compodoc configuration in `tsconfig.doc.json`
- Storybook setup for shared components
- ADR template and storage location
- Feature README.md structure

**Files to Reference:**

- `tsconfig.doc.json`
- `.storybook/` configuration
- Example `.stories.ts` files
- `src/app/features/*/README.md` examples
- `docs/adr/` directory

---

### ADR-016: Git Workflow & Commit Standards

**Status**: Not Started
**Estimated Effort**: 1-2 hours
**Dependencies**: None

**Scope:**

- Conventional Commits enforcement
- Husky pre-commit hooks
- Commitlint configuration
- Commit message format and scopes
- Branch naming conventions
- PR template and guidelines

**Key Implementation Details:**

- `@commitlint/config-conventional` usage
- Husky hooks for pre-commit and commit-msg
- Lint-staged for pre-commit validation
- Prettier for code formatting

**Files to Reference:**

- `.husky/` directory
- `commitlint.config.js` or `commitlint.config.ts`
- `.lintstagedrc` or `lint-staged` in package.json
- `.github/pull_request_template.md` (if exists)

**Commit Message Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore

---

### ADR-017: Package Management & Dependencies

**Status**: Not Started
**Estimated Effort**: 1-2 hours
**Dependencies**: None

**Scope:**

- npm over yarn/pnpm decision
- Dependency update strategy
- Security scanning (dependency-review workflow)
- Lock file management (`package-lock.json`)
- Peer dependency handling
- Dev vs production dependency categorization

**Key Implementation Details:**

- npm version requirements
- Update frequency and testing
- Dependency vulnerability monitoring
- Major version update policy

**Files to Reference:**

- `package.json`
- `package-lock.json`
- `.github/workflows/dependency-review.yml`
- `.npmrc` (if exists)

---

## Implementation Guidelines

### ADR Template Location

- Store completed ADRs in: `src/assets/docs/`
- Name pattern: `adr-XXX-title-in-kebab-case.md`
- Update `src/assets/data/architecture.json` when adding new ADRs

### ADR Template Structure

Each ADR should follow this structure:

```markdown
# ADR-XXX: Title

## Status

[Accepted | Proposed | Deprecated | Superseded]

## Date

YYYY-MM-DD

## Context

What problem are we trying to solve?
What constraints do we have?

### Options Considered

1. **Option 1** - Description
2. **Option 2** - Description
3. **Option 3** - Description

## Decision

What did we choose and why?

### Rationale

1. **Reason 1**: Explanation
2. **Reason 2**: Explanation

## Implementation

Code examples, diagrams, or configuration snippets

## Consequences

### Positive

- Benefit 1
- Benefit 2

### Negative

- Trade-off 1
- Trade-off 2

### Neutral

- Consideration 1
- Consideration 2

## References

- Links to documentation
- Related ADRs
- External resources
```

---

## Prioritization Rationale

**High Priority First**: These document the foundational architectural decisions that differentiate this project and demonstrate enterprise-level thinking.

**Medium Priority Second**: These capture important implementation patterns that support the core architecture and show attention to detail.

**Low Priority Last**: While important for completeness, these are more operational/tooling focused and less architecturally significant.

---

## Progress Tracking

| ADR     | Title                 | Status      | Assignee | Est. Hours | Completion Date |
| ------- | --------------------- | ----------- | -------- | ---------- | --------------- |
| ADR-006 | Analytics Strategy    | Not Started | -        | 2-3h       | -               |
| ADR-007 | SEO Management        | Not Started | -        | 2-3h       | -               |
| ADR-008 | I18n with Transloco   | Not Started | -        | 2-3h       | -               |
| ADR-009 | Testing Strategy      | Not Started | -        | 3-4h       | -               |
| ADR-010 | CI/CD Pipeline        | Not Started | -        | 3-4h       | -               |
| ADR-011 | Lazy Loading          | Not Started | -        | 2h         | -               |
| ADR-012 | Form Management       | Not Started | -        | 2-3h       | -               |
| ADR-013 | Logging & Monitoring  | Not Started | -        | 1-2h       | -               |
| ADR-014 | Strict Layering       | Not Started | -        | 2-3h       | -               |
| ADR-015 | Documentation Tooling | Not Started | -        | 2h         | -               |
| ADR-016 | Git Workflow          | Not Started | -        | 1-2h       | -               |
| ADR-017 | Package Management    | Not Started | -        | 1-2h       | -               |

**Total Estimated Effort**: 24-32 hours

---

## Notes

- Each ADR should be written as if explaining the decision to a new team member
- Include concrete code examples from the actual implementation
- Reference specific files and line numbers where helpful
- Update `architecture.json` after completing each ADR
- Consider creating corresponding blog posts for high-priority ADRs
