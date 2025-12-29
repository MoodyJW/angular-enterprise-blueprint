# 📏 Coding Standards & Best Practices

This document outlines the mandatory coding standards for the Angular Enterprise Blueprint. These standards ensure consistency, maintainability, and enterprise-grade quality across the codebase.

**Last Updated:** 2025-12-28

---

## Table of Contents

1. [TypeScript Standards](#1-typescript-standards)
2. [Angular Best Practices](#2-angular-best-practices)
3. [Component Architecture](#3-component-architecture)
4. [State Management](#4-state-management)
5. [Styling & CSS](#5-styling--css)
6. [Internationalization (i18n)](#6-internationalization-i18n)
7. [Testing Requirements](#7-testing-requirements)
8. [Accessibility (A11y)](#8-accessibility-a11y)
9. [Error Handling](#9-error-handling)
10. [Performance](#10-performance)
11. [Security](#11-security)
12. [Code Organization](#12-code-organization)
13. [Git & Version Control](#13-git--version-control)
14. [Documentation](#14-documentation)

---

## 1. TypeScript Standards

### 1.1 Strict Type Safety

**Rule:** No use of `any` type. Use strict TypeScript configuration.

```typescript
// ❌ Incorrect
function processData(data: any) {
  return data.value;
}

// ✅ Correct
interface DataObject {
  value: string;
}

function processData(data: DataObject): string {
  return data.value;
}

// ✅ Also correct (when type is uncertain)
function processUnknown(data: unknown): void {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    console.log((data as DataObject).value);
  }
}
```

**Configuration:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true
  }
}
```

### 1.2 Type Inference

**Rule:** Prefer type inference when the type is obvious. Explicit types when it improves clarity.

```typescript
// ✅ Correct - Obvious types
const count = 5; // inferred as number
const name = 'John'; // inferred as string
const items = [1, 2, 3]; // inferred as number[]

// ✅ Correct - Explicit when helpful
const config: AppConfig = loadConfig(); // Complex return type
function getUserById(id: string): Observable<User> {
  // Clear contract - prefer Observable over Promise
  return this.http.get<User>(`/users/${id}`);
}

// ❌ Incorrect - Redundant
const count: number = 5;
const name: string = 'John';
```

### 1.3 Readonly Properties

**Rule:** Use `readonly` for properties that shouldn't change after initialization.

```typescript
// ✅ Correct
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);
}

export interface User {
  readonly id: string;
  readonly email: string;
  name: string; // Can be updated
}

// Arrays and objects
const THEME_IDS: readonly string[] = ['light', 'dark'] as const;
```

### 1.4 Enums vs Union Types

**Rule:** Prefer union types and `as const` over enums.

```typescript
// ❌ Avoid enums
enum Status {
  Active,
  Inactive,
}

// ✅ Correct - Union types
type Status = 'active' | 'inactive';

// ✅ Correct - Const assertion for objects
const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];
```

### 1.5 Null vs Undefined

**Rule:** Use `null` for intentional absence, `undefined` for uninitialized values.

```typescript
// ✅ Correct
interface User {
  id: string;
  email: string;
  avatar: string | null; // Explicitly no avatar
  lastLogin?: Date; // May not be set yet
}

// Optional parameters
function greet(name?: string): string {
  return `Hello, ${name ?? 'Guest'}`;
}
```

---

## 2. Angular Best Practices

### 2.1 Standalone Components

**Rule:** Always use standalone components. Never use NgModules for new code.

```typescript
// ✅ Correct
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule], // Import dependencies directly
})
export class UserListComponent {}

// ❌ Incorrect - Don't set standalone: true (it's default in Angular 20+)
@Component({
  selector: 'app-user-list',
  standalone: true, // ❌ Remove this
  // ...
})
```

### 2.2 Signal-First Approach

**Rule:** Use signals for all reactive state. Minimize RxJS where signals suffice.

```typescript
// ✅ Correct
export class UserProfileComponent {
  // Signals for reactive state
  readonly user = signal<User | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  // Computed for derived state
  readonly displayName = computed(() => {
    const u = this.user();
    return u ? `${u.firstName} ${u.lastName}` : 'Guest';
  });

  // RxJS only when needed (HTTP, timers, complex async)
  loadUser(id: string): void {
    this.isLoading.set(true);
    this.http
      .get<User>(`/users/${id}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.user.set(user);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err.message);
          this.isLoading.set(false);
        },
      });
  }
}
```

### 2.3 Avoid Promises, Prefer RxJS

**Rule:** Use RxJS Observables instead of Promises for all asynchronous operations (except route lazy loading).

**Why:**

- Better composition with operators (map, filter, switchMap, etc.)
- Cancelation support (unsubscribe)
- Consistent error handling across the application
- Superior multi-value stream handling
- Better integration with Angular's async pipe and signals

```typescript
// ✅ Correct - Use Observable
getUserById(id: string): Observable<User> {
  return this.http.get<User>(`/users/${id}`);
}

// ✅ Correct - Convert Promise to Observable if necessary
loadExternalData(): Observable<Data> {
  return from(fetch('/api/data').then(r => r.json()));
}

// ✅ Correct - Multiple parallel requests
loadDashboardData(): Observable<DashboardData> {
  return forkJoin({
    user: this.userService.getUser(),
    stats: this.statsService.getStats(),
    notifications: this.notificationService.getRecent()
  });
}

// ❌ Incorrect - Don't use async/await
async getUserById(id: string): Promise<User> {
  return await this.http.get<User>(`/users/${id}`).toPromise(); // ❌
}

// ❌ Incorrect - Don't use .then()/.catch()
loadUser(): void {
  this.userService.getUser()
    .toPromise()  // ❌
    .then(user => this.user.set(user))
    .catch(err => this.error.set(err));
}
```

**Exception:** Route lazy loading with `import().then()` is standard Angular practice and should remain:

```typescript
// ✅ Acceptable - Standard Angular route lazy loading
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
}
```

**Migration Guide:** See `docs/PROMISE_TO_RXJS_MIGRATION_REPORT.md` for converting existing Promises to Observables.

### 2.4 Input/Output Functions

**Rule:** Use `input()` and `output()` functions instead of decorators.

```typescript
// ❌ Incorrect - Old decorator syntax
@Component({
  /* ... */
})
export class ButtonComponent {
  @Input() label!: string;
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<void>();
}

// ✅ Correct - Signal-based inputs/outputs
@Component({
  /* ... */
})
export class ButtonComponent {
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly clicked = output<void>();

  handleClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
```

### 2.5 Dependency Injection

**Rule:** Use `inject()` function instead of constructor injection.

```typescript
// ❌ Incorrect - Constructor injection
@Component({
  /* ... */
})
export class UserService {
  constructor(
    private http: HttpClient,
    private logger: LoggerService,
  ) {}
}

// ✅ Correct - inject() function
@Component({
  /* ... */
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);
  private readonly destroyRef = inject(DestroyRef);
}
```

### 2.6 OnPush Change Detection

**Rule:** All components must use `OnPush` change detection strategy.

```typescript
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ Required
})
export class UserCardComponent {}
```

### 2.7 Host Bindings

**Rule:** Use `host` metadata object instead of decorators.

```typescript
// ❌ Incorrect - Decorators
@Component({
  /* ... */
})
export class ButtonComponent {
  @HostBinding('attr.disabled') disabled = false;
  @HostListener('click') onClick() {}
}

// ✅ Correct - Host object
@Component({
  selector: 'eb-button',
  host: {
    '[attr.disabled]': 'disabled()',
    '[attr.aria-disabled]': 'disabled()',
    '[class.btn--loading]': 'loading()',
    '(click)': 'handleClick()',
  },
})
export class ButtonComponent {
  readonly disabled = input(false);
  readonly loading = input(false);
}
```

### 2.8 Template Syntax

**Rule:** Use native control flow instead of structural directives.

{% raw %}

```typescript
// ❌ Incorrect - Structural directives
<div *ngIf="user">{{ user.name }}</div>
<div *ngFor="let item of items">{{ item }}</div>
<div [ngSwitch]="status">...</div>

// ✅ Correct - Native control flow
@if (user) {
  <div>{{ user.name }}</div>
}

@for (item of items; track item.id) {
  <div>{{ item }}</div>
}

@switch (status) {
  @case ('active') { <span>Active</span> }
  @case ('inactive') { <span>Inactive</span> }
}
```

{% endraw %}

### 2.9 Template Expressions

**Rule:** No arrow functions or complex logic in templates. Do not assume globals are available.

{% raw %}

```typescript
// ❌ Incorrect - Arrow function in template
<button (click)="items.filter(i => i.active)">Filter</button>

// ❌ Incorrect - Global objects
<div>{{ new Date() }}</div> // Not supported
<div>{{ Math.round(value) }}</div> // Not supported

// ✅ Correct - Method in component
@Component({ /* ... */ })
export class ListComponent {
  readonly items = signal<Item[]>([]);

  readonly activeItems = computed(() =>
    this.items().filter(i => i.active)
  );

  readonly currentDate = computed(() => new Date());
}

// Template
<button (click)="handleFilter()">Filter</button>
<div>{{ currentDate() }}</div>
```

{% endraw %}

---

## 3. Component Architecture

### 3.1 Component Responsibility

**Rule:** Components should be small and focused on a single responsibility.

```typescript
// ✅ Correct - Single responsibility
@Component({
  selector: 'app-user-avatar',
  template: ` <img [src]="src()" [alt]="alt()" class="avatar" /> `,
})
export class UserAvatarComponent {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
}

// ❌ Incorrect - Too many responsibilities
@Component({
  selector: 'app-user-page',
  // Template with user profile, posts, comments, settings...
})
export class UserPageComponent {
  // Handles authentication, data loading, form submission, navigation...
}
```

**Guideline:** If a component template exceeds ~100 lines or has 10+ inputs, consider breaking it down.

### 3.2 Smart vs Presentational Components

**Rule:** Separate smart (container) components from presentational (dumb) components.

```typescript
// ✅ Smart Component (in features/)
@Component({
  selector: 'app-user-list-page',
  template: `
    <app-user-list
      [users]="store.users()"
      [isLoading]="store.isLoading()"
      (userSelected)="onUserSelected($event)"
    />
  `,
})
export class UserListPageComponent {
  readonly store = inject(UserStore);

  onUserSelected(user: User): void {
    this.router.navigate(['/users', user.id]);
  }
}

// ✅ Presentational Component (in shared/)
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  readonly users = input.required<User[]>();
  readonly isLoading = input(false);
  readonly userSelected = output<User>();
}
```

### 3.3 Template Location

**Rule:** Inline templates for components under 10 lines, external files otherwise.

{% raw %}

```typescript
// ✅ Correct - Inline for small components
@Component({
  selector: 'eb-badge',
  template: `
    <span class="badge badge--{{ variant() }}">
      {{ content() }}
    </span>
  `,
})
export class BadgeComponent {}

// ✅ Correct - External for larger components
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {}
```

{% endraw %}

### 3.4 Relative Paths

**Rule:** Use paths relative to the component file.

```typescript
// ✅ Correct
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})

// ❌ Incorrect - Absolute or unusual paths
@Component({
  templateUrl: '../user/user-card.component.html', // ❌
})
```

### 3.5 Forms

**Rule:** Prefer Reactive forms over Template-driven forms.

```typescript
// ✅ Correct - Reactive forms
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
})
export class UserFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });
}

// ❌ Avoid - Template-driven forms
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  template: `<input [(ngModel)]="name" />`,
})
export class UserFormComponent {}
```

---

## 4. State Management

### 4.1 SignalStore Pattern

**Rule:** Use NgRx SignalStore for all feature-level state management.

```typescript
// ✅ Correct
export const UserStore = signalStore(
  { providedIn: 'root' },

  // State
  withState({
    users: [] as User[],
    selectedId: null as string | null,
    isLoading: false,
    error: null as string | null,
  }),

  // Computed state
  withComputed((store) => ({
    selectedUser: computed(() => store.users().find((u) => u.id === store.selectedId())),
    hasUsers: computed(() => store.users().length > 0),
  })),

  // Methods
  withMethods((store, service = inject(UserService)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() => service.getUsers()),
        tapResponse({
          next: (users) => patchState(store, { users, isLoading: false }),
          error: (error: Error) =>
            patchState(store, {
              error: error.message,
              isLoading: false,
            }),
        }),
      ),
    ),

    selectUser(id: string): void {
      patchState(store, { selectedId: id });
    },
  })),
);
```

### 4.2 Component-Level State

**Rule:** Use signals for simple component-level state.

```typescript
// ✅ Correct - Simple component state
@Component({
  /* ... */
})
export class SearchComponent {
  readonly searchTerm = signal('');
  readonly isExpanded = signal(false);

  readonly hasSearchTerm = computed(() => this.searchTerm().length > 0);

  clearSearch(): void {
    this.searchTerm.set('');
  }
}
```

### 4.3 Immutability

**Rule:** Never mutate state directly. Always use `.set()` or `.update()`.

```typescript
// ❌ Incorrect - Direct mutation
const items = signal([1, 2, 3]);
items().push(4); // ❌ Mutates array
items.set(items()); // ❌ Doesn't trigger updates

// ✅ Correct - Immutable updates
const items = signal([1, 2, 3]);
items.update((current) => [...current, 4]);

// ✅ Correct - Replace entire value
items.set([1, 2, 3, 4]);
```

---

## 5. Styling & CSS

### 5.1 BEM Methodology

**Rule:** All CSS must follow BEM (Block Element Modifier) naming convention.

```scss
// ✅ Correct - BEM structure
.user-card {
  // Block
  &__header {
    // Element
  }

  &__title {
    // Element
  }

  &__avatar {
    // Element
  }

  &--featured {
    // Modifier
  }

  &--loading {
    // Modifier
  }
}

// Usage in template
<div class="user-card user-card--featured">
  <div class="user-card__header">
    <img class="user-card__avatar" />
    <h3 class="user-card__title">John Doe</h3>
  </div>
</div>

// ❌ Incorrect - No BEM
.userCard {
} // Wrong casing
.card .header {
} // Nested selectors
.user-card-featured {
} // Wrong modifier syntax
```

**BEM Rules:**

- Block: `.block-name`
- Element: `.block-name__element-name`
- Modifier: `.block-name--modifier-name` or `.block-name__element--modifier`
- Use kebab-case for multi-word names
- No nesting beyond block level in SCSS
- Elements belong to blocks, not to other elements

### 5.2 CSS Custom Properties

**Rule:** Use CSS custom properties (variables) for all theme-related values.

```scss
// ✅ Correct
.button {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
}

// ❌ Incorrect - Hard-coded values
.button {
  background-color: #2563eb; // ❌
  padding: 8px 16px; // ❌
  font-size: 14px; // ❌
}
```

**Available Variable Categories:**

- Colors: `--color-*`
- Spacing: `--space-*`
- Typography: `--font-size-*`, `--font-weight-*`
- Borders: `--border-radius-*`
- Shadows: `--shadow-*`
- Motion: `--duration-*`, `--ease-*`
- Z-index: `--z-*`

### 5.3 Class Bindings

**Rule:** Use `[class]` bindings instead of `ngClass`.

```html
<!-- ❌ Incorrect -->
<div [ngClass]="{ 'active': isActive, 'disabled': isDisabled }">
  <!-- ✅ Correct -->
  <div [class.active]="isActive()" [class.disabled]="isDisabled()"></div>
</div>
```

### 5.4 Style Bindings

**Rule:** Use `[style]` bindings instead of `ngStyle`.

```html
<!-- ❌ Incorrect -->
<div [ngStyle]="{ 'width': width + 'px', 'height': height + 'px' }">
  <!-- ✅ Correct -->
  <div [style.width.px]="width()" [style.height.px]="height()"></div>
</div>
```

### 5.5 Scoped Styles

**Rule:** Component styles are scoped by default. Avoid global selectors.

```scss
// ✅ Correct - Scoped to component
.user-card {
  padding: var(--space-4);
}

// ❌ Incorrect - Global selector
:host ::ng-deep .some-library-class {
  color: red; // Affects entire app
}

// ⚠️ Use sparingly - Only for third-party library overrides
:host ::ng-deep {
  .markdown-content {
    h1 {
      color: var(--color-text);
    }
  }
}
```

---

## 6. Internationalization (i18n)

### 6.1 Transloco Requirement

**Rule:** All user-facing text MUST use Transloco. No hardcoded strings.

{% raw %}

```typescript
// ❌ Incorrect
<button>Save Changes</button>
<p>Welcome back!</p>

// ✅ Correct
<ng-container *transloco="let t">
  <button>{{ t('common.save') }}</button>
  <p>{{ t('auth.welcomeBack') }}</p>
</ng-container>
```

{% endraw %}

### 6.2 Translation Keys

**Rule:** Use dot notation with feature/component scoping.

```json
// src/assets/i18n/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "loading": "Loading..."
  },
  "auth": {
    "login": {
      "title": "Sign In",
      "username": "Username",
      "password": "Password",
      "submit": "Log In"
    }
  },
  "users": {
    "list": {
      "title": "Users",
      "noResults": "No users found"
    }
  }
}
```

**Naming Convention:**

- Use camelCase for multi-word keys: `userNotFound`
- Group by feature: `auth.*`, `users.*`, `modules.*`
- Share common translations: `common.save`, `common.error`
- Include context in key name: `loginButton` vs just `login`

### 6.3 Interpolation

**Rule:** Use interpolation for dynamic values.

{% raw %}

```typescript
// Translation file
{
  "users": {
    "greeting": "Hello, {{ name }}!",
    "itemCount": "{{ count }} items found"
  }
}

// Template
<ng-container *transloco="let t">
  <p>{{ t('users.greeting', { name: user().name }) }}</p>
  <p>{{ t('users.itemCount', { count: items().length }) }}</p>
</ng-container>
```

{% endraw %}

### 6.4 Aria Labels

**Rule:** Aria labels must also be translated.

```html
<ng-container *transloco="let t">
  <button [attr.aria-label]="t('common.ariaLabels.close')" (click)="close()">
    <eb-icon name="x" [decorative]="true" />
  </button>
</ng-container>
```

### 6.5 TypeScript Translation

**Rule:** Use `TranslocoService` for translations in TypeScript code.

```typescript
export class NotificationService {
  private readonly transloco = inject(TranslocoService);

  showSuccess(key: string, params?: object): void {
    const message = this.transloco.translate(key, params);
    this.toastService.success(message);
  }
}
```

---

## 7. Testing Requirements

### 7.1 Test Coverage

**Rule:** Minimum 85% code coverage for all new code.

```json
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
    },
  },
});
```

### 7.2 Test Organization

**Rule:** Follow Arrange-Act-Assert (AAA) pattern.

```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch users from API', () => {
    // Arrange
    const mockUsers: User[] = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Jane' },
    ];

    // Act
    service.getUsers().subscribe((users) => {
      // Assert
      expect(users).toEqual(mockUsers);
    });

    // Assert HTTP request
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
```

### 7.3 Test Naming

**Rule:** Use descriptive test names that explain what is being tested.

```typescript
// ✅ Correct - Descriptive
it('should display error message when login fails', () => {});
it('should disable submit button when form is invalid', () => {});
it('should navigate to dashboard after successful login', () => {});

// ❌ Incorrect - Vague
it('should work', () => {});
it('test login', () => {});
it('handles errors', () => {});
```

### 7.4 Test Independence

**Rule:** Each test must be independent and not rely on other tests.

```typescript
// ✅ Correct - Independent
describe('CounterComponent', () => {
  let component: CounterComponent;

  beforeEach(() => {
    component = new CounterComponent();
  });

  it('should start at zero', () => {
    expect(component.count()).toBe(0);
  });

  it('should increment count', () => {
    component.increment();
    expect(component.count()).toBe(1);
  });
});

// ❌ Incorrect - Dependent tests
describe('CounterComponent', () => {
  let component: CounterComponent;

  beforeEach(() => {
    component = new CounterComponent();
  });

  it('should start at zero', () => {
    expect(component.count()).toBe(0);
  });

  it('should increment count', () => {
    component.increment(); // Depends on previous test state
    expect(component.count()).toBe(1); // Will fail if run in isolation
  });
});
```

### 7.5 Mock Services

**Rule:** Mock external dependencies in unit tests.

```typescript
describe('UserComponent', () => {
  let component: UserComponent;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUser']);
    mockUserService.getUser.and.returnValue(of(mockUser));

    TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [{ provide: UserService, useValue: mockUserService }],
    });

    const fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  it('should load user on init', () => {
    component.ngOnInit();
    expect(mockUserService.getUser).toHaveBeenCalled();
  });
});
```

---

## 8. Accessibility (A11y)

### 8.1 WCAG AA Compliance

**Rule:** All components must meet WCAG 2.1 AA standards.

**Required:**

- Color contrast ratio ≥ 4.5:1 for normal text
- Color contrast ratio ≥ 3:1 for large text (18pt+)
- Keyboard navigation for all interactive elements
- Focus indicators visible on all focusable elements
- Semantic HTML elements
- Proper ARIA attributes

### 8.2 Semantic HTML

**Rule:** Use semantic HTML elements instead of generic divs/spans.

```html
<!-- ❌ Incorrect -->
<div class="header">
  <div class="nav">
    <span onclick="navigate()">Home</span>
  </div>
</div>

<!-- ✅ Correct -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
```

### 8.3 ARIA Labels

**Rule:** Provide ARIA labels for icons and interactive elements without visible text.

```html
<!-- ✅ Correct -->
<button type="button" [attr.aria-label]="t('common.ariaLabels.close')" (click)="close()">
  <eb-icon name="x" [decorative]="true" />
</button>

<eb-icon name="info" [attr.aria-label]="t('common.ariaLabels.info')" />

<!-- Decorative icons -->
<eb-icon name="logo" [decorative]="true" aria-hidden="true" />
```

### 8.4 Keyboard Navigation

**Rule:** All interactive elements must be keyboard accessible.

```typescript
@Component({
  selector: 'app-dropdown',
  host: {
    '(keydown.escape)': 'close()',
    '(keydown.enter)': 'selectCurrent()',
    '(keydown.arrowDown)': 'navigateDown($event)',
    '(keydown.arrowUp)': 'navigateUp($event)',
    '[attr.role]': '"listbox"',
    '[attr.aria-expanded]': 'isOpen()',
  },
})
export class DropdownComponent {
  // Keyboard navigation implementation
}
```

### 8.5 Focus Management

**Rule:** Manage focus for modals, drawers, and dynamic content.

```typescript
export class ModalComponent implements AfterViewInit {
  private readonly elementRef = inject(ElementRef);

  ngAfterViewInit(): void {
    // Trap focus within modal
    this.trapFocus();

    // Focus first focusable element
    const firstFocusable = this.getFirstFocusableElement();
    firstFocusable?.focus();
  }

  private trapFocus(): void {
    // Implementation to trap focus within modal
  }
}
```

### 8.6 Skip Links

**Rule:** Provide skip links for keyboard users.

```html
<!-- At top of app.component.html -->
<a href="#main-content" class="skip-link"> Skip to main content </a>

<!-- Main content area -->
<main id="main-content" tabindex="-1">
  <!-- Page content -->
</main>
```

---

## 9. Error Handling

### 9.1 Global Error Handler

**Rule:** All errors must be caught and logged via `GlobalErrorHandler`.

```typescript
// Already configured in app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // ...
  ],
};
```

### 9.2 HTTP Error Handling

**Rule:** HTTP errors are intercepted globally. Component-level handling only for specific cases.

```typescript
// ✅ Correct - Let interceptor handle
loadUsers(): void {
  this.userService.getUsers().subscribe({
    next: users => this.users.set(users),
    // Error handled by HTTP interceptor
  });
}

// ✅ Also correct - Custom handling for specific case
loadUsers(): void {
  this.userService.getUsers().subscribe({
    next: users => this.users.set(users),
    error: err => {
      // Custom error handling for this specific case
      this.showCustomErrorUI(err);
    },
  });
}
```

### 9.3 Error Messages

**Rule:** Error messages must be user-friendly and translated.

```typescript
// ❌ Incorrect
throw new Error('DB_CONNECTION_FAILED');

// ✅ Correct
const message = this.transloco.translate('errors.connectionFailed');
throw new Error(message);

// ✅ Better - Use error types
throw new AppError({
  message: this.transloco.translate('errors.connectionFailed'),
  code: 'DB_CONNECTION_FAILED',
  severity: 'error',
});
```

### 9.4 Try-Catch Usage

**Rule:** Use try-catch only for synchronous code that might throw.

```typescript
// ✅ Correct - Synchronous code
parseUserData(data: string): User {
  try {
    return JSON.parse(data);
  } catch (error) {
    this.logger.error('Failed to parse user data', error);
    throw new Error('Invalid user data format');
  }
}

// ❌ Incorrect - Don't catch observable errors with try-catch
loadUsers(): void {
  try {
    this.http.get('/users').subscribe(/*...*/); // ❌
  } catch (error) {
    // This won't catch HTTP errors!
  }
}
```

---

## 10. Performance

### 10.1 Change Detection

**Rule:** Use `OnPush` and signals to minimize change detection cycles.

```typescript
// ✅ Correct - Already enforced by ChangeDetectionStrategy.OnPush
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  readonly users = input.required<User[]>();

  // Computed values are memoized
  readonly activeUsers = computed(() => this.users().filter((u) => u.isActive));
}
```

### 10.2 TrackBy Functions

**Rule:** Always use `track` in `@for` loops.

{% raw %}

```html
<!-- ❌ Incorrect - No track -->
@for (user of users(); track $index) {
<app-user-card [user]="user" />
}

<!-- ✅ Correct - Track by unique ID -->
@for (user of users(); track user.id) {
<app-user-card [user]="user" />
}

<!-- ⚠️ Acceptable - Track by index only if data is static -->
@for (item of staticList; track $index) {
<div>{{ item }}</div>
}
```

{% endraw %}

### 10.3 Lazy Loading

**Rule:** All feature routes must be lazy-loaded.

```typescript
// ✅ Correct
export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./features/users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
];

// ❌ Incorrect - Eager loading
import { UsersComponent } from './features/users/users.component';

export const routes: Routes = [
  { path: 'users', component: UsersComponent }, // ❌
];
```

### 10.4 Image Optimization

**Rule:** Use `NgOptimizedImage` directive for all static images.

```html
<!-- ❌ Incorrect -->
<img src="/assets/hero.jpg" alt="Hero image" />

<!-- ✅ Correct -->
<img ngSrc="/assets/hero.jpg" alt="Hero image" width="1200" height="600" priority />

<!-- Note: NgOptimizedImage doesn't work with base64 images -->
```

### 10.5 Subscription Management

**Rule:** Unsubscribe from observables to prevent memory leaks.

```typescript
// ✅ Correct - takeUntilDestroyed
export class UserComponent {
  private readonly destroyRef = inject(DestroyRef);

  loadUsers(): void {
    this.http.get<User[]>('/users')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => this.users.set(users));
  }
}

// ✅ Also correct - SignalStore with rxMethod
export const UserStore = signalStore(
  withMethods((store, http = inject(HttpClient)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        switchMap(() => http.get<User[]>('/users')),
        tapResponse({
          next: users => patchState(store, { users }),
          error: err => patchState(store, { error: err.message }),
        })
      )
    ),
  }))
);

// ❌ Incorrect - Unmanaged subscription
loadUsers(): void {
  this.http.get<User[]>('/users')
    .subscribe(users => this.users.set(users)); // Memory leak!
}
```

---

## 11. Security

### 11.1 XSS Prevention

**Rule:** Never use `innerHTML` with untrusted content. Sanitize if necessary.

{% raw %}

```typescript
// ❌ Incorrect - XSS vulnerability
<div [innerHTML]="userContent"></div>

// ✅ Correct - Sanitized
export class ContentComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly userContent = input.required<string>();

  readonly sanitizedContent = computed(() =>
    this.sanitizer.sanitize(SecurityContext.HTML, this.userContent())
  );
}

<div [innerHTML]="sanitizedContent()"></div>

// ✅ Better - Use text binding
<div>{{ userContent() }}</div>
```

{% endraw %}

### 11.2 Authentication Guards

**Rule:** Protect routes with authentication guards.

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component'),
    canActivate: [authGuard], // ✅ Required
  },
];
```

### 11.3 Environment Secrets

**Rule:** Never commit secrets or API keys to version control.

```typescript
// ❌ Incorrect - Hardcoded API key
const API_KEY = 'sk_live_abc123';

// ✅ Correct - Environment variable
export const environment = {
  apiKey: process.env['API_KEY'] ?? '',
};

// .gitignore must include
.env
.env.local
environment.local.ts
```

### 11.4 HTTP Security

**Rule:** Use HTTPS for all external requests.

```typescript
// ✅ Correct
this.http.get('https://api.example.com/data');

// ❌ Incorrect
this.http.get('http://api.example.com/data');
```

---

## 12. Code Organization

### 12.1 Folder Structure

**Rule:** Follow the established folder structure.

```
src/app/
├── core/           # Singletons (services, guards, interceptors)
├── features/       # Smart components (routed pages)
├── shared/         # Reusable components, directives, pipes
└── app.config.ts   # Application configuration
```

### 12.2 Import Organization

**Rule:** Use path aliases for imports. Always use barrel exports when they exist.

```typescript
// ✅ Correct - Path aliases with barrel exports
import { ButtonComponent } from '@shared/components/button';
import { CardComponent } from '@shared/components/card';
import { LoggerService } from '@core/services/logger';
import { ENVIRONMENT } from '@core/config';
import { environment } from '@environments/environment';

// ❌ Incorrect - Relative imports
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LoggerService } from '../../../core/services/logger/logger.service';

// ❌ Incorrect - Bypassing barrel exports
import { ButtonComponent } from '@shared/components/button/button.component';
```

**Available Path Aliases:**

- `@app/*` - General app directory
- `@core/*` - Core functionality
- `@core/services/*` - Core services
- `@core/config/*` - Configuration
- `@core/auth/*` - Authentication
- `@shared/*` - Shared resources
- `@shared/components/*` - Shared components
- `@shared/services/*` - Shared services
- `@shared/utilities/*` - Utility functions
- `@shared/constants/*` - Constants
- `@features/*` - Feature modules
- `@environments/*` - Environment files

**When to Use Relative Imports:**

- Same-directory component children: `./button-icon/button-icon.component`
- Feature-local state: `./state/feature.store`
- Closely coupled files in the same module

### 12.3 Layer Dependencies

**Rule:** Strict layering enforced by `eslint-plugin-boundaries`.

**Allowed imports:**

- Features → Core ✅
- Features → Shared ✅
- Core → Shared ✅
- Features → Features ❌ (Prohibited!)
- Shared → Core ❌ (Prohibited!)
- Shared → Features ❌ (Prohibited!)

### 12.4 Barrel Exports

**Rule:** Use index.ts barrel exports for cleaner imports. Always import from barrel exports when they exist.

```typescript
// shared/components/button/index.ts
export * from './button.component';

// ✅ Correct - Import from barrel export
import { ButtonComponent } from '@shared/components/button';

// ❌ Incorrect - Bypass barrel export
import { ButtonComponent } from '@shared/components/button/button.component';
```

### 12.5 File Naming

**Rule:** Use kebab-case for file names.

```
✅ Correct:
user-list.component.ts
user-list.component.html
user-list.component.scss
user-list.component.spec.ts

❌ Incorrect:
UserList.component.ts
userList.component.ts
user_list.component.ts
```

---

## 13. Git & Version Control

### 13.1 Conventional Commits

**Rule:** All commits must follow Conventional Commits specification.

**Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples:**

```bash
✅ Correct:
feat(auth): add password reset functionality
fix(user-list): resolve infinite scroll bug
docs(readme): update installation instructions
refactor(theme): migrate to CSS custom properties

❌ Incorrect:
updated stuff
fixed bug
WIP
asdf
```

### 13.2 Commit Scope

**Rule:** Use feature/component name as scope.

```bash
feat(auth): implement OAuth login
feat(user): add user profile component
fix(dashboard): resolve chart rendering issue
test(button): add accessibility tests
```

### 13.3 Commit Message Guidelines

- Subject line max 72 characters
- Use imperative mood ("add" not "added")
- No period at the end of subject
- Body wraps at 72 characters
- Reference issues in footer

```bash
feat(analytics): add Google Analytics integration

Implemented GA4 tracking with strategy pattern allowing
for easy swapping between providers. Includes automatic
page view tracking via router integration.

Closes #123
```

### 13.4 Branch Naming

**Rule:** Use descriptive branch names with type prefix.

```bash
✅ Correct:
feat/oauth-login
fix/header-navigation
docs/api-documentation
refactor/theme-system

❌ Incorrect:
new-feature
bugfix
my-branch
dev
```

---

## 14. Documentation

### 14.1 Component Documentation

**Rule:** All public components must have JSDoc comments.

````typescript
/**
 * A reusable button component with multiple variants and states.
 *
 * @example
 * ```html
 * <eb-button
 *   variant="primary"
 *   [loading]="isLoading()"
 *   (clicked)="handleClick()"
 * >
 *   Save Changes
 * </eb-button>
 * ```
 */
@Component({
  selector: 'eb-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  /** The visual style variant of the button */
  readonly variant = input<'primary' | 'secondary' | 'ghost'>('primary');

  /** Whether the button shows a loading spinner */
  readonly loading = input(false);

  /** Emitted when the button is clicked */
  readonly clicked = output<void>();
}
````

### 14.2 Service Documentation

**Rule:** Document public methods with JSDoc.

```typescript
/**
 * Service for managing user data and operations.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  /**
   * Fetches all users from the API.
   *
   * @returns Observable of user array
   * @throws {HttpError} When the API request fails
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  /**
   * Updates a user's profile information.
   *
   * @param id - The user ID
   * @param updates - Partial user data to update
   * @returns Observable of the updated user
   */
  updateUser(id: string, updates: Partial<User>): Observable<User> {
    return this.http.patch<User>(`/api/users/${id}`, updates);
  }
}
```

### 14.3 README per Feature

**Rule:** Each feature module must have a README.md.

```markdown
# Feature Name

## Purpose

Brief description of what this feature does.

## Components

- `FeatureComponent` - Main container component
- `FeatureListComponent` - Lists items
- `FeatureDetailComponent` - Shows item details

## State Management

- `FeatureStore` - SignalStore managing feature state

## Routes

- `/feature` - List view
- `/feature/:id` - Detail view

## Dependencies

- Shared components: Button, Card, Input
- Core services: AuthService, AnalyticsService
```

### 14.4 ADR Documentation

**Rule:** Document architectural decisions in ADRs.

See `docs/specs/adr-roadmap.md` for the list of ADRs to create.

**When to create an ADR:**

- Choosing between architectural patterns
- Technology selection decisions
- Breaking changes to existing architecture
- Significant refactoring decisions

---

## Enforcement

### Automated Checks

These standards are enforced via:

1. **ESLint** - Code quality and style
2. **Prettier** - Code formatting
3. **Commitlint** - Commit message format
4. **Husky** - Pre-commit and commit-msg hooks
5. **ESLint Boundaries** - Layer dependency rules
6. **Vitest** - Test coverage thresholds
7. **CI/CD Pipeline** - All checks must pass

### Pre-commit Hooks

```bash
# .husky/pre-commit
npm run lint-staged

# .husky/commit-msg
npm run commitlint
```

### CI Pipeline

All PRs must pass:

- ✅ Linting (`npm run lint`)
- ✅ Type checking (`npm run type-check`)
- ✅ Tests (`npm test`)
- ✅ Build (`npm run build`)
- ✅ E2E tests (`npm run e2e`)

---

## Exceptions

### When to Break Rules

Rules may be broken only when:

1. **Performance Critical** - Documented with comment and benchmark
2. **Third-Party Limitation** - External library requirement
3. **Technical Debt** - Tracked in issue with timeline to fix

**Example:**

```typescript
// TODO: Remove ::ng-deep after migrating from legacy library
// Issue: #456
// Timeline: Sprint 23
:host ::ng-deep .legacy-component {
  color: var(--color-primary);
}
```

---

## Resources

- [Angular Style Guide](https://angular.dev/style-guide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [BEM Methodology](https://getbem.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [NgRx SignalStore](https://ngrx.io/guide/signals)

---

## Questions or Clarifications?

For questions about these standards:

1. Check existing code for examples
2. Review relevant ADRs
3. Ask in team discussion
4. Propose standard update via PR

**Last Updated:** 2025-12-28
