/**
 * Error type definitions for the error handling system.
 *
 * These types provide a consistent structure for error handling
 * across the application.
 */

/**
 * Application error severity levels.
 */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Structured application error with metadata.
 */
export interface AppError {
  /** Human-readable error message */
  readonly message: string;
  /** Error code or name for categorization */
  readonly code?: string;
  /** Severity level of the error */
  readonly severity: ErrorSeverity;
  /** Timestamp when the error occurred */
  readonly timestamp: Date;
  /** Additional context for debugging */
  readonly context?: Record<string, unknown>;
  /** Original error object if available */
  readonly originalError?: Error;
}

/**
 * HTTP error details extracted from HttpErrorResponse.
 */
export interface HttpErrorDetails {
  /** HTTP status code */
  readonly status: number;
  /** HTTP status text */
  readonly statusText: string;
  /** Request URL that failed */
  readonly url: string | null;
  /** Error message from the response */
  readonly message: string;
  /** Server-provided error message if available */
  readonly serverMessage?: string;
}

/**
 * User-friendly error messages for common HTTP status codes.
 */
export const HTTP_ERROR_MESSAGES: Readonly<Record<number, string>> = {
  0: 'Unable to connect to server. Please check your internet connection.',
  400: 'Invalid request. Please check your input.',
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to access this resource.',
  404: 'The requested resource was not found.',
  408: 'The request timed out. Please try again.',
  429: 'Too many requests. Please try again later.',
  500: 'A server error occurred. Our team has been notified.',
  502: 'The server is temporarily unavailable. Please try again later.',
  503: 'The service is temporarily unavailable. Please try again later.',
  504: 'The server took too long to respond. Please try again.',
};
