import type { AppEnvironment } from './environment.type';

/**
 * Development environment template.
 *
 * Copy this file to \`environment.ts\` and fill in your secrets.
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
  github: {
    username: 'YOUR_GITHUB_USERNAME',
    pat: 'YOUR_GITHUB_PAT',
  },
  formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
};
