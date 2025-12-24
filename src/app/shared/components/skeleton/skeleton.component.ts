import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

/**
 * Skeleton loading component for displaying placeholder content while data loads.
 * Follows WCAG 2.1 AAA guidelines and integrates with the theme system.
 *
 * @example
 * ```html
 * <!-- Text skeleton (single line) -->
 * <eb-skeleton ariaLabel="Loading text" />
 *
 * <!-- Multiple text lines -->
 * <eb-skeleton variant="text" [count]="3" ariaLabel="Loading content" />
 *
 * <!-- Circular avatar skeleton -->
 * <eb-skeleton variant="circular" width="48px" height="48px" ariaLabel="Loading avatar" />
 *
 * <!-- Rectangular image skeleton -->
 * <eb-skeleton
 *   variant="rectangular"
 *   width="100%"
 *   height="200px"
 *   ariaLabel="Loading image" />
 *
 * <!-- Card skeleton with custom spacing -->
 * <eb-skeleton variant="rectangular" width="100%" height="300px" [spacing]="16" ariaLabel="Loading card" />
 * ```
 */
@Component({
  selector: 'eb-skeleton',
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  /**
   * Shape variant of the skeleton
   * - text: Single or multiple text lines with randomized widths
   * - circular: Circle shape (useful for avatars, icons)
   * - rectangular: Rectangle shape (useful for images, cards)
   */
  readonly variant = input<SkeletonVariant>('text');

  /**
   * Animation type
   * - pulse: Subtle opacity pulse animation
   * - wave: Shimmer wave animation (default)
   * - none: No animation (respects reduced motion preference)
   */
  readonly animation = input<SkeletonAnimation>('wave');

  /**
   * Width of the skeleton
   * Can be any valid CSS width value (px, %, rem, etc.)
   * For text variant, defaults to 100%
   * For circular/rectangular, must be specified
   */
  readonly width = input<string | undefined>(undefined);

  /**
   * Height of the skeleton
   * Can be any valid CSS height value (px, %, rem, etc.)
   * For text variant, uses default line height
   * For circular/rectangular, must be specified
   */
  readonly height = input<string | undefined>(undefined);

  /**
   * Number of skeleton items to render
   * Only applicable for text variant to show multiple lines
   */
  readonly count = input<number>(1);

  /**
   * Spacing between skeleton items in pixels
   * Only applicable when count > 1
   */
  readonly spacing = input<number>(8);

  /**
   * ARIA label for the skeleton (REQUIRED for accessibility)
   * Announces loading state to screen readers
   */
  readonly ariaLabel = input.required<string>();

  /**
   * Whether the skeleton should have rounded corners
   * Only applicable for rectangular variant
   */
  readonly rounded = input<boolean>(false);

  /**
   * Computed array for rendering multiple skeleton items
   */
  readonly items = computed(() => Array.from({ length: this.count() }));

  /**
   * Computed CSS classes for the skeleton container
   */
  readonly containerClasses = computed(() => this._getContainerClasses());

  /**
   * Computed CSS classes for each skeleton item
   */
  readonly skeletonClasses = computed(() => this._getSkeletonClasses());

  /**
   * Computed inline styles for the skeleton container
   */
  readonly containerStyles = computed(() => this._getContainerStyles());

  /**
   * Computed inline styles for each skeleton item
   */
  readonly skeletonStyles = computed(() => this._getSkeletonStyles());

  /**
   * Generate randomized width for text skeleton items
   * Creates more natural-looking text placeholders
   */
  getTextWidth(index: number): string {
    if (this.variant() !== 'text') {
      return '100%';
    }

    // Last item is typically shorter
    if (index === this.count() - 1 && this.count() > 1) {
      return String(60 + (index % 20)) + '%';
    }

    // Vary width between 80-100% for visual variety
    return String(80 + (index % 21)) + '%';
  }

  /**
   * Get skeleton styles for a specific item index
   * For text variant, merges base styles with dynamic width
   */
  getSkeletonStylesForItem(index: number): Record<string, string> {
    const baseStyles = this.skeletonStyles();

    if (this.variant() === 'text') {
      return {
        ...baseStyles,
        width: this.getTextWidth(index),
      };
    }

    return baseStyles;
  }

  /**
   * Generate BEM CSS classes for the container based on component state
   */
  private _getContainerClasses(): string {
    const classes = ['skeleton-container'];

    if (this.count() > 1) {
      classes.push('skeleton-container--multiple');
    }

    return classes.join(' ');
  }

  /**
   * Generate BEM CSS classes for the skeleton based on component state
   */
  private _getSkeletonClasses(): string {
    const classes = ['skeleton'];

    // Variant class
    classes.push(`skeleton--${this.variant()}`);

    // Animation class
    classes.push(`skeleton--animation-${this.animation()}`);

    // Rounded corners
    if (this.rounded() && this.variant() === 'rectangular') {
      classes.push('skeleton--rounded');
    }

    return classes.join(' ');
  }

  /**
   * Generate inline styles for the container
   */
  private _getContainerStyles(): Record<string, string> {
    const styles: Record<string, string> = {};

    if (this.count() > 1) {
      styles['gap'] = `${String(this.spacing())}px`;
    }

    return styles;
  }

  /**
   * Generate inline styles for the skeleton
   */
  private _getSkeletonStyles(): Record<string, string> {
    const styles: Record<string, string> = {};

    // Apply width if specified (explicitly handle undefined/empty string)
    const w = this.width();
    if (w !== undefined && w !== '') {
      styles['width'] = w;
    }

    // Apply height if specified (explicitly handle undefined/empty string)
    const h = this.height();
    if (h !== undefined && h !== '') {
      styles['height'] = h;
    }

    // For circular variant, ensure width and height are equal
    if (this.variant() === 'circular') {
      const size = [this.width(), this.height()].find((s) => s !== undefined && s !== '') ?? '40px';
      styles['width'] = size;
      styles['height'] = size;
    }

    return styles;
  }
}
