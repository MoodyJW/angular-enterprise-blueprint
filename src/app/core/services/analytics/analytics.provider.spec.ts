import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AppEnvironment } from '@environments/environment.type';
import { ENVIRONMENT } from '../../config';
import { LoggerService } from '../logger';
import { ANALYTICS_PROVIDER, type AnalyticsProvider } from './analytics-provider.interface';
import { provideAnalytics } from './analytics.provider';
import { ConsoleAnalyticsProvider } from './providers/console-analytics.provider';
import { GoogleAnalyticsProvider } from './providers/google-analytics.provider';

describe('provideAnalytics', () => {
  let loggerSpy: {
    log: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
    warn: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };
  let mockDocument: {
    defaultView: Window | null;
    createElement: ReturnType<typeof vi.fn>;
    head: { appendChild: ReturnType<typeof vi.fn> };
  };

  const createMockEnv = (
    provider: 'console' | 'google',
    enabled = true,
    measurementId?: string,
  ): AppEnvironment => ({
    appName: 'Test App',
    production: provider === 'google',
    apiUrl: '/api',
    features: { mockAuth: true },
    analytics: {
      enabled,
      provider,
      google: measurementId !== undefined ? { measurementId } : undefined,
    },
    version: '1.0.0',
  });

  beforeEach(() => {
    loggerSpy = {
      log: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    mockDocument = {
      defaultView: {
        dataLayer: undefined,
        gtag: undefined,
      } as unknown as Window,
      createElement: vi.fn().mockReturnValue({
        async: false,
        src: '',
        onload: null,
        onerror: null,
      }),
      head: { appendChild: vi.fn() },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  describe('provider selection', () => {
    it('should provide ConsoleAnalyticsProvider when provider is "console"', () => {
      TestBed.configureTestingModule({
        providers: [
          provideAnalytics(),
          { provide: ENVIRONMENT, useValue: createMockEnv('console') },
          { provide: LoggerService, useValue: loggerSpy },
        ],
      });

      const provider = TestBed.inject(ANALYTICS_PROVIDER);

      expect(provider).toBeInstanceOf(ConsoleAnalyticsProvider);
      expect(provider.name).toBe('console');
    });

    it('should provide GoogleAnalyticsProvider when provider is "google"', () => {
      TestBed.configureTestingModule({
        providers: [
          provideAnalytics(),
          { provide: ENVIRONMENT, useValue: createMockEnv('google', true, 'G-TEST123') },
          { provide: LoggerService, useValue: loggerSpy },
          { provide: DOCUMENT, useValue: mockDocument },
        ],
      });

      const provider = TestBed.inject(ANALYTICS_PROVIDER);

      expect(provider).toBeInstanceOf(GoogleAnalyticsProvider);
      expect(provider.name).toBe('google');
    });

    it('should default to ConsoleAnalyticsProvider for unknown provider types', () => {
      const env = createMockEnv('console');
      // Force an unknown provider type for testing default case
      (env.analytics as { provider: string }).provider = 'unknown';

      TestBed.configureTestingModule({
        providers: [
          provideAnalytics(),
          { provide: ENVIRONMENT, useValue: env },
          { provide: LoggerService, useValue: loggerSpy },
        ],
      });

      const provider = TestBed.inject(ANALYTICS_PROVIDER);

      expect(provider).toBeInstanceOf(ConsoleAnalyticsProvider);
    });
  });

  describe('provider injection', () => {
    it('should provide both provider implementations', () => {
      TestBed.configureTestingModule({
        providers: [
          provideAnalytics(),
          { provide: ENVIRONMENT, useValue: createMockEnv('console') },
          { provide: LoggerService, useValue: loggerSpy },
          { provide: DOCUMENT, useValue: mockDocument },
        ],
      });

      const consoleProvider = TestBed.inject(ConsoleAnalyticsProvider);
      const googleProvider = TestBed.inject(GoogleAnalyticsProvider);

      expect(consoleProvider).toBeTruthy();
      expect(googleProvider).toBeTruthy();
    });
  });

  describe('analytics provider interface', () => {
    it('should return a provider that implements AnalyticsProvider interface', () => {
      TestBed.configureTestingModule({
        providers: [
          provideAnalytics(),
          { provide: ENVIRONMENT, useValue: createMockEnv('console') },
          { provide: LoggerService, useValue: loggerSpy },
        ],
      });

      const provider: AnalyticsProvider = TestBed.inject(ANALYTICS_PROVIDER);

      expect(provider.name).toBeDefined();
      expect(typeof provider.initialize).toBe('function');
      expect(typeof provider.trackEvent).toBe('function');
      expect(typeof provider.trackPageView).toBe('function');
    });
  });
});
