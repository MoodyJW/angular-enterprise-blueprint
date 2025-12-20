import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  EnvironmentProviders,
  ErrorHandler,
  Provider,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAuth } from './core/auth';
import { provideEnvironment } from './core/config';
import { GlobalErrorHandler } from './core/error-handling';
import { provideTranslocoConfig } from './core/i18n';
import { httpErrorInterceptor } from './core/interceptors';
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
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideTranslocoConfig(),
    provideAnalyticsFn(),
    withAnalyticsRouterTrackingFn(),
    provideAuth(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
