import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MainLayoutComponent } from '@core/layout';

/**
 * Root application component.
 *
 * Renders the main layout which provides:
 * - Application header with navigation
 * - Router outlet for feature pages
 * - Application footer
 * - Mobile navigation drawer
 */
@Component({
  selector: 'eb-root',
  standalone: true,
  imports: [MainLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
