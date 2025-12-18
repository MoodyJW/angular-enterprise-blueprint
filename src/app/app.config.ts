import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideEnvironment } from './core/config';
import { provideTranslocoConfig } from './core/i18n';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideEnvironment(),
    provideRouter(routes),
    provideHttpClient(),
    provideTranslocoConfig(),
  ],
};
