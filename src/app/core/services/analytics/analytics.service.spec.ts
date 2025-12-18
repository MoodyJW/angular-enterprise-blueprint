import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AppEnvironment } from '../../../../environments/environment.type';
import { ENVIRONMENT } from '../../config';
import { LoggerService } from '../logger';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let loggerSpy: { log: ReturnType<typeof vi.fn>; info: ReturnType<typeof vi.fn> };

  const createService = (analyticsEnabled: boolean): AnalyticsService => {
    const mockEnv: AppEnvironment = {
      appName: 'Test App',
      production: false,
      apiUrl: '/api',
      features: { mockAuth: true, analytics: analyticsEnabled },
      version: '1.0.0',
    };

    loggerSpy = {
      log: vi.fn(),
      info: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ENVIRONMENT, useValue: mockEnv },
        { provide: LoggerService, useValue: loggerSpy },
      ],
    });

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

    describe('trackEvent', () => {
      it('should send event via logger.info with [Analytics] prefix', () => {
        service.trackEvent('button_click');

        expect(loggerSpy.info).toHaveBeenCalledWith('[Analytics] Event: button_click', undefined);
      });

      it('should send event with properties', () => {
        const properties = { button_name: 'signup', page: 'home' };
        service.trackEvent('button_click', properties);

        expect(loggerSpy.info).toHaveBeenCalledWith('[Analytics] Event: button_click', properties);
      });

      it('should NOT call logger.log for mock events', () => {
        service.trackEvent('test_event');

        expect(loggerSpy.log).not.toHaveBeenCalled();
      });
    });

    describe('trackPageView', () => {
      it('should send page view via logger.info with [Analytics] prefix', () => {
        service.trackPageView('/dashboard');

        expect(loggerSpy.info).toHaveBeenCalledWith('[Analytics] Page View: /dashboard');
      });

      it('should NOT call logger.log for mock page views', () => {
        service.trackPageView('/home');

        expect(loggerSpy.log).not.toHaveBeenCalled();
      });
    });
  });

  describe('when analytics is disabled', () => {
    beforeEach(() => {
      service = createService(false);
    });

    describe('trackEvent', () => {
      it('should log mock event via logger.log with [Analytics Mock] prefix', () => {
        service.trackEvent('button_click');

        expect(loggerSpy.log).toHaveBeenCalledWith(
          '[Analytics Mock] Event: button_click',
          undefined,
        );
      });

      it('should log mock event with properties', () => {
        const properties = { action: 'submit', form: 'contact' };
        service.trackEvent('form_submit', properties);

        expect(loggerSpy.log).toHaveBeenCalledWith(
          '[Analytics Mock] Event: form_submit',
          properties,
        );
      });

      it('should NOT call logger.info when disabled', () => {
        service.trackEvent('test_event');

        expect(loggerSpy.info).not.toHaveBeenCalled();
      });
    });

    describe('trackPageView', () => {
      it('should log mock page view via logger.log with [Analytics Mock] prefix', () => {
        service.trackPageView('/about');

        expect(loggerSpy.log).toHaveBeenCalledWith('[Analytics Mock] Page View: /about');
      });

      it('should NOT call logger.info when disabled', () => {
        service.trackPageView('/contact');

        expect(loggerSpy.info).not.toHaveBeenCalled();
      });
    });
  });

  describe('event properties', () => {
    beforeEach(() => {
      service = createService(false);
    });

    it('should handle string properties', () => {
      service.trackEvent('test', { category: 'navigation' });

      expect(loggerSpy.log).toHaveBeenCalledWith('[Analytics Mock] Event: test', {
        category: 'navigation',
      });
    });

    it('should handle number properties', () => {
      service.trackEvent('purchase', { price: 29.99, quantity: 2 });

      expect(loggerSpy.log).toHaveBeenCalledWith('[Analytics Mock] Event: purchase', {
        price: 29.99,
        quantity: 2,
      });
    });

    it('should handle boolean properties', () => {
      service.trackEvent('toggle', { enabled: true, premium: false });

      expect(loggerSpy.log).toHaveBeenCalledWith('[Analytics Mock] Event: toggle', {
        enabled: true,
        premium: false,
      });
    });

    it('should handle null and undefined properties', () => {
      service.trackEvent('test', { value: null, optional: undefined });

      expect(loggerSpy.log).toHaveBeenCalledWith('[Analytics Mock] Event: test', {
        value: null,
        optional: undefined,
      });
    });

    it('should handle undefined properties parameter', () => {
      service.trackEvent('simple_event');

      expect(loggerSpy.log).toHaveBeenCalledWith('[Analytics Mock] Event: simple_event', undefined);
    });
  });

  describe('service instantiation', () => {
    it('should be provided in root', () => {
      service = createService(false);

      expect(service).toBeTruthy();
    });
  });
});
