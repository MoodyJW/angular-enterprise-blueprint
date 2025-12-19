# 🧠 Phase 2: Core Architecture Specifications

**Objective:** Implement the application's "Nervous System"—the singleton services, global state, and configuration that run underneath the UI.
**Principle:** All services must be `providedIn: 'root'`. State must be managed via `SignalStore`. Dependencies must be abstracted behind interfaces where possible (Strategy Pattern).

---

## 2.1 Strictly Typed Environments ✅

We need to prevent `process.env` usage and magic strings.

### **File Structure**

- `src/environments/environment.type.ts` (Interface)
- `src/environments/environment.ts` (Dev/Default)
- `src/environments/environment.prod.ts` (Production)
- `src/app/core/config/environment.token.ts` (DI Token & Provider)

### **Interface `AppEnvironment`** (Implemented)

```typescript
export type AnalyticsProviderType = 'console' | 'google';

export interface GoogleAnalyticsConfig {
  readonly measurementId: string;
}

export interface AnalyticsConfig {
  readonly enabled: boolean;
  readonly provider: AnalyticsProviderType;
  readonly google?: GoogleAnalyticsConfig;
}

export interface AppEnvironment {
  readonly appName: string;
  readonly production: boolean;
  readonly apiUrl: string;
  readonly features: FeatureFlags;
  readonly analytics: AnalyticsConfig;
  readonly version: string;
}
```

### **Dependency Injection** (Implemented)

```typescript
// Usage in app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideEnvironment(), // Provides ENVIRONMENT token
    // ...
  ],
};

// Usage in services
private readonly env = inject(ENVIRONMENT);
```

---

## 2.2 Infrastructure Services

These services handle the "plumbing" of the application.

### **1. LoggerService** (`core/services/logger`) ✅

- **Goal:** A centralized wrapper around `console`. Allows us to pipe logs to a remote server (like Datadog/Sentry) later without rewriting component code.
- **API:** `.log()`, `.warn()`, `.error()`, `.info()`.
- **Logic:**
  - If `environment.production` is true, suppress `.log()` and `.info()`.
  - Always print `.error()` and `.warn()`.
- **Tests:** 15 unit tests covering dev/prod modes.

### **2. AnalyticsService** (`core/services/analytics`) ✅

- **Goal:** Abstract GA4/GTM so we can swap vendors later using Strategy Pattern.
- **API:** `.trackEvent(name, properties?)`, `.trackPageView(url, title?)`, `.identify(userId, traits?)`, `.reset()`.
- **Implementation:** Strategy Pattern with swappable providers.

#### **Analytics Architecture** (Implemented)

- [x] **`AnalyticsProvider` interface** (`analytics-provider.interface.ts`)
  - Contract: `name`, `initialize()`, `trackEvent()`, `trackPageView()`, `identify()`, `reset()`
  - `ANALYTICS_PROVIDER` injection token

- [x] **`ConsoleAnalyticsProvider`** (`providers/console-analytics.provider.ts`)
  - Logs all analytics calls via `LoggerService`
  - Used for development and debugging
  - 10 unit tests

- [x] **`GoogleAnalyticsProvider`** (`providers/google-analytics.provider.ts`)
  - Full GA4/gtag.js integration
  - Dynamically loads gtag script
  - Configurable via `environment.analytics.google.measurementId`
  - 16 unit tests

- [x] **`AnalyticsService`** (`analytics.service.ts`)
  - Facade that delegates to the active provider
  - Gracefully handles disabled analytics (no-op)
  - `isEnabled` and `providerName` computed properties
  - 17 unit tests

- [x] **`provideAnalytics()`** (`analytics.provider.ts`)
  - Factory function for `app.config.ts`
  - Selects provider based on `environment.analytics.provider`
  - Initializes provider on app bootstrap via `provideAppInitializer`
  - 5 unit tests

- [x] **`withAnalyticsRouterTracking()`** (`analytics-router.provider.ts`)
  - Auto-tracks `NavigationEnd` events as page views
  - Captures `document.title` for page titles
  - 7 unit tests

#### **Usage in app.config.ts**

```typescript
export const appConfig: ApplicationConfig = {
  providers: [provideAnalytics(), withAnalyticsRouterTracking()],
};
```

### **3. SeoService** (`core/services/seo`) ✅

- **Goal:** Comprehensive SEO management including titles, meta tags, social sharing, and structured data.
- **Implementation:** Enterprise-grade service with full support for modern SEO requirements.

#### **Features** (Implemented)

- [x] **Title Management** - Dynamic page titles with configurable site name suffix
- [x] **Meta Tags** - Description, keywords, robots, author
- [x] **Canonical URLs** - Prevent duplicate content issues
- [x] **Open Graph** - Social sharing for Facebook, LinkedIn, etc.
- [x] **Twitter Cards** - Twitter-specific social sharing
- [x] **JSON-LD Structured Data** - Rich snippets in search results
- [x] **Reset/Cleanup** - Clear stale metadata on navigation

#### **API**

```typescript
// Primary method for setting all page SEO
updatePageSeo(config: PageSeoConfig): void

// Individual setters
setTitle(title: string, includeSiteName?: boolean): void
setMetaTags(config: MetaConfig): void
setCanonicalUrl(url: string): void
setOpenGraph(config: OpenGraphConfig, fallbackTitle?: string): void
setTwitterCard(config: TwitterCardConfig, fallbackTitle?: string): void
setJsonLd(data: JsonLdConfig | JsonLdConfig[]): void

// Cleanup
resetSeo(): void
removeCanonicalUrl(): void
removeJsonLd(): void
```

#### **Type Definitions** (`seo.types.ts`)

- `PageSeoConfig` - Complete page SEO configuration
- `MetaConfig` - Standard meta tags (description, keywords, robots, author)
- `OpenGraphConfig` - Open Graph properties (title, description, type, image, etc.)
- `TwitterCardConfig` - Twitter Card properties (card, title, description, image, site, creator)
- `JsonLdConfig` - Generic JSON-LD structured data
- Predefined schemas: `WebSiteSchema`, `ArticleSchema`, `OrganizationSchema`, `PersonSchema`, `BreadcrumbSchema`

#### **Usage Example**

```typescript
@Component({ ... })
export class ArticlePageComponent {
  private readonly seo = inject(SeoService);

  ngOnInit() {
    this.seo.updatePageSeo({
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
  }
}
```

- **Tests:** 49 unit tests covering all features

### **4. ThemeService** (`core/services/theme`) ✅

- **Goal:** Manage a collection of named themes with CSS custom properties, supporting dark/light variants and accessibility options.
- **State:** Signal-based state management with `signal<ThemeId>()`.
- **Tests:** 41 unit tests covering all features.

#### **Theme Architecture**

**Theme Categories:**

- `light` - Standard light themes
- `dark` - Standard dark themes
- `high-contrast-light` - Accessible high contrast light theme
- `high-contrast-dark` - Accessible high contrast dark theme

**Initial Themes (6 total):**
| ID | Name | Category | Description |
|----|------|----------|-------------|
| `light-default` | Daylight | light | Clean, professional light theme |
| `light-warm` | Sunrise | light | Warm-toned light theme |
| `dark-default` | Midnight | dark | Deep blue-black dark theme |
| `dark-cool` | Twilight | dark | Cool purple-tinted dark theme |
| `high-contrast-light` | High Contrast Light | high-contrast-light | WCAG AAA compliant light |
| `high-contrast-dark` | High Contrast Dark | high-contrast-dark | WCAG AAA compliant dark |

**Design System Integration:**

- Each theme defines a complete set of CSS custom properties
- Properties organized by category: colors, surfaces, borders, shadows, typography, spacing, motion
- Future-proof for additional themes and design variations (e.g., reduced-motion)
- Smooth transitions between themes via CSS transitions

#### **API** (Implemented)

```typescript
// Signals (readonly)
readonly currentTheme: Signal<Theme>;
readonly currentThemeId: Signal<ThemeId>;
readonly availableThemes: Signal<readonly Theme[]>;
readonly isDarkMode: Signal<boolean>;
readonly isHighContrast: Signal<boolean>;
readonly systemPrefersDark: Signal<boolean>;

// Methods
setTheme(themeId: ThemeId): void;
setThemeBySystemPreference(): void;
getThemesByCategory(category: ThemeCategory): Theme[];
getThemeById(themeId: ThemeId): Theme;
clearPersistedTheme(): void;
```

#### **Persistence & Initialization**

1. On app init: Check `localStorage.getItem('theme-id')`
2. If no stored preference: Detect system preference via `matchMedia('(prefers-color-scheme: dark)')`
3. Select appropriate default theme based on system preference
4. On theme change: Update `localStorage`, apply CSS class to `<html>` element

#### **SCSS Architecture** (Implemented)

```
src/
├── styles/
│   ├── themes/
│   │   ├── _variables.scss        # Base CSS custom properties (default values)
│   │   ├── _light-default.scss    # Daylight theme
│   │   ├── _light-warm.scss       # Sunrise theme
│   │   ├── _dark-default.scss     # Midnight theme
│   │   ├── _dark-cool.scss        # Twilight theme
│   │   ├── _high-contrast-light.scss
│   │   ├── _high-contrast-dark.scss
│   │   └── _index.scss            # Theme loader with transitions
└── styles.scss                    # Main entry point
```

#### **CSS Custom Properties Structure**

```scss
:root[data-theme='light-default'] {
  // Semantic colors
  --color-primary: #...;
  --color-secondary: #...;
  --color-accent: #...;

  // Surface colors
  --surface-background: #...;
  --surface-card: #...;
  --surface-elevated: #...;

  // Text colors
  --text-primary: #...;
  --text-secondary: #...;
  --text-muted: #...;

  // Border & shadows
  --border-default: #...;
  --shadow-sm: ...;
  --shadow-md: ...;

  // State colors
  --color-success: #...;
  --color-warning: #...;
  --color-error: #...;
  --color-info: #...;

  // Motion (for future reduced-motion theme)
  --transition-fast: 150ms;
  --transition-normal: 300ms;
}
```

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

1.  [x] Create typed environments and interfaces.
2.  [x] Scaffold `LoggerService` and `AnalyticsService` (singleton/root).
3.  [x] Implement `SeoService` for comprehensive SEO management.
4.  [x] Implement `ThemeService` with system preference detection.
5.  [ ] Create `GlobalErrorHandler` and register in `app.config.ts`.
6.  [ ] **Auth System:**
    - [ ] Define `AuthStrategy` interface.
    - [ ] Build `MockAuthStrategy`.
    - [ ] Build `AuthStore` using Signals.
    - [ ] Implement `authGuard` and `guestGuard`.
    - [ ] Register provider in `app.config.ts` using the Strategy pattern (`{ provide: AuthStrategy, useClass: MockAuthStrategy }`).
