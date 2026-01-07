import { DOCUMENT } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ENVIRONMENT } from '@core/config';
import type { AppEnvironment } from '@environments/environment.type';
import {
  ANALYTICS_PROVIDER,
  type AnalyticsProvider,
  type EventProperties,
} from './analytics-provider.interface';
import { withAnalyticsRouterTracking } from './analytics-router.provider';
import { AnalyticsService } from './analytics.service';

// Dummy components for routing
@Component({ selector: 'eb-test-home', template: '' })
class HomeComponent {}

@Component({ selector: 'eb-test-dashboard', template: '' })
class DashboardComponent {}

@Component({ selector: 'eb-test-about', template: '' })
class AboutComponent {}

describe('withAnalyticsRouterTracking', () => {
  let trackPageViewSpy: ReturnType<typeof vi.fn>;

  const createMockEnv = (enabled: boolean): AppEnvironment => ({
    appName: 'Test App',
    production: false,
    apiUrl: '/api',
    features: { mockAuth: true },
    analytics: { enabled, provider: 'console' },
    version: '1.0.0',
  });

  const createMockProvider = (): AnalyticsProvider => {
    trackPageViewSpy = vi.fn();
    return {
      name: 'mock',
      initialize: () => of(undefined),
      trackEvent: vi.fn() as unknown as (name: string, properties?: EventProperties) => void,
      trackPageView: trackPageViewSpy as unknown as (url: string, title?: string) => void,
      identify: vi.fn() as unknown as (userId: string, traits?: EventProperties) => void,
      reset: vi.fn() as unknown as () => void,
    };
  };

  const mockDocument = {
    title: 'Test Page Title',
  };

  beforeEach(() => {
    trackPageViewSpy = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  describe('when analytics is enabled', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([
            { path: '', component: HomeComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'about', component: AboutComponent },
          ]),
          withAnalyticsRouterTracking(),
          { provide: ENVIRONMENT, useValue: createMockEnv(true) },
          { provide: ANALYTICS_PROVIDER, useFactory: createMockProvider },
          { provide: DOCUMENT, useValue: mockDocument },
        ],
      });
    });

    it('should provide router tracking without errors', () => {
      const analyticsService = TestBed.inject(AnalyticsService);

      expect(analyticsService).toBeTruthy();
      expect(analyticsService.isEnabled).toBe(true);
    });

    it('should have analytics service available with mock provider', () => {
      const analyticsService = TestBed.inject(AnalyticsService);

      expect(analyticsService.providerName).toBe('mock');
    });

    it('should be able to track page views manually', () => {
      const analyticsService = TestBed.inject(AnalyticsService);

      analyticsService.trackPageView('/test', 'Test');

      expect(trackPageViewSpy).toHaveBeenCalledWith('/test', 'Test');
    });

    it('should track page view on NavigationEnd', async () => {
      const router = TestBed.inject(Router);

      await router.navigate(['/dashboard']);

      expect(trackPageViewSpy).toHaveBeenCalledWith('/dashboard', 'Test Page Title');
    });

    it('should track multiple page views on navigation', async () => {
      const router = TestBed.inject(Router);

      await router.navigate(['/dashboard']);
      await router.navigate(['/about']);

      expect(trackPageViewSpy).toHaveBeenCalledTimes(2);
      expect(trackPageViewSpy).toHaveBeenCalledWith('/dashboard', 'Test Page Title');
      expect(trackPageViewSpy).toHaveBeenCalledWith('/about', 'Test Page Title');
    });

    it('should use urlAfterRedirects for tracking', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideRouter([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'dashboard', component: DashboardComponent },
          ]),
          withAnalyticsRouterTracking(),
          { provide: ENVIRONMENT, useValue: createMockEnv(true) },
          { provide: ANALYTICS_PROVIDER, useFactory: createMockProvider },
          { provide: DOCUMENT, useValue: mockDocument },
        ],
      });

      const router = TestBed.inject(Router);

      await router.navigate(['/']);

      // Should track the final URL after redirect, not the original
      expect(trackPageViewSpy).toHaveBeenCalledWith('/home', 'Test Page Title');
    });
  });

  describe('when analytics is disabled', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([
            { path: '', component: HomeComponent },
            { path: 'dashboard', component: DashboardComponent },
          ]),
          withAnalyticsRouterTracking(),
          { provide: ENVIRONMENT, useValue: createMockEnv(false) },
          { provide: DOCUMENT, useValue: mockDocument },
        ],
      });
    });

    it('should not throw when analytics is disabled', () => {
      const analyticsService = TestBed.inject(AnalyticsService);

      expect(analyticsService.isEnabled).toBe(false);
    });

    it('should have provider name as "none" when disabled', () => {
      const analyticsService = TestBed.inject(AnalyticsService);

      expect(analyticsService.providerName).toBe('none');
    });

    it('should safely no-op when tracking page views while disabled', () => {
      const analyticsService = TestBed.inject(AnalyticsService);

      // Should not throw
      expect(() => {
        analyticsService.trackPageView('/test', 'Test');
      }).not.toThrow();
    });

    it('should not track page views on navigation when disabled', async () => {
      const router = TestBed.inject(Router);

      await router.navigate(['/dashboard']);

      // trackPageViewSpy should not be called since analytics is disabled
      expect(trackPageViewSpy).not.toHaveBeenCalled();
    });
  });

  describe('integration with Router', () => {
    it('should inject Router successfully alongside analytics', () => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([
            { path: '', component: HomeComponent },
            { path: 'dashboard', component: DashboardComponent },
          ]),
          withAnalyticsRouterTracking(),
          { provide: ENVIRONMENT, useValue: createMockEnv(true) },
          { provide: ANALYTICS_PROVIDER, useFactory: createMockProvider },
          { provide: DOCUMENT, useValue: mockDocument },
        ],
      });

      const router = TestBed.inject(Router);
      const analyticsService = TestBed.inject(AnalyticsService);

      expect(router).toBeTruthy();
      expect(analyticsService).toBeTruthy();
    });
  });
});
