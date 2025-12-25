import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Home/Dashboard page component.
 *
 * Displays system status and overview information.
 * This is a placeholder that will be fully implemented in Phase 5.
 */
@Component({
  selector: 'eb-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
