import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  EnvironmentProviders,
  ErrorHandler,
  Provider,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideAuth } from './core/auth';
import { provideEnvironment } from './core/config';
import { GlobalErrorHandler } from './core/error-handling';
import { provideTranslocoConfig } from './core/i18n';
import { httpErrorInterceptor } from './core/interceptors';
import { csrfInterceptor } from './core/interceptors/csrf.interceptor';
import { provideAnalytics, withAnalyticsRouterTracking } from './core/services';
import { SmartPreloadStrategy } from './core/strategies';
import { provideProfileStore } from './features/profile/state/profile.store';

// Cast the imported analytics helpers to known callable signatures so
// TypeScript/ESLint know they are safe to call and return Provider/EnvironmentProviders.
const provideAnalyticsFn = provideAnalytics as unknown as () => Provider | EnvironmentProviders;
const withAnalyticsRouterTrackingFn = withAnalyticsRouterTracking as unknown as () =>
  | Provider
  | EnvironmentProviders;

import { provideMarkdown } from 'ngx-markdown';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideEnvironment(),
    provideRouter(
      routes,
      // Use idle-based preloading to load chunks during browser idle time
      // This avoids interference with Lighthouse measurements while still preloading high-traffic routes
      withPreloading(SmartPreloadStrategy),
      // Restore scroll position on navigation
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      // Enable Angular 17+ view transitions for smooth page changes
      withViewTransitions(),
      // Bind route params to component inputs
      withComponentInputBinding(),
    ),
    provideHttpClient(withInterceptors([csrfInterceptor, httpErrorInterceptor])),
    provideTranslocoConfig(),
    provideMarkdown(),
    provideAnalyticsFn(),
    withAnalyticsRouterTrackingFn(),
    provideAuth(),
    provideProfileStore(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
