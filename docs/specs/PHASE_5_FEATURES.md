# 📦 Phase 5: Feature Implementation Specifications

**Objective:** Build the "Smart Components" (pages) that consume the Core architecture and render the Shared UI.
**Principle:** Features are lazy-loaded domain slices. They contain the _business logic_ and _state management_. They do not contain generic UI styles (that belongs in Shared).

---

## 5.1 Auth Feature (`features/auth`)

**Goal:** Provide the entry point for the "Mock Auth" system.

### **1. State Integration**

- **Store:** Injects `AuthStore` (from Core).
- **Selectors:** Read `store.isLoading`, `store.error`.
- **Actions:** Call `store.login(credentials)`.

### **2. LoginComponent** (`features/auth/login`)

- **Form:** `NonNullableFormBuilder`.
  - `username`: required.
  - `password`: required.
- **Template:**
  - Use `<eb-card>` to center the form.
  - Use `<eb-input>` for fields.
  - Use `<eb-button>` with `[loading]="store.isLoading()"`.
- **Behavior:**
  - On Submit: Call store.
  - On Error: Show `<eb-alert>` or Toast.
  - **Demo Hint:** Add a helper text "Try 'demo' / 'password'" so visitors know how to use it.

---

## 5.2 Dashboard Feature (`features/home`)

**Goal:** A "System Status" dashboard that mimics an enterprise admin panel.

### **1. HomeComponent** (`features/home`)

- **Layout:** `<eb-grid>` with 2 columns.
- **Widgets:**
  - **System Status:** Static "All Systems Operational" badge.
  - **Theme Inspector:** Shows active theme from `ThemeService`.
  - **Visitor Simulation:** Connects to `AnalyticsService` to show a fake "Real-time user count" (use an interval signal to randomize the number).
- **Action:** A large "View Modules" Call-to-Action button leading to `/modules`.

---

## 5.3 Module Catalog (`features/modules`) ✅

**Goal:** Display the "Products" (Portfolio Projects). Renamed to "Modules" to sound more enterprise.

### **1. Data Layer**

- **Source:** `src/assets/data/modules.json`.
- **Interface:** `Module` (id, title, description, category, status, tags, repoUrl, demoUrl, features, techStack).
- **Store:** `ModulesStore` (`@ngrx/signals`).
  - State: `{ entities: Module[], filter: string, isLoading: boolean, error: string | null }`.
  - Computed: `filteredModules()` based on search string.
  - Computed: `getModuleById()` for detail view lookup.

### **2. ModulesComponent** (`features/modules`)

- **Search:** `<eb-input>` with debounced search using RxJS Subject (300ms debounce).
- **List:**
  - Use `<eb-grid>` with responsive columns.
  - Iterate over `store.filteredModules()`.
  - Render clickable `<eb-card>` for each module.
  - **Card Footer:** "View Details" button with chevron icon.
- **States:** Loading, error, and empty states handled.

### **3. ModuleDetailComponent** (`features/modules/detail`)

- **Route:** `/modules/:id` with `withComponentInputBinding()`.
- **Logic:** Read `id` input. Find module via `store.getModuleById()`.
- **UI:**
  - Header: Title + Status/Category Badges.
  - Single card with: Key Features (checkmarks), Technology Stack (badges), Tags.
  - Actions: "Launch Demo" (Rocket icon), "View Source" (Code icon).
- **States:** Loading and "Not Found" states.

---

## 5.4 Architecture Docs (`features/architecture`)

**Goal:** A documentation viewer for ADRs (Architecture Decision Records). _Formerly "Case Studies"._

### **1. Data Layer**

- **Source:** `src/assets/data/architecture.json`.
- **Content:** The JSON contains metadata. The actual content are `.md` files in `assets/docs/`.

### **2. AdrListComponent** (`features/architecture/list`)

- **Layout:** A sidebar layout or vertical stack of `<eb-card>`.
- **Content:** List items like "ADR-001: Signal Store", "ADR-002: Mockend Pattern".

### **3. AdrViewerComponent** (`features/architecture/viewer`)

- **Logic:**
  1.  Get ID from route.
  2.  `HttpClient.get('assets/docs/' + id + '.md', { responseType: 'text' })`.
- **Rendering:**
  - **MVP:** Display text inside `<pre class="prose">`.
  - **Pro:** Use `ngx-markdown` (optional dependency) if you want real formatting. _For Phase 5 MVP, standard whitespace formatting is sufficient._

---

## 5.5 The Architect (`features/profile`)

**Goal:** The "About Me" page, treated as a User Profile.

### **1. ProfileComponent**

- **Layout:** Two-column layout (Avatar/Stats on left, Bio on right).
- **Components:**
  - **Stats Card:** "Years Exp", "Commits" (fake number), "Coffee Consumed".
  - **Tech Stack:** Use `<eb-badge>` for Angular, TypeScript, RxJS, Node.
- **Action:** "Download Resume" button (Filesaver or direct link).

---

## 5.6 Contact Feature (`features/contact`)

**Goal:** Lead generation form.

### **1. ContactComponent**

- **Form:** `FormGroup` (Name, Email, Company, Message).
- **Validation:** Required fields, Email regex.
- **Submission Logic (The Mock):**
  1.  Set `loading = true`.
  2.  `delay(1500)`.
  3.  `Math.random() > 0.1` ? Success : Error.
  4.  **Success:** Show Toast "Message sent!", Reset form.
  5.  **Error:** Show Toast "SMTP Error: Retrying...", set `loading = false`.

---

## 5.7 Execution Checklist

1.  [x] **Mock Data:** Create JSON files in `src/assets/data/` for Modules and Architecture.
2.  [x] **Auth:** Build Login Page & connect to Store.
3.  [x] **Dashboard:** Build Home Page with mock analytics.
4.  [x] **Modules:**
    - [x] Build `ModulesStore`.
    - [x] Build List & Detail views.
5.  [ ] **Architecture:**
    - [ ] Build `ArchitectureStore`.
    - [ ] Build Markdown fetcher logic.
6.  [ ] **Profile:** Build static "About" page.
7.  [ ] **Contact:** Build Form with validation and simulated submission.
