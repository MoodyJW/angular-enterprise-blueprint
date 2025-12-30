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

import { InputFooterComponent } from '@shared/components/input-footer';
import { UniqueIdService } from '@shared/services/unique-id';

export type TextareaVariant = 'default' | 'filled' | 'outlined';
export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaValidationState = 'default' | 'success' | 'warning' | 'error';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

/**
 * Accessible textarea component with validation states and comprehensive features.
 * Follows WCAG 2.1 AAA guidelines and integrates with the theme system.
 *
 * @example
 * ```html
 * <!-- Basic textarea -->
 * <eb-textarea
 *   label="Message"
 *   [(value)]="message"
 *   ariaLabel="Enter your message"
 * />
 *
 * <!-- Textarea with validation -->
 * <eb-textarea
 *   label="Comments"
 *   [(value)]="comments"
 *   validationState="error"
 *   helperText="Comments are required"
 *   ariaLabel="Enter your comments"
 * />
 *
 * <!-- Textarea with auto-resize -->
 * <eb-textarea
 *   label="Description"
 *   [(value)]="description"
 *   [rows]="3"
 *   [autoResize]="true"
 *   ariaLabel="Enter project description"
 * />
 * ```
 */
@Component({
  selector: 'eb-textarea',
  imports: [CommonModule, FormsModule, InputFooterComponent],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
/**
 * Accessible Textarea component with full feature set for forms.
 *
 * Provides helper text, validation states, character counting, and
 * auto-resize functionality. All public inputs use `input()` signals and events
 * are exposed via `output()` for integration with parent forms and stores.
 */
export class TextareaComponent implements ControlValueAccessor {
  /**
   * Visual variant of the textarea
   * - default: Standard textarea with border
   * - filled: Textarea with background fill
   * - outlined: Textarea with prominent outline
   */
  readonly variant = input<TextareaVariant>('default');

  /**
   * Size of the textarea
   * - sm: Smaller text (14px font)
   * - md: Medium text (16px font, default)
   * - lg: Larger text (18px font)
   */
  readonly size = input<TextareaSize>('md');

  /**
   * Current value of the textarea
   * Two-way bindable with [(value)]
   */
  readonly value = input<string>('');

  /**
   * Label text displayed above the textarea
   */
  readonly label = input<string>('');

  /**
   * Placeholder text shown when textarea is empty
   */
  readonly placeholder = input<string>('');

  /**
   * Name attribute for native form submissions.
   * Required when using traditional HTML form submission (e.g., with Formspree)
   */
  readonly name = input<string>('');

  /**
   * Helper text displayed below the textarea
   * Can be used for instructions or validation messages
   */
  readonly helperText = input<string>('');

  /**
   * Validation state of the textarea
   * - default: No validation styling
   * - success: Valid state (green)
   * - warning: Warning state (yellow)
   * - error: Error state (red)
   */
  readonly validationState = input<TextareaValidationState>('default');

  /**
   * Whether the textarea is disabled
   */
  readonly disabled = input<boolean>(false);

  /**
   * Whether the textarea is readonly
   */
  readonly readonly = input<boolean>(false);

  /**
   * Whether the textarea is required
   */
  readonly required = input<boolean>(false);

  /**
   * Number of visible text rows
   * Default: 4
   */
  readonly rows = input<number>(4);

  /**
   * Maximum number of visible text rows (for auto-resize)
   * Only applies when autoResize is true
   */
  readonly maxRows = input<number | undefined>(undefined);

  /**
   * Minimum number of visible text rows (for auto-resize)
   * Only applies when autoResize is true
   * Default: Same as rows value
   */
  readonly minRows = input<number | undefined>(undefined);

  /**
   * Maximum length of textarea value
   */
  readonly maxLength = input<number | undefined>(undefined);

  /**
   * Minimum length of textarea value
   */
  readonly minLength = input<number | undefined>(undefined);

  /**
   * Whether to show character count
   * Only works when maxLength is set
   */
  readonly showCharCount = input<boolean>(false);

  /**
   * Whether the textarea should take full width of container
   */
  readonly fullWidth = input<boolean>(false);

  /**
   * Resize behavior of the textarea
   * - none: User cannot resize
   * - vertical: User can resize vertically only (default)
   * - horizontal: User can resize horizontally only
   * - both: User can resize in both directions
   */
  readonly resize = input<TextareaResize>('vertical');

  /**
   * Whether to automatically resize the textarea based on content
   * When enabled, textarea grows/shrinks to fit content
   */
  readonly autoResize = input<boolean>(false);

  /**
   * ARIA label for the textarea (REQUIRED for accessibility)
   */
  readonly ariaLabel = input.required<string>();

  /**
   * ID of element that describes the textarea
   */
  readonly ariaDescribedBy = input<string | undefined>(undefined);

  /**
   * Whether the textarea value is invalid
   * Used for ARIA attributes
   */
  readonly ariaInvalid = input<boolean>(false);

  /**
   * Emitted when the textarea value changes
   * Used for two-way binding with [(value)]
   */
  readonly valueChange = output<string>();

  /**
   * Emitted when the textarea receives focus
   */
  readonly focused = output<FocusEvent>();

  /**
   * Emitted when the textarea loses focus
   */
  readonly blurred = output<FocusEvent>();

  /**
   * Reference to the native textarea element
   */
  readonly textareaElement = viewChild<ElementRef<HTMLTextAreaElement>>('textareaElement');

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
    const classes = ['textarea-helper-text'];
    const state = this.validationState();

    if (state === 'success') classes.push('textarea-helper-text--success');
    if (state === 'warning') classes.push('textarea-helper-text--warning');
    if (state === 'error') classes.push('textarea-helper-text--error');

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
   * Computed CSS classes for the textarea wrapper
   */
  readonly wrapperClasses = computed(() => this._getWrapperClasses());

  /**
   * Computed CSS classes for the textarea element
   */
  readonly textareaClasses = computed(() => this._getTextareaClasses());

  /**
   * Computed ID for helper text element
   */
  readonly helperTextId = computed(() => {
    const helperText = this.helperText();
    return helperText.length > 0 ? this.uniqueIdService.generateId('textarea-helper') : undefined;
  });

  /**
   * Computed ID for label element
   */
  readonly labelId = computed(() => {
    const label = this.label();
    return label.length > 0 ? this.uniqueIdService.generateId('textarea-label') : undefined;
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
    if (this.autoResize()) {
      this._adjustHeight();
    }
  });

  /**
   * Effect to trigger auto-resize when autoResize option changes
   */
  private readonly _syncAutoResize = effect(() => {
    if (this.autoResize()) {
      this._adjustHeight();
    }
  });

  /**
   * Handle textarea value changes
   */
  handleInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const newValue = target.value;
    this.internalValue.set(newValue);
    this.valueChange.emit(newValue);
    this._onChange(newValue);

    if (this.autoResize()) {
      this._adjustHeight();
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
    this._onTouched();
  }

  /**
   * Focus the textarea programmatically
   */
  focus(): void {
    this.textareaElement()?.nativeElement.focus();
  }

  /**
   * Blur the textarea programmatically
   */
  blur(): void {
    this.textareaElement()?.nativeElement.blur();
  }

  /**
   * Select all text in the textarea
   */
  select(): void {
    this.textareaElement()?.nativeElement.select();
  }

  // ControlValueAccessor implementation
  writeValue(value: unknown): void {
    this.internalValue.set(typeof value === 'string' ? value : '');
    // Adjust height after value update if autoResize is enabled
    if (this.autoResize()) {
      setTimeout(() => {
        this._adjustHeight();
      }, 0);
    }
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
    const classes = ['textarea-wrapper'];

    // Size class
    classes.push(`textarea-wrapper--${this.size()}`);

    // Full width modifier
    if (this.fullWidth()) {
      classes.push('textarea-wrapper--full-width');
    }

    return classes.join(' ');
  }

  /**
   * Generate BEM CSS classes for the textarea element
   */
  private _getTextareaClasses(): string {
    const classes = ['textarea'];

    // Variant class
    classes.push(`textarea--${this.variant()}`);

    // Size class
    classes.push(`textarea--${this.size()}`);

    // Resize class
    classes.push(`textarea--resize-${this.resize()}`);

    // Auto-resize modifier
    if (this.autoResize()) {
      classes.push('textarea--auto-resize');
    }

    // Validation state class
    const validation = this.validationState();
    if (validation !== 'default') {
      classes.push(`textarea--${validation}`);
    }

    // State classes
    if (this.isDisabled()) {
      classes.push('textarea--disabled');
    }
    if (this.readonly()) {
      classes.push('textarea--readonly');
    }
    if (this.isFocused()) {
      classes.push('textarea--focused');
    }

    return classes.join(' ');
  }

  /**
   * Adjust textarea height based on content (for auto-resize)
   */
  private _adjustHeight(): void {
    const element = this.textareaElement()?.nativeElement;
    if (!element) return;

    // Reset height to calculate scrollHeight properly
    element.style.height = 'auto';

    // Calculate new height based on content
    const scrollHeight = element.scrollHeight;
    const minHeight = this._calculateMinHeight();
    const maxHeight = this._calculateMaxHeight();

    let newHeight = scrollHeight;

    if (minHeight !== undefined) {
      newHeight = Math.max(newHeight, minHeight);
    }

    if (maxHeight !== undefined) {
      newHeight = Math.min(newHeight, maxHeight);
    }

    element.style.height = `${String(newHeight)}px`;
  }

  /**
   * Calculate minimum height based on minRows
   */
  private _calculateMinHeight(): number | undefined {
    const minRowsValue = this.minRows() ?? this.rows();

    const element = this.textareaElement()?.nativeElement;
    if (!element) return undefined;

    const computedStyle = this._safeGetComputedStyle(element);
    if (!computedStyle) return undefined;

    const lineHeight = parseFloat(computedStyle.lineHeight !== '' ? computedStyle.lineHeight : '0');
    const paddingTop = parseFloat(computedStyle.paddingTop !== '' ? computedStyle.paddingTop : '0');
    const paddingBottom = parseFloat(
      computedStyle.paddingBottom !== '' ? computedStyle.paddingBottom : '0',
    );
    const borderTop = parseFloat(
      computedStyle.borderTopWidth !== '' ? computedStyle.borderTopWidth : '0',
    );
    const borderBottom = parseFloat(
      computedStyle.borderBottomWidth !== '' ? computedStyle.borderBottomWidth : '0',
    );

    return minRowsValue * lineHeight + paddingTop + paddingBottom + borderTop + borderBottom;
  }

  /**
   * Calculate maximum height based on maxRows
   */
  private _calculateMaxHeight(): number | undefined {
    const maxRowsValue = this.maxRows();
    if (maxRowsValue === undefined) return undefined;

    const element = this.textareaElement()?.nativeElement;
    if (!element) return undefined;

    const computedStyle = this._safeGetComputedStyle(element);
    if (!computedStyle) return undefined;

    const lineHeight = parseFloat(computedStyle.lineHeight !== '' ? computedStyle.lineHeight : '0');
    const paddingTop = parseFloat(computedStyle.paddingTop !== '' ? computedStyle.paddingTop : '0');
    const paddingBottom = parseFloat(
      computedStyle.paddingBottom !== '' ? computedStyle.paddingBottom : '0',
    );
    const borderTop = parseFloat(
      computedStyle.borderTopWidth !== '' ? computedStyle.borderTopWidth : '0',
    );
    const borderBottom = parseFloat(
      computedStyle.borderBottomWidth !== '' ? computedStyle.borderBottomWidth : '0',
    );

    return maxRowsValue * lineHeight + paddingTop + paddingBottom + borderTop + borderBottom;
  }

  /**
   * Safely get computed style for environments where `window` may be undefined (SSR/tests).
   */
  private _safeGetComputedStyle(element: HTMLElement): CSSStyleDeclaration | null {
    if (typeof globalThis === 'undefined') return null;

    const g = globalThis as typeof globalThis & {
      getComputedStyle?: (e: Element) => CSSStyleDeclaration;
    };

    if (typeof g.getComputedStyle !== 'function') return null;

    try {
      return g.getComputedStyle(element);
    } catch {
      return null;
    }
  }
}
