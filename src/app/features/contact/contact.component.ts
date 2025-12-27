import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

/**
 * Contact page component.
 *
 * Displays "Hire Me" lead generation form.
 * This is a placeholder that will be fully implemented in Phase 5.
 */
@Component({
  selector: 'eb-contact',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {}
