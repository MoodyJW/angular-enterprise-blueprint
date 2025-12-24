import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Orientation of the divider.
 * - `horizontal`: Divider spans horizontally (default)
 * - `vertical`: Divider spans vertically
 */
export type DividerOrientation = 'horizontal' | 'vertical';

/**
 * Visual variant of the divider.
 * - `solid`: Solid line (default)
 * - `dashed`: Dashed line
 * - `dotted`: Dotted line
 */
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

/**
 * Spacing around the divider.
 * - `none`: No spacing (0px)
 * - `xs`: Extra small spacing (4px)
 * - `sm`: Small spacing (8px)
 * - `md`: Medium spacing (16px)
 * - `lg`: Large spacing (24px)
 * - `xl`: Extra large spacing (32px)
 * - `2xl`: 2x extra large spacing (48px)
 */
export type DividerSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Thickness of the divider line.
 * - `thin`: 1px line (default)
 * - `medium`: 2px line
 * - `thick`: 4px line
 */
export type DividerThickness = 'thin' | 'medium' | 'thick';

/**
 * A visual divider component that separates content sections.
 *
 * @remarks
 * The DividerComponent provides a flexible way to create visual separators between content.
 * It supports horizontal and vertical orientations, multiple visual styles, configurable
 * spacing, and optional label text.
 *
 * Features:
 * - Horizontal and vertical orientations
 * - 3 visual variants (solid, dashed, dotted)
 * - 7 spacing options (none, xs, sm, md, lg, xl, 2xl)
 * - 3 thickness options (thin, medium, thick)
 * - Optional centered label text
 * - Full width or inset modes
 * - WCAG 2.1 AAA compliant (semantic HTML, ARIA)
 * - Theme-aware styling with CSS variables
 * - Signal-based inputs with OnPush change detection
 * - BEM CSS naming convention
 * - Respects prefers-reduced-motion
 *
 * @example
 * Basic usage:
 * ```html
 * <eb-divider />
 * ```
 *
 * @example
 * With label:
 * ```html
 * <eb-divider label="Or continue with" />
 * ```
 *
 * @example
 * Vertical divider:
 * ```html
 * <eb-divider orientation="vertical" />
 * ```
 *
 * @example
 * Custom styling:
 * ```html
 * <eb-divider
 *   variant="dashed"
 *   spacing="lg"
 *   thickness="medium"
 *   [inset]="true"
 * />
 * ```
 */
@Component({
  selector: 'eb-divider',
  standalone: true,
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerComponent {
  /**
   * Orientation of the divider.
   * @default 'horizontal'
   */
  readonly orientation = input<DividerOrientation>('horizontal');

  /**
   * Visual variant of the divider line.
   * @default 'solid'
   */
  readonly variant = input<DividerVariant>('solid');

  /**
   * Spacing around the divider (margin).
   * @default 'md'
   */
  readonly spacing = input<DividerSpacing>('md');

  /**
   * Thickness of the divider line.
   * @default 'thin'
   */
  readonly thickness = input<DividerThickness>('thin');

  /**
   * Optional label text to display in the center of the divider.
   * Only works with horizontal orientation.
   */
  readonly label = input<string | undefined>(undefined);

  /**
   * Whether the divider should be inset from the edges.
   * When true, horizontal dividers get horizontal padding, vertical dividers get vertical padding.
   * @default false
   */
  readonly inset = input<boolean>(false);

  /**
   * ARIA role for the divider.
   * @default 'separator'
   */
  readonly ariaRole = input<string>('separator');

  /**
   * ARIA label for accessibility.
   * If not provided, defaults based on orientation.
   */
  readonly ariaLabel = input<string | undefined>(undefined);

  /**
   * Map semantic spacing values to numeric CSS class names
   */
  private readonly _spacingClassMap: Record<DividerSpacing, string> = {
    none: 'spacing-none',
    xs: 'space-1',
    sm: 'space-2',
    md: 'space-3',
    lg: 'space-4',
    xl: 'space-5',
    '2xl': 'space-6',
  };

  /**
   * Computed CSS classes for the divider container.
   */
  readonly containerClasses = computed(() => {
    const spacingClass = this._spacingClassMap[this.spacing()];
    return [
      'divider',
      `divider--${this.orientation()}`,
      `divider--${this.variant()}`,
      `divider--${spacingClass}`,
      `divider--${this.thickness()}`,
      this.inset() ? 'divider--inset' : '',
      this.hasLabel() ? 'divider--with-label' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  /**
   * Computed ARIA label for the divider.
   */
  readonly computedAriaLabel = computed(() => {
    const aria = this.ariaLabel();
    if (aria != null && aria !== '') return aria;
    return this.orientation() === 'horizontal' ? 'Horizontal divider' : 'Vertical divider';
  });

  /**
   * Whether the divider has a label.
   */
  readonly hasLabel = computed(() => {
    const lbl = this.label();
    return lbl != null && lbl !== '';
  });
}
