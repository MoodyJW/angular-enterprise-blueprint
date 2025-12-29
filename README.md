# 🏗️ Angular Enterprise Blueprint

[![CI](https://github.com/MoodyJW/angular-enterprise-blueprint/actions/workflows/ci.yml/badge.svg)](https://github.com/MoodyJW/angular-enterprise-blueprint/actions/workflows/ci.yml)
[![Deploy](https://github.com/MoodyJW/angular-enterprise-blueprint/actions/workflows/deploy.yml/badge.svg)](https://github.com/MoodyJW/angular-enterprise-blueprint/actions/workflows/deploy.yml)
[![Lighthouse](https://github.com/MoodyJW/angular-enterprise-blueprint/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/MoodyJW/angular-enterprise-blueprint/actions/workflows/lighthouse.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular)](https://angular.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> A production-grade Angular 21 reference architecture that serves as both a portfolio demonstration and a "clone-and-go" starter kit for enterprise teams.

## 🚀 [Live Demo](https://moodyjw.github.io/angular-enterprise-blueprint/) | 📚 [API Docs](https://moodyjw.github.io/angular-enterprise-blueprint/docs/) | 📖 [Storybook](https://moodyjw.github.io/angular-enterprise-blueprint/storybook/)

---

## ✨ Key Features

- **Signal-First Architecture** – OnPush change detection, NgRx SignalStore, reactive primitives
- **6 Accessible Themes** – Light, dark, and high-contrast variants with WCAG AA compliance
- **Mock Authentication** – Zero-backend demo with `MockAuthStrategy` (easily swappable)
- **Automated Quality Gates** – ESLint, 85%+ coverage, Lighthouse CI, CodeQL security scanning
- **Internationalization Ready** – Transloco with lazy-loaded translations
- **Comprehensive Documentation** – Storybook components, Compodoc API docs, blog series

---

## ⚡ Quick Start

```bash
# Clone and run in 30 seconds
git clone https://github.com/MoodyJW/angular-enterprise-blueprint.git
cd angular-enterprise-blueprint
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

**Requirements:** Node 20+, npm 10+

---

## 🏛️ Architecture

The project follows a strict layered architecture with ESLint-enforced boundaries:

```
src/app/
├── core/       # Singletons (auth, config, services) - loaded once
├── features/   # Routed pages (lazy-loaded, isolated)
├── shared/     # Reusable UI components, directives, pipes
└── app.ts      # Root component
```

**Boundary Rules:**

- ✅ Features → Core, Shared
- ✅ Core → Shared
- ❌ Features → Features (forbidden)
- ❌ Shared → Core, Features (forbidden)

See [ARCHITECTURE.md](ARCHITECTURE.md) for diagrams and detailed explanations.

---

## 🛠️ Development

| Command                 | Description                     |
| ----------------------- | ------------------------------- |
| `npm start`             | Start dev server (port 4200)    |
| `npm run build`         | Production build                |
| `npm run test`          | Run unit tests (Vitest)         |
| `npm run test:coverage` | Run tests with coverage report  |
| `npm run e2e`           | Run E2E tests (Playwright)      |
| `npm run lint`          | Lint TypeScript and HTML        |
| `npm run storybook`     | Launch Storybook (port 6006)    |
| `npm run docs`          | Generate Compodoc documentation |
| `npm run analyze`       | Analyze bundle size             |
| `npm run release`       | Create a new release (local)    |

See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow and coding standards.

---

## 📊 Tech Stack

| Category  | Tools                                                 |
| --------- | ----------------------------------------------------- |
| Framework | Angular 21, TypeScript 5.9, RxJS, Signals             |
| State     | NgRx SignalStore                                      |
| Testing   | Vitest (unit, 85% threshold), Playwright (E2E)        |
| Quality   | ESLint (flat config), Prettier, Commitlint            |
| Docs      | Storybook 10, Compodoc                                |
| CI/CD     | GitHub Actions, CodeQL, Lighthouse CI, release-please |
| I18n      | Transloco                                             |

---

## 📁 Implementation Status

| Phase | Focus                  | Status      |
| ----- | ---------------------- | ----------- |
| 1     | Tooling & Governance   | ✅ Complete |
| 2     | Core Architecture      | ✅ Complete |
| 3     | Design System          | ✅ Complete |
| 4     | Application Shell      | ✅ Complete |
| 5     | Feature Implementation | ✅ Complete |
| 6     | DevOps & Optimization  | ✅ Complete |

See [docs/PLAN.md](docs/PLAN.md) for the complete implementation roadmap.

---

## 📖 Documentation

- **[Blog Series](blogs/)** – Detailed articles covering each implementation phase
- **[Architecture Decisions](https://moodyjw.github.io/angular-enterprise-blueprint/architecture)** – ADRs documenting key technical decisions
- **[API Documentation](https://moodyjw.github.io/angular-enterprise-blueprint/docs/)** – Generated Compodoc
- **[Component Library](https://moodyjw.github.io/angular-enterprise-blueprint/storybook/)** – Interactive Storybook

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

All pull requests must pass:

- ESLint with strict TypeScript rules
- Unit tests with 85% coverage minimum
- E2E tests across Chromium, Firefox, WebKit
- CodeQL security scanning
- Lighthouse performance audit

---

## 📜 License

MIT © [Jason Moody](https://github.com/MoodyJW)

---

<p align="center">
  Built with ❤️ using <a href="https://angular.dev">Angular 21</a>
</p>
