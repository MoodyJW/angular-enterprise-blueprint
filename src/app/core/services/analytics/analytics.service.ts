import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '../../config';
import { LoggerService } from '../logger';

/**
 * Properties that can be sent with analytics events.
 * Use specific types when possible for better type safety.
 */
export type EventProperties = Record<string, string | number | boolean | null | undefined>;

/**
 * Centralized analytics service that abstracts the analytics provider.
 *
 * This service provides a consistent analytics interface across the application,
 * allowing for easy swapping of analytics vendors (GA4, GTM, Mixpanel, etc.)
 * without requiring changes to application code.
 *
 * **Behavior based on `environment.features.analytics`:**
 * - When `true`: Events are sent to the configured analytics provider
 * - When `false`: Events are logged to console with "[Analytics Mock]" prefix
 *
 * @example
 * ```typescript
 * export class MyComponent {
 *   private readonly analytics = inject(AnalyticsService);
 *
 *   onButtonClick() {
 *     this.analytics.trackEvent('button_click', {
 *       button_name: 'signup',
 *       page: 'home'
 *     });
 *   }
 *
 *   ngOnInit() {
 *     this.analytics.trackPageView('/dashboard');
 *   }
 * }
 * ```
 *
 * @usageNotes
 * ### GA4 Integration
 *
 * To integrate with Google Analytics 4, modify the private methods to call gtag:
 *
 * ```typescript
 * private sendEvent(name: string, properties?: EventProperties): void {
 *   gtag('event', name, properties);
 * }
 *
 * private sendPageView(url: string): void {
 *   gtag('event', 'page_view', { page_path: url });
 * }
 * ```
 *
 * ### GTM Integration
 *
 * For Google Tag Manager, push events to the dataLayer:
 *
 * ```typescript
 * private sendEvent(name: string, properties?: EventProperties): void {
 *   window.dataLayer?.push({ event: name, ...properties });
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly env = inject(ENVIRONMENT);
  private readonly logger = inject(LoggerService);

  /**
   * Tracks a custom event with optional properties.
   *
   * @param name - The event name (e.g., 'button_click', 'form_submit')
   * @param properties - Optional key-value pairs for event metadata
   *
   * @example
   * ```typescript
   * // Track a simple event
   * analytics.trackEvent('signup_started');
   *
   * // Track an event with properties
   * analytics.trackEvent('purchase_completed', {
   *   product_id: 'sku-123',
   *   price: 29.99,
   *   currency: 'USD'
   * });
   * ```
   */
  trackEvent(name: string, properties?: EventProperties): void {
    if (this.env.features.analytics) {
      this.sendEvent(name, properties);
    } else {
      this.logMockEvent(name, properties);
    }
  }

  /**
   * Tracks a page view event.
   *
   * @param url - The URL or path of the page being viewed
   *
   * @example
   * ```typescript
   * // Track page view on route change
   * router.events.pipe(
   *   filter(event => event instanceof NavigationEnd)
   * ).subscribe((event: NavigationEnd) => {
   *   analytics.trackPageView(event.urlAfterRedirects);
   * });
   * ```
   */
  trackPageView(url: string): void {
    if (this.env.features.analytics) {
      this.sendPageView(url);
    } else {
      this.logMockPageView(url);
    }
  }

  /**
   * Sends the event to the analytics provider.
   * Override this method to integrate with your preferred analytics service.
   */
  private sendEvent(name: string, properties?: EventProperties): void {
    // TODO: Implement actual analytics provider integration
    // Example GA4: gtag('event', name, properties);
    // Example GTM: window.dataLayer?.push({ event: name, ...properties });
    this.logger.info(`[Analytics] Event: ${name}`, properties);
  }

  /**
   * Sends the page view to the analytics provider.
   * Override this method to integrate with your preferred analytics service.
   */
  private sendPageView(url: string): void {
    // TODO: Implement actual analytics provider integration
    // Example GA4: gtag('event', 'page_view', { page_path: url });
    this.logger.info(`[Analytics] Page View: ${url}`);
  }

  /**
   * Logs a mock event when analytics is disabled.
   */
  private logMockEvent(name: string, properties?: EventProperties): void {
    this.logger.log(`[Analytics Mock] Event: ${name}`, properties);
  }

  /**
   * Logs a mock page view when analytics is disabled.
   */
  private logMockPageView(url: string): void {
    this.logger.log(`[Analytics Mock] Page View: ${url}`);
  }
}
