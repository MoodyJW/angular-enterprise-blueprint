import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type IconName } from '@shared/constants';
import { IconComponent } from '../../icon/icon.component';

/**
 * Provides the internal content wrapper for `eb-button`.
 *
 * This component renders the button's loading state and optional icons
 * placed to the left or right of the content. It is a small standalone
 * presentational component used by `ButtonComponent` to keep templating
 * concerns separated.
 */
@Component({
  selector: 'eb-button-content',
  imports: [CommonModule, IconComponent],
  templateUrl: './button-content.component.html',
  styleUrls: ['./button-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonContentComponent {
  /**
   * Whether the button is currently showing a loading indicator.
   *
   * Default: `false`.
   */
  readonly loading = input<boolean>(false);

  /**
   * Name of the icon to render on the left side of the button content.
   *
   * When `undefined`, no left icon is rendered.
   */
  readonly iconLeft = input<IconName | undefined>(undefined);

  /**
   * Name of the icon to render on the right side of the button content.
   *
   * When `undefined`, no right icon is rendered.
   */
  readonly iconRight = input<IconName | undefined>(undefined);

  /**
   * Whether the button only renders an icon (no visible text).
   *
   * Default: `false`.
   */
  readonly iconOnly = input<boolean>(false);
}
