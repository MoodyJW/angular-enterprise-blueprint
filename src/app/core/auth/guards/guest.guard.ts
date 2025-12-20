import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '../auth.store';

/**
 * Route guard for guest-only pages.
 *
 * Redirects authenticated users away from guest-only pages (like login).
 * Use this guard on login/register pages to prevent logged-in users
 * from seeing them.
 *
 * @example
 * ```typescript
 * // In app.routes.ts
 * {
 *   path: 'auth/login',
 *   component: LoginComponent,
 *   canActivate: [guestGuard],
 * }
 * ```
 */
export const guestGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    return true;
  }

  // Redirect authenticated users to home/dashboard
  return router.createUrlTree(['/']);
};
