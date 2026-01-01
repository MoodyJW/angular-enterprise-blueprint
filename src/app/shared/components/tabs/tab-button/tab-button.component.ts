import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { type IconName } from '@shared/constants';

import { IconComponent } from '@shared/components/icon';

/**
 * Tab button component with native button element for accessibility.
 * Uses native button to avoid nested interactive controls violation.
 */
@Component({
  selector: 'eb-tab-button',
  imports: [CommonModule, IconComponent],
  templateUrl: './tab-button.component.html',
  styleUrl: './tab-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'none' },
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
