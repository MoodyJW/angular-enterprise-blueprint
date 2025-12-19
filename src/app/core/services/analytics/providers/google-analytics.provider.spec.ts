import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AppEnvironment } from '../../../../../environments/environment.type';
import { ENVIRONMENT } from '../../../config';
import { LoggerService } from '../../logger';
import { GoogleAnalyticsProvider } from './google-analytics.provider';

describe('GoogleAnalyticsProvider', () => {
  let provider: GoogleAnalyticsProvider;
  let loggerSpy: {
    info: ReturnType<typeof vi.fn>;
    warn: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };
  let mockDocument: {
    defaultView: Window | null;
    createElement: ReturnType<typeof vi.fn>;
    head: { appendChild: ReturnType<typeof vi.fn> };
  };
  let mockScript: {
    async: boolean;
    src: string;
    onload: (() => void) | null;
    onerror: (() => void) | null;
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

    mockScript = {
      async: false,
      src: '',
      onload: null,
      onerror: null,
    };

    mockDocument = {
      defaultView: {
        dataLayer: undefined,
        gtag: undefined,
      } as unknown as Window,
      createElement: vi.fn().mockReturnValue(mockScript),
      head: { appendChild: vi.fn() },
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

      await provider.initialize();

      expect(loggerSpy.warn).toHaveBeenCalledWith(
        '[Analytics:Google] No measurement ID configured, skipping initialization',
      );
      expect(mockDocument.createElement).not.toHaveBeenCalled();
    });

    it('should warn and skip when measurement ID is empty', async () => {
      provider = createProvider(createMockEnv(''));

      await provider.initialize();

      expect(loggerSpy.warn).toHaveBeenCalledWith(
        '[Analytics:Google] No measurement ID configured, skipping initialization',
      );
    });

    it('should load gtag script with correct URL', async () => {
      provider = createProvider(createMockEnv('G-TEST123'));

      const initPromise = provider.initialize();

      // Simulate script load
      mockScript.onload?.();
      await initPromise;

      expect(mockDocument.createElement).toHaveBeenCalledWith('script');
      expect(mockScript.async).toBe(true);
      expect(mockScript.src).toBe('https://www.googletagmanager.com/gtag/js?id=G-TEST123');
      expect(mockDocument.head.appendChild).toHaveBeenCalledWith(mockScript);
    });

    it('should log success on initialization', async () => {
      provider = createProvider(createMockEnv('G-TEST123'));

      const initPromise = provider.initialize();
      mockScript.onload?.();
      await initPromise;

      expect(loggerSpy.info).toHaveBeenCalledWith(
        '[Analytics:Google] Initialized with ID: G-TEST123',
      );
    });

    it('should handle script load error', async () => {
      provider = createProvider(createMockEnv('G-TEST123'));

      const initPromise = provider.initialize();
      mockScript.onerror?.();

      await initPromise;

      expect(loggerSpy.error).toHaveBeenCalledWith(
        '[Analytics:Google] Failed to initialize:',
        expect.any(Error),
      );
    });

    it('should handle missing window', async () => {
      mockDocument.defaultView = null;
      provider = createProvider(createMockEnv('G-TEST123'));

      await provider.initialize();

      expect(loggerSpy.error).toHaveBeenCalledWith(
        '[Analytics:Google] Failed to initialize:',
        expect.objectContaining({ message: 'Window not available' }),
      );
    });

    it('should initialize dataLayer and gtag function', async () => {
      const mockWindow = mockDocument.defaultView as Window;
      provider = createProvider(createMockEnv('G-TEST123'));

      const initPromise = provider.initialize();
      mockScript.onload?.();
      await initPromise;

      expect(mockWindow.dataLayer).toBeDefined();
      expect(mockWindow.gtag).toBeDefined();
    });
  });

  describe('trackEvent', () => {
    it('should not call gtag if not initialized', () => {
      provider = createProvider(createMockEnv('G-TEST123'));

      // Call without initializing
      provider.trackEvent('test_event');

      expect(loggerSpy.info).not.toHaveBeenCalledWith(expect.stringContaining('Event:'));
    });

    it('should call gtag with event data when initialized', async () => {
      const mockWindow = mockDocument.defaultView as Window;
      provider = createProvider(createMockEnv('G-TEST123'));

      const initPromise = provider.initialize();
      mockScript.onload?.();
      await initPromise;

      provider.trackEvent('button_click', { button_name: 'signup' });

      expect(loggerSpy.info).toHaveBeenCalledWith('[Analytics:Google] Event: button_click', {
        button_name: 'signup',
      });
      // Verify gtag was called (via dataLayer)
      expect(mockWindow.dataLayer).toContainEqual([
        'event',
        'button_click',
        { button_name: 'signup' },
      ]);
    });
  });

  describe('trackPageView', () => {
    it('should not call gtag if not initialized', () => {
      provider = createProvider(createMockEnv('G-TEST123'));

      provider.trackPageView('/dashboard');

      expect(loggerSpy.info).not.toHaveBeenCalledWith(expect.stringContaining('Page View:'));
    });

    it('should call gtag with page view data when initialized', async () => {
      const mockWindow = mockDocument.defaultView as Window;
      provider = createProvider(createMockEnv('G-TEST123'));

      const initPromise = provider.initialize();
      mockScript.onload?.();
      await initPromise;

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
    it('should not call gtag if not initialized', () => {
      provider = createProvider(createMockEnv('G-TEST123'));

      provider.identify('user-123');

      expect(loggerSpy.info).not.toHaveBeenCalledWith(expect.stringContaining('Identify:'));
    });

    it('should call gtag set with user ID when initialized', async () => {
      const mockWindow = mockDocument.defaultView as Window;
      provider = createProvider(createMockEnv('G-TEST123'));

      const initPromise = provider.initialize();
      mockScript.onload?.();
      await initPromise;

      provider.identify('user-123', { plan: 'premium' });

      expect(loggerSpy.info).toHaveBeenCalledWith('[Analytics:Google] Identify: user-123');
      expect(mockWindow.dataLayer).toContainEqual([
        'set',
        { user_id: 'user-123', plan: 'premium' },
      ]);
    });
  });

  describe('reset', () => {
    it('should not call gtag if not initialized', () => {
      provider = createProvider(createMockEnv('G-TEST123'));

      provider.reset();

      expect(loggerSpy.info).not.toHaveBeenCalledWith(expect.stringContaining('reset'));
    });

    it('should clear user_id when initialized', async () => {
      const mockWindow = mockDocument.defaultView as Window;
      provider = createProvider(createMockEnv('G-TEST123'));

      const initPromise = provider.initialize();
      mockScript.onload?.();
      await initPromise;

      provider.reset();

      expect(loggerSpy.info).toHaveBeenCalledWith('[Analytics:Google] User identity reset');
      expect(mockWindow.dataLayer).toContainEqual(['set', { user_id: null }]);
    });
  });
});
