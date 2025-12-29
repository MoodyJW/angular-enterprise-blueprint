# 🏛️ Architecture Overview

This document provides a high-level overview of the Angular Enterprise Blueprint architecture, including diagrams, design decisions, and rationale.

---

## System Context

The application is a static SPA deployed to GitHub Pages with no backend dependencies (all data is mocked).

```mermaid
graph TB
    subgraph "Browser"
        App["Angular Application"]
    end

    subgraph "GitHub Pages"
        Static["Static Assets"]
        Storybook["Storybook"]
        Compodoc["API Docs"]
    end

    subgraph "External Services"
        GA["Google Analytics"]
        Formspree["Formspree API"]
    end

    User((User)) --> App
    App --> Static
    App --> GA
    App --> Formspree
```

---

## Layered Architecture

The codebase follows a strict three-layer architecture with ESLint-enforced boundaries.

```mermaid
graph TB
    subgraph Features["Features Layer (Lazy-Loaded)"]
        Home["Home"]
        Auth["Auth"]
        Modules["Modules"]
        Architecture["Architecture"]
        Profile["Profile"]
        Contact["Contact"]
    end

    subgraph Core["Core Layer (Singletons)"]
        AuthService["Auth Store"]
        ThemeService["Theme Service"]
        AnalyticsService["Analytics Service"]
        SEOService["SEO Service"]
        LoggerService["Logger Service"]
        ErrorHandler["Error Handling"]
    end

    subgraph Shared["Shared Layer (Reusable)"]
        Components["UI Components"]
        Directives["Directives"]
        Pipes["Pipes"]
        Utils["Utilities"]
    end

    Features --> Core
    Features --> Shared
    Core --> Shared

    style Features fill:#2d5a27,color:#fff
    style Core fill:#1e3a5f,color:#fff
    style Shared fill:#5a1e5f,color:#fff
```

### Dependency Rules

| From     | To       | Allowed |
| -------- | -------- | ------- |
| Features | Core     | ✅      |
| Features | Shared   | ✅      |
| Features | Features | ❌      |
| Core     | Shared   | ✅      |
| Shared   | Core     | ❌      |
| Shared   | Features | ❌      |

These rules are enforced by `eslint-plugin-boundaries` in the ESLint configuration.

---

## State Management

The application uses NgRx SignalStore for reactive state management.

```mermaid
graph LR
    subgraph "Component"
        Template["Template"]
        Component["Component Class"]
    end

    subgraph "Store"
        State["State (Signals)"]
        Computed["Computed Signals"]
        Methods["Methods"]
    end

    subgraph "Service"
        API["HTTP Service"]
    end

    Template -->|reads| Computed
    Component -->|calls| Methods
    Methods -->|updates| State
    Methods -->|calls| API
    API -->|returns| Methods
    State -->|derives| Computed
```

### Stores in the Application

| Store             | Location                | Purpose                        |
| ----------------- | ----------------------- | ------------------------------ |
| AuthStore         | `core/auth`             | User authentication state      |
| DashboardStore    | `features/home`         | Dashboard metrics and visitors |
| ModulesStore      | `features/modules`      | Module catalog state           |
| ArchitectureStore | `features/architecture` | ADR documents state            |
| ContactStore      | `features/contact`      | Contact form submission state  |
| ProfileStore      | `features/profile`      | GitHub stats state             |

---

## Authentication Flow

The application uses a strategy pattern for authentication, allowing easy swap between mock and real implementations.

```mermaid
sequenceDiagram
    participant User
    participant LoginPage
    participant AuthStore
    participant MockAuthStrategy
    participant SecureStorage

    User->>LoginPage: Enter credentials
    LoginPage->>AuthStore: login(credentials)
    AuthStore->>MockAuthStrategy: login(credentials)
    MockAuthStrategy->>MockAuthStrategy: Validate (demo/admin)
    MockAuthStrategy->>SecureStorage: Store session
    MockAuthStrategy-->>AuthStore: User object
    AuthStore-->>LoginPage: Success
    LoginPage->>User: Redirect to Dashboard
```

### Route Protection

```mermaid
graph LR
    Route["Protected Route"] --> Guard["authGuard"]
    Guard -->|authenticated| Allow["Allow Access"]
    Guard -->|unauthenticated| Redirect["Redirect to /auth/login"]
```

---

## Folder Structure

```
src/app/
├── core/                    # Singletons (loaded once at app start)
│   ├── auth/               # Authentication (store, guards, strategies)
│   ├── config/             # Environment configuration
│   ├── error-handling/     # Global error handler, interceptors
│   ├── layout/             # Main layout, header, footer
│   └── services/           # Infrastructure services
│       ├── analytics/      # Analytics with provider pattern
│       ├── logger/         # Logging abstraction
│       ├── seo/            # SEO meta tags management
│       ├── storage/        # Secure storage service
│       └── theme/          # Theme management
│
├── features/               # Routed pages (lazy-loaded)
│   ├── home/              # Dashboard with metrics
│   ├── auth/              # Login page
│   ├── modules/           # Reference modules catalog
│   ├── architecture/      # ADR viewer
│   ├── profile/           # About the architect
│   └── contact/           # Contact form
│
├── shared/                 # Reusable components
│   ├── components/        # UI components (Button, Card, etc.)
│   ├── directives/        # Custom directives
│   ├── pipes/             # Custom pipes
│   └── utilities/         # Pure utility functions
│
├── app.config.ts          # Root providers
├── app.routes.ts          # Root routing
└── app.ts                 # Root component
```

---

## Theme System

The application supports 6 themes with CSS custom properties.

| Theme               | Category      | Description                 |
| ------------------- | ------------- | --------------------------- |
| Daylight            | Light         | Clean, professional default |
| Sunrise             | Light (Warm)  | Warm orange accents         |
| Midnight            | Dark          | Deep blue tones             |
| Twilight            | Dark (Cool)   | Cool purple accents         |
| High Contrast Light | Accessibility | Maximum contrast (light)    |
| High Contrast Dark  | Accessibility | Maximum contrast (dark)     |

Themes are managed by `ThemeService` and persisted to `localStorage`. The system also respects `prefers-color-scheme` and `prefers-reduced-motion` media queries.

---

## Architecture Decision Records

Major technical decisions are documented as ADRs and viewable in the running application at `/architecture`. Key decisions include:

- [ADR-001: Angular Framework Selection](https://moodyjw.github.io/angular-enterprise-blueprint/architecture/adr-001-angular-selection)
- [ADR-002: Standalone Components](https://moodyjw.github.io/angular-enterprise-blueprint/architecture/adr-002-standalone-components)
- [ADR-003: Signal-Based State](https://moodyjw.github.io/angular-enterprise-blueprint/architecture/adr-003-signal-state)
- [ADR-004: Mock Authentication](https://moodyjw.github.io/angular-enterprise-blueprint/architecture/adr-004-mock-auth)

See the full list in the application or in `src/assets/docs/`.

---

## Further Reading

- [Implementation Plan](docs/PLAN.md) – Detailed phase-by-phase roadmap
- [Coding Standards](docs/CODING_STANDARDS.md) – TypeScript and Angular conventions
- [Security Checklist](docs/SECURITY_CHECKLIST.md) – Security testing guidelines
- [Blog Series](blogs/) – In-depth articles on each phase
