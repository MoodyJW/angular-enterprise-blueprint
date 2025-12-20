import {
  type EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';

import { AUTH_STRATEGY } from './auth-strategy.interface';
import { AuthStore } from './auth.store';
import { MockAuthStrategy } from './strategies';

/**
 * Provide authentication services for the application.
 *
 * This provider:
 * - Registers the authentication strategy (MockAuthStrategy by default)
 * - Initializes the AuthStore
 * - Checks for existing sessions on app startup
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideAuth(),
 *     // ...
 *   ],
 * };
 * ```
 */
export function provideAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Provide the auth strategy
    { provide: AUTH_STRATEGY, useClass: MockAuthStrategy },

    // Initialize auth on app startup
    provideAppInitializer(() => {
      const authStore = inject(AuthStore);
      // Check for existing session (rxMethod requires an argument)
      authStore.checkSession(undefined);
    }),
  ]);
}
