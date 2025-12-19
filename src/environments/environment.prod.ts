import type { AppEnvironment } from './environment.type';

/**
 * Production environment configuration.
 *
 * This configuration is used for production builds (`ng build`).
 * It disables mock services and enables production optimizations.
 *
 * For GitHub Pages deployment:
 * - mockAuth remains true since this is a demo/portfolio application
 * - apiUrl points to mock data in assets (no backend required)
 *
 * ## Analytics Configuration
 *
 * Uses 'console' provider by default so repo cloners don't send data to your GA4.
 * To enable Google Analytics for your deployment:
 *
 * @example GitHub Actions
 * ```yaml
 * - name: Configure Analytics
 *   run: |
 *     sed -i "s/provider: 'console'/provider: 'google'/" src/environments/environment.prod.ts
 *     sed -i "s/google: undefined/google: { measurementId: '${{ secrets.GA4_MEASUREMENT_ID }}' }/" src/environments/environment.prod.ts
 * ```
 */
export const environment: AppEnvironment = {
  appName: 'Angular Enterprise Blueprint',
  production: true,
  apiUrl: '/api',
  features: {
    // Keep mockAuth true for GitHub Pages demo
    // In a real enterprise app, this would be false with real auth
    mockAuth: true,
  },
  analytics: {
    // Console provider by default - switch to 'google' via CI/CD for your deployment
    enabled: true,
    provider: 'console',
    google: undefined,
  },
  version: '0.0.1',
};
