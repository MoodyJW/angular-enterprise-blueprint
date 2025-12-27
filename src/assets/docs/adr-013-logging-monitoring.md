# ADR-013: Logging & Monitoring Strategy

## Status

Accepted

## Date

2025-12-24

## Context

Debugging issues in production is impossible without logs. However, `console.log` is bad practice because it clutters the user's console and isn't persisted anywhere useful. We need a robust logging abstraction.

### Options Considered

1. **Bare `console.log`**:
   - _Pros_: Easy.
   - _Cons_: No severity levels, can't disable easily, no remote aggregation.
2. **Third-party Services (Sentry/LogRocket) Direct SDKs**:
   - _Pros_: Powerful.
   - _Cons_: Vendor lock-in; hard to swap out later.
3. **`LoggerService` Abstraction**:
   - _Pros_: Decoupled. We can pipe logs to Console in Dev and Sentry/Datadog in Production.

## Decision

We chose **`LoggerService` Abstraction**.

### Rationale

1. **Environment Control**: We can set log levels (e.g., DEBUG in dev, ERROR only in prod).
2. **Context**: We can automatically enrich logs with User ID, Session ID, and Timestamps.
3. **Flexibility**: Swapping the backend (e.g., moving from Sentry to something else) only changes one file (`logger.service.ts`).

## Implementation

```typescript
@Injectable({ providedIn: 'root' })
export class LoggerService {
  info(message: string, ...context: any[]) {
    if (environment.production) {
      // Send to remote
    } else {
      console.info(`[INFO] ${message}`, context);
    }
  }

  error(message: string, error: Error) {
    // Always log errors
    console.error(message, error);
    // Send to alerting system
  }
}
```

## Consequences

### Positive

- **Clarity**: Development console is clean; only meaningful logs appear.
- **Safety**: PII (Personally Identifiable Information) masking can be implemented centrally.

### Negative

- **Discipline**: Developers must remember to inject `LoggerService` instead of typing `console.log`.
- **Setup Overhead**: Requires initial configuration and team training on proper logging practices.

### Neutral

- **Enterprise Standard**: Service-based logging abstraction is the conventional pattern in production applications.
- **Observability Integration**: The abstraction makes future integration with observability platforms (Sentry, Datadog, New Relic) straightforward.

## References

- [12 Factor App: Logs](https://12factor.net/logs)
