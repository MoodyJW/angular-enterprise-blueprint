// Provider interface and token
export {
  ANALYTICS_PROVIDER,
  type AnalyticsProvider,
  type AnalyticsProviderType,
  type EventProperties,
} from './analytics-provider.interface';

// Provider implementations
export { ConsoleAnalyticsProvider, GoogleAnalyticsProvider } from './providers';

// Main service
export { AnalyticsService } from './analytics.service';

// Provider functions
export { withAnalyticsRouterTracking } from './analytics-router.provider';
export { provideAnalytics } from './analytics.provider';

// GA4 types (for advanced usage)
export type { GtagConfigParams, GtagEventParams, GtagFunction } from './gtag.types';
