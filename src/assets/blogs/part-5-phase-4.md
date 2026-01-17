# Phase 4: The Application Shell

## Building the Frame That Holds Everything Together

In the previous articles, I covered tooling and governance (Phase 1), core architecture with authentication and services (Phase 2), and the design system with its 24 accessible components (Phase 3). With nearly 2,000 passing tests and a complete visual vocabulary established, Phase 4 shifts focus to what users interact with first: the application shell.

The shell is deceptively simple—it's just a header, footer, and the space between them where content appears. But that simplicity masks important decisions about navigation architecture, responsive behavior, state integration, and the routing configuration that ties everything together. Done poorly, the shell becomes a source of ongoing frustration. Done well, it fades into the background while users focus on content.

This phase builds the frame that holds all future features: a responsive layout with mobile navigation, lazy-loaded routes for optimal performance, and deep integration with the authentication and theming infrastructure from earlier phases. The result is a production-ready foundation where adding new pages requires minimal configuration.

## The Main Layout: Architecture of a Shell

The application shell follows a classic structure that users expect: a header fixed at the top, main content that scrolls, and a footer at the bottom. What makes this implementation enterprise-grade is what happens behind that familiar structure.

The layout lives in [`MainLayoutComponent`](src/app/core/layout/main-layout/main-layout.component.ts), which orchestrates three responsibilities:

1. **Composition**: Combining the header, footer, and router outlet into a coherent layout
2. **Mobile navigation**: Managing the off-canvas navigation drawer for smaller viewports
3. **Route awareness**: Responding to navigation events to close mobile menus automatically

```typescript
@Component({
  selector: 'eb-main-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  readonly isMenuOpen = signal<boolean>(false);
  readonly navItems = NAV_ITEMS;

  ngOnInit(): void {
    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => {
        this.closeMenu();
      });
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
```

Several patterns emerge from this implementation:

**Signal-based state management**: The `isMenuOpen` signal controls the mobile navigation drawer. This is intentionally local state—it doesn't need to be shared across the application. Using a signal keeps the implementation simple while maintaining reactivity.

**Router event subscription with cleanup**: The component subscribes to router events to detect navigation. When a `NavigationEnd` event fires, the mobile menu closes automatically. This prevents the frustrating experience of navigating to a new page while the menu remains open. The `takeUntilDestroyed` operator ensures proper cleanup when the component is destroyed.

**Data-driven navigation**: Rather than hardcoding navigation links in the template, the component references `NAV_ITEMS`—a typed constant that defines the navigation structure. This separation makes it easy to modify navigation without touching component code.

### The Navigation Data Structure

The navigation configuration lives in [`navigation.data.ts`](src/app/core/layout/navigation.data.ts):

```typescript
export interface NavItem {
  label: string;
  route: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Dashboard', route: '/' },
  { label: 'Modules', route: '/modules' },
  { label: 'Architecture', route: '/architecture' },
  { label: 'The Architect', route: '/profile' },
] as const;
```

This approach offers several advantages over hardcoded navigation:

1. **Type safety**: The interface ensures all navigation items have required properties
2. **Single source of truth**: Both desktop and mobile navigation reference the same data
3. **Extensibility**: Adding new sections requires only adding items to the array
4. **Testability**: Navigation structure can be verified in unit tests

The `as const` assertion creates a readonly tuple type, preventing accidental mutations and enabling more precise type inference when needed.

## The Header: Where Everything Connects

The [`HeaderComponent`](src/app/core/layout/header/header.component.ts) is the most complex piece of the shell because it integrates multiple concerns: branding, navigation, theming, authentication state, and mobile responsiveness.

```typescript
@Component({
  selector: 'eb-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ThemePickerComponent, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly _authStore = inject(AuthStore);

  readonly toggleMenu = output();
  readonly navItems = NAV_ITEMS;

  readonly user = this._authStore.user;
  readonly isAuthenticated = this._authStore.isAuthenticated;
  readonly displayName = this._authStore.displayName;
  readonly isLoading = this._authStore.isLoading;

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }

  onLogout(): void {
    this._authStore.logout(undefined);
  }
}
```

The header demonstrates how Phase 2's architecture pays dividends. By injecting the `AuthStore`, the header gains direct access to authentication state through signals. There's no complex subscription management—the template simply binds to these signals:

```html
@if (isAuthenticated()) {
<div class="header__user">
  <span class="header__user-name">{{ displayName() }}</span>
  <eb-button
    variant="ghost"
    size="sm"
    ariaLabel="Logout from your account"
    (click)="onLogout()"
    [disabled]="isLoading()"
  >
    Logout
  </eb-button>
</div>
} @else {
<eb-button variant="primary" size="sm" ariaLabel="Login to your account" routerLink="/auth/login">
  Login
</eb-button>
}
```

When the authentication state changes—whether through login, logout, or session restoration—the header updates automatically. No manual change detection triggers, no subscription callbacks. The signal-based architecture handles everything.

### Theme Picker Integration

The header integrates the `ThemePickerComponent` from Phase 3:

```html
<eb-theme-picker variant="dropdown" size="sm" />
```

This single line gives users access to all six themes. The theme picker handles persistence (via `ThemeService`), smooth transitions, and keyboard accessibility. The header doesn't need to know any of those details—it simply includes the component.

This is the design system's value proposition in action. Complex functionality (theme selection with preview, persistence, smooth transitions, keyboard navigation) is encapsulated in a component that's trivial to consume.

### Responsive Navigation

Desktop navigation displays as horizontal links. On mobile viewports, those links hide behind a hamburger menu button:

```html
<button
  type="button"
  class="header__menu-toggle"
  (click)="onToggleMenu()"
  aria-label="Toggle mobile menu"
  [attr.aria-expanded]="false"
>
  <svg
    class="header__menu-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
</button>
```

The button emits a `toggleMenu` event that the parent `MainLayoutComponent` handles. This inversion of control keeps the header focused on presentation while the layout component manages the drawer state.

### Sticky Positioning with Backdrop Blur

Modern interfaces often keep headers visible during scroll. The header uses CSS `position: sticky` combined with `backdrop-filter: blur()` for a glass-like effect:

```scss
.header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background-color: var(--color-surface);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);

  @supports not (backdrop-filter: blur(12px)) {
    background-color: var(--color-surface);
  }
}
```

The `@supports` rule provides a fallback for browsers without backdrop filter support. Rather than a broken visual, users see a solid background—not as elegant, but fully functional.

## The Mobile Navigation Drawer

When the hamburger menu is clicked, an off-canvas drawer slides in from the right. This pattern is familiar to mobile users and provides ample space for navigation links, even on small screens.

```html
@if (isMenuOpen()) {
<!-- Overlay -->
<div class="mobile-nav-overlay" (click)="closeMenu()" role="presentation"></div>

<!-- Drawer -->
<nav class="mobile-nav" aria-label="Mobile navigation">
  <ul class="mobile-nav__list">
    @for (item of navItems; track item.route) {
    <li class="mobile-nav__item">
      <a [routerLink]="item.route" class="mobile-nav__link" (click)="onMobileNavClick()">
        {{ item.label }}
      </a>
    </li>
    }
  </ul>
</nav>
}
```

The drawer uses CSS animations for smooth entry:

```scss
.mobile-nav {
  position: fixed;
  top: 0;
  right: 0;
  z-index: var(--z-modal);
  width: min(280px, 80vw);
  height: 100dvh;
  background-color: var(--color-surface);
  animation: slideInRight var(--duration-normal) ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
```

The `100dvh` unit (dynamic viewport height) handles mobile browsers where the viewport height changes as the URL bar appears and disappears. This prevents the drawer from being cut off on mobile Safari and similar browsers with dynamic UI elements.

The overlay uses `backdrop-filter: blur(4px)` to subtly blur the content behind it, drawing focus to the navigation drawer. Clicking the overlay closes the menu—an expected behavior that users understand intuitively.

## The Footer: Simple but Complete

The [`FooterComponent`](src/app/core/layout/footer/footer.component.ts) demonstrates that even simple components benefit from Angular signals:

```typescript
@Component({
  selector: 'eb-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly currentYear = computed(() => new Date().getFullYear());
  readonly githubUrl = 'https://github.com/MoodyJW/angular-enterprise-blueprint';
  readonly angularVersion = '21';
}
```

The `currentYear` is a computed signal—technically overkill for a value that won't change during a session, but it demonstrates the pattern of deriving display values from data rather than hardcoding them.

The footer displays three elements common to enterprise applications: copyright with dynamic year, a link to the source repository, and a technology badge indicating the Angular version:

```html
<footer class="footer">
  <div class="footer__container">
    <div class="footer__content">
      <p class="footer__copyright">© {{ currentYear() }} Enterprise Blueprint</p>
      <div class="footer__links">
        <a [href]="githubUrl" target="_blank" rel="noopener noreferrer" class="footer__link">
          <svg class="footer__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <!-- GitHub icon path -->
          </svg>
          View Source
        </a>
        <span class="footer__badge">
          <span class="footer__badge-text"> Built with Angular v{{ angularVersion }} </span>
        </span>
      </div>
    </div>
  </div>
</footer>
```

## Routing Configuration: Lazy Loading Everything

The routing configuration in [`app.routes.ts`](src/app/app.routes.ts) uses lazy loading for all feature routes:

```typescript
export const routes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    loadComponent: () => import('./features/home').then((m) => m.HomeComponent),
  },
  {
    path: 'modules',
    title: 'Reference Modules',
    loadComponent: () => import('./features/modules').then((m) => m.ModulesComponent),
  },
  {
    path: 'architecture',
    title: 'Architecture',
    loadComponent: () => import('./features/architecture').then((m) => m.ArchitectureComponent),
  },
  {
    path: 'profile',
    title: 'The Architect',
    loadComponent: () => import('./features/profile').then((m) => m.ProfileComponent),
  },
  {
    path: 'contact',
    title: 'Contact',
    loadComponent: () => import('./features/contact').then((m) => m.ContactComponent),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth').then((m) => m.authRoutes),
  },
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () =>
      import('@shared/components/page-not-found').then((m) => m.PageNotFoundComponent),
  },
];
```

Several patterns make this configuration enterprise-ready:

**Lazy loading with `loadComponent`**: Each route loads its component asynchronously. The main bundle contains only the shell—feature code downloads on demand. This dramatically improves initial load time.

**Route titles**: Angular's `title` property sets the document title automatically when navigating. No need for a custom title service or manual updates in each component.

**Child routes with `loadChildren`**: The auth feature uses `loadChildren` to load an entire routing module. This enables nested routes within the auth feature (login, register, forgot password) while keeping the auth code in a separate bundle.

**Wildcard fallback**: The `**` route catches any URL that doesn't match a defined route, displaying a user-friendly 404 page instead of a blank screen or error.

### Router Configuration

The router is configured with several features in [`app.config.ts`](src/app/app.config.ts):

```typescript
provideRouter(
  routes,
  withPreloading(PreloadAllModules),
  withInMemoryScrolling({
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  }),
  withViewTransitions(),
);
```

**Preloading**: `PreloadAllModules` loads lazy routes in the background after the initial render. Users experience fast initial loads, and subsequent navigation is instant because code is already cached.

**Scroll restoration**: `scrollPositionRestoration: 'enabled'` restores scroll position when navigating back. Without this, hitting the back button would leave users at whatever position the new page rendered—a jarring experience.

**View transitions**: Angular 17+ supports the View Transitions API for smooth animated transitions between routes. On supported browsers, navigation includes subtle fade effects. On older browsers, navigation works normally—the enhancement is progressive.

## Feature Placeholder Components

Phase 4 creates placeholder components for all features defined in the navigation. These aren't full implementations—Phase 5 handles that—but they establish the file structure and routing:

```
src/app/features/
├── home/
│   ├── home.component.ts
│   ├── home.component.html
│   ├── home.component.scss
│   └── index.ts
├── modules/
├── architecture/
├── profile/
├── contact/
└── auth/
    ├── login/
    ├── auth.routes.ts
    └── index.ts
```

Each placeholder renders a styled container with descriptive text indicating what will be built:

```html
<section class="modules">
  <div class="modules__container">
    <header class="modules__header">
      <h1 class="modules__title">Reference Modules</h1>
      <p class="modules__subtitle">
        Explore the building blocks of enterprise Angular applications
      </p>
    </header>
    <div class="modules__content">
      <div class="modules__placeholder">
        <span class="modules__placeholder-icon">📦</span>
        <h2 class="modules__placeholder-title">Coming in Phase 5</h2>
        <p class="modules__placeholder-text">This page will showcase reusable module patterns...</p>
      </div>
    </div>
  </div>
</section>
```

The placeholders use the shared SCSS mixins from Phase 3, ensuring consistent styling across all feature pages. When Phase 5 replaces these placeholders with real implementations, the page structure remains the same.

### The Auth Routes with Guards

The auth feature demonstrates child routing with guards:

```typescript
export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    title: 'Login',
    canActivate: [guestGuard],
    loadComponent: () => import('./login').then((m) => m.LoginComponent),
  },
];
```

The `guestGuard` prevents authenticated users from accessing the login page—they're already logged in, so they're redirected to the dashboard. This guard was implemented in Phase 2 and integrates seamlessly here.

## The 404 Page: Handling the Unknown

The [`PageNotFoundComponent`](src/app/shared/components/page-not-found/page-not-found.component.ts) catches any route that doesn't exist. Rather than a generic error message, it provides a branded experience with clear navigation:

```html
<div class="page-not-found">
  <div class="page-not-found__container">
    <span class="page-not-found__code">404</span>
    <h1 class="page-not-found__title">Page Not Found</h1>
    <p class="page-not-found__message">
      Sorry, the page you're looking for doesn't exist or has been moved.
    </p>
    <eb-button variant="primary" ariaLabel="Navigate to dashboard" routerLink="/">
      Go to Dashboard
    </eb-button>
  </div>
</div>
```

The "404" text uses a CSS gradient for visual interest:

```scss
&__code {
  font-size: clamp(6rem, 20vw, 10rem);
  font-weight: var(--font-weight-bold);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

The `clamp()` function makes the "404" responsive—large on desktop, appropriately sized on mobile—without media queries.

## Integration: Connecting the Pieces

The final step integrates everything into the root component. [`app.ts`](src/app/app.ts) becomes remarkably simple:

```typescript
@Component({
  selector: 'eb-root',
  standalone: true,
  imports: [MainLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
```

And the template:

```html
<eb-main-layout />
```

This simplicity is the goal of good architecture. The complexity lives in clearly-defined components with single responsibilities. The root component's job is merely to bootstrap the shell—everything else is delegated.

## Testing the Shell

Phase 4 adds 32 new unit tests for the layout components. The tests verify rendering, interaction, and integration:

```typescript
describe('MainLayoutComponent', () => {
  it('should create');

  describe('isMenuOpen', () => {
    it('should start with menu closed');
    it('should toggle menu open');
    it('should toggle menu closed');
  });

  describe('template rendering', () => {
    it('should render the header component');
    it('should render the footer component');
    it('should render router outlet');
    it('should add mobile-menu-open class when menu is open');
    it('should show mobile nav overlay when menu is open');
  });
});
```

The test setup requires mocking `window.matchMedia` for the `ThemeService` dependency:

```typescript
beforeEach(async () => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('dark') ? false : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );

  const mockAuthStore = {
    user: signal(null),
    isAuthenticated: signal(false),
    displayName: signal('Guest'),
    logout: vi.fn(),
  };

  await TestBed.configureTestingModule({
    imports: [MainLayoutComponent],
    providers: [provideRouter([]), { provide: AuthStore, useValue: mockAuthStore }],
  }).compileComponents();
});
```

This pattern—mocking browser APIs and services—enables testing components that have deep dependency trees. The header depends on `ThemeService`, which depends on `matchMedia`. By stubbing at the browser API level, all dependent services work correctly.

## Lessons Learned

Building the application shell reinforced several principles:

**Composition over complexity.** The shell consists of simple components composed together. The `MainLayoutComponent` doesn't handle navigation logic—it delegates to `HeaderComponent`. The header doesn't handle theme switching—it includes `ThemePickerComponent`. Each component does one thing well.

**Signals simplify state flow.** The `isMenuOpen` signal in `MainLayoutComponent` and the authentication signals from `AuthStore` demonstrate how signals eliminate boilerplate. No subscription management, no async pipes, no manual change detection.

**CSS custom properties enable theming.** Every color, spacing value, and border radius in the shell comes from CSS custom properties. When themes change, the shell updates automatically. No component code needs to know about theming.

**Accessibility requires intentional effort.** Every interactive element has ARIA labels. Keyboard navigation works throughout. Focus management in the mobile menu follows expected patterns. These details don't happen by accident—they require deliberate implementation.

## What's Next

With Phase 4 complete, the application has a professional shell ready for content. The header, footer, and responsive navigation are production-ready. Routes are configured with lazy loading and preloading for optimal performance. Placeholder components establish the file structure for all features.

Phase 5 will replace those placeholders with real implementations. The dashboard will display system status and build information. The "Reference Modules" page will showcase the component library. The "Architecture" section will render the ADRs (Architecture Decision Records) that document technical choices. The profile page will introduce "The Architect"—the persona behind the portfolio. And the contact form will demonstrate form handling with validation.

Every feature will leverage the foundation built across Phases 1-4: strict typing from Phase 1's tooling, core services from Phase 2, design system components from Phase 3, and the shell structure from Phase 4. The value of that foundation becomes clear when features can focus entirely on business logic, with infrastructure concerns already solved.

You can explore the complete Phase 4 implementation on GitHub: [MoodyJW/angular-enterprise-blueprint](https://github.com/MoodyJW/angular-enterprise-blueprint)

---

_Next in series: Phase 5 Deep Dive – Building the Features_
