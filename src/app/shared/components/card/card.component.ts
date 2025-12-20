import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

/**
 * Flexible card component with content projection slots.
 * Supports header, media, body, and footer sections.
 *
 * @example
 * ```html
 * <eb-card variant="elevated" padding="lg">
 *   <div card-header>
 *     <h3>Card Title</h3>
 *   </div>
 *   <div card-body>
 *     <p>Card content goes here.</p>
 *   </div>
 *   <div card-footer>
 *     <eb-button variant="primary" ariaLabel="Learn more">Learn More</eb-button>
 *   </div>
 * </eb-card>
 * ```
 */
@Component({
  selector: 'eb-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  /**
   * Visual variant of the card
   * - default: Standard card with subtle elevation
   * - elevated: Prominent card with stronger shadow
   * - outlined: Flat card with defined border
   * - filled: Card with colored background
   */
  readonly variant = input<CardVariant>('default');

  /**
   * Padding size for card sections
   * - none: No padding (0)
   * - sm: Small padding (12px)
   * - md: Medium padding (16px header/footer, 24px body) - default
   * - lg: Large padding (24px header/footer, 32px body)
   */
  readonly padding = input<CardPadding>('md');

  /**
   * Whether the entire card is clickable
   * When true, the card becomes interactive and emits click events
   */
  readonly clickable = input<boolean>(false);

  /**
   * Whether the card shows hover effects
   * Applies hover styles when mouse hovers over the card
   */
  readonly hoverable = input<boolean>(true);

  /**
   * Whether the card takes full width of container
   */
  readonly fullWidth = input<boolean>(false);

  /**
   * ARIA label for the card
   * Recommended for clickable cards to provide context
   */
  readonly ariaLabel = input<string | undefined>(undefined);

  /**
   * ID of element that labels the card
   */
  readonly ariaLabelledBy = input<string | undefined>(undefined);

  /**
   * ID of element that describes the card
   */
  readonly ariaDescribedBy = input<string | undefined>(undefined);

  /**
   * ARIA role override
   * Defaults to 'article' for non-clickable cards, 'button' for clickable cards
   */
  readonly role = input<string | undefined>(undefined);

  /**
   * Emitted when a clickable card is clicked
   */
  readonly clicked = output<MouseEvent>();

  /**
   * Whether the card is interactive (clickable)
   */
  readonly isInteractive = computed(() => this.clickable());

  /**
   * Computed CSS classes for the card
   */
  readonly cardClasses = computed(() => this._getCardClasses());

  /**
   * Computed ARIA role based on clickable state
   */
  readonly cardRole = computed(() => this._getCardRole());

  /**
   * Computed tabindex value (0 for clickable, undefined otherwise)
   */
  readonly tabIndexValue = computed(() => (this.clickable() ? 0 : undefined));

  /**
   * Handle card click events
   * Only emits if card is clickable
   */
  handleClick(event: MouseEvent): void {
    if (this.isInteractive()) {
      this.clicked.emit(event);
    }
  }

  /**
   * Handle keyboard events for clickable cards
   * Activates card on Enter or Space key
   */
  handleKeydown(event: KeyboardEvent): void {
    if (this.isInteractive() && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.clicked.emit(event as unknown as MouseEvent);
    }
  }

  /**
   * Generate BEM CSS classes based on component state
   */
  private _getCardClasses(): string {
    const classes = ['card'];

    // Variant class
    classes.push(`card--${this.variant()}`);

    // Padding class
    classes.push(`card--padding-${this.padding()}`);

    // State classes
    if (this.clickable()) {
      classes.push('card--clickable');
    }
    if (this.hoverable()) {
      classes.push('card--hoverable');
    }
    if (this.fullWidth()) {
      classes.push('card--full-width');
    }

    return classes.join(' ');
  }

  /**
   * Get appropriate ARIA role based on state
   */
  private _getCardRole(): string {
    const role = this.role();
    if (role != null) return role;
    if (this.clickable()) return 'button';
    return 'article';
  }
}
