# Bundle Size Optimization Plan

## Executive Summary

This document outlines actionable steps to reduce the initial bundle size of the Angular Enterprise Blueprint application by **405-735KB (40-60% reduction)**. The application already has good lazy-loading infrastructure, but several critical optimizations will maximize the benefits.

**Current State:**

- ✅ Routes use `loadComponent()` and `loadChildren()` (good lazy loading setup)
- ✅ Icon registration at component level
- ✅ Transloco using HTTP loader
- ❌ **PreloadAllModules defeats lazy loading** (CRITICAL ISSUE)
- ❌ Markdown libraries loaded globally for single feature
- ⚠️ Icon registry imports all 110+ icons upfront

**Target Outcome:**

- Initial bundle < 300KB (currently ~500KB-1MB)
- Only essential code in main bundle
- Feature-specific libraries lazy-loaded
- Aggressive preloading replaced with selective strategy

---

## Phase 1: Critical Wins (IMMEDIATE) - Est. 350-650KB Savings

### 1.1 Disable Aggressive Preloading Strategy

**Impact:** 🔴 **CRITICAL - 200-400KB savings**

**Problem:**
The application uses `PreloadAllModules` which immediately downloads all lazy-loaded routes after the initial load, defeating the purpose of lazy loading.

**Current Code:**

```typescript
// src/app/app.config.ts:41
withPreloading(PreloadAllModules),
```

**Routes Being Preloaded Unnecessarily:**

- `/architecture` (architecture viewer + markdown libraries)
- `/modules` (module catalog)
- `/profile` (user profile)
- `/contact` (contact form)
- `/auth/*` (login/register flows)

**Solution:**

Replace with `NoPreloading` for optimal initial bundle:

```typescript
// src/app/app.config.ts
import { NoPreloading } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withPreloading(NoPreloading), // ✅ Changed from PreloadAllModules
    ),
    // ... rest of config
  ],
};
```

**Alternative - Selective Preloading:**

If you want to preload frequently accessed routes while keeping initial bundle small:

```typescript
// src/app/core/strategies/selective-preload.strategy.ts
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectivePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    // Only preload routes marked with data.preload = true
    return route.data?.['preload'] ? load() : of(null);
  }
}

// Usage in app.config.ts
withPreloading(SelectivePreloadStrategy),

// Mark specific routes in app.routes.ts
{
  path: 'architecture',
  loadComponent: () => import('./features/architecture/architecture.component'),
  data: { preload: true }, // Only this route will be preloaded
},
```

**Testing:**

```bash
# Before change
npm run build
# Check dist/browser/*.js file sizes

# After change
npm run build
# Verify main.*.js is 200-400KB smaller
```

**Files to Modify:**

- [src/app/app.config.ts](../../../src/app/app.config.ts) - Line 41

---

### 1.2 Lazy Load Markdown Libraries

**Impact:** 🔴 **CRITICAL - 150-250KB savings**

**Problem:**
The `ngx-markdown` library and its dependencies (`marked`, `prismjs`) are provided globally but only used in the ADR viewer component.

**Current Dependencies:**

```json
// package.json
"marked": "^16.0.0",           // 464KB in node_modules
"ngx-markdown": "^19.0.0",      // 272KB in node_modules
"prismjs": "^1.29.0"            // 3.8MB in node_modules (only code highlighting)
```

**Current Code:**

```typescript
// src/app/app.config.ts:54
provideMarkdown(), // ❌ Global provider
```

**Usage:**

- Only used in `src/app/features/architecture/viewer/adr-viewer.component.ts`
- ADR viewer is at `/architecture` route (lazy-loaded)
- Markdown styles in `src/styles/_markdown.scss` (global)

**Solution:**

**Step 1:** Remove global provider

```typescript
// src/app/app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    // provideMarkdown(), // ❌ REMOVE THIS LINE
  ],
};
```

**Step 2:** Provide markdown at architecture route level

```typescript
// src/app/features/architecture/architecture.routes.ts
import { Routes } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';

export const ARCHITECTURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./architecture.component'),
    providers: [
      provideMarkdown(), // ✅ Only loaded when architecture route is accessed
    ],
  },
];
```

**Step 3:** Move markdown styles to component scope

```typescript
// src/app/features/architecture/viewer/adr-viewer.component.ts
@Component({
  selector: 'eb-adr-viewer',
  styleUrl: './adr-viewer.component.scss',
  // Add markdown styles directly to component
  styleUrls: [
    './adr-viewer.component.scss',
    '../../../../styles/_markdown.scss', // ✅ Component-scoped
  ],
})
export class AdrViewerComponent {
  // ... component code
}
```

**Alternative - Inline Markdown Styles:**

Create `adr-viewer-markdown.scss` in the viewer component directory:

```scss
// src/app/features/architecture/viewer/adr-viewer-markdown.scss
// Copy contents from src/styles/_markdown.scss
// This makes the dependency explicit and component-scoped

.markdown-body {
  h1,
  h2,
  h3 {
    /* ... */
  }
  code {
    /* ... */
  }
  pre {
    /* ... */
  }
  // ... rest of markdown styles
}
```

Then update component:

```typescript
styleUrls: [
  './adr-viewer.component.scss',
  './adr-viewer-markdown.scss',
],
```

**Step 4:** Remove global markdown styles

```scss
// src/styles.scss
@use './styles/reset';
@use './styles/typography';
@use './styles/theme-loader';
// @use './styles/markdown'; // ❌ REMOVE - now component-scoped
```

**Testing:**

```bash
# Build and check bundle size
npm run build

# Verify markdown works
npm start
# Navigate to /architecture
# Verify ADR rendering still works correctly
```

**Files to Modify:**

- [src/app/app.config.ts](../../../src/app/app.config.ts) - Remove line 54
- [src/app/features/architecture/architecture.routes.ts](../../../src/app/features/architecture/architecture.routes.ts) - Add provider
- [src/app/features/architecture/viewer/adr-viewer.component.ts](../../../src/app/features/architecture/viewer/adr-viewer.component.ts) - Add styleUrls
- [src/styles.scss](../../../src/styles.scss) - Remove markdown import

---

## Phase 2: Medium Wins (SHORT-TERM) - Est. 55-85KB Savings

### 2.1 Optimize Icon Registry

**Impact:** 🟡 **MEDIUM - 40-60KB savings**

**Problem:**
The `ICON_REGISTRY` constant imports all 110+ icons from both Heroicons and Ionicons upfront, even though components only use a subset.

**Current Code:**

```typescript
// src/app/shared/constants/icons.constants.ts (424 lines)
import {
  heroArrowLeft,
  heroArrowRight,
  heroBars3,
  // ... 50+ more heroicons
} from '@ng-icons/heroicons/outline';

import {
  ionHomeOutline,
  ionPersonOutline,
  // ... 60+ more ionicons
} from '@ng-icons/ionicons';

export const ICON_REGISTRY = {
  heroArrowLeft,
  heroArrowRight,
  // ... 110+ total icons
} as const;
```

**Good News:**

- ✅ Components already use component-level `provideIcons()` (correct approach!)
- ✅ No global icon provider

**Issue:**

- Components import icons from `ICON_REGISTRY` constant
- This pulls in all 110+ icons even though component needs only 2-3
- Tree-shaking cannot eliminate unused icons from the registry object

**Solution:**

**Step 1:** Keep only the type definitions (for type safety)

```typescript
// src/app/shared/constants/icons.constants.ts (SIMPLIFIED)
/**
 * Icon name type definitions for type safety.
 * Components should import icons directly from @ng-icons packages.
 */
export type IconName =
  | 'heroArrowLeft'
  | 'heroArrowRight'
  | 'heroBars3'
  | 'heroChevronDown'
  | 'heroXMark'
  | 'heroMoon'
  | 'heroSun'
  | 'heroGlobeAlt'
  | 'heroCheckCircle'
  | 'heroExclamationTriangle'
  | 'heroInformationCircle'
  | 'heroXCircle'
  | 'ionHomeOutline'
  | 'ionPersonOutline'
  | 'ionMailOutline'
  | 'ionSettingsOutline'
  | 'ionLogOutOutline'
  | 'ionSearchOutline'
  | 'ionFilterOutline'
  | 'ionCodeSlashOutline'
  | 'ionDocumentTextOutline'
  | 'ionGitBranchOutline'
  | 'ionAnalyticsOutline';

// ❌ REMOVE ICON_REGISTRY object entirely
```

**Step 2:** Update components to import icons directly

**BEFORE:**

```typescript
// src/app/core/layout/header/header.component.ts
import { ICON_REGISTRY } from '@shared/constants/icons.constants';

@Component({
  providers: [provideIcons(ICON_REGISTRY)], // ❌ Imports all 110+ icons
})
export class HeaderComponent {}
```

**AFTER:**

```typescript
// src/app/core/layout/header/header.component.ts
import { heroBars3, heroXMark } from '@ng-icons/heroicons/outline';

@Component({
  providers: [provideIcons({ heroBars3, heroXMark })], // ✅ Only 2 icons
})
export class HeaderComponent {}
```

**Step 3:** Batch update all 14 components using icons

**Components to Update:**

1. **Header Component** ([src/app/core/layout/header/header.component.ts](../../../src/app/core/layout/header/header.component.ts))

   ```typescript
   import { heroBars3, heroXMark, heroGlobeAlt } from '@ng-icons/heroicons/outline';
   providers: [provideIcons({ heroBars3, heroXMark, heroGlobeAlt })],
   ```

2. **Navigation Component** ([src/app/core/layout/navigation/navigation.component.ts](../../../src/app/core/layout/navigation/navigation.component.ts))

   ```typescript
   import {
     ionHomeOutline,
     ionPersonOutline,
     ionMailOutline,
     ionCodeSlashOutline,
     ionDocumentTextOutline,
     ionLogOutOutline,
   } from '@ng-icons/ionicons';
   ```

3. **Theme Picker** ([src/app/features/theme-picker/theme-picker.component.ts](../../../src/app/features/theme-picker/theme-picker.component.ts))

   ```typescript
   import { heroMoon, heroSun } from '@ng-icons/heroicons/outline';
   providers: [provideIcons({ heroMoon, heroSun })],
   ```

4. **Modules Component** ([src/app/features/modules/modules.component.ts](../../../src/app/features/modules/modules.component.ts))

   ```typescript
   import { ionSearchOutline, ionFilterOutline, ionCodeSlashOutline } from '@ng-icons/ionicons';
   ```

5. **Architecture Component** ([src/app/features/architecture/architecture.component.ts](../../../src/app/features/architecture/architecture.component.ts))

   ```typescript
   import { ionDocumentTextOutline } from '@ng-icons/ionicons';
   ```

6. **Toast Component** ([src/app/shared/components/toast/toast.component.ts](../../../src/app/shared/components/toast/toast.component.ts))

   ```typescript
   import {
     heroCheckCircle,
     heroExclamationTriangle,
     heroInformationCircle,
     heroXCircle,
     heroXMark,
   } from '@ng-icons/heroicons/outline';
   ```

7. **Button Component** ([src/app/shared/components/button/button.component.ts](../../../src/app/shared/components/button/button.component.ts))

   ```typescript
   // No icons needed - accepts icon name as input
   // Remove provideIcons if present
   ```

8. **Remaining Components:** Apply same pattern to:
   - [src/app/features/home/home.component.ts](../../../src/app/features/home/home.component.ts)
   - [src/app/features/contact/contact.component.ts](../../../src/app/features/contact/contact.component.ts)
   - [src/app/features/profile/profile.component.ts](../../../src/app/features/profile/profile.component.ts)
   - [src/app/shared/components/modal/modal.component.ts](../../../src/app/shared/components/modal/modal.component.ts)
   - [src/app/shared/components/input/input.component.ts](../../../src/app/shared/components/input/input.component.ts)
   - [src/app/shared/components/card/card.component.ts](../../../src/app/shared/components/card/card.component.ts)

**Files to Modify:**

- [src/app/shared/constants/icons.constants.ts](../../../src/app/shared/constants/icons.constants.ts) - Remove ICON_REGISTRY object
- 14 component files - Import icons directly

---

### 2.2 Evaluate App Initializers

**Impact:** 🟡 **MEDIUM - 15-25KB savings**

**Problem:**
Three app initializers run on application startup, adding code to the initial bundle and blocking initial render.

**Current Initializers:**

1. **Auth Session Check** ([src/app/core/auth/auth.provider.ts:37-40](../../../src/app/core/auth/auth.provider.ts))

   ```typescript
   provideAppInitializer(() => {
     const authStore = inject(AuthStore);
     authStore.checkSession(undefined);
   }),
   ```

2. **Analytics Provider** ([src/app/core/services/analytics/analytics.provider.ts:99](../../../src/app/core/services/analytics/analytics.provider.ts))

   ```typescript
   provideAppInitializer(() => {
     const analytics = inject(AnalyticsService);
     // Initializes analytics
   }),
   ```

3. **Router Analytics Tracking** ([src/app/core/services/analytics/analytics-router.provider.ts:78](../../../src/app/core/services/analytics/analytics-router.provider.ts))
   ```typescript
   provideAppInitializer(() => {
     const router = inject(Router);
     const analytics = inject(AnalyticsService);
     // Sets up route tracking
   }),
   ```

**Analysis:**

| Initializer        | Necessity    | Impact | Recommendation                                    |
| ------------------ | ------------ | ------ | ------------------------------------------------- |
| Auth Session Check | ✅ **KEEP**  | High   | Needed to restore user session before app renders |
| Analytics Provider | ⚠️ **DEFER** | Medium | Can initialize after first route load             |
| Router Tracking    | ⚠️ **DEFER** | Low    | Can subscribe to router events lazily             |

**Solution:**

**Option 1 - Defer Analytics (Recommended):**

```typescript
// src/app/core/services/analytics/analytics.provider.ts
// REMOVE provideAppInitializer

// Instead, initialize lazily when first needed
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private initialized = false;

  constructor() {
    // Initialize on first interaction instead of app startup
    afterNextRender(() => {
      this.ensureInitialized();
    });
  }

  private ensureInitialized(): void {
    if (this.initialized) return;
    this.initialized = true;
    // Initialize analytics SDK
  }
}
```

**Option 2 - Use afterNextRender() for Non-Critical Initializers:**

```typescript
// src/app/app.config.ts
import { afterNextRender } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // Keep critical auth check
    provideAppInitializer(() => {
      const authStore = inject(AuthStore);
      authStore.checkSession(undefined);
    }),

    // Defer analytics to after render
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        afterNextRender(() => {
          const analytics = inject(AnalyticsService);
          // Initialize analytics after first render
        });
      },
    },
  ],
};
```

**Testing:**

```bash
# Verify analytics still works
npm start
# Check browser console for analytics events
# Verify page views are still tracked

# Check auth restoration
# Reload page while logged in
# Verify session persists
```

**Files to Modify:**

- [src/app/core/services/analytics/analytics.provider.ts](../../../src/app/core/services/analytics/analytics.provider.ts)
- [src/app/core/services/analytics/analytics-router.provider.ts](../../../src/app/core/services/analytics/analytics-router.provider.ts)

---

## Phase 3: Already Optimized ✅

### 3.1 Angular CDK Usage

**Status:** ✅ **OPTIMAL**

**Current Usage:**

```typescript
// src/app/shared/components/modal/modal.component.ts
import { A11yModule } from '@angular/cdk/a11y';
```

**Analysis:**

- Only `A11yModule` is imported (good tree-shaking)
- Modal component is in shared directory (may be used on home route)
- CDK bundle impact: ~20-30KB (acceptable for accessibility features)

**Recommendation:** ✅ No changes needed - CDK is well tree-shaken

---

### 3.2 Transloco Configuration

**Status:** ✅ **OPTIMAL**

**Current Setup:**

```typescript
// src/app/core/i18n/transloco-loader.ts
export class TranslocoHttpLoader implements TranslocoLoader {
  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}
```

**Analysis:**

- ✅ Using HTTP loader (lazy loading)
- ✅ Translations loaded on-demand
- ✅ Only active language is loaded
- Files: en.json (4.1KB), es.json (1.1KB), fr.json (1.1KB)

**Recommendation:** ✅ No changes needed - already lazy-loaded

---

### 3.3 NgRx SignalStore

**Status:** ✅ **OPTIMAL**

**Dependencies:**

- `@ngrx/signals`: 772KB (node_modules)
- `@ngrx/operators`: 384KB (node_modules)
- Bundle impact: ~15-25KB (excellent tree-shaking)

**Usage:**

- Auth store (global)
- Dashboard store (home route)
- Architecture store (architecture route)
- Modules store (modules route)

**Recommendation:** ✅ No changes needed - modern, well tree-shaken state management

---

### 3.4 Static JSON Data

**Status:** ✅ **OPTIMAL**

**Files:**

- `architecture.json`: 2.0KB
- `modules.json`: 4.1KB
- `metrics.json`: 335 bytes
- Total: 6.5KB

**Analysis:**

- ✅ Loaded dynamically via HTTP services
- ✅ Already lazy-loaded
- ✅ Minimal size

**Recommendation:** ✅ No changes needed

---

## Phase 4: Build Configuration (OPTIONAL)

### 4.1 Update Bundle Budgets

**Current Configuration:**

```json
// angular.json:42-52
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "500kB",
    "maximumError": "1MB"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "2kB",
    "maximumError": "4kB"
  }
]
```

**Recommended Updates After Optimizations:**

```json
// angular.json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "300kB",  // Reduced from 500kB
    "maximumError": "500kB"     // Reduced from 1MB
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "2kB",
    "maximumError": "4kB"
  },
  {
    "type": "bundle",
    "name": "main",
    "baseline": "250kB",        // Track main bundle
    "maximumWarning": "300kB",
    "maximumError": "400kB"
  },
  {
    "type": "bundle",
    "name": "polyfills",
    "baseline": "40kB",
    "maximumWarning": "50kB",
    "maximumError": "60kB"
  }
]
```

**Files to Modify:**

- [angular.json](../../../angular.json) - Lines 42-52

---

### 4.2 Enable Advanced Build Optimizations

**Current Configuration:**

```json
// angular.json
"optimization": true
```

**Enhanced Configuration:**

```json
// angular.json - production configuration
"optimization": {
  "scripts": true,
  "styles": {
    "minify": true,
    "inlineCritical": true
  },
  "fonts": {
    "inline": true
  }
},
"outputHashing": "all",
"sourceMap": false,
"namedChunks": false,
"aot": true,
"buildOptimizer": true
```

**Files to Modify:**

- [angular.json](../../../angular.json) - production configuration

---

## Implementation Checklist

### Phase 1: Critical (Day 1) - 350-650KB savings

- [ ] **1.1 Disable PreloadAllModules**
  - [ ] Change `withPreloading(PreloadAllModules)` to `withPreloading(NoPreloading)` in app.config.ts:41
  - [ ] Run `npm run build` and verify bundle size reduction
  - [ ] Test lazy loading still works for all routes
  - [ ] Optional: Implement SelectivePreloadStrategy for frequently accessed routes

- [ ] **1.2 Lazy Load Markdown**
  - [ ] Remove `provideMarkdown()` from app.config.ts:54
  - [ ] Add `provideMarkdown()` to architecture.routes.ts
  - [ ] Move markdown styles from global to component-scoped
  - [ ] Remove `@use './styles/markdown'` from styles.scss
  - [ ] Test ADR viewer at `/architecture` still renders correctly
  - [ ] Verify syntax highlighting works with Prism

### Phase 2: Medium (Week 1) - 55-85KB savings

- [ ] **2.1 Optimize Icon Registry**
  - [ ] Update icons.constants.ts to remove ICON_REGISTRY object, keep only IconName type
  - [ ] Update header component to import icons directly
  - [ ] Update navigation component to import icons directly
  - [ ] Update theme-picker component to import icons directly
  - [ ] Update modules component to import icons directly
  - [ ] Update architecture component to import icons directly
  - [ ] Update toast component to import icons directly
  - [ ] Update remaining 7 components
  - [ ] Run tests: `npm test`
  - [ ] Verify all icons render correctly

- [ ] **2.2 Defer App Initializers**
  - [ ] Remove analytics provideAppInitializer from analytics.provider.ts
  - [ ] Implement lazy initialization in AnalyticsService
  - [ ] Test analytics events still fire correctly
  - [ ] Verify auth session check still runs on startup

### Phase 3: Build Config (Optional)

- [ ] **4.1 Update Bundle Budgets**
  - [ ] Lower initial bundle budget to 300kB warning, 500kB error
  - [ ] Add main bundle budget tracking
  - [ ] Add polyfills bundle budget

- [ ] **4.2 Enable Advanced Optimizations**
  - [ ] Configure detailed optimization options in angular.json
  - [ ] Test production build
  - [ ] Verify critical CSS inlining works

---

## Verification & Testing

### Bundle Size Analysis

```bash
# Before optimizations
npm run build
ls -lh dist/browser/*.js

# Expected main bundle: ~500-800KB

# After Phase 1
npm run build
ls -lh dist/browser/*.js

# Expected main bundle: ~200-400KB (40-60% reduction)

# Use webpack-bundle-analyzer for detailed breakdown
npm install --save-dev webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/browser/stats.json
```

### Lighthouse Performance

```bash
# Build production
npm run build

# Serve production build
npx http-server dist/browser -p 4200

# Run Lighthouse audit
npx lighthouse http://localhost:4200 --view
```

**Target Metrics:**

- Performance: 95+ (from ~85-90)
- First Contentful Paint: < 1.0s
- Largest Contentful Paint: < 1.5s
- Total Blocking Time: < 150ms
- Speed Index: < 1.5s

### Runtime Testing

After each phase, verify:

```bash
# Start dev server
npm start

# Test checklist:
1. Home page loads correctly
2. Navigate to /architecture - ADR viewer works
3. Navigate to /modules - module list displays
4. Theme picker switches themes
5. Language switcher changes language
6. Icons render in all components
7. Modal opens with focus trap
8. Analytics events fire (check console)
9. Auth session restores on page reload
10. All tests pass: npm test
```

---

## Monitoring & Maintenance

### CI/CD Integration

Add bundle size checks to your CI pipeline:

```yaml
# .github/workflows/ci.yml
- name: Build Production
  run: npm run build

- name: Check Bundle Size
  run: |
    BUNDLE_SIZE=$(stat -f%z dist/browser/main.*.js)
    if [ $BUNDLE_SIZE -gt 400000 ]; then
      echo "Bundle size exceeds 400KB: ${BUNDLE_SIZE} bytes"
      exit 1
    fi
```

### Bundle Size Tracking

Monitor bundle size over time:

```json
// package.json scripts
{
  "scripts": {
    "build:stats": "ng build --stats-json",
    "analyze": "webpack-bundle-analyzer dist/browser/stats.json",
    "size": "npm run build && ls -lh dist/browser/main*.js"
  }
}
```

---

## Expected Outcomes

| Metric                     | Before    | After Phase 1 | After Phase 2 | Improvement       |
| -------------------------- | --------- | ------------- | ------------- | ----------------- |
| **Initial Bundle**         | 500-800KB | 200-400KB     | 150-350KB     | **40-60%**        |
| **Lighthouse Performance** | 85-90     | 92-95         | 95-98         | **+10-13 points** |
| **First Contentful Paint** | 1.2-1.5s  | 0.8-1.0s      | 0.7-0.9s      | **~40% faster**   |
| **Time to Interactive**    | 2.5-3.0s  | 1.5-2.0s      | 1.2-1.8s      | **~45% faster**   |
| **Lazy Chunks**            | 5-6       | 5-6           | 5-6           | Unchanged         |
| **Code Coverage**          | 85%+      | 85%+          | 85%+          | Maintained        |

---

## Risk Assessment

| Risk                          | Likelihood | Impact | Mitigation                              |
| ----------------------------- | ---------- | ------ | --------------------------------------- |
| Markdown breaks in ADR viewer | Low        | High   | Thorough testing of architecture route  |
| Icons don't render            | Low        | Medium | Component-by-component verification     |
| Analytics events lost         | Medium     | Low    | Implement lazy initialization carefully |
| Auth session fails            | Low        | High   | Keep auth initializer as-is             |
| Tests fail                    | Medium     | Medium | Run full test suite after each phase    |
| Breaking changes in prod      | Low        | High   | Deploy to staging first                 |

---

## Success Criteria

- [ ] Initial bundle size < 350KB
- [ ] All 2059 tests pass
- [ ] Lighthouse Performance score > 93
- [ ] No visual regressions
- [ ] All features work identically to before
- [ ] No console errors in production build
- [ ] ADR viewer renders markdown correctly
- [ ] All icons display properly
- [ ] Analytics events tracked correctly
- [ ] Auth session restoration works

---

## References

- [Angular Lazy Loading](https://angular.dev/guide/ngmodules/lazy-loading)
- [Angular Preloading Strategies](https://angular.dev/guide/router#preloading)
- [NgRx SignalStore Tree-Shaking](https://ngrx.io/guide/signals)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Angular Bundle Budgets](https://angular.dev/tools/cli/build#budgets)
- [Web.dev Performance](https://web.dev/performance/)

---

## Appendix: File Reference

### Files to Modify (Phase 1)

1. [src/app/app.config.ts](../../../src/app/app.config.ts) - Lines 41, 54
2. [src/app/features/architecture/architecture.routes.ts](../../../src/app/features/architecture/architecture.routes.ts) - Add provider
3. [src/app/features/architecture/viewer/adr-viewer.component.ts](../../../src/app/features/architecture/viewer/adr-viewer.component.ts) - Add styleUrls
4. [src/styles.scss](../../../src/styles.scss) - Remove markdown import

### Files to Modify (Phase 2)

1. [src/app/shared/constants/icons.constants.ts](../../../src/app/shared/constants/icons.constants.ts) - Remove ICON_REGISTRY
2. [src/app/core/layout/header/header.component.ts](../../../src/app/core/layout/header/header.component.ts)
3. [src/app/core/layout/navigation/navigation.component.ts](../../../src/app/core/layout/navigation/navigation.component.ts)
4. [src/app/features/theme-picker/theme-picker.component.ts](../../../src/app/features/theme-picker/theme-picker.component.ts)
5. [src/app/features/modules/modules.component.ts](../../../src/app/features/modules/modules.component.ts)
6. [src/app/features/architecture/architecture.component.ts](../../../src/app/features/architecture/architecture.component.ts)
7. [src/app/shared/components/toast/toast.component.ts](../../../src/app/shared/components/toast/toast.component.ts)
8. [src/app/features/home/home.component.ts](../../../src/app/features/home/home.component.ts)
9. [src/app/features/contact/contact.component.ts](../../../src/app/features/contact/contact.component.ts)
10. [src/app/features/profile/profile.component.ts](../../../src/app/features/profile/profile.component.ts)
11. [src/app/shared/components/modal/modal.component.ts](../../../src/app/shared/components/modal/modal.component.ts)
12. [src/app/shared/components/input/input.component.ts](../../../src/app/shared/components/input/input.component.ts)
13. [src/app/shared/components/card/card.component.ts](../../../src/app/shared/components/card/card.component.ts)
14. [src/app/core/services/analytics/analytics.provider.ts](../../../src/app/core/services/analytics/analytics.provider.ts)
15. [src/app/core/services/analytics/analytics-router.provider.ts](../../../src/app/core/services/analytics/analytics-router.provider.ts)

### Files to Modify (Phase 3 - Optional)

1. [angular.json](../../../angular.json) - Bundle budgets and optimization config

---

**Total Estimated Time:**

- Phase 1: 2-3 hours
- Phase 2: 4-6 hours
- Phase 3: 1-2 hours
- Testing: 2-3 hours
- **Total: 9-14 hours**

**Total Estimated Savings: 405-735KB (40-60% bundle size reduction)**
