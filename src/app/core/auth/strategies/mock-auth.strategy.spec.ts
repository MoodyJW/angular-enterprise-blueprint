import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AppEnvironment } from '@environments/environment.type';
import { ENVIRONMENT } from '../../config';
import { LoggerService } from '../../services/logger';
import { SecureStorageService } from '../../services/storage/secure-storage.service';
import { AUTH_ERROR_CODES, type LoginCredentials } from '../auth.types';
import { MockAuthStrategy } from './mock-auth.strategy';

describe('MockAuthStrategy', () => {
  let strategy: MockAuthStrategy;
  let loggerService: LoggerService;
  let secureStorage: SecureStorageService;

  const mockEnv: AppEnvironment = {
    appName: 'Test App',
    production: false,
    apiUrl: '/api',
    features: { mockAuth: true },
    analytics: { enabled: false, provider: 'console' },
    version: '1.0.0',
  };

  beforeEach(() => {
    // Clear storage before each test
    sessionStorage.clear();

    // Mock Math.random to prevent random errors during tests
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    TestBed.configureTestingModule({
      providers: [
        MockAuthStrategy,
        LoggerService,
        SecureStorageService,
        { provide: ENVIRONMENT, useValue: mockEnv },
      ],
    });

    strategy = TestBed.inject(MockAuthStrategy);
    loggerService = TestBed.inject(LoggerService);
    secureStorage = TestBed.inject(SecureStorageService);
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe('name', () => {
    it('should have the correct strategy name', () => {
      expect(strategy.name).toBe('MockAuthStrategy');
    });
  });

  describe('login', () => {
    it('should login successfully with demo username', async () => {
      const credentials: LoginCredentials = { username: 'demo', password: 'anypassword' };

      const user = await firstValueFrom(strategy.login(credentials));

      expect(user).toBeDefined();
      expect(user.id).toBe('user-001');
      expect(user.username).toBe('demo');
      expect(user.email).toBe('demo@example.com');
      expect(user.roles).toContain('user');
    });

    it('should login successfully with admin username', async () => {
      const credentials: LoginCredentials = { username: 'admin', password: 'anypassword' };

      const user = await firstValueFrom(strategy.login(credentials));

      expect(user).toBeDefined();
      expect(user.id).toBe('admin-001');
      expect(user.username).toBe('admin');
      expect(user.email).toBe('admin@example.com');
      expect(user.roles).toContain('admin');
      expect(user.roles).toContain('user');
    });

    it('should be case-insensitive for username', async () => {
      const credentials: LoginCredentials = { username: 'DEMO', password: 'anypassword' };

      const user = await firstValueFrom(strategy.login(credentials));

      expect(user.username).toBe('demo');
    });

    it('should trim whitespace from username', async () => {
      const credentials: LoginCredentials = { username: '  demo  ', password: 'anypassword' };

      const user = await firstValueFrom(strategy.login(credentials));

      expect(user.username).toBe('demo');
    });

    it('should store session in secure storage after login', async () => {
      const credentials: LoginCredentials = { username: 'demo', password: 'anypassword' };

      await firstValueFrom(strategy.login(credentials));

      expect(secureStorage.getItem('mock-auth-token')).toBeTruthy();
      expect(secureStorage.getItem('mock-auth-user')).toBeTruthy();
    });

    it('should generate a JWT-like token', async () => {
      const credentials: LoginCredentials = { username: 'demo', password: 'anypassword' };

      await firstValueFrom(strategy.login(credentials));

      const token = secureStorage.getItem('mock-auth-token');
      expect(token).toBeTruthy();
      // JWT tokens have 3 parts separated by dots
      const parts = token?.split('.');
      expect(parts?.length).toBe(3);
    });

    it('should reject invalid credentials', async () => {
      const credentials: LoginCredentials = { username: 'invalid', password: 'anypassword' };

      await expect(firstValueFrom(strategy.login(credentials))).rejects.toMatchObject({
        code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Invalid username or password',
      });
    });

    it('should log login attempt', async () => {
      const logSpy = vi.spyOn(loggerService, 'info');
      const credentials: LoginCredentials = { username: 'demo', password: 'anypassword' };

      await firstValueFrom(strategy.login(credentials));

      expect(logSpy).toHaveBeenCalledWith('[MockAuth] Login attempt', { username: 'demo' });
    });

    it('should log successful login', async () => {
      const logSpy = vi.spyOn(loggerService, 'info');
      const credentials: LoginCredentials = { username: 'demo', password: 'anypassword' };

      await firstValueFrom(strategy.login(credentials));

      expect(logSpy).toHaveBeenCalledWith('[MockAuth] Login successful', {
        userId: 'user-001',
        username: 'demo',
      });
    });

    it('should log invalid credentials warning', async () => {
      const logSpy = vi.spyOn(loggerService, 'warn');
      const credentials: LoginCredentials = { username: 'invalid', password: 'anypassword' };

      try {
        await firstValueFrom(strategy.login(credentials));
      } catch {
        // Expected error
      }

      expect(logSpy).toHaveBeenCalledWith('[MockAuth] Invalid credentials', {
        username: 'invalid',
      });
    });
  });

  describe('logout', () => {
    it('should clear session from secure storage', async () => {
      // First login
      await firstValueFrom(strategy.login({ username: 'demo', password: 'password' }));
      expect(secureStorage.getItem('mock-auth-token')).toBeTruthy();

      // Then logout
      await firstValueFrom(strategy.logout());

      expect(secureStorage.getItem('mock-auth-token')).toBeNull();
      expect(secureStorage.getItem('mock-auth-user')).toBeNull();
    });

    it('should log logout', async () => {
      const logSpy = vi.spyOn(loggerService, 'info');

      await firstValueFrom(strategy.logout());

      expect(logSpy).toHaveBeenCalledWith('[MockAuth] Logout');
    });

    it('should complete successfully even without prior login', async () => {
      await expect(firstValueFrom(strategy.logout())).resolves.toBeUndefined();
    });
  });

  describe('checkSession', () => {
    it('should return user when valid session exists', async () => {
      // First login to create a session
      await firstValueFrom(strategy.login({ username: 'demo', password: 'password' }));

      // Then check session
      const user = await firstValueFrom(strategy.checkSession());

      expect(user).toBeDefined();
      expect(user?.username).toBe('demo');
    });

    it('should return null when no session exists', async () => {
      const user = await firstValueFrom(strategy.checkSession());

      expect(user).toBeNull();
    });

    it('should return null when only token exists without user', async () => {
      secureStorage.setItem('mock-auth-token', 'some-token');

      const user = await firstValueFrom(strategy.checkSession());

      expect(user).toBeNull();
    });

    it('should return null when only user exists without token', async () => {
      secureStorage.setItem('mock-auth-user', JSON.stringify({ id: '1', username: 'test' }));

      const user = await firstValueFrom(strategy.checkSession());

      expect(user).toBeNull();
    });

    it('should clear session on invalid JSON in user data', async () => {
      secureStorage.setItem('mock-auth-token', 'some-token');
      // We need to bypass encryption for this specific invalid JSON test or encrypt the invalid string
      // Actually, SecureStorage decrypts it. If we put garbage in sessionStorage directly, decrypt might fail or return garbage.
      // But here we use 'setItem' which encrypts 'invalid-json'. Decrypt('encrypted-invalid-json') -> 'invalid-json'.
      // JSON.parse('invalid-json') -> SyntaxError. Catch block -> clearSession -> return null.
      // So setItem is correct here.
      secureStorage.setItem('mock-auth-user', 'invalid-json');

      const user = await firstValueFrom(strategy.checkSession());

      expect(user).toBeNull();
      expect(secureStorage.getItem('mock-auth-token')).toBeNull();
    });

    it('should log session check', async () => {
      const logSpy = vi.spyOn(loggerService, 'info');

      await firstValueFrom(strategy.checkSession());

      expect(logSpy).toHaveBeenCalledWith('[MockAuth] Checking session');
    });

    it('should log when session is restored', async () => {
      await firstValueFrom(strategy.login({ username: 'demo', password: 'password' }));
      const logSpy = vi.spyOn(loggerService, 'info');

      await firstValueFrom(strategy.checkSession());

      expect(logSpy).toHaveBeenCalledWith('[MockAuth] Session restored', { userId: 'user-001' });
    });

    it('should log when no session found', async () => {
      const logSpy = vi.spyOn(loggerService, 'info');

      await firstValueFrom(strategy.checkSession());

      expect(logSpy).toHaveBeenCalledWith('[MockAuth] No valid session found');
    });
  });

  describe('random error simulation', () => {
    it('should simulate random error when Math.random returns low value (non-production)', async () => {
      // Force random error
      vi.spyOn(Math, 'random').mockReturnValue(0.05);

      const credentials: LoginCredentials = { username: 'demo', password: 'password' };

      await expect(firstValueFrom(strategy.login(credentials))).rejects.toMatchObject({
        code: AUTH_ERROR_CODES.NETWORK_ERROR,
        message: 'Simulated server error for testing',
      });
    });

    it('should not simulate error when Math.random returns high value', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      const credentials: LoginCredentials = { username: 'demo', password: 'password' };

      const user = await firstValueFrom(strategy.login(credentials));
      expect(user).toBeDefined();
    });
  });

  describe('production mode', () => {
    it('should not simulate random errors in production', async () => {
      // Create a new instance with production env
      const prodEnv: AppEnvironment = { ...mockEnv, production: true };

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [MockAuthStrategy, LoggerService, { provide: ENVIRONMENT, useValue: prodEnv }],
      });

      const prodStrategy = TestBed.inject(MockAuthStrategy);

      // Force random error condition
      vi.spyOn(Math, 'random').mockReturnValue(0.05);

      const credentials: LoginCredentials = { username: 'demo', password: 'password' };

      // Should still succeed in production (no simulated errors)
      const user = await firstValueFrom(prodStrategy.login(credentials));
      expect(user).toBeDefined();
    });
  });
});
