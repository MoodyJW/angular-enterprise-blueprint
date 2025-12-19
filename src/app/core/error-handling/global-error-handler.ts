import { ErrorHandler, inject, Injectable, NgZone } from '@angular/core';

import { LoggerService } from '../services/logger';
import { ErrorNotificationService } from './error-notification.service';
import type { AppError } from './error.types';

/**
 * Global error handler that catches all uncaught errors in the application.
 *
 * This handler:
 * - Normalizes errors into a consistent structure
 * - Logs errors via LoggerService for debugging
 * - Notifies users via ErrorNotificationService
 * - Prevents app crashes where possible
 *
 * Register in app.config.ts:
 * ```typescript
 * { provide: ErrorHandler, useClass: GlobalErrorHandler }
 * ```
 *
 * @example
 * ```typescript
 * // Errors thrown anywhere in the app will be caught:
 * throw new Error('Something went wrong');
 *
 * // Promise rejections are also caught:
 * Promise.reject('Async error');
 * ```
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(LoggerService);
  private readonly errorNotification = inject(ErrorNotificationService);
  private readonly ngZone = inject(NgZone);

  /**
   * Handle an uncaught error.
   *
   * This method is called by Angular whenever an error is not caught
   * by application code.
   *
   * @param error - The error that was thrown
   */
  handleError(error: unknown): void {
    // Run outside Angular zone to avoid triggering unnecessary change detection
    this.ngZone.runOutsideAngular(() => {
      const appError = this.normalizeError(error);

      // Log the full error for debugging
      this.logError(appError);

      // Notify user (runs back in zone for potential UI updates)
      this.ngZone.run(() => {
        this.notifyUser(appError);
      });
    });
  }

  /**
   * Normalize any error into a consistent AppError structure.
   *
   * @param error - The raw error to normalize
   * @returns Normalized AppError object
   */
  private normalizeError(error: unknown): AppError {
    // Handle standard Error objects
    if (error instanceof Error) {
      return {
        message: error.message,
        code: error.name,
        severity: 'error',
        timestamp: new Date(),
        context: {
          stack: error.stack,
          // Include cause if available (ES2022+)
          ...(error.cause !== undefined && {
            cause: typeof error.cause === 'string' ? error.cause : JSON.stringify(error.cause),
          }),
        },
        originalError: error,
      };
    }

    // Handle string errors
    if (typeof error === 'string') {
      return {
        message: error,
        severity: 'error',
        timestamp: new Date(),
      };
    }

    // Handle objects with message property
    if (this.isErrorLike(error)) {
      return {
        message: error.message,
        code: error.name,
        severity: 'error',
        timestamp: new Date(),
        context: { raw: error },
      };
    }

    // Fallback for unknown error types
    return {
      message: 'An unknown error occurred',
      severity: 'error',
      timestamp: new Date(),
      context: { raw: String(error) },
    };
  }

  /**
   * Type guard to check if a value is error-like (has message property).
   */
  private isErrorLike(value: unknown): value is { message: string; name?: string } {
    return (
      typeof value === 'object' &&
      value !== null &&
      'message' in value &&
      typeof (value as { message: unknown }).message === 'string'
    );
  }

  /**
   * Log the error for debugging purposes.
   */
  private logError(appError: AppError): void {
    const errorInfo = {
      code: appError.code,
      severity: appError.severity,
      timestamp: appError.timestamp.toISOString(),
      ...appError.context,
    };

    this.logger.error(`[GlobalErrorHandler] ${appError.message}`, errorInfo);

    // Log original error stack if available
    if (appError.originalError?.stack !== undefined) {
      this.logger.error('[GlobalErrorHandler] Stack trace:', appError.originalError.stack);
    }
  }

  /**
   * Notify the user about the error.
   */
  private notifyUser(appError: AppError): void {
    // Provide a user-friendly message
    const userMessage = this.getUserFriendlyMessage(appError);
    this.errorNotification.notifyError(userMessage, appError.code);
  }

  /**
   * Get a user-friendly message for the error.
   * Avoids exposing technical details to end users.
   */
  private getUserFriendlyMessage(appError: AppError): string {
    // For critical errors, use a generic message
    if (appError.severity === 'critical') {
      return 'A critical error occurred. Please refresh the page.';
    }

    // For known error types, we could provide more specific messages
    // For now, use a generic message to avoid exposing internals
    return 'An unexpected error occurred. Please try again.';
  }
}
