/**
 * Authentication type definitions.
 *
 * These types define the structure for user authentication,
 * credentials, and authentication state throughout the application.
 */

/**
 * User roles for authorization.
 */
export type UserRole = 'admin' | 'user';

/**
 * Authenticated user information.
 */
export interface User {
  /** Unique user identifier */
  readonly id: string;
  /** Username for display and login */
  readonly username: string;
  /** User email address */
  readonly email: string;
  /** Optional avatar URL */
  readonly avatarUrl?: string;
  /** User roles for authorization */
  readonly roles: readonly UserRole[];
}

/**
 * Login credentials.
 */
export interface LoginCredentials {
  readonly username: string;
  readonly password: string;
}

/**
 * Authentication state for the store.
 */
export interface AuthState {
  /** Currently authenticated user, or null if not authenticated */
  readonly user: User | null;
  /** Whether the user is currently authenticated */
  readonly isAuthenticated: boolean;
  /** Whether an authentication operation is in progress */
  readonly isLoading: boolean;
  /** Error message from the last failed operation */
  readonly error: string | null;
}

/**
 * Initial authentication state.
 */
export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Authentication error codes.
 */
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

/**
 * Authentication error with code.
 */
export interface AuthError {
  readonly code: AuthErrorCode;
  readonly message: string;
}
