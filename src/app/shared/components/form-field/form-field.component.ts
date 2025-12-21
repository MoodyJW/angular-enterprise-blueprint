import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { AbstractControl } from '@angular/forms';

import { UniqueIdService } from '../../services/unique-id/unique-id.service';

import { InputFooterComponent } from '../input-footer';
import { InputLabelComponent } from '../input-label';

export type FormFieldValidationState = 'default' | 'success' | 'warning' | 'error';

/**
 * Reusable form field wrapper component that provides consistent label and error display.
 * Can be used standalone or integrated with existing form components.
 *
 * Features:
 * - Automatic error detection from Angular FormControl
 * - Manual error message input
 * - Automatic validation state detection
 * - Manual validation state override
 * - Reuses InputLabelComponent and InputFooterComponent
 * - Full WCAG 2.1 AAA accessibility support
 *
 * @example
 * ```html
 * <!-- Standalone usage with content projection -->
 * <eb-form-field
 *   label="Email"
 *   [required]="true"
 *   [control]="emailControl"
 * >
 *   <input type="email" [formControl]="emailControl" />
 * </eb-form-field>
 *
 * <!-- With manual error messages -->
 * <eb-form-field
 *   label="Username"
 *   [errors]="['Username is required', 'Must be at least 3 characters']"
 *   validationState="error"
 * >
 *   <input type="text" />
 * </eb-form-field>
 *
 * <!-- With helper text -->
 * <eb-form-field
 *   label="Password"
 *   helperText="Must be at least 8 characters"
 *   [required]="true"
 * >
 *   <input type="password" />
 * </eb-form-field>
 * ```
 */
@Component({
  selector: 'eb-form-field',
  standalone: true,
  imports: [CommonModule, InputLabelComponent, InputFooterComponent],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  private readonly uniqueIdService = inject(UniqueIdService);

  /**
   * Label text displayed above the form field
   */
  readonly label = input<string>('');

  /**
   * Whether the field is required
   */
  readonly required = input<boolean>(false);

  /**
   * Helper text displayed below the form field
   * Shows when there are no errors
   */
  readonly helperText = input<string>('');

  /**
   * Manual error messages to display
   * Can be a single string or array of strings
   */
  readonly errors = input<string | string[] | null>(null);

  /**
   * Angular FormControl for automatic error detection
   * When provided, errors will be automatically extracted
   */
  readonly control = input<AbstractControl | null>(null);

  /**
   * Manual validation state override
   * When not provided, state is automatically derived from errors or control
   */
  readonly validationState = input<FormFieldValidationState | null>(null);

  /**
   * Whether to show errors only after the field is touched
   * Only applies when using FormControl
   * Default: true
   */
  readonly showErrorsOnTouched = input<boolean>(true);

  /**
   * Custom error messages for specific validation errors
   * Maps validation error keys to user-friendly messages
   *
   * @example
   * ```typescript
   * errorMessages: {
   *   required: 'This field is required',
   *   email: 'Please enter a valid email address',
   *   minlength: 'Must be at least {requiredLength} characters'
   * }
   * ```
   */
  readonly errorMessages = input<Record<string, string>>({});

  /**
   * Additional CSS classes to apply to the form field wrapper
   */
  readonly wrapperClass = input<string>('');

  /**
   * Unique ID for the form field
   */
  readonly fieldId = computed(() => this.uniqueIdService.generateId('form-field'));

  /**
   * Unique ID for the label element
   */
  readonly labelId = computed(() => {
    const label = this.label();
    return label.length > 0 ? this.uniqueIdService.generateId('form-field-label') : undefined;
  });

  /**
   * Unique ID for the error/helper text element
   */
  readonly helperId = computed(() => {
    const hasHelperText = this.helperText().length > 0;
    const hasErrors = this.computedErrors().length > 0;
    return hasHelperText || hasErrors
      ? this.uniqueIdService.generateId('form-field-helper')
      : undefined;
  });

  /**
   * Computed errors from either manual input or FormControl
   */
  readonly computedErrors = computed((): string[] => {
    const manualErrors = this.errors();
    const control = this.control();
    const showOnTouched = this.showErrorsOnTouched();

    // Manual errors take precedence
    if (manualErrors !== null) {
      if (Array.isArray(manualErrors)) {
        const filtered = manualErrors.filter(
          (e): e is string => typeof e === 'string' && e.trim().length > 0,
        );
        return filtered;
      }

      // Treat empty or whitespace-only strings as no errors
      if (typeof manualErrors === 'string') {
        return manualErrors.trim().length > 0 ? [manualErrors] : [];
      }
    }

    // Extract errors from FormControl
    if (control) {
      // Only show errors if control is invalid and (not pristine or touched)
      const shouldShowErrors = showOnTouched ? control.touched || control.dirty : true;

      if (control.invalid && shouldShowErrors && control.errors) {
        return this._extractErrorMessages(control);
      }
    }

    return [];
  });

  /**
   * Computed validation state from errors, control, or manual override
   */
  readonly computedValidationState = computed((): FormFieldValidationState => {
    const manualState = this.validationState();

    // Manual state takes precedence
    if (manualState != null) {
      return manualState;
    }

    // Derive state from errors
    const errors = this.computedErrors();
    if (errors.length > 0) {
      return 'error';
    }

    // Derive state from FormControl
    const control = this.control();
    if (control) {
      if (control.valid && (control.touched || control.dirty)) {
        return 'success';
      }
    }

    return 'default';
  });

  /**
   * Computed text to display in footer (errors or helper text)
   */
  readonly footerText = computed((): string => {
    const errors = this.computedErrors();
    if (errors.length > 0) {
      return errors.join(' ');
    }
    return this.helperText();
  });

  /**
   * Computed CSS classes for the footer text
   */
  readonly footerClasses = computed((): string => {
    const classes = ['form-field-helper-text'];
    const state = this.computedValidationState();

    if (state === 'success') classes.push('form-field-helper-text--success');
    if (state === 'warning') classes.push('form-field-helper-text--warning');
    if (state === 'error') classes.push('form-field-helper-text--error');

    return classes.join(' ');
  });

  /**
   * Computed CSS classes for the wrapper
   */
  readonly wrapperClasses = computed((): string => {
    const classes = ['form-field'];
    const customClass = this.wrapperClass();
    const state = this.computedValidationState();

    if (state !== 'default') {
      classes.push(`form-field--${state}`);
    }

    if (customClass.length > 0) {
      classes.push(customClass);
    }

    return classes.join(' ');
  });

  /**
   * Whether to show the footer section
   */
  readonly showFooter = computed(() => {
    return this.footerText().length > 0;
  });

  /**
   * Extract user-friendly error messages from FormControl
   */
  private _extractErrorMessages(control: AbstractControl): string[] {
    const errors = control.errors;
    if (!errors) return [];

    const messages: string[] = [];
    const customMessages = this.errorMessages();

    for (const [key, value] of Object.entries(errors)) {
      let message = customMessages[key];

      if (typeof message === 'string' && message.length > 0) {
        // Replace placeholders in custom messages
        // e.g., "Must be at least {requiredLength} characters"
        if (typeof value === 'object' && value !== null) {
          message = this._replacePlaceholders(message, value as Record<string, unknown>);
        }
        messages.push(message);
      } else {
        // Provide default messages for common validators
        message = this._getDefaultErrorMessage(key, value);
        if (message.length > 0) {
          messages.push(message);
        }
      }
    }

    return messages;
  }

  /**
   * Replace placeholders in error messages with actual values
   */
  private _replacePlaceholders(message: string, params: Record<string, unknown>): string {
    let result = message;
    for (const [key, value] of Object.entries(params)) {
      const placeholder = `{${key}}`;
      result = result.replace(placeholder, String(value));
    }
    return result;
  }

  /**
   * Get default error message for common validators
   */
  private _getDefaultErrorMessage(key: string, value: unknown): string {
    const getNumberProp = (prop: string): number => {
      const obj = value as Record<string, unknown> | undefined;
      if (obj && Object.prototype.hasOwnProperty.call(obj, prop)) {
        const v = obj[prop];
        return typeof v === 'number' ? v : 0;
      }
      return 0;
    };

    const defaultMessages: Record<string, string> = {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      min: `Value must be at least ${String(getNumberProp('min'))}`,
      max: `Value must be at most ${String(getNumberProp('max'))}`,
      minlength: `Must be at least ${String(getNumberProp('requiredLength'))} characters`,
      maxlength: `Must be at most ${String(getNumberProp('requiredLength'))} characters`,
      pattern: 'Invalid format',
    };

    const dm = defaultMessages[key];
    if (typeof dm === 'string' && dm.length > 0) return dm;
    return `Validation error: ${key}`;
  }
}
