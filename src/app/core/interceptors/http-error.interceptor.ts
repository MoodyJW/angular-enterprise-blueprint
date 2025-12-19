import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import {
  ErrorNotificationService,
  HTTP_ERROR_MESSAGES,
  type HttpErrorDetails,
} from '../error-handling';
import { LoggerService } from '../services/logger';

/**
 * HTTP error interceptor that transforms HTTP errors into user-friendly messages.
 *
 * This interceptor:
 * - Catches all HTTP errors
 * - Logs errors via LoggerService
 * - Shows appropriate user notifications
 * - Handles authentication errors (401) with redirect
 * - Handles authorization errors (403) with redirect
 *
 * Register in app.config.ts:
 * ```typescript
 * provideHttpClient(withInterceptors([httpErrorInterceptor]))
 * ```
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const errorNotification = inject(ErrorNotificationService);
  const router = inject(Router);
  // TODO: Uncomment when AuthStore is implemented in section 2.4
  // const authStore = inject(AuthStore);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorDetails = extractErrorDetails(error);

      // Log the error for debugging
      logger.error(`[HTTP Error] ${String(error.status)}`, {
        url: error.url,
        message: errorDetails.message,
        serverMessage: errorDetails.serverMessage,
      });

      // Handle specific status codes
      handleHttpError(error, errorDetails, errorNotification, router);

      // Re-throw the error so calling code can handle it if needed
      return throwError(() => error);
    }),
  );
};

/**
 * Handle HTTP errors based on status code.
 */
function handleHttpError(
  error: HttpErrorResponse,
  errorDetails: HttpErrorDetails,
  errorNotification: ErrorNotificationService,
  router: Router,
): void {
  switch (error.status) {
    case 0:
      // Network error - no response received
      errorNotification.notifyError(HTTP_ERROR_MESSAGES[0]);
      break;

    case 400:
      // Bad request - show server message if available
      errorNotification.notifyError(errorDetails.serverMessage ?? HTTP_ERROR_MESSAGES[400]);
      break;

    case 401:
      // Unauthorized - session expired or invalid credentials
      // TODO: Trigger logout when AuthStore is implemented
      // authStore.logout();
      errorNotification.notifyWarning(HTTP_ERROR_MESSAGES[401]);
      void router.navigate(['/auth/login']);
      break;

    case 403:
      // Forbidden - user doesn't have permission
      errorNotification.notifyError(HTTP_ERROR_MESSAGES[403]);
      void router.navigate(['/forbidden']);
      break;

    case 404:
      // Not found - resource doesn't exist
      // Note: We don't always want to show 404 errors to users
      // as it might be an expected case (e.g., checking if resource exists)
      errorNotification.notifyError(HTTP_ERROR_MESSAGES[404]);
      break;

    case 408:
      // Request timeout
      errorNotification.notifyWarning(HTTP_ERROR_MESSAGES[408]);
      break;

    case 429: {
      // Rate limited - too many requests
      const retryAfter = error.headers.get('Retry-After');
      const message =
        retryAfter !== null
          ? `Too many requests. Please wait ${retryAfter} seconds.`
          : HTTP_ERROR_MESSAGES[429];
      errorNotification.notifyWarning(message);
      break;
    }

    default:
      // Handle 5xx server errors
      if (error.status >= 500 && error.status < 600) {
        const message = HTTP_ERROR_MESSAGES[error.status] ?? HTTP_ERROR_MESSAGES[500];
        errorNotification.notifyError(message);
      } else if (error.status >= 400) {
        // Other 4xx client errors
        errorNotification.notifyError(errorDetails.serverMessage ?? errorDetails.message);
      }
      break;
  }
}

/**
 * Extract error details from an HttpErrorResponse.
 *
 * Attempts to parse the error body to find a server-provided message
 * from common API response formats.
 */
function extractErrorDetails(error: HttpErrorResponse): HttpErrorDetails {
  let serverMessage: string | undefined;

  // Try to extract message from common API response formats
  const errorBody = error.error as unknown;

  if (errorBody !== null && errorBody !== undefined) {
    if (typeof errorBody === 'string') {
      // Plain text error response
      serverMessage = errorBody;
    } else if (typeof errorBody === 'object') {
      // JSON error response - check common patterns
      const errorObj = errorBody as Record<string, unknown>;

      if (typeof errorObj['message'] === 'string') {
        // { message: "Error message" }
        serverMessage = errorObj['message'];
      } else if (typeof errorObj['error'] === 'string') {
        // { error: "Error message" }
        serverMessage = errorObj['error'];
      } else if (
        typeof errorObj['error'] === 'object' &&
        errorObj['error'] !== null &&
        typeof (errorObj['error'] as Record<string, unknown>)['message'] === 'string'
      ) {
        // { error: { message: "Error message" } }
        serverMessage = (errorObj['error'] as Record<string, unknown>)['message'] as string;
      } else if (Array.isArray(errorObj['errors']) && errorObj['errors'].length > 0) {
        // { errors: ["Error 1", "Error 2"] } or { errors: [{ message: "Error" }] }
        const firstError = errorObj['errors'][0] as unknown;
        if (typeof firstError === 'string') {
          serverMessage = firstError;
        } else if (
          typeof firstError === 'object' &&
          firstError !== null &&
          typeof (firstError as Record<string, unknown>)['message'] === 'string'
        ) {
          serverMessage = (firstError as Record<string, unknown>)['message'] as string;
        }
      }
    }
  }

  return {
    status: error.status,
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- statusText is still useful for logging
    statusText: error.statusText,
    url: error.url,
    message: error.message,
    serverMessage,
  };
}
