import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Login page component.
 *
 * Provides the authentication login form.
 * This is a placeholder that will be fully implemented in Phase 5.
 */
@Component({
  selector: 'eb-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {}
