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
  - [x] Install **Vitest** (Unit) + **ng-mocks** (Simpler component testing).
  - [x] Configure coverage thresholds (85%).
  - [x] Install **Playwright** (E2E) and configure base url.
- [ ] **1.4 CI/CD Pipeline (GitHub Actions)**:
  - [x] Create `.github/workflows/ci.yml`: Runs Lint, Test, and Build on every PR.
  - [x] Create `.github/workflows/codeql.yml`: Security scanning, exclude build output directories for github's codeQL default setup
  - [x] Create `.github/workflows/lighthouse.yml`: Runs Lighthouse CI on every PR.
  - [x] Create `.github/workflows/deploy.yml`: Deploy to GitHub Pages on `main` branch.
  - [x] Create `.github/workflows/dependency-review.yml`: Dependency review on every PR.
  - [x] Create `.github/workflows/e2e.yml`: Run Playwright E2E tests on every PR.
  - [ ] **Milestone:** _Push a dummy PR and verify it fails if you break a rule._
- [ ] **1.5 Documentation Engine**:
  - [ ] Install **Storybook** (for `src/app/shared`).
  - [ ] Install **Compodoc** (for `src/app/core`). Configure `tsconfig.doc.json`.
- [ ] **1.6 I18n Setup**: Install `@jsverse/transloco` and configure the HTTP loader.

### 🧠 Phase 2: Core Architecture (The Nervous System)

_Goal: Build the invisible singletons that power the application._

- [ ] **2.1 Environment Config**: Set up strict typed environments (`environment.ts`).
- [ ] **2.2 Infrastructure Services**:
  - [ ] `LoggerService`: Abstract `console.log` for future Sentry integration.
  - [ ] `AnalyticsService`: Wrapper for GA4 (or mock).
  - [ ] `SeoService`: Manage `Title` and `Meta` tags dynamically.
  - [ ] `ThemeService`: Manages Dark/Light mode state (Signal).
- [ ] **2.3 Global Error Handling**: Implement `ErrorHandler` and HTTP Interceptor.
- [ ] **2.4 Authentication Strategy (Mockend)**:
  - [ ] Define `AuthStrategy` interface (Login/Logout/Session).
  - [ ] Implement `MockAuthStrategy`:
    - [ ] Use `localStorage` for persistence.
    - [ ] Use `delay(800)` to simulate latency.
    - [ ] Use `throwError` randomly (10%) to simulate 500s.
  - [ ] Create `AuthStore` (NgRx SignalStore) to manage `User` state.
  - [ ] Create `authGuard` (Functional) and `AuthInterceptor`.

### 🎨 Phase 3: The Design System (Shared Library)

_Goal: Port the high-quality UI components. Ensure strict Storybook coverage._

- [ ] **3.1 Global Styling**: Define CSS Variables for 4 themes (Light/Dark/High-Contrast).
- [ ] **3.2 Atomic Components**: Port `Button`, `Icon`, `Badge`, `Spinner`, `Card`.
- [ ] **3.3 Molecules**: `AlertComponent`, `BreadcrumbComponent`.
- [ ] **3.4 Layout Components**: Port `Container`, `Grid`, `Stack`, `Divider`.
- [ ] **3.5 Form Components**: Port `Input`, `Select`, `Checkbox`, `Textarea` (Ensure `ControlValueAccessor` compliance).
- [ ] **3.6 Special Components**:
  - [ ] **ThemePickerComponent**: Build this early to test the theming engine.
- [ ] **3.7 Feedback Components**: Port `Toast` (and Service), `Modal`, `Skeleton`.
- [ ] **3.8 Stories**: Ensure every component has a `.stories.ts` file.

### 🐚 Phase 4: The Application Shell

_Goal: Build the frame that holds the pages._

- [ ] **4.1 Layout Architecture**: Create `MainLayoutComponent` (Header + Footer + RouterOutlet).
- [ ] **4.2 Navigation**:
  - [ ] Build `HeaderComponent` (Responsive).
  - [ ] Integrate `ThemePicker` into the Header.
  - [ ] Connect `AuthStore` to Header (Show "Login" vs "User Profile").
- [ ] **4.3 Routing**: Define lazy-loaded routes in `app.routes.ts`.

### 📦 Phase 5: Feature Implementation (The Content)

_Goal: Features that map 1:1 to the UI naming._

- [ ] **5.1 Auth Feature** (`features/auth`):
  - [ ] `LoginComponent`: Reactive Form connecting to `AuthStore`.
  - [ ] Add `README.md` in `src/app/features/auth/` explaining the flow.
- [ ] **5.2 Dashboard** (`features/home`):
  - [ ] `HomeComponent`: "System Status" widgets (Build Status, Test Coverage).
  - [ ] Connect to `AnalyticsService` for "Live Visitor" simulation.
- [ ] **5.3 Module Catalog** (`features/modules`):
  - [ ] **UI Label:** "Reference Modules" (formerly Projects).
  - [ ] Create `ModulesStore` (SignalStore).
  - [ ] `ModuleListComponent`: Grid with Search/Filter (Debounced).
  - [ ] `ModuleDetailComponent`: Deep dive view with Tabs.
  - [ ] Data Source: `src/assets/data/modules.json`.
- [ ] **5.4 Architecture Docs** (`features/architecture`):
  - [ ] **UI Label:** "Architecture Decisions" (formerly Case Studies).
  - [ ] Create `ArchitectureStore`.
  - [ ] `AdrViewerComponent`: Render Markdown content from `assets`.
- [ ] **5.5 The Architect** (`features/profile`):
  - [ ] **UI Label:** "The Architect" (formerly About).
  - [ ] `ProfileComponent`: Static bio & resume download.
- [ ] **5.6 Contact** (`features/contact`):
  - [ ] **UI Label:** "Hire Me".
  - [ ] `ContactComponent`: Lead generation form with rate-limiting simulation.

### ⚙️ Phase 6: Ops & Optimization

_Goal: Ensure it builds and ships like enterprise software._

- [ ] **6.1 Deployment**: Configure `.github/workflows/deploy.yml` for GitHub Pages.
- [ ] **6.2 Performance Tuning**:
  - [ ] Install `source-map-explorer`.
  - [ ] Configure Bundle Budgets in `angular.json` (Error on > 1MB).
  - [ ] Set up Lighthouse CI Action.
- [ ] **6.3 Release Management**:
  - [ ] Install `standard-version` or `semantic-release`.
  - [ ] Create automated `CHANGELOG.md` generation pipeline.
- [ ] **6.4 Final Documentation**:
  - [ ] `README.md`: The "Sales Pitch" for the repo.
  - [ ] `CONTRIBUTING.md`: How to run the repo.
  - [ ] `ARCHITECTURE.md`: High-level diagram.

---

## 📝 Documentation Standards

_Every Feature Module (`src/app/features/_`) must contain a `README.md` with:\*

1.  **Purpose**: What does this feature do?
2.  **State**: What SignalStore does it use?
3.  **Routes**: What URLs does it handle?
4.  **Key Components**: List of smart components.
