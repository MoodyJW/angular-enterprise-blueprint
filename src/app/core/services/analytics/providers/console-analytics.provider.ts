import { inject, Injectable } from '@angular/core';

import { LoggerService } from '../../logger';
import type { AnalyticsProvider, EventProperties } from '../analytics-provider.interface';

/**
 * Console-based analytics provider for development and testing.
 *
 * This provider logs all analytics events to the console instead of
 * sending them to a real analytics service. Useful for:
 *
 * - Local development (see what events would be tracked)
 * - Testing (verify events are triggered correctly)
 * - Debugging (inspect event payloads)
 * - Demo environments (no real tracking needed)
 *
 * @example
 * ```typescript
 * // In environment.ts
 * analytics: {
 *   provider: 'console',
 *   // ...
 * }
 * ```
 */
@Injectable()
export class ConsoleAnalyticsProvider implements AnalyticsProvider {
  readonly name = 'console';

  private readonly logger = inject(LoggerService);

  initialize(): Promise<void> {
    this.logger.info('[Analytics:Console] Provider initialized');
    return Promise.resolve();
  }

  trackEvent(name: string, properties?: EventProperties): void {
    this.logger.log(`[Analytics:Console] Event: ${name}`, properties);
  }

  trackPageView(url: string, title?: string): void {
    this.logger.log(`[Analytics:Console] Page View: ${url}`, { title });
  }

  identify(userId: string, traits?: EventProperties): void {
    this.logger.log(`[Analytics:Console] Identify: ${userId}`, traits);
  }

  reset(): void {
    this.logger.log('[Analytics:Console] User identity reset');
  }
}
