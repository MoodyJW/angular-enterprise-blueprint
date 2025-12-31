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

import { CheckboxCheckmarkComponent } from '@shared/components/checkbox-checkmark';
import { InputFooterComponent } from '@shared/components/input-footer';
import { InputLabelComponent } from '@shared/components/input-label';

export type CheckboxSize = 'sm' | 'md' | 'lg';
export type CheckboxValidationState = 'default' | 'success' | 'warning' | 'error';

/**
 * Accessible checkbox component with validation states and comprehensive features.
 * Follows WCAG 2.1 AAA guidelines and integrates with the theme system.
 *
 * @example
 * ```html
 * <!-- Basic checkbox -->
 * <eb-checkbox
 *   label="Accept terms and conditions"
 *   [(checked)]="accepted"
 *   ariaLabel="Accept terms and conditions"
 * />
 *
 * <!-- Checkbox with validation -->
 * <eb-checkbox
 *   label="Subscribe to newsletter"
 *   [(checked)]="subscribed"
 *   validationState="error"
 *   helperText="This field is required"
 *   ariaLabel="Subscribe to newsletter"
 * />
 *
 * <!-- Indeterminate checkbox -->
 * <eb-checkbox
 *   label="Select all items"
 *   [(checked)]="selectAll"
 *   [indeterminate]="someSelected"
 *   ariaLabel="Select all items"
 * />
 * ```
 */
@Component({
  selector: 'eb-checkbox',
  imports: [
    CommonModule,
    FormsModule,
    CheckboxCheckmarkComponent,
    InputFooterComponent,
    InputLabelComponent,
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
  private readonly uniqueIdService = inject(UniqueIdService);

  /**
   * Size of the checkbox
   * - sm: 16px, 14px font
   * - md: 20px, 16px font (default)
   * - lg: 24px, 18px font
   */
  readonly size = input<CheckboxSize>('md');

  /**
   * Current checked state of the checkbox
   * Two-way bindable with [(checked)]
   */
  readonly checked = input<boolean>(false);

  /**
   * Whether the checkbox is in an indeterminate state
   * Used for "select all" scenarios where some items are selected
   */
  readonly indeterminate = input<boolean>(false);

  /**
   * Label text displayed next to the checkbox
   */
  readonly label = input<string>('');

  /**
   * Helper text displayed below the checkbox
   * Can be used for instructions or validation messages
   */
  readonly helperText = input<string>('');

  /**
   * Validation state of the checkbox
   * - default: No validation styling
   * - success: Valid state (green)
   * - warning: Warning state (yellow)
   * - error: Error state (red)
   */
  readonly validationState = input<CheckboxValidationState>('default');

  /**
   * Whether the checkbox is disabled
   */
  readonly disabled = input<boolean>(false);

  /**
   * Whether the checkbox is required
   */
  readonly required = input<boolean>(false);

  /**
   * Custom value for the checkbox (useful in checkbox groups)
   */
  readonly value = input<string>('');

  /**
   * Name attribute for the checkbox input
   */
  readonly name = input<string>('');

  /**
   * ARIA label for the checkbox (REQUIRED for accessibility)
   */
  readonly ariaLabel = input.required<string>();

  /**
   * ID of element that describes the checkbox
   */
  readonly ariaDescribedBy = input<string | undefined>(undefined);

  /**
   * Whether the checkbox value is invalid
   * Used for ARIA attributes
   */
  readonly ariaInvalid = input<boolean>(false);

  /**
   * Emitted when the checkbox checked state changes
   * Used for two-way binding with [(checked)]
   */
  readonly checkedChange = output<boolean>();

  /**
   * Emitted when the checkbox receives focus
   */
  readonly focused = output<FocusEvent>();

  /**
   * Emitted when the checkbox loses focus
   */
  readonly blurred = output<FocusEvent>();

  /**
   * Reference to the native checkbox input element
   */
  readonly checkboxElement = viewChild<ElementRef<HTMLInputElement>>('checkboxElement');

  /**
   * Internal focused state
   */
  readonly isFocused = signal<boolean>(false);

  /**
   * Unique ID for the checkbox input
   */
  readonly checkboxId = computed(() => this.uniqueIdService.generateId('checkbox'));

  /**
   * Unique ID for the label element
   */
  readonly labelId = computed(() => {
    const label = this.label();
    return label.length > 0 ? this.uniqueIdService.generateId('checkbox-label') : undefined;
  });

  /**
   * Unique ID for the helper text element
   */
  readonly helperTextId = computed(() => {
    const helperText = this.helperText();
    return helperText.length > 0 ? this.uniqueIdService.generateId('checkbox-helper') : undefined;
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
   * Computed CSS classes for the checkbox wrapper
   */
  readonly wrapperClasses = computed(() => this._getWrapperClasses());

  /**
   * Computed CSS classes for the checkbox input
   */
  readonly checkboxClasses = computed(() => this._getCheckboxClasses());

  /**
   * Computed CSS classes for the label
   */
  readonly labelClasses = computed(() => this._getLabelClasses());

  /**
   * Computed CSS classes for helper text
   */
  readonly helperTextClasses = computed(() => {
    const classes = ['checkbox__helper-text'];
    const state = this.validationState();

    if (state === 'success') classes.push('checkbox__helper-text--success');
    if (state === 'warning') classes.push('checkbox__helper-text--warning');
    if (state === 'error') classes.push('checkbox__helper-text--error');

    return classes.join(' ');
  });

  /**
   * Handle checkbox change events
   */
  handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newChecked = target.checked;
    this.checkedChange.emit(newChecked);
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
   * Focus the checkbox programmatically
   */
  focus(): void {
    this.checkboxElement()?.nativeElement.focus();
  }

  /**
   * Blur the checkbox programmatically
   */
  blur(): void {
    this.checkboxElement()?.nativeElement.blur();
  }

  /**
   * Toggle the checkbox state programmatically
   */
  toggle(): void {
    if (!this.disabled()) {
      const newChecked = !this.checked();
      this.checkedChange.emit(newChecked);
    }
  }

  /**
   * Generate BEM CSS classes for the wrapper
   */
  private _getWrapperClasses(): string {
    const classes = ['checkbox'];

    // Size class
    classes.push(`checkbox--${this.size()}`);

    // State classes
    if (this.disabled()) {
      classes.push('checkbox--disabled');
    }

    return classes.join(' ');
  }

  /**
   * Generate BEM CSS classes for the checkbox input
   */
  private _getCheckboxClasses(): string {
    const classes = ['checkbox__control'];

    // Size class
    classes.push(`checkbox__control--${this.size()}`);

    // Validation state class
    const validation = this.validationState();
    if (validation !== 'default') {
      classes.push(`checkbox__control--${validation}`);
    }

    // State classes
    if (this.disabled()) {
      classes.push('checkbox__control--disabled');
    }
    if (this.isFocused()) {
      classes.push('checkbox__control--focused');
    }
    if (this.checked()) {
      classes.push('checkbox__control--checked');
    }
    if (this.indeterminate()) {
      classes.push('checkbox__control--indeterminate');
    }

    return classes.join(' ');
  }

  /**
   * Generate BEM CSS classes for the label
   */
  private _getLabelClasses(): string {
    const classes = ['checkbox__label'];

    // Size class
    classes.push(`checkbox__label--${this.size()}`);

    // State classes
    if (this.disabled()) {
      classes.push('checkbox__label--disabled');
    }
    if (this.required()) {
      classes.push('checkbox__label--required');
    }

    return classes.join(' ');
  }
}
