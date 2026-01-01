import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { ButtonContentComponent } from './button-content';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Accessible button component with multiple variants and sizes.
 * Follows WCAG 2.1 AAA guidelines and integrates with the theme system.
 *
 * @example
 * ```html
 * <!-- Primary button -->
 * <eb-button variant="primary" ariaLabel="Submit form">Submit</eb-button>
 *
 * <!-- Icon-only button -->
 * <eb-button variant="ghost" iconOnly ariaLabel="Close dialog">×</eb-button>
 *
 * <!-- Loading state -->
 * <eb-button [loading]="isSubmitting()" ariaLabel="Save changes">Save</eb-button>
 * ```
 */
@Component({
  selector: 'eb-button',
  imports: [CommonModule, ButtonContentComponent],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  /**
   * Visual variant of the button
   * - primary: Main call-to-action (filled, high emphasis)
   * - secondary: Secondary actions (outlined, medium emphasis)
   * - tertiary: Less emphasis (text only with hover)
   * - ghost: Minimal emphasis (transparent with border)
   * - danger: Destructive actions (error color)
   */
  readonly variant = input<ButtonVariant>('primary');

  /**
   * Size of the button
   * - sm: 32px height, 14px font
   * - md: 40px height, 16px font (default)
   * - lg: 48px height, 18px font
   */
  readonly size = input<ButtonSize>('md');

  /**
   * HTML button type attribute
   */
  readonly type = input<ButtonType>('button');

  /**
   * Whether the button is disabled
   */
  readonly disabled = input<boolean>(false);

  /**
   * Whether the button is in loading state
   * Shows spinner and disables interaction
   */
  readonly loading = input<boolean>(false);

  /**
   * Icon identifier for left position
   * Icon rendering will be implemented when icon system is added
   */
  readonly iconLeft = input<string | undefined>(undefined);

  /**
   * Icon identifier for right position
   * Icon rendering will be implemented when icon system is added
   */
  readonly iconRight = input<string | undefined>(undefined);

  /**
   * Whether this is an icon-only button (no text content)
   */
  readonly iconOnly = input<boolean>(false);

  /**
   * Whether the button should take full width of container
   */
  readonly fullWidth = input<boolean>(false);

  /**
   * ARIA label for the button (REQUIRED for accessibility)
   * For icon-only buttons, this is the only text announced by screen readers
   * For text buttons, this overrides the visible text for screen readers
   */
  readonly ariaLabel = input.required<string>();

  /**
   * ID of element that describes the button
   * Used for additional context beyond the label
   */
  readonly ariaDescribedBy = input<string | undefined>(undefined);

  /**
   * Whether the button is in a pressed/active state (for toggle buttons)
   */
  readonly ariaPressed = input<boolean | undefined>(undefined);

  /**
   * Emitted when the button is clicked (if not disabled or loading)
   */
  readonly clicked = output<MouseEvent>();

  /**
   * Whether the button can be interacted with
   */
  readonly isInteractive = computed(() => !this.disabled() && !this.loading());

  /**
   * Computed CSS classes for the button
   */
  readonly buttonClasses = computed(() => this._getButtonClasses());

  /**
   * Computed aria-busy attribute value
   */
  readonly ariaBusyValue = computed(() => (this.loading() ? 'true' : undefined));

  /**
   * Handle button click events
   * Only emits if button is interactive (not disabled or loading)
   */
  handleClick(event: MouseEvent): void {
    if (this.isInteractive()) {
      this.clicked.emit(event);
    }
  }

  /**
   * Generate BEM CSS classes based on component state
   */
  private _getButtonClasses(): string {
    const classes = ['btn'];

    // Variant class
    classes.push(`btn--${this.variant()}`);

    // Size class
    classes.push(`btn--${this.size()}`);

    // State classes
    if (this.disabled()) {
      classes.push('btn--disabled');
    }
    if (this.loading()) {
      classes.push('btn--loading');
    }
    if (this.iconOnly()) {
      classes.push('btn--icon-only');
    }
    if (this.fullWidth()) {
      classes.push('btn--full-width');
    }

    return classes.join(' ');
  }
}
