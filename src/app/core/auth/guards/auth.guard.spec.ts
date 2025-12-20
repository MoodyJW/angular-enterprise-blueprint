import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  type ActivatedRouteSnapshot,
  provideRouter,
  type RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { of } from 'rxjs';
import type { AppEnvironment } from '../../../../environments/environment.type';
import { ENVIRONMENT } from '../../config';
import { LoggerService } from '../../services/logger';
import { AUTH_STRATEGY, type AuthStrategy } from '../auth-strategy.interface';
import { AuthStore } from '../auth.store';
import type { User } from '../auth.types';
import { adminGuard, authGuard } from './auth.guard';

const mockRoute = {} as ActivatedRouteSnapshot;
const mockState = {} as RouterStateSnapshot;

@Component({ template: '' })
class DummyComponent {}

describe('Auth Guards', () => {
  let authStore: InstanceType<typeof AuthStore>;

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
    roles: ['user'],
  };

  const mockAdminUser: User = {
    id: 'admin-001',
    username: 'admin',
    email: 'admin@example.com',
    roles: ['admin', 'user'],
  };

  const mockAuthStrategy: AuthStrategy = {
    name: 'MockStrategy',
    login: () => of(mockUser),
    logout: () => of(undefined),
    checkSession: () => of(null),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'auth/login', component: DummyComponent },
          { path: 'forbidden', component: DummyComponent },
          { path: 'dashboard', component: DummyComponent },
        ]),
        LoggerService,
        { provide: ENVIRONMENT, useValue: mockEnv },
        { provide: AUTH_STRATEGY, useValue: mockAuthStrategy },
      ],
    });

    authStore = TestBed.inject(AuthStore);
  });

  describe('authGuard', () => {
    it('should return true when user is authenticated', () => {
      authStore.setUser(mockUser);

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(result).toBe(true);
    });

    it('should redirect to login when user is not authenticated', () => {
      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(result).toBeInstanceOf(UrlTree);
      expect((result as UrlTree).toString()).toBe('/auth/login');
    });

    it('should allow access for admin users', () => {
      authStore.setUser(mockAdminUser);

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(result).toBe(true);
    });
  });

  describe('adminGuard', () => {
    it('should return true when user has admin role', () => {
      authStore.setUser(mockAdminUser);

      const result = TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));

      expect(result).toBe(true);
    });

    it('should redirect to forbidden when user is not admin', () => {
      authStore.setUser(mockUser);

      const result = TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));

      expect(result).toBeInstanceOf(UrlTree);
      expect((result as UrlTree).toString()).toBe('/forbidden');
    });

    it('should redirect to forbidden when user is not authenticated', () => {
      const result = TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));

      expect(result).toBeInstanceOf(UrlTree);
      expect((result as UrlTree).toString()).toBe('/forbidden');
    });
  });
});
