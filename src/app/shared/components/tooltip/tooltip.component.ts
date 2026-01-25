import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left' | 'auto';

/**
 * Calculated position coordinates for tooltip placement.
 */
interface TooltipCoordinates {
  top: number;
  left: number;
  position: TooltipPosition;
}

/**
 * Tooltip component that displays contextual information.
 * Automatically positions itself based on available viewport space.
 * Follows WCAG 2.1 AA guidelines for accessibility.
 *
 * Note: This component is typically created dynamically by the TooltipDirective.
 * Direct usage is possible but not recommended.
 */
@Component({
  selector: 'eb-tooltip',
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.top]': 'tooltipStyles().top',
    '[style.left]': 'tooltipStyles().left',
    role: 'tooltip',
    '[attr.aria-hidden]': '"false"',
  },
})
export class TooltipComponent {
  private readonly _elementRef = inject(ElementRef);

  /**
   * The tooltip text content
   */
  readonly content = input.required<string>();

  /**
   * Preferred position of the tooltip
   */
  readonly position = input<TooltipPosition>('auto');

  /**
   * The host element to position relative to
   */
  readonly hostElement = input.required<HTMLElement>();

  /**
   * Reference to the tooltip element
   */
  private readonly _tooltipElement = viewChild<ElementRef<HTMLDivElement>>('tooltipElement');

  /**
   * Computed tooltip position coordinates
   */
  readonly tooltipCoordinates = signal<TooltipCoordinates>({
    top: 0,
    left: 0,
    position: 'top',
  });

  /**
   * Computed CSS classes
   */
  readonly tooltipClasses = computed(() => this._getTooltipClasses());

  /**
   * Computed inline styles for positioning
   */
  readonly tooltipStyles = computed(() => {
    const coords = this.tooltipCoordinates();
    return {
      top: `${String(coords.top)}px`,
      left: `${String(coords.left)}px`,
    };
  });

  /**
   * Offset from the host element in pixels
   */
  private readonly _offset = 8;

  constructor() {
    // Calculate position when component is rendered or host element changes
    effect(() => {
      const tooltipEl = this._tooltipElement();
      const hostEl = this.hostElement();

      // We need the inner element to be rendered before calculating position
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
      if (tooltipEl && hostEl) {
        // Use setTimeout to ensure the element is fully rendered and styled
        setTimeout(() => {
          this._calculatePosition();
        }, 0);
      }
    });
  }

  /**
   * Calculate the optimal position for the tooltip
   */
  private _calculatePosition(): void {
    const tooltipEl = this._tooltipElement();
    const hostEl = this.hostElement();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
    if (!tooltipEl || !hostEl) {
      return;
    }

    // Get the bounding rect of the :host element (this component's element)
    const tooltipHostElement = this._elementRef.nativeElement as HTMLElement;
    const hostRect = hostEl.getBoundingClientRect();
    const tooltipRect = tooltipHostElement.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const preferredPosition = this.position();
    let finalPosition: TooltipPosition = preferredPosition;

    // If position is auto, determine the best position
    if (preferredPosition === 'auto') {
      finalPosition = this._determineAutoPosition(
        hostRect,
        tooltipRect,
        viewportWidth,
        viewportHeight,
      );
    } else {
      // Check if preferred position fits, otherwise find alternative
      if (
        !this._positionFits(preferredPosition, hostRect, tooltipRect, viewportWidth, viewportHeight)
      ) {
        finalPosition = this._findAlternativePosition(
          preferredPosition,
          hostRect,
          tooltipRect,
          viewportWidth,
          viewportHeight,
        );
      }
    }

    // Calculate coordinates based on final position
    const coords = this._calculateCoordinates(finalPosition, hostRect, tooltipRect);

    this.tooltipCoordinates.set({
      ...coords,
      position: finalPosition,
    });
  }

  /**
   * Determine the best automatic position
   */
  private _determineAutoPosition(
    hostRect: DOMRect,
    tooltipRect: DOMRect,
    viewportWidth: number,
    viewportHeight: number,
  ): TooltipPosition {
    const positions: TooltipPosition[] = ['top', 'bottom', 'right', 'left'];

    // Find the first position that fits
    for (const pos of positions) {
      if (this._positionFits(pos, hostRect, tooltipRect, viewportWidth, viewportHeight)) {
        return pos;
      }
    }

    // Default to top if nothing fits perfectly
    return 'top';
  }

  /**
   * Check if a position fits within the viewport
   */
  private _positionFits(
    position: TooltipPosition,
    hostRect: DOMRect,
    tooltipRect: DOMRect,
    viewportWidth: number,
    viewportHeight: number,
  ): boolean {
    const coords = this._calculateCoordinates(position, hostRect, tooltipRect);
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;

    const fitsHorizontally = coords.left >= 0 && coords.left + tooltipWidth <= viewportWidth;
    const fitsVertically = coords.top >= 0 && coords.top + tooltipHeight <= viewportHeight;

    return fitsHorizontally && fitsVertically;
  }

  /**
   * Find an alternative position if preferred doesn't fit
   */
  private _findAlternativePosition(
    preferredPosition: TooltipPosition,
    hostRect: DOMRect,
    tooltipRect: DOMRect,
    viewportWidth: number,
    viewportHeight: number,
  ): TooltipPosition {
    // Try opposite position first
    const opposites: Record<TooltipPosition, TooltipPosition> = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
      auto: 'top',
    };

    const opposite = opposites[preferredPosition];
    if (this._positionFits(opposite, hostRect, tooltipRect, viewportWidth, viewportHeight)) {
      return opposite;
    }

    // Try other positions
    const positions: TooltipPosition[] = ['top', 'bottom', 'right', 'left'];
    for (const pos of positions) {
      if (pos !== preferredPosition && pos !== opposite) {
        if (this._positionFits(pos, hostRect, tooltipRect, viewportWidth, viewportHeight)) {
          return pos;
        }
      }
    }

    // Return preferred if nothing else works
    return preferredPosition;
  }

  /**
   * Calculate coordinates for a specific position
   */
  private _calculateCoordinates(
    position: TooltipPosition,
    hostRect: DOMRect,
    tooltipRect: DOMRect,
  ): { top: number; left: number } {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = hostRect.top + scrollY - tooltipRect.height - this._offset;
        left = hostRect.left + scrollX + hostRect.width / 2 - tooltipRect.width / 2;
        break;

      case 'bottom':
        top = hostRect.bottom + scrollY + this._offset;
        left = hostRect.left + scrollX + hostRect.width / 2 - tooltipRect.width / 2;
        break;

      case 'left':
        top = hostRect.top + scrollY + hostRect.height / 2 - tooltipRect.height / 2;
        left = hostRect.left + scrollX - tooltipRect.width - this._offset;
        break;

      case 'right':
        top = hostRect.top + scrollY + hostRect.height / 2 - tooltipRect.height / 2;
        left = hostRect.right + scrollX + this._offset;
        break;
    }

    return { top, left };
  }

  /**
   * Generate BEM CSS classes
   */
  private _getTooltipClasses(): string {
    const classes = ['tooltip'];
    const position = this.tooltipCoordinates().position;

    classes.push(`tooltip--${position}`);

    return classes.join(' ');
  }
}
