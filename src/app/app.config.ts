import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  EnvironmentProviders,
  Provider,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideEnvironment } from './core/config';
import { provideTranslocoConfig } from './core/i18n';
import { provideAnalytics, withAnalyticsRouterTracking } from './core/services';

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
    provideRouter(routes),
    provideHttpClient(),
    provideTranslocoConfig(),
    provideAnalyticsFn(),
    withAnalyticsRouterTrackingFn(),
  ],
};
