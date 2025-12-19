import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '../../../config';
import { LoggerService } from '../../logger';
import type { AnalyticsProvider, EventProperties } from '../analytics-provider.interface';
import type { GtagEventParams, GtagFunction } from '../gtag.types';

/**
 * Google Analytics 4 (GA4) provider implementation.
 *
 * This provider integrates with Google Analytics 4 using the gtag.js library.
 * It handles:
 *
 * - Loading the gtag.js script
 * - Configuring the measurement ID
 * - Sending events and page views to GA4
 * - User identification (via user_id parameter)
 *
 * @example
 * ```typescript
 * // In environment.prod.ts
 * analytics: {
 *   provider: 'google',
 *   google: {
 *     measurementId: 'G-XXXXXXXXXX',
 *   },
 * }
 * ```
 */
@Injectable()
export class GoogleAnalyticsProvider implements AnalyticsProvider {
  readonly name = 'google';

  private readonly env = inject(ENVIRONMENT);
  private readonly document = inject(DOCUMENT);
  private readonly logger = inject(LoggerService);

  private gtag: GtagFunction | null = null;

  async initialize(): Promise<void> {
    const measurementId = this.env.analytics.google?.measurementId;

    if (measurementId === undefined || measurementId === '') {
      this.logger.warn('[Analytics:Google] No measurement ID configured, skipping initialization');
      return;
    }

    try {
      await this.loadGtagScript(measurementId);
      this.logger.info(`[Analytics:Google] Initialized with ID: ${measurementId}`);
    } catch (error) {
      this.logger.error('[Analytics:Google] Failed to initialize:', error);
    }
  }

  trackEvent(name: string, properties?: EventProperties): void {
    if (this.gtag) {
      this.gtag('event', name, properties as GtagEventParams);
      this.logger.info(`[Analytics:Google] Event: ${name}`, properties);
    }
  }

  trackPageView(url: string, title?: string): void {
    if (this.gtag) {
      this.gtag('event', 'page_view', {
        page_path: url,
        page_title: title,
      });
      this.logger.info(`[Analytics:Google] Page View: ${url}`);
    }
  }

  identify(userId: string, traits?: EventProperties): void {
    if (this.gtag) {
      // GA4 uses 'set' command for user properties
      this.gtag('set', {
        user_id: userId,
        ...traits,
      } as GtagEventParams);
      this.logger.info(`[Analytics:Google] Identify: ${userId}`);
    }
  }

  reset(): void {
    if (this.gtag) {
      // Clear user_id
      this.gtag('set', { user_id: null } as GtagEventParams);
      this.logger.info('[Analytics:Google] User identity reset');
    }
  }

  /**
   * Loads the gtag.js script and configures GA4.
   */
  private loadGtagScript(measurementId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Initialize dataLayer
      const win = this.document.defaultView;
      if (!win) {
        reject(new Error('Window not available'));
        return;
      }

      win.dataLayer = win.dataLayer ?? [];

      // Define gtag function
      const gtag: GtagFunction = ((...args: unknown[]) => {
        win.dataLayer?.push(args);
      }) as GtagFunction;

      win.gtag = gtag;
      this.gtag = gtag;

      // Record start time
      gtag('js', new Date());

      // Configure with measurement ID (disable initial page view)
      gtag('config', measurementId, {
        send_page_view: false,
      });

      // Load the gtag.js script
      const script = this.document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

      script.onload = (): void => {
        resolve();
      };
      script.onerror = (): void => {
        reject(new Error(`Failed to load gtag.js for ${measurementId}`));
      };

      this.document.head.appendChild(script);
    });
  }
}
