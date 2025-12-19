import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import type { AppEnvironment } from '../../../environments/environment.type';
import { ENVIRONMENT, provideEnvironment } from './environment.token';

describe('ENVIRONMENT Token', () => {
  describe('default factory', () => {
    it('should provide the environment via injection token', () => {
      TestBed.configureTestingModule({});

      const env = TestBed.inject(ENVIRONMENT);

      expect(env).toBeDefined();
      expect(env.appName).toBe('Angular Enterprise Blueprint');
    });

    it('should have all required properties', () => {
      TestBed.configureTestingModule({});

      const env = TestBed.inject(ENVIRONMENT);

      expect(env).toHaveProperty('appName');
      expect(env).toHaveProperty('production');
      expect(env).toHaveProperty('apiUrl');
      expect(env).toHaveProperty('features');
      expect(env).toHaveProperty('analytics');
      expect(env).toHaveProperty('version');
    });

    it('should have feature flags defined', () => {
      TestBed.configureTestingModule({});

      const env = TestBed.inject(ENVIRONMENT);

      expect(env.features).toHaveProperty('mockAuth');
      expect(typeof env.features.mockAuth).toBe('boolean');
    });

    it('should have analytics config defined', () => {
      TestBed.configureTestingModule({});

      const env = TestBed.inject(ENVIRONMENT);

      expect(env.analytics).toHaveProperty('enabled');
      expect(env.analytics).toHaveProperty('provider');
      expect(typeof env.analytics.enabled).toBe('boolean');
      expect(['console', 'google']).toContain(env.analytics.provider);
    });
  });

  describe('provideEnvironment()', () => {
    it('should provide the environment when using provideEnvironment()', () => {
      TestBed.configureTestingModule({
        providers: [provideEnvironment()],
      });

      const env = TestBed.inject(ENVIRONMENT);

      expect(env).toBeDefined();
      expect(env.appName).toBe('Angular Enterprise Blueprint');
    });
  });

  describe('mock environment in tests', () => {
    it('should allow overriding environment in tests', () => {
      const mockEnv: AppEnvironment = {
        appName: 'Test App',
        production: true,
        apiUrl: 'https://test.api.com',
        features: {
          mockAuth: false,
        },
        analytics: {
          enabled: true,
          provider: 'google',
          google: { measurementId: 'G-TEST123' },
        },
        version: '1.0.0-test',
      };

      TestBed.configureTestingModule({
        providers: [{ provide: ENVIRONMENT, useValue: mockEnv }],
      });

      const env = TestBed.inject(ENVIRONMENT);

      expect(env.appName).toBe('Test App');
      expect(env.production).toBe(true);
      expect(env.apiUrl).toBe('https://test.api.com');
      expect(env.features.mockAuth).toBe(false);
      expect(env.analytics.enabled).toBe(true);
      expect(env.analytics.provider).toBe('google');
      expect(env.analytics.google).toEqual({ measurementId: 'G-TEST123' });
      expect(env.version).toBe('1.0.0-test');
    });
  });
});
