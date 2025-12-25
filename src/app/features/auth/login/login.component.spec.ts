import { signal, type WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { AuthStore } from '@core/auth/auth.store';
import { ToastService } from '@shared/services/toast/toast.service';

import { LoginComponent } from './login.component';

interface MockAuthStore {
  user: WritableSignal<null>;
  isAuthenticated: WritableSignal<boolean>;
  isLoading: WritableSignal<boolean>;
  error: WritableSignal<string | null>;
  displayName: WritableSignal<string>;
  login: Mock;
  logout: Mock;
  clearError: Mock;
}

const en = {
  auth: {
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to access your dashboard',
      username: 'Username',
      usernamePlaceholder: 'Enter your username',
      usernameRequired: 'Username is required',
      usernameMinLength: 'Username must be at least 2 characters',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      passwordRequired: 'Password is required',
      submit: 'Sign In',
      submitting: 'Signing in...',
      demoHint: 'Demo credentials:',
      demoHintDetail: 'Try <code>{{ demo }}</code> or <code>{{ admin }}</code> with any password',
      successTitle: 'Login Successful',
      successMessage: 'Welcome back!',
      errorTitle: 'Login Failed',
    },
  },
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthStore: MockAuthStore;
  let mockToastService: { success: Mock; error: Mock; warning: Mock; info: Mock };
  let mockRouter: { navigate: Mock };

  beforeEach(async () => {
    mockAuthStore = {
      user: signal(null),
      isAuthenticated: signal(false),
      isLoading: signal(false),
      error: signal(null),
      displayName: signal('Guest'),
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    };

    mockToastService = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        TranslocoTestingModule.forRoot({
          langs: { en },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
            reRenderOnLangChange: true,
          },
        }),
      ],
      providers: [
        provideRouter([]),
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: ToastService, useValue: mockToastService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty form', () => {
      expect(component.loginForm.value).toEqual({
        username: '',
        password: '',
      });
    });

    it('should have invalid form initially', () => {
      expect(component.loginForm.valid).toBe(false);
    });
  });

  describe('Form Validation', () => {
    describe('username field', () => {
      it('should show required error message', () => {
        const usernameControl = component.loginForm.controls.username;
        usernameControl.setValue('');
        usernameControl.markAsTouched();
        fixture.detectChanges();

        expect(component.usernameError()).toBe('Username is required');
      });

      it('should show minlength error message', () => {
        const usernameControl = component.loginForm.controls.username;
        usernameControl.setValue('a');
        usernameControl.markAsTouched();
        fixture.detectChanges();

        expect(component.usernameError()).toBe('Username must be at least 2 characters');
      });
    });

    describe('password field', () => {
      it('should show required error message', () => {
        const passwordControl = component.loginForm.controls.password;
        passwordControl.setValue('');
        passwordControl.markAsTouched();
        fixture.detectChanges();

        expect(component.passwordError()).toBe('Password is required');
      });

      it('should return empty string when valid', () => {
        const passwordControl = component.loginForm.controls.password;
        passwordControl.setValue('validpassword');
        passwordControl.markAsTouched();
        fixture.detectChanges();

        expect(component.passwordError()).toBe('');
      });
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.loginForm.controls.username.setValue('demo');
      component.loginForm.controls.password.setValue('password');
    });

    it('should call authStore.login with credentials on valid submit', () => {
      component.onSubmit();

      expect(mockAuthStore.clearError).toHaveBeenCalled();
      expect(mockAuthStore.login).toHaveBeenCalledWith({
        username: 'demo',
        password: 'password',
      });
    });

    it('should not call login when form is invalid', () => {
      component.loginForm.controls.username.setValue('');
      component.onSubmit();

      expect(mockAuthStore.login).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Interaction', () => {
    it('should submit on Enter key without Shift', () => {
      // Setup valid form
      component.loginForm.setValue({ username: 'demo', password: 'password' });
      const spy = vi.spyOn(component, 'onSubmit');

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        cancelable: true,
      });
      component.onKeydown(event);

      expect(spy).toHaveBeenCalled();
    });

    it('should not submit on Enter key with Shift', () => {
      const spy = vi.spyOn(component, 'onSubmit');

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: true,
        cancelable: true,
      });
      component.onKeydown(event);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not submit on other keys', () => {
      const spy = vi.spyOn(component, 'onSubmit');

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        cancelable: true,
      });
      component.onKeydown(event);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Authentication State Handling', () => {
    it('should show success toast and navigate on successful login', async () => {
      mockAuthStore.isAuthenticated.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockToastService.success).toHaveBeenCalledWith('Welcome back!', {
        title: 'Login Successful',
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should not process state changes while loading', async () => {
      mockAuthStore.isLoading.set(true);
      mockAuthStore.isAuthenticated.set(true); // Should be ignored because loading is true
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockToastService.success).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should show error toast on login failure', async () => {
      mockAuthStore.error.set('Invalid credentials');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockToastService.error).toHaveBeenCalledWith('Invalid credentials', {
        title: 'Login Failed',
      });
    });

    it('should show inline error alert on login failure', () => {
      mockAuthStore.error.set('Invalid credentials');
      fixture.detectChanges();

      const errorAlert = (fixture.nativeElement as HTMLElement).querySelector('.login__error');
      expect(errorAlert).toBeTruthy();
      expect(errorAlert?.textContent).toContain('Invalid credentials');
      expect(errorAlert?.getAttribute('role')).toBe('alert');
    });
  });

  describe('Template Rendering', () => {
    it('should render login form', () => {
      const nativeEl = fixture.nativeElement as HTMLElement;
      const form = nativeEl.querySelector('form');
      expect(form).toBeTruthy();
    });

    it('should render demo hint', () => {
      const nativeEl = fixture.nativeElement as HTMLElement;
      const hint = nativeEl.querySelector('.login__hint');
      expect(hint).toBeTruthy();
      expect(hint?.textContent).toContain('Demo credentials:');
      // Transloco parameter interpolation might render "demo" and "admin"
      expect(hint?.textContent).toContain('demo');
      expect(hint?.textContent).toContain('admin');
    });
  });
});
