import { inject, Injectable } from '@angular/core';

import { LoggerService } from '@core/services/logger';
import { ToastService } from '@shared/services/toast';

/**
 * Service for notifying users about errors and other important messages.
 *
 * This is an abstraction layer that uses ToastService to display visual
 * notifications to users, and LoggerService for debugging/auditing.
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
  private readonly toastService = inject(ToastService);

  /**
   * Notify user of an error.
   *
   * @param message - User-friendly error message
   * @param details - Optional additional details or error code
   */
  notifyError(message: string, details?: string): void {
    const fullMessage = details !== undefined ? `${message} (${details})` : message;
    this.logger.error(`[User Notification] ${fullMessage}`);
    this.toastService.error(message);
  }

  /**
   * Notify user of a warning.
   *
   * @param message - User-friendly warning message
   * @param details - Optional additional details
   */
  notifyWarning(message: string, details?: string): void {
    const fullMessage = details !== undefined ? `${message} (${details})` : message;
    this.logger.warn(`[User Notification] ${fullMessage}`);
    this.toastService.warning(message);
  }

  /**
   * Notify user of a successful operation.
   * Useful for recovery scenarios or confirming important actions.
   *
   * @param message - Success message to display
   */
  notifySuccess(message: string): void {
    this.logger.info(`[User Notification] ${message}`);
    this.toastService.success(message);
  }

  /**
   * Notify user of informational content.
   *
   * @param message - Informational message to display
   */
  notifyInfo(message: string): void {
    this.logger.info(`[User Notification] ${message}`);
    this.toastService.info(message);
  }
}
