# Contributing to Angular Enterprise Blueprint

Thank you for your interest in contributing! This guide will help you get started.

---

## 📋 Prerequisites

- **Node.js**: 20.x or higher
- **npm**: 10.x or higher
- **Git**: Latest version

---

## 🚀 Getting Started

1. **Fork the repository** on GitHub

2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/angular-enterprise-blueprint.git
   cd angular-enterprise-blueprint
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Start the development server**:

   ```bash
   npm start
   ```

5. **Run tests to verify setup**:
   ```bash
   npm run test
   npm run lint
   ```

---

## 📁 Project Structure

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

```
src/app/
├── core/       # Singletons (auth, config, services)
├── features/   # Routed pages (lazy-loaded)
├── shared/     # Reusable components
└── app.ts      # Root component
```

---

## 🔀 Branch Naming

Use descriptive branch names with prefixes:

| Prefix      | Purpose                  | Example                     |
| ----------- | ------------------------ | --------------------------- |
| `feat/`     | New features             | `feat/user-preferences`     |
| `fix/`      | Bug fixes                | `fix/login-validation`      |
| `docs/`     | Documentation changes    | `docs/api-readme`           |
| `refactor/` | Code refactoring         | `refactor/auth-service`     |
| `test/`     | Test additions/fixes     | `test/profile-coverage`     |
| `chore/`    | Maintenance tasks        | `chore/update-dependencies` |
| `perf/`     | Performance improvements | `perf/lazy-load-images`     |

---

## 💬 Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commit messages are validated by Commitlint.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type       | Description                                             |
| ---------- | ------------------------------------------------------- |
| `feat`     | A new feature                                           |
| `fix`      | A bug fix                                               |
| `docs`     | Documentation only changes                              |
| `style`    | Formatting, missing semicolons, etc.                    |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf`     | Performance improvement                                 |
| `test`     | Adding missing tests                                    |
| `chore`    | Maintenance tasks                                       |
| `ci`       | CI/CD changes                                           |
| `build`    | Build system changes                                    |

### Examples

```bash
feat(auth): add remember me checkbox
fix(form): resolve email validation regex
docs(readme): update installation instructions
refactor(theme): simplify CSS custom property structure
```

---

## ✅ Quality Gates

All pull requests must pass these checks:

1. **Lint**: `npm run lint`
   - ESLint with strict TypeScript rules
   - Angular template accessibility checks

2. **Unit Tests**: `npm run test`
   - Vitest with 85% coverage minimum
   - All tests must pass

3. **E2E Tests**: `npm run e2e`
   - Playwright tests across Chromium, Firefox, WebKit

4. **Build**: `npm run build`
   - Production build must succeed
   - Bundle budgets must pass

5. **Security**: CodeQL scanning (automatic in CI)

---

## 🔧 Development Workflow

1. **Create a feature branch**:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**:
   - Write code following [Coding Standards](docs/CODING_STANDARDS.md)
   - Add tests for new functionality
   - Update documentation if needed

3. **Run quality checks locally**:

   ```bash
   npm run lint
   npm run test
   npm run build
   ```

4. **Commit your changes**:

   ```bash
   git add .
   git commit -m "feat(scope): your message"
   ```

5. **Push and create a PR**:
   ```bash
   git push origin feat/your-feature-name
   ```
   Then open a Pull Request on GitHub.

---

## 📖 Coding Standards

- **No `any` types** – Use proper TypeScript types
- **OnPush change detection** – All components use OnPush
- **Signals for reactivity** – Prefer signals over BehaviorSubject
- **Strict null checks** – Handle null/undefined explicitly
- **BEM naming** – CSS classes follow BEM convention

See [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) for complete guidelines.

---

## 🧪 Testing Guidelines

- **Unit tests**: Co-located with source files (`.spec.ts`)
- **E2E tests**: Located in `/e2e` directory
- **Component stories**: Located in `/src/app/shared` with `.stories.ts` extension

Run tests:

```bash
npm run test              # Unit tests
npm run test:coverage     # With coverage report
npm run e2e               # E2E tests
npm run storybook         # Component documentation
```

---

## 📝 Documentation

- **Storybook**: Document shared components with stories
- **Compodoc**: API documentation is auto-generated
- **Code comments**: Use JSDoc for public APIs

Generate documentation:

```bash
npm run storybook         # Interactive component docs
npm run docs              # Generate Compodoc
```

---

## ❓ Questions?

- Open an [issue](https://github.com/MoodyJW/angular-enterprise-blueprint/issues) for bugs or feature requests
- Check existing [discussions](https://github.com/MoodyJW/angular-enterprise-blueprint/discussions) for Q&A

---

Thank you for contributing! 🎉
