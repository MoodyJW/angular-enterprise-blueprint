import type { AppEnvironment } from './environment.type';

/**
 * Production environment configuration.
 *
 * This configuration is used for production builds (`ng build`).
 * It disables mock services and enables production optimizations.
 *
 * For GitHub Pages deployment:
 * - mockAuth remains true since this is a demo/portfolio application
 * - analytics can be enabled when GA4 is configured
 * - apiUrl points to mock data in assets (no backend required)
 */
export const environment: AppEnvironment = {
  appName: 'Angular Enterprise Blueprint',
  production: true,
  apiUrl: '/api',
  features: {
    // Keep mockAuth true for GitHub Pages demo
    // In a real enterprise app, this would be false with real auth
    mockAuth: true,
    analytics: true,
  },
  version: '0.0.1',
};
