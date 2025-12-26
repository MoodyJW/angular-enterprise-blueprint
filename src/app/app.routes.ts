import { Routes } from '@angular/router';

/**
 * Application routes configuration.
 *
 * Uses lazy loading for all feature modules to optimize bundle size.
 * Routes are ordered by specificity, with wildcard fallback at the end.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home').then((m) => m.HomeComponent),
    title: 'Dashboard | Enterprise Blueprint',
  },
  {
    path: 'modules',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/modules').then((m) => m.ModulesComponent),
        title: 'Reference Modules | Enterprise Blueprint',
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/modules/detail').then((m) => m.ModuleDetailComponent),
        title: 'Module Details | Enterprise Blueprint',
      },
    ],
  },
  {
    path: 'architecture',
    loadComponent: () => import('./features/architecture').then((m) => m.ArchitectureComponent),
    title: 'Architecture Decisions | Enterprise Blueprint',
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile').then((m) => m.ProfileComponent),
    title: 'The Architect | Enterprise Blueprint',
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact').then((m) => m.ContactComponent),
    title: 'Contact | Enterprise Blueprint',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth').then((m) => m.authRoutes),
  },
  {
    path: '**',
    loadComponent: () =>
      import('@shared/components/page-not-found').then((m) => m.PageNotFoundComponent),
    title: 'Page Not Found | Enterprise Blueprint',
  },
];
