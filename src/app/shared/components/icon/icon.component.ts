import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import { ICON_REGISTRY, type IconName } from '../../constants';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconColor =
  | 'current'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/**
 * Accessible icon component wrapping ng-icons.
 * Provides size variants, color options, and accessibility features.
 * Follows WCAG 2.1 AAA guidelines and integrates with the theme system.
 *
 * @example
 * ```html
 * <!-- Simple icon -->
 * <eb-icon name="heroHome" />
 *
 * <!-- With size and color -->
 * <eb-icon name="heroCheck" size="lg" color="success" />
 *
 * <!-- Decorative icon (hidden from screen readers) -->
 * <eb-icon name="heroStar" [decorative]="true" />
 *
 * <!-- Icon with label (visible to screen readers) -->
 * <eb-icon name="heroUser" ariaLabel="User profile" />
 *
 * <!-- Spinning icon -->
 * <eb-icon name="heroArrowPath" [spin]="true" ariaLabel="Loading" />
 * ```
 */
@Component({
  selector: 'eb-icon',
  imports: [NgIconComponent],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons(ICON_REGISTRY)],
})
export class IconComponent {
  /**
   * Icon name from the icon registry
   * Use ICON_NAMES constants for type safety
   */
  readonly name = input.required<IconName>();

  /**
   * Size of the icon
   * - xs: 12px (0.75rem)
   * - sm: 16px (1rem)
   * - md: 20px (1.25rem) - default
   * - lg: 24px (1.5rem)
   * - xl: 32px (2rem)
   * - 2xl: 40px (2.5rem)
   */
  readonly size = input<IconSize>('md');

  /**
   * Color of the icon
   * - current: Inherits current text color (default)
   * - primary: Primary theme color
   * - secondary: Secondary theme color
   * - success: Success/positive color
   * - warning: Warning/caution color
   * - error: Error/danger color
   * - info: Informational color
   */
  readonly color = input<IconColor>('current');

  /**
   * Whether the icon is purely decorative
   * If true, icon will be hidden from screen readers (aria-hidden="true")
   * If false, you MUST provide an ariaLabel
   */
  readonly decorative = input<boolean>(false);

  /**
   * ARIA label for the icon (REQUIRED if not decorative)
   * Describes the icon's meaning for screen readers
   */
  readonly ariaLabel = input<string | undefined>(undefined);

  /**
   * Whether the icon should spin/rotate continuously
   * Useful for loading indicators
   */
  readonly spin = input<boolean>(false);

  /**
   * Computed CSS classes for the icon wrapper
   */
  readonly iconClasses = computed(() => this._getIconClasses());

  /**
   * Computed CSS size for ng-icon
   */
  readonly iconSize = computed(() => this._getIconSize());

  /**
   * Computed aria-hidden attribute value
   */
  readonly ariaHidden = computed(() => (this.decorative() ? 'true' : undefined));

  /**
   * Generate BEM CSS classes based on component state
   */
  private _getIconClasses(): string {
    const classes = ['icon'];

    // Size class
    classes.push(`icon--${this.size()}`);

    // Color class
    if (this.color() !== 'current') {
      classes.push(`icon--${this.color()}`);
    }

    // Spin class
    if (this.spin()) {
      classes.push('icon--spin');
    }

    return classes.join(' ');
  }

  /**
   * Get the pixel size for ng-icon based on size variant
   */
  private _getIconSize(): string {
    const sizeMap: Record<IconSize, string> = {
      xs: '0.75rem', // 12px
      sm: '1rem', // 16px
      md: '1.25rem', // 20px
      lg: '1.5rem', // 24px
      xl: '2rem', // 32px
      '2xl': '2.5rem', // 40px
    };

    return sizeMap[this.size()];
  }
}
