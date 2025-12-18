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
   * Current application version.
   * Should match package.json version.
   */
  readonly version: string;
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

  /**
   * Enable analytics tracking (GA4, etc.).
   * When false, analytics events are logged to console instead.
   */
  readonly analytics: boolean;
}
