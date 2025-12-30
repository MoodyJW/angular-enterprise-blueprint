import { inject, Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';

import type { AuthStrategy } from '@core/auth';
import { AUTH_ERROR_CODES, type AuthError, type LoginCredentials, type User } from '@core/auth';
import { ENVIRONMENT } from '@core/config';
import { LoggerService } from '@core/services/logger';
import { SecureStorageService } from '@core/services/storage/secure-storage.service';

/**
 * Storage key for the mock auth token.
 */
const MOCK_TOKEN_KEY = 'mock-auth-token';

/**
 * Storage key for the mock user data.
 */
const MOCK_USER_KEY = 'mock-auth-user';

/**
 * Simulated network delay in milliseconds.
 */
const MOCK_DELAY_MS = 800;

/**
 * Probability of simulating a random server error (0-1).
 * Set to 0.1 (10%) to occasionally test error handling.
 */
const RANDOM_ERROR_PROBABILITY = 0.1;

/**
 * Mock user for demo authentication.
 */
const DEMO_USER: User = {
  id: 'user-001',
  username: 'demo',
  email: 'demo@example.com',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  roles: ['user'],
};

/**
 * Admin user for demo authentication.
 */
const ADMIN_USER: User = {
  id: 'admin-001',
  username: 'admin',
  email: 'admin@example.com',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  roles: ['admin', 'user'],
};

/**
 * Mock authentication strategy for development and demos.
 *
 * This strategy simulates authentication without a real backend:
 * - Uses localStorage for session persistence
 * - Simulates network latency with configurable delays
 * - Occasionally throws random errors (10% chance) to test error handling
 * - Accepts 'demo' or 'admin' as valid usernames (any password)
 *
 * @example
 * ```typescript
 * // Valid credentials
 * { username: 'demo', password: 'any' }  // Returns regular user
 * { username: 'admin', password: 'any' } // Returns admin user
 *
 * // Invalid credentials
 * { username: 'other', password: 'any' } // Throws INVALID_CREDENTIALS error
 * ```
 */
@Injectable()
export class MockAuthStrategy implements AuthStrategy {
  readonly name = 'MockAuthStrategy';

  private readonly secureStorage = inject(SecureStorageService);
  private readonly logger = inject(LoggerService);
  private readonly env = inject(ENVIRONMENT);

  /**
   * Authenticate with mock credentials.
   *
   * Valid usernames: 'demo' (user role) or 'admin' (admin role)
   * Any password is accepted for valid usernames.
   *
   * @param credentials - Login credentials
   * @returns Observable<User> on success
   * @throws AuthError on invalid credentials or simulated error
   */
  login(credentials: LoginCredentials): Observable<User> {
    this.logger.info('[MockAuth] Login attempt', { username: credentials.username });

    // Simulate random server errors (only in non-production for testing)
    if (!this.env.production && this.shouldSimulateError()) {
      this.logger.warn('[MockAuth] Simulating random server error');
      return this.simulateError({
        code: AUTH_ERROR_CODES.NETWORK_ERROR,
        message: 'Simulated server error for testing',
      });
    }

    // Check for valid demo credentials
    const user = this.validateCredentials(credentials);
    if (user === null) {
      this.logger.warn('[MockAuth] Invalid credentials', { username: credentials.username });
      return this.simulateError({
        code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Invalid username or password',
      });
    }

    // Store session in secure storage (sessionStorage)
    this.storeSession(user);

    this.logger.info('[MockAuth] Login successful', { userId: user.id, username: user.username });
    return of(user).pipe(delay(MOCK_DELAY_MS));
  }

  /**
   * Log out the current user.
   *
   * Clears the session from storage.
   */
  logout(): Observable<void> {
    this.logger.info('[MockAuth] Logout');
    this.clearSession();
    return of(undefined).pipe(delay(MOCK_DELAY_MS / 2));
  }

  /**
   * Check for an existing valid session.
   *
   * Looks for a stored session in secure storage and validates it.
   *
   * @returns Observable<User | null> - The user if session exists, null otherwise
   */
  checkSession(): Observable<User | null> {
    this.logger.info('[MockAuth] Checking session');

    const storedUser = this.getStoredUser();
    const storedToken = this.getStoredToken();

    if (storedUser !== null && storedToken !== null) {
      this.logger.info('[MockAuth] Session restored', { userId: storedUser.id });
      return of(storedUser).pipe(delay(MOCK_DELAY_MS / 2));
    }

    this.logger.info('[MockAuth] No valid session found');
    return of(null).pipe(delay(MOCK_DELAY_MS / 2));
  }

  /**
   * Validate credentials and return the matching user.
   */
  private validateCredentials(credentials: LoginCredentials): User | null {
    const username = credentials.username.toLowerCase().trim();

    if (username === 'demo') {
      return DEMO_USER;
    }

    if (username === 'admin') {
      return ADMIN_USER;
    }

    return null;
  }

  /**
   * Store session data in secure storage.
   */
  private storeSession(user: User): void {
    const token = this.generateMockToken(user);
    this.secureStorage.setItem(MOCK_TOKEN_KEY, token);
    this.secureStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear session data from secure storage.
   */
  private clearSession(): void {
    this.secureStorage.removeItem(MOCK_TOKEN_KEY);
    this.secureStorage.removeItem(MOCK_USER_KEY);
  }

  /**
   * Get stored user from secure storage.
   */
  private getStoredUser(): User | null {
    const userJson = this.secureStorage.getItem(MOCK_USER_KEY);
    if (userJson === null) {
      return null;
    }

    try {
      return JSON.parse(userJson) as User;
    } catch {
      this.logger.warn('[MockAuth] Failed to parse stored user');
      this.clearSession();
      return null;
    }
  }

  /**
   * Get stored token from secure storage.
   */
  private getStoredToken(): string | null {
    return this.secureStorage.getItem(MOCK_TOKEN_KEY);
  }

  /**
   * Generate a mock JWT-like token.
   */
  private generateMockToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: user.id,
        username: user.username,
        roles: user.roles,
        iat: Date.now(),
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }),
    );
    const signature = btoa('mock-signature');

    return `${header}.${payload}.${signature}`;
  }

  /**
   * Determine if we should simulate a random error.
   */
  private shouldSimulateError(): boolean {
    return Math.random() < RANDOM_ERROR_PROBABILITY;
  }

  /**
   * Simulate an error with delay.
   */
  private simulateError<T>(error: AuthError): Observable<T> {
    return throwError(() => error).pipe(delay(MOCK_DELAY_MS));
  }
}
