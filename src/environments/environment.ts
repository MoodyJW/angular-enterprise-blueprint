import type { AppEnvironment } from './environment.type';

/**
 * Development environment configuration.
 *
 * This configuration is used during local development (`ng serve`).
 * It enables mock services and verbose logging for easier debugging.
 */
export const environment: AppEnvironment = {
  appName: 'Angular Enterprise Blueprint',
  production: false,
  apiUrl: '/api',
  features: {
    mockAuth: true,
    analytics: false,
  },
  version: '0.0.1',
};
