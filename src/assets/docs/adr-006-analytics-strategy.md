# ADR-006: Analytics Strategy Pattern

## Status

Accepted

## Date

2025-12-20

## Context

The application requires analytics tracking to understand user behavior, page views, and interactions. We need a solution that:

1. Supports valid analytics in production (Google Analytics 4).
2. Avoids polluting production data during development and testing.
3. Provides a unified API for developers so they don't need to know which provider is active.
4. Allows for easy swapping or addition of new providers (e.g., Mixpanel, custom backend) in the future.

### Options Considered

1. **Direct Google Analytics Integration**: Importing `gtag.js` directly in components.
   - _Pros_: Simple to start.
   - _Cons_: Hard to test, tightly coupled to GA, pollutes data during dev.
2. **Third-party Angular Libraries**: Using libraries like `angular-google-analytics`.
   - _Pros_: Pre-built components/directives.
   - _Cons_: Strong dependency on library maintenance, may not support latest Angular features (Signals/Hydration).
3. **Strategy Pattern Abstraction**: Defining our own `AnalyticsProvider` interface with swappable implementations.
   - _Pros_: Decoupled, testable, flexible, full control over behavior.
   - _Cons_: Higher initial setup effort.

## Decision

We chose **Option 3: Strategy Pattern Abstraction**.

We defined an abstract `AnalyticsProvider` class that serves as the contract. We then implemented two concrete strategies:

- `ConsoleAnalyticsProvider`: Logs events to console (for development).
- `GoogleAnalyticsProvider`: Sends events to GA4 (for production).

We use an Angular factory provider to select the correct implementation based on the environment configuration.

### Rationale

1. **Separation of Concerns**: Components only care about "tracking an event," not "how" it's tracked.
2. **Testability**: We can easily mock `AnalyticsProvider` in unit tests without triggering external network requests.
3. **Developer Experience**: Developers see analytics events in the browser console during development, verifying instrumentation instantly.
4. **Router Integration**: We implemented a `withAnalyticsRouterTracking` feature that automatically tracks page views on navigation, removing boilerplate from route components.

## Implementation

### The Contract

```typescript
// src/app/core/services/analytics/analytics.provider.ts
export abstract class AnalyticsProvider {
  abstract initialize(): void;
  abstract trackEvent(eventName: string, params?: Record<string, any>): void;
  abstract trackPageView(path: string, title?: string): void;
}
```

### Dependency Injection Setup

```typescript
// src/app/core/services/analytics/analytics.service.ts
export function provideAnalytics() {
  return makeEnvironmentProviders([
    {
      provide: AnalyticsProvider,
      useFactory: () => {
        // Simple logic to choose provider based on environment
        return environment.production
          ? new GoogleAnalyticsProvider()
          : new ConsoleAnalyticsProvider();
      },
    },
    AnalyticsService,
  ]);
}
```

### Router Integration

```typescript
// src/app/app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withAnalyticsRouterTracking()),
    provideAnalytics(),
    // ...
  ],
};
```

## Consequences

### Positive

- **Clean Architecture**: Analytics logic is centralized and decoupled.
- **Production Safety**: Zero risk of development events leaking to production analytics.
- **Maintainability**: Changing analytics vendors only requires adding a new provider class, not rewriting component code.

### Negative

- **Initial Complexity**: Requires more boilerplate files (Provider, Service, Implementations) than a direct script tag.
- **Abstraction Leaks**: Some advanced GA4 features might not map perfectly to a generic `trackEvent` interface without extending the contract.

### Neutral

- **Common Enterprise Pattern**: Strategy pattern for analytics is standard in large-scale applications that need vendor flexibility.
- **Migration Path**: If we need to add additional providers (e.g., Mixpanel, Amplitude), the architecture supports it without refactoring existing code.

## References

- [Strategy Pattern](https://refactoring.guru/design-patterns/strategy)
- [Google Analytics 4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
