import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '../../config';

/**
 * Log levels supported by the LoggerService.
 * Used for filtering and categorizing log output.
 */
export type LogLevel = 'log' | 'info' | 'warn' | 'error';

/**
 * Centralized logging service that wraps console methods.
 *
 * This service provides a consistent logging interface across the application
 * and allows for future integration with remote logging services (Datadog, Sentry, etc.)
 * without requiring changes to application code.
 *
 * **Production Behavior:**
 * - `.log()` and `.info()` are suppressed in production
 * - `.warn()` and `.error()` always output regardless of environment
 *
 * @example
 * ```typescript
 * export class MyComponent {
 *   private readonly logger = inject(LoggerService);
 *
 *   doSomething() {
 *     this.logger.log('Starting operation');
 *     this.logger.info('Processing item', { id: 123 });
 *     this.logger.warn('Deprecated method called');
 *     this.logger.error('Operation failed', new Error('Network error'));
 *   }
 * }
 * ```
 *
 * @usageNotes
 * ### Future Remote Logging Integration
 *
 * To integrate with a remote logging service, modify the private logging methods
 * to also send data to your preferred service:
 *
 * ```typescript
 * private logToRemote(level: LogLevel, message: string, data?: unknown): void {
 *   // Example: Sentry integration
 *   Sentry.addBreadcrumb({ level, message, data });
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly env = inject(ENVIRONMENT);

  /**
   * Logs a general message.
   * Suppressed in production environment.
   *
   * @param message - The message to log
   * @param optionalParams - Additional data to log
   */
  log(message: string, ...optionalParams: unknown[]): void {
    if (!this.env.production) {
      console.log(message, ...optionalParams);
    }
  }

  /**
   * Logs an informational message.
   * Suppressed in production environment.
   *
   * @param message - The informational message
   * @param optionalParams - Additional data to log
   */
  info(message: string, ...optionalParams: unknown[]): void {
    if (!this.env.production) {
      console.info(message, ...optionalParams);
    }
  }

  /**
   * Logs a warning message.
   * Always outputs regardless of environment.
   *
   * @param message - The warning message
   * @param optionalParams - Additional data to log
   */
  warn(message: string, ...optionalParams: unknown[]): void {
    console.warn(message, ...optionalParams);
  }

  /**
   * Logs an error message.
   * Always outputs regardless of environment.
   *
   * @param message - The error message
   * @param optionalParams - Additional data to log (often includes Error objects)
   */
  error(message: string, ...optionalParams: unknown[]): void {
    console.error(message, ...optionalParams);
  }
}
