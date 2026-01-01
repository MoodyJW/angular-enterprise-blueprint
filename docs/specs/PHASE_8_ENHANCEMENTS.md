# ✨ Phase 8: Enhancements & New Features

**Status:** Not Started
**Goal:** Add new capabilities and features to enhance the portfolio presentation and user experience.

**Principles:**

- Build on the solid foundation established in Phases 1-7
- Maintain consistency with existing design system
- Ensure all new features meet WCAG 2.1 AA standards
- Focus on portfolio presentation and user engagement

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

**BlogCardComponent** (Presentational)

- Reusable card for article preview
- Props: title, excerpt, date, readingTime, tags, featuredImage, slug
- Hover states and accessibility
- Responsive layout

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

**UserMenuComponent** (New)

- Dropdown menu with account name header
- Logout option
- Future: Settings, Profile links

**Changes:**

- **Modify:** `HeaderComponent` (replace text/button with icon button)

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

**ThemeMenuComponent** (New)

- Shows all 6 themes with visual previews
- Current theme highlighted
- Theme name and description

**Changes:**

- **Modify:** `HeaderComponent` (replace picker with icon button)

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

**FilterChipsComponent** (New - Reusable)

- Multi-select chip filter
- "Clear all" functionality
- Chip removal
- Props: filters[], selectedFilters[], (filterChange) event

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
| **Total**                 | **50-70 hours** |

**8.1 Breakdown:**

- BlogStore + data model: 4-6 hours
- BlogListComponent: 8-10 hours
- BlogDetailComponent: 8-10 hours
- BlogCardComponent: 2-3 hours
- Content migration: 2-3 hours

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
