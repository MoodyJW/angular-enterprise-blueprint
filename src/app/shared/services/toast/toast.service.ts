import { Injectable, signal } from '@angular/core';

import { TOAST_DURATIONS } from '../../constants';

import type { ToastPosition, ToastVariant } from '../../components/toast/toast.component';

/**
 * Configuration options for displaying a toast notification
 */
export interface ToastConfig {
  /**
   * The message to display
   */
  message: string;

  /**
   * Optional title for the toast
   */
  title?: string;

  /**
   * Visual variant of the toast
   */
  variant?: ToastVariant;

  /**
   * Auto-dismiss duration in milliseconds
   * Set to 0 to disable auto-dismiss
   * @default 5000
   */
  duration?: number;

  /**
   * Whether the toast can be manually dismissed
   * @default true
   */
  dismissible?: boolean;

  /**
   * Position of the toast on screen
   * @default 'top-right'
   */
  position?: ToastPosition;
}

/**
 * Internal toast representation with unique ID and dismissal state
 */
export interface Toast {
  /**
   * Unique identifier for the toast
   */
  id: string;

  /**
   * The message to display
   */
  message: string;

  /**
   * Optional title for the toast
   */
  title?: string;

  /**
   * Visual variant of the toast
   */
  variant: ToastVariant;

  /**
   * Auto-dismiss duration in milliseconds
   */
  duration: number;

  /**
   * Whether the toast can be manually dismissed
   */
  dismissible: boolean;

  /**
   * Position of the toast on screen
   */
  position: ToastPosition;

  /**
   * Whether the toast is currently animating out
   */
  isExiting: boolean;

  /**
   * Timer ID for auto-dismiss
   */
  timerId?: ReturnType<typeof setTimeout>;
}

/**
 * Service for managing toast notifications throughout the application.
 * Provides methods to show success, error, warning, and info toasts.
 * Handles auto-dismiss and manual dismissal of toasts.
 *
 * @example
 * ```typescript
 * constructor(private toastService: ToastService) {}
 *
 * // Show a success toast
 * this.toastService.success('Changes saved successfully!');
 *
 * // Show an error toast with custom duration
 * this.toastService.error('Failed to save changes', {
 *   duration: 10000,
 *   title: 'Error'
 * });
 *
 * // Show a custom toast
 * this.toastService.show({
 *   message: 'Custom message',
 *   variant: 'info',
 *   position: 'bottom-center',
 *   duration: 3000
 * });
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  /**
   * Signal containing all active toasts
   */
  private readonly _toasts = signal<Toast[]>([]);

  /**
   * Counter for generating unique toast IDs
   */
  private _idCounter = 0;

  /**
   * Public read-only access to toasts
   */
  readonly toasts = this._toasts.asReadonly();

  /**
   * Show a generic toast notification
   *
   * @param config Toast configuration options
   * @returns Unique ID of the created toast
   */
  show(config: ToastConfig): string {
    const toast: Toast = {
      id: this._generateId(),
      message: config.message,
      title: config.title,
      variant: config.variant ?? 'info',
      duration: config.duration ?? TOAST_DURATIONS.DEFAULT,
      dismissible: config.dismissible ?? true,
      position: config.position ?? 'top-right',
      isExiting: false,
    };

    // Add toast to the list
    this._toasts.update((toasts) => [...toasts, toast]);

    // Set up auto-dismiss if duration is greater than 0
    if (toast.duration > 0) {
      const timerId = setTimeout(() => {
        this.dismiss(toast.id);
      }, toast.duration);

      // Store timer ID for cleanup
      this._toasts.update((toasts) =>
        toasts.map((t) => (t.id === toast.id ? { ...t, timerId } : t)),
      );
    }

    return toast.id;
  }

  /**
   * Show a success toast notification
   *
   * @param message The message to display
   * @param config Optional additional configuration
   * @returns Unique ID of the created toast
   */
  success(message: string, config?: Partial<ToastConfig>): string {
    return this.show({
      ...config,
      message,
      variant: 'success',
    });
  }

  /**
   * Show an error toast notification
   *
   * @param message The message to display
   * @param config Optional additional configuration
   * @returns Unique ID of the created toast
   */
  error(message: string, config?: Partial<ToastConfig>): string {
    return this.show({
      ...config,
      message,
      variant: 'error',
    });
  }

  /**
   * Show a warning toast notification
   *
   * @param message The message to display
   * @param config Optional additional configuration
   * @returns Unique ID of the created toast
   */
  warning(message: string, config?: Partial<ToastConfig>): string {
    return this.show({
      ...config,
      message,
      variant: 'warning',
    });
  }

  /**
   * Show an info toast notification
   *
   * @param message The message to display
   * @param config Optional additional configuration
   * @returns Unique ID of the created toast
   */
  info(message: string, config?: Partial<ToastConfig>): string {
    return this.show({
      ...config,
      message,
      variant: 'info',
    });
  }

  /**
   * Dismiss a toast notification by ID
   * Triggers exit animation before removing from DOM
   *
   * @param id The unique ID of the toast to dismiss
   */
  dismiss(id: string): void {
    // Find the toast
    const toast = this._toasts().find((t) => t.id === id);
    if (!toast) {
      return;
    }

    // Clear the auto-dismiss timer if it exists
    if (toast.timerId) {
      clearTimeout(toast.timerId);
    }

    // Mark as exiting to trigger animation
    this._toasts.update((toasts) =>
      toasts.map((t) => (t.id === id ? { ...t, isExiting: true } : t)),
    );

    // Remove from DOM after animation completes (300ms)
    setTimeout(() => {
      this._toasts.update((toasts) => toasts.filter((t) => t.id !== id));
    }, 300);
  }

  /**
   * Dismiss all active toast notifications
   */
  dismissAll(): void {
    const ids = this._toasts().map((t) => t.id);
    ids.forEach((id) => {
      this.dismiss(id);
    });
  }

  /**
   * Get toasts by position for rendering in toast container
   *
   * @param position The position to filter by
   * @returns Array of toasts at the specified position
   */
  getToastsByPosition(position: ToastPosition): Toast[] {
    return this._toasts().filter((t) => t.position === position);
  }

  /**
   * Generate a unique ID for a toast
   */
  private _generateId(): string {
    return `toast-${String(++this._idCounter)}-${String(Date.now())}`;
  }
}
