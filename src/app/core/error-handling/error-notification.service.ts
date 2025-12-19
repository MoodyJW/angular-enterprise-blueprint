import { inject, Injectable } from '@angular/core';

import { LoggerService } from '../services/logger';

/**
 * Service for notifying users about errors and other important messages.
 *
 * This is an abstraction layer that currently uses LoggerService for
 * console output. When ToastService is implemented in Phase 3, this
 * service can be updated to display visual notifications to users.
 *
 * @example
 * ```typescript
 * const errorNotification = inject(ErrorNotificationService);
 *
 * // Show error to user
 * errorNotification.notifyError('Failed to save changes');
 *
 * // Show warning with details
 * errorNotification.notifyWarning('Session expiring soon', 'Please save your work');
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorNotificationService {
  private readonly logger = inject(LoggerService);

  /**
   * Notify user of an error.
   *
   * @param message - User-friendly error message
   * @param details - Optional additional details or error code
   *
   * TODO: Replace with ToastService in Phase 3.
   */
  notifyError(message: string, details?: string): void {
    const fullMessage = details !== undefined ? `${message} (${details})` : message;
    this.logger.error(`[User Notification] ${fullMessage}`);
    // Future: this.toastService.error(message, { details });
  }

  /**
   * Notify user of a warning.
   *
   * @param message - User-friendly warning message
   * @param details - Optional additional details
   *
   * TODO: Replace with ToastService in Phase 3.
   */
  notifyWarning(message: string, details?: string): void {
    const fullMessage = details !== undefined ? `${message} (${details})` : message;
    this.logger.warn(`[User Notification] ${fullMessage}`);
    // Future: this.toastService.warning(message, { details });
  }

  /**
   * Notify user of a successful operation.
   * Useful for recovery scenarios or confirming important actions.
   *
   * @param message - Success message to display
   *
   * TODO: Replace with ToastService in Phase 3.
   */
  notifySuccess(message: string): void {
    this.logger.info(`[User Notification] ${message}`);
    // Future: this.toastService.success(message);
  }

  /**
   * Notify user of informational content.
   *
   * @param message - Informational message to display
   *
   * TODO: Replace with ToastService in Phase 3.
   */
  notifyInfo(message: string): void {
    this.logger.info(`[User Notification] ${message}`);
    // Future: this.toastService.info(message);
  }
}
