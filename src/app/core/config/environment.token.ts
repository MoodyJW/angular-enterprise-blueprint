import { InjectionToken, Provider } from '@angular/core';

import { environment } from '../../../environments/environment';
import type { AppEnvironment } from '../../../environments/environment.type';

/**
 * Injection token for the application environment configuration.
 *
 * Using an injection token instead of direct imports provides:
 * - **Testability**: Easy to mock in unit tests
 * - **Consistency**: Single source of truth via DI
 * - **Type Safety**: Full TypeScript support with AppEnvironment interface
 *
 * @example
 * ```typescript
 * // In a service or component
 * private readonly env = inject(ENVIRONMENT);
 *
 * someMethod() {
 *   if (this.env.production) {
 *     // Production-only logic
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // In tests - provide a mock environment
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: ENVIRONMENT, useValue: mockEnvironment }
 *   ]
 * });
 * ```
 */
export const ENVIRONMENT = new InjectionToken<AppEnvironment>('AppEnvironment', {
  providedIn: 'root',
  factory: () => environment,
});

/**
 * Provider function for the environment configuration.
 *
 * Use this in app.config.ts to explicitly provide the environment.
 * This is optional since ENVIRONMENT has a factory, but makes
 * the dependency explicit in the configuration.
 *
 * @example
 * ```typescript
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideEnvironment(),
 *     // ... other providers
 *   ]
 * };
 * ```
 */
export function provideEnvironment(): Provider {
  return {
    provide: ENVIRONMENT,
    useValue: environment,
  };
}
