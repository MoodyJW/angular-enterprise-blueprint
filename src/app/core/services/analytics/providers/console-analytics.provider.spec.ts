import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AppEnvironment } from '../../../../../environments/environment.type';
import { ENVIRONMENT } from '../../../config';
import { LoggerService } from '../../logger';
import { ConsoleAnalyticsProvider } from './console-analytics.provider';

describe('ConsoleAnalyticsProvider', () => {
  let provider: ConsoleAnalyticsProvider;
  let loggerSpy: {
    log: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
  };

  const mockEnv: AppEnvironment = {
    appName: 'Test App',
    production: false,
    apiUrl: '/api',
    features: { mockAuth: true },
    analytics: { enabled: true, provider: 'console' },
    version: '1.0.0',
  };

  beforeEach(() => {
    loggerSpy = {
      log: vi.fn(),
      info: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ConsoleAnalyticsProvider,
        { provide: ENVIRONMENT, useValue: mockEnv },
        { provide: LoggerService, useValue: loggerSpy },
      ],
    });

    provider = TestBed.inject(ConsoleAnalyticsProvider);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  describe('name', () => {
    it('should return "console"', () => {
      expect(provider.name).toBe('console');
    });
  });

  describe('initialize', () => {
    it('should log initialization message', async () => {
      await firstValueFrom(provider.initialize());

      expect(loggerSpy.info).toHaveBeenCalledWith('[Analytics:Console] Provider initialized');
    });

    it('should complete successfully', async () => {
      await expect(firstValueFrom(provider.initialize())).resolves.toBeUndefined();
    });
  });

  describe('trackEvent', () => {
    it('should log event name', () => {
      provider.trackEvent('button_click');

      expect(loggerSpy.log).toHaveBeenCalledWith(
        '[Analytics:Console] Event: button_click',
        undefined,
      );
    });

    it('should log event with properties', () => {
      const properties = { button_name: 'signup', page: 'home' };
      provider.trackEvent('button_click', properties);

      expect(loggerSpy.log).toHaveBeenCalledWith(
        '[Analytics:Console] Event: button_click',
        properties,
      );
    });
  });

  describe('trackPageView', () => {
    it('should log page URL', () => {
      provider.trackPageView('/dashboard');

      expect(loggerSpy.log).toHaveBeenCalledWith('[Analytics:Console] Page View: /dashboard', {
        title: undefined,
      });
    });

    it('should log page URL with title', () => {
      provider.trackPageView('/dashboard', 'Dashboard');

      expect(loggerSpy.log).toHaveBeenCalledWith('[Analytics:Console] Page View: /dashboard', {
        title: 'Dashboard',
      });
    });
  });

  describe('identify', () => {
    it('should log user ID', () => {
      provider.identify('user-123');

      expect(loggerSpy.log).toHaveBeenCalledWith(
        '[Analytics:Console] Identify: user-123',
        undefined,
      );
    });

    it('should log user ID with traits', () => {
      const traits = { email: 'test@example.com', plan: 'premium' };
      provider.identify('user-123', traits);

      expect(loggerSpy.log).toHaveBeenCalledWith('[Analytics:Console] Identify: user-123', traits);
    });
  });

  describe('reset', () => {
    it('should log reset message', () => {
      provider.reset();

      expect(loggerSpy.log).toHaveBeenCalledWith('[Analytics:Console] User identity reset');
    });
  });
});
