import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { heroArrowRight, heroChevronRight, heroHome } from '@ng-icons/heroicons/outline';

import { IconComponent } from '@shared/components/icon';
import { ICON_NAMES, type IconName } from '@shared/constants';

export type BreadcrumbVariant = 'default' | 'slash' | 'chevron' | 'arrow';
export type BreadcrumbSize = 'sm' | 'md' | 'lg';

/**
 * Represents a single breadcrumb item
 */
export interface BreadcrumbItem {
  /**
   * Display label for the breadcrumb
   */
  label: string;

  /**
   * Optional route path for navigation
   * If not provided, the item will be rendered as plain text
   */
  route?: string;

  /**
   * Optional icon to display before the label
   */
  icon?: IconName;

  /**
   * Optional query parameters for the route
   */
  queryParams?: Record<string, string>;

  /**
   * Optional fragment for the route
   */
  fragment?: string;

  /**
   * Whether this is the current page (disabled state)
   */
  current?: boolean;
}

/**
 * Accessible breadcrumb navigation component.
 * Follows WAI-ARIA breadcrumb pattern and WCAG 2.1 AAA guidelines.
 *
 * @example
 * ```html
 * <eb-breadcrumb
 *   [items]="breadcrumbItems"
 *   variant="chevron"
 *   ariaLabel="Breadcrumb navigation"
 * />
 * ```
 *
 * @example
 * ```typescript
 * breadcrumbItems: BreadcrumbItem[] = [
 *   { label: 'Home', route: '/', icon: 'heroHome' },
 *   { label: 'Projects', route: '/projects' },
 *   { label: 'Project Detail', current: true }
 * ];
 * ```
 */
@Component({
  selector: 'eb-breadcrumb',
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ heroHome, heroChevronRight, heroArrowRight })],
})
export class BreadcrumbComponent {
  readonly iconNames = ICON_NAMES;

  /**
   * Array of breadcrumb items to display
   */
  readonly items = input.required<BreadcrumbItem[]>();

  /**
   * Visual variant of the breadcrumb
   * - default: Plain text separators (›)
   * - slash: Slash separators (/)
   * - chevron: Chevron icon separators
   * - arrow: Arrow icon separators
   */
  readonly variant = input<BreadcrumbVariant>('default');

  /**
   * Size of the breadcrumb text and icons
   * - sm: Small (14px font, 16px icons)
   * - md: Medium (16px font, 18px icons) - default
   * - lg: Large (18px font, 20px icons)
   */
  readonly size = input<BreadcrumbSize>('md');

  /**
   * Whether to show icons for items that have them
   */
  readonly showIcons = input<boolean>(true);

  /**
   * Maximum number of items to show before collapsing
   * Items in the middle will be collapsed with an ellipsis
   * Set to 0 to disable collapsing (default)
   */
  readonly maxItems = input<number>(0);

  /**
   * ARIA label for the breadcrumb navigation
   */
  readonly ariaLabel = input<string>('Breadcrumb');

  /**
   * Emitted when a breadcrumb item is clicked
   */
  readonly itemClicked = output<BreadcrumbItem>();

  /**
   * Computed CSS classes for the breadcrumb container
   */
  readonly breadcrumbClasses = computed(() => this._getBreadcrumbClasses());

  /**
   * Computed list of items to display (with collapsing if maxItems is set)
   */
  readonly displayItems = computed(() => this._getDisplayItems());

  /**
   * Get the separator icon name based on variant
   */
  readonly separatorIcon = computed<IconName | null>(() => {
    const variant = this.variant();
    switch (variant) {
      case 'chevron':
        return ICON_NAMES.CHEVRON_RIGHT;
      case 'arrow':
        return ICON_NAMES.ARROW_RIGHT;
      default:
        return null;
    }
  });

  /**
   * Get the separator text based on variant
   */
  readonly separatorText = computed<string>(() => {
    const variant = this.variant();
    switch (variant) {
      case 'slash':
        return '/';
      case 'default':
      default:
        return '›';
    }
  });

  /**
   * Handle breadcrumb item click
   */
  onItemClick(item: BreadcrumbItem): void {
    if (!(item.current ?? false)) {
      this.itemClicked.emit(item);
    }
  }

  /**
   * Track by function for item iteration
   */
  trackByIndex(index: number): number {
    return index;
  }

  /**
   * Generate BEM CSS classes for the breadcrumb container
   */
  private _getBreadcrumbClasses(): string {
    const classes = ['breadcrumb'];

    // Variant class
    classes.push(`breadcrumb--${this.variant()}`);

    // Size class
    classes.push(`breadcrumb--${this.size()}`);

    return classes.join(' ');
  }

  /**
   * Get display items with collapsing logic
   */
  private _getDisplayItems(): (BreadcrumbItem | { isEllipsis: true })[] {
    const items = this.items();
    const maxItems = this.maxItems();

    // No collapsing if maxItems is 0 or not enough items
    if (maxItems === 0 || items.length <= maxItems) {
      return items;
    }

    // Always show first and last items
    // Collapse middle items
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));

    return [firstItem, { isEllipsis: true }, ...lastItems];
  }

  /**
   * Type guard to check if item is an ellipsis
   */
  isEllipsis(item: BreadcrumbItem | { isEllipsis: true }): item is { isEllipsis: true } {
    return 'isEllipsis' in item && item.isEllipsis;
  }

  /**
   * Type guard to check if item is a BreadcrumbItem
   */
  isBreadcrumbItem(item: BreadcrumbItem | { isEllipsis: true }): item is BreadcrumbItem {
    return !this.isEllipsis(item);
  }
}
