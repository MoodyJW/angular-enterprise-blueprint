import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type StackSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
export type StackDirection = 'vertical' | 'horizontal';

/**
 * Stack component for consistent spacing between child elements.
 * Provides vertical or horizontal stacking with flexible spacing, alignment, and distribution options.
 *
 * @example
 * ```html
 * <!-- Vertical stack with medium spacing -->
 * <eb-stack spacing="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </eb-stack>
 *
 * <!-- Horizontal stack with large spacing -->
 * <eb-stack direction="horizontal" spacing="lg" align="center">
 *   <button>Cancel</button>
 *   <button>Save</button>
 * </eb-stack>
 *
 * <!-- Centered stack with custom spacing -->
 * <eb-stack spacing="xl" align="center" fullWidth>
 *   <h1>Title</h1>
 *   <p>Subtitle</p>
 * </eb-stack>
 * ```
 */
@Component({
  selector: 'eb-stack',
  standalone: true,
  templateUrl: './stack.component.html',
  styleUrl: './stack.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackComponent {
  /**
   * Spacing between stack items
   * - none: 0
   * - xs: 4px
   * - sm: 8px
   * - md: 16px (default)
   * - lg: 24px
   * - xl: 32px
   * - 2xl: 48px
   * - 3xl: 64px
   * - 4xl: 96px
   */
  readonly spacing = input<StackSpacing>('md');

  /**
   * Stack direction
   * - vertical: Stack items vertically (default)
   * - horizontal: Stack items horizontally
   */
  readonly direction = input<StackDirection>('vertical');

  /**
   * Alignment of items perpendicular to stack direction
   * - vertical stack: horizontal alignment (left/center/right/stretch)
   * - horizontal stack: vertical alignment (top/center/bottom/stretch)
   * - start: Align to start edge
   * - center: Center items
   * - end: Align to end edge
   * - stretch: Fill available space (default)
   */
  readonly align = input<StackAlign>('stretch');

  /**
   * Distribution of items along stack direction
   * - start: Pack items to start
   * - center: Center items
   * - end: Pack items to end
   * - space-between: Distribute with space between
   * - space-around: Distribute with space around
   * - space-evenly: Distribute with even space
   */
  readonly justify = input<StackJustify | undefined>(undefined);

  /**
   * Whether stack should take full width/height of container
   * - vertical: full width
   * - horizontal: full height
   */
  readonly fullWidth = input<boolean>(false);

  /**
   * Whether to wrap items when they exceed container size
   * Only applies to horizontal stacks
   */
  readonly wrap = input<boolean>(false);

  /**
   * Whether items should be inline (shrink to content width)
   * Only applies to vertical stacks
   */
  readonly inline = input<boolean>(false);

  /**
   * Add a divider between stack items
   */
  readonly divider = input<boolean>(false);

  /**
   * ARIA role for the stack
   * Defaults to 'list' for semantic grouping
   */
  readonly role = input<string>('list');

  /**
   * ARIA label for the stack
   * Recommended for stacks that represent distinct regions
   */
  readonly ariaLabel = input<string | undefined>(undefined);

  /**
   * ID of element that labels the stack
   */
  readonly ariaLabelledBy = input<string | undefined>(undefined);

  /**
   * Computed CSS classes for the stack
   */
  readonly stackClasses = computed(() => this._getStackClasses());

  /**
   * Generate BEM CSS classes based on component state
   */
  private _getStackClasses(): string {
    const justify = this.justify();

    return [
      'stack',
      `stack--${this.direction()}`,
      `stack--spacing-${this.spacing()}`,
      `stack--align-${this.align()}`,
      justify != null ? `stack--justify-${justify}` : '',
      this.fullWidth() ? 'stack--full-width' : '',
      this.wrap() ? 'stack--wrap' : '',
      this.inline() ? 'stack--inline' : '',
      this.divider() ? 'stack--divider' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
