import { CommonModule } from '@angular/common';
import type { OnDestroy } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DEBOUNCE_DELAYS, FOCUS_DELAYS } from '@shared/constants';
import { UniqueIdService } from '@shared/services/unique-id';
import { debounce } from '@shared/utilities/debounce-throttle';

import { InputFooterComponent, InputLabelComponent } from '@shared/components/input';

import { SelectButtonComponent } from './select-button/select-button.component';
import { SelectDropdownComponent } from './select-dropdown/select-dropdown.component';

export type SelectVariant = 'default' | 'filled' | 'outlined';
export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectValidationState = 'default' | 'success' | 'warning' | 'error';

export interface SelectOption<T = unknown> {
  /**
   * Display label for the option
   */
  label: string;
  /**
   * Value of the option
   */
  value: T;
  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
  /**
   * Optional description/subtitle for the option
   */
  description?: string;
}

/**
 * Accessible select/dropdown component with validation states and comprehensive features.
 * Follows WCAG 2.1 AAA guidelines and integrates with the theme system.
 *
 * @example
 * ```html
 * <!-- Basic select -->
 * <eb-select
 *   label="Country"
 *   [(value)]="selectedCountry"
 *   [options]="countries"
 *   ariaLabel="Select your country"
 * />
 *
 * <!-- Select with validation -->
 * <eb-select
 *   label="Category"
 *   [(value)]="category"
 *   [options]="categories"
 *   validationState="error"
 *   helperText="Please select a category"
 *   [required]="true"
 *   ariaLabel="Select a category"
 * />
 *
 * <!-- Multiple select -->
 * <eb-select
 *   label="Tags"
 *   [(value)]="tags"
 *   [options]="tagOptions"
 *   [multiple]="true"
 *   ariaLabel="Select tags"
 * />
 * ```
 */
@Component({
  selector: 'eb-select',
  imports: [
    CommonModule,
    FormsModule,
    InputLabelComponent,
    InputFooterComponent,
    SelectButtonComponent,
    SelectDropdownComponent,
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Accessible Select component with full feature set for forms.
 *
 * Provides helper text, validation states, search/filter, multiple selection,
 * and keyboard navigation. All public inputs use `input()` signals and events
 * are exposed via `output()` for integration with parent forms and stores.
 */
export class SelectComponent<T = unknown> implements OnDestroy {
  /**
   * Service for generating unique IDs
   */
  private readonly uniqueIdService = inject(UniqueIdService);

  /**
   * Track pending timers for cleanup
   */
  private readonly pendingTimers: ReturnType<typeof setTimeout>[] = [];

  /**
   * Debounced close function for blur handling
   */
  private readonly debouncedClose = debounce(() => {
    if (!this.isFocused()) {
      this.closeDropdown();
    }
  }, DEBOUNCE_DELAYS.BLUR);

  /**
   * Visual variant of the select
   * - default: Standard select with border
   * - filled: Select with background fill
   * - outlined: Select with prominent outline
   */
  readonly variant = input<SelectVariant>('default');

  /**
   * Size of the select
   * - sm: 32px height, 14px font
   * - md: 40px height, 16px font (default)
   * - lg: 48px height, 18px font
   */
  readonly size = input<SelectSize>('md');

  /**
   * Current value(s) of the select
   * Single value for normal mode, array for multiple mode
   * Two-way bindable with [(value)]
   */
  readonly value = input<T | T[] | null>(null);

  /**
   * Array of options to display in the dropdown
   */
  readonly options = input.required<SelectOption<T>[]>();

  /**
   * Label text displayed above the select
   */
  readonly label = input<string>('');

  /**
   * Placeholder text shown when nothing is selected
   */
  readonly placeholder = input<string>('Select an option');

  /**
   * Helper text displayed below the select
   * Can be used for instructions or validation messages
   */
  readonly helperText = input<string>('');

  /**
   * Validation state of the select
   * - default: No validation styling
   * - success: Valid state (green)
   * - warning: Warning state (yellow)
   * - error: Error state (red)
   */
  readonly validationState = input<SelectValidationState>('default');

  /**
   * Whether the select is disabled
   */
  readonly disabled = input<boolean>(false);

  /**
   * Whether the select is required
   */
  readonly required = input<boolean>(false);

  /**
   * Whether multiple options can be selected
   */
  readonly multiple = input<boolean>(false);

  /**
   * Whether to show a search input to filter options
   */
  readonly searchable = input<boolean>(false);

  /**
   * Whether to show the clear button when a value is selected
   */
  readonly clearable = input<boolean>(false);

  /**
   * Maximum number of items to display before showing scroll
   */
  readonly maxVisibleOptions = input<number>(10);

  /**
   * Whether the select should take full width of container
   */
  readonly fullWidth = input<boolean>(false);

  /**
   * ARIA label for the select (REQUIRED for accessibility)
   */
  readonly ariaLabel = input.required<string>();

  /**
   * ID of element that describes the select
   */
  readonly ariaDescribedBy = input<string | undefined>(undefined);

  /**
   * Whether the select value is invalid
   * Used for ARIA attributes
   */
  readonly ariaInvalid = input<boolean>(false);

  /**
   * Emitted when the select value changes
   * Used for two-way binding with [(value)]
   */
  readonly valueChange = output<T | T[] | null>();

  /**
   * Emitted when the dropdown is opened
   */
  readonly opened = output();

  /**
   * Emitted when the dropdown is closed
   */
  readonly closed = output();

  /**
   * Emitted when the select receives focus
   */
  readonly focused = output<FocusEvent>();

  /**
   * Emitted when the select loses focus
   */
  readonly blurred = output<FocusEvent>();

  /**
   * Reference to the select button component
   */
  readonly selectButton = viewChild<SelectButtonComponent>('selectButton');

  /**
   * Reference to the dropdown component
   */
  readonly searchInput = viewChild<SelectDropdownComponent>('searchInput');

  /**
   * Internal open state
   */
  readonly isOpen = signal<boolean>(false);

  /**
   * Internal focused state
   */
  readonly isFocused = signal<boolean>(false);

  /**
   * Internal search query
   */
  readonly searchQuery = signal<string>('');

  /**
   * Internal highlighted option index (for keyboard navigation)
   */
  readonly highlightedIndex = signal<number>(-1);

  /**
   * Internal value for two-way binding
   */
  readonly internalValue = signal<T | T[] | null>(null);

  /**
   * Filtered options based on search query
   */
  readonly filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allOptions = this.options();

    if (query.length === 0 || !this.searchable()) {
      return allOptions;
    }

    return allOptions.filter(
      (option) =>
        (option.label.toLowerCase().includes(query) ||
          option.description?.toLowerCase().includes(query)) ??
        false,
    );
  });

  /**
   * Selected option(s) for display
   */
  readonly selectedOptions = computed(() => {
    const value = this.internalValue();
    const allOptions = this.options();

    if (value === null || value === undefined) {
      return [];
    }

    if (this.multiple()) {
      const values = Array.isArray(value) ? value : [value];
      return allOptions.filter((opt) => values.includes(opt.value));
    }

    return allOptions.filter((opt) => opt.value === value);
  });

  /**
   * Display text for the select button
   */
  readonly displayText = computed(() => {
    const selected = this.selectedOptions();

    if (selected.length === 0) {
      return this.placeholder();
    }

    if (this.multiple()) {
      return selected.map((opt) => opt.label).join(', ');
    }

    return selected[0]?.label ?? this.placeholder();
  });

  /**
   * Whether the select has a value
   */
  readonly hasValue = computed(() => {
    const value = this.internalValue();
    if (this.multiple()) {
      return Array.isArray(value) && value.length > 0;
    }
    return value !== null && value !== undefined;
  });

  /**
   * Computed helper text CSS classes
   */
  readonly helperTextClasses = computed(() => {
    const classes = ['select__helper-text'];
    const state = this.validationState();

    if (state === 'success') classes.push('select__helper-text--success');
    if (state === 'warning') classes.push('select__helper-text--warning');
    if (state === 'error') classes.push('select__helper-text--error');

    return classes.join(' ');
  });

  /**
   * Whether to show the footer section
   */
  readonly showFooter = computed(() => {
    return !(this.helperText().length === 0);
  });

  /**
   * Computed CSS classes for the select wrapper
   */
  readonly wrapperClasses = computed(() => this._getWrapperClasses());

  /**
   * Computed CSS classes for the select button
   */
  readonly buttonClasses = computed(() => this._getButtonClasses());

  /**
   * Computed CSS classes for the dropdown
   */
  readonly dropdownClasses = computed(() => this._getDropdownClasses());

  /**
   * Computed ID for helper text element
   */
  readonly helperTextId = computed(() => {
    const helperText = this.helperText();
    return helperText.length > 0 ? this.uniqueIdService.generateId('select-helper') : undefined;
  });

  /**
   * Computed ID for label element
   */
  readonly labelId = computed(() => {
    const label = this.label();
    return label.length > 0 ? this.uniqueIdService.generateId('select-label') : undefined;
  });

  /**
   * Computed ID for listbox element
   */
  readonly listboxId = computed(() => this.uniqueIdService.generateId('select-listbox'));

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
   * Toggle the dropdown open/closed
   */
  toggleDropdown(): void {
    if (this.disabled()) return;

    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  /**
   * Open the dropdown
   */
  openDropdown(): void {
    if (this.disabled() || this.isOpen()) return;

    this.isOpen.set(true);
    this.highlightedIndex.set(-1);
    this.searchQuery.set('');
    this.opened.emit();

    // Focus search input if searchable
    if (this.searchable()) {
      const timerId = setTimeout(() => {
        this.searchInput()?.searchInputElement()?.nativeElement.focus();
      }, FOCUS_DELAYS.DROPDOWN);
      this.pendingTimers.push(timerId);
    }
  }

  /**
   * Close the dropdown
   */
  closeDropdown(): void {
    if (!this.isOpen()) return;

    this.isOpen.set(false);
    this.highlightedIndex.set(-1);
    this.searchQuery.set('');
    this.closed.emit();

    // Return focus to button
    this.selectButton()?.buttonElement()?.nativeElement.focus();
  }

  /**
   * Select an option
   */
  selectOption(option: SelectOption<T>): void {
    if (option.disabled ?? false) return;

    if (this.multiple()) {
      const currentValue = Array.isArray(this.internalValue()) ? this.internalValue() : [];
      const values = currentValue as T[];
      const index = values.findIndex((v) => v === option.value);

      let newValue: T[];
      if (index >= 0) {
        // Remove if already selected
        newValue = values.filter((_, i) => i !== index);
      } else {
        // Add if not selected
        newValue = [...values, option.value];
      }

      this.internalValue.set(newValue);
      this.valueChange.emit(newValue);

      // Keep dropdown open for multiple select
      if (this.searchable()) {
        this.searchQuery.set('');
        this.searchInput()?.searchInputElement()?.nativeElement.focus();
      }
    } else {
      this.internalValue.set(option.value);
      this.valueChange.emit(option.value);
      this.closeDropdown();
    }
  }

  /**
   * Check if an option is selected
   */
  isOptionSelected(option: SelectOption<T>): boolean {
    const value = this.internalValue();

    if (value === null || value === undefined) {
      return false;
    }

    if (this.multiple() && Array.isArray(value)) {
      return value.includes(option.value);
    }

    return value === option.value;
  }

  /**
   * Clear the selected value(s)
   */
  clearValue(event: Event): void {
    event.stopPropagation();

    if (this.multiple()) {
      this.internalValue.set([]);
      this.valueChange.emit([]);
    } else {
      this.internalValue.set(null);
      this.valueChange.emit(null);
    }
  }

  /**
   * Handle search input changes
   */
  handleSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.highlightedIndex.set(0); // Reset highlight to first option
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
    // Only blur if focus is moving outside the component
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!(this.selectButton()?.buttonElement()?.nativeElement.contains(relatedTarget) ?? false)) {
      this.isFocused.set(false);
      this.blurred.emit(event);
      // Close dropdown when focus leaves the component (debounced)
      this.debouncedClose();
    }
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(event: KeyboardEvent): void {
    const options = this.filteredOptions();

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!this.isOpen()) {
          event.preventDefault();
          this.openDropdown();
        } else if (this.highlightedIndex() >= 0) {
          event.preventDefault();
          const option = options[this.highlightedIndex()];
          if (!(option.disabled ?? false)) {
            this.selectOption(option);
          }
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.openDropdown();
        } else {
          this.highlightNextOption();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.openDropdown();
        } else {
          this.highlightPreviousOption();
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;

      case 'Home':
        if (this.isOpen()) {
          event.preventDefault();
          this.highlightedIndex.set(0);
        }
        break;

      case 'End':
        if (this.isOpen()) {
          event.preventDefault();
          this.highlightedIndex.set(options.length - 1);
        }
        break;

      case 'Tab':
        if (this.isOpen()) {
          this.closeDropdown();
        }
        break;
    }
  }

  /**
   * Highlight the next option
   */
  private highlightNextOption(): void {
    const options = this.filteredOptions();
    let nextIndex = this.highlightedIndex() + 1;

    // Skip disabled options
    while (nextIndex < options.length && (options[nextIndex]?.disabled ?? false)) {
      nextIndex++;
    }

    if (nextIndex < options.length) {
      this.highlightedIndex.set(nextIndex);
      this.scrollToHighlightedOption();
    }
  }

  /**
   * Highlight the previous option
   */
  private highlightPreviousOption(): void {
    const options = this.filteredOptions();
    let prevIndex = this.highlightedIndex() - 1;

    // Skip disabled options
    while (prevIndex >= 0 && (options[prevIndex]?.disabled ?? false)) {
      prevIndex--;
    }

    if (prevIndex >= 0) {
      this.highlightedIndex.set(prevIndex);
      this.scrollToHighlightedOption();
    }
  }

  /**
   * Scroll the highlighted option into view
   */
  private scrollToHighlightedOption(): void {
    // Implementation would use ViewChild to access the option elements
    // and call scrollIntoView on the highlighted one
    // Simplified for now
  }

  /**
   * Focus the select programmatically
   */
  focus(): void {
    this.selectButton()?.buttonElement()?.nativeElement.focus();
  }

  /**
   * Blur the select programmatically
   */
  blur(): void {
    this.selectButton()?.buttonElement()?.nativeElement.blur();
  }

  /**
   * Generate BEM CSS classes for the wrapper
   */
  private _getWrapperClasses(): string {
    const classes = ['select'];

    // Size class
    classes.push(`select--${this.size()}`);

    // Full width modifier
    if (this.fullWidth()) {
      classes.push('select--full-width');
    }

    return classes.join(' ');
  }

  /**
   * Generate BEM CSS classes for the button element
   */
  private _getButtonClasses(): string {
    const classes = ['select-button'];

    // Variant class
    classes.push(`select-button--${this.variant()}`);

    // Size class
    classes.push(`select-button--${this.size()}`);

    // Validation state class
    const validation = this.validationState();
    if (validation !== 'default') {
      classes.push(`select-button--${validation}`);
    }

    // State classes
    if (this.disabled()) {
      classes.push('select-button--disabled');
    }
    if (this.isFocused()) {
      classes.push('select-button--focused');
    }
    if (this.isOpen()) {
      classes.push('select-button--open');
    }
    if (this.hasValue()) {
      classes.push('select-button--has-value');
    }

    return classes.join(' ');
  }

  /**
   * Generate BEM CSS classes for the dropdown
   */
  private _getDropdownClasses(): string {
    const classes = ['select-dropdown'];

    // Size class
    classes.push(`select-dropdown--${this.size()}`);

    return classes.join(' ');
  }

  /**
   * Cleanup lifecycle hook
   */
  ngOnDestroy(): void {
    // Cancel debounced close
    this.debouncedClose.cancel();

    // Clear all pending timers
    this.pendingTimers.forEach((timerId): void => {
      clearTimeout(timerId);
    });
    this.pendingTimers.length = 0;
  }
}
