/**
 * Strictly typed environment configuration interface.
 *
 * All environment files must implement this interface to ensure
 * type safety and prevent magic strings throughout the application.
 *
 * @example
 * ```typescript
 * // Inject the environment in a service or component
 * private readonly env = inject(ENVIRONMENT);
 *
 * // Access typed properties
 * const apiUrl = this.env.apiUrl;
 * const isMockAuth = this.env.features.mockAuth;
 * ```
 */
export interface AppEnvironment {
  /**
   * Display name of the application.
   * Used in page titles, headers, and metadata.
   */
  readonly appName: string;

  /**
   * Indicates if the application is running in production mode.
   * Controls logging verbosity, error reporting, and optimizations.
   */
  readonly production: boolean;

  /**
   * Base URL for API requests.
   * - Development: '/api' or 'http://localhost:3000/api'
   * - Production: Full URL to production API
   */
  readonly apiUrl: string;

  /**
   * Feature flags for enabling/disabling functionality.
   * Allows gradual rollout and A/B testing of features.
   */
  readonly features: FeatureFlags;

  /**
   * Analytics configuration.
   * Disabled by default for repo cloners; enable via CI/CD secrets.
   */
  readonly analytics: AnalyticsConfig;

  /**
   * Current application version.
   * Should match package.json version.
   */
  readonly version: string;

  /**
   * GitHub API configuration for Profile feature.
   * Used to display real GitHub statistics on the About page.
   */
  readonly github?: GitHubConfig;
}

/**
 * Feature flags configuration.
 *
 * Use these flags to toggle features without code changes.
 * Particularly useful for:
 * - Enabling mock implementations during development
 * - Gradual feature rollouts
 * - A/B testing
 */
export interface FeatureFlags {
  /**
   * Enable mock authentication strategy.
   * When true, uses MockAuthStrategy instead of real auth provider.
   */
  readonly mockAuth: boolean;
}

/**
 * Supported analytics provider types.
 */
export type AnalyticsProviderType = 'console' | 'google';

/**
 * Analytics configuration using the Strategy Pattern.
 *
 * Supports multiple analytics providers that can be swapped via configuration.
 * This enables:
 * - Easy vendor switching (GA4 → Mixpanel → Amplitude)
 * - Development mode without real tracking
 * - Testing with mock providers
 *
 * @example
 * ```typescript
 * // Development: Console logging only
 * analytics: {
 *   enabled: true,
 *   provider: 'console',
 * }
 *
 * // Production: Google Analytics 4
 * analytics: {
 *   enabled: true,
 *   provider: 'google',
 *   google: {
 *     measurementId: 'G-XXXXXXXXXX',
 *   },
 * }
 * ```
 */
export interface AnalyticsConfig {
  /**
   * Enable/disable analytics tracking entirely.
   * When false, no analytics code runs.
   */
  readonly enabled: boolean;

  /**
   * Which analytics provider to use.
   * - 'console': Logs events to console (dev/testing)
   * - 'google': Sends events to Google Analytics 4
   */
  readonly provider: AnalyticsProviderType;

  /**
   * Google Analytics 4 configuration.
   * Required when provider is 'google'.
   */
  readonly google?: GoogleAnalyticsConfig;
}

/**
 * Google Analytics 4 specific configuration.
 */
export interface GoogleAnalyticsConfig {
  /**
   * GA4 Measurement ID.
   * Format: 'G-XXXXXXXXXX'
   */
  readonly measurementId: string;
}

/**
 * GitHub API configuration for Profile feature.
 *
 * Used to fetch real GitHub statistics for the "About Me" page.
 * The PAT is optional - without it, requests use unauthenticated
 * rate limits (60 req/hour vs 5000 req/hour with PAT).
 */
export interface GitHubConfig {
  /**
   * GitHub username to fetch statistics for.
   */
  readonly username: string;

  /**
   * Personal Access Token for higher rate limits.
   * Optional - set via CI/CD environment variables in production.
   * Required scopes if used: read:user
   */
  readonly pat?: string;
}
