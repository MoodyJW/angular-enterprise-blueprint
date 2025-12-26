# ADR-005: Error Handling Strategy

## Status

Accepted

## Date

2025-12-17

## Context

The Angular Enterprise Blueprint requires a comprehensive error handling strategy that:

- Catches all unhandled errors
- Normalizes error formats across sources
- Provides user feedback without exposing internals
- Logs errors for debugging/monitoring

### Options Considered

1. **Per-Component Try/Catch** - Decentralized error handling
2. **RxJS catchError Everywhere** - Observable-specific handling
3. **Global ErrorHandler + Interceptor** - Centralized strategy
4. **Error Boundary Components** - React-style error boundaries

## Decision

We chose a **Layered Error Handling Strategy** with:

1. Global `ErrorHandler` for uncaught exceptions
2. HTTP Interceptor for API errors
3. `AppError` interface for normalization
4. `ErrorNotificationService` for user feedback

### Rationale

1. **Defense in Depth**: Multiple layers catch errors at different points
2. **Consistent UX**: All errors show user-friendly messages
3. **Debugging**: Structured logging for all error types
4. **Enterprise Pattern**: Matches backend error handling practices

## Implementation

### Error Types

```typescript
// error.types.ts
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AppError {
  readonly message: string;
  readonly code?: string;
  readonly severity: ErrorSeverity;
  readonly timestamp: Date;
  readonly context?: Record<string, unknown>;
  readonly originalError?: Error;
}

export interface HttpErrorDetails {
  readonly status: number;
  readonly statusText: string;
  readonly url: string | null;
  readonly message: string;
  readonly serverMessage?: string;
}

export const HTTP_ERROR_MESSAGES: Readonly<Record<number, string>> = {
  0: 'Unable to connect to server. Please check your internet connection.',
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to access this resource.',
  404: 'The requested resource was not found.',
  500: 'A server error occurred. Our team has been notified.',
  // ... additional status codes
};
```

### Global ErrorHandler

```typescript
// global-error-handler.ts
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(LoggerService);
  private readonly errorNotification = inject(ErrorNotificationService);
  private readonly ngZone = inject(NgZone);

  handleError(error: unknown): void {
    this.ngZone.runOutsideAngular(() => {
      const appError = this.normalizeError(error);
      this.logError(appError);

      this.ngZone.run(() => {
        this.notifyUser(appError);
      });
    });
  }

  private normalizeError(error: unknown): AppError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: error.name,
        severity: 'error',
        timestamp: new Date(),
        context: { stack: error.stack },
        originalError: error,
      };
    }
    // Handle strings, error-like objects, and unknown types
    return { message: 'An unknown error occurred', severity: 'error', timestamp: new Date() };
  }
}
```

### HTTP Error Interceptor

```typescript
// http-error.interceptor.ts
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const errorNotification = inject(ErrorNotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorDetails = extractErrorDetails(error);

      logger.error(`[HTTP Error] ${error.status}`, {
        url: error.url,
        message: errorDetails.message,
        serverMessage: errorDetails.serverMessage,
      });

      handleHttpError(error, errorDetails, errorNotification, router);
      return throwError(() => error);
    }),
  );
};
```

### Error Notification Service

```typescript
// error-notification.service.ts
@Injectable({ providedIn: 'root' })
export class ErrorNotificationService {
  private readonly logger = inject(LoggerService);

  notifyError(message: string, details?: string): void {
    const fullMessage = details ? `${message} (${details})` : message;
    this.logger.error(`[User Notification] ${fullMessage}`);
    // Future: integrate with ToastService for visual notifications
  }

  notifyWarning(message: string, details?: string): void {
    /* ... */
  }
  notifySuccess(message: string): void {
    /* ... */
  }
  notifyInfo(message: string): void {
    /* ... */
  }
}
```

### Error Flow

```
┌─────────────────┐
│   HTTP Request  │
│   fails         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  HTTP Interceptor│ → Status-specific handling (401→redirect, etc.)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Logger +      │ → Console logging + future observability
│   Notification  │ → User-friendly toast/alert
└─────────────────┘

┌─────────────────┐
│  Uncaught Error │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Global Handler  │ → Normalize error → Log → Notify user
└─────────────────┘
```

### Registration

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
  ],
};
```

## Consequences

### Positive

- No error goes unhandled
- Consistent error format for logging/monitoring
- User sees friendly messages, not stack traces
- Easy to add error tracking (Sentry, etc.)
- Proper NgZone handling prevents change detection issues

### Negative

- Additional abstraction layer
- Global handler catches everything (may hide issues in dev)

### Neutral

- Standard pattern in enterprise applications
- Integrates well with observability tools

## References

- [Angular ErrorHandler](https://angular.dev/api/core/ErrorHandler)
- [HTTP Interceptors](https://angular.dev/guide/http/interceptors)
