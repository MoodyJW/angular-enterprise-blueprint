import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { catchError, firstValueFrom, of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ENVIRONMENT } from '@core/config';
import type { AppEnvironment } from '@environments/environment.type';
import { LoggerService } from '../../logger';
import { AnalyticsLoaderService } from '../analytics-loader.service';
import { GoogleAnalyticsProvider } from './google-analytics.provider';

describe('GoogleAnalyticsProvider', () => {
  let provider: GoogleAnalyticsProvider;
  let loggerSpy: {
    info: ReturnType<typeof vi.fn>;
    warn: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };
  let loaderSpy: {
    loadScript: ReturnType<typeof vi.fn>;
  };
  let mockDocument: {
    defaultView: Window | null;
  };

  const createMockEnv = (measurementId?: string): AppEnvironment => ({
    appName: 'Test App',
    production: true,
    apiUrl: '/api',
    features: { mockAuth: false },
    analytics: {
      enabled: true,
      provider: 'google',
      google: measurementId !== undefined ? { measurementId } : undefined,
    },
    version: '1.0.0',
  });

  const createProvider = (env: AppEnvironment): GoogleAnalyticsProvider => {
    TestBed.configureTestingModule({
      providers: [
        GoogleAnalyticsProvider,
        { provide: ENVIRONMENT, useValue: env },
        { provide: LoggerService, useValue: loggerSpy },
        { provide: AnalyticsLoaderService, useValue: loaderSpy },
        { provide: DOCUMENT, useValue: mockDocument },
      ],
    });

    return TestBed.inject(GoogleAnalyticsProvider);
  };

  beforeEach(() => {
    loggerSpy = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    loaderSpy = {
      loadScript: vi.fn(),
    };

    mockDocument = {
      defaultView: {
        dataLayer: undefined,
        gtag: undefined,
      } as unknown as Window,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  describe('name', () => {
    it('should return "google"', () => {
      provider = createProvider(createMockEnv('G-TEST123'));
      expect(provider.name).toBe('google');
    });
  });

  describe('initialize', () => {
    it('should warn and skip when no measurement ID is configured', async () => {
      provider = createProvider(createMockEnv());

      await firstValueFrom(provider.initialize());

      expect(loggerSpy.warn).toHaveBeenCalledWith(
        '[Analytics:Google] No measurement ID configured, skipping initialization',
      );
      expect(loaderSpy.loadScript).not.toHaveBeenCalled();
    });

    it('should warn and skip when measurement ID is empty', async () => {
      provider = createProvider(createMockEnv(''));

      await firstValueFrom(provider.initialize());

      expect(loggerSpy.warn).toHaveBeenCalledWith(
        '[Analytics:Google] No measurement ID configured, skipping initialization',
      );
    });

    it('should error and skip when measurement ID format is invalid', async () => {
      provider = createProvider(createMockEnv('INVALID-ID'));

      await firstValueFrom(provider.initialize());

      expect(loggerSpy.error).toHaveBeenCalledWith(
        '[Analytics:Google] Invalid measurement ID format',
        expect.objectContaining({ measurementId: 'INVALID-ID' }),
      );
      expect(loaderSpy.loadScript).not.toHaveBeenCalled();
    });

    it('should load gtag script via loader service with correct URL for GA4', async () => {
      loaderSpy.loadScript.mockReturnValue(of(undefined));
      provider = createProvider(createMockEnv('G-TEST123'));

      await firstValueFrom(provider.initialize());

      expect(loaderSpy.loadScript).toHaveBeenCalledWith(
        'https://www.googletagmanager.com/gtag/js?id=G-TEST123',
      );
      expect(loggerSpy.info).toHaveBeenCalledWith(
        '[Analytics:Google] Initialized with ID: G-TEST123',
      );
    });

    it('should load gtag script via loader service with correct URL for UA', async () => {
      loaderSpy.loadScript.mockReturnValue(of(undefined));
      provider = createProvider(createMockEnv('UA-12345-1'));

      await firstValueFrom(provider.initialize());

      expect(loaderSpy.loadScript).toHaveBeenCalledWith(
        'https://www.googletagmanager.com/gtag/js?id=UA-12345-1',
      );
    });

    it('should handle script load error', async () => {
      const error = new Error('Load failed');
      loaderSpy.loadScript.mockReturnValue(throwError(() => error));
      provider = createProvider(createMockEnv('G-TEST123'));

      await firstValueFrom(provider.initialize().pipe(catchError(() => of(undefined))));

      expect(loggerSpy.error).toHaveBeenCalledWith(
        '[Analytics:Google] Failed to initialize:',
        error,
      );
    });

    it('should initialize dataLayer and gtag function', async () => {
      loaderSpy.loadScript.mockReturnValue(of(undefined));
      const mockWindow = mockDocument.defaultView as Window;
      provider = createProvider(createMockEnv('G-TEST123'));

      await firstValueFrom(provider.initialize());

      expect(mockWindow.dataLayer).toBeDefined();
      expect(mockWindow.gtag).toBeDefined();
    });

    it('should throw error if window is not available', () => {
      mockDocument.defaultView = null;
      loaderSpy.loadScript.mockReturnValue(of(undefined));
      provider = createProvider(createMockEnv('G-TEST123'));

      expect(() => {
        provider.initialize();
      }).toThrowError('Window not available');
    });
  });

  describe('trackEvent', () => {
    it('should not call gtag if not initialized', () => {
      provider = createProvider(createMockEnv('G-TEST123'));
      provider.trackEvent('test_event');
      expect(loggerSpy.info).not.toHaveBeenCalledWith(expect.stringContaining('Event:'));
    });

    it('should call gtag with event data when initialized', async () => {
      loaderSpy.loadScript.mockReturnValue(of(undefined));
      const mockWindow = mockDocument.defaultView as Window;
      provider = createProvider(createMockEnv('G-TEST123'));
      await firstValueFrom(provider.initialize());

      provider.trackEvent('button_click', { button_name: 'signup' });

      expect(loggerSpy.info).toHaveBeenCalledWith(
        '[Analytics:Google] Event: button_click',
        expect.anything(),
      );
      expect(mockWindow.dataLayer).toContainEqual([
        'event',
        'button_click',
        { button_name: 'signup' },
      ]);
    });
  });

  describe('trackPageView', () => {
    it('should call gtag with page view data when initialized', async () => {
      loaderSpy.loadScript.mockReturnValue(of(undefined));
      const mockWindow = mockDocument.defaultView as Window;
      provider = createProvider(createMockEnv('G-TEST123'));
      await firstValueFrom(provider.initialize());

      provider.trackPageView('/dashboard', 'Dashboard');

      expect(loggerSpy.info).toHaveBeenCalledWith('[Analytics:Google] Page View: /dashboard');
      expect(mockWindow.dataLayer).toContainEqual([
        'event',
        'page_view',
        { page_path: '/dashboard', page_title: 'Dashboard' },
      ]);
    });
  });

  describe('identify', () => {
    it('should call gtag set with user ID when initialized', async () => {
      loaderSpy.loadScript.mockReturnValue(of(undefined));
      const mockWindow = mockDocument.defaultView as Window;
      provider = createProvider(createMockEnv('G-TEST123'));
      await firstValueFrom(provider.initialize());

      provider.identify('user-123', { plan: 'premium' });

      expect(loggerSpy.info).toHaveBeenCalledWith('[Analytics:Google] Identify: user-123');
      expect(mockWindow.dataLayer).toContainEqual([
        'set',
        { user_id: 'user-123', plan: 'premium' },
      ]);
    });
  });

  describe('reset', () => {
    it('should clear user_id when initialized', async () => {
      loaderSpy.loadScript.mockReturnValue(of(undefined));
      const mockWindow = mockDocument.defaultView as Window;
      provider = createProvider(createMockEnv('G-TEST123'));
      await firstValueFrom(provider.initialize());

      provider.reset();

      expect(loggerSpy.info).toHaveBeenCalledWith('[Analytics:Google] User identity reset');
      expect(mockWindow.dataLayer).toContainEqual(['set', { user_id: null }]);
    });
  });
});
