import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '../button';

/**
 * Page not found (404) component.
 *
 * Displayed when the user navigates to an unknown route.
 */
@Component({
  selector: 'eb-page-not-found',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent {}
