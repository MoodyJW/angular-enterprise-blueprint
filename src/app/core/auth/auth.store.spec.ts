import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ENVIRONMENT } from '@core/config';
import { LoggerService } from '@core/services/logger';
import type { AppEnvironment } from '@environments/environment.type';
import { AUTH_STRATEGY, type AuthStrategy } from './auth-strategy.interface';
import { AuthStore } from './auth.store';
import { AUTH_ERROR_CODES, type AuthError, type LoginCredentials, type User } from './auth.types';

@Component({ template: '' })
class DummyComponent {}

describe('AuthStore', () => {
  let authStore: InstanceType<typeof AuthStore>;
  let router: Router;
  let loggerService: LoggerService;

  // Spies for mock auth strategy methods
  let loginSpy: ReturnType<typeof vi.fn>;
  let logoutSpy: ReturnType<typeof vi.fn>;
  let checkSessionSpy: ReturnType<typeof vi.fn>;

  const mockEnv: AppEnvironment = {
    appName: 'Test App',
    production: false,
    apiUrl: '/api',
    features: { mockAuth: true },
    analytics: { enabled: false, provider: 'console' },
    version: '1.0.0',
  };

  const mockUser: User = {
    id: 'user-001',
    username: 'demo',
    email: 'demo@example.com',
    avatarUrl: 'https://example.com/avatar.png',
    roles: ['user'],
  };

  const mockAdminUser: User = {
    id: 'admin-001',
    username: 'admin',
    email: 'admin@example.com',
    avatarUrl: 'https://example.com/admin-avatar.png',
    roles: ['admin', 'user'],
  };

  const createMockAuthStrategy = (): AuthStrategy => {
    loginSpy = vi.fn().mockReturnValue(of(mockUser));
    logoutSpy = vi.fn().mockReturnValue(of(undefined));
    checkSessionSpy = vi.fn().mockReturnValue(of(null));

    return {
      name: 'MockStrategy',
      login: loginSpy as unknown as (
        credentials: LoginCredentials,
      ) => ReturnType<AuthStrategy['login']>,
      logout: logoutSpy as unknown as () => ReturnType<AuthStrategy['logout']>,
      checkSession: checkSessionSpy as unknown as () => ReturnType<AuthStrategy['checkSession']>,
    };
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'auth/login', component: DummyComponent }]),
        LoggerService,
        { provide: ENVIRONMENT, useValue: mockEnv },
        { provide: AUTH_STRATEGY, useFactory: createMockAuthStrategy },
      ],
    });

    authStore = TestBed.inject(AuthStore);
    router = TestBed.inject(Router);
    loggerService = TestBed.inject(LoggerService);
  });

  describe('initial state', () => {
    it('should have null user initially', () => {
      expect(authStore.user()).toBeNull();
    });

    it('should not be authenticated initially', () => {
      expect(authStore.isAuthenticated()).toBe(false);
    });

    it('should not be loading initially', () => {
      expect(authStore.isLoading()).toBe(false);
    });

    it('should have no error initially', () => {
      expect(authStore.error()).toBeNull();
    });
  });

  describe('computed signals', () => {
    describe('displayName', () => {
      it('should return Guest when no user is logged in', () => {
        expect(authStore.displayName()).toBe('Guest');
      });

      it('should return username when user is logged in', () => {
        authStore.setUser(mockUser);
        expect(authStore.displayName()).toBe('demo');
      });
    });

    describe('isAdmin', () => {
      it('should return false when no user is logged in', () => {
        expect(authStore.isAdmin()).toBe(false);
      });

      it('should return false for regular user', () => {
        authStore.setUser(mockUser);
        expect(authStore.isAdmin()).toBe(false);
      });

      it('should return true for admin user', () => {
        authStore.setUser(mockAdminUser);
        expect(authStore.isAdmin()).toBe(true);
      });
    });

    describe('hasRole', () => {
      it('should return false when no user is logged in', () => {
        expect(authStore.hasRole()('user')).toBe(false);
        expect(authStore.hasRole()('admin')).toBe(false);
      });

      it('should return true for roles the user has', () => {
        authStore.setUser(mockUser);
        expect(authStore.hasRole()('user')).toBe(true);
      });

      it('should return false for roles the user does not have', () => {
        authStore.setUser(mockUser);
        expect(authStore.hasRole()('admin')).toBe(false);
      });

      it('should return true for all roles an admin has', () => {
        authStore.setUser(mockAdminUser);
        expect(authStore.hasRole()('user')).toBe(true);
        expect(authStore.hasRole()('admin')).toBe(true);
      });
    });

    describe('avatarUrl', () => {
      it('should return default avatar when no user is logged in', () => {
        expect(authStore.avatarUrl()).toBe('assets/images/default-avatar.svg');
      });

      it('should return user avatar when user has one', () => {
        authStore.setUser(mockUser);
        expect(authStore.avatarUrl()).toBe('https://example.com/avatar.png');
      });

      it('should return default avatar when user has no avatarUrl', () => {
        const userWithoutAvatar: User = { ...mockUser, avatarUrl: undefined };
        authStore.setUser(userWithoutAvatar);
        expect(authStore.avatarUrl()).toBe('assets/images/default-avatar.svg');
      });
    });
  });

  describe('login', () => {
    it('should call authStrategy.login with credentials', async () => {
      const credentials = { username: 'demo', password: 'password' };

      authStore.login(credentials);
      await vi.waitFor(() => {
        expect(authStore.isLoading()).toBe(false);
      });

      expect(loginSpy).toHaveBeenCalledWith(credentials);
    });

    it('should set user and isAuthenticated on successful login', async () => {
      authStore.login({ username: 'demo', password: 'password' });

      await vi.waitFor(() => {
        expect(authStore.isAuthenticated()).toBe(true);
      });

      expect(authStore.user()).toEqual(mockUser);
      expect(authStore.isLoading()).toBe(false);
      expect(authStore.error()).toBeNull();
    });

    it('should log successful login', async () => {
      const logSpy = vi.spyOn(loggerService, 'info');

      authStore.login({ username: 'demo', password: 'password' });
      await vi.waitFor(() => {
        expect(authStore.isAuthenticated()).toBe(true);
      });

      expect(logSpy).toHaveBeenCalledWith('[AuthStore] Login successful', { userId: 'user-001' });
    });

    it('should set error on login failure', async () => {
      const authError: AuthError = {
        code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Invalid credentials',
      };
      loginSpy.mockReturnValue(throwError(() => authError));

      authStore.login({ username: 'invalid', password: 'password' });

      await vi.waitFor(() => {
        expect(authStore.isLoading()).toBe(false);
      });

      expect(authStore.isAuthenticated()).toBe(false);
      expect(authStore.user()).toBeNull();
      expect(authStore.error()).toBe('Invalid credentials');
    });

    it('should log login failure', async () => {
      const logSpy = vi.spyOn(loggerService, 'error');
      const authError: AuthError = {
        code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Invalid credentials',
      };
      loginSpy.mockReturnValue(throwError(() => authError));

      authStore.login({ username: 'invalid', password: 'password' });
      await vi.waitFor(() => {
        expect(authStore.isLoading()).toBe(false);
      });

      expect(logSpy).toHaveBeenCalledWith('[AuthStore] Login failed', {
        error: 'Invalid credentials',
      });
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      // Set up an authenticated state first
      authStore.setUser(mockUser);
    });

    it('should call authStrategy.logout', async () => {
      authStore.logout(undefined);
      await vi.waitFor(() => {
        expect(authStore.isAuthenticated()).toBe(false);
      });

      expect(logoutSpy).toHaveBeenCalled();
    });

    it('should clear user and set isAuthenticated to false', async () => {
      authStore.logout(undefined);

      await vi.waitFor(() => {
        expect(authStore.user()).toBeNull();
      });

      expect(authStore.isAuthenticated()).toBe(false);
      expect(authStore.isLoading()).toBe(false);
      expect(authStore.error()).toBeNull();
    });

    it('should navigate to login page after logout', async () => {
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      authStore.logout(undefined);
      await vi.waitFor(() => {
        expect(authStore.isAuthenticated()).toBe(false);
      });

      expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should log successful logout', async () => {
      const logSpy = vi.spyOn(loggerService, 'info');

      authStore.logout(undefined);
      await vi.waitFor(() => {
        expect(authStore.isAuthenticated()).toBe(false);
      });

      expect(logSpy).toHaveBeenCalledWith('[AuthStore] Logout successful');
    });

    it('should still clear state and navigate on logout failure', async () => {
      const authError: AuthError = {
        code: AUTH_ERROR_CODES.NETWORK_ERROR,
        message: 'Network error',
      };
      logoutSpy.mockReturnValue(throwError(() => authError));
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      authStore.logout(undefined);
      await vi.waitFor(() => {
        expect(authStore.isAuthenticated()).toBe(false);
      });

      expect(authStore.user()).toBeNull();
      expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('checkSession', () => {
    it('should call authStrategy.checkSession', async () => {
      authStore.checkSession(undefined);
      await vi.waitFor(() => {
        expect(authStore.isLoading()).toBe(false);
      });

      expect(checkSessionSpy).toHaveBeenCalled();
    });

    it('should restore user when session exists', async () => {
      checkSessionSpy.mockReturnValue(of(mockUser));

      authStore.checkSession(undefined);

      await vi.waitFor(() => {
        expect(authStore.isAuthenticated()).toBe(true);
      });

      expect(authStore.user()).toEqual(mockUser);
      expect(authStore.isLoading()).toBe(false);
    });

    it('should log when session is restored', async () => {
      const logSpy = vi.spyOn(loggerService, 'info');
      checkSessionSpy.mockReturnValue(of(mockUser));

      authStore.checkSession(undefined);
      await vi.waitFor(() => {
        expect(authStore.isAuthenticated()).toBe(true);
      });

      expect(logSpy).toHaveBeenCalledWith('[AuthStore] Session restored', { userId: 'user-001' });
    });

    it('should remain unauthenticated when no session exists', async () => {
      checkSessionSpy.mockReturnValue(of(null));

      authStore.checkSession(undefined);

      await vi.waitFor(() => {
        expect(authStore.isLoading()).toBe(false);
      });

      expect(authStore.isAuthenticated()).toBe(false);
      expect(authStore.user()).toBeNull();
    });

    it('should log when no session is found', async () => {
      const logSpy = vi.spyOn(loggerService, 'info');
      checkSessionSpy.mockReturnValue(of(null));

      authStore.checkSession(undefined);
      await vi.waitFor(() => {
        expect(authStore.isLoading()).toBe(false);
      });

      expect(logSpy).toHaveBeenCalledWith('[AuthStore] No session found');
    });

    it('should handle session check errors gracefully', async () => {
      const authError: AuthError = {
        code: AUTH_ERROR_CODES.NETWORK_ERROR,
        message: 'Network error',
      };
      checkSessionSpy.mockReturnValue(throwError(() => authError));

      authStore.checkSession(undefined);

      await vi.waitFor(() => {
        expect(authStore.isLoading()).toBe(false);
      });

      expect(authStore.isAuthenticated()).toBe(false);
      expect(authStore.user()).toBeNull();
      expect(authStore.error()).toBeNull(); // Session check errors should not set error
    });
  });

  describe('clearError', () => {
    it('should clear the error state', () => {
      authStore.setError('Some error');
      expect(authStore.error()).toBe('Some error');

      authStore.clearError();
      expect(authStore.error()).toBeNull();
    });
  });

  describe('setError', () => {
    it('should set the error state', () => {
      authStore.setError('Test error message');
      expect(authStore.error()).toBe('Test error message');
    });
  });

  describe('setUser', () => {
    it('should set user and isAuthenticated to true', () => {
      authStore.setUser(mockUser);

      expect(authStore.user()).toEqual(mockUser);
      expect(authStore.isAuthenticated()).toBe(true);
    });

    it('should clear user and set isAuthenticated to false when null', () => {
      authStore.setUser(mockUser);
      expect(authStore.isAuthenticated()).toBe(true);

      authStore.setUser(null);
      expect(authStore.user()).toBeNull();
      expect(authStore.isAuthenticated()).toBe(false);
    });
  });

  describe('handleSessionExpired', () => {
    beforeEach(() => {
      authStore.setUser(mockUser);
    });

    it('should clear user and set isAuthenticated to false', () => {
      authStore.handleSessionExpired();

      expect(authStore.user()).toBeNull();
      expect(authStore.isAuthenticated()).toBe(false);
      expect(authStore.isLoading()).toBe(false);
    });

    it('should set error to SESSION_EXPIRED', () => {
      authStore.handleSessionExpired();
      expect(authStore.error()).toBe(AUTH_ERROR_CODES.SESSION_EXPIRED);
    });

    it('should navigate to login page', () => {
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      authStore.handleSessionExpired();

      expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should log session expiration', () => {
      const logSpy = vi.spyOn(loggerService, 'warn');

      authStore.handleSessionExpired();

      expect(logSpy).toHaveBeenCalledWith('[AuthStore] Session expired');
    });
  });
});
