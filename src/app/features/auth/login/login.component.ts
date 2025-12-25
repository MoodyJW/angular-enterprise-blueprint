import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { AuthStore } from '@core/auth/auth.store';
import { ButtonComponent } from '@shared/components/button';
import { CardComponent } from '@shared/components/card';
import { InputComponent } from '@shared/components/input';
import { StackComponent } from '@shared/components/stack';
import { ToastService } from '@shared/services/toast/toast.service';

/**
 * Login page component.
 *
 * Provides the authentication login form with:
 * - Username and password fields with validation
 * - Integration with AuthStore for state management
 * - Toast notifications for error feedback
 * - Automatic redirect on successful login
 *
 * @example
 * ```html
 * <!-- Route: /auth/login -->
 * <eb-login />
 * ```
 */
@Component({
  selector: 'eb-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    CardComponent,
    InputComponent,
    ButtonComponent,
    StackComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly _fb = inject(NonNullableFormBuilder);
  private readonly _router = inject(Router);
  private readonly _toastService = inject(ToastService);
  private readonly _authStore = inject(AuthStore);
  private readonly _translocoService = inject(TranslocoService);

  /**
   * Login form with username and password fields.
   */
  readonly loginForm = this._fb.group({
    username: ['', [Validators.required, Validators.minLength(2)]], // eslint-disable-line @typescript-eslint/unbound-method
    password: ['', [Validators.required, Validators.minLength(1)]], // eslint-disable-line @typescript-eslint/unbound-method
  });

  /**
   * Loading state from auth store.
   */
  readonly isLoading = this._authStore.isLoading;

  /**
   * Error message from auth store.
   */
  readonly error = this._authStore.error;

  /**
   * Whether the form is valid and can be submitted.
   */
  canSubmit(): boolean {
    return this.loginForm.valid && !this.isLoading();
  }

  /**
   * Username field validation state for input component.
   */
  usernameValidationState(): 'default' | 'success' | 'error' {
    const control = this.loginForm.controls.username;
    if (!control.dirty && !control.touched) return 'default';
    return control.valid ? 'success' : 'error';
  }

  /**
   * Password field validation state for input component.
   */
  passwordValidationState(): 'default' | 'success' | 'error' {
    const control = this.loginForm.controls.password;
    if (!control.dirty && !control.touched) return 'default';
    return control.valid ? 'success' : 'error';
  }

  /**
   * Username error message.
   */
  usernameError(): string {
    const control = this.loginForm.controls.username;
    if (!control.touched || control.valid) return '';
    if (control.hasError('required'))
      return this._translocoService.translate('auth.login.usernameRequired');
    if (control.hasError('minlength'))
      return this._translocoService.translate('auth.login.usernameMinLength');
    return '';
  }

  /**
   * Password error message.
   */
  passwordError(): string {
    const control = this.loginForm.controls.password;
    if (!control.touched || control.valid) return '';
    if (control.hasError('required'))
      return this._translocoService.translate('auth.login.passwordRequired');
    return '';
  }

  constructor() {
    // Watch for auth state changes to handle success/error
    effect(() => {
      const isAuthenticated = this._authStore.isAuthenticated();
      const error = this._authStore.error();
      const isLoading = this._authStore.isLoading();

      // Only process when not loading
      if (isLoading) return;

      // Handle successful login
      if (isAuthenticated) {
        this._toastService.success(this._translocoService.translate('auth.login.successMessage'), {
          title: this._translocoService.translate('auth.login.successTitle'),
        });
        void this._router.navigate(['/']);
      }

      // Handle login error
      if (error !== null && error.length > 0) {
        this._toastService.error(error, {
          title: this._translocoService.translate('auth.login.errorTitle'),
        });
      }
    });
  }

  /**
   * Handle form submission.
   */
  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    this.loginForm.markAllAsTouched();

    if (!this.loginForm.valid) {
      return;
    }

    const { username, password } = this.loginForm.getRawValue();

    // Clear any previous errors
    this._authStore.clearError();

    // Attempt login
    this._authStore.login({ username, password });
  }

  /**
   * Handle Enter key on form fields.
   */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSubmit();
    }
  }
}
