import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

/**
 * Profile page component.
 *
 * Displays "The Architect" bio and resume.
 * This is a placeholder that will be fully implemented in Phase 5.
 */
@Component({
  selector: 'eb-profile',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {}
