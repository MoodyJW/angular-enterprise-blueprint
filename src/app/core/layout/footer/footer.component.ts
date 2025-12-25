import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

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
  imports: [],
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
}
