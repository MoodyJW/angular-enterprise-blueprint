import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'secondary' | 'light' | 'dark';

/**
 * Accessible loading spinner component for indicating loading states.
 * Follows WCAG 2.1 AAA guidelines and integrates with the theme system.
 *
 * @example
 * ```html
 * <!-- Default spinner -->
 * <eb-loading-spinner ariaLabel="Loading content" />
 *
 * <!-- Small spinner with custom variant -->
 * <eb-loading-spinner size="sm" variant="secondary" ariaLabel="Loading" />
 *
 * <!-- Large spinner with custom message -->
 * <eb-loading-spinner
 *   size="lg"
 *   ariaLabel="Loading data"
 *   message="Please wait while we load your data..." />
 * ```
 */
@Component({
  selector: 'eb-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {
  /**
   * Size of the spinner
   * - sm: 20px diameter
   * - md: 32px diameter (default)
   * - lg: 48px diameter
   * - xl: 64px diameter
   */
  readonly size = input<SpinnerSize>('md');

  /**
   * Visual variant of the spinner
   * - primary: Uses primary theme color
   * - secondary: Uses secondary theme color
   * - light: Light color for dark backgrounds
   * - dark: Dark color for light backgrounds
   */
  readonly variant = input<SpinnerVariant>('primary');

  /**
   * ARIA label for the spinner (REQUIRED for accessibility)
   * Announces loading state to screen readers
   */
  readonly ariaLabel = input.required<string>();

  /**
   * Optional visible message to display below the spinner
   */
  readonly message = input<string | undefined>(undefined);

  /**
   * Whether to center the spinner in its container
   */
  readonly center = input<boolean>(false);

  /**
   * Whether to overlay the spinner on top of content
   * Creates a backdrop and centers spinner in viewport
   */
  readonly overlay = input<boolean>(false);

  /**
   * Computed CSS classes for the spinner container
   */
  readonly containerClasses = computed(() => this._getContainerClasses());

  /**
   * Computed CSS classes for the spinner element
   */
  readonly spinnerClasses = computed(() => this._getSpinnerClasses());

  /**
   * Generate BEM CSS classes for the container based on component state
   */
  private _getContainerClasses(): string {
    const classes = ['spinner-container'];

    if (this.center()) {
      classes.push('spinner-container--center');
    }

    if (this.overlay()) {
      classes.push('spinner-container--overlay');
    }

    return classes.join(' ');
  }

  /**
   * Generate BEM CSS classes for the spinner based on component state
   */
  private _getSpinnerClasses(): string {
    const classes = ['spinner'];

    // Size class
    classes.push(`spinner--${this.size()}`);

    // Variant class
    classes.push(`spinner--${this.variant()}`);

    return classes.join(' ');
  }
}
