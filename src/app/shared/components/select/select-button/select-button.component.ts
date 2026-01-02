import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { heroChevronDown, heroXMark } from '@ng-icons/heroicons/outline';

import { IconComponent } from '@shared/components/icon';
import { ICON_NAMES } from '@shared/constants';

/**
 * Select button subcomponent
 *
 * Displays the main button that toggles the dropdown and shows the selected value(s).
 */
@Component({
  selector: 'eb-select-button',
  imports: [CommonModule, IconComponent],
  styleUrl: './select-button.component.scss',
  template: `
    <button
      #buttonElement
      type="button"
      [id]="buttonId()"
      [class]="buttonClass()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledby()"
      [attr.aria-describedby]="ariaDescribedby()"
      [attr.aria-invalid]="ariaInvalid()"
      [attr.aria-required]="ariaRequired()"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-controls]="ariaControls()"
      (click)="clicked.emit()"
      (focus)="focused.emit($event)"
      (blur)="blurred.emit($event)"
      (keydown)="keydownEvent.emit($event)"
    >
      <span class="select-button__text" [class.select-button__text--placeholder]="!hasValue()">
        {{ displayText() }}
      </span>

      <span class="select-button__icons">
        @if (showClear()) {
          <button
            type="button"
            class="select-button__clear"
            aria-label="Clear selection"
            (click)="clearClicked.emit($event)"
          >
            <eb-icon [name]="iconNames.CLOSE" [size]="'sm'" [ariaHidden]="true" />
          </button>
        }
        <span class="select-button__arrow" [class.select-button__arrow--open]="isOpen()">
          <eb-icon [name]="iconNames.CHEVRON_DOWN" [size]="'sm'" [ariaHidden]="true" />
        </span>
      </span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ heroChevronDown, heroXMark })],
})
export class SelectButtonComponent {
  readonly iconNames = ICON_NAMES;

  /**
   * Reference to the native button element
   */
  readonly buttonElement = viewChild<ElementRef<HTMLButtonElement>>('buttonElement');

  // Inputs
  readonly buttonId = input<string | undefined>(undefined);
  readonly buttonClass = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelledby = input<string | undefined>(undefined);
  readonly ariaDescribedby = input<string | undefined>(undefined);
  readonly ariaInvalid = input<string | undefined>(undefined);
  readonly ariaRequired = input<string | undefined>(undefined);
  readonly isOpen = input.required<boolean>();
  readonly ariaControls = input<string | undefined>(undefined);
  readonly displayText = input.required<string>();
  readonly hasValue = input.required<boolean>();
  readonly showClear = input<boolean>(false);

  // Outputs
  readonly clicked = output();
  readonly clearClicked = output<Event>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly keydownEvent = output<KeyboardEvent>();
}
