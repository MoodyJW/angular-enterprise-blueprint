import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ENVIRONMENT } from '../../../config';
import { LoggerService } from '../../logger';
import { AnalyticsLoaderService } from '../analytics-loader.service';
import type { AnalyticsProvider, EventProperties } from '../analytics-provider.interface';
import type { GtagEventParams, GtagFunction } from '../gtag.types';

@Injectable()
export class GoogleAnalyticsProvider implements AnalyticsProvider {
  readonly name = 'google';

  private readonly env = inject(ENVIRONMENT);
  private readonly document = inject(DOCUMENT);
  private readonly logger = inject(LoggerService);
  private readonly loader = inject(AnalyticsLoaderService);

  private gtag: GtagFunction | null = null;

  async initialize(): Promise<void> {
    const measurementId = this.env.analytics.google?.measurementId;

    if (measurementId === undefined || measurementId === '') {
      this.logger.warn('[Analytics:Google] No measurement ID configured, skipping initialization');
      return;
    }

    if (!this.isValidMeasurementId(measurementId)) {
      this.logger.error('[Analytics:Google] Invalid measurement ID format', { measurementId });
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
      this.gtag('set', {
        user_id: userId,
        ...traits,
      } as GtagEventParams);
      this.logger.info(`[Analytics:Google] Identify: ${userId}`);
    }
  }

  reset(): void {
    if (this.gtag) {
      this.gtag('set', { user_id: null } as GtagEventParams);
      this.logger.info('[Analytics:Google] User identity reset');
    }
  }

  private isValidMeasurementId(id: string): boolean {
    // GA4 (G-XXXXXXXXXX) or UA (UA-XXXX-Y)
    return /^G-[A-Z0-9]+$/.test(id) || /^UA-\d+-\d+$/.test(id);
  }

  private async loadGtagScript(measurementId: string): Promise<void> {
    const win = this.document.defaultView;
    if (!win) {
      throw new Error('Window not available');
    }

    win.dataLayer = win.dataLayer ?? [];

    const gtag: GtagFunction = ((...args: unknown[]) => {
      win.dataLayer?.push(args);
    }) as GtagFunction;

    win.gtag = gtag;
    this.gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: false,
    });

    const scriptUrl = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

    // Convert Observable to Promise for async/await compatibility
    await firstValueFrom(this.loader.loadScript(scriptUrl));
  }
}
