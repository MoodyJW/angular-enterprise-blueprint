import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  EnvironmentProviders,
  ErrorHandler,
  Provider,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  NoPreloading,
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
import { provideProfileStore } from './features/profile/state/profile.store';

// Cast the imported analytics helpers to known callable signatures so
// TypeScript/ESLint know they are safe to call and return Provider/EnvironmentProviders.
const provideAnalyticsFn = provideAnalytics as unknown as () => Provider | EnvironmentProviders;
const withAnalyticsRouterTrackingFn = withAnalyticsRouterTracking as unknown as () =>
  | Provider
  | EnvironmentProviders;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideEnvironment(),
    provideRouter(
      routes,
      // Disable preloading to reduce initial bundle size
      withPreloading(NoPreloading),
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
    // Markdown provided in feature routes only
    provideAnalyticsFn(),
    withAnalyticsRouterTrackingFn(),
    provideAuth(),
    provideProfileStore(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
