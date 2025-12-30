import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { heroCheck, heroMinus } from '@ng-icons/heroicons/outline';

import { ICON_NAMES } from '@shared/constants';
import { IconComponent } from '../icon';

/**
 * Reusable checkmark component for checkbox states
 *
 * Displays icons for checked and indeterminate states using the shared Icon component.
 * Indeterminate takes precedence over checked.
 *
 * @example
 * ```html
 * <!-- Checked state -->
 * <eb-checkbox-checkmark [checked]="true" />
 *
 * <!-- Indeterminate state -->
 * <eb-checkbox-checkmark [indeterminate]="true" />
 *
 * <!-- Unchecked state (no icon shown) -->
 * <eb-checkbox-checkmark />
 * ```
 */
@Component({
  selector: 'eb-checkbox-checkmark',
  imports: [CommonModule, IconComponent],
  template: `
    <span class="checkbox-checkmark" aria-hidden="true">
      @if (showIcon()) {
        <eb-icon [name]="iconName()" size="sm" [decorative]="true" class="checkbox-icon" />
      }
    </span>
  `,
  styles: [
    `
      .checkbox-checkmark {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        left: 0;
        top: 0;
        width: 20px;
        height: 20px;

        @media (pointer: coarse) {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .checkbox-icon {
        color: var(--color-background);
        transition: opacity var(--duration-normal) var(--ease-in-out);

        @media (prefers-reduced-motion: reduce) {
          transition: none;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ heroCheck, heroMinus })],
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
   * Computed flag to determine if an icon should be shown
   */
  readonly showIcon = computed(() => this.checked() || this.indeterminate());

  /**
   * Computed icon name based on state
   * - indeterminate: shows minus icon (heroMinus)
   * - checked: shows check icon (heroCheck)
   */
  readonly iconName = computed(() => {
    if (this.indeterminate()) {
      return ICON_NAMES.REMOVE;
    }
    return ICON_NAMES.CHECK;
  });
}
