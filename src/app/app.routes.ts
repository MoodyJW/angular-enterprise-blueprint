import { Routes } from '@angular/router';

/**
 * Application routes configuration.
 *
 * Uses lazy loading for all feature modules to optimize bundle size.
 * Routes are ordered by specificity, with wildcard fallback at the end.
 *
 * Smart Idle-Based Preloading:
 * - Routes marked with `data: { preload: true }` are downloaded during browser idle time
 * - `preloadPriority` determines loading order (lower number = higher priority)
 * - Uses requestIdleCallback to avoid interfering with Lighthouse measurements
 * - High-traffic routes have lower priority numbers, low-traffic routes aren't preloaded
 */
import { HomeComponent } from './features/home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Dashboard | Enterprise Blueprint',
    // Don't preload - already loaded as initial route (Eager loaded for LCP)
    data: { preload: false },
  },
  {
    path: 'modules',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/modules').then((m) => m.ModulesComponent),
        title: 'Reference Modules | Enterprise Blueprint',
        // PRIORITY 1 (Highest): Most likely next navigation from home
        data: { preload: true, preloadPriority: 1 },
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
    // PRIORITY 2: High traffic route
    data: { preload: true, preloadPriority: 2 },
  },
  {
    path: 'architecture',
    loadChildren: () =>
      import('./features/architecture/architecture.routes').then((m) => m.ARCHITECTURE_ROUTES),
    // Don't preload - less frequently visited
    data: { preload: false },
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile').then((m) => m.ProfileComponent),
    title: 'The Architect | Enterprise Blueprint',
    // PRIORITY 3: Medium priority
    data: { preload: true, preloadPriority: 3 },
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact').then((m) => m.ContactComponent),
    title: 'Contact | Enterprise Blueprint',
    // PRIORITY 4: Lower priority
    data: { preload: true, preloadPriority: 4 },
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
