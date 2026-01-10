import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import type { ElementRef } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';

import { ButtonComponent } from '@shared/components/button/button.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ICON_NAMES } from '@shared/constants/icon-names.constants';

export type ModalVariant = 'default' | 'fullscreen' | 'dialog' | 'sidebar';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Accessible modal/dialog component with backdrop and focus trapping.
 * Follows WCAG 2.1 AAA guidelines and integrates with the theme system.
 *
 * Built on Angular CDK A11y for robust accessibility features:
 * - Focus trapping within modal
 * - Backdrop click handling
 * - ESC key support
 * - Auto-focus management
 *
 * @example
 * ```html
 * <!-- Simple modal -->
 * <eb-modal
 *   [open]="showModal()"
 *   ariaLabel="Confirmation Dialog"
 *   (closed)="handleClose()">
 *   <div modal-body>Are you sure?</div>
 * </eb-modal>
 *
 * <!-- Full-featured modal -->
 * <eb-modal
 *   [open]="isOpen()"
 *   [size]="'lg'"
 *   [variant]="'default'"
 *   ariaLabel="User Profile"
 *   (closed)="onClose()">
 *   <div modal-header>
 *     <h2>Edit Profile</h2>
 *   </div>
 *   <div modal-body>
 *     <!-- Form content -->
 *   </div>
 *   <div modal-footer>
 *     <eb-button variant="primary" ariaLabel="Save">Save</eb-button>
 *   </div>
 * </eb-modal>
 * ```
 */
@Component({
  selector: 'eb-modal',
  imports: [CommonModule, A11yModule, ButtonComponent, IconComponent],
  viewProviders: [provideIcons({ heroXMark })],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  /**
   * Icon names for template binding.
   */
  readonly icons = ICON_NAMES;

  /**
   * Visual variant of the modal
   * - default: Standard modal with centered position
   * - fullscreen: Takes full viewport (mobile-friendly)
   * - dialog: Small confirmation dialog
   * - sidebar: Slide-in from right side
   */
  readonly variant = input<ModalVariant>('default');

  /**
   * Size of the modal (for non-fullscreen variants)
   * - sm: 400px max-width (confirmations, alerts)
   * - md: 600px max-width (forms, content) - default
   * - lg: 800px max-width (complex forms, galleries)
   * - xl: 1000px max-width (detailed content)
   */
  readonly size = input<ModalSize>('md');

  /**
   * Whether the modal is open
   */
  readonly open = input<boolean>(false);

  /**
   * Whether clicking the backdrop should close the modal
   */
  readonly closeOnBackdropClick = input<boolean>(true);

  /**
   * Whether pressing ESC should close the modal
   */
  readonly closeOnEscape = input<boolean>(true);

  /**
   * Whether to show the close button in the header
   */
  readonly showCloseButton = input<boolean>(true);

  /**
   * Whether to prevent body scroll when modal is open
   */
  readonly preventBodyScroll = input<boolean>(true);

  /**
   * ARIA label for the modal (REQUIRED for accessibility)
   * Provides accessible name for screen readers
   */
  readonly ariaLabel = input.required<string>();

  /**
   * ID of element that describes the modal
   */
  readonly ariaDescribedBy = input<string | undefined>(undefined);

  /**
   * ID of element that labels the modal
   * Use this when modal has a visible heading
   */
  readonly ariaLabelledBy = input<string | undefined>(undefined);

  /**
   * Emitted when the modal is closed
   */
  readonly closed = output();

  /**
   * Emitted when the backdrop is clicked
   */
  readonly backdropClicked = output();

  /**
   * Emitted when the open state changes
   */
  readonly openedChange = output<boolean>();

  /**
   * Reference to the modal container element
   */
  readonly modalContainer = viewChild<ElementRef<HTMLDivElement>>('modalContainer');

  /**
   * Track the element that had focus before modal opened
   */
  private _previouslyFocusedElement = signal<HTMLElement | null>(null);

  /**
   * Track scrollbar width for body scroll lock
   */
  private _scrollbarWidth = signal<number>(0);

  /**
   * Computed CSS classes for the modal
   */
  readonly modalClasses = computed(() => this._getModalClasses());

  /**
   * Computed CSS classes for the backdrop
   */
  readonly backdropClasses = computed(() => this._getBackdropClasses());

  /**
   * Computed ARIA attributes
   */
  readonly ariaAttrs = computed(() => ({
    'aria-label': this.ariaLabelledBy() != null ? undefined : this.ariaLabel(),
    'aria-labelledby': this.ariaLabelledBy(),
    'aria-describedby': this.ariaDescribedBy(),
    'aria-modal': 'true',
    role: 'dialog',
  }));

  constructor() {
    // Calculate scrollbar width on init
    this._scrollbarWidth.set(this._getScrollbarWidth());

    // Handle body scroll lock when modal opens/closes
    effect(() => {
      if (this.open() && this.preventBodyScroll()) {
        // Store currently focused element
        this._previouslyFocusedElement.set(document.activeElement as HTMLElement);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${String(this._scrollbarWidth())}px`;

        // Emit opened event
        this.openedChange.emit(true);
      } else if (!this.open()) {
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // Restore focus to previously focused element
        const previousElement = this._previouslyFocusedElement();
        if (previousElement && typeof previousElement.focus === 'function') {
          // Use setTimeout to ensure DOM is ready
          setTimeout(() => {
            previousElement.focus();
          }, 0);
        }

        // Emit closed event
        this.openedChange.emit(false);
      }
    });
  }

  /**
   * Handle backdrop click events
   */
  handleBackdropClick(event: MouseEvent): void {
    // Only close if clicking directly on backdrop (not modal container)
    if (event.target === event.currentTarget && this.closeOnBackdropClick()) {
      this.backdropClicked.emit();
      this.close();
    }
  }

  /**
   * Handle keyboard events
   */
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.closeOnEscape()) {
      event.preventDefault();
      this.close();
    }
  }

  /**
   * Close the modal
   */
  close(): void {
    this.closed.emit();
  }

  /**
   * Generate BEM CSS classes for modal
   */
  private _getModalClasses(): string {
    const classes = ['modal'];

    // Variant class
    classes.push(`modal--${this.variant()}`);

    // Size class (not for fullscreen)
    if (this.variant() !== 'fullscreen') {
      classes.push(`modal--${this.size()}`);
    }

    return classes.join(' ');
  }

  /**
   * Generate BEM CSS classes for backdrop
   */
  private _getBackdropClasses(): string {
    const classes = ['modal-backdrop'];

    if (this.open()) {
      classes.push('modal-backdrop--open');
    }

    return classes.join(' ');
  }

  /**
   * Calculate scrollbar width for body scroll lock
   */
  private _getScrollbarWidth(): number {
    // Create temporary element to measure scrollbar
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    outer.parentNode?.removeChild(outer);

    return scrollbarWidth;
  }
}
