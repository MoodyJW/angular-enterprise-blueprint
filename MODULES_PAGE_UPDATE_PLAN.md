# Modules Page Update Plan

## Overview

Update the Modules page to only showcase modules that are part of the Angular Enterprise Blueprint application, remove external personal projects, add missing application modules, and update the card UI design to match the ADR list page style.

---

## Phase 1: Update modules.json Data

### 1.1 Remove External Projects

**Remove these entries:**

- `gh-user-search` - GitHub User Search (external personal project)
- `in-browser-markdown-editor` - In-browser Markdown Editor (external personal project)

### 1.2 Keep Existing Blueprint Modules

**Keep these entries (already correct):**

- ✅ `design-system` - Enterprise Design System
- ✅ `error-handling` - Global Error Handling
- ✅ `analytics-provider` - Analytics Provider Pattern
- ✅ `i18n-transloco` - Internationalization with Transloco

### 1.3 Add Missing Blueprint Modules

**Add the following new module entries:**

#### 1. **State Management with NgRx SignalStore**

```json
{
  "id": "signalstore-state",
  "title": "State Management with SignalStore",
  "description": "Signal-first reactive state management using NgRx SignalStore with minimal boilerplate and entity management.",
  "category": "state-management",
  "status": "production",
  "tags": ["signals", "state", "ngrx", "reactive"],
  "repoUrl": "https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/features/home/state",
  "demoUrl": "https://moodyjw.github.io/angular-enterprise-blueprint/",
  "features": [
    "Signal-first architecture",
    "Entity management",
    "RxJS integration via rxMethod()",
    "Minimal boilerplate"
  ],
  "techStack": ["Angular", "NgRx SignalStore", "RxJS", "TypeScript"]
}
```

#### 2. **Mock Authentication Strategy**

```json
{
  "id": "mock-auth-strategy",
  "title": "Mock Auth with Strategy Pattern",
  "description": "Authentication system using Strategy pattern with MockAuthStrategy, demonstrating SOLID principles and easy provider swapping.",
  "category": "security",
  "status": "production",
  "tags": ["auth", "security", "strategy-pattern", "guards"],
  "repoUrl": "https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/core/auth",
  "demoUrl": "https://moodyjw.github.io/angular-enterprise-blueprint/auth/login",
  "features": [
    "Strategy pattern implementation",
    "Route guards",
    "State management integration",
    "Easy swap to OAuth2/SAML"
  ],
  "techStack": ["Angular", "RxJS", "TypeScript"]
}
```

#### 3. **Theming System**

```json
{
  "id": "theming-system",
  "title": "Theming System Design",
  "description": "CSS custom properties theming with 6 named themes, system preference detection, and runtime theme switching.",
  "category": "ui",
  "status": "production",
  "tags": ["themes", "css-variables", "dark-mode", "accessibility"],
  "repoUrl": "https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/core/services/theme",
  "demoUrl": "https://moodyjw.github.io/angular-enterprise-blueprint/",
  "features": [
    "6 named themes (light, dark, high-contrast)",
    "System preference detection",
    "Runtime theme switching",
    "No JavaScript overhead"
  ],
  "techStack": ["CSS Custom Properties", "Angular", "TypeScript"]
}
```

#### 4. **SEO Management**

```json
{
  "id": "seo-management",
  "title": "SEO Management Service",
  "description": "Centralized SEO management for dynamic title, meta tags, Open Graph, Twitter Cards, and canonical URLs.",
  "category": "infrastructure",
  "status": "production",
  "tags": ["seo", "meta-tags", "social-media", "routing"],
  "repoUrl": "https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/core/services/seo",
  "demoUrl": "https://moodyjw.github.io/angular-enterprise-blueprint/",
  "features": [
    "Dynamic meta tag management",
    "Open Graph support",
    "Twitter Card support",
    "Canonical URL management"
  ],
  "techStack": ["Angular", "Meta API", "TypeScript"]
}
```

#### 5. **Testing Strategy**

```json
{
  "id": "testing-strategy",
  "title": "Testing with Vitest & Playwright",
  "description": "Modern testing stack with Vitest for high-speed unit tests and Playwright for robust E2E testing.",
  "category": "infrastructure",
  "status": "production",
  "tags": ["testing", "vitest", "playwright", "e2e"],
  "repoUrl": "https://github.com/MoodyJW/angular-enterprise-blueprint",
  "demoUrl": "https://moodyjw.github.io/angular-enterprise-blueprint/",
  "features": [
    "Vitest unit/integration tests",
    "Playwright E2E tests",
    "85% coverage threshold",
    "Fast test execution"
  ],
  "techStack": ["Vitest", "Playwright", "TypeScript", "Angular"]
}
```

#### 6. **Lazy Loading & Code Splitting**

```json
{
  "id": "lazy-loading",
  "title": "Lazy Loading & Code Splitting",
  "description": "Route-level code splitting using standalone component lazy loading to minimize bundle size and improve performance.",
  "category": "infrastructure",
  "status": "production",
  "tags": ["performance", "lazy-loading", "code-splitting", "routing"],
  "repoUrl": "https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/app/app.routes.ts",
  "demoUrl": "https://moodyjw.github.io/angular-enterprise-blueprint/",
  "features": [
    "Route-level code splitting",
    "Standalone component lazy loading",
    "Minimal initial bundle",
    "On-demand feature loading"
  ],
  "techStack": ["Angular", "TypeScript"]
}
```

#### 7. **Form Management Pattern**

```json
{
  "id": "form-management",
  "title": "Reactive Forms with CVA",
  "description": "Reactive Forms combined with custom ControlValueAccessor components for consistent validation and testability.",
  "category": "ui",
  "status": "production",
  "tags": ["forms", "validation", "reactive", "cva"],
  "repoUrl": "https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/shared/components",
  "demoUrl": "https://moodyjw.github.io/angular-enterprise-blueprint/auth/login",
  "features": [
    "Reactive Forms",
    "Custom ControlValueAccessor",
    "Consistent validation logic",
    "Full testability"
  ],
  "techStack": ["Angular", "TypeScript", "RxJS"]
}
```

#### 8. **Logging & Monitoring**

```json
{
  "id": "logging-monitoring",
  "title": "Logging & Monitoring Strategy",
  "description": "Abstracted logging via LoggerService with environment-aware filtering and future-proof destination swapping.",
  "category": "infrastructure",
  "status": "production",
  "tags": ["logging", "monitoring", "debugging", "observability"],
  "repoUrl": "https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/core/services/logger",
  "demoUrl": "https://moodyjw.github.io/angular-enterprise-blueprint/",
  "features": [
    "Environment-aware severity filtering",
    "Context enrichment",
    "Destination abstraction",
    "Production-ready logging"
  ],
  "techStack": ["Angular", "TypeScript"]
}
```

#### 9. **Strict Layering with ESLint**

```json
{
  "id": "strict-layering",
  "title": "Strict Layering with ESLint",
  "description": "Enforced architectural boundaries using eslint-plugin-boundaries to prevent circular dependencies.",
  "category": "infrastructure",
  "status": "production",
  "tags": ["architecture", "eslint", "boundaries", "layering"],
  "repoUrl": "https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/.eslintrc.json",
  "demoUrl": "https://moodyjw.github.io/angular-enterprise-blueprint/architecture",
  "features": [
    "Enforced layer boundaries",
    "Prevents circular dependencies",
    "Unidirectional data flow",
    "CI/CD integration"
  ],
  "techStack": ["ESLint", "TypeScript"]
}
```

#### 10. **CI/CD Pipeline**

```json
{
  "id": "cicd-pipeline",
  "title": "CI/CD Pipeline Architecture",
  "description": "Comprehensive GitHub Actions pipeline with parallelized testing, security scanning, and automated deployment.",
  "category": "infrastructure",
  "status": "production",
  "tags": ["cicd", "github-actions", "automation", "deployment"],
  "repoUrl": "https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/.github/workflows",
  "demoUrl": "https://moodyjw.github.io/angular-enterprise-blueprint/",
  "features": [
    "Parallelized jobs",
    "CodeQL security scanning",
    "Lighthouse audits",
    "Automated deployment"
  ],
  "techStack": ["GitHub Actions", "Lighthouse", "CodeQL"]
}
```

**Final Count:** 14 modules total (removed 2, kept 4, added 10)

---

## Phase 2: Update Module Card UI Design

### 2.1 Remove "View Details" Button

**Change from:**

```html
<eb-button>View Details ></eb-button>
```

**Change to:**

```html
<eb-icon [name]="ICONS.CHEVRON_RIGHT" size="sm" [decorative]="true"></eb-icon>
```

**Location:** Card footer, positioned in bottom-right corner

### 2.2 Update Tags Display

**Change from:**

- Tags clipped with `+1`, `+2` overflow indicators
- Limited width display

**Change to:**

- Tags expand to full width of card
- Tags wrap to multiple lines if needed
- No overflow indicators

**Implementation:**

```scss
.module-card__tags {
  display: flex;
  flex-wrap: wrap; // Allow wrapping
  gap: var(--spacing-xs);
  width: 100%; // Full width
  // Remove: max-width or overflow restrictions
}
```

### 2.3 Update Card Footer Layout

**New structure:**

```html
<div class="module-card__footer">
  <div class="module-card__tags">
    @for (tag of module.tags; track tag) {
    <eb-badge [content]="tag" size="sm" variant="secondary"></eb-badge>
    }
  </div>
  <eb-icon [name]="ICONS.CHEVRON_RIGHT" size="sm" [decorative]="true"></eb-icon>
</div>
```

**Styling:**

```scss
.module-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--spacing-md);
  margin-top: auto; // Push to bottom
}

.module-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  flex: 1; // Take available space
}

.module-card__footer eb-icon {
  flex-shrink: 0; // Don't shrink icon
  align-self: flex-end;
  margin-left: auto;
}
```

---

## Phase 3: Component Updates

### 3.1 Update modules.component.ts

**Add icon provider:**

```typescript
import { heroChevronRight } from '@ng-icons/heroicons/outline';
import { provideIcons } from '@ng-icons/core';

viewProviders: [provideIcons({ heroChevronRight })],
```

**Add icon constant:**

```typescript
protected readonly ICONS = ICON_NAMES;
```

### 3.2 Update modules.component.html

**Update card template to match architecture page pattern:**

```html
<a [routerLink]="['/modules', module.id]" class="module-card-link">
  <eb-card class="module-card" [hoverable]="true">
    <eb-stack card-body spacing="sm">
      <div class="module-card__header">
        <eb-badge
          [variant]="getStatusVariant(module.status)"
          [content]="t('modules.statuses.' + module.status)"
          position="inline"
        ></eb-badge>
      </div>
      <h3 class="module-card__title">{{ module.title }}</h3>
      <p class="module-card__description">{{ module.description }}</p>
      <div class="module-card__footer">
        <div class="module-card__tags">
          @for (tag of module.tags; track tag) {
          <eb-badge [content]="tag" size="sm" variant="secondary"></eb-badge>
          }
        </div>
        <eb-icon [name]="ICONS.CHEVRON_RIGHT" size="sm" [decorative]="true"></eb-icon>
      </div>
    </eb-stack>
  </eb-card>
</a>
```

### 3.3 Update modules.component.scss

**Match ADR card styling:**

```scss
.module-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.module-card {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin: 0;
    color: var(--text-primary);
  }

  &__description {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin: 0;
    flex-grow: 1;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: var(--spacing-md);
    margin-top: auto;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    flex: 1;
  }

  eb-icon {
    flex-shrink: 0;
    color: var(--text-tertiary);
    transition: transform 0.2s ease;
  }
}

.module-card-link:hover .module-card eb-icon {
  transform: translateX(4px);
}
```

---

## Phase 4: Translation Updates

### 4.1 Update src/assets/i18n/en.json

**IMPORTANT:** All module titles, descriptions, features, and metadata must be added to the translation file to support i18n and consistent display.

**Add/Update the modules section:**

```json
"modules": {
  "title": "Reference Modules",
  "subtitle": "Explore reusable patterns and architectural decisions implemented in this blueprint",
  "searchPlaceholder": "Search modules...",
  "searchLabel": "Search modules by name or tag",
  "resultsCount": "{{count}} modules found",
  "noResults": "No modules found",
  "noResultsHint": "Try adjusting your search or filter",
  "clearSearch": "Clear search",

  "statuses": {
    "production": "Production",
    "beta": "Beta",
    "experimental": "Experimental"
  },

  "categories": {
    "ui": "UI Components",
    "infrastructure": "Infrastructure",
    "security": "Security",
    "state-management": "State Management"
  },

  "data": {
    "design-system": {
      "title": "Enterprise Design System",
      "description": "Comprehensive UI component library with theming, accessibility, and Storybook documentation."
    },
    "signalstore-state": {
      "title": "State Management with SignalStore",
      "description": "Signal-first reactive state management using NgRx SignalStore with minimal boilerplate and entity management."
    },
    "mock-auth-strategy": {
      "title": "Mock Auth with Strategy Pattern",
      "description": "Authentication system using Strategy pattern with MockAuthStrategy, demonstrating SOLID principles and easy provider swapping."
    },
    "theming-system": {
      "title": "Theming System Design",
      "description": "CSS custom properties theming with 6 named themes, system preference detection, and runtime theme switching."
    },
    "error-handling": {
      "title": "Global Error Handling",
      "description": "Centralized error handling with HTTP interceptors, global error handler, and user notification system."
    },
    "analytics-provider": {
      "title": "Analytics Provider Pattern",
      "description": "Pluggable analytics using the Provider pattern. Swap between console, Google Analytics, or custom providers."
    },
    "seo-management": {
      "title": "SEO Management Service",
      "description": "Centralized SEO management for dynamic title, meta tags, Open Graph, Twitter Cards, and canonical URLs."
    },
    "i18n-transloco": {
      "title": "Internationalization with Transloco",
      "description": "Multi-language support using Transloco with lazy-loaded translations and dynamic language switching."
    },
    "testing-strategy": {
      "title": "Testing with Vitest & Playwright",
      "description": "Modern testing stack with Vitest for high-speed unit tests and Playwright for robust E2E testing."
    },
    "lazy-loading": {
      "title": "Lazy Loading & Code Splitting",
      "description": "Route-level code splitting using standalone component lazy loading to minimize bundle size and improve performance."
    },
    "form-management": {
      "title": "Reactive Forms with CVA",
      "description": "Reactive Forms combined with custom ControlValueAccessor components for consistent validation and testability."
    },
    "logging-monitoring": {
      "title": "Logging & Monitoring Strategy",
      "description": "Abstracted logging via LoggerService with environment-aware filtering and future-proof destination swapping."
    },
    "strict-layering": {
      "title": "Strict Layering with ESLint",
      "description": "Enforced architectural boundaries using eslint-plugin-boundaries to prevent circular dependencies."
    },
    "cicd-pipeline": {
      "title": "CI/CD Pipeline Architecture",
      "description": "Comprehensive GitHub Actions pipeline with parallelized testing, security scanning, and automated deployment."
    }
  }
}
```

**Note:** The component should use translations like:

- `{{ t('modules.data.' + module.id + '.title') }}` for titles
- `{{ t('modules.data.' + module.id + '.description') }}` for descriptions
- `{{ t('modules.statuses.' + module.status) }}` for status badges
- `{{ t('modules.categories.' + module.category) }}` for category display

---

## Phase 5: Category Badge Colors

### 5.1 Update Category Mapping

**Map categories to badge variants:**

- `ui` → `primary`
- `infrastructure` → `secondary`
- `security` → `warning`
- `state-management` → `info`

**Implementation in component:**

```typescript
protected getCategoryVariant(category: string): BadgeVariant {
  switch (category) {
    case 'ui':
      return 'primary';
    case 'security':
      return 'warning';
    case 'state-management':
      return 'info';
    case 'infrastructure':
    default:
      return 'secondary';
  }
}
```

---

## Summary of Changes

### Files to Modify:

1. ✅ `src/assets/data/modules.json` - Update module data
2. ✅ `src/app/features/modules/modules.component.ts` - Add icon provider and methods
3. ✅ `src/app/features/modules/modules.component.html` - Update card template
4. ✅ `src/app/features/modules/modules.component.scss` - Update card styles
5. ✅ `src/assets/i18n/en.json` - Add translations

### Expected Outcome:

- **14 modules** showcasing only Angular Enterprise Blueprint features
- Cards matching ADR page design with:
  - Icon-only navigation (chevron right) in bottom-right
  - Full-width tags that wrap naturally
  - Consistent hover states
  - Clean, professional appearance
- Removed external personal projects
- All application modules properly documented

---

## Testing Checklist

- [ ] Verify all 14 modules display correctly
- [ ] Test tag wrapping on cards with many tags
- [ ] Verify chevron icon appears in bottom-right
- [ ] Test hover states on cards
- [ ] Verify routing to module detail pages works
- [ ] Test responsive layout on mobile, tablet, desktop
- [ ] Verify category badges use correct colors
- [ ] Check that status badges display correctly
- [ ] Test search/filter functionality still works
- [ ] Verify translations load properly
