import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';

/**
 * Accessible badge component for displaying item counts and status indicators.
 * Similar to Angular Material badge - a circular element that overlays content.
 * Follows WCAG 2.1 AAA guidelines and integrates with the theme system.
 *
 * @example
 * ```html
 * <!-- Badge with count on a button -->
 * <div style="position: relative; display: inline-block;">
 *   <button>Messages</button>
 *   <eb-badge [content]="5" ariaLabel="5 unread messages" />
 * </div>
 *
 * <!-- Dot badge (no content) -->
 * <div style="position: relative; display: inline-block;">
 *   <button>Notifications</button>
 *   <eb-badge [dot]="true" ariaLabel="Has notifications" />
 * </div>
 *
 * <!-- Badge with variant and position -->
 * <div style="position: relative; display: inline-block;">
 *   <span>Cart</span>
 *   <eb-badge
 *     [content]="itemCount()"
 *     variant="error"
 *     position="top-right"
 *     ariaLabel="{{itemCount()}} items in cart"
 *   />
 * </div>
 * ```
 */
@Component({
  selector: 'eb-badge',
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  /**
   * Visual variant of the badge
   * - primary: Default badge color
   * - secondary: Secondary/neutral appearance
   * - success: Success/positive state
   * - warning: Warning/caution state
   * - error: Error/danger state
   * - info: Informational state
   */
  readonly variant = input<BadgeVariant>('primary');

  /**
   * Size of the badge
   * - sm: 16px diameter (12px font)
   * - md: 20px diameter (14px font) - default
   * - lg: 24px diameter (16px font)
   */
  readonly size = input<BadgeSize>('md');

  /**
   * Position of the badge relative to its parent
   * Parent element should have position: relative
   */
  readonly position = input<BadgePosition>('top-right');

  /**
   * Content to display in the badge
   * Can be a number or string
   * If undefined, badge will be hidden (unless dot mode is active)
   */
  readonly content = input<string | number | undefined>(undefined);

  /**
   * Maximum number to display before showing "+"
   * For example, if max is 99 and content is 150, shows "99+"
   * Only applies to numeric content
   */
  readonly max = input<number>(99);

  /**
   * Show badge as a dot (no content)
   * Useful for notifications without count
   */
  readonly dot = input<boolean>(false);

  /**
   * Hide badge when content is 0 or falsy
   * Set to false to always show the badge
   */
  readonly hideWhenZero = input<boolean>(true);

  /**
   * ARIA label for the badge (REQUIRED for accessibility)
   * Should describe the badge's meaning in context
   * Example: "5 unread messages", "Has notifications"
   */
  readonly ariaLabel = input.required<string>();

  /**
   * ID of element that describes the badge
   * Used for additional context beyond the label
   */
  readonly ariaDescribedBy = input<string | undefined>(undefined);

  /**
   * Whether the badge represents a live region that updates
   * Set to 'polite' or 'assertive' for screen reader announcements
   */
  readonly ariaLive = input<'off' | 'polite' | 'assertive'>('polite');

  /**
   * Computed display content
   * Handles max number logic and formatting
   */
  readonly displayContent = computed(() => {
    const content = this.content();

    if (this.dot()) {
      return '';
    }

    if (content == null || content === '') {
      return '';
    }

    // Handle numeric content with max
    if (typeof content === 'number') {
      const max = this.max();
      // return content > max ? `${max}+` : content.toString();
      return content > max ? String(max) + '+' : String(content);
    }

    // Handle string content
    return content;
  });

  /**
   * Whether the badge should be visible
   */
  readonly isVisible = computed(() => {
    // Always visible in dot mode
    if (this.dot()) {
      return true;
    }

    const content = this.content();

    // Hide if no content (treat null like undefined)
    if (content == null || content === '') {
      return false;
    }

    // Hide if hideWhenZero is true and content is 0
    if (this.hideWhenZero() && content === 0) {
      return false;
    }

    return true;
  });

  /**
   * Computed CSS classes for the badge
   */
  readonly badgeClasses = computed(() => this._getBadgeClasses());

  /**
   * Generate BEM CSS classes based on component state
   */
  private _getBadgeClasses(): string {
    const classes = ['badge'];

    // Variant class
    classes.push(`badge--${this.variant()}`);

    // Size class
    classes.push(`badge--${this.size()}`);

    // Position class
    classes.push(`badge--${this.position()}`);

    // Dot modifier
    if (this.dot()) {
      classes.push('badge--dot');
    }

    return classes.join(' ');
  }
}
