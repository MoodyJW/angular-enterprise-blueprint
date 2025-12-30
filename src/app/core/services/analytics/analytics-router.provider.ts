import { DOCUMENT } from '@angular/common';
import {
  DestroyRef,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
  type EnvironmentProviders,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { ENVIRONMENT } from '@core/config';
import { AnalyticsService } from './analytics.service';

/**
 * Initializes router tracking for analytics.
 *
 * Subscribes to router events and tracks page views on NavigationEnd.
 */
function routerTrackingInitializer(): void {
  const env = inject(ENVIRONMENT);

  // Skip if analytics is disabled
  if (!env.analytics.enabled) {
    return;
  }

  const router = inject(Router);
  const analytics = inject(AnalyticsService);
  const document = inject(DOCUMENT);
  const destroyRef = inject(DestroyRef);

  router.events
    .pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed(destroyRef),
    )
    .subscribe((event) => {
      // Get the page title from the document
      const title = document.title;
      analytics.trackPageView(event.urlAfterRedirects, title);
    });
}

/**
 * Enables automatic page view tracking on route changes.
 *
 * When added to your app configuration, this provider will:
 * - Listen for Angular Router `NavigationEnd` events
 * - Automatically call `analytics.trackPageView()` with the new URL
 * - Include the document title in the page view
 *
 * ## Usage
 *
 * Add this provider alongside `provideAnalytics()`:
 *
 * @example
 * ```typescript
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideRouter(routes),
 *     provideAnalytics(),
 *     withAnalyticsRouterTracking(), // Enable auto page view tracking
 *   ]
 * };
 * ```
 *
 * ## Notes
 *
 * - Router tracking respects `environment.analytics.enabled`
 * - Uses `urlAfterRedirects` to capture the final URL after any redirects
 * - Automatically cleans up on application destroy
 *
 * @returns Environment providers for router tracking
 */
export function withAnalyticsRouterTracking(): EnvironmentProviders {
  return makeEnvironmentProviders([provideAppInitializer(routerTrackingInitializer)]);
}
