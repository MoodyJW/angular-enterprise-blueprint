import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { type Toast, ToastService } from '@shared/services/toast';

import type { ToastPosition } from './toast.component';
import { ToastComponent } from './toast.component';

/**
 * Container component for displaying toast notifications.
 * Manages positioning and rendering of all active toasts.
 * Should be placed once in the app root layout.
 *
 * @example
 * ```html
 * <!-- In app.component.html or main-layout.component.html -->
 * <eb-toast-container />
 * ```
 */
@Component({
  selector: 'eb-toast-container',
  imports: [ToastComponent],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  private readonly toastService = inject(ToastService);

  /**
   * All positions where toasts can be rendered
   */
  readonly positions: ToastPosition[] = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ];

  /**
   * Get toasts for a specific position
   */
  getToastsForPosition(position: ToastPosition): Toast[] {
    return this.toastService.getToastsByPosition(position);
  }

  /**
   * Handle toast dismissal
   */
  handleDismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
