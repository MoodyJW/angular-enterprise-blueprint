import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { IconComponent } from '../../icon/icon.component';

/**
 * Select option subcomponent
 *
 * Displays an individual option in the dropdown list.
 */
@Component({
  selector: 'eb-select-option',
  imports: [CommonModule, IconComponent],
  styleUrl: './select-option.component.scss',
  template: `
    <li
      [class]="optionClass()"
      [class.select-option--selected]="isSelected()"
      [class.select-option--disabled]="isDisabled()"
      [class.select-option--highlighted]="isHighlighted()"
      role="option"
      [tabindex]="isDisabled() ? -1 : 0"
      [attr.aria-selected]="isSelected()"
      [attr.aria-disabled]="isDisabled() ? 'true' : undefined"
      [attr.data-index]="index()"
      (click)="clicked.emit()"
      (keydown.enter)="enterPressed.emit()"
      (keydown.space)="spacePressed.emit()"
      (mouseenter)="mouseEntered.emit()"
    >
      @if (isMultiple()) {
        <span class="select-option__checkbox" [attr.aria-hidden]="true">
          @if (isSelected()) {
            <eb-icon [name]="'heroCheck'" [size]="'sm'" [ariaHidden]="true" />
          }
        </span>
      }
      @if (!isMultiple() && isSelected()) {
        <span class="select-option__check" [attr.aria-hidden]="true">
          <eb-icon [name]="'heroCheck'" [size]="'sm'" [ariaHidden]="true" />
        </span>
      }

      <span class="select-option__content">
        <span class="select-option__label">{{ label() }}</span>
        @if (description()) {
          <span class="select-option__description">{{ description() }}</span>
        }
      </span>
    </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionComponent {
  // Inputs
  readonly optionClass = input<string>('select-option');
  readonly isSelected = input.required<boolean>();
  readonly isDisabled = input.required<boolean>();
  readonly isHighlighted = input.required<boolean>();
  readonly isMultiple = input.required<boolean>();
  readonly index = input.required<number>();
  readonly label = input.required<string>();
  readonly description = input<string | undefined>(undefined);

  // Outputs
  readonly clicked = output();
  readonly enterPressed = output();
  readonly spacePressed = output();
  readonly mouseEntered = output();
}
