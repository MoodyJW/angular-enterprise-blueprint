import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UniqueIdService } from '@shared/services/unique-id';

import { InputFooterComponent } from '@shared/components/input-footer';
import { InputLabelComponent } from '@shared/components/input-label';

export type RadioSize = 'sm' | 'md' | 'lg';
export type RadioValidationState = 'default' | 'success' | 'warning' | 'error';

/**
 * Accessible radio button component with validation states and comprehensive features.
 * Follows WCAG 2.1 AAA guidelines and integrates with the theme system.
 *
 * @example
 * ```html
 * <!-- Basic radio button -->
 * <eb-radio
 *   label="Option A"
 *   name="choice"
 *   value="a"
 *   [(checked)]="selected"
 *   ariaLabel="Option A"
 * />
 *
 * <!-- Radio button with validation -->
 * <eb-radio
 *   label="Premium plan"
 *   name="plan"
 *   value="premium"
 *   [(checked)]="selectedPlan"
 *   validationState="error"
 *   helperText="This field is required"
 *   ariaLabel="Premium plan"
 * />
 *
 * <!-- Radio group -->
 * <div role="radiogroup" aria-label="Payment method">
 *   <eb-radio
 *     label="Credit Card"
 *     name="payment"
 *     value="credit"
 *     [(checked)]="paymentMethod"
 *     ariaLabel="Credit Card"
 *   />
 *   <eb-radio
 *     label="PayPal"
 *     name="payment"
 *     value="paypal"
 *     [(checked)]="paymentMethod"
 *     ariaLabel="PayPal"
 *   />
 * </div>
 * ```
 */
@Component({
  selector: 'eb-radio',
  imports: [CommonModule, FormsModule, InputFooterComponent, InputLabelComponent],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent {
  private readonly uniqueIdService = inject(UniqueIdService);

  /**
   * Size of the radio button
   * - sm: 16px, 14px font
   * - md: 20px, 16px font (default)
   * - lg: 24px, 18px font
   */
  readonly size = input<RadioSize>('md');

  /**
   * Current checked state of the radio button
   * Two-way bindable with [(checked)]
   */
  readonly checked = input<boolean>(false);

  /**
   * Label text displayed next to the radio button
   */
  readonly label = input<string>('');

  /**
   * Helper text displayed below the radio button
   * Can be used for instructions or validation messages
   */
  readonly helperText = input<string>('');

  /**
   * Validation state of the radio button
   * - default: No validation styling
   * - success: Valid state (green)
   * - warning: Warning state (yellow)
   * - error: Error state (red)
   */
  readonly validationState = input<RadioValidationState>('default');

  /**
   * Whether the radio button is disabled
   */
  readonly disabled = input<boolean>(false);

  /**
   * Whether the radio button is required
   */
  readonly required = input<boolean>(false);

  /**
   * Value for the radio button (required for radio groups)
   */
  readonly value = input.required<string>();

  /**
   * Name attribute for the radio button input (required for grouping)
   */
  readonly name = input.required<string>();

  /**
   * ARIA label for the radio button (REQUIRED for accessibility)
   */
  readonly ariaLabel = input.required<string>();

  /**
   * ID of element that describes the radio button
   */
  readonly ariaDescribedBy = input<string | undefined>(undefined);

  /**
   * Whether the radio button value is invalid
   * Used for ARIA attributes
   */
  readonly ariaInvalid = input<boolean>(false);

  /**
   * Emitted when the radio button checked state changes
   * Used for two-way binding with [(checked)]
   */
  readonly checkedChange = output<boolean>();

  /**
   * Emitted when the radio button is selected
   * Includes the radio button's value
   */
  readonly selected = output<string>();

  /**
   * Emitted when the radio button receives focus
   */
  readonly focused = output<FocusEvent>();

  /**
   * Emitted when the radio button loses focus
   */
  readonly blurred = output<FocusEvent>();

  /**
   * Reference to the native radio input element
   */
  readonly radioElement = viewChild<ElementRef<HTMLInputElement>>('radioElement');

  /**
   * Internal focused state
   */
  readonly isFocused = signal<boolean>(false);

  /**
   * Unique ID for the radio input
   */
  readonly radioId = computed(() => this.uniqueIdService.generateId('radio'));

  /**
   * Unique ID for the label element
   */
  readonly labelId = computed(() => {
    const label = this.label();
    return label.length > 0 ? this.uniqueIdService.generateId('radio-label') : undefined;
  });

  /**
   * Unique ID for the helper text element
   */
  readonly helperTextId = computed(() => {
    const helperText = this.helperText();
    return helperText.length > 0 ? this.uniqueIdService.generateId('radio-helper') : undefined;
  });

  /**
   * Computed aria-describedby value
   */
  readonly computedAriaDescribedBy = computed(() => {
    const parts: string[] = [];
    const helperTextId = this.helperTextId();
    const userDescribedBy = this.ariaDescribedBy();

    if (helperTextId != null) parts.push(helperTextId);
    if (userDescribedBy != null) parts.push(userDescribedBy);

    return parts.length > 0 ? parts.join(' ') : undefined;
  });

  /**
   * Computed aria-invalid value
   */
  readonly computedAriaInvalid = computed(() => {
    return this.ariaInvalid() || this.validationState() === 'error' ? 'true' : undefined;
  });

  /**
   * Computed CSS classes for the radio wrapper
   */
  readonly wrapperClasses = computed(() => this._getWrapperClasses());

  /**
   * Computed CSS classes for the radio input
   */
  readonly radioClasses = computed(() => this._getRadioClasses());

  /**
   * Computed CSS classes for the label
   */
  readonly labelClasses = computed(() => this._getLabelClasses());

  /**
   * Computed CSS classes for helper text
   */
  readonly helperTextClasses = computed(() => {
    const classes = ['radio__helper-text'];
    const state = this.validationState();

    if (state === 'success') classes.push('radio__helper-text--success');
    if (state === 'warning') classes.push('radio__helper-text--warning');
    if (state === 'error') classes.push('radio__helper-text--error');

    return classes.join(' ');
  });

  /**
   * Handle radio button change events
   */
  handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newChecked = target.checked;
    this.checkedChange.emit(newChecked);
    if (newChecked) {
      this.selected.emit(this.value());
    }
  }

  /**
   * Handle focus events
   */
  handleFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.focused.emit(event);
  }

  /**
   * Handle blur events
   */
  handleBlur(event: FocusEvent): void {
    this.isFocused.set(false);
    this.blurred.emit(event);
  }

  /**
   * Focus the radio button programmatically
   */
  focus(): void {
    this.radioElement()?.nativeElement.focus();
  }

  /**
   * Blur the radio button programmatically
   */
  blur(): void {
    this.radioElement()?.nativeElement.blur();
  }

  /**
   * Select the radio button programmatically
   */
  select(): void {
    if (!this.disabled() && !this.checked()) {
      this.checkedChange.emit(true);
      this.selected.emit(this.value());
    }
  }

  /**
   * Generate BEM CSS classes for the wrapper
   */
  private _getWrapperClasses(): string {
    const classes = ['radio'];

    // Size class
    classes.push(`radio--${this.size()}`);

    // State classes
    if (this.disabled()) {
      classes.push('radio--disabled');
    }

    return classes.join(' ');
  }

  /**
   * Generate BEM CSS classes for the radio input
   */
  private _getRadioClasses(): string {
    const classes = ['radio__control'];

    // Size class
    classes.push(`radio__control--${this.size()}`);

    // Validation state class
    const validation = this.validationState();
    if (validation !== 'default') {
      classes.push(`radio__control--${validation}`);
    }

    // State classes
    if (this.disabled()) {
      classes.push('radio__control--disabled');
    }
    if (this.isFocused()) {
      classes.push('radio__control--focused');
    }
    if (this.checked()) {
      classes.push('radio__control--checked');
    }

    return classes.join(' ');
  }

  /**
   * Generate BEM CSS classes for the label
   */
  private _getLabelClasses(): string {
    const classes = ['radio__label'];

    // Size class
    classes.push(`radio__label--${this.size()}`);

    // State classes
    if (this.disabled()) {
      classes.push('radio__label--disabled');
    }
    if (this.required()) {
      classes.push('radio__label--required');
    }

    return classes.join(' ');
  }
}
