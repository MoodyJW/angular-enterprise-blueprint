import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';

import { IconComponent } from '@shared/components/icon';
import { SelectOptionComponent } from '../select-option/select-option.component';
import type { SelectOption } from '../select.component';

/**
 * Select dropdown subcomponent
 *
 * Displays the dropdown panel with search input and options list.
 */
@Component({
  selector: 'eb-select-dropdown',
  imports: [CommonModule, IconComponent, SelectOptionComponent],
  styleUrl: './select-dropdown.component.scss',
  template: `
    <div [class]="dropdownClass()" role="presentation">
      @if (searchable()) {
        <div class="select-search">
          <input
            #searchInputElement
            type="text"
            class="select-search__input"
            placeholder="Search..."
            [value]="searchQuery()"
            (input)="searchInput.emit($event)"
            (keydown)="searchKeydown.emit($event)"
            aria-label="Search options"
          />
          <span class="select-search__icon">
            <eb-icon [name]="'heroMagnifyingGlass'" [size]="'sm'" [ariaHidden]="true" />
          </span>
        </div>
      }

      <ul
        [id]="listboxId()"
        class="select-options"
        role="listbox"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-multiselectable]="isMultiple() ? 'true' : undefined"
        [style.max-height.px]="maxHeight()"
      >
        @if (options().length === 0) {
          <li
            class="select-option select-option--empty"
            role="option"
            aria-disabled="true"
            aria-selected="false"
          >
            No options found
          </li>
        }
        @for (option of options(); track option.value; let i = $index) {
          <eb-select-option
            [isSelected]="isOptionSelected()(option)"
            [isDisabled]="option.disabled ?? false"
            [isHighlighted]="highlightedIndex() === i"
            [isMultiple]="isMultiple()"
            [index]="i"
            [label]="option.label"
            [description]="option.description"
            (clicked)="optionClicked.emit(option)"
            (enterPressed)="optionEnterPressed.emit(option)"
            (spacePressed)="optionSpacePressed.emit(option)"
            (mouseEntered)="optionMouseEntered.emit(i)"
          />
        }
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDropdownComponent<T = unknown> {
  /**
   * Reference to the native search input element
   */
  readonly searchInputElement = viewChild<ElementRef<HTMLInputElement>>('searchInputElement');

  // Inputs
  readonly dropdownClass = input.required<string>();
  readonly searchable = input<boolean>(false);
  readonly searchQuery = input<string>('');
  readonly listboxId = input.required<string>();
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly isMultiple = input.required<boolean>();
  readonly maxHeight = input<number>(280);
  readonly options = input.required<SelectOption<T>[]>();
  readonly highlightedIndex = input.required<number>();
  readonly isOptionSelected = input.required<(option: SelectOption<T>) => boolean>();

  // Outputs
  readonly searchInput = output<Event>();
  readonly searchKeydown = output<KeyboardEvent>();
  readonly optionClicked = output<SelectOption<T>>();
  readonly optionEnterPressed = output<SelectOption<T>>();
  readonly optionSpacePressed = output<SelectOption<T>>();
  readonly optionMouseEntered = output<number>();
}
