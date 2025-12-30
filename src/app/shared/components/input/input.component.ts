import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  type ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { UniqueIdService } from '@shared/services/unique-id';
import { InputFooterComponent } from '../input-footer';

export type InputVariant = 'default' | 'filled' | 'outlined';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number';
export type InputValidationState = 'default' | 'success' | 'warning' | 'error';

/**
 * Accessible input component with validation states and comprehensive features.
 * Follows WCAG 2.1 AAA guidelines and integrates with the theme system.
 *
 * @example
 * ```html
 * <!-- Basic input -->
 * <eb-input
 *   label="Email address"
 *   type="email"
 *   [(value)]="email"
 *   ariaLabel="Enter your email address"
 * />
 *
 * <!-- Input with validation -->
 * <eb-input
 *   label="Username"
 *   [(value)]="username"
 *   validationState="error"
 *   helperText="Username is required"
 *   ariaLabel="Enter your username"
 * />
 *
 * <!-- Input with icon and prefix -->
 * <eb-input
 *   label="Website"
 *   type="url"
 *   [(value)]="website"
 *   prefix="https://"
 *   ariaLabel="Enter your website URL"
 * />
 * ```
 */
@Component({
  selector: 'eb-input',
  imports: [CommonModule, FormsModule, InputFooterComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
/**
 * Accessible Input component with full feature set for forms.
 *
 * Provides helper text, validation states, character counting, and
 * prefix/suffix slots. All public inputs use `input()` signals and events
 * are exposed via `output()` for integration with parent forms and stores.
 */
export class InputComponent implements ControlValueAccessor {
  /**
   * Visual variant of the input
   * - default: Standard input with border
   * - filled: Input with background fill
   * - outlined: Input with prominent outline
   */
  readonly variant = input<InputVariant>('default');

  /**
   * Size of the input
   * - sm: 32px height, 14px font
   * - md: 40px height, 16px font (default)
   * - lg: 48px height, 18px font
   */
  readonly size = input<InputSize>('md');

  /**
   * HTML input type attribute
   */
  readonly type = input<InputType>('text');

  /**
   * Current value of the input
   * Two-way bindable with [(value)]
   */
  readonly value = input<string>('');

  /**
   * Label text displayed above the input
   */
  readonly label = input<string>('');

  /**
   * Placeholder text shown when input is empty
   */
  readonly placeholder = input<string>('');

  /**
   * Name attribute for native form submissions.
   * Required when using traditional HTML form submission (e.g., with Formspree)
   */
  readonly name = input<string>('');

  /**
   * Helper text displayed below the input
   * Can be used for instructions or validation messages
   */
  readonly helperText = input<string>('');

  /**
   * Validation state of the input
   * - default: No validation styling
   * - success: Valid state (green)
   * - warning: Warning state (yellow)
   * - error: Error state (red)
   */
  readonly validationState = input<InputValidationState>('default');

  /**
   * Whether the input is disabled
   */
  readonly disabled = input<boolean>(false);

  /**
   * Whether the input is readonly
   */
  readonly readonly = input<boolean>(false);

  /**
   * Whether the input is required
   */
  readonly required = input<boolean>(false);

  /**
   * Maximum length of input value
   */
  readonly maxLength = input<number | undefined>(undefined);

  /**
   * Minimum length of input value
   */
  readonly minLength = input<number | undefined>(undefined);

  /**
   * Pattern for input validation (regex)
   */
  readonly pattern = input<string | undefined>(undefined);

  /**
   * Autocomplete attribute value
   */
  readonly autocomplete = input<string | undefined>(undefined);

  /**
   * Text or icon displayed before the input
   */
  readonly prefix = input<string | undefined>(undefined);

  /**
   * Text or icon displayed after the input
   */
  readonly suffix = input<string | undefined>(undefined);

  /**
   * Whether to show character count
   * Only works when maxLength is set
   */
  readonly showCharCount = input<boolean>(false);

  /**
   * Whether the input should take full width of container
   */
  readonly fullWidth = input<boolean>(false);

  /**
   * ARIA label for the input (REQUIRED for accessibility)
   */
  readonly ariaLabel = input.required<string>();

  /**
   * ID of element that describes the input
   */
  readonly ariaDescribedBy = input<string | undefined>(undefined);

  /**
   * Whether the input value is invalid
   * Used for ARIA attributes
   */
  readonly ariaInvalid = input<boolean>(false);

  /**
   * Emitted when the input value changes
   * Used for two-way binding with [(value)]
   */
  readonly valueChange = output<string>();

  /**
   * Emitted when the input receives focus
   */
  readonly focused = output<FocusEvent>();

  /**
   * Emitted when the input loses focus
   */
  readonly blurred = output<FocusEvent>();

  /**
   * Emitted when Enter key is pressed
   */
  readonly enterPressed = output<KeyboardEvent>();

  /**
   * Reference to the native input element
   */
  readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('inputElement');

  /**
   * Internal focused state
   */
  readonly isFocused = signal<boolean>(false);

  /**
   * Internal value for two-way binding
   */
  readonly internalValue = signal<string>('');

  /**
   * Internal disabled state from ControlValueAccessor
   */
  private readonly _cvaDisabled = signal<boolean>(false);

  /**
   * Combined disabled state (input or CVA)
   */
  readonly isDisabled = computed(() => this.disabled() || this._cvaDisabled());

  private readonly uniqueIdService = inject(UniqueIdService);

  // CVA callbacks
  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  /**
   * Computed character count text
   */
  readonly charCountText = computed(() => {
    const max = this.maxLength();
    if (max == null || !this.showCharCount()) return '';
    const current = this.internalValue().length;
    return `${String(current)}/${String(max)}`;
  });

  /**
   * Computed helper text CSS classes
   */
  readonly helperTextClasses = computed(() => {
    const classes = ['input-helper-text'];
    const state = this.validationState();

    if (state === 'success') classes.push('input-helper-text--success');
    if (state === 'warning') classes.push('input-helper-text--warning');
    if (state === 'error') classes.push('input-helper-text--error');

    return classes.join(' ');
  });

  /**
   * Whether to show the footer section
   */
  readonly showFooter = computed(() => {
    return (
      !(this.helperText().length === 0) || (this.showCharCount() && !(this.maxLength() == null))
    );
  });

  /**
   * Whether to show character count
   */
  readonly shouldShowCharCount = computed(() => {
    return this.showCharCount() && !(this.maxLength() == null);
  });

  /**
   * Computed CSS classes for the input wrapper
   */
  readonly wrapperClasses = computed(() => this._getWrapperClasses());

  /**
   * Computed CSS classes for the input element
   */
  readonly inputClasses = computed(() => this._getInputClasses());

  /**
   * Computed ID for helper text element
   */
  readonly helperTextId = computed(() => {
    const helperText = this.helperText();
    return helperText.length > 0 ? this.uniqueIdService.generateId('input-helper') : undefined;
  });

  /**
   * Computed ID for label element
   */
  readonly labelId = computed(() => {
    const label = this.label();
    return label.length > 0 ? this.uniqueIdService.generateId('input-label') : undefined;
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
   * Effect to sync value input with internal state
   */
  private readonly _syncValue = effect(() => {
    const value = this.value();
    this.internalValue.set(value);
  });

  /**
   * Handle input value changes
   */
  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    this.internalValue.set(newValue);
    this.valueChange.emit(newValue);
    this._onChange(newValue);
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
    this._onTouched();
  }

  /**
   * Handle keydown events
   */
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.enterPressed.emit(event);
    }
  }

  /**
   * Focus the input programmatically
   */
  focus(): void {
    this.inputElement()?.nativeElement.focus();
  }

  /**
   * Blur the input programmatically
   */
  blur(): void {
    this.inputElement()?.nativeElement.blur();
  }

  /**
   * Select all text in the input
   */
  select(): void {
    this.inputElement()?.nativeElement.select();
  }

  // ControlValueAccessor implementation
  writeValue(value: unknown): void {
    this.internalValue.set(typeof value === 'string' ? value : '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._cvaDisabled.set(isDisabled);
  }

  /**
   * Generate BEM CSS classes for the wrapper
   */
  private _getWrapperClasses(): string {
    const classes = ['input-wrapper'];

    // Size class
    classes.push(`input-wrapper--${this.size()}`);

    // Full width modifier
    if (this.fullWidth()) {
      classes.push('input-wrapper--full-width');
    }

    return classes.join(' ');
  }

  /**
   * Generate BEM CSS classes for the input element
   */
  private _getInputClasses(): string {
    const classes = ['input'];

    // Variant class
    classes.push(`input--${this.variant()}`);

    // Size class
    classes.push(`input--${this.size()}`);

    // Validation state class
    const validation = this.validationState();
    if (validation !== 'default') {
      classes.push(`input--${validation}`);
    }

    // State classes
    if (this.isDisabled()) {
      classes.push('input--disabled');
    }
    if (this.readonly()) {
      classes.push('input--readonly');
    }
    if (this.isFocused()) {
      classes.push('input--focused');
    }
    if (this.prefix() != null) {
      classes.push('input--has-prefix');
    }
    if (this.suffix() != null) {
      classes.push('input--has-suffix');
    }

    return classes.join(' ');
  }
}
