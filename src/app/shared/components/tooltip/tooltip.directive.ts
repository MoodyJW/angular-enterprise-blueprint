import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  Directive,
  effect,
  ElementRef,
  EnvironmentInjector,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';

import { TooltipComponent } from './tooltip.component';

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left' | 'auto';

/**
 * Directive that adds an accessible tooltip to any element.
 * Shows on hover and keyboard focus, follows WCAG 2.1 AA guidelines.
 *
 * @example
 * ```html
 * <!-- Simple tooltip -->
 * <button ebTooltip="Save your changes">Save</button>
 *
 * <!-- Tooltip with position -->
 * <button ebTooltip="Delete item" tooltipPosition="top">Delete</button>
 *
 * <!-- Disabled tooltip -->
 * <button ebTooltip="Not available" [tooltipDisabled]="true">Action</button>
 *
 * <!-- Tooltip with delay -->
 * <span ebTooltip="Helpful info" [tooltipShowDelay]="500">Hover me</span>
 * ```
 */
@Directive({
  selector: '[ebTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _appRef = inject(ApplicationRef);
  private readonly _injector = inject(EnvironmentInjector);

  /**
   * The tooltip text content (REQUIRED)
   */
  readonly ebTooltip = input.required<string>();

  /**
   * Position of the tooltip relative to the host element
   * - auto: Automatically positions based on available space (default)
   * - top: Above the element
   * - right: To the right of the element
   * - bottom: Below the element
   * - left: To the left of the element
   */
  readonly tooltipPosition = input<TooltipPosition>('auto');

  /**
   * Whether the tooltip is disabled
   */
  readonly tooltipDisabled = input<boolean>(false);

  /**
   * Delay in milliseconds before showing the tooltip
   */
  readonly tooltipShowDelay = input<number>(200);

  /**
   * Delay in milliseconds before hiding the tooltip
   */
  readonly tooltipHideDelay = input<number>(0);

  /**
   * Whether to automatically set aria-label on the host element
   * Set to false if the host element already handles accessibility or delegates it to children
   */
  readonly tooltipSetAriaLabel = input<boolean>(true);

  /**
   * Whether to show the tooltip
   */
  private readonly _isVisible = signal<boolean>(false);

  /**
   * Reference to the dynamically created tooltip component
   */
  private _tooltipComponentRef: ComponentRef<TooltipComponent> | null = null;

  /**
   * Timer for show delay
   */
  private _showTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Timer for hide delay
   */
  private _hideTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Host element
   */
  private get _hostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  constructor() {
    // Set up ARIA attributes on the host element
    effect(() => {
      const tooltipText = this.ebTooltip();
      if (tooltipText !== '' && this.tooltipSetAriaLabel()) {
        this._hostElement.setAttribute('aria-label', tooltipText);
      }
    });

    // Set up event listeners
    this._setupEventListeners();
  }

  ngOnDestroy(): void {
    this._destroyTooltip();
    this._clearTimers();
    this._removeEventListeners();
  }

  /**
   * Set up event listeners for hover and focus
   */
  private _setupEventListeners(): void {
    this._hostElement.addEventListener('mouseenter', this._handleMouseEnter);
    this._hostElement.addEventListener('mouseleave', this._handleMouseLeave);
    this._hostElement.addEventListener('focus', this._handleFocus);
    this._hostElement.addEventListener('blur', this._handleBlur);
  }

  /**
   * Remove event listeners
   */
  private _removeEventListeners(): void {
    this._hostElement.removeEventListener('mouseenter', this._handleMouseEnter);
    this._hostElement.removeEventListener('mouseleave', this._handleMouseLeave);
    this._hostElement.removeEventListener('focus', this._handleFocus);
    this._hostElement.removeEventListener('blur', this._handleBlur);
  }

  /**
   * Handle mouse enter event
   */
  private _handleMouseEnter = (): void => {
    this._show();
  };

  /**
   * Handle mouse leave event
   */
  private _handleMouseLeave = (): void => {
    this._hide();
  };

  /**
   * Handle focus event
   */
  private _handleFocus = (): void => {
    this._show();
  };

  /**
   * Handle blur event
   */
  private _handleBlur = (): void => {
    this._hide();
  };

  /**
   * Show the tooltip with delay
   */
  private _show(): void {
    if (this.tooltipDisabled() || this.ebTooltip() === '') {
      return;
    }

    this._clearTimers();

    this._showTimer = setTimeout(() => {
      this._createTooltip();
      this._isVisible.set(true);
    }, this.tooltipShowDelay());
  }

  /**
   * Hide the tooltip with delay
   */
  private _hide(): void {
    this._clearTimers();

    this._hideTimer = setTimeout(() => {
      this._isVisible.set(false);
      this._destroyTooltip();
    }, this.tooltipHideDelay());
  }

  /**
   * Create and attach the tooltip component
   */
  private _createTooltip(): void {
    if (this._tooltipComponentRef) {
      return;
    }

    // Create the tooltip component dynamically
    this._tooltipComponentRef = createComponent(TooltipComponent, {
      environmentInjector: this._injector,
    });

    // Set component inputs
    this._tooltipComponentRef.setInput('content', this.ebTooltip());
    this._tooltipComponentRef.setInput('position', this.tooltipPosition());
    this._tooltipComponentRef.setInput('hostElement', this._hostElement);

    // Attach to the application
    this._appRef.attachView(this._tooltipComponentRef.hostView);

    // Append to body
    const tooltipElement = this._tooltipComponentRef.location.nativeElement as HTMLElement;
    document.body.appendChild(tooltipElement);

    // Trigger change detection to ensure the component is rendered
    this._tooltipComponentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Destroy the tooltip component
   */
  private _destroyTooltip(): void {
    if (!this._tooltipComponentRef) {
      return;
    }

    this._appRef.detachView(this._tooltipComponentRef.hostView);
    this._tooltipComponentRef.destroy();
    this._tooltipComponentRef = null;
  }

  /**
   * Clear all timers
   */
  private _clearTimers(): void {
    if (this._showTimer) {
      clearTimeout(this._showTimer);
      this._showTimer = null;
    }
    if (this._hideTimer) {
      clearTimeout(this._hideTimer);
      this._hideTimer = null;
    }
  }
}
