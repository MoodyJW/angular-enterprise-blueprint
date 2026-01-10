import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { ionLogoGithub } from '@ng-icons/ionicons';

import { IconComponent } from '@shared/components/icon/icon.component';
import { ICON_NAMES } from '@shared/constants/icon-names.constants';

/**
 * Application footer component.
 *
 * Displays:
 * - Dynamic copyright year
 * - "View Source" GitHub link
 * - "Built with Angular" badge
 *
 * @example
 * ```html
 * <eb-footer />
 * ```
 */
@Component({
  selector: 'eb-footer',
  standalone: true,
  imports: [TranslocoModule, IconComponent],
  viewProviders: [provideIcons({ ionLogoGithub })],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  /**
   * Current year for copyright display.
   */
  readonly currentYear = signal(new Date().getFullYear());

  /**
   * GitHub repository URL.
   */
  readonly githubUrl = 'https://github.com/MoodyJW/angular-enterprise-blueprint';

  /**
   * Angular version being used.
   */
  readonly angularVersion = '21';

  /**
   * Icon names for template binding.
   */
  readonly icons = ICON_NAMES;
}
