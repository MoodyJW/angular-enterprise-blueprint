import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import type { LoginCredentials, User } from './auth.types';

/**
 * Authentication strategy interface.
 *
 * Defines the contract for authentication providers, allowing
 * the application to swap between different authentication
 * implementations (e.g., mock, OAuth, JWT).
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * { provide: AUTH_STRATEGY, useClass: MockAuthStrategy }
 *
 * // Or for production
 * { provide: AUTH_STRATEGY, useClass: JwtAuthStrategy }
 * ```
 */
export interface AuthStrategy {
  /**
   * Unique name for this strategy (for debugging/logging).
   */
  readonly name: string;

  /**
   * Authenticate a user with credentials.
   *
   * @param credentials - The login credentials
   * @returns Observable that emits the authenticated user on success
   * @throws AuthError on failure (invalid credentials, network error, etc.)
   */
  login(credentials: LoginCredentials): Observable<User>;

  /**
   * Log out the current user.
   *
   * @returns Observable that completes when logout is finished
   */
  logout(): Observable<void>;

  /**
   * Check if there is an existing valid session.
   *
   * This is typically called on app initialization to restore
   * a previous session from localStorage/cookies.
   *
   * @returns Observable that emits the user if session is valid, null otherwise
   */
  checkSession(): Observable<User | null>;
}

/**
 * Injection token for the authentication strategy.
 *
 * @example
 * ```typescript
 * // Inject in a service
 * private readonly authStrategy = inject(AUTH_STRATEGY);
 *
 * // Provide in app.config.ts
 * { provide: AUTH_STRATEGY, useClass: MockAuthStrategy }
 * ```
 */
export const AUTH_STRATEGY = new InjectionToken<AuthStrategy>('AUTH_STRATEGY');
