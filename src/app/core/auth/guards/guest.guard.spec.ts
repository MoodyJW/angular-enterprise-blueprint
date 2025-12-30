import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  type ActivatedRouteSnapshot,
  provideRouter,
  type RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import type { AppEnvironment } from '@environments/environment.type';
import { of } from 'rxjs';
import { ENVIRONMENT } from '../../config';
import { LoggerService } from '../../services/logger';
import { AUTH_STRATEGY, type AuthStrategy } from '../auth-strategy.interface';
import { AuthStore } from '../auth.store';
import type { User } from '../auth.types';
import { guestGuard } from './guest.guard';

const mockRoute = {} as ActivatedRouteSnapshot;
const mockState = {} as RouterStateSnapshot;

@Component({ template: '' })
class DummyComponent {}

describe('guestGuard', () => {
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
          { path: '', component: DummyComponent },
          { path: 'auth/login', component: DummyComponent },
        ]),
        LoggerService,
        { provide: ENVIRONMENT, useValue: mockEnv },
        { provide: AUTH_STRATEGY, useValue: mockAuthStrategy },
      ],
    });

    authStore = TestBed.inject(AuthStore);
  });

  it('should return true when user is not authenticated', () => {
    const result = TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));

    expect(result).toBe(true);
  });

  it('should redirect to home when user is authenticated', () => {
    authStore.setUser(mockUser);

    const result = TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));

    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/');
  });

  it('should allow access to login page for guests', () => {
    const result = TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));

    expect(result).toBe(true);
  });
});
