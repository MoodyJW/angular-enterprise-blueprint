import { Routes } from '@angular/router';

import { guestGuard } from '@core/auth';

/**
 * Auth feature routes.
 *
 * These routes are protected by the guestGuard to prevent
 * authenticated users from accessing login/register pages.
 */
export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
    title: 'Login | Enterprise Blueprint',
  },
];
