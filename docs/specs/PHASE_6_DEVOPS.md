# ⚙️ Phase 6: DevOps, Optimization & Release Specifications

**Objective:** Transform the code repository into a shipping product. This phase focuses on automation, performance enforcement, and the "Day 2" operations of maintaining an open-source architecture.
**Principle:** "If it isn't automated, it doesn't exist." Quality gates must be enforceable, and deployment must be boring.

---

## 6.1 Performance Governance

We don't just "hope" the app is fast; we fail the build if it gets slow.

### **1. Bundle Budgets (`angular.json`)**

Configure strict limits to prevent bloat.

- **Initial Bundle:** Error at 1MB (High for a Hello World, low for Enterprise. Good target).
- **Component Styles:** Error at 6kb (Forces usage of shared utility classes).
- **Any Component Script:** Warning at 100kb (Indicates need for further lazy loading).

### **2. Lighthouse CI**

- **Tool:** `@lhci/cli`.
- **Config:** `.lighthouserc.json`.
- **Thresholds:**
  - Performance: > 90
  - Accessibility: 100 (Non-negotiable for Enterprise).
  - Best Practices: 100.
  - SEO: 100.
- **Workflow:** Run against the local build in CI before deploying.

---

## 6.2 Deployment Strategy

We host everything on GitHub Pages, but structured as a "Monorepo of Documentation".

### **1. Artifact Aggregation**

The build process (defined in `deploy.yml`) must combine three outputs into one folder structure:

- `/` -> Angular App (Build output).
- `/docs` -> Compodoc (Documentation output).
- `/storybook` -> Storybook (UI Library output).

### **2. Environment Injection**

- **Build Command:** `ng build --configuration production`.
- **Mockend Flag:** Ensure the `production` environment still uses `mockAuth: true` for the public demo (unless you actually hook up a real backend later).

---

## 6.3 Release Management

Automate versioning to avoid "v1.0.0-final-final-v2".

### **1. Semantic Versioning**

- **Tool:** `standard-version` or `release-please` (Google's bot).
- **Convention:** Follow Conventional Commits (`feat:`, `fix:`, `chore:`).
  - `feat` -> Minor version bump (v1.1.0).
  - `fix` -> Patch version bump (v1.0.1).
  - `BREAKING CHANGE` -> Major version bump (v2.0.0).

### **2. Automated Changelog**

- **File:** `CHANGELOG.md`.
- **Workflow:** When a PR merges to `main` with specific labels (or manually triggered), generate the changelog and create a GitHub Release tag.

---

## 6.4 Documentation Architecture

The documentation in the root is the "Sales Brochure" for the repository.

### **1. README.md (The Landing Page)**

- **Header:** Hero image + Badges (CI Status, Coverage, License, Angular Version).
- **Quick Start:** One-liner to run locally (`npm ci && npm start`).
- **Features List:** Bullet points of the "cool stuff" (Signals, Standalone, Mockend).
- **Architecture Link:** Point to `ARCHITECTURE.md`.

### **2. ARCHITECTURE.md (The Blueprint)**

- **Diagrams:** Use **Mermaid.js** code blocks to visualize:
  - System Context (User -> App -> Services).
  - Auth Flow (Login -> Guard -> Store).
  - Folder Structure rationale.
- **Decision Log:** Link to the `features/architecture` inside the running app.

### **3. CONTRIBUTING.md**

- **Standards:** Reference the ESLint rules and Commitlint.
- **Workflow:** Explain how to create a Feature Branch and PR.

---

## 6.5 Execution Checklist

1.  [ ] **Budgets:** Edit `angular.json` configuration > budgets.
2.  [ ] **Lighthouse:** Create `.lighthouserc.json` and add `npm run lhci` script.
3.  [ ] **Analysis:** Install `source-map-explorer` and add `npm run analyze` script.
4.  [ ] **Release:** Configure `standard-version` in `package.json`.
5.  [ ] **Docs:**
    - Reword `README.md` to be professional/impressive.
    - Create `ARCHITECTURE.md` with at least one Mermaid diagram.
    - Create `CONTRIBUTING.md`.
6.  [ ] **Final Polish:**
    - Run full build.
    - Run full test suite.
    - Run full lint.
    - **Action:** Tag v1.0.0 and push.
