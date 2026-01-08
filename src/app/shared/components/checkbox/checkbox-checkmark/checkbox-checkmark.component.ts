import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  matCheckBox,
  matCheckBoxOutlineBlank,
  matIndeterminateCheckBox,
} from '@ng-icons/material-icons/baseline';

import { IconComponent } from '@shared/components/icon';
import { ICON_NAMES } from '@shared/constants';

/**
 * Reusable checkbox icon component for checkbox states.
 *
 * Displays Material Icons for all checkbox states:
 * - Unchecked: Empty outline box (matCheckBoxOutlineBlank)
 * - Checked: Filled box with checkmark (matCheckBox)
 * - Indeterminate: Box with minus line (matIndeterminateCheckBox)
 *
 * @example
 * ```html
 * <!-- Unchecked state -->
 * <eb-checkbox-checkmark />
 *
 * <!-- Checked state -->
 * <eb-checkbox-checkmark [checked]="true" />
 *
 * <!-- Indeterminate state -->
 * <eb-checkbox-checkmark [indeterminate]="true" />
 * ```
 */
@Component({
  selector: 'eb-checkbox-checkmark',
  imports: [CommonModule, IconComponent],
  template: `
    <span class="checkbox-checkmark" aria-hidden="true">
      <eb-icon [name]="iconName()" size="md" [decorative]="true" class="checkbox-icon" />
    </span>
  `,
  styles: [
    `
      .checkbox-checkmark {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }

      .checkbox-icon {
        display: block;
        color: var(--checkbox-icon-color, var(--color-text-muted));
        transition:
          color var(--duration-normal) var(--ease-in-out),
          opacity var(--duration-normal) var(--ease-in-out);

        @media (prefers-reduced-motion: reduce) {
          transition: none;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      [ICON_NAMES.CHECKBOX_UNCHECKED]: matCheckBoxOutlineBlank,
      [ICON_NAMES.CHECKBOX_CHECKED]: matCheckBox,
      [ICON_NAMES.CHECKBOX_INDETERMINATE]: matIndeterminateCheckBox,
    }),
  ],
})
export class CheckboxCheckmarkComponent {
  /**
   * Whether the checkbox is checked
   */
  readonly checked = input<boolean>(false);

  /**
   * Whether the checkbox is indeterminate
   */
  readonly indeterminate = input<boolean>(false);

  /**
   * Computed icon name based on state
   * - indeterminate: shows indeterminate icon (matIndeterminateCheckBox)
   * - checked: shows checked icon (matCheckBox)
   * - unchecked: shows outline box icon (matCheckBoxOutlineBlank)
   *
   * Note: Indeterminate takes precedence over checked.
   */
  readonly iconName = computed(() => {
    if (this.indeterminate()) {
      return ICON_NAMES.CHECKBOX_INDETERMINATE;
    }
    if (this.checked()) {
      return ICON_NAMES.CHECKBOX_CHECKED;
    }
    return ICON_NAMES.CHECKBOX_UNCHECKED;
  });
}
