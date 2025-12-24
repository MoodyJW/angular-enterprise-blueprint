import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg';

/**
 * Container component for consistent content width management and centering.
 * Provides standardized max-width variants and padding options for layout consistency.
 *
 * @example
 * ```html
 * <!-- Standard page container -->
 * <eb-container maxWidth="lg" padding="md">
 *   <h1>Page Title</h1>
 *   <p>Page content...</p>
 * </eb-container>
 *
 * <!-- Narrow content like forms -->
 * <eb-container maxWidth="sm">
 *   <form>...</form>
 * </eb-container>
 *
 * <!-- Full-bleed section -->
 * <eb-container maxWidth="full" padding="none">
 *   <img src="hero.jpg" alt="Hero image" />
 * </eb-container>
 * ```
 */
@Component({
  selector: 'eb-container',
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {
  /**
   * Maximum width of the container
   * - sm: 600px - Narrow content (forms, articles)
   * - md: 900px - Medium content (blog posts, documentation)
   * - lg: 1200px - Default page content (matches design system default) - default
   * - xl: 1400px - Wide content (dashboards, data tables)
   * - full: 100% - Full width, no constraint
   */
  readonly maxWidth = input<ContainerMaxWidth>('lg');

  /**
   * Horizontal padding size
   * - none: No padding (0)
   * - sm: Small padding (12px)
   * - md: Medium padding (16px) - default
   * - lg: Large padding (24px)
   */
  readonly padding = input<ContainerPadding>('md');

  /**
   * Whether content should be centered horizontally
   * When true, applies margin: 0 auto
   */
  readonly centerContent = input<boolean>(true);

  /**
   * ARIA role for the container
   * Defaults to 'region' for semantic sectioning
   */
  readonly role = input<string>('region');

  /**
   * ARIA label for the container
   * Recommended when using role="region" to identify the section
   */
  readonly ariaLabel = input<string | undefined>(undefined);

  /**
   * ID of element that labels the container
   */
  readonly ariaLabelledBy = input<string | undefined>(undefined);

  /**
   * Computed CSS classes for the container
   */
  readonly containerClasses = computed(() => this._getContainerClasses());

  /**
   * Generate BEM CSS classes based on component state
   */
  private _getContainerClasses(): string {
    const classes = ['container'];

    // Max-width variant class
    classes.push(`container--${this.maxWidth()}`);

    // Padding class
    classes.push(`container--padding-${this.padding()}`);

    // Centering class
    if (this.centerContent()) {
      classes.push('container--centered');
    }

    return classes.join(' ');
  }
}
