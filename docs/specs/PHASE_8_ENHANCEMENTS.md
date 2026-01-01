# ✨ Phase 8: Enhancements & New Features

**Status:** Not Started
**Goal:** Add new capabilities and features to enhance the portfolio presentation and user experience.

**Principles:**

- Build on the solid foundation established in Phases 1-7
- Maintain consistency with existing design system
- Ensure all new features meet WCAG 2.1 AA standards
- Focus on portfolio presentation and user engagement

## Component Reuse Strategy

**IMPORTANT:** Before creating new components, leverage the existing design system in `src/app/shared/components/`.

### Components to Reuse (NOT Create New)

The following existing components should be reused instead of creating new ones:

1. **CardComponent** → Use for BlogCardComponent and MetricCardComponent
   - Already has variants (default, elevated, outlined, filled)
   - Supports clickable, hoverable, full-width modes
   - Has proper ARIA attributes and keyboard navigation
   - Located at: [card.component.ts](../src/app/shared/components/card/card.component.ts)

2. **GridComponent** → Use for MetricGridComponent layout
   - Responsive grid system already implemented
   - Located at: [grid.component.ts](../src/app/shared/components/grid/grid.component.ts)

3. **BadgeComponent** → Use for status indicators (NOT filter chips)
   - Designed for passive status/count displays
   - Located at: [badge.component.ts](../src/app/shared/components/badge/badge.component.ts)

4. **ThemePickerComponent** → Modify for ThemeMenuComponent
   - Already has theme selection logic
   - Refactor to icon-only trigger variant
   - Located at: [theme-picker.component.ts](../src/app/shared/components/theme-picker/theme-picker.component.ts)

### New Components to Create

Only create these genuinely new components with unique functionality:

1. **FilterChipsComponent** (Section 8.5)
   - **Why new:** Interactive multi-select filter UI is distinct from passive BadgeComponent
   - **Justification:** Reused across ModulesListComponent and AdrListComponent
   - **Key difference:** Active filtering vs. passive status display
   - Multi-select toggle behavior, chip removal, "Clear all" functionality

2. **UserMenuComponent** (Section 8.2)
   - **Why new:** Dropdown menu with account header and logout specific behavior
   - **Justification:** Unique authentication-related UI pattern

3. **DashboardMetricsComponent** (Section 8.9)
   - **Why new:** Smart component for fetching and orchestrating metrics data
   - **Note:** Uses existing CardComponent for individual metric displays

4. **BlogListComponent** (Section 8.1)
   - **Why new:** Smart component with blog-specific state and filtering logic
   - **Note:** Uses existing CardComponent for article previews

5. **BlogDetailComponent** (Section 8.1)
   - **Why new:** Smart component with markdown rendering and article-specific features

### Component Audit Summary

Current shared components inventory (26 total):

- ✅ Badge, Button, Card, Checkbox, Grid, Input, Modal, Radio, Select, Textarea, Toast, ThemePicker, etc.
- All components follow BEM methodology, WCAG 2.1 AA standards, and theme system integration

**Principle:** Maximize reuse to maintain consistency, reduce maintenance burden, and accelerate development.

### Benefits of This Strategy

By reusing existing components instead of creating duplicates:

1. **Consistency:** All cards, grids, and badges look and behave the same across features
2. **Maintenance:** Bug fixes and improvements benefit all use cases, not just one
3. **Development Speed:** Less code to write, test, and document
4. **Bundle Size:** Smaller production bundles (no duplicate component code)
5. **Design System Integrity:** Reinforces the shared component library as single source of truth
6. **Accessibility:** Reuses battle-tested, WCAG-compliant implementations

**Result:** Phase 8 creates only 3 new shared components (FilterChips, UserMenu, DashboardMetrics) instead of the originally planned 6+, reducing development time while improving quality.

---

## 8.1 Blog Feature Module

**Reference:** New feature for displaying technical articles

### Overview

Create a complete blog feature to showcase technical writing and thought leadership. The blog will display articles written during the project phases and future content.

### Components

**BlogListComponent** (Smart Component)

- Grid/list view of all blog articles
- Search functionality (filter by title, excerpt, tags)
- Category filter chips (Angular, Architecture, Performance, etc.)
- Pagination or infinite scroll
- Sort by date, title, or reading time
- Card-based layout with featured image, title, excerpt, date, reading time, and tags

**BlogDetailComponent** (Smart Component)

- Full article view with markdown rendering
- Table of contents (auto-generated from headings)
- Estimated reading time
- Publication date and last updated date
- Author information
- Tag list with links to filtered views
- Previous/Next article navigation
- Social sharing buttons (optional)
- Syntax highlighting for code blocks

**Article Card Display**

- **Use existing CardComponent** with `clickable` and `hoverable` props
- Pass article data (title, excerpt, date, readingTime, tags, featuredImage) via content projection
- No need for separate BlogCardComponent - leverage design system
- CardComponent already handles hover states, accessibility, and responsive layout

### Data Model

```typescript
interface BlogArticle {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly content: string; // Markdown content
  readonly featuredImage?: string;
  readonly author: {
    readonly name: string;
    readonly title: string;
  };
  readonly publishedAt: Date;
  readonly updatedAt?: Date;
  readonly readingTimeMinutes: number;
  readonly tags: readonly string[];
  readonly category: BlogCategory;
  readonly status: 'draft' | 'published';
}

type BlogCategory =
  | 'angular'
  | 'architecture'
  | 'performance'
  | 'testing'
  | 'deployment'
  | 'security'
  | 'design-system';
```

### State Management

**BlogStore** (NgRx SignalStore)

- `withState`: articles[], selectedArticle, filters, loading, error
- `withComputed`: filteredArticles, categories, tags
- `withMethods`: loadArticles, loadArticle, setFilters, clearFilters
- Data source: `src/assets/data/blog-articles.json`

### Routes

```typescript
{
  path: 'blog',
  children: [
    { path: '', component: BlogListComponent },
    { path: ':slug', component: BlogDetailComponent }
  ]
}
```

### Initial Content

Migrate existing blog articles from phase completion:

1. Phase 1: Angular Enterprise Blueprint Setup
2. Phase 2: Core Architecture Design
3. Phase 3: Design System Implementation
4. Phase 4: Application Shell
5. Phase 5: Feature Module Development
6. Phase 6: Deployment & Optimization
7. Phase 7: Technical Debt Management (to be written)

### Technical Requirements

- **Markdown Rendering**: Use a markdown library (e.g., `marked` or `ngx-markdown`)
- **Syntax Highlighting**: Code blocks with syntax highlighting (e.g., `highlight.js`)
- **SEO**: Dynamic meta tags per article (title, description, OG tags)
- **Analytics**: Track article views and reading time
- **i18n**: Translatable UI elements (article content can remain in English initially)
- **Accessibility**: Proper heading hierarchy, skip links, keyboard navigation

### Acceptance Criteria

- [ ] BlogStore created with full CRUD operations
- [ ] BlogListComponent with search, filter, and sort
- [ ] BlogDetailComponent with markdown rendering and syntax highlighting
- [ ] All existing phase articles migrated to JSON format
- [ ] Routes configured and lazy-loaded
- [ ] SEO meta tags dynamic per article
- [ ] Storybook stories for BlogCardComponent
- [ ] Unit tests for store and components (85%+ coverage)
- [ ] E2E tests for navigation and filtering
- [ ] Mobile responsive design
- [ ] WCAG 2.1 AA compliant

---

## 8.2 Header Authentication UI

**Current:** Username text + logout button (takes up horizontal space)
**Target:** User profile icon → opens dropdown menu

### Components

**UserMenuComponent** (New Shared Component)

- **Why new:** Dropdown menu pattern with authentication-specific behavior
- Dropdown menu with account name header
- Logout option
- Future: Settings, Profile links
- Uses Angular CDK Overlay for positioning and accessibility
- Located at: `src/app/shared/components/user-menu/`

**Changes:**

- **Modify:** `HeaderComponent` (replace text/button with icon button)
- **Create:** `UserMenuComponent` as reusable shared component

### Acceptance Criteria

- [ ] Icon displays when authenticated
- [ ] Menu opens/closes on click, Escape, outside-click
- [ ] Keyboard accessible (Tab, Enter, Arrow keys)
- [ ] Mobile responsive
- [ ] ARIA attributes for accessibility
- [ ] Smooth animations (respects `prefers-reduced-motion`)

---

## 8.3 Header Theme Picker UI

**Current:** Full theme picker showing selected theme
**Target:** Icon-only button (paint palette/theme icon) → opens theme menu

### Components

**ThemePickerComponent Enhancement** (Modify Existing)

- **Why modify existing:** Theme selection logic already implemented
- Add icon-only variant mode (`compact: true` or similar)
- Keep existing full picker for other use cases
- Shows all 6 themes with visual previews (already has this)
- Current theme highlighted (already has this)
- Theme name and description (already has this)
- Located at: `src/app/shared/components/theme-picker/`

**Changes:**

- **Modify:** `ThemePickerComponent` (add compact/icon-only mode)
- **Modify:** `HeaderComponent` (use compact variant)

### Acceptance Criteria

- [ ] Icon button with tooltip ("Change theme")
- [ ] Menu shows all themes with visual previews
- [ ] Current theme has checkmark/highlight
- [ ] Keyboard accessible
- [ ] Click outside to close
- [ ] Mobile responsive
- [ ] Smooth theme transitions

---

## 8.4 Home Page Portfolio Branding

**Current:** Generic "System Status" dashboard (no personal branding)
**Target:** Add hero section with name, title, tagline

### Layout Options

- **A:** Hero above dashboard
- **B:** Split (bio left, dashboard right) ← Recommended
- **C:** Branded header bar above dashboard

### Content Structure

```typescript
interface PortfolioHero {
  readonly name: string;
  readonly title: string;
  readonly tagline: string;
  readonly bio: string;
  readonly cta: readonly {
    readonly label: string;
    readonly route: string;
  }[];
}
```

### Example Content

```typescript
{
  name: 'Jay [Last Name]',
  title: 'Senior Angular Architect',
  tagline: 'Building Enterprise-Grade Applications with Modern Angular',
  bio: 'Welcome to my Angular Enterprise Blueprint - a production-ready reference architecture demonstrating modern Angular best practices, enterprise patterns, and scalable design.',
  cta: [
    { label: 'View Projects', route: '/modules' },
    { label: 'Read Articles', route: '/blog' },
    { label: 'Contact Me', route: '/contact' }
  ]
}
```

### Acceptance Criteria

- [ ] Name prominently displayed
- [ ] Professional title/tagline clear
- [ ] CTA buttons to key sections
- [ ] Maintains dashboard functionality
- [ ] i18n support for all text
- [ ] Mobile responsive (hero stacks on mobile)
- [ ] Professional appearance in all 6 themes

---

## 8.5 Modules & ADR List Filtering

**Current:** Search only, no category/tag filtering
**Target:** Filter chips for technologies, categories, status

### Components

**FilterChipsComponent** (New Shared Component)

- **Why new:** Interactive multi-select filter UI distinct from passive BadgeComponent
- **Key difference from Badge:** Active filtering with toggle behavior vs. passive status display
- **Reuse justification:** Used in both ModulesListComponent and AdrListComponent
- Multi-select chip filter with toggle on click
- Individual chip removal with × button
- "Clear all" functionality when filters active
- Keyboard navigation (Tab, Enter/Space to toggle)
- Props: `chips: FilterChip[]`, `multiSelect: boolean`, `ariaLabel: string`
- Outputs: `chipToggled: FilterChip`, `cleared: void`
- Located at: `src/app/shared/components/filter-chips/`

**Data Model:**

```typescript
export interface FilterChip {
  readonly id: string;
  readonly label: string;
  readonly selected: boolean;
  readonly category?: string; // Optional grouping
}
```

### Changes

**Modify:** `ModulesListComponent`

- Add technology filter (Angular, React, TypeScript, Node.js, etc.)
- Add category filter (Frontend, Backend, Full-stack, etc.)
- Combine with existing search

**Modify:** `AdrListComponent`

- Add category filter (Architecture, Security, Performance, etc.)
- Add status filter (Accepted, Proposed, Deprecated, Superseded)
- Combine with existing search

### Filter Examples

```typescript
// Modules
{ id: 'angular', label: 'Angular', category: 'technology' }
{ id: 'typescript', label: 'TypeScript', category: 'technology' }
{ id: 'frontend', label: 'Frontend', category: 'category' }

// ADRs
{ id: 'architecture', label: 'Architecture', category: 'category' }
{ id: 'accepted', label: 'Accepted', category: 'status' }
```

### Acceptance Criteria

- [ ] FilterChipsComponent created and reusable
- [ ] Filters work in combination with search
- [ ] "Clear all" button when filters active
- [ ] Filter state persists during session
- [ ] Keyboard accessible
- [ ] Mobile responsive (chips wrap)
- [ ] Visual feedback for selected chips
- [ ] Smooth animations

---

## 8.6 Profile Page Resume Button Layout

**Current:** Resume buttons inside profile card (feels cramped)
**Target:** Move buttons to separate section below card

### Changes

- Move `<eb-button>` elements outside profile card
- Create `.profile-actions` section below card
- Add "Resume" section heading
- Improve spacing and visual hierarchy

### Acceptance Criteria

- [ ] Buttons below card in left column
- [ ] Section has clear heading
- [ ] Mobile responsive (buttons stack or go full-width)
- [ ] ARIA labels on all buttons
- [ ] Proper focus management
- [ ] Consistent with design system spacing

---

## 8.7 Toast Component Visual Improvements

**Current:**

- Dismiss button is empty block (no icon)
- Status badge/dot may be too large

**Target:**

- Replace empty dismiss button with X/close icon
- Reduce size of status badge/dot for better visual balance

### Changes

**Modify:** `ToastComponent`

```typescript
// Add icon to dismiss button
<button class="toast__dismiss" (click)="dismiss()">
  <eb-icon name="close" size="sm" [ariaLabel]="'Dismiss notification'" />
</button>
```

```scss
// Adjust badge size
.toast__badge {
  width: 8px; // Reduce from current size
  height: 8px; // Reduce from current size
}
```

### Acceptance Criteria

- [ ] Dismiss button shows X/close icon
- [ ] Icon is appropriately sized and visible
- [ ] Badge/dot size reduced and visually balanced
- [ ] ARIA label on dismiss button
- [ ] Works in all 6 themes
- [ ] Color contrast meets WCAG AA
- [ ] Storybook story updated

---

## 8.8 Profile Stats Caching

**Reference:** `/docs/PROFILE_STATS_CACHING_PLAN.md`

**Current:** Stats refetch on every navigation to profile page
**Target:** Persist stats across navigation (app-level store provider)

### Actions

1. Create `provideProfileStore()` in `profile.store.provider.ts`
2. Move provider from `ProfileComponent` to `app.config.ts`
3. Update unit tests to mock app-level store
4. Implement cache invalidation strategy

### Acceptance Criteria

- [ ] Stats persist when navigating away and back
- [ ] No API re-fetch within 1 hour cache window
- [ ] Cache clears on hard refresh
- [ ] All tests pass
- [ ] No memory leaks from store persistence

---

## 8.9 Enhanced Dashboard Metrics

**Current:** Basic dashboard with build status, test coverage, last deployment
**Target:** Comprehensive metrics dashboard showcasing code quality and project health

### Overview

Expand the home dashboard to display real, actionable metrics that demonstrate code quality, documentation coverage, and overall project health. This makes the portfolio more impressive and provides useful information at a glance.

### New Metrics to Add

**Code Quality Metrics:**

1. **Documentation Coverage (Compodoc)**
   - Parse `documentation.json` to extract coverage percentage
   - Display percentage with visual indicator (progress bar or gauge)
   - Show number of documented vs. total components/services
   - Link to full Compodoc documentation

2. **Test Coverage Details**
   - Expand beyond single percentage
   - Show breakdown: Statements, Branches, Functions, Lines
   - Visual indicators for each metric
   - Trend indicator (if coverage increased/decreased)

3. **Bundle Size**
   - Parse build stats to show main bundle size
   - Show gzipped size
   - Indicator if within budget thresholds
   - Link to bundle analyzer

4. **Linting Status**
   - Show ESLint warning/error count (0 is goal)
   - Prettier formatting status
   - Last lint run timestamp

5. **Dependency Health**
   - Total dependencies count
   - Outdated packages count
   - Security vulnerabilities count (from npm audit)
   - Link to dependency review

6. **Storybook Coverage**
   - Count of components with stories
   - Percentage of shared components documented
   - Link to Storybook

**Project Activity Metrics:**

7. **Git Statistics**
   - Total commits
   - Active branches count
   - Last commit timestamp
   - Contributors count

8. **Lighthouse Scores**
   - Performance, Accessibility, Best Practices, SEO scores
   - Visual badges/indicators
   - Link to latest Lighthouse report

9. **Build Performance**
   - Average build time
   - Last successful build timestamp
   - Build trend (faster/slower)

### Data Sources

**Static (Parse at Build Time):**

- `documentation.json` → Compodoc coverage
- `coverage/coverage-summary.json` → Test coverage details
- `dist/stats.json` → Bundle sizes
- `.git/` → Git statistics
- `package.json` + `package-lock.json` → Dependency counts

**Dynamic (Mock/Simulate):**

- Lighthouse scores (could parse CI artifacts or mock)
- Build times (could track via CI or mock)
- Dependency vulnerabilities (`npm audit --json`)

### Component Structure

**DashboardMetricsComponent** (Smart Component)

- **Why new:** Orchestrates metrics data fetching and state management
- Fetches all metrics data from various sources
- Parses JSON files (documentation.json, coverage-summary.json, etc.)
- Passes data to existing CardComponent instances
- Located at: `src/app/features/home/components/dashboard-metrics/`

**Metric Display**

- **Use existing CardComponent** for individual metric displays
- No need for separate MetricCardComponent - leverage design system
- Pass metric data via content projection (title, value, icon, trend, status)
- CardComponent variants handle visual differences (elevated, outlined, etc.)

**Layout**

- **Use existing GridComponent** for responsive metric card layout
- No need for separate MetricGridComponent
- GridComponent already handles responsive breakpoints and auto-adjustment

### Data Model

```typescript
interface DashboardMetric {
  readonly id: string;
  readonly category: 'quality' | 'activity' | 'performance';
  readonly title: string;
  readonly value: string | number;
  readonly subtitle?: string;
  readonly icon: string;
  readonly status: 'success' | 'warning' | 'error' | 'info';
  readonly trend?: {
    readonly direction: 'up' | 'down' | 'neutral';
    readonly value: string;
  };
  readonly link?: {
    readonly label: string;
    readonly url: string;
  };
  readonly visualType: 'number' | 'percentage' | 'badge' | 'list';
}

interface DocumentationCoverage {
  readonly total: number;
  readonly documented: number;
  readonly percentage: number;
  readonly breakdown: {
    readonly components: { total: number; documented: number };
    readonly services: { total: number; documented: number };
    readonly directives: { total: number; documented: number };
    readonly pipes: { total: number; documented: number };
  };
}

interface CoverageDetails {
  readonly statements: { pct: number; covered: number; total: number };
  readonly branches: { pct: number; covered: number; total: number };
  readonly functions: { pct: number; covered: number; total: number };
  readonly lines: { pct: number; covered: number; total: number };
}

interface BundleSize {
  readonly main: { raw: number; gzipped: number };
  readonly total: { raw: number; gzipped: number };
  readonly withinBudget: boolean;
}
```

### Implementation Approach

**Phase 1: Static Metrics (Low-hanging fruit)**

1. Parse `documentation.json` for Compodoc coverage
2. Parse `coverage/coverage-summary.json` for detailed test coverage
3. Parse `package.json` for dependency counts
4. Display in new metric cards on dashboard

**Phase 2: Build-time Metrics**

1. Add script to generate `metrics.json` during build
2. Include git stats, bundle sizes, build timestamp
3. Serve as static asset

**Phase 3: Dynamic/Simulated Metrics**

1. Mock Lighthouse scores (or parse CI artifacts)
2. Mock build performance trends
3. Add npm audit integration (or mock)

### Example Metrics Display

```
┌─────────────────────┬─────────────────────┬─────────────────────┐
│ Documentation       │ Test Coverage       │ Bundle Size         │
│ 94%                 │ 87% ↑               │ 245 KB ✓            │
│ 142/151 documented  │ All metrics >85%    │ Within budget       │
│ [View Docs]         │ [View Report]       │ [Analyze]           │
└─────────────────────┴─────────────────────┴─────────────────────┘

┌─────────────────────┬─────────────────────┬─────────────────────┐
│ Linting             │ Dependencies        │ Storybook           │
│ 0 errors ✓          │ 1,783 packages      │ 28/32 components    │
│ 0 warnings ✓        │ 3 outdated          │ 87.5% coverage      │
│ [Run Lint]          │ [Review]            │ [View Stories]      │
└─────────────────────┴─────────────────────┴─────────────────────┘

┌─────────────────────┬─────────────────────┬─────────────────────┐
│ Lighthouse          │ Git Activity        │ Build Status        │
│ 98 | 100 | 100 | 100│ 287 commits         │ ✓ Passing           │
│ Perf|A11y|BP |SEO   │ Last: 2 hours ago   │ Avg: 45s            │
│ [Latest Report]     │ [View Repo]         │ [CI Pipeline]       │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

### Scripts to Add

```json
{
  "scripts": {
    "metrics:generate": "node scripts/generate-metrics.js",
    "metrics:coverage": "node scripts/parse-coverage.js",
    "metrics:docs": "node scripts/parse-compodoc.js",
    "metrics:audit": "npm audit --json > metrics/audit.json"
  }
}
```

### Acceptance Criteria

- [ ] Compodoc documentation coverage displayed with percentage and breakdown
- [ ] Test coverage shows all 4 metrics (statements, branches, functions, lines)
- [ ] Bundle size displayed with budget status
- [ ] Linting status shows error/warning counts
- [ ] Dependency health metrics displayed
- [ ] Storybook coverage percentage calculated and shown
- [ ] Git statistics displayed (commits, last commit time)
- [ ] Lighthouse scores displayed (real or mocked)
- [ ] All metrics update when running `npm run metrics:generate`
- [ ] Metric cards have consistent design with icons and status colors
- [ ] Mobile responsive layout (cards stack on small screens)
- [ ] Links to detailed reports work correctly
- [ ] WCAG 2.1 AA compliant
- [ ] All metrics accurate and verified

---

## Timeline Estimate

| Task                      | Estimated Time  |
| ------------------------- | --------------- |
| 8.1 Blog Feature Module   | 24-32 hours     |
| 8.2 User Menu             | 6-8 hours       |
| 8.3 Theme Menu            | 4-6 hours       |
| 8.4 Home Branding         | 6-10 hours      |
| 8.5 Filter Chips          | 6-8 hours       |
| 8.6 Profile Layout        | 2 hours         |
| 8.7 Toast Improvements    | 1-2 hours       |
| 8.8 Profile Stats Caching | 1-2 hours       |
| 8.9 Enhanced Dashboard    | 12-16 hours     |
| **Total**                 | **62-86 hours** |

**8.1 Breakdown:**

- BlogStore + data model: 4-6 hours
- BlogListComponent (uses CardComponent): 6-8 hours
- BlogDetailComponent: 8-10 hours
- Styling card content projection: 2-3 hours
- Content migration: 2-3 hours
- Routing & navigation: 2-3 hours

**8.2 Breakdown:**

- UserMenuComponent creation: 4-5 hours
- HeaderComponent integration: 1-2 hours
- Testing & accessibility: 1-2 hours

**8.3 Breakdown:**

- ThemePickerComponent compact mode: 2-3 hours
- HeaderComponent integration: 1-2 hours
- Testing: 1 hour

**8.5 Breakdown:**

- FilterChipsComponent creation: 4-5 hours
- Integration in ModulesListComponent: 1-2 hours
- Integration in AdrListComponent: 1-2 hours

**8.9 Breakdown:**

- Metric parsing scripts: 4-5 hours
- DashboardMetricsComponent (uses CardComponent + GridComponent): 4-5 hours
- Styling metric content projection: 2-3 hours
- Integration & testing: 2-3 hours

---

## Success Criteria

### Quantitative

- [ ] Blog feature fully functional with all existing articles
- [ ] All new components have 85%+ test coverage
- [ ] All new features WCAG 2.1 AA compliant
- [ ] Zero new accessibility violations
- [ ] Mobile responsive on all screen sizes
- [ ] All Storybook stories created

### Qualitative

- [ ] Enhanced portfolio presentation
- [ ] Improved user experience
- [ ] Professional appearance
- [ ] Consistent with existing design
- [ ] Easy content management for blog

---

## Dependencies

- Completion of Phase 7 (Polish & Cleanup)
- Design system components from Phase 3
- Theme system from Phase 2
- All existing features stable

---

## Risks & Mitigation

| Risk                              | Impact | Mitigation                                            |
| --------------------------------- | ------ | ----------------------------------------------------- |
| Blog content migration complexity | Medium | Start with simple JSON structure, iterate             |
| Markdown rendering performance    | Low    | Use virtual scrolling for long articles if needed     |
| Scope creep on blog features      | Medium | Start with MVP, create issues for future enhancements |
| Breaking existing features        | High   | Comprehensive regression testing, feature flags       |

---

**Last Updated:** 2026-01-01
**Document Owner:** Development Team
**Status:** Ready for Implementation
