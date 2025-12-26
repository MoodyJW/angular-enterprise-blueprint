import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  heroCheckCircle,
  heroExclamationTriangle,
  heroInformationCircle,
  heroXCircle,
} from '@ng-icons/heroicons/outline';

import { ICON_NAMES } from '../../constants/icon-names.constants';

import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

/**
 * Toast notification component for displaying temporary messages.
 * Follows WCAG 2.1 AAA guidelines and integrates with the theme system.
 * Supports auto-dismiss and manual dismiss functionality.
 *
 * @example
 * ```html
 * <!-- Success toast with auto-dismiss -->
 * <eb-toast
 *   variant="success"
 *   message="Changes saved successfully!"
 *   [duration]="3000"
 *   [dismissible]="true"
 *   (dismissed)="handleDismiss()">
 * </eb-toast>
 *
 * <!-- Error toast without auto-dismiss -->
 * <eb-toast
 *   variant="error"
 *   message="An error occurred"
 *   [duration]="0"
 *   [dismissible]="true">
 * </eb-toast>
 * ```
 */
@Component({
  selector: 'eb-toast',
  imports: [ButtonComponent, IconComponent],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      heroCheckCircle,
      heroXCircle,
      heroExclamationTriangle,
      heroInformationCircle,
    }),
  ],
})
export class ToastComponent {
  /**
   * Visual variant of the toast
   * - success: Positive feedback (green)
   * - error: Error messages (red)
   * - warning: Warning messages (yellow/orange)
   * - info: Informational messages (blue)
   */
  readonly variant = input<ToastVariant>('info');

  /**
   * The message to display in the toast
   */
  readonly message = input.required<string>();

  /**
   * Optional title for the toast
   */
  readonly title = input<string | undefined>(undefined);

  /**
   * Auto-dismiss duration in milliseconds
   * Set to 0 to disable auto-dismiss
   */
  readonly duration = input<number>(5000);

  /**
   * Whether the toast can be manually dismissed
   */
  readonly dismissible = input<boolean>(true);

  /**
   * Position of the toast on screen
   * Used by the toast container to position toasts
   */
  readonly position = input<ToastPosition>('top-right');

  /**
   * Whether the toast is currently animating out
   */
  readonly isExiting = input<boolean>(false);

  /**
   * ARIA role for the toast
   * - alert: For error messages (assertive)
   * - status: For success/info messages (polite)
   */
  readonly ariaRole = computed(() => (this.variant() === 'error' ? 'alert' : 'status'));

  /**
   * ARIA live region politeness
   * - assertive: For errors and warnings (interrupts)
   * - polite: For success and info (doesn't interrupt)
   */
  readonly ariaLive = computed(() =>
    this.variant() === 'error' || this.variant() === 'warning' ? 'assertive' : 'polite',
  );

  /**
   * Icon for each toast variant
   * Uses text symbols for now; can be replaced with icon component
   */
  readonly variantIcon = computed(() => {
    const icons: Record<ToastVariant, string> = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[this.variant()];
  });

  /**
   * Map toast variant to a named icon from the registry
   */
  readonly variantIconName = computed(() => {
    switch (this.variant()) {
      case 'success':
        return ICON_NAMES.SUCCESS;
      case 'error':
        return ICON_NAMES.ERROR;
      case 'warning':
        return ICON_NAMES.WARNING;
      default:
        return ICON_NAMES.INFO;
    }
  });

  /**
   * Accessible label for the variant icon
   */
  readonly variantIconLabel = computed(() => {
    const labels: Record<ToastVariant, string> = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information',
    };
    return labels[this.variant()];
  });

  /**
   * Computed CSS classes for the toast
   */
  readonly toastClasses = computed(() => this._getToastClasses());

  /**
   * Emitted when the toast is dismissed (manually or automatically)
   */
  readonly dismissed = output();

  /**
   * Handle dismiss button click
   */
  handleDismiss(): void {
    this.dismissed.emit();
  }

  /**
   * Generate BEM CSS classes based on component state
   */
  private _getToastClasses(): string {
    const classes = ['toast'];

    // Variant class
    classes.push(`toast--${this.variant()}`);

    // Position class
    classes.push(`toast--${this.position()}`);

    // State classes
    if (this.isExiting()) {
      classes.push('toast--exiting');
    }

    return classes.join(' ');
  }
}
