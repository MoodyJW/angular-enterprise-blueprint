# ADR-002: Mock Authentication with Strategy Pattern

## Status

Accepted

## Date

2025-12-16

## Context

The Angular Enterprise Blueprint needs an authentication system that:

- Works without a real backend
- Demonstrates enterprise authentication patterns
- Is easily swappable for real auth providers
- Supports testing with controlled behavior

### Options Considered

1. **Direct Service Implementation** - Single auth service with mock logic
2. **Strategy Pattern** - Abstract interface with swappable implementations
3. **Firebase/Auth0 Integration** - Real auth service with emulators
4. **Environment-Based Switching** - Different implementations per environment

## Decision

We chose the **Strategy Pattern** to implement authentication with a `MockAuthStrategy` as the default provider.

### Rationale

1. **Dependency Inversion**: Components depend on `AuthStrategy` interface, not implementation.

2. **Swappable Implementations**: Production can use real auth (OAuth, SAML) while development uses mock.

3. **Testability**: Mock strategy provides deterministic behavior for tests.

4. **Enterprise Pattern**: Demonstrates SOLID principles expected in enterprise codebases:
   - **S**ingle Responsibility: Each class has one reason to change
   - **O**pen/Closed: Open for extension, closed for modification
   - **L**iskov Substitution: Subtypes must be substitutable for their base types
   - **I**nterface Segregation: Many specific interfaces over one general-purpose interface
   - **D**ependency Inversion: Depend on abstractions, not concretions

## Implementation

```typescript
// Abstract Strategy Interface
export abstract class AuthStrategy {
  abstract login(credentials: LoginCredentials): Observable<User>;
  abstract logout(): Observable<void>;
  abstract checkSession(): Observable<User | null>;
}

// Mock Implementation
@Injectable()
export class MockAuthStrategy extends AuthStrategy {
  login(credentials: LoginCredentials): Observable<User> {
    // Simulate network delay
    return of(mockUser).pipe(delay(800));
  }
}

// Provider Configuration
export function provideAuth(): Provider[] {
  return [{ provide: AuthStrategy, useClass: MockAuthStrategy }, AuthStore];
}
```

### Key Features

1. **Simulated Delays**: `delay(800)` mimics real network latency
2. **Session Persistence**: Uses `localStorage` to persist mock sessions
3. **Logging**: All operations logged via `LoggerService` for debugging
4. **Error Simulation**: Random errors (10% in dev) test error handling

## Consequences

### Positive

- Clean separation between auth logic and HTTP implementation
- Easy to swap for real auth (OAuth2, SAML, etc.)
- Tests can inject controlled mock behavior
- Demonstrates dependency injection best practices

### Negative

- Additional abstraction layer adds complexity
- Mock behavior may not perfectly match real auth providers
- Developers must understand strategy pattern

### Neutral

- Pattern is standard in enterprise Java/C# codebases
- Angular's DI system makes implementation straightforward

## References

- [Strategy Pattern (Wikipedia)](https://en.wikipedia.org/wiki/Strategy_pattern)
- [Angular Dependency Injection](https://angular.dev/guide/di)
