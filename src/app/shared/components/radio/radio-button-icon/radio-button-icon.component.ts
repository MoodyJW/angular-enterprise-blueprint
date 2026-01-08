import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { matRadioButtonChecked, matRadioButtonUnchecked } from '@ng-icons/material-icons/baseline';

import { IconComponent } from '@shared/components/icon';
import { ICON_NAMES } from '@shared/constants';

/**
 * Presentational component for the radio button icon.
 * Renders the appropriate Material Icon based on the checked state.
 */
@Component({
  selector: 'eb-radio-button-icon',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <span class="radio-icon-wrapper" aria-hidden="true">
      <eb-icon [name]="iconName()" size="md" [decorative]="true" class="radio-icon" />
    </span>
  `,
  styles: [
    `
      .radio-icon-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }

      .radio-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: currentColor;
        transition: color 0.15s ease-in-out;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      [ICON_NAMES.RADIO_UNCHECKED]: matRadioButtonUnchecked,
      [ICON_NAMES.RADIO_CHECKED]: matRadioButtonChecked,
    }),
  ],
})
export class RadioButtonIconComponent {
  /**
   * Whether the radio button is checked
   */
  readonly checked = input<boolean>(false);

  /**
   * Computed icon name based on state
   */
  readonly iconName = computed(() => {
    return this.checked() ? ICON_NAMES.RADIO_CHECKED : ICON_NAMES.RADIO_UNCHECKED;
  });
}
