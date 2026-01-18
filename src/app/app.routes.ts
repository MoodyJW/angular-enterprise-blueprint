import { Routes } from '@angular/router';

/**
 * Application routes configuration.
 *
 * Uses lazy loading for all feature modules to optimize bundle size.
 * Routes are ordered by specificity, with wildcard fallback at the end.
 *
 * Smart Preloading:
 * - Routes marked with `data: { preload: true }` are downloaded during idle time
 * - `preloadDelay` determines when to start downloading (milliseconds after page load)
 * - High-traffic routes have shorter delays, low-traffic routes aren't preloaded
 */
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
