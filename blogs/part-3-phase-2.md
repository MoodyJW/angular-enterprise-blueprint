# Phase 2: The Invisible Architecture

## Core Services, Error Handling, and Authentication That Power Everything

In the previous article, I covered Phase 1: the tooling and governance that establish the rules of engagement for the entire project. With ESLint, Prettier, Vitest, Playwright, and CI/CD pipelines in place, the foundation was solid. Phase 2 builds on that foundation by implementing what I call the "invisible architecture"—the singleton services, error handling, and authentication system that run underneath every feature without the user ever seeing them.

This is the code that separates production applications from demos. Anyone can build a login form. The difference is what happens when the network fails, when sessions expire, when errors cascade, and when the application needs to recover gracefully. Phase 2 addresses all of these concerns.

## The Philosophy: Abstractions That Enable Change

Before diving into implementation details, it's worth explaining the guiding principle behind Phase 2's architecture: **abstract everything that might change**.

In enterprise software, requirements change constantly. The analytics vendor you use today might be replaced next quarter. The authentication provider might switch from a mock implementation to OAuth to SAML. The logging service might need to pipe errors to Sentry instead of the console. If these concerns are hardcoded throughout the application, changing them requires touching dozens of files and risking regressions everywhere.

The solution is to define interfaces (contracts) and use Angular's dependency injection to swap implementations without changing consuming code. This is the Strategy Pattern, and it appears throughout Phase 2:

- `AuthStrategy` defines what any authentication provider must do, whether it's a mock for demos or a real OAuth flow
- `AnalyticsProvider` defines what any analytics service must implement, whether it's console logging or Google Analytics
- Environment configuration is injected via tokens, not imported directly

This approach adds a small amount of upfront complexity, but it pays dividends when requirements inevitably change. Swapping an analytics provider becomes a one-line change in `app.config.ts` rather than a refactoring project.

## Typed Environment Configuration

The first piece of Phase 2 is typed environment configuration. Angular provides an environment file mechanism, but out of the box, there's no type safety. You can access `environment.anything` without the compiler complaining, even if that property doesn't exist.

The solution is a TypeScript interface that defines exactly what the environment must contain:

```typescript
export interface AppEnvironment {
  readonly appName: string;
  readonly production: boolean;
  readonly apiUrl: string;
  readonly features: FeatureFlags;
  readonly analytics: AnalyticsConfig;
  readonly version: string;
}
```

Every environment file must satisfy this interface. The compiler catches typos, missing properties, and type mismatches at build time rather than runtime. The `readonly` modifiers prevent accidental mutation of environment values, which should be immutable throughout the application lifecycle.

Rather than importing the environment file directly (which creates tight coupling), the configuration is provided via an injection token:

```typescript
export const ENVIRONMENT = new InjectionToken<AppEnvironment>('ENVIRONMENT');

export function provideEnvironment(): Provider {
  return { provide: ENVIRONMENT, useValue: environment };
}
```

Services inject `ENVIRONMENT` rather than importing the file. This makes testing trivial—you can provide a mock environment in tests without any module gymnastics. It also means the environment source could change (perhaps loading from a server in the future) without touching any consuming code.

## Infrastructure Services

Phase 2 implements four infrastructure services that other parts of the application depend on. Each follows the same pattern: a clear interface, comprehensive logging, and thorough test coverage.

### LoggerService: The Foundation of Observability

The simplest service is also one of the most important. `LoggerService` wraps `console` methods with environment-aware behavior. In development, all log levels output normally. In production, `log()` and `info()` are suppressed to avoid console noise, while `warn()` and `error()` always output.

This seems trivial, but it serves two purposes. First, it provides a single point where logging behavior can change. If the application later needs to send errors to Sentry or Datadog, only `LoggerService` needs modification. Second, it prevents the common mistake of leaving debug logs in production code. With the logger checking the environment, debug information never reaches production users' consoles.

The service is intentionally simple—15 tests cover all the behavior. Sometimes the best code is the code that does exactly one thing well.

### AnalyticsService: The Strategy Pattern in Action

Analytics demonstrates the Strategy Pattern clearly. The application needs to track events and page views, but the destination might be console logging during development, Google Analytics in production, or something else entirely.

The solution starts with an interface:

```typescript
export interface AnalyticsProvider {
  readonly name: string;
  initialize(): Promise<void>;
  trackEvent(name: string, properties?: EventProperties): void;
  trackPageView(url: string, title?: string): void;
  identify(userId: string, traits?: EventProperties): void;
  reset(): void;
}
```

Two implementations exist: `ConsoleAnalyticsProvider` for development (logs everything via `LoggerService`) and `GoogleAnalyticsProvider` for production (integrates with GA4/gtag.js). The `AnalyticsService` acts as a facade, delegating to whichever provider is configured.

Switching providers is a one-line change in environment configuration:

```typescript
analytics: {
  enabled: true,
  provider: 'google',  // or 'console'
  google: { measurementId: 'G-XXXXXXXXXX' }
}
```

The `provideAnalytics()` function reads this configuration and provides the appropriate implementation. An app initializer ensures the provider is ready before the application bootstraps. A separate `withAnalyticsRouterTracking()` provider automatically tracks page views on navigation events, so developers don't need to remember to add tracking to every route.

The total test count across all analytics code: 55 tests covering the service, both providers, and the router integration.

### SeoService: Beyond Basic Meta Tags

SEO in modern applications goes far beyond setting a page title. Search engines and social platforms expect specific meta tags, Open Graph properties, Twitter Card metadata, and JSON-LD structured data. `SeoService` handles all of these concerns through a unified API.

The primary method accepts a comprehensive configuration object:

```typescript
seo.updatePageSeo({
  title: 'How to Build Enterprise Angular Apps',
  meta: {
    description: 'A comprehensive guide to building...',
    keywords: ['angular', 'enterprise', 'architecture'],
  },
  canonicalUrl: '/blog/enterprise-angular',
  openGraph: {
    type: 'article',
    image: '/assets/images/article-cover.jpg',
  },
  twitterCard: {
    card: 'summary_large_image',
    creator: '@architect',
  },
  jsonLd: {
    '@type': 'Article',
    headline: 'How to Build Enterprise Angular Apps',
    datePublished: '2025-01-15',
  },
});
```

One method call sets the page title, description, keywords, canonical URL, Open Graph tags for Facebook and LinkedIn sharing, Twitter Card metadata, and JSON-LD structured data for rich search results. The service handles the DOM manipulation, creates and removes script tags for JSON-LD, and ensures proper cleanup on navigation.

This service required 49 tests to cover all the combinations of metadata and edge cases around tag cleanup.

### ThemeService: System Preferences and Persistence

Modern applications need to support light mode, dark mode, and often a "system" setting that follows the operating system preference. `ThemeService` implements this with signals for reactive state management.

The service tracks three things: the available themes, the currently active theme, and whether the theme was chosen explicitly or derived from system preferences. It watches the `prefers-color-scheme` media query and updates automatically when system preferences change. User preferences persist to localStorage and restore on subsequent visits.

Theme changes update a `data-theme` attribute on the document element, which CSS custom properties can target. This approach is simpler and more performant than maintaining theme state in JavaScript and passing it through the component tree.

The service includes 41 tests covering theme switching, system preference detection, persistence, and edge cases around initialization order.

## Global Error Handling

Error handling is where production applications diverge most sharply from demos. Demos assume everything works. Production applications assume everything can fail and plan accordingly.

### The Error Handling Architecture

The error handling system has three layers:

1. **GlobalErrorHandler** catches any uncaught error in the Angular application
2. **HttpErrorInterceptor** catches and transforms HTTP errors into user-friendly messages
3. **ErrorNotificationService** provides a way to display errors to users (and will integrate with the toast system in Phase 3)

The `GlobalErrorHandler` extends Angular's `ErrorHandler` class. When an error occurs, it extracts useful information (error message, stack trace, component context), logs it via `LoggerService`, and could report it to an external service like Sentry. The handler distinguishes between different error types—HTTP errors, chunk loading failures, standard JavaScript errors—and handles each appropriately.

One subtle but important detail: the handler checks for `Error.cause`, a relatively new JavaScript feature that allows errors to wrap underlying causes. Many frameworks now use this pattern, so properly extracting the root cause is essential for useful error messages.

### HTTP Error Interception

The `HttpErrorInterceptor` transforms HTTP errors into consistent, user-friendly messages. A raw `HttpErrorResponse` might contain technical details that are useless to end users. The interceptor maps status codes to human-readable messages:

- 400: "The request was invalid. Please check your input."
- 401: "Your session has expired. Please log in again."
- 403: "You don't have permission to access this resource."
- 404: "The requested resource was not found."
- 429: "Too many requests. Please try again in X seconds."
- 500+: "A server error occurred. Please try again later."

For 429 (rate limiting) responses, the interceptor extracts the `Retry-After` header and includes the wait time in the error message. For 401 responses, it triggers the authentication store's session expiration flow, redirecting users to login.

The interceptor also logs errors appropriately—network failures log differently than server errors, and the logging includes relevant context like the HTTP method, URL, and status code.

Between the `GlobalErrorHandler`, `HttpErrorInterceptor`, and `ErrorNotificationService`, the error handling code has 77 tests covering every error type, edge case, and recovery scenario.

## Authentication: The Most Critical System

Authentication is Phase 2's most complex system and demonstrates several patterns working together. The design uses the Strategy Pattern to support different authentication mechanisms, NgRx SignalStore for state management, and functional route guards for access control.

### The Strategy Pattern for Auth

Authentication requirements vary wildly between applications. Some use simple username/password flows. Others use OAuth with external providers. Some need SAML for enterprise SSO. A demo application might use mock authentication with localStorage.

The solution is an interface that defines what any authentication strategy must do:

```typescript
export interface AuthStrategy {
  readonly name: string;
  login(credentials: LoginCredentials): Observable<User>;
  logout(): Observable<void>;
  checkSession(): Observable<User | null>;
}
```

The interface is intentionally minimal. It doesn't prescribe how authentication works—only that any strategy must be able to log in with credentials, log out, and check whether a valid session exists. This abstraction allows the mock implementation used during development to be swapped for a real OAuth implementation later without changing any consuming code.

### MockAuthStrategy: Simulating Real-World Conditions

The mock implementation isn't just a stub that returns success. It simulates real-world conditions that the application must handle:

- **Network latency**: Every operation includes an 800ms delay to simulate network round-trips
- **Random failures**: In non-production environments, 10% of requests randomly fail to test error handling
- **Session persistence**: Sessions store in localStorage with a JWT-like token structure
- **Multiple user types**: Accepts "demo" (standard user) and "admin" (admin privileges) as usernames

These behaviors ensure the application handles loading states, error recovery, and different user roles correctly. Without them, it's easy to build an app that works perfectly in development but falls apart when network conditions are imperfect.

The mock strategy has 25 tests covering all login scenarios, logout behavior, session restoration, error simulation, and the differences between production and development modes.

### AuthStore: Reactive State with SignalStore

Authentication state lives in an NgRx SignalStore. The store manages the current user, authentication status, loading states, and error messages. It exposes computed signals for derived state:

```typescript
withComputed((store) => ({
  displayName: computed(() => store.user()?.username ?? 'Guest'),
  isAdmin: computed(() => store.user()?.roles.includes('admin') ?? false),
  hasRole: computed(() => (role: UserRole) => store.user()?.roles.includes(role) ?? false),
  avatarUrl: computed(() => store.user()?.avatarUrl ?? '/assets/images/default-avatar.svg'),
}));
```

These computed signals derive from the user state, so components can use `authStore.displayName()` or `authStore.isAdmin()` without manually checking for null users or extracting role information.

The store uses `rxMethod` from `@ngrx/signals` for operations that involve observables. The `login`, `logout`, and `checkSession` methods are reactive—they accept input (credentials or nothing), pipe through the authentication strategy, update state on success or failure, and handle side effects like navigation and logging.

A critical detail: the store integrates with the HTTP error interceptor. When a 401 response occurs, the interceptor calls `authStore.handleSessionExpired()`, which clears the user state and redirects to login. This ensures session expiration is handled consistently regardless of which HTTP request triggered it.

The store has 40 tests covering state management, login/logout flows, session restoration, error handling, and the session expiration integration.

### Route Guards: Protecting Resources

Three functional guards control route access:

- **authGuard**: Requires authentication. Redirects to `/auth/login` if not authenticated.
- **adminGuard**: Requires admin role. Redirects to `/forbidden` if not admin.
- **guestGuard**: Requires no authentication. Redirects to `/` if already authenticated (prevents logged-in users from seeing the login page).

The guards are simple functions that inject the `AuthStore` and check the appropriate signal:

```typescript
export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
```

Functional guards are a newer Angular pattern that replaces class-based guards. They're simpler, more testable, and align with Angular's move toward functional APIs.

The guards have 9 tests covering all access control scenarios.

### Provider Registration

All authentication components register through a single `provideAuth()` function:

```typescript
export function provideAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: AUTH_STRATEGY, useClass: MockAuthStrategy },
    provideAppInitializer(() => {
      const authStore = inject(AuthStore);
      authStore.checkSession(undefined);
    }),
  ]);
}
```

This function provides the mock strategy and registers an app initializer that checks for an existing session on startup. When a user refreshes the page, the initializer restores their session from localStorage so they don't need to log in again.

Swapping to a real authentication strategy later requires only changing which class is provided for `AUTH_STRATEGY`. Everything else—the store, guards, error handling integration—continues working unchanged.

## The Test Coverage Story

Phase 2 concludes with 318 unit tests across all services and components. Here's the breakdown:

| Component                | Tests   |
| ------------------------ | ------- |
| Environment Config       | 4       |
| LoggerService            | 15      |
| AnalyticsService         | 17      |
| Analytics Providers      | 38      |
| SeoService               | 49      |
| ThemeService             | 41      |
| GlobalErrorHandler       | 27      |
| HttpErrorInterceptor     | 44      |
| ErrorNotificationService | 6       |
| MockAuthStrategy         | 25      |
| AuthStore                | 40      |
| Auth Guards              | 9       |
| App Component            | 3       |
| **Total**                | **318** |

Every service has tests covering its public API, edge cases, error conditions, and integration points. The CI pipeline enforces 85% coverage thresholds, and the actual coverage exceeds that in most areas.

This test coverage isn't just a vanity metric. It provides confidence that the invisible architecture works correctly, enabling faster development in later phases. When a feature relies on `AuthStore` or `SeoService`, the feature developer doesn't need to worry about whether those services work—the tests already prove they do.

## Lessons Learned

Building Phase 2 reinforced several lessons:

**Abstractions require discipline.** It's tempting to skip the interface and code directly against an implementation when you "only have one implementation." But the interface forces you to think about the contract, makes testing easier, and enables future flexibility. The small upfront cost is worth it.

**Error handling is a feature.** Users don't see error handling when it works—they just see an application that recovers gracefully. But they definitely notice when it fails. Investing in comprehensive error handling early prevents embarrassing production incidents later.

**Mock implementations should be realistic.** A mock that always succeeds instantly doesn't prepare the application for real-world conditions. Adding delays, random failures, and edge cases to mocks surfaces issues during development when they're cheap to fix.

**SignalStore simplifies reactive state.** Previous authentication implementations I've built used services with BehaviorSubjects, or full NgRx with actions and reducers. SignalStore hits a sweet spot—it's simpler than traditional NgRx but more structured than ad-hoc service state. The `rxMethod` pattern for async operations is particularly elegant.

**Comprehensive testing enables fearless refactoring.** Several times during Phase 2, I refactored implementation details—changing how errors were logged, restructuring the auth flow, adjusting how providers initialized. The tests caught regressions immediately, making refactoring safe rather than scary.

## What's Next

With Phase 2 complete, the application has a solid invisible architecture. Environment configuration is typed and injectable. Logging, analytics, SEO, and theming are abstracted behind clean interfaces. Errors are caught, transformed, and handled consistently. Authentication works with session persistence and route protection.

The next article will cover Phase 3: the Design System. That phase builds the visual component library—buttons, forms, cards, modals, and all the UI primitives that features will compose. With the core architecture in place, the design system can focus purely on presentation, knowing that services, state, and error handling are already solved.

You can explore the complete Phase 2 implementation on GitHub: [MoodyJW/angular-enterprise-blueprint](https://github.com/MoodyJW/angular-enterprise-blueprint)

---

_Next in series: Phase 3 Deep Dive – The Design System and Component Library_
