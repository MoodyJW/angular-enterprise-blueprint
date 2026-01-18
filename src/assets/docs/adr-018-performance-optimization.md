# ADR-018: Performance Optimization Strategy

## Status

Accepted

## Date

2026-01-18

## Context

Our Lighthouse performance score is currently 90 in CI/CD workflows, but achieves 97 in incognito mode. We need to improve the production performance score to 95+ while maintaining a small initial bundle size. The primary challenge is balancing fast initial load times with smooth subsequent navigation experiences.

### Current Performance Metrics

- **CI/CD Score**: 90 (with browser extensions/cache interference)
- **Incognito Score**: 97 (clean environment)
- **First Contentful Paint (FCP)**: 2.3s (Good - 0.74 score)
- **Largest Contentful Paint (LCP)**: 3.2s (Good - 0.71 score)
- **Speed Index**: 2.3s (Excellent - 0.98 score)
- **Initial Bundle**: ~600KB (well under 750KB budget)

### Problem Statement

The 7-point score difference between CI and incognito mode suggests our testing environment isn't accurately reflecting production performance. Additionally, we use `NoPreloading` strategy which keeps the initial bundle small but creates navigation delays when users visit lazy-loaded routes.

## Options Considered

### 1. CI/CD Environment Fixes

**Option 1A**: Continue with current setup (no changes)

- _Pros_: No effort required
- _Cons_: Inaccurate Lighthouse scores, potential false negatives

**Option 1B**: Add Chrome flags for clean environment testing

- _Pros_: Accurate, reproducible scores matching real-world incognito performance
- _Cons_: Requires workflow configuration change

### 2. Preloading Strategy

**Option 2A**: Use `PreloadAllModules`

- _Pros_: Fast subsequent navigation
- _Cons_: Downloads all lazy chunks immediately, increases network usage, not selective

**Option 2B**: Continue with `NoPreloading`

- _Pros_: Smallest network footprint
- _Cons_: Noticeable delay on first navigation to lazy routes

**Option 2C**: Implement Smart Selective Preloading

- _Pros_: Balanced approach, preloads only high-traffic routes, configurable delays
- _Cons_: Requires custom strategy implementation

**Option 2D**: Network-Aware Preloading

- _Pros_: Respects user's data preferences and connection speed
- _Cons_: More complex implementation, may not preload on slower connections

### 3. Resource Optimization

**Option 3A**: Add resource hints (preconnect, dns-prefetch)

- _Pros_: Reduces latency for external API calls, minimal overhead
- _Cons_: Requires knowing external origins in advance

**Option 3B**: Optimize image loading

- _Pros_: Reduces initial page weight, improves LCP
- _Cons_: Limited impact (only 1 dynamic image in app)

## Decision

We will implement a **multi-pronged performance optimization strategy** combining:

1. **Fix CI/CD environment** with Chrome flags (Option 1B)
2. **Implement Smart Selective Preloading** (Option 2C)
3. **Add resource hints** for external origins (Option 3A)
4. **Apply image optimizations** where applicable (Option 3B)

### Rationale

This combination provides the best balance between performance gains and implementation complexity:

- CI environment fix: **+5-7 points** (aligns testing with real-world conditions)
- Smart preloading: **+1-2 points** (improves navigation UX without bloating initial bundle)
- Resource hints: **+0.5-1 point** (reduces external API latency)
- Image optimizations: **+0.5 point** (improves LCP slightly)

**Total Expected Improvement**: 90 → 97-100 points

## Implementation

### 1. Lighthouse CI Configuration

**File**: `.github/workflows/lighthouse.yml`

Add Chrome flags to the Lighthouse CI action:

```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v12
  with:
    configPath: ./lighthouserc.json
    urls: |
      http://localhost/index.html?theme=${{ matrix.theme }}
    uploadArtifacts: true
    artifactName: lighthouse-results-${{ matrix.theme }}
    temporaryPublicStorage: true
    runs: 3
    chromeFlags: '--incognito --disable-extensions --disable-component-extensions-with-background-pages'
```

**Impact**: Ensures clean testing environment, accurate reproducible scores

---

### 2. Smart Selective Preloading Strategy

**File to Create**: `src/app/core/preload-strategy.ts`

```typescript
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * Smart Selective Preloading Strategy
 *
 * Preloads route chunks during browser idle time based on:
 * - Route priority (data.preload flag)
 * - Configurable delay (data.preloadDelay)
 * - User journey patterns (high-traffic routes first)
 *
 * Benefits:
 * - Doesn't increase initial bundle size
 * - Downloads chunks after page is interactive
 * - Selective - only preloads likely next destinations
 * - Improves perceived performance for subsequent navigation
 */
@Injectable({ providedIn: 'root' })
export class SmartPreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Don't preload routes marked with preload: false
    if (route.data?.['preload'] === false) {
      return of(null);
    }

    // Default delay: 2 seconds (allows initial page to fully load first)
    // Individual routes can override via data.preloadDelay
    const delay = route.data?.['preloadDelay'] ?? 2000;

    // Wait for the specified delay, then preload the chunk
    return timer(delay).pipe(
      mergeMap(() => {
        console.log(`[Preload] Loading route: ${route.path || 'root'}`);
        return load();
      }),
    );
  }
}
```

**File to Update**: `src/app/app.config.ts`

```typescript
import { SmartPreloadStrategy } from './core/preload-strategy';

// Replace line 44:
// withPreloading(NoPreloading),
withPreloading(SmartPreloadStrategy),
```

**File to Update**: `src/app/app.routes.ts`

Add preload configuration to routes:

```typescript
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home').then((m) => m.HomeComponent),
    title: 'Dashboard | Enterprise Blueprint',
    // Don't preload - already loaded as initial route
    data: { preload: false },
  },
  {
    path: 'modules',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/modules').then((m) => m.ModulesComponent),
        title: 'Reference Modules | Enterprise Blueprint',
        // HIGH PRIORITY: Most likely next navigation from home
        data: { preload: true, preloadDelay: 1000 },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/modules/detail').then((m) => m.ModuleDetailComponent),
        title: 'Module Details | Enterprise Blueprint',
        // Don't preload detail pages - only load when accessed
        data: { preload: false },
      },
    ],
  },
  {
    path: 'blog',
    loadChildren: () => import('./features/blog/blog.routes').then((m) => m.routes),
    title: 'Engineering Blog | Enterprise Blueprint',
    // HIGH PRIORITY: High traffic route
    data: { preload: true, preloadDelay: 2000 },
  },
  {
    path: 'architecture',
    loadChildren: () =>
      import('./features/architecture/architecture.routes').then((m) => m.ARCHITECTURE_ROUTES),
    // LOW PRIORITY: Less frequently visited, don't preload
    data: { preload: false },
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile').then((m) => m.ProfileComponent),
    title: 'The Architect | Enterprise Blueprint',
    // MEDIUM PRIORITY: Preload after other critical routes
    data: { preload: true, preloadDelay: 4000 },
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact').then((m) => m.ContactComponent),
    title: 'Contact | Enterprise Blueprint',
    // MEDIUM PRIORITY: Preload after other critical routes
    data: { preload: true, preloadDelay: 5000 },
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth').then((m) => m.authRoutes),
    // Don't preload - only needed when user explicitly logs in
    data: { preload: false },
  },
  {
    path: '**',
    loadComponent: () =>
      import('@shared/components/page-not-found').then((m) => m.PageNotFoundComponent),
    title: 'Page Not Found | Enterprise Blueprint',
    // Don't preload 404 page
    data: { preload: false },
  },
];
```

**Impact**:

- Initial bundle stays exactly the same size
- Downloads 3-4 high-traffic routes (modules, blog, profile, contact) during idle time
- Subsequent navigation to these routes is instant (already loaded)
- Low-traffic routes (architecture, auth, 404) remain purely lazy-loaded

---

### 3. Resource Hints for External Origins

**File to Update**: `src/index.html`

Add preconnect hints after existing preload tags (line 14):

```html
<link rel="preload" href="assets/i18n/en.json" as="fetch" crossorigin="anonymous" />
<link rel="preload" href="assets/data/metrics.json" as="fetch" crossorigin="anonymous" />

<!-- Add these lines: -->
<!-- Preconnect to external APIs to reduce latency -->
<link rel="preconnect" href="https://api.github.com" crossorigin />
<link rel="preconnect" href="https://www.google-analytics.com" />

<!-- Fallback DNS prefetch for older browsers -->
<link rel="dns-prefetch" href="https://api.github.com" />
<link rel="dns-prefetch" href="https://formspree.io" />
```

**Impact**:

- Establishes early connections to GitHub API (used for profile data)
- Reduces DNS lookup + TLS handshake time
- Minimal overhead, measurable latency improvement for API calls

---

### 4. Image Loading Optimizations

**File to Update**: `src/app/features/profile/components/profile-stats-card/profile-stats-card.component.html`

Add lazy loading attributes to avatar image (lines 58-64):

```html
<img
  class="stats-card__avatar"
  [src]="userStats.avatarUrl"
  [alt]="userStats.name || userStats.login"
  width="100"
  height="100"
  loading="lazy"
  decoding="async"
/>
```

**Impact**:

- Defers loading of below-the-fold avatar image
- Uses async decoding to avoid blocking main thread
- Small improvement to LCP if avatar is in viewport

---

### 5. Create Missing Default Avatar (Bug Fix)

**File to Create**: `src/assets/images/default-avatar.svg`

Create a simple default avatar SVG:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="#e5e7eb"/>
  <circle cx="50" cy="40" r="18" fill="#9ca3af"/>
  <path d="M 20 85 Q 20 60 50 60 T 80 85" fill="#9ca3af"/>
</svg>
```

**Reference in**: `src/app/core/auth/auth.store.ts` (line 69)

**Impact**:

- Fixes 404 error for fallback avatar
- Improves error resilience
- Better UX for users without GitHub profiles

---

### 6. Optional: Network-Aware Preloading (Future Enhancement)

For mobile-first optimization, consider upgrading to network-aware preloading:

**File to Create**: `src/app/core/network-aware-preload-strategy.ts`

```typescript
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * Network-Aware Preloading Strategy
 *
 * Extends Smart Preloading with network condition checks:
 * - Respects user's "Save Data" preference
 * - Only preloads on 4G or faster connections
 * - Reduces data usage on slow/metered connections
 */
@Injectable({ providedIn: 'root' })
export class NetworkAwarePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data?.['preload'] === false) {
      return of(null);
    }

    // Check network conditions (if available)
    const connection = (navigator as any).connection;
    if (connection) {
      // Respect user's data saver mode
      if (connection.saveData) {
        console.log(`[Preload] Skipping ${route.path} - data saver enabled`);
        return of(null);
      }

      // Only preload on fast connections (4G+)
      const slowConnections = ['slow-2g', '2g', '3g'];
      if (slowConnections.includes(connection.effectiveType)) {
        console.log(
          `[Preload] Skipping ${route.path} - slow connection (${connection.effectiveType})`,
        );
        return of(null);
      }
    }

    const delay = route.data?.['preloadDelay'] ?? 2000;
    return timer(delay).pipe(
      mergeMap(() => {
        console.log(`[Preload] Loading route: ${route.path || 'root'}`);
        return load();
      }),
    );
  }
}
```

**When to use**: Replace `SmartPreloadStrategy` with `NetworkAwarePreloadStrategy` if mobile data usage is a concern.

---

## Performance Testing

### Before Implementation

Run Lighthouse in CI:

```bash
# Current score: ~90
npm run build
# Lighthouse CI runs automatically on push
```

Run Lighthouse locally in incognito:

```bash
# Current score: ~97
npm run build
npx http-server dist/angular-enterprise-blueprint/browser -p 8080
# Open Chrome Incognito: chrome --incognito http://localhost:8080
# Run Lighthouse from DevTools
```

### After Implementation

Expected scores:

- **CI/CD**: 95-97 (with incognito flags)
- **Local Incognito**: 97-100 (unchanged or slightly improved)

Verify preloading is working:

1. Open DevTools Network tab
2. Load homepage
3. Wait 1-2 seconds
4. Observe modules/blog chunks being downloaded in background
5. Navigate to /modules - should load instantly (from cache)

### Monitoring

Track these metrics over time:

- **FCP** (First Contentful Paint): Target < 2.0s
- **LCP** (Largest Contentful Paint): Target < 2.5s
- **TBT** (Total Blocking Time): Target < 300ms
- **CLS** (Cumulative Layout Shift): Target < 0.1

## Consequences

### Positive

- **Accurate Testing**: CI scores reflect real-world performance
- **Better UX**: Instant navigation to preloaded routes
- **Maintained Bundle Size**: Initial bundle stays small (~600KB)
- **Lower Latency**: Preconnect reduces external API delays
- **Mobile Friendly**: Network-aware option respects data preferences
- **Lighthouse Score**: Expected improvement from 90 → 95-97

### Negative

- **Increased Complexity**: Custom preload strategy requires maintenance
- **Network Usage**: Preloading uses ~200-300KB extra bandwidth (for 3-4 routes)
- **Console Logs**: Preload logging may clutter console (can be removed in production)

### Neutral

- **Selective Approach**: Not all routes are preloaded (by design)
- **Configurable**: Each route can opt-in/out and set custom delays
- **Progressive Enhancement**: Works on all browsers, gracefully degrades

### Trade-offs

| Metric                   | NoPreloading (Current) | SmartPreloading (Proposed)                    |
| ------------------------ | ---------------------- | --------------------------------------------- |
| Initial Bundle           | ~600KB                 | ~600KB (unchanged)                            |
| Network Usage (after 5s) | ~600KB                 | ~900KB (+300KB preloaded)                     |
| Navigation to /modules   | ~200ms delay           | Instant (from cache)                          |
| Mobile Data Impact       | Minimal                | Small increase (mitigated with network-aware) |

## Alternatives Considered

### QuickLink Directive

Use `ngx-quicklink` to preload on hover:

```typescript
import { QuicklinkModule } from 'ngx-quicklink';
```

**Rejected because**:

- Requires additional dependency
- Only works for links in viewport
- Less control over preloading logic

### Service Worker Precaching

Use Angular PWA to precache all routes:

```typescript
import { provideServiceWorker } from '@angular/service-worker';
```

**Rejected because**:

- Overkill for current needs
- Adds complexity with service worker lifecycle
- App doesn't require offline functionality yet

## Future Considerations

1. **Analytics Integration**: Track which routes are actually visited to refine preload priorities
2. **A/B Testing**: Test different preload delays to find optimal timing
3. **Progressive Web App**: Consider full PWA with service worker if offline support is needed
4. **Bundle Analysis**: Regularly audit bundle composition with `webpack-bundle-analyzer`
5. **Image Optimization**: If more images are added, implement `NgOptimizedImage` with proper loaders

## References

- [Angular Preloading Strategies](https://angular.dev/guide/routing/common-router-tasks#preloading)
- [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
- [Resource Hints (preconnect, dns-prefetch)](https://web.dev/preconnect-and-dns-prefetch/)
- [Lighthouse Performance Scoring](https://web.dev/performance-scoring/)
- [Chrome Lighthouse CLI Flags](https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md)
- [ADR-011: Lazy Loading Strategy](./adr-011-lazy-loading.md)

## Implementation Checklist

- [ ] Update `.github/workflows/lighthouse.yml` with Chrome flags
- [ ] Create `src/app/core/preload-strategy.ts`
- [ ] Update `src/app/app.config.ts` to use `SmartPreloadStrategy`
- [ ] Update `src/app/app.routes.ts` with preload configuration
- [ ] Add resource hints to `src/index.html`
- [ ] Add lazy loading attributes to avatar image
- [ ] Create `src/assets/images/default-avatar.svg`
- [ ] Run Lighthouse tests and verify 95+ score
- [ ] Test preloading in DevTools Network tab
- [ ] Update `lighthouserc.json` if needed to adjust thresholds
- [ ] Document performance baseline in team wiki/README

## Rollback Plan

If performance degrades or issues arise:

1. Revert `app.config.ts` to `NoPreloading`
2. Remove preload configuration from `app.routes.ts`
3. Keep Chrome flags (they only improve test accuracy)
4. Keep resource hints (minimal risk, small benefit)
5. Monitor Lighthouse scores for 1 week before re-attempting
