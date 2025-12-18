# 🧠 Phase 2: Core Architecture Specifications

**Objective:** Implement the application's "Nervous System"—the singleton services, global state, and configuration that run underneath the UI.
**Principle:** All services must be `providedIn: 'root'`. State must be managed via `SignalStore`. Dependencies must be abstracted behind interfaces where possible (Strategy Pattern).

---

## 2.1 Strictly Typed Environments

We need to prevent `process.env` usage and magic strings.

### **File Structure**

- `src/environments/environment.type.ts` (Interface)
- `src/environments/environment.ts` (Dev/Default)
- `src/environments/environment.prod.ts` (Production)

### **Interface `AppEnvironment`**

```typescript
export interface AppEnvironment {
  appName: string;
  production: boolean;
  apiUrl: string; // "api" for mockend, real URL for prod
  features: {
    mockAuth: boolean; // Toggle to switch strategies easily
    analytics: boolean;
  };
  version: string;
}
```

---

## 2.2 Infrastructure Services

These services handle the "plumbing" of the application.

### **1. LoggerService** (`core/services/logger`)

- **Goal:** A centralized wrapper around `console`. Allows us to pipe logs to a remote server (like Datadog/Sentry) later without rewriting component code.
- **API:** `.log()`, `.warn()`, `.error()`, `.info()`.
- **Logic:**
  - If `environment.production` is true, suppress `.log()` and `.info()`.
  - Always print `.error()`.

### **2. AnalyticsService** (`core/services/analytics`)

- **Goal:** Abstract GA4/GTM so we can swap vendors later.
- **API:** `.trackEvent(name: string, properties: Record<string, any>)`, `.trackPageView(url: string)`.
- **Implementation:**
  - Use `environment.features.analytics` to toggle execution.
  - If false, just log "[Analytics Mock] Tracked Event: X" to the console.

### **3. ThemeService** (`core/services/theme`)

- **Goal:** Manage Dark/Light mode.
- **State:** Use a standard `signal<Theme>('light')`.
- **Persistence:**
  - On init: Check `localStorage.getItem('theme')`. If empty, check `window.matchMedia('(prefers-color-scheme: dark)')`.
  - On change: Update `localStorage` and `document.body.classList`.
  - **Supported Themes:** `light`, `dark`, `high-contrast`.

---

## 2.3 Global Error Handling

We want to catch errors before they crash the UI and present them gracefully.

### **1. GlobalErrorHandler** (`core/error-handling/global-error-handler.ts`)

- **Implements:** Angular's `ErrorHandler` class.
- **Action:**
  - Log error via `LoggerService`.
  - Show a generic "Something went wrong" toast via `ToastService` (from Phase 3, mock it for now or rely on console).

### **2. HttpErrorInterceptor** (`core/interceptors/http-error.interceptor.ts`)

- **Type:** Functional Interceptor (`HttpInterceptorFn`).
- **Action:**
  - Catch `HttpErrorResponse`.
  - If 401: Trigger `AuthStore.logout()`.
  - If 403: Redirect to `/forbidden`.
  - If 5xx: Show "Server Error" toast.

---

## 2.4 Authentication (The Mockend Strategy)

This is the most critical part of Phase 2. We use a **Strategy Pattern** to allow switching between "Fake Auth" (for the blueprint demo) and "Real Auth" (future).

### **1. The Contract** (`core/auth/auth.interface.ts`)

Define what an Auth Provider _must_ do.

```typescript
import { Observable } from 'rxjs';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  roles: ('admin' | 'user')[];
}

export interface AuthStrategy {
  login(credentials: { username: string; password: string }): Observable<User>;
  logout(): Observable<void>;
  checkSession(): Observable<User | null>;
}
```

### **2. The Implementation** (`core/auth/strategies/mock-auth.strategy.ts`)

- **Implements:** `AuthStrategy`.
- **Logic:**
  - `login()`:
    - Use `delay(800)` to simulate network.
    - Hardcoded check: if `username === 'demo'`, return success. Else throw 401.
    - Store dummy token in `localStorage`.
  - `checkSession()`: Checks if token exists in `localStorage`.

### **3. The State** (`core/auth/auth.store.ts`)

- **Library:** `@ngrx/signals`.
- **State Interface:**
  ```typescript
  type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  };
  ```
- **Methods (RxMethod):**
  - `login(credentials)`: Calls `strategy.login()`, updates state.
  - `logout()`: Calls `strategy.logout()`, clears state, clears LocalStorage, navigates to `/login`.

### **4. The Guards** (`core/auth/guards`)

- **`authGuard`**: Functional guard. If `!store.isAuthenticated()`, return `createUrlTree(['/auth/login'])`.
- **`guestGuard`**: If `store.isAuthenticated()`, redirect to `/dashboard`. (Prevents logged-in users from seeing the login page).

---

## 2.5 Testing Requirements

Every service created in Phase 2 must have a corresponding `.spec.ts` file.

- **Unit Tests:** Use `Vitest`.
- **Mocking:** Use `ng-mocks` or `jasmine.createSpyObj` (adapted for Vitest) for dependencies.
- **Coverage:** 100% statement coverage for `AuthStore` and `GlobalErrorHandler`.

---

## 2.6 Execution Checklist

1.  [ ] Create typed environments and interfaces.
2.  [ ] Scaffold `LoggerService` and `AnalyticsService` (singleton/root).
3.  [ ] Implement `ThemeService` with system preference detection.
4.  [ ] Create `GlobalErrorHandler` and register in `app.config.ts`.
5.  [ ] **Auth System:**
    - [ ] Define `AuthStrategy` interface.
    - [ ] Build `MockAuthStrategy`.
    - [ ] Build `AuthStore` using Signals.
    - [ ] Implement `authGuard` and `guestGuard`.
    - [ ] Register provider in `app.config.ts` using the Strategy pattern (`{ provide: AuthStrategy, useClass: MockAuthStrategy }`).
