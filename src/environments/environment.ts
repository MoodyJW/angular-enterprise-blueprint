import type { AppEnvironment } from './environment.type';

/**
 * Development environment configuration.
 *
 * This configuration is used during local development (`ng serve`).
 * It enables mock services and verbose logging for easier debugging.
 *
 * Analytics uses the 'console' provider in development, which logs
 * all analytics events to the console for debugging purposes.
 */
export const environment: AppEnvironment = {
  appName: 'Angular Enterprise Blueprint',
  production: false,
  apiUrl: '/api',
  features: {
    mockAuth: true,
  },
  analytics: {
    enabled: true,
    provider: 'console',
  },
  version: '0.0.1',
};
