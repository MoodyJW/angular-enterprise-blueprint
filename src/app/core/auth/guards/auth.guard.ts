import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '@core/auth';

/**
 * Route guard that requires authentication.
 *
 * Redirects unauthenticated users to the login page.
 * Use this guard to protect routes that require a logged-in user.
 *
 * @example
 * ```typescript
 * // In app.routes.ts
 * {
 *   path: 'dashboard',
 *   component: DashboardComponent,
 *   canActivate: [authGuard],
 * }
 * ```
 */
export const authGuard: CanActivateFn = (_route, _state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  // Redirect to login page
  return router.createUrlTree(['/auth/login']);
};

/**
 * Route guard that requires admin role.
 *
 * Redirects non-admin users to the forbidden page.
 * Use this guard to protect admin-only routes.
 *
 * @example
 * ```typescript
 * // In app.routes.ts
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canActivate: [authGuard, adminGuard],
 * }
 * ```
 */
export const adminGuard: CanActivateFn = (_route, _state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAdmin()) {
    return true;
  }

  // Redirect to forbidden page
  return router.createUrlTree(['/forbidden']);
};
