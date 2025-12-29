import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Properties that can be sent with analytics events.
 */
export type EventProperties = Record<string, string | number | boolean | null | undefined>;

/**
 * Contract for analytics providers.
 *
 * This interface defines what any analytics provider must implement,
 * enabling the Strategy Pattern for swappable analytics backends.
 *
 * ## Available Implementations
 * - `ConsoleAnalyticsProvider` - Logs to console (dev/testing)
 * - `GoogleAnalyticsProvider` - Sends to GA4 (production)
 *
 * ## Adding a New Provider
 *
 * To add a new analytics vendor (e.g., Mixpanel, Amplitude):
 *
 * 1. Create a new class implementing this interface
 * 2. Add the provider type to `AnalyticsProviderType`
 * 3. Register it in `provideAnalytics()`
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class MixpanelAnalyticsProvider implements AnalyticsProvider {
 *   readonly name = 'mixpanel';
 *
 *   initialize(): Observable<void> {
 *     return of(undefined).pipe(
 *       tap(() => { // Load Mixpanel SDK })
 *     );
 *   }
 *
 *   trackEvent(name: string, properties?: EventProperties): void {
 *     mixpanel.track(name, properties);
 *   }
 *
 *   trackPageView(url: string, title?: string): void {
 *     mixpanel.track('Page View', { url, title });
 *   }
 * }
 * ```
 */
export interface AnalyticsProvider {
  /**
   * Human-readable name of the provider.
   * Used for logging and debugging.
   */
  readonly name: string;

  /**
   * Initialize the analytics provider.
   *
   * Called once during application bootstrap.
   * Should load any required SDKs/scripts.
   *
   * @returns Observable that completes when initialization is done
   */
  initialize(): Observable<void>;

  /**
   * Track a custom event.
   *
   * @param name - Event name (e.g., 'button_click', 'purchase')
   * @param properties - Optional event properties/metadata
   */
  trackEvent(name: string, properties?: EventProperties): void;

  /**
   * Track a page view.
   *
   * @param url - The URL/path being viewed
   * @param title - Optional page title
   */
  trackPageView(url: string, title?: string): void;

  /**
   * Set user identity for analytics.
   *
   * @param userId - Unique user identifier
   * @param traits - Optional user traits/properties
   */
  identify?(userId: string, traits?: EventProperties): void;

  /**
   * Reset/clear user identity.
   * Called on logout.
   */
  reset?(): void;
}

/**
 * Supported analytics provider types.
 */
export type AnalyticsProviderType = 'console' | 'google';

/**
 * Injection token for the analytics provider.
 *
 * Use this token to inject the current analytics provider.
 * The actual implementation is determined by environment configuration.
 *
 * @example
 * ```typescript
 * // In a service
 * private readonly provider = inject(ANALYTICS_PROVIDER);
 *
 * // Direct usage (prefer AnalyticsService instead)
 * this.provider.trackEvent('custom_event');
 * ```
 */
export const ANALYTICS_PROVIDER = new InjectionToken<AnalyticsProvider>('AnalyticsProvider');
