# 🏗️ Angular Enterprise Blueprint: Master Implementation Plan

**Objective:** Build a production-grade Angular v21+ reference architecture that serves as both a personal portfolio and a "clone-and-go" starter kit for enterprise teams.
**Core Principles:**

1.  **Strict Type Safety:** No `any`.
2.  **Signal-First:** `OnPush` everywhere, `SignalStore` for state.
3.  **Naming Consistency:** Code names must match UI labels (e.g., UI "Modules" = `features/modules`).
4.  **Zero-Config Clone:** Runs immediately via Mockend (no backend required).

---

## 📂 Target Directory Structure

_System Boundaries are defined by this structure. Create this first._

```text
angular-enterprise-blueprint/
├── .github/
│   ├── workflows/              # CI (Lint/Test), CodeQL, Deploy
│   └── CODEOWNERS
├── .husky/                     # Git Hooks (CommitLint, Prettier)
├── docs/
│   ├── adr/                    # Architecture Decision Records
│   └── images/
├── src/
│   ├── app/
│   │   ├── core/               # SINGLETONS (Loaded once, App-wide)
│   │   │   ├── auth/           # AuthStore, Guards, MockAuthStrategy
│   │   │   ├── config/         # AppConfig, Environment Tokens
│   │   │   ├── layout/         # MainLayout, Header, Footer
│   │   │   ├── models/         # Global Domain Models (User, Module, Adr)
│   │   │   ├── services/       # Infra Services (Analytics, SEO, Logger, Theme)
│   │   │   └── i18n/           # Transloco loaders
│   │   │
│   │   ├── features/           # SMART MODULES (Routed Pages)
│   │   │   ├── home/           # Dashboard (System Status)
│   │   │   ├── auth/           # Login / Register
│   │   │   ├── modules/        # "Reference Modules" Catalog (was Projects)
│   │   │   ├── architecture/   # "Architecture Decisions" Viewer (was Case Studies)
│   │   │   ├── profile/        # "The Architect" (Bio)
│   │   │   └── contact/        # "Hire Me" (Lead Gen)
│   │   │
│   │   ├── shared/             # REUSABLES (Dumb Components & Utils)
│   │   │   ├── components/     # Design System (Button, Card, ThemePicker)
│   │   │   ├── directives/     # UI behaviors (Ripple, Focus)
│   │   │   ├── pipes/          # Data formatting
│   │   │   ├── styles/         # Global SCSS mixins/variables
│   │   │   └── utils/          # Pure functions (Date, Validation)
│   │   │
│   │   ├── app.config.ts       # Global Providers
│   │   ├── app.routes.ts       # Root Routing
│   │   └── app.component.ts    # Root Shell
│   │
│   ├── assets/
│   │   ├── data/               # Mock DB (modules.json, architecture.json)
│   │   ├── i18n/               # en.json
│   │   └── icons/
│   └── styles.scss             # Global Reset & Theme Variables
├── angular.json
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── tsconfig.doc.json           # Compodoc specific config
└── vitest.config.ts
```

## 🚀 Execution Roadmap

### 🏁 Phase 1: The "Enterprise Rig" (Tooling & Governance)

_Goal: Establish the rules of engagement. CI/CD must be green before feature code is written._

- [x] **1.1 Workspace Init**: Run `ng new` (v19/21) with strict mode, standalone, and routing.
- [x] **1.2 Governance Tooling**:
  - [x] Install `eslint`, `prettier`, `lint-staged`, `prettier-plugin-organize-imports`.
  - [x] Install **Husky**: Set up `pre-commit` (lint-staged) and `commit-msg` hooks.
  - [x] Install **Commitlint**: Enforce Conventional Commits (`@commitlint/config-conventional`).
  - [x] Configure `eslint-plugin-boundaries` to ban Feature-to-Feature imports (Strict Layering).
- [x] **1.3 Testing Harness**:
  - [x] Remove Karma/Jasmine.
  - [x] Install **Vitest** (Unit) and configure coverage thresholds (85%).
  - [x] Install **Playwright** (E2E) and configure base url.
- [x] **1.4 CI/CD Pipeline (GitHub Actions)**:
  - [x] Create `.github/workflows/ci.yml`: Runs Lint, Test, and Build on every PR.
  - [x] Create `.github/workflows/codeql.yml`: Security scanning, exclude build output directories for github's codeQL default setup
  - [x] Create `.github/workflows/lighthouse.yml`: Runs Lighthouse CI on every PR.
  - [x] Create `.github/workflows/deploy.yml`: Deploy to GitHub Pages on `main` branch.
  - [x] Create `.github/workflows/dependency-review.yml`: Dependency review on every PR.
  - [x] Create `.github/workflows/e2e.yml`: Run Playwright E2E tests on every PR.
  - [x] **Milestone:** _Push a dummy PR and verify it fails if you break a rule._
- [x] **1.5 Documentation Engine**:
  - [x] Install **Storybook** (for `src/app/shared`).
  - [x] Install **Compodoc** (for `src/app/core`). Configure `tsconfig.doc.json`.
- [x] **1.6 I18n Setup**: Install `@jsverse/transloco` and configure the HTTP loader.
- [x] **1.7 Blog Article**: Write a detailed article on setting up the Angular Enterprise Blueprint.

### 🧠 Phase 2: Core Architecture (The Nervous System)

_Goal: Build the invisible singletons that power the application._

- [x] **2.1 Environment Config**: Set up strict typed environments (`environment.ts`).
  - [x] Created `AppEnvironment` interface with strict typing.
  - [x] Created `ENVIRONMENT` injection token with `provideEnvironment()`.
  - [x] Configured `angular.json` file replacements for prod builds.
- [x] **2.2 Infrastructure Services**:
  - [x] `LoggerService`: Abstract `console.log` for future Sentry integration.
  - [x] `AnalyticsService`: Strategy Pattern implementation with swappable providers.
    - [x] `AnalyticsProvider` interface (contract for all providers).
    - [x] `ConsoleAnalyticsProvider` (development/debugging).
    - [x] `GoogleAnalyticsProvider` (GA4 production integration).
    - [x] `provideAnalytics()` factory with environment-based provider selection.
    - [x] `withAnalyticsRouterTracking()` for automatic page view tracking.
    - [x] Full test coverage (77 tests).
  - [x] `SeoService`: Comprehensive SEO management.
    - [x] Title management with site name suffix.
    - [x] Meta tags (description, keywords, robots, author).
    - [x] Canonical URLs for duplicate content prevention.
    - [x] Open Graph tags for social sharing.
    - [x] Twitter Cards for Twitter sharing.
    - [x] JSON-LD structured data for rich snippets.
    - [x] Full test coverage (49 tests).
  - [x] `ThemeService`: Multi-theme system with CSS custom properties.
    - [x] 6 named themes (Daylight, Sunrise, Midnight, Twilight, High Contrast Light/Dark).
    - [x] Signal-based state management with computed properties.
    - [x] System preference detection via `matchMedia`.
    - [x] localStorage persistence with clear/reset support.
    - [x] SCSS architecture with complete CSS custom properties per theme.
    - [x] Smooth transitions with reduced-motion support.
    - [x] Full test coverage (41 tests).
- [x] **2.3 Global Error Handling**: Implement `ErrorHandler` and HTTP Interceptor.
  - [x] `ErrorNotificationService`: Abstraction layer for user notifications (uses LoggerService, ready for ToastService in Phase 3).
  - [x] `GlobalErrorHandler`: Angular ErrorHandler implementation with zone-aware error handling.
    - [x] Error normalization (handles Error, string, and error-like objects).
    - [x] Structured logging via LoggerService.
    - [x] User-friendly error messages.
  - [x] `httpErrorInterceptor`: HTTP error interceptor with comprehensive status code handling.
    - [x] Network errors (status 0).
    - [x] Client errors (400, 401, 403, 404, 408, 429).
    - [x] Server errors (5xx).
    - [x] Server message extraction from multiple response formats.
    - [x] Navigation to login/forbidden pages on auth errors.
  - [x] Registered in `app.config.ts`.
  - [x] Full test coverage (77 tests across 3 spec files):
    - [x] GlobalErrorHandler: 27 tests (error normalization, Error.cause, edge cases, zone handling).
    - [x] httpErrorInterceptor: 44 tests (all status codes, message extraction, HTTP methods, success passthrough).
    - [x] ErrorNotificationService: 6 tests.
- [x] **2.4 Authentication Strategy (Mockend)**:
  - [x] Define `AuthStrategy` interface (Login/Logout/Session).
  - [x] Implement `MockAuthStrategy`:
    - [x] Use `localStorage` for persistence.
    - [x] Use `delay(800)` to simulate latency.
    - [x] Use `throwError` randomly (10%) to simulate 500s.
  - [x] Create `AuthStore` (NgRx SignalStore) to manage `User` state.
  - [x] Create `authGuard` (Functional) and `AuthInterceptor`.
- [x] **2.5 Blog Article**: Write about designing core architecture in Angular.

### 🎨 Phase 3: The Design System (Shared Library)

_Goal: Port the high-quality UI components. Ensure strict Storybook coverage._

- [x] **3.1 Global Styling**: Define CSS Variables for 6 themes (2 Light/2 Dark/ 2 High-Contrast).
- [x] **3.2 Atomic Components**: Port `Button`, `Icon`, `Badge`, `LoadingSpinner`, `Card`.
- [x] **3.3 Molecules**: `BreadcrumbComponent`, `Tabs`.
- [x] **3.4 Layout Components**: Port `Container`, `Grid`, `Stack`, `Divider`.
- [x] **3.5 Form Components**: Port `Input`, `Select`, `Checkbox`, `Radio`, `Textarea`, `FormField` (Ensure `ControlValueAccessor` compliance).
- [x] **3.6 Feedback Components**: Port `Toast` (and Service), `Modal`, `Skeleton`.
- [x] **3.7 Stories**: Ensure every component has a `.stories.ts` file.
- [x] **3.8 Special Components**:
  - [x] **ThemePickerComponent**: Build to test the theming engine and provide user theme selection.
- [x] **3.9 Blog Article**: Write about building a design system in Angular.

### 🐚 Phase 4: The Application Shell

_Goal: Build the frame that holds the pages._

- [x] **4.1 Layout Architecture**: Create `MainLayoutComponent` (Header + Footer + RouterOutlet).
- [x] **4.2 Navigation**:
  - [x] Build `HeaderComponent` (Responsive).
  - [x] Integrate `ThemePicker` into the Header.
  - [x] Connect `AuthStore` to Header (Show "Login" vs "User Profile").
- [x] **4.3 Routing**: Define lazy-loaded routes in `app.routes.ts`.
- [x] **4.4 Blog Article**: Write about building the application shell in Angular.

### 📦 Phase 5: Feature Implementation (The Content)

_Goal: Features that map 1:1 to the UI naming._

- [x] **5.1 Auth Feature** (`features/auth`):
  - [x] `LoginComponent`: Reactive Form connecting to `AuthStore`.
  - [x] Add `README.md` in `src/app/features/auth/` explaining the flow.
- [x] **5.2 Dashboard** (`features/home`):
  - [x] `HomeComponent`: "System Status" widgets (Build Status, Test Coverage).
  - [x] Connect to `AnalyticsService` for "Live Visitor" simulation.
- [x] **5.3 Module Catalog** (`features/modules`):
  - [x] **UI Label:** "Reference Modules" (formerly Projects).
  - [x] Create `ModulesStore` (SignalStore).
  - [x] `ModuleListComponent`: Grid with Search/Filter (Debounced).
  - [x] `ModuleDetailComponent`: Detail view with Features/Tech Stack.
  - [x] Data Source: `src/assets/data/modules.json`.
- [x] **5.4 Architecture Docs** (`features/architecture`):
  - [x] **UI Label:** "Architecture Decisions" (formerly Case Studies).
  - [x] Create `ArchitectureStore`.
  - [x] `AdrViewerComponent`: Render Markdown content from `assets`.
- [x] **5.5 The Architect** (`features/profile`):
  - [x] **UI Label:** "The Architect" (formerly About).
  - [x] `ProfileComponent`: Static bio & resume download.
- [x] **5.6 Contact** (`features/contact`):
  - [x] **UI Label:** "Hire Me".
  - [x] `ContactComponent`: Lead generation form with rate-limiting simulation.
- [x] **5.7 Tooltip Component** (`shared/components/tooltip`):
  - [x] **Status:** Missing shared component identified during Phase 5 implementation.
  - [x] `TooltipDirective`: Directive-based tooltip with signal inputs for hover/focus triggers.
  - [x] `TooltipComponent`: Dynamic overlay component with auto-positioning.
  - [x] Support top, right, bottom, left, and auto positioning.
  - [x] Full WCAG 2.1 AA accessibility compliance.
  - [x] Comprehensive unit tests and Storybook stories.
- [x] **5.8 Blog Article**: Write about implementing feature modules in Angular.

### ⚙️ Phase 6: Ops & Optimization

_Goal: Ensure it builds and ships like enterprise software._

- [x] **6.1 Deployment**: Configure `.github/workflows/deploy.yml` for GitHub Pages.
- [ ] **6.2 Security Improvements**: See `SECURITY_IMPROVEMENT_PLAN.md`.
  - [x] **High Priority (8-12h)**:
    - [x] Eliminate innerHTML usage with translation data
    - [x] Migrate from localStorage to encrypted sessionStorage for auth tokens
    - [x] Add URL validation for bypassSecurityTrustResourceUrl
  - [x] **Medium Priority (13-18h)**:
    - [x] Implement Content Security Policy headers
    - [x] Replace all console.\* calls with LoggerService
    - [x] Add CSRF protection strategy
    - [x] Validate Google Analytics measurement IDs
  - [x] **Low Priority (3-5h)**:
    - [x] Enhance client-side rate limiting with honeypot
    - [x] Document production security headers configuration
  - [x] **Testing & Validation (2-3h + ongoing)**:
    - [x] Create security testing checklist (See `docs/SECURITY_CHECKLIST.md`)
    - [x] Add automated security scanning to CI/CD (Leveraging existing GitHub CodeQL)
- [x] **6.3 Performance Tuning**:
  - [x] Install `source-map-explorer`.
  - [x] Configure Bundle Budgets in `angular.json` (Error on > 1MB).
  - [x] Set up Lighthouse CI Action.
- [ ] **6.4 Release Management**:
  - [ ] Install `standard-version` or `semantic-release`.
  - [ ] Create automated `CHANGELOG.md` generation pipeline.
- [ ] **6.5 Final Documentation**:
  - [ ] `README.md`: The "Sales Pitch" for the repo.
  - [ ] `CONTRIBUTING.md`: How to run the repo.
  - [ ] `ARCHITECTURE.md`: High-level diagram.
- [ ] **6.6 Blog Article**: Write about deploying and optimizing Angular applications.

### 🧹 Phase 7: Polish & Cleanup

_Goal: Clean up technical debt, refine implementation quality, and ensure production-ready presentation._

- [ ] **7.1 Form Components Improvements**: Implement all improvements from code review.
  - [ ] See `/FORM_COMPONENTS_IMPROVEMENTS.md` for detailed checklist.
  - [ ] High-priority accessibility fixes.
  - [ ] Medium-priority code quality improvements.
  - [ ] Low-priority cleanup items.
- [ ] **7.2 Path Alias Migration**: Migrate all relative imports to path aliases.
  - [ ] See `/PATH_ALIAS_MIGRATION_PLAN.md` for detailed migration strategy.
  - [ ] Add new path aliases to `tsconfig.json`.
  - [ ] Migrate ~180-200 files from relative imports to aliases.
  - [ ] Ensure all barrel exports are used consistently.
- [ ] **7.3 Shared Components Style Audit**:
  - [ ] Review all shared components for consistent BEM naming.
  - [ ] Ensure all components use CSS custom properties from theme system.
  - [ ] Verify WCAG 2.1 AA color contrast compliance across all themes.
  - [ ] Standardize spacing, sizing, and typography scales.
  - [ ] Add missing `:hover`, `:focus`, `:active`, `:disabled` states.
  - [ ] Ensure `prefers-reduced-motion` support in all animations.
- [ ] **7.4 Theme System Compliance**:
  - [ ] Audit all 6 themes for WCAG AA color contrast (min 4.5:1 for normal text, 3:1 for large text).
  - [ ] Test all themes with automated accessibility tools (axe, Lighthouse).
  - [ ] Document color palette rationale in `/docs/THEME_SYSTEM.md`.
  - [ ] Create theme preview page showing all components in all themes.
- [ ] **7.5 Component Documentation Cleanup**:
  - [ ] Ensure all Storybook stories are up-to-date and comprehensive.
  - [ ] Add accessibility documentation to all component stories.
  - [ ] Verify all JSDoc comments are accurate and complete.
  - [ ] Add usage examples to complex components.
- [ ] **7.6 UX/UI Polish & Improvements**: See `/docs/specs/PHASE_7_POLISH.md` section 7.6 for detailed specifications.
  - [ ] Header Authentication UI: User profile icon with dropdown menu.
  - [ ] Header Theme Picker UI: Icon-only button with theme selection menu.
  - [ ] Home Page Portfolio Branding: Add personal branding (name, title, tagline).
  - [ ] Modules & ADR List Filtering: Filter chips for technologies, categories, status.
  - [ ] Profile Page Resume Button Layout: Reposition buttons below profile card.
  - [ ] Toast Component Visual Improvements: X icon for dismiss, reduced badge size.
- [ ] **7.7 Promise to RxJS Migration**: See `PROMISE_TO_RXJS_MIGRATION_PLAN.md`.
  - [ ] Migrate analytics subsystem from Promises to Observables (8 instances, 4 files).
  - [ ] Update AnalyticsProvider interface to return Observable.
  - [ ] Update all provider implementations (Console, Google Analytics).
  - [ ] Update AnalyticsService to use Observable patterns.
  - [ ] Update all test files and verify 100% pass rate.
- [ ] **7.8 Profile Stats Caching**: See `PROFILE_STATS_CACHING_PLAN.md`.
  - [ ] Create `provideProfileStore()` function for app-level provider.
  - [ ] Move ProfileStore from component-level to app-level (app.config.ts).
  - [ ] Remove component-level provider from ProfileComponent.
  - [ ] Update unit tests to mock app-level store.
  - [ ] Verify cache persists across navigation, clears on page refresh.
- [ ] **7.9 Code Quality Sweep**:
  - [ ] Run full linting and fix all warnings.
  - [ ] Review and clean up any remaining `TODO` or `FIXME` comments.
  - [ ] Ensure consistent code formatting across entire codebase.
  - [ ] Verify all public APIs have proper TypeScript documentation.
- [ ] **7.10 Blog Article**: Write about technical debt management and refactoring strategies.

---

## 📝 Coding Standards

See [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) for comprehensive enterprise-grade coding standards covering:

### Core Standards

| Category             | Key Requirements                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| **TypeScript**       | Strict mode, no `any`, readonly by default, prefer type unions over enums                               |
| **Angular**          | Standalone components, signals (`signal()`, `computed()`), `inject()` function, OnPush change detection |
| **Components**       | Smart vs Presentational separation, `input()`/`output()` functions, single responsibility               |
| **State Management** | NgRx SignalStore with `withState`, `withComputed`, `withMethods`, `rxMethod()`                          |
| **Styling**          | BEM methodology (`.block__element--modifier`), CSS custom properties, no inline styles                  |
| **i18n**             | All user-facing text via Transloco, no hardcoded strings, full language coverage                        |
| **Testing**          | 85%+ coverage, AAA pattern, integration tests for workflows, E2E for critical paths                     |
| **Accessibility**    | WCAG 2.1 AA compliance, semantic HTML, ARIA labels, keyboard navigation, color contrast                 |
| **Error Handling**   | Global ErrorHandler, HTTP interceptor, normalized `AppError` interface                                  |
| **Performance**      | OnPush, `trackBy`, lazy loading, tree-shakable providers, bundle budgets                                |
| **Security**         | XSS prevention, CSRF tokens, auth guards, input sanitization, Content Security Policy                   |
| **Architecture**     | Strict layer dependencies (features → shared → core), no circular imports                               |

### Mandatory Patterns

```typescript
// ✅ Signals for component inputs/outputs
readonly label = input.required<string>();
readonly clicked = output<void>();

// ✅ inject() function over constructor injection
private readonly http = inject(HttpClient);

// ✅ Native control flow in templates
@if (user) { <div>{{ user.name }}</div> }
@for (item of items; track item.id) { <div>{{ item }}</div> }

// ✅ BEM CSS structure
.user-card {
  &__header { }
  &__title { }
  &--featured { }
}
```

### Code Review Checklist

- [ ] No hardcoded English text (use Transloco)
- [ ] All components use `ChangeDetectionStrategy.OnPush`
- [ ] BEM naming in all stylesheets
- [ ] No `any` types, strict TypeScript
- [ ] `readonly` on all properties that don't change
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] WCAG AA compliance verified
- [ ] No prop drilling (use SignalStore for shared state)
- [ ] Conventional Commit messages

See the full document for detailed rules, anti-patterns, enforcement mechanisms, and resources.

## 📝 Documentation Standards

_Every Feature Module (`src/app/features/_`) must contain a `README.md` with:\*

1.  **Purpose**: What does this feature do?
2.  **State**: What SignalStore does it use?
3.  **Routes**: What URLs does it handle?
4.  **Key Components**: List of smart components.
