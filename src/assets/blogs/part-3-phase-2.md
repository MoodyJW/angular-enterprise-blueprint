# Phase 2: The Invisible Architecture

## Core Services, Error Handling, and Authentication That Power Everything

In the [previous article](https://dev.to/moodyjw/building-a-portfolio-that-actually-demonstrates-enterprise-skills-part-2-47e1), I covered Phase 1, where I established the tooling and governance that set the rules of engagement for the entire project. With [ESLint](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/eslint.config.mjs), Prettier, [Vitest](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/vitest.config.ts), [Playwright](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/playwright.config.ts), and [CI/CD pipelines](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/.github/workflows/ci.yml) in place, the foundation was solid. Phase 2 builds on that foundation by implementing what I call the "invisible architecture," the singleton services, error handling, and authentication system that run underneath every feature without the user ever seeing them.

This is the code that separates production applications from demos. Anyone can build a login form. The difference is what happens when the network fails, when sessions expire, when errors cascade, and when the application needs to recover gracefully. Phase 2 addresses all of these concerns.

The [Phase 2 specification](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/docs/specs/PHASE_2_CORE.md) breaks this work into four major areas: [typed environment configuration](https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/core/config), [infrastructure services](https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/core/services) (logging, analytics, SEO, theming), [global error handling](https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/core/services), and [authentication](https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/core/auth). Each area follows the same principle: abstract what might change behind clean interfaces.

## The Philosophy: Abstractions That Enable Change

Before diving into implementation details, it's worth explaining the guiding principle behind Phase 2's architecture: **abstract everything that might change**.

In enterprise software, requirements change constantly. The analytics vendor you use today might be replaced next quarter. The authentication provider might switch from a mock implementation to OAuth to SAML. The logging service might need to pipe errors to Sentry instead of the console. If these concerns are hardcoded throughout the application, changing them requires touching dozens of files and risking regressions everywhere.

The solution is to define interfaces (contracts) and use [Angular's dependency injection](https://angular.dev/guide/di) to swap implementations without changing consuming code. This is the [Strategy Pattern](https://vugar-005.medium.com/angular-design-patterns-strategy-pattern-ace359ae77b3), and it appears throughout Phase 2:

- [`AuthStrategy`](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/app/core/auth/auth-strategy.interface.ts) defines what any authentication provider must do, whether it's a mock for demos or a real OAuth flow
- [`AnalyticsProvider`](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/app/core/services/analytics/analytics.provider.ts) defines what any analytics service must implement, whether it's console logging or Google Analytics
- [Environment configuration is injected via tokens](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/app/core/config/environment.token.ts), not imported directly

```
┌─────────────────────────────────────────────────────────┐
│                    Application Code                     │
│         (Components, Services, Features)                │
└────────────────────┬────────────────────────────────────┘
                     │ depends on
                     ▼
         ┌───────────────────────┐
         │  Strategy Interface   │  (Contract: what must be done)
         │  - AnalyticsProvider  │
         │  - AuthStrategy       │
         └───────────┬───────────┘
                     │ implemented by (swappable)
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│ Implementation A │    │ Implementation B │
│ (Mock/Console)   │    │ (Real/Google)    │
└──────────────────┘    └──────────────────┘
   Selected via             Selected via
   app.config.ts           app.config.ts
```

This approach adds a small amount of upfront complexity, but it pays dividends when requirements inevitably change. Swapping an analytics provider becomes a one-line change in [`app.config.ts`](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/app/app.config.ts) rather than a refactoring project.

## Typed Environment Configuration

The first piece of Phase 2 is typed environment configuration. Angular provides an environment file mechanism, but out of the box, there's no type safety. You can access `environment.anything` without the compiler complaining, even if that property doesn't exist.

The solution is a [TypeScript interface](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/environments/environment.type.ts) that defines exactly what the environment must contain:

```typescript
export interface AppEnvironment {
  url;
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
export const ENVIRONMENT = new InjectionToken<AppEnvironment>('ENVIRONMENT');Figure 3: Errors are caught at the network layer, transformed into user-friendly messages, and logged with context for debugging.

export function provideEnvironment(): Provider {
  return { provide: ENVIRONMENT, useValue: environment };
}
```

Services inject `ENVIRONMENT` rather than importing the file directly. This makes testing trivial since you can provide a mock environment in tests without any module gymnastics. It also means the environment source could change in the future without touching any consuming code.

## Infrastructure Services

Phase 2 implements four infrastructure services that other parts of the application depend on. Each follows the same pattern: a clear interface, comprehensive logging, and thorough test coverage.

### [LoggerService: The Foundation of Observability](https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/core/services/logger)

The simplest service is also one of the most important. `LoggerService` wraps `console` methods with environment-aware behavior. In development, all log levels output normally. In production, `log()` and `info()` are suppressed to avoid console noise, while `warn()` and `error()` always output.

This seems trivial, but it serves two purposes. First, it provides a single point where logging behavior can change. If the application later needs to send errors to Sentry or Datadog, only `LoggerService` needs modification. Second, it prevents the common mistake of leaving debug logs in production code. With the logger checking the environment, debug information never reaches production users' consoles.

The service is intentionally simple. Just 15 tests cover all the behavior. Sometimes the best code is the code that does exactly one thing well.

### [AnalyticsService: The Strategy Pattern in Action](https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/core/services/analytics)

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

### [SeoService: Beyond Basic Meta Tags](https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/core/services/seo)

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

### [ThemeService: System Preferences and Persistence](https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/core/services/theme)

![A split-screen screenshot of your app. Left side: Light Mode. Right side: Dark Mode](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k3osdpj2z817g8lbitue.webp)
_Figure 2: The theming engine supports multiple color schemes and high-contrast modes, persisted via LocalStorage._

Modern applications need to support light mode, dark mode, and often a "system" setting that follows the operating system preference. `ThemeService` implements this with signals for reactive state management.

The service tracks three things: the available themes, the currently active theme, and whether the theme was chosen explicitly or derived from system preferences. It watches the `prefers-color-scheme` media query and updates automatically when system preferences change. User preferences persist to localStorage and restore on subsequent visits.

Theme changes update a `data-theme` attribute on the document element, which CSS custom properties can target. This approach is simpler and more performant than maintaining theme state in JavaScript and passing it through the component tree.

I also included a script in the [`index.html`](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/index.html).

```html
<script>
  (function () {
    var storageKey = 'theme-id';
    var defaultLight = 'light-default';
    var defaultDark = 'dark-default';

    // Check URL param first (for testing)
    var urlParams = new URLSearchParams(window.location.search);
    var themeParam = urlParams.get('theme');
    if (themeParam) {
      document.documentElement.setAttribute('data-theme', themeParam);
      return;
    }

    // Check localStorage
    var stored = localStorage.getItem(storageKey);
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored);
      return;
    }

    // Fall back to system preference
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? defaultDark : defaultLight);
  })();
</script>
```

Note that this script lives in `index.html`, **outside** of the Angular bootstrap process. This ensures it runs instantly when the DOM parses, preventing the dreaded 'flash of white light' that occurs if you wait for Angular to load before applying a dark theme preference.

The service includes 41 tests covering theme switching, system preference detection, persistence, and edge cases around initialization order.

## [Global Error Handling](https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/core/error-handling)

![Screenshot of Chrome console showing error logging](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mqcrz3yfq9a6gen47l3a.png)
_Figure 3: Errors are caught at the network layer, transformed into user-friendly messages, and logged with context for debugging._

Error handling is where production applications diverge most sharply from demos. Demos assume everything works. Production applications assume everything can fail and plan accordingly.

### The Error Handling Architecture

The error handling system has three layers:

1. **[GlobalErrorHandler](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/app/core/error-handling/global-error-handler.ts)** catches any uncaught error in the Angular application
2. **[HttpErrorInterceptor](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/app/core/interceptors/http-error.interceptor.ts)** catches and transforms HTTP errors into user-friendly messages
3. **[ErrorNotificationService](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/app/core/error-handling/error-notification.service.spec.ts)** provides a way to display errors to users (and will integrate with the toast system in Phase 3)

The `GlobalErrorHandler` extends Angular's `ErrorHandler` class. When an error occurs, it extracts useful information like the error message, stack trace, and component context, then logs it via `LoggerService`. The handler could also report errors to an external service like Sentry. It distinguishes between different error types and handles each appropriately, whether they're HTTP errors, chunk loading failures, or standard JavaScript errors.

One subtle but important detail: the handler checks for `Error.cause`, a relatively new JavaScript feature that allows errors to wrap underlying causes. Many frameworks now use this pattern, so properly extracting the root cause is essential for useful error messages.

### [HTTP Error Interception](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/app/core/interceptors/http-error.interceptor.ts)

The `HttpErrorInterceptor` transforms HTTP errors into consistent, user-friendly messages. A raw `HttpErrorResponse` might contain technical details that are useless to end users. The interceptor maps status codes to human-readable messages:

- 400: "The request was invalid. Please check your input."
- 401: "Your session has expired. Please log in again."
- 403: "You don't have permission to access this resource."
- 404: "The requested resource was not found."
- 429: "Too many requests. Please try again in X seconds."
- 500+: "A server error occurred. Please try again later."

For 429 (rate limiting) responses, the interceptor extracts the `Retry-After` header and includes the wait time in the error message. For 401 responses, it triggers the authentication store's session expiration flow, redirecting users to login.

The interceptor also logs errors appropriately. Network failures log differently than server errors, and each log entry includes relevant context like the HTTP method, URL, and status code.

Between the `GlobalErrorHandler`, `HttpErrorInterceptor`, and `ErrorNotificationService`, the error handling code has 77 tests covering every error type, edge case, and recovery scenario.

## [Authentication: The Most Critical System](https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/core/auth)

Authentication is Phase 2's most complex system and demonstrates several patterns working together. The design uses the Strategy Pattern to support different authentication mechanisms, NgRx SignalStore for state management, and functional route guards for access control.

### [The Strategy Pattern for Auth](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/app/core/auth/auth-strategy.interface.ts)

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

The interface is intentionally minimal. It doesn't prescribe how authentication works, only that any strategy must be able to login with credentials, log out, and check whether a valid session exists. This abstraction allows the mock implementation used during development to be swapped for a real OAuth implementation later without changing any consuming code.

### [MockAuthStrategy: Simulating Real-World Conditions](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/app/core/auth/strategies/mock-auth.strategy.ts)

The mock implementation isn't just a stub that returns success. It simulates real-world conditions that the application must handle:

- **Network latency**: Every operation includes an 800ms delay to simulate network round-trips
- **Random failures**: In non-production environments, 10% of requests randomly fail to test error handling
- **Session persistence**: Sessions store in localStorage with a JWT-like token structure
- **Multiple user types**: Accepts "demo" (standard user) and "admin" (admin privileges) as usernames

These behaviors ensure the application handles loading states, error recovery, and different user roles correctly. Without them, it's easy to build an app that works perfectly in development but falls apart when network conditions are imperfect.

The mock strategy has 25 tests covering all login scenarios, logout behavior, session restoration, error simulation, and the differences between production and development modes.

### [AuthStore: Reactive State with SignalStore](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/app/core/auth/auth.store.ts)

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

The store uses `rxMethod` from `@ngrx/signals` for operations that involve observables. The `login`, `logout`, and `checkSession` methods are reactive. They accept input (credentials or nothing), pipe through the authentication strategy, update state on success or failure, and handle side effects like navigation and logging.

A critical detail: the store integrates with the HTTP error interceptor. When a 401 response occurs, the interceptor calls `authStore.handleSessionExpired()`, which clears the user state and redirects to login. This ensures session expiration is handled consistently regardless of which HTTP request triggered it.

The store has 40 tests covering state management, login/logout flows, session restoration, error handling, and the session expiration integration.

### [Route Guards: Protecting Resources](https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/core/auth/guards)

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

### [Provider Registration](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/app/core/auth/auth.provider.ts)

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

This function provides the mock strategy and registers an app initializer that checks for an existing session on startup. The app initializer runs before Angular bootstraps the application, ensuring authentication state is ready before any components render. When a user refreshes the page, the initializer restores their session from localStorage, creating a seamless experience. Users stay logged in across page refreshes without seeing loading states or being kicked to the login page. This detail matters for perceived performance and user experience.

Swapping to a real authentication strategy later requires only changing which class is provided for `AUTH_STRATEGY`. Everything else continues working unchanged: the store, guards, and error handling integration all remain the same.

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

This test coverage isn't just a vanity metric. It provides confidence that the invisible architecture works correctly, enabling faster development in later phases. When a feature relies on `AuthStore` or `SeoService`, the feature developer doesn't need to worry about whether those services work. The tests already prove they do.

## Lessons Learned

Building Phase 2 reinforced several lessons:

**Abstractions require discipline.** It's tempting to skip the interface and code directly against an implementation when you "only have one implementation." But the interface forces you to think about the contract, makes testing easier, and enables future flexibility. The small upfront cost is worth it.

**Error handling is a feature.** Users don't see error handling when it works. They just see an application that recovers gracefully. But they definitely notice when it fails. Investing in comprehensive error handling early prevents embarrassing production incidents later.

**Mock implementations should be realistic.** A mock that always succeeds instantly doesn't prepare the application for real-world conditions. Adding delays, random failures, and edge cases to mocks surfaces issues during development when they're cheap to fix.

**SignalStore simplifies reactive state.** Previous authentication implementations I've built used services with BehaviorSubjects, or full NgRx with actions and reducers. SignalStore hits a sweet spot. It's simpler than traditional NgRx but more structured than ad-hoc service state. The `rxMethod` pattern for async operations is particularly elegant. It effectively replaces the 'Service with a Subject' pattern that has dominated Angular for a decade. Instead of manually managing `BehaviorSubject.next()`, we just update the signal.

**Comprehensive testing enables fearless refactoring.** Several times during Phase 2, I refactored implementation details. I changed how errors were logged, restructured the auth flow, and adjusted how providers initialized. The tests caught regressions immediately, making refactoring safe rather than scary.

**The foundation enables everything else.** None of the work in Phase 2 is visible to end users, but all of it is essential for building features quickly and confidently. This invisible architecture is what makes the rest of the project possible.

## What's Next

With Phase 2 complete, the application has a solid invisible architecture. Environment configuration is typed and injectable. Logging, analytics, SEO, and theming are abstracted behind clean interfaces. Errors are caught, transformed, and handled consistently. Authentication works with session persistence and route protection.

The next article will cover [Phase 3, the Design System](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/docs/specs/PHASE_3_DS.md). That phase builds the visual component library with all the UI primitives that features will compose. With the core architecture in place, the design system can focus purely on presentation, knowing that services, state, and error handling are already solved.

You can explore the complete Phase 2 implementation on GitHub: [MoodyJW/angular-enterprise-blueprint](https://github.com/MoodyJW/angular-enterprise-blueprint)

---

_Next in series: Phase 3 Deep Dive – The Design System and Component Library_
