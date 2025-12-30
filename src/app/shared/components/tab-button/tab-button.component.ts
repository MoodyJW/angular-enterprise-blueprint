import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { type IconName } from '@shared/constants';

import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

/**
 * Small wrapper around `eb-button` that contains tab-specific visual styles
 * and ARIA wiring. Designed to keep per-tab styles scoped to a small file.
 */
@Component({
  selector: 'eb-tab-button',
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './tab-button.component.html',
  styleUrls: ['./tab-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabButtonComponent {
  readonly label = input<string>('');
  readonly icon = input<IconName | undefined>(undefined);
  readonly tabId = input<string>('');
  readonly isActive = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly ariaControls = input<string>('');
  readonly ariaSelected = input<boolean>(false);
  readonly tabindex = input<number>(-1);

  readonly clicked = output();

  onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
