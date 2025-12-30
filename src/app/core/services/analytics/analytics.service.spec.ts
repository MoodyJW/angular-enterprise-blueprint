import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ENVIRONMENT } from '@core/config';
import type { AppEnvironment } from '@environments/environment.type';
import {
  ANALYTICS_PROVIDER,
  type AnalyticsProvider,
  type EventProperties,
} from './analytics-provider.interface';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let mockProvider: AnalyticsProvider;
  let trackEventSpy: ReturnType<typeof vi.fn>;
  let trackPageViewSpy: ReturnType<typeof vi.fn>;
  let identifySpy: ReturnType<typeof vi.fn>;
  let resetSpy: ReturnType<typeof vi.fn>;

  const createMockEnv = (enabled: boolean): AppEnvironment => ({
    appName: 'Test App',
    production: false,
    apiUrl: '/api',
    features: { mockAuth: true },
    analytics: {
      enabled,
      provider: 'console',
    },
    version: '1.0.0',
  });

  const createMockProvider = (): AnalyticsProvider => {
    trackEventSpy = vi.fn();
    trackPageViewSpy = vi.fn();
    identifySpy = vi.fn();
    resetSpy = vi.fn();

    mockProvider = {
      name: 'mock',
      initialize: () => of(undefined),
      trackEvent: trackEventSpy as unknown as (name: string, properties?: EventProperties) => void,
      trackPageView: trackPageViewSpy as unknown as (url: string, title?: string) => void,
      identify: identifySpy as unknown as (userId: string, traits?: EventProperties) => void,
      reset: resetSpy as unknown as () => void,
    };
    return mockProvider;
  };

  const createService = (enabled: boolean): AnalyticsService => {
    const providers: unknown[] = [{ provide: ENVIRONMENT, useValue: createMockEnv(enabled) }];

    if (enabled) {
      providers.push({ provide: ANALYTICS_PROVIDER, useFactory: createMockProvider });
    }

    TestBed.configureTestingModule({ providers });
    return TestBed.inject(AnalyticsService);
  };

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  describe('when analytics is enabled', () => {
    beforeEach(() => {
      service = createService(true);
    });

    describe('isEnabled', () => {
      it('should return true', () => {
        expect(service.isEnabled).toBe(true);
      });
    });

    describe('providerName', () => {
      it('should return the provider name', () => {
        expect(service.providerName).toBe('mock');
      });
    });

    describe('trackEvent', () => {
      it('should delegate to the provider', () => {
        service.trackEvent('button_click');

        expect(trackEventSpy).toHaveBeenCalledWith('button_click', undefined);
      });

      it('should pass properties to the provider', () => {
        const properties: EventProperties = { button_name: 'signup', page: 'home' };
        service.trackEvent('button_click', properties);

        expect(trackEventSpy).toHaveBeenCalledWith('button_click', properties);
      });
    });

    describe('trackPageView', () => {
      it('should delegate to the provider', () => {
        service.trackPageView('/dashboard');

        expect(trackPageViewSpy).toHaveBeenCalledWith('/dashboard', undefined);
      });

      it('should pass title to the provider', () => {
        service.trackPageView('/dashboard', 'Dashboard');

        expect(trackPageViewSpy).toHaveBeenCalledWith('/dashboard', 'Dashboard');
      });
    });

    describe('identify', () => {
      it('should delegate to the provider', () => {
        service.identify('user-123');

        expect(identifySpy).toHaveBeenCalledWith('user-123', undefined);
      });

      it('should pass traits to the provider', () => {
        const traits: EventProperties = { email: 'test@example.com', plan: 'premium' };
        service.identify('user-123', traits);

        expect(identifySpy).toHaveBeenCalledWith('user-123', traits);
      });
    });

    describe('reset', () => {
      it('should delegate to the provider', () => {
        service.reset();

        expect(resetSpy).toHaveBeenCalled();
      });
    });
  });

  describe('when analytics is disabled', () => {
    beforeEach(() => {
      service = createService(false);
    });

    describe('isEnabled', () => {
      it('should return false', () => {
        expect(service.isEnabled).toBe(false);
      });
    });

    describe('providerName', () => {
      it('should return "none"', () => {
        expect(service.providerName).toBe('none');
      });
    });

    describe('trackEvent', () => {
      it('should not throw when called', () => {
        expect(() => {
          service.trackEvent('button_click');
        }).not.toThrow();
      });
    });

    describe('trackPageView', () => {
      it('should not throw when called', () => {
        expect(() => {
          service.trackPageView('/dashboard');
        }).not.toThrow();
      });
    });

    describe('identify', () => {
      it('should not throw when called', () => {
        expect(() => {
          service.identify('user-123');
        }).not.toThrow();
      });
    });

    describe('reset', () => {
      it('should not throw when called', () => {
        expect(() => {
          service.reset();
        }).not.toThrow();
      });
    });
  });

  describe('service instantiation', () => {
    it('should be injectable when enabled', () => {
      service = createService(true);
      expect(service).toBeTruthy();
    });

    it('should be injectable when disabled', () => {
      service = createService(false);
      expect(service).toBeTruthy();
    });
  });

  describe('performInitialization', () => {
    it('should call provider.initialize() when invoked', () => {
      const initSpy = vi.fn().mockReturnValue(of(undefined));
      TestBed.configureTestingModule({
        providers: [
          { provide: ENVIRONMENT, useValue: createMockEnv(true) },
          {
            provide: ANALYTICS_PROVIDER,
            useValue: {
              name: 'test-mock',
              initialize: initSpy,
              trackEvent: vi.fn(),
              trackPageView: vi.fn(),
              identify: vi.fn(),
              reset: vi.fn(),
            },
          },
        ],
      });

      service = TestBed.inject(AnalyticsService);

      // State should be pending before initialization
      expect(service._initializationState).toBe('pending');

      service.performInitialization();

      expect(initSpy).toHaveBeenCalledTimes(1);
    });

    it('should transition to done state after successful initialization', () => {
      const initSpy = vi.fn().mockReturnValue(of(undefined));
      TestBed.configureTestingModule({
        providers: [
          { provide: ENVIRONMENT, useValue: createMockEnv(true) },
          {
            provide: ANALYTICS_PROVIDER,
            useValue: {
              name: 'test-mock',
              initialize: initSpy,
              trackEvent: vi.fn(),
              trackPageView: vi.fn(),
              identify: vi.fn(),
              reset: vi.fn(),
            },
          },
        ],
      });

      service = TestBed.inject(AnalyticsService);
      service.performInitialization();

      // of() emits synchronously, so state is immediately 'done'
      expect(service._initializationState).toBe('done');
    });

    it('should transition to error state and log when initialization fails', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const testError = new Error('Init failed');
      const initSpy = vi.fn().mockReturnValue(throwError(() => testError));

      TestBed.configureTestingModule({
        providers: [
          { provide: ENVIRONMENT, useValue: createMockEnv(true) },
          {
            provide: ANALYTICS_PROVIDER,
            useValue: {
              name: 'failing-mock',
              initialize: initSpy,
              trackEvent: vi.fn(),
              trackPageView: vi.fn(),
              identify: vi.fn(),
              reset: vi.fn(),
            },
          },
        ],
      });

      service = TestBed.inject(AnalyticsService);
      service.performInitialization();

      // throwError() emits synchronously, so state is immediately 'error'
      expect(service._initializationState).toBe('error');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to initialize failing-mock provider'),
        testError,
      );
    });

    it('should not call initialize when analytics is disabled', () => {
      service = createService(false);

      // Should not throw even when provider is null
      expect(() => {
        service.performInitialization();
      }).not.toThrow();
    });

    it('should only initialize once (idempotent)', () => {
      const initSpy = vi.fn().mockReturnValue(of(undefined));
      TestBed.configureTestingModule({
        providers: [
          { provide: ENVIRONMENT, useValue: createMockEnv(true) },
          {
            provide: ANALYTICS_PROVIDER,
            useValue: {
              name: 'test-mock',
              initialize: initSpy,
              trackEvent: vi.fn(),
              trackPageView: vi.fn(),
              identify: vi.fn(),
              reset: vi.fn(),
            },
          },
        ],
      });

      service = TestBed.inject(AnalyticsService);

      service.performInitialization();
      service.performInitialization();
      service.performInitialization();

      // Should only be called once despite multiple invocations
      expect(initSpy).toHaveBeenCalledTimes(1);
    });
  });
});
