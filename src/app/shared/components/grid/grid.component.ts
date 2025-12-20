import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type GridColumns = 1 | 2 | 3 | 4 | 6 | 12 | 'auto';
export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type GridAlign = 'start' | 'center' | 'end' | 'stretch';
export type GridJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

/**
 * Responsive grid component for creating flexible, consistent layouts.
 * Supports responsive column configurations, gap spacing, and alignment options.
 *
 * @example
 * ```html
 * <!-- Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop -->
 * <eb-grid [cols]="1" [colsMd]="2" [colsLg]="3" gap="lg">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </eb-grid>
 *
 * <!-- Auto-fit columns with minimum width -->
 * <eb-grid cols="auto" [minColWidth]="'250px'" gap="md">
 *   <div>Auto-sized item</div>
 *   <div>Auto-sized item</div>
 * </eb-grid>
 *
 * <!-- 12-column layout system -->
 * <eb-grid [cols]="12" gap="md">
 *   <div class="col-span-6">Half width</div>
 *   <div class="col-span-6">Half width</div>
 * </eb-grid>
 * ```
 */
@Component({
  selector: 'eb-grid',
  standalone: true,
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
  /**
   * Number of columns (mobile-first, base)
   * - 1-12: Fixed column count
   * - auto: Auto-fit columns with minColWidth
   */
  readonly cols = input<GridColumns>(1);

  /**
   * Number of columns at tablet breakpoint (≥768px)
   * If not specified, uses cols value
   */
  readonly colsMd = input<GridColumns | undefined>(undefined);

  /**
   * Number of columns at desktop breakpoint (≥1024px)
   * If not specified, uses colsMd or cols value
   */
  readonly colsLg = input<GridColumns | undefined>(undefined);

  /**
   * Number of columns at large desktop breakpoint (≥1280px)
   * If not specified, uses colsLg, colsMd, or cols value
   */
  readonly colsXl = input<GridColumns | undefined>(undefined);

  /**
   * Gap spacing between grid items
   * - none: 0
   * - xs: 4px
   * - sm: 8px
   * - md: 16px (default)
   * - lg: 24px
   * - xl: 32px
   * - 2xl: 48px
   */
  readonly gap = input<GridGap>('md');

  /**
   * Horizontal gap spacing (overrides gap for columns)
   * Useful when you want different horizontal vs vertical spacing
   */
  readonly gapX = input<GridGap | undefined>(undefined);

  /**
   * Vertical gap spacing (overrides gap for rows)
   * Useful when you want different horizontal vs vertical spacing
   */
  readonly gapY = input<GridGap | undefined>(undefined);

  /**
   * Minimum column width for auto-fit columns
   * Only applies when cols="auto"
   * Examples: '200px', '15rem', '20ch'
   */
  readonly minColWidth = input<string>('200px');

  /**
   * Vertical alignment of items within grid cells
   * - start: Align to top
   * - center: Center vertically
   * - end: Align to bottom
   * - stretch: Fill cell height (default)
   */
  readonly alignItems = input<GridAlign>('stretch');

  /**
   * Horizontal distribution of items
   * - start: Pack items to start
   * - center: Center items
   * - end: Pack items to end
   * - space-between: Distribute with space between
   * - space-around: Distribute with space around
   * - space-evenly: Distribute with even space
   */
  readonly justifyItems = input<GridJustify | undefined>(undefined);

  /**
   * Whether grid should take full width of container
   */
  readonly fullWidth = input<boolean>(true);

  /**
   * ARIA role for the grid
   * Defaults to generic 'list' for semantic grouping
   */
  readonly role = input<string>('list');

  /**
   * ARIA label for the grid
   * Recommended for grids that represent distinct regions
   */
  readonly ariaLabel = input<string | undefined>(undefined);

  /**
   * ID of element that labels the grid
   */
  readonly ariaLabelledBy = input<string | undefined>(undefined);

  /**
   * Computed CSS classes for the grid
   */
  readonly gridClasses = computed(() => this._getGridClasses());

  /**
   * Computed inline styles for the grid
   * Used for responsive column counts and auto-fit
   */
  readonly gridStyles = computed(() => this._getGridStyles());

  /**
   * Generate BEM CSS classes based on component state
   */
  private _getGridClasses(): string {
    const gapX = this.gapX();
    const gapY = this.gapY();
    const justify = this.justifyItems();

    return [
      'grid',
      Boolean(gapX)
        ? `grid--gap-x-${String(gapX)}`
        : Boolean(gapY)
          ? ''
          : `grid--gap-${this.gap()}`,
      Boolean(gapY) ? `grid--gap-y-${String(gapY)}` : '',
      `grid--align-${this.alignItems()}`,
      Boolean(justify) ? `grid--justify-${String(justify)}` : '',
      this.fullWidth() ? 'grid--full-width' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  /**
   * Generate inline styles for responsive columns
   */
  private _getGridStyles(): Record<string, string> {
    const getColValue = (cols: GridColumns | undefined): string =>
      cols === 'auto'
        ? `repeat(auto-fit, minmax(min(${this.minColWidth()}, 100%), 1fr))`
        : `repeat(${String(cols)}, 1fr)`;

    const styles: Record<string, string> = {
      '--grid-cols': getColValue(this.cols()),
    };

    const colsMd = this.colsMd();
    const colsLg = this.colsLg();
    const colsXl = this.colsXl();

    if (Boolean(colsMd)) styles['--grid-cols-md'] = getColValue(colsMd);
    if (Boolean(colsLg)) styles['--grid-cols-lg'] = getColValue(colsLg);
    if (Boolean(colsXl)) styles['--grid-cols-xl'] = getColValue(colsXl);

    return styles;
  }
}
