import { afterNextRender, inject, Injectable } from '@angular/core';

import type { AppEnvironment } from '../../config';
import { ENVIRONMENT } from '../../config';
import { LoggerService } from '../logger';
import {
  ANALYTICS_PROVIDER,
  type AnalyticsProvider,
  type EventProperties,
} from './analytics-provider.interface';

// Re-export for convenience
export type { EventProperties } from './analytics-provider.interface';

/**
 * Centralized analytics service that delegates to the configured provider.
 *
 * This service acts as a facade over the analytics provider, offering:
 * - Unified API regardless of the underlying provider
 * - Automatic enable/disable based on environment
 * - Null-safety when analytics is disabled
 *
 * ## Strategy Pattern
 *
 * The actual analytics implementation is determined by `environment.analytics.provider`:
 * - `'console'` → ConsoleAnalyticsProvider (logs to console)
 * - `'google'` → GoogleAnalyticsProvider (sends to GA4)
 *
 * ## Usage
 *
 * @example
 * ```typescript
 * export class CheckoutComponent {
 *   private readonly analytics = inject(AnalyticsService);
 *
 *   onPurchase(orderId: string, total: number) {
 *     this.analytics.trackEvent('purchase', {
 *       order_id: orderId,
 *       value: total,
 *       currency: 'USD'
 *     });
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // User identification (for authenticated users)
 * onLogin(user: User) {
 *   this.analytics.identify(user.id, {
 *     email: user.email,
 *     plan: user.subscriptionPlan
 *   });
 * }
 *
 * onLogout() {
 *   this.analytics.reset();
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly env: AppEnvironment = inject(ENVIRONMENT);
  private readonly logger = inject(LoggerService);
  private readonly provider: AnalyticsProvider | null = this.env.analytics.enabled
    ? inject(ANALYTICS_PROVIDER)
    : null;

  /** Whether the provider has been initialized. Exposed for testing. */
  private initializationState: 'pending' | 'initializing' | 'done' | 'error' = 'pending';

  constructor() {
    // Initialize lazily after the first render to avoid blocking TTI
    afterNextRender(() => {
      this.performInitialization();
    });
  }

  /**
   * Performs the provider initialization.
   * Extracted for testability - the constructor schedules this via afterNextRender.
   * @internal
   */
  performInitialization(): void {
    if (!this.provider || this.initializationState !== 'pending') {
      return;
    }

    this.initializationState = 'initializing';
    this.provider
      .initialize()
      .then(() => {
        this.initializationState = 'done';
      })
      .catch((error: unknown) => {
        this.initializationState = 'error';
        this.logger.error(`[Analytics] Failed to initialize ${this.providerName} provider:`, error);
      });
  }

  /**
   * Get the current initialization state. Exposed for testing.
   * @internal
   */
  get _initializationState(): string {
    return this.initializationState;
  }

  /**
   * Whether analytics is currently enabled.
   */
  get isEnabled(): boolean {
    return this.provider !== null;
  }

  /**
   * The name of the current analytics provider.
   * Returns 'none' if analytics is disabled.
   */
  get providerName(): string {
    return this.provider?.name ?? 'none';
  }

  /**
   * Track a custom event.
   *
   * @param name - Event name (e.g., 'button_click', 'form_submit', 'purchase')
   * @param properties - Optional event properties/metadata
   *
   * @example
   * ```typescript
   * // Simple event
   * analytics.trackEvent('signup_started');
   *
   * // Event with properties
   * analytics.trackEvent('item_added_to_cart', {
   *   product_id: 'SKU-123',
   *   product_name: 'Widget Pro',
   *   price: 29.99,
   *   currency: 'USD'
   * });
   * ```
   */
  trackEvent(name: string, properties?: EventProperties): void {
    this.provider?.trackEvent(name, properties);
  }

  /**
   * Track a page view.
   *
   * Note: If using `withAnalyticsRouterTracking()`, page views are
   * tracked automatically on route changes.
   *
   * @param url - The page URL/path
   * @param title - Optional page title
   *
   * @example
   * ```typescript
   * analytics.trackPageView('/products/123', 'Widget Pro - Product Details');
   * ```
   */
  trackPageView(url: string, title?: string): void {
    this.provider?.trackPageView(url, title);
  }

  /**
   * Identify the current user.
   *
   * Call this after a user logs in to associate their actions
   * with their user ID across sessions.
   *
   * @param userId - Unique user identifier
   * @param traits - Optional user traits (email, plan, etc.)
   *
   * @example
   * ```typescript
   * analytics.identify('user-123', {
   *   email: 'user@example.com',
   *   plan: 'premium',
   *   created_at: '2024-01-15'
   * });
   * ```
   */
  identify(userId: string, traits?: EventProperties): void {
    this.provider?.identify?.(userId, traits);
  }

  /**
   * Reset/clear the user identity.
   *
   * Call this when a user logs out to stop associating
   * subsequent events with their user ID.
   *
   * @example
   * ```typescript
   * onLogout() {
   *   this.authService.logout();
   *   this.analytics.reset();
   * }
   * ```
   */
  reset(): void {
    this.provider?.reset?.();
  }
}
