# Transloco Implementation Plan

**Status**: Planning
**Last Updated**: 2025-12-26
**Estimated Total Effort**: 16-20 hours

---

## Executive Summary

The Angular Enterprise Blueprint has a **partial Transloco implementation** with ~21% coverage. This plan outlines a systematic approach to achieve 100% internationalization coverage across the entire application, add a language switcher UI component, and establish enterprise-grade i18n patterns.

**Current Status:**

- ✅ Feature pages: Fully translated (home, modules, architecture, auth/login)
- ❌ Layout components: Hardcoded English text
- ❌ Shared components: Hardcoded English text
- ❌ Error messages: Hardcoded English text
- ⚠️ Spanish/French: Only ~25% translated (many missing keys)

---

## Phase 1: Core Translation Infrastructure (High Priority)

### Task 1.1: Expand English Translation File

**Estimated Effort**: 2-3 hours
**Priority**: P0 (Blocker for other tasks)

**Objective**: Add all missing translation keys to `en.json` to serve as the master translation file.

**New Translation Keys to Add:**

```json
{
  "common": {
    "required": "required",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "darkMode": "Dark Mode",
    "lightMode": "Light Mode"
  },
  "header": {
    "brand": "Enterprise Blueprint",
    "logout": "Logout",
    "login": "Login",
    "ariaLabels": {
      "home": "Go to home page",
      "logout": "Logout from your account",
      "login": "Login to your account",
      "toggleMenu": "Toggle mobile menu"
    }
  },
  "footer": {
    "copyright": "© {{ year }} Enterprise Blueprint. All rights reserved.",
    "viewSource": "View Source",
    "builtWith": "Built with Angular v{{ version }}",
    "ariaLabels": {
      "viewSource": "View source code on GitHub"
    }
  },
  "contact": {
    "title": "Hire Me",
    "subtitle": "Let's build something amazing together",
    "comingSoon": "Coming Soon",
    "description": "The contact form will allow potential clients to reach out with project inquiries and collaboration opportunities."
  },
  "profile": {
    "title": "The Architect",
    "subtitle": "Building enterprise-grade Angular applications",
    "comingSoon": "Coming Soon",
    "description": "This page will showcase the architect's bio, skills, experience, and provide resume download options."
  },
  "pageNotFound": {
    "code": "404",
    "title": "Page Not Found",
    "message": "Sorry, the page you're looking for doesn't exist or has been moved.",
    "button": "Go to Dashboard",
    "ariaLabel": "Navigate to dashboard"
  },
  "themePicker": {
    "ariaLabel": "Select theme",
    "currentTheme": "Select theme, current theme: {{ name }}",
    "categories": {
      "light": "Light",
      "dark": "Dark",
      "highContrast": "High Contrast"
    }
  },
  "toast": {
    "dismiss": "Dismiss notification",
    "ariaLabels": {
      "success": "Success",
      "error": "Error",
      "warning": "Warning",
      "info": "Information",
      "container": "Notifications at {{ position }}"
    }
  },
  "modal": {
    "close": "Close dialog"
  },
  "layout": {
    "ariaLabels": {
      "mobileNav": "Mobile navigation"
    }
  },
  "errors": {
    "unknown": "An unknown error occurred",
    "critical": "A critical error occurred. Please refresh the page.",
    "unexpected": "An unexpected error occurred. Please try again.",
    "http": {
      "0": "Unable to connect to server. Please check your internet connection.",
      "400": "Invalid request. Please check your input.",
      "401": "Your session has expired. Please log in again.",
      "403": "You do not have permission to access this resource.",
      "404": "The requested resource was not found.",
      "408": "The request timed out. Please try again.",
      "429": "Too many requests. Please try again later.",
      "429WithRetry": "Too many requests. Please wait {{ seconds }} seconds.",
      "500": "A server error occurred. Our team has been notified.",
      "502": "The server is temporarily unavailable. Please try again later.",
      "503": "The service is temporarily unavailable. Please try again later.",
      "504": "The server took too long to respond. Please try again."
    }
  },
  "languageSwitcher": {
    "label": "Language",
    "ariaLabel": "Select language",
    "currentLanguage": "Current language: {{ language }}",
    "languages": {
      "en": "English",
      "es": "Español",
      "fr": "Français"
    }
  }
}
```

**File to Update:**

- `src/assets/i18n/en.json`

**Validation:**

- Verify JSON is valid
- Check for duplicate keys
- Ensure all interpolation variables are documented

---

### Task 1.2: Update HTTP Error Messages

**Estimated Effort**: 1 hour
**Priority**: P0 (Critical for UX)

**Objective**: Replace hardcoded error messages with Transloco service calls.

**Files to Update:**

#### `src/app/core/error-handling/error.types.ts`

```typescript
// BEFORE (lines 50-62)
export const HTTP_ERROR_MESSAGES: Readonly<Record<number, string>> = {
  0: 'Unable to connect to server. Please check your internet connection.',
  // ... hardcoded messages
};

// AFTER
// Remove HTTP_ERROR_MESSAGES constant entirely
// Error messages will be retrieved from TranslocoService
```

#### `src/app/core/interceptors/http-error.interceptor.ts`

```typescript
// Add TranslocoService injection
const transloco = inject(TranslocoService);

// Replace message lookup (line ~75)
// BEFORE
const userMessage = HTTP_ERROR_MESSAGES[error.status] || HTTP_ERROR_MESSAGES[500];

// AFTER
const userMessage =
  transloco.translate(`errors.http.${error.status}`) || transloco.translate('errors.http.500');

// For 429 with retry-after (line ~106)
// BEFORE
const message = `Too many requests. Please wait ${retryAfter} seconds.`;

// AFTER
const message = transloco.translate('errors.http.429WithRetry', { seconds: retryAfter });
```

#### `src/app/core/error-handling/global-error-handler.ts`

```typescript
// Add TranslocoService injection
private readonly transloco = inject(TranslocoService);

// Replace hardcoded messages (lines 106, 160, 165)
// BEFORE
message: 'An unknown error occurred'

// AFTER
message: this.transloco.translate('errors.unknown')
```

**Testing:**

- Trigger various HTTP errors (401, 404, 500, etc.)
- Verify error messages display in current language
- Test language switching with active error messages

---

### Task 1.3: Update Auth Strategy Error Messages

**Estimated Effort**: 30 minutes
**Priority**: P1

**Objective**: Internationalize authentication error messages.

**File to Update:**
`src/app/core/auth/strategies/mock-auth.strategy.ts`

```typescript
// Add TranslocoService injection
private readonly transloco = inject(TranslocoService);

// Replace hardcoded messages (lines 96, 106)
// BEFORE
throwError(() => new Error('Simulated server error for testing'))

// AFTER
throwError(() => new Error(this.transloco.translate('auth.errors.simulatedError')))

// BEFORE
return throwError(() => new Error('Invalid username or password'));

// AFTER
return throwError(() => new Error(this.transloco.translate('auth.errors.invalidCredentials')));
```

**Testing:**

- Test failed login with invalid credentials
- Test simulated error scenario
- Verify error messages respect language selection

---

## Phase 2: Layout Components (High Priority)

### Task 2.1: Header Component

**Estimated Effort**: 1-2 hours
**Priority**: P0 (Visible on every page)

**Objective**: Internationalize all header text and navigation items.

**Files to Update:**

#### `src/app/core/layout/header/header.component.html`

```html
<!-- Add Transloco directive -->
<header class="header" *transloco="let t">
  <div class="header__container">
    <!-- Line 6 -->
    <span class="header__title">{{ t('header.brand') }}</span>

    <!-- Line 20 - Navigation items need component update -->
    {{ t(item.labelKey) }}

    <!-- Line 39 -->
    [ariaLabel]="t('header.ariaLabels.logout')"

    <!-- Line 43 -->
    {{ t('header.logout') }}

    <!-- Line 50 -->
    [ariaLabel]="t('header.ariaLabels.login')"

    <!-- Line 53 -->
    {{ t('header.login') }}

    <!-- Line 62 -->
    [aria-label]="t('header.ariaLabels.toggleMenu')"
  </div>
</header>
```

#### `src/app/core/layout/navigation.data.ts`

```typescript
// BEFORE (lines 22-26)
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Dashboard', route: '/', icon: 'home' },
  // ...
];

// AFTER
export const NAV_ITEMS: readonly NavItem[] = [
  { labelKey: 'nav.home', route: '/', icon: 'home' },
  { labelKey: 'nav.modules', route: '/modules', icon: 'folder' },
  { labelKey: 'nav.architecture', route: '/architecture', icon: 'document' },
  { labelKey: 'nav.profile', route: '/profile', icon: 'user' },
  { labelKey: 'nav.contact', route: '/contact', icon: 'mail' },
];

// Update NavItem interface
export interface NavItem {
  labelKey: string; // Changed from 'label'
  route: string;
  icon: string;
}
```

**Testing:**

- Navigate to all pages
- Verify navigation labels update with language change
- Test mobile menu
- Verify aria-labels

---

### Task 2.2: Footer Component

**Estimated Effort**: 1 hour
**Priority**: P1 (Visible on every page)

**Objective**: Internationalize footer text.

**File to Update:**
`src/app/core/layout/footer/footer.component.html`

```html
<!-- Add Transloco directive -->
<footer class="footer" *transloco="let t">
  <div class="footer__container">
    <div class="footer__content">
      <!-- Line 6 -->
      <p class="footer__copyright">{{ t('footer.copyright', { year: currentYear() }) }}</p>

      <!-- Line 16 -->
      [aria-label]="t('footer.ariaLabels.viewSource')"

      <!-- Line 23 -->
      {{ t('footer.viewSource') }}

      <!-- Line 29 -->
      {{ t('footer.builtWith', { version: angularVersion }) }}
    </div>
  </div>
</footer>
```

**Testing:**

- Verify copyright year interpolation
- Verify Angular version interpolation
- Test language switching

---

### Task 2.3: Main Layout Component

**Estimated Effort**: 15 minutes
**Priority**: P2

**Objective**: Internationalize aria-label.

**File to Update:**
`src/app/core/layout/main-layout/main-layout.component.html`

```html
<!-- Add Transloco directive and update line 8 -->
<ng-container *transloco="let t">
  <nav role="navigation" [attr.aria-label]="t('layout.ariaLabels.mobileNav')">
    <!-- ... -->
  </nav>
</ng-container>
```

---

## Phase 3: Shared Components (Medium Priority)

### Task 3.1: Page Not Found Component

**Estimated Effort**: 30 minutes
**Priority**: P1 (Common error page)

**File to Update:**
`src/app/shared/components/page-not-found/page-not-found.component.html`

```html
<div class="page-not-found" *transloco="let t">
  <h1>{{ t('pageNotFound.code') }}</h1>
  <h2>{{ t('pageNotFound.title') }}</h2>
  <p>{{ t('pageNotFound.message') }}</p>
  <eb-button routerLink="/" [ariaLabel]="t('pageNotFound.ariaLabel')">
    {{ t('pageNotFound.button') }}
  </eb-button>
</div>
```

---

### Task 3.2: Toast Component

**Estimated Effort**: 1 hour
**Priority**: P1 (Used throughout app)

**Files to Update:**

#### `src/app/shared/components/toast/toast.component.ts`

```typescript
// Add TranslocoService injection
private readonly transloco = inject(TranslocoService);

// Update getIconLabel method (lines 140-148)
private getIconLabel(variant: ToastVariant): string {
  const labelMap: Record<ToastVariant, string> = {
    success: this.transloco.translate('toast.ariaLabels.success'),
    error: this.transloco.translate('toast.ariaLabels.error'),
    warning: this.transloco.translate('toast.ariaLabels.warning'),
    info: this.transloco.translate('toast.ariaLabels.info'),
  };
  return labelMap[variant];
}
```

#### `src/app/shared/components/toast/toast.component.html`

```html
<ng-container *transloco="let t">
  <!-- Line 31 -->
  [attr.aria-label]="t('toast.dismiss')"
</ng-container>
```

#### `src/app/shared/components/toast/toast-container.component.html`

```html
<ng-container *transloco="let t">
  <!-- Line 6 -->
  [attr.aria-label]="t('toast.ariaLabels.container', { position: position() })"
</ng-container>
```

---

### Task 3.3: Theme Picker Component

**Estimated Effort**: 1 hour
**Priority**: P2

**File to Update:**
`src/app/shared/components/theme-picker/theme-picker.component.ts`

```typescript
// Add TranslocoService injection
private readonly transloco = inject(TranslocoService);

// Update getCategoryLabel method (lines 90-94)
private getCategoryLabel(category: string): string {
  const categoryMap: Record<string, string> = {
    light: this.transloco.translate('themePicker.categories.light'),
    dark: this.transloco.translate('themePicker.categories.dark'),
    'high-contrast': this.transloco.translate('themePicker.categories.highContrast'),
  };
  return categoryMap[category] || category;
}

// Update aria-label (line 9)
const currentTheme = this.themeService.currentTheme();
const ariaLabel = this.transloco.translate('themePicker.currentTheme', {
  name: currentTheme.name
});

// Update default aria-label (line 60)
readonly ariaLabel = input<string>(this.transloco.translate('themePicker.ariaLabel'));
```

---

### Task 3.4: Modal Component

**Estimated Effort**: 15 minutes
**Priority**: P2

**File to Update:**
`src/app/shared/components/modal/modal.component.html`

```html
<ng-container *transloco="let t">
  <!-- Line 28 -->
  [attr.aria-label]="t('modal.close')"
</ng-container>
```

---

### Task 3.5: Input & Textarea Components

**Estimated Effort**: 30 minutes
**Priority**: P2

**Files to Update:**

#### `src/app/shared/components/input/input.component.html`

```html
<ng-container *transloco="let t">
  <!-- Line 12 -->
  [attr.aria-label]="t('common.required')"
</ng-container>
```

#### `src/app/shared/components/textarea/textarea.component.html`

```html
<ng-container *transloco="let t">
  <!-- Line 12 -->
  [attr.aria-label]="t('common.required')"
</ng-container>
```

---

## Phase 4: Feature Pages (Medium Priority)

### Task 4.1: Contact Component

**Estimated Effort**: 30 minutes
**Priority**: P2

**File to Update:**
`src/app/features/contact/contact.component.html`

```html
<div class="contact" *transloco="let t">
  <div class="contact__container">
    <header class="contact__header">
      <h1 class="contact__title">{{ t('contact.title') }}</h1>
      <p class="contact__subtitle">{{ t('contact.subtitle') }}</p>
    </header>

    <div class="contact__content">
      <div class="contact__placeholder">
        <span class="contact__placeholder-icon">📧</span>
        <h2 class="contact__placeholder-title">{{ t('contact.comingSoon') }}</h2>
        <p class="contact__placeholder-text">{{ t('contact.description') }}</p>
      </div>
    </div>
  </div>
</div>
```

---

### Task 4.2: Profile Component

**Estimated Effort**: 30 minutes
**Priority**: P2

**File to Update:**
`src/app/features/profile/profile.component.html`

```html
<div class="profile" *transloco="let t">
  <div class="profile__container">
    <header class="profile__header">
      <h1 class="profile__title">{{ t('profile.title') }}</h1>
      <p class="profile__subtitle">{{ t('profile.subtitle') }}</p>
    </header>

    <div class="profile__content">
      <div class="profile__placeholder">
        <span class="profile__placeholder-icon">👨‍💻</span>
        <h2 class="profile__placeholder-title">{{ t('profile.comingSoon') }}</h2>
        <p class="profile__placeholder-text">{{ t('profile.description') }}</p>
      </div>
    </div>
  </div>
</div>
```

---

### Task 4.3: Home Component Theme Preference Text

**Estimated Effort**: 15 minutes
**Priority**: P2

**File to Update:**
`src/app/features/home/home.component.html`

```html
<!-- Line 123 - Replace inline ternary with translation keys -->
<ng-container *transloco="let t">
  {{ themeService.systemPrefersDark() ? t('common.darkMode') : t('common.lightMode') }}
</ng-container>
```

---

## Phase 5: Language Switcher Component (High Priority)

### Task 5.1: Create Language Switcher Component

**Estimated Effort**: 3-4 hours
**Priority**: P0 (Critical feature for i18n)

**Objective**: Create a reusable language selector component similar to the theme picker.

**Component Structure:**

```
src/app/shared/components/language-switcher/
├── language-switcher.component.ts
├── language-switcher.component.html
├── language-switcher.component.scss
├── language-switcher.component.spec.ts
├── language-switcher.component.stories.ts
└── index.ts
```

#### `language-switcher.component.ts`

```typescript
import { Component, ChangeDetectionStrategy, input, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { IconComponent } from '../icon/icon.component';
import { ICON_NAMES } from '@shared/constants';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const AVAILABLE_LANGUAGES: readonly Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
] as const;

@Component({
  selector: 'eb-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent, TranslocoModule],
})
export class LanguageSwitcherComponent {
  private readonly transloco = inject(TranslocoService);

  // Inputs
  readonly variant = input<'dropdown' | 'inline'>('dropdown');
  readonly size = input<'sm' | 'md'>('md');
  readonly ariaLabel = input<string>('languageSwitcher.ariaLabel');

  // State
  readonly isOpen = signal(false);
  readonly languages = AVAILABLE_LANGUAGES;
  readonly ICONS = ICON_NAMES;

  // Computed
  readonly currentLanguage = computed(() => {
    const code = this.transloco.getActiveLang();
    return this.languages.find((lang) => lang.code === code) || this.languages[0];
  });

  readonly dropdownAriaLabel = computed(() => {
    const current = this.currentLanguage();
    return this.transloco.translate('languageSwitcher.currentLanguage', {
      language: current.nativeName,
    });
  });

  toggleDropdown(): void {
    this.isOpen.update((open) => !open);
  }

  selectLanguage(language: Language): void {
    this.transloco.setActiveLang(language.code);
    this.isOpen.set(false);

    // Persist language preference
    localStorage.setItem('preferred-language', language.code);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }
}
```

#### `language-switcher.component.html`

```html
<ng-container *transloco="let t">
  @if (variant() === 'dropdown') {
  <div class="language-switcher" [class.language-switcher--sm]="size() === 'sm'">
    <button
      type="button"
      class="language-switcher__button"
      [attr.aria-label]="dropdownAriaLabel()"
      [attr.aria-expanded]="isOpen()"
      (click)="toggleDropdown()"
    >
      <eb-icon [name]="ICONS.GLOBE" [size]="size()" [decorative]="true"></eb-icon>
      <span class="language-switcher__button-text">{{ currentLanguage().code.toUpperCase() }}</span>
      <eb-icon
        [name]="ICONS.CHEVRON_DOWN"
        size="sm"
        [decorative]="true"
        class="language-switcher__chevron"
        [class.language-switcher__chevron--open]="isOpen()"
      ></eb-icon>
    </button>

    @if (isOpen()) {
    <div class="language-switcher__dropdown">
      <div class="language-switcher__backdrop" (click)="closeDropdown()"></div>
      <div class="language-switcher__menu" role="menu">
        @for (language of languages; track language.code) {
        <button
          type="button"
          role="menuitem"
          class="language-switcher__option"
          [class.language-switcher__option--selected]="language.code === currentLanguage().code"
          (click)="selectLanguage(language)"
        >
          <span class="language-switcher__option-code">{{ language.code.toUpperCase() }}</span>
          <span class="language-switcher__option-name">{{ language.nativeName }}</span>
          @if (language.code === currentLanguage().code) {
          <eb-icon [name]="ICONS.CHECK" size="sm" [decorative]="true"></eb-icon>
          }
        </button>
        }
      </div>
    </div>
    }
  </div>
  } @else {
  <!-- Inline variant (for mobile/settings page) -->
  <div class="language-switcher language-switcher--inline">
    @for (language of languages; track language.code) {
    <button
      type="button"
      class="language-switcher__inline-button"
      [class.language-switcher__inline-button--active]="language.code === currentLanguage().code"
      (click)="selectLanguage(language)"
      [attr.aria-label]="language.nativeName"
    >
      {{ language.code.toUpperCase() }}
    </button>
    }
  </div>
  }
</ng-container>
```

#### `language-switcher.component.scss`

```scss
.language-switcher {
  position: relative;

  &--sm {
    font-size: var(--font-size-sm);
  }

  &__button {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-2) var(--space-3);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-md);
    color: var(--color-text);
    font-size: inherit;
    cursor: pointer;
    transition: all var(--duration-fast);

    &:hover {
      background-color: var(--color-surface-hover);
      border-color: var(--color-border-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--color-focus-ring);
      outline-offset: 2px;
    }
  }

  &__button-text {
    font-weight: var(--font-weight-medium);
    font-family: var(--font-family-mono);
  }

  &__chevron {
    transition: transform var(--duration-normal);

    &--open {
      transform: rotate(180deg);
    }
  }

  &__dropdown {
    position: relative;
  }

  &__backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--z-dropdown-backdrop);
  }

  &__menu {
    position: absolute;
    top: calc(100% + var(--space-1));
    right: 0;
    min-width: 200px;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-dropdown);
    overflow: hidden;
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    width: 100%;
    padding: var(--space-2) var(--space-3);
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background-color var(--duration-fast);

    &:hover {
      background-color: var(--color-surface-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--color-focus-ring);
      outline-offset: -2px;
    }

    &--selected {
      background-color: var(--color-primary-subtle);
      color: var(--color-primary);
      font-weight: var(--font-weight-semibold);
    }
  }

  &__option-code {
    font-family: var(--font-family-mono);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-secondary);
  }

  &__option-name {
    flex: 1;
  }

  // Inline variant
  &--inline {
    display: flex;
    gap: var(--space-2);
  }

  &__inline-button {
    padding: var(--space-2) var(--space-3);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-md);
    font-family: var(--font-family-mono);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    transition: all var(--duration-fast);

    &:hover {
      background-color: var(--color-surface-hover);
      border-color: var(--color-border-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--color-focus-ring);
      outline-offset: 2px;
    }

    &--active {
      background-color: var(--color-primary);
      color: var(--color-on-primary);
      border-color: var(--color-primary);
    }
  }
}
```

**Testing Requirements:**

- Unit tests for language switching
- Dropdown open/close functionality
- Keyboard navigation
- Accessibility (ARIA labels, focus management)
- LocalStorage persistence
- Storybook stories for both variants

---

### Task 5.2: Integrate Language Switcher in Header

**Estimated Effort**: 30 minutes
**Priority**: P0

**File to Update:**
`src/app/core/layout/header/header.component.html`

```html
<!-- Add language switcher next to theme picker (around line 30) -->
<div class="header__actions">
  <!-- Language Switcher -->
  <eb-language-switcher variant="dropdown" size="sm" />

  <!-- Theme Picker -->
  <eb-theme-picker variant="dropdown" size="sm" />

  <!-- Auth Actions -->
  @if (isAuthenticated()) {
  <!-- ... -->
  }
</div>
```

**Update styles:**

```scss
// src/app/core/layout/header/header.component.scss
.header {
  &__actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }
}
```

---

## Phase 6: Complete Spanish & French Translations (Medium Priority)

### Task 6.1: Spanish Translation (es.json)

**Estimated Effort**: 3-4 hours
**Priority**: P2

**Objective**: Translate all English keys to Spanish.

**File to Update:**
`src/assets/i18n/es.json`

**Process:**

1. Copy complete structure from `en.json`
2. Translate all values to Spanish
3. Maintain same interpolation variables ({{ year }}, {{ version }}, etc.)
4. Review for cultural appropriateness
5. Test with native Spanish speaker if possible

**Priority Sections to Translate:**

1. Common & errors (highest visibility)
2. Header & footer (on every page)
3. Feature pages (home, modules, architecture)
4. Shared components

---

### Task 6.2: French Translation (fr.json)

**Estimated Effort**: 3-4 hours
**Priority**: P2

**Objective**: Translate all English keys to French.

**File to Update:**
`src/assets/i18n/fr.json`

**Process:**
Same as Spanish translation task.

---

## Phase 7: Advanced i18n Features (Low Priority)

### Task 7.1: Language-Specific Data Strategy

**Estimated Effort**: 2-3 hours
**Priority**: P3

**Objective**: Determine strategy for data files with user-facing content.

**Options to Consider:**

#### Option 1: Translation Key References

```json
// modules.json
{
  "id": "module-001",
  "titleKey": "modules.items.module001.title",
  "descriptionKey": "modules.items.module001.description",
  "features": ["modules.items.module001.features.0", "modules.items.module001.features.1"]
}
```

#### Option 2: Separate Data Files per Language

```
src/assets/data/
├── en/
│   ├── modules.json
│   └── architecture.json
├── es/
│   ├── modules.json
│   └── architecture.json
└── fr/
    ├── modules.json
    └── architecture.json
```

#### Option 3: Hybrid Approach

Keep data structure in JSON, add `i18n` field:

```json
{
  "id": "module-001",
  "i18n": {
    "en": {
      "title": "State Management",
      "description": "..."
    },
    "es": {
      "title": "Gestión de Estado",
      "description": "..."
    }
  }
}
```

**Recommendation**: Option 2 (separate files) for maintainability.

**Implementation:**

1. Update services to load language-specific data files
2. Migrate existing data to language-specific directories
3. Update TypeScript interfaces if needed
4. Test data loading with language switching

---

### Task 7.2: Language Persistence & Initial Load

**Estimated Effort**: 1 hour
**Priority**: P2

**Objective**: Ensure language preference persists and loads correctly.

**Implementation:**

#### Update app initialization

`src/app/app.config.ts`

```typescript
export function preloadLanguage(): void {
  const savedLang = localStorage.getItem('preferred-language');
  const browserLang = navigator.language.split('-')[0];
  const availableLangs = ['en', 'es', 'fr'];

  const lang =
    savedLang && availableLangs.includes(savedLang)
      ? savedLang
      : availableLangs.includes(browserLang)
        ? browserLang
        : 'en';

  // Set initial language
  // This will be handled by Transloco config
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideTransloco({
      config: {
        availableLangs: ['en', 'es', 'fr'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    // ... other providers
  ],
};
```

**Testing:**

- Clear localStorage and verify default language
- Set language preference and refresh page
- Test with browser language set to Spanish/French
- Verify language switcher reflects correct initial state

---

### Task 7.3: Add Language to Analytics Tracking

**Estimated Effort**: 30 minutes
**Priority**: P3

**Objective**: Track language usage in analytics.

**File to Update:**
`src/app/shared/components/language-switcher/language-switcher.component.ts`

```typescript
selectLanguage(language: Language): void {
  this.transloco.setActiveLang(language.code);
  this.isOpen.set(false);

  // Persist preference
  localStorage.setItem('preferred-language', language.code);

  // Track in analytics
  const analytics = inject(AnalyticsService, { optional: true });
  analytics?.trackEvent('language_changed', {
    from: this.currentLanguage().code,
    to: language.code,
  });
}
```

---

## Phase 8: Testing & Validation (Critical)

### Task 8.1: Create i18n Testing Utilities

**Estimated Effort**: 2 hours
**Priority**: P1

**Objective**: Create test utilities for i18n testing.

**File to Create:**
`src/app/testing/i18n-test-utils.ts`

```typescript
import { TranslocoTestingModule, TranslocoTestingOptions } from '@jsverse/transloco';

export function getTranslocoTestingModule(options?: Partial<TranslocoTestingOptions>) {
  return TranslocoTestingModule.forRoot({
    langs: {
      en: require('../../assets/i18n/en.json'),
      es: require('../../assets/i18n/es.json'),
      fr: require('../../assets/i18n/fr.json'),
    },
    translocoConfig: {
      availableLangs: ['en', 'es', 'fr'],
      defaultLang: 'en',
    },
    ...options,
  });
}

export function testTranslationKey(key: string, lang: string = 'en'): boolean {
  const translations = require(`../../assets/i18n/${lang}.json`);
  const keys = key.split('.');
  let value: any = translations;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return false;
    }
  }

  return typeof value === 'string';
}
```

**Usage in Tests:**

```typescript
describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, getTranslocoTestingModule()],
    }).compileComponents();
  });

  it('should display translated brand name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Enterprise Blueprint');
  });

  it('should have all required translation keys', () => {
    expect(testTranslationKey('header.brand')).toBe(true);
    expect(testTranslationKey('header.logout')).toBe(true);
    expect(testTranslationKey('header.ariaLabels.logout')).toBe(true);
  });
});
```

---

### Task 8.2: Add Translation Key Validation Script

**Estimated Effort**: 2 hours
**Priority**: P1

**Objective**: Create script to validate translation completeness.

**File to Create:**
`scripts/validate-translations.js`

```javascript
const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '../src/assets/i18n');
const languages = ['en', 'es', 'fr'];

function loadTranslations(lang) {
  const filePath = path.join(i18nDir, `${lang}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function validateTranslations() {
  const allTranslations = {};
  const allKeys = {};

  // Load all translations
  for (const lang of languages) {
    allTranslations[lang] = loadTranslations(lang);
    allKeys[lang] = new Set(getKeys(allTranslations[lang]));
  }

  // Use English as reference
  const referenceKeys = allKeys['en'];
  let hasErrors = false;

  console.log('🔍 Validating translation files...\n');

  for (const lang of languages) {
    if (lang === 'en') continue;

    const langKeys = allKeys[lang];
    const missingKeys = [...referenceKeys].filter((key) => !langKeys.has(key));
    const extraKeys = [...langKeys].filter((key) => !referenceKeys.has(key));

    console.log(`📝 ${lang.toUpperCase()}:`);

    if (missingKeys.length > 0) {
      console.log(`  ❌ Missing ${missingKeys.length} keys:`);
      missingKeys.slice(0, 10).forEach((key) => console.log(`     - ${key}`));
      if (missingKeys.length > 10) {
        console.log(`     ... and ${missingKeys.length - 10} more`);
      }
      hasErrors = true;
    }

    if (extraKeys.length > 0) {
      console.log(`  ⚠️  ${extraKeys.length} extra keys (not in English):`);
      extraKeys.slice(0, 5).forEach((key) => console.log(`     - ${key}`));
    }

    if (missingKeys.length === 0 && extraKeys.length === 0) {
      console.log(`  ✅ Complete (${langKeys.size} keys)`);
    }

    console.log('');
  }

  console.log(`\n📊 Summary:`);
  console.log(`  Total keys in English: ${referenceKeys.size}`);
  languages.forEach((lang) => {
    const coverage = ((allKeys[lang].size / referenceKeys.size) * 100).toFixed(1);
    console.log(`  ${lang.toUpperCase()}: ${allKeys[lang].size} keys (${coverage}% coverage)`);
  });

  if (hasErrors) {
    console.log('\n❌ Translation validation failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All translations are complete!');
  }
}

validateTranslations();
```

**Add to package.json:**

```json
{
  "scripts": {
    "i18n:validate": "node scripts/validate-translations.js",
    "test:i18n": "npm run i18n:validate && npm test"
  }
}
```

---

### Task 8.3: Update CI/CD to Validate Translations

**Estimated Effort**: 30 minutes
**Priority**: P1

**File to Update:**
`.github/workflows/ci.yml`

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      # ... existing steps

      - name: Validate translations
        run: npm run i18n:validate

      - name: Run tests
        run: npm test
```

---

## Implementation Checklist

### Phase 1: Core Infrastructure ✓

- [ ] Task 1.1: Expand English translation file (2-3h)
- [ ] Task 1.2: Update HTTP error messages (1h)
- [ ] Task 1.3: Update auth error messages (30m)

### Phase 2: Layout Components ✓

- [ ] Task 2.1: Header component (1-2h)
- [ ] Task 2.2: Footer component (1h)
- [ ] Task 2.3: Main layout component (15m)

### Phase 3: Shared Components ✓

- [ ] Task 3.1: Page not found (30m)
- [ ] Task 3.2: Toast component (1h)
- [ ] Task 3.3: Theme picker (1h)
- [ ] Task 3.4: Modal component (15m)
- [ ] Task 3.5: Input & textarea (30m)

### Phase 4: Feature Pages ✓

- [ ] Task 4.1: Contact component (30m)
- [ ] Task 4.2: Profile component (30m)
- [ ] Task 4.3: Home theme preference (15m)

### Phase 5: Language Switcher ✓

- [ ] Task 5.1: Create language switcher component (3-4h)
- [ ] Task 5.2: Integrate in header (30m)

### Phase 6: Translations ✓

- [ ] Task 6.1: Spanish translation (3-4h)
- [ ] Task 6.2: French translation (3-4h)

### Phase 7: Advanced Features ✓

- [ ] Task 7.1: Language-specific data strategy (2-3h)
- [ ] Task 7.2: Language persistence (1h)
- [ ] Task 7.3: Analytics tracking (30m)

### Phase 8: Testing ✓

- [ ] Task 8.1: i18n testing utilities (2h)
- [ ] Task 8.2: Translation validation script (2h)
- [ ] Task 8.3: CI/CD integration (30m)

---

## Success Criteria

### Functional Requirements

- ✅ All user-facing text uses Transloco
- ✅ Language switcher in header
- ✅ Language preference persists
- ✅ All 3 languages (en, es, fr) 100% complete
- ✅ No hardcoded strings in templates or TypeScript
- ✅ Error messages are translated
- ✅ Aria-labels are translated

### Technical Requirements

- ✅ Translation validation passes in CI
- ✅ All components have i18n tests
- ✅ No missing translation keys
- ✅ No console warnings about missing translations
- ✅ Performance: Language switching < 200ms

### Quality Requirements

- ✅ Natural-sounding translations (review with native speakers)
- ✅ Consistent terminology across languages
- ✅ Proper handling of pluralization (if needed)
- ✅ Proper handling of gender (if needed in Romance languages)
- ✅ Cultural appropriateness

---

## Estimated Timeline

**Total Effort**: 30-36 hours

**Recommended Schedule (Part-time):**

- Week 1: Phase 1 & 2 (Core + Layout) - 6-8 hours
- Week 2: Phase 3 & 4 (Components + Features) - 6-8 hours
- Week 3: Phase 5 (Language Switcher) - 4-5 hours
- Week 4: Phase 6 (Translations) - 6-8 hours
- Week 5: Phase 7 & 8 (Advanced + Testing) - 6-8 hours

**Recommended Schedule (Full-time sprint):**

- Day 1-2: Phase 1, 2, 3
- Day 3: Phase 4, 5
- Day 4: Phase 6
- Day 5: Phase 7, 8

---

## Future Enhancements

### Post-MVP Features

- [ ] Right-to-left (RTL) language support (Arabic, Hebrew)
- [ ] Date/time localization with date-fns or Luxon
- [ ] Number formatting (thousands separators, decimals)
- [ ] Currency formatting
- [ ] Pluralization rules for complex cases
- [ ] Lazy-load translation files for better performance
- [ ] Translation management service (e.g., Lokalise, Crowdin)
- [ ] Automated translation workflow
- [ ] Translation memory for consistency
- [ ] Context comments for translators

---

## Resources

### Documentation

- [Transloco Official Docs](https://ngneat.github.io/transloco/)
- [Angular i18n Best Practices](https://angular.dev/guide/i18n)
- [WCAG i18n Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/)

### Tools

- [Transloco Keys Manager](https://github.com/ngneat/transloco-keys-manager) - Extract translation keys
- [i18n Ally (VS Code)](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally) - Translation management in IDE
- [Google Translate API](https://cloud.google.com/translate) - For initial translations (review required)

### Testing

- [Transloco Testing](https://ngneat.github.io/transloco/docs/unit-testing)
- Language-specific testing with native speakers
- A11y testing with screen readers in different languages
