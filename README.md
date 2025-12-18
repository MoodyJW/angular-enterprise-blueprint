# Angular Enterprise Blueprint

A production-grade Angular v21+ reference architecture that serves as both a portfolio demonstration and a "clone-and-go" starter kit for enterprise teams.

## Core Principles

- **Strict Type Safety** – Zero `any` types, explicit return types, strict null checks
- **Signal-First** – `OnPush` change detection everywhere, NgRx SignalStore for state
- **Architectural Boundaries** – ESLint-enforced layering (Core → Shared → Features)
- **Zero-Config Clone** – Runs immediately with mock data, no backend required

## Tech Stack

| Category  | Tools                                                  |
| --------- | ------------------------------------------------------ |
| Framework | Angular 21, TypeScript 5.9, RxJS, Signals              |
| State     | NgRx SignalStore                                       |
| Testing   | Vitest (unit), Playwright (E2E)                        |
| Quality   | ESLint (flat config), Prettier, 85% coverage threshold |
| Docs      | Storybook, Compodoc                                    |
| CI/CD     | GitHub Actions, CodeQL, Lighthouse CI                  |
| I18n      | Transloco                                              |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/MoodyJW/angular-enterprise-blueprint.git
cd angular-enterprise-blueprint

# Install dependencies (requires Node 20+, npm 10+)
npm install

# Start development server
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

## Available Scripts

| Command                 | Description                     |
| ----------------------- | ------------------------------- |
| `npm start`             | Start dev server                |
| `npm run build`         | Production build                |
| `npm run test`          | Run unit tests                  |
| `npm run test:coverage` | Run tests with coverage         |
| `npm run e2e`           | Run Playwright E2E tests        |
| `npm run lint`          | Lint TypeScript and HTML        |
| `npm run storybook`     | Launch Storybook                |
| `npm run docs`          | Generate Compodoc documentation |

## Project Structure

```
src/app/
├── core/           # Singletons (auth, config, services, i18n)
├── features/       # Routed pages (home, modules, architecture, profile, contact)
├── shared/         # Reusable components, directives, pipes, utils
├── app.config.ts   # Global providers
├── app.routes.ts   # Root routing
└── app.ts          # Root component
```

**Boundary Rules:**

- Features cannot import from other features
- Shared cannot import from Core or Features
- Core can only import from Shared

## Implementation Roadmap

The project follows a phased implementation plan. See [docs/PLAN.md](docs/PLAN.md) for the complete roadmap.

| Phase                                     | Focus                  | Status      |
| ----------------------------------------- | ---------------------- | ----------- |
| [Phase 1](docs/specs/PHASE_1_SETUP.md)    | Tooling & Governance   | ✅ Complete |
| [Phase 2](docs/specs/PHASE_2_CORE.md)     | Core Architecture      | 🔲 Pending  |
| [Phase 3](docs/specs/PHASE_3_DS.md)       | Design System          | 🔲 Pending  |
| [Phase 4](docs/specs/PHASE_4_SHELL.md)    | Application Shell      | 🔲 Pending  |
| [Phase 5](docs/specs/PHASE_5_FEATURES.md) | Feature Implementation | 🔲 Pending  |
| [Phase 6](docs/specs/PHASE_6_DEVOPS.md)   | Ops & Optimization     | 🔲 Pending  |

## Quality Gates

All pull requests must pass:

- ESLint with strict TypeScript rules
- Unit tests with 85% coverage minimum
- E2E tests across Chromium, Firefox, WebKit
- CodeQL security scanning
- Dependency vulnerability review
- Lighthouse performance audit

## Documentation

- [Implementation Plan](docs/PLAN.md) – Full roadmap and phase details
- [Phase Specifications](docs/specs/) – Detailed specs for each phase
- Storybook – Component documentation (`npm run storybook`)
- Compodoc – API documentation (`npm run docs`)

## License

MIT

---

Built with Angular 21 | [Blog Series](blogs/part-1.md)
