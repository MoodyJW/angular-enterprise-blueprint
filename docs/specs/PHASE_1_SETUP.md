# 🏁 Phase 1: The "Enterprise Rig" Specifications

**Objective:** Establish the development environment, tooling governance, and automation pipelines. This phase is the "Constitution" of the repository—if it isn't defined here, it doesn't get merged.
**Principle:** "Shift Left." Catch errors, style violations, and bad commits on the developer's machine before they ever reach the CI server.

---

## 1.1 Workspace Configuration

We use the latest Angular CLI with maximum strictness enabled.

### **1. Angular JSON (`angular.json`)**

- **Strict Mode:** Enabled (`"strict": true`).
- **Build Optimization:**
  - `optimization`: true
  - `sourceMap`: false (in prod)
  - `namedChunks`: false (in prod)
- **Style Preprocessor:** SCSS (`"inlineStyleLanguage": "scss"`).
- **Prefix:** `eb` (Enterprise Blueprint) to prevent collisions with standard `app` selectors.

### **2. Package Management**

- **Client:** `npm` (Lockfile version 3).
- **Engines:** Enforce Node v20+ and NPM v10+ in `package.json` to prevent legacy environments from running the build.

---

## 1.2 Governance & Linting

We enforce style and quality automatically.

### **1. ESLint Strategy (`eslint.config.js`)**

- **Format:** Flat Config (new standard).
- **Plugins:**
  - `@angular-eslint`: Specific Angular best practices.
  - `eslint-plugin-boundaries`: **CRITICAL**. Enforces the "Core -> Shared -> Features" architecture.
    - _Rule:_ Features cannot import other Features.
    - _Rule:_ Shared cannot import Core or Features.
  - `rxjs`: Enforce strict Observable patterns (e.g., `no-implicit-any-catch`).

### **2. Prettier**

- **Integration:** `prettier-plugin-organize-imports` to automatically sort imports on save.
- **Config:** Single quotes, trailing commas, 2 space indent.

### **3. Git Hooks (Husky)**

- **pre-commit:** Runs `npx lint-staged`.
  - If `*.ts`: Run `eslint --fix` and `prettier --write`.
  - If `*.scss`: Run `prettier --write`.
- **commit-msg:** Runs `npx commitlint --edit`.

### **4. Commitlint**

- **Convention:** Conventional Commits (`@commitlint/config-conventional`).
- **Allowed Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Why:** Enables automated changelog generation in Phase 6.

---

## 1.3 Testing Harness

We strip out Karma/Jasmine in favor of a modern, faster stack.

### **1. Unit Testing: Vitest (`vitest.config.ts`)**

- **Environment:** `jsdom`.
- **Reporters:** `verbose` and `junit` (for CI).
- **Coverage:** `v8`.
  - **Thresholds:** 85% Statements, 85% Branches, 85% Functions.

### **2. E2E Testing: Playwright (`playwright.config.ts`)**

- **Browsers:** Chromium, Firefox, WebKit.
- **Parallelism:** Fully parallel execution.
- **Sharding:** Enabled for CI (allows splitting tests across multiple machines).
- **Base URL:** `http://localhost:4200`.

---

## 1.4 CI/CD Infrastructure

We use GitHub Actions to enforce the "Quality Gates."

### **1. CI Pipeline (`.github/workflows/ci.yml`)**

- **Trigger:** Push to `main`, Pull Request to `main`.
- **Jobs:**
  1.  **Lint:** ESLint + Prettier check.
  2.  **Test:** Vitest (Headless).
  3.  **Build:** Production build (`ng build`).
  4.  **E2E:** Playwright (Shard 1/X).

### **2. Security Scanning (`.github/workflows/codeql.yml`)**

- **Tool:** GitHub CodeQL.
- **Schedule:** Weekly + On PR.
- **Action:** Scans for common vulnerabilities (XSS, Injection) in TypeScript code.

### **3. Dependency Guard (`.github/workflows/dependency-review.yml`)**

- **Action:** Scans `package-lock.json` changes on PRs.
- **Blocker:** Fails if a new dependency has a "High" or "Critical" CVE, or uses a non-compliant license (GPL).

---

## 1.5 Documentation Engine

We treat documentation as code.

### **1. Storybook (`.storybook/`)**

- **Target:** `src/app/shared`.
- **Goal:** Visual catalog for the Design System.
- **Config:**
  - Use `application` builder (Angular 18+ support).
  - Auto-generate docs (`autodocs: true`).

### **2. Compodoc**

- **Target:** `src/app/core` and `src/app/features`.
- **Goal:** API documentation for Services, Stores, and Architecture.
- **Config (`tsconfig.doc.json`):**
  - Exclude `*.spec.ts` and `*.stories.ts` to keep the graph clean.
  - Generate "Dependency Graph" for `ARCHITECTURE.md`.

## 1.6 I18n Setup

We use Transloco for internationalization, providing a clean signal-based API.

### **1. Transloco (`@jsverse/transloco`)**

- **Loader:** HTTP loader fetching from `assets/i18n/`.
- **Default Language:** `en`.
- **Available Languages:** `en`, `es`, `fr` (expandable).
- **Features:**
  - Lazy-loaded translations per route.
  - Signal-based API (`transloco.translate()`).
  - ICU message format support.

### **2. Translation Files (`assets/i18n/`)**

- **Structure:** One JSON file per language (e.g., `en.json`, `es.json`).
- **Naming Convention:** Dot-notation keys matching component structure (e.g., `home.welcome`, `auth.login.title`).

---

## 1.7 Blog Article

We document our process for knowledge sharing and portfolio demonstration.

### **1. Article Scope**

- **Target:** Medium / Dev.to publication.
- **Topic:** Setting up the Angular Enterprise Blueprint.
- **Sections:**
  - Project initialization and strict mode configuration.
  - ESLint flat config with boundaries plugin.
  - Vitest and Playwright integration.
  - CI/CD pipeline architecture.
  - Documentation engine setup (Storybook + Compodoc).

---

## 1.8 Execution Checklist

1.  [ ] **Workspace:** Init Angular v21 with SCSS/Strict/Routing.
2.  [ ] **Linting:** Setup ESLint Flat Config + Boundaries Plugin.
3.  [ ] **Formatting:** Setup Prettier + Organize Imports.
4.  [ ] **Hooks:** Init Husky + Commitlint + Lint-Staged.
5.  [ ] **Unit Test:** Remove Karma, Install Vitest + Config.
6.  [ ] **E2E Test:** Install Playwright.
7.  [ ] **Docs:** Init Storybook + Compodoc.
8.  [ ] **CI:** Create `.github/workflows/` (CI, CodeQL, Dependency Review).
9.  [ ] **Verify:** Run `npm run test` and `npm run build` locally to ensure the rig holds together.
