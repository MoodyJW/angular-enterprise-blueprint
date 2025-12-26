import { inject, makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';

import { ENVIRONMENT } from '../../config';
import { ANALYTICS_PROVIDER, type AnalyticsProvider } from './analytics-provider.interface';
import { ConsoleAnalyticsProvider } from './providers/console-analytics.provider';
import { GoogleAnalyticsProvider } from './providers/google-analytics.provider';

/**
 * Factory that creates the appropriate analytics provider based on environment config.
 */
function analyticsProviderFactory(): AnalyticsProvider {
  const env = inject(ENVIRONMENT);

  switch (env.analytics.provider) {
    case 'google':
      return inject(GoogleAnalyticsProvider);
    case 'console':
    default:
      return inject(ConsoleAnalyticsProvider);
  }
}

/**
 * Provides analytics infrastructure for the application.
 *
 * This function sets up the analytics provider based on environment configuration
 * and initializes it during application bootstrap.
 *
 * ## Provider Selection
 *
 * The provider is selected based on `environment.analytics.provider`:
 * - `'console'` - Logs events to console (default, safe for development)
 * - `'google'` - Sends events to Google Analytics 4
 *
 * ## Router Integration
 *
 * Page views are automatically tracked on route changes when
 * `withRouterTracking()` is added.
 *
 * @example
 * ```typescript
 * // Basic setup (provider only)
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideAnalytics(),
 *   ]
 * };
 *
 * // With automatic router tracking
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideAnalytics(),
 *     withAnalyticsRouterTracking(),
 *   ]
 * };
 * ```
 *
 * @returns Environment providers for analytics
 */
export function provideAnalytics(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Register provider implementations
    ConsoleAnalyticsProvider,
    GoogleAnalyticsProvider,

    // Factory to select the right provider
    {
      provide: ANALYTICS_PROVIDER,
      useFactory: analyticsProviderFactory,
    },
  ]);
}
