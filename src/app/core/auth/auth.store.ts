import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';

import { LoggerService } from '../services/logger';
import { AUTH_STRATEGY } from './auth-strategy.interface';
import {
  AUTH_ERROR_CODES,
  initialAuthState,
  type AuthError,
  type AuthState,
  type LoginCredentials,
  type User,
} from './auth.types';

/**
 * Authentication store using NgRx SignalStore.
 *
 * Manages authentication state including:
 * - Current user information
 * - Authentication status
 * - Loading states
 * - Error handling
 *
 * @example
 * ```typescript
 * // Inject the store
 * private readonly authStore = inject(AuthStore);
 *
 * // Access state
 * const user = this.authStore.user();
 * const isAuthenticated = this.authStore.isAuthenticated();
 *
 * // Perform actions
 * this.authStore.login({ username: 'demo', password: 'password' });
 * this.authStore.logout();
 * ```
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },

  // Initial state
  withState<AuthState>(initialAuthState),

  // Computed signals
  withComputed((store) => ({
    /**
     * Get the user's display name.
     */
    displayName: computed(() => store.user()?.username ?? 'Guest'),

    /**
     * Check if the user has admin role.
     */
    isAdmin: computed(() => store.user()?.roles.includes('admin') ?? false),

    /**
     * Check if the user has a specific role.
     */
    hasRole: computed(
      () => (role: 'admin' | 'user') => store.user()?.roles.includes(role) ?? false,
    ),

    /**
     * Get user avatar URL with fallback.
     */
    avatarUrl: computed(() => store.user()?.avatarUrl ?? 'assets/images/default-avatar.svg'),
  })),

  // Methods
  withMethods((store) => {
    const authStrategy = inject(AUTH_STRATEGY);
    const router = inject(Router);
    const logger = inject(LoggerService);

    return {
      /**
       * Login with credentials.
       *
       * Uses rxMethod for proper RxJS integration with SignalStore.
       */
      login: rxMethod<LoginCredentials>(
        pipe(
          tap(() => {
            patchState(store, { isLoading: true, error: null });
          }),
          switchMap((credentials) =>
            authStrategy.login(credentials).pipe(
              tap((user) => {
                logger.info('[AuthStore] Login successful', { userId: user.id });
                patchState(store, {
                  user,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                });
              }),
              catchError((error: AuthError) => {
                logger.error('[AuthStore] Login failed', { error: error.message });
                patchState(store, {
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                  error: error.message,
                });
                return of(null);
              }),
            ),
          ),
        ),
      ),

      /**
       * Logout the current user.
       */
      logout: rxMethod<undefined>(
        pipe(
          tap(() => {
            patchState(store, { isLoading: true });
          }),
          switchMap(() =>
            authStrategy.logout().pipe(
              tap(() => {
                logger.info('[AuthStore] Logout successful');
                patchState(store, {
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                  error: null,
                });
                void router.navigate(['/auth/login']);
              }),
              catchError((error: AuthError) => {
                logger.error('[AuthStore] Logout failed', { error: error.message });
                // Still clear state on logout failure
                patchState(store, {
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                  error: null,
                });
                void router.navigate(['/auth/login']);
                return of(undefined);
              }),
            ),
          ),
        ),
      ),

      /**
       * Check and restore existing session.
       *
       * Called on app initialization to restore previous session.
       */
      checkSession: rxMethod<undefined>(
        pipe(
          tap(() => {
            patchState(store, { isLoading: true });
          }),
          switchMap(() =>
            authStrategy.checkSession().pipe(
              tap((user) => {
                if (user !== null) {
                  logger.info('[AuthStore] Session restored', { userId: user.id });
                  patchState(store, {
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                  });
                } else {
                  logger.info('[AuthStore] No session found');
                  patchState(store, {
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                  });
                }
              }),
              catchError((error: AuthError) => {
                logger.warn('[AuthStore] Session check failed', { error: error.message });
                patchState(store, {
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                  error: null,
                });
                return of(null);
              }),
            ),
          ),
        ),
      ),

      /**
       * Clear any error state.
       */
      clearError(): void {
        patchState(store, { error: null });
      },

      /**
       * Set an error message (for external error handling).
       */
      setError(message: string): void {
        patchState(store, { error: message });
      },

      /**
       * Manually set user (for testing or special cases).
       */
      setUser(user: User | null): void {
        patchState(store, {
          user,
          isAuthenticated: user !== null,
        });
      },

      /**
       * Handle session expiration (called by HTTP interceptor on 401).
       */
      handleSessionExpired(): void {
        logger.warn('[AuthStore] Session expired');
        patchState(store, {
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: AUTH_ERROR_CODES.SESSION_EXPIRED,
        });
        void router.navigate(['/auth/login']);
      },
    };
  }),
);

/**
 * Type helper for the AuthStore.
 */
export type AuthStoreType = InstanceType<typeof AuthStore>;
