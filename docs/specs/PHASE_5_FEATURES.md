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

### **1. Data Layer**

- **GitHub Stats Service:** `ProfileService` to fetch real GitHub API data using authenticated GraphQL API.
  - **Authentication:** Use GitHub Personal Access Token (PAT) with required scopes:
    - `read:user` - For user profile data
    - `repo` - For commit data across all repos
    - `read:org` - For pull requests, issues, and code reviews
  - **Token Storage:** Store PAT in environment variables (never committed to repo).
    - Development: `environment.development.ts` with placeholder/instructions
    - Production: GitHub Actions secrets or Netlify/Vercel environment variables
    - Use Angular's `InjectionToken` pattern for safe token access in services
    - Add `.env` to `.gitignore` if using dotenv pattern
  - **GraphQL Endpoint:** `https://api.github.com/graphql`
  - **Required Queries:**
    - Total commits across all owned repositories
    - Pull requests created (total count)
    - Issues created (total count)
    - Issues closed (total count)
    - Code reviews performed (review comments on others' PRs)
    - Comments made (PR comments + issue comments combined)
    - Account creation date (for years of experience calculation)
    - Avatar URL
  - **Interface:** `GitHubStats`:
    ```typescript
    {
      yearsOfExperience: number; // Computed from account creation
      totalCommits: number; // Commits across all repos
      pullRequestsCreated: number; // PRs opened by user
      issuesCreated: number; // Issues opened by user
      issuesClosed: number; // Issues closed by user
      codeReviews: number; // Reviews on others' PRs
      comments: number; // PR + issue comments
      avatarUrl: string; // Profile picture
    }
    ```
  - **Caching Strategy:** Cache stats for 1 hour in ProfileStore to avoid API rate limits (5000/hour authenticated).
  - **Error Handling:** Handle rate limiting (429), authentication failures (401), and network errors gracefully.
- **Store:** `ProfileStore` using `@ngrx/signals` to cache GitHub data and handle loading/error states.
  - State: `{ stats: GitHubStats | null, isLoading: boolean, error: string | null, lastFetched: number | null }`.
  - Methods: `loadGitHubStats()`, `refreshStats()`.
  - Computed: `shouldRefresh()` - checks if cache is stale (> 1 hour old).

### **2. ProfileComponent**

- **Layout:** Two-column responsive layout using `<eb-grid>` (Avatar/Stats on left, Bio on right).
- **Left Column:**
  - **Avatar:** Display GitHub avatar from API response using `<img>` with fallback.
  - **Stats Card:** Use `<eb-card>` with the following metrics from GitHub GraphQL API:
    - **Years of Experience:** Computed from GitHub account `createdAt` date
    - **Total Commits:** Aggregated commit count across all repositories
    - **Pull Requests Created:** Total PRs opened by user
    - **Issues Created:** Total issues opened by user
    - **Issues Closed:** Total issues closed by user
    - **Code Reviews:** Review comments on others' pull requests
    - **Comments:** Combined PR comments and issue comments
  - **Loading State:** Show `<eb-skeleton>` components for each stat while fetching GitHub data.
  - **Error State:** Show error message if API fails with "Retry" button that calls `store.refreshStats()`.
- **Right Column:**
  - **Bio Section:** Personal description/introduction text (static content).
  - **Tech Stack:** Display technology badges using `<eb-badge>`:
    - Angular
    - TypeScript
    - RxJS
    - NgRx
    - Node.js
  - **Additional Skills (Optional):** Could add secondary stack (Vitest, Playwright, Storybook, etc.)
- **Actions:** Two buttons using `<eb-button>` placed prominently:
  - **"Download Resume":** Downloads PDF file directly (use `<a download>` attribute or FileSaver.js).
    - File: `assets/resume/john-doe-resume.pdf`
  - **"View Resume":** Opens resume PDF in a modal using `<eb-modal>` component.
    - Modal title: "Resume Preview"
    - Modal contains embedded PDF viewer using `<iframe>` or `<object>` tag pointing to PDF asset
    - Modal should be fully accessible with:
      - Proper ARIA labels (`aria-label="Resume preview modal"`)
      - Keyboard navigation support (Escape to close, Tab trap)
      - Focus management (focus modal on open, return focus on close)
    - Include close button (X icon) in modal header
    - Modal backdrop click should close modal

---

## 5.6 Contact Feature (`features/contact`)

Status: Completed

**Goal:** Lead generation form with real email submission.

### **1. Email Service - Formspree**

- **Service:** Formspree (third-party email forwarding service)
  - **Why:** Zero backend code required, perfect for static sites deployed to GitHub Pages
  - **How it works:** Angular app POSTs form data to Formspree endpoint → Formspree sends email to `jwmoody@protonmail.com`
- **Setup Steps:**
  1. Create free account at [formspree.io](https://formspree.io)
  2. Create new form and get your unique form ID
  3. Add endpoint to `environment.ts` and `environment.development.ts`:
     ```typescript
     export const environment = {
       formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
     };
     ```
  4. Configure Formspree settings:
     - Set email recipient to `jwmoody@protonmail.com`
     - Enable spam filtering (reCAPTCHA optional)
     - Customize confirmation message (optional)
- **Free Tier Limits:**
  - 50 submissions per month
  - Formspree branding in confirmation emails
  - Basic spam filtering included
- **Endpoint:** `https://formspree.io/f/{YOUR_FORM_ID}`
- **Authentication:** None required (form ID acts as identifier, safe to expose in frontend)

### **2. Data Layer**

- **Contact Service:** `ContactService` to handle form submission to Formspree.
  - **Location:** `src/app/features/contact/services/contact.service.ts`
  - **Method:** `sendContactMessage(formData: ContactFormData): Observable<void>`
  - **Implementation:**
    ```typescript
    sendContactMessage(formData: ContactFormData): Observable<void> {
      return this.http.post<void>(
        this.environment.formspreeEndpoint,
        formData,
        {
          headers: { 'Accept': 'application/json' }
        }
      );
    }
    ```
  - **Interface:** `ContactFormData`:
    ```typescript
    interface ContactFormData {
      name: string; // Required, min 2 chars
      email: string; // Required, valid email format
      company?: string; // Optional
      message: string; // Required, min 10 chars
    }
    ```
  - **Rate Limiting:** Implement client-side throttling (max 1 submission per 30 seconds) to prevent spam.
    - Store last submission timestamp in `localStorage` or component state
    - Disable submit button during cooldown period
    - Show countdown timer: "Please wait 30 seconds before submitting again"
  - **Error Handling:** Handle HTTP errors from Formspree:
    - **429 (Rate Limit):** "Too many requests. Please try again in a moment."
    - **400 (Validation Error):** "Please check your inputs and try again."
    - **500 (Server Error):** "Failed to send message. Please try again later."
    - **Network Error:** "Network error. Please check your connection."

### **3. ContactComponent**

- **Layout:** Centered form using `<eb-card>` with proper spacing.
- **Form:** Reactive `FormGroup` using `NonNullableFormBuilder`:
  - **Name:** Required, min 2 characters, max 100 characters
  - **Email:** Required, valid email format (Angular's `Validators.email`)
  - **Company:** Optional, max 100 characters
  - **Message:** Required, min 10 characters, max 1000 characters, `<textarea>` with 5 rows
- **Validation:**
  - Show validation errors below each field using `<eb-form-field>` error slot
  - Error messages:
    - Name: "Name is required" / "Name must be at least 2 characters"
    - Email: "Email is required" / "Please enter a valid email address"
    - Message: "Message is required" / "Message must be at least 10 characters"
  - Disable submit button when form is invalid or submitting
- **Components Used:**
  - `<eb-card>` for form container
  - `<eb-form-field>` for each input wrapper
  - `<eb-input>` for name, email, company fields
  - `<eb-textarea>` for message field (or `<eb-input type="textarea">` if available)
  - `<eb-button>` for submit with loading state
- **Submission Logic (Real Email):**
  1. Validate form (should already be disabled if invalid)
  2. Set `loading = true`, disable form
  3. Call `contactService.sendContactMessage(formData)`
  4. **On Success:**
     - Show success toast: "Message sent successfully! I'll get back to you soon."
     - Reset form to pristine state
     - Track analytics event: `analytics.trackEvent('Contact Form Submitted')`
  5. **On Error:**
     - Show error toast with appropriate message:
       - Rate limit (429): "Too many requests. Please try again in a moment."
       - Validation error (400): "Please check your inputs and try again."
       - Server error (500): "Failed to send message. Please try again later."
       - Network error: "Network error. Please check your connection."
     - Keep form data intact (don't reset)
     - Re-enable submit button
  6. Set `loading = false`
- **Rate Limiting:** Implement 30-second cooldown after successful submission (disable button with countdown timer).
- **Accessibility:**
  - Proper labels for all fields with `for` attribute
  - Error messages announced to screen readers with `role="alert"`
  - Focus management (focus first error field on validation failure)
  - Clear "required" indicators on labels
- **Email Recipient:** Form submissions sent to `jwmoody@protonmail.com`

---

## 5.7 Missing Shared Component - Tooltip

**Note:** During Phase 5 implementation, it was identified that a Tooltip component was needed but not included in the original shared components. This component should be implemented before finalizing Phase 5.

### **Requirements:**

- **Directive-based:** Apply via `ebTooltip` directive to any element
- **Trigger:** Show on hover and keyboard focus
- **Positioning:** Support top, right, bottom, left, and auto positioning
- **Accessibility:** Full WCAG 2.1 AA compliance with proper ARIA attributes
- **Theme integration:** Use existing CSS custom properties
- **Signal-based:** Use signals for reactive state management
- **OnPush:** Use OnPush change detection strategy

### **Implementation Tasks:**

1. [ ] Create `tooltip` component directory in `shared/components/`
2. [ ] Implement `TooltipDirective` with signal inputs
3. [ ] Implement `TooltipComponent` with dynamic positioning
4. [ ] Create BEM-based SCSS using CSS custom properties
5. [ ] Write comprehensive unit tests (component + directive)
6. [ ] Create Storybook stories with all variants and positions
7. [ ] Verify WCAG 2.1 AA compliance with axe-core
8. [ ] Add barrel export to `shared/components/index.ts`
9. [ ] Document usage examples

### **Reference:**

See detailed implementation plan in `/TOOLTIP_IMPLEMENTATION_PLAN.md`

---

## 5.8 Execution Checklist

1.  [x] **Mock Data:** Create JSON files in `src/assets/data/` for Modules and Architecture.
2.  [x] **Auth:** Build Login Page & connect to Store.
3.  [x] **Dashboard:** Build Home Page with mock analytics.
4.  [x] **Modules:**
    - [x] Build `ModulesStore`.
    - [x] Build List & Detail views.
5.  [x] **Architecture:**
    - [x] Build `ArchitectureStore`.
    - [x] Build Markdown fetcher logic.
6.  [x] **Profile:** Build static "About" page.
7.  [x] **Contact:** Build Form with validation and real email submission.
8.  [ ] **Tooltip Component:** Implement missing shared tooltip component (see section 5.7).
