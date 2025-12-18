# 🐚 Phase 4: Application Shell & Routing Specifications

**Objective:** Construct the application frame. This includes the global layout strategies, responsive navigation, and the high-level routing configuration that acts as the "spine" of the application.
**Principle:** The Shell manages _where_ the user is. It connects the `AuthStore` (Phase 2) to the `UI Components` (Phase 3) to create the user experience.

---

## 4.1 Routing Architecture

We use **Standalone Route Config** with strict lazy loading. No Eager loading for features.

### **1. Top-Level Routes (`app.routes.ts`)**

Define the primary paths. Use `loadComponent` for single pages and `loadChildren` for feature slices.

| Path            | Component/Module        | Guard        | Description               |
| :-------------- | :---------------------- | :----------- | :------------------------ |
| `/`             | `features/home`         | -            | Dashboard / System Status |
| `/modules`      | `features/modules`      | -            | Reference Modules Catalog |
| `/architecture` | `features/architecture` | -            | ADR Documentation Viewer  |
| `/profile`      | `features/profile`      | -            | The Architect (Bio)       |
| `/contact`      | `features/contact`      | -            | Lead Gen Form             |
| `/auth`         | `features/auth`         | `guestGuard` | Login / Register          |
| `**`            | `PageNotFoundComponent` | -            | 404 Fallback              |

### **2. Router Configuration (`app.config.ts`)**

- **Preloading:** `withPreloading(PreloadAllModules)`. (Since it's a portfolio, we want fast transitions once loaded).
- **Scroll Position:** `withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })`.
- **View Transitions:** `withViewTransitions()` (Angular 17+ native animations).

---

## 4.2 Main Layout Strategy

We need a layout that persists headers/footers while the router outlet changes.

### **1. MainLayoutComponent** (`core/layout/main-layout.component`)

- **Type:** Smart Component.
- **Template Structure:**

  ```html
  <div class="app-shell" [class.mobile-menu-open]="isMenuOpen()">
    <eb-header (toggleMenu)="toggleMenu()" />

    <main class="main-content">
      <router-outlet />
    </main>

    <eb-footer />

    @if (isMenuOpen()) {
    <div class="mobile-nav-overlay" (click)="closeMenu()"></div>
    }
  </div>
  ```

- **Logic:**
  - Listen to `Router.events`. On `NavigationEnd`, set `isMenuOpen.set(false)`.

---

## 4.3 Navigation Components

### **1. HeaderComponent** (`core/layout/header`)

- **Dependencies:** `AuthStore`, `ThemeService`, `Router`.
- **Inputs:** None (It connects to global stores directly).
- **Outputs:** `toggleMenu` (Event Emitter for mobile hamburger).
- **Visual Elements:**
  - **Logo:** Text or SVG "Enterprise Blueprint".
  - **Desktop Nav:** Row of links (Data driven).
  - **Actions:**
    - `ThemePickerComponent` (Phase 3).
    - **Auth State:**
      - _If Logged Out:_ Show "Login" button (`/auth/login`).
      - _If Logged In:_ Show "User Profile" badge + "Logout" button.
- **Styling:** Sticky top, backdrop-filter blur.

### **2. Navigation Data Structure** (`core/layout/navigation.data.ts`)

Define navigation items as a const array to prevent magic strings in templates.

```typescript
export interface NavItem {
  label: string;
  route: string;
  icon?: string;
  requiresAuth?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', route: '/' },
  { label: 'Modules', route: '/modules' },
  { label: 'Architecture', route: '/architecture' },
  { label: 'The Architect', route: '/profile' },
];
```

### **3. FooterComponent** (`core/layout/footer`)

- **Content:**
  - Copyright © {currentYear}
  - "View Source" link (GitHub).
  - "Built with Angular v21" badge.
- **Logic:** Use `new Date().getFullYear()` signal for the year.

---

## 4.4 Authentication Features Integration

The Shell must handle the Auth UI flows that don't belong inside the specific "Login" page.

### **1. Auth Flow Integration**

- **In Header:**
  - Inject `AuthStore`.
  - Use `store.user()` to display `user.username` if authenticated.
  - Wire "Logout" button to `store.logout()`.

### **2. Loading Bar**

- **Component:** Use `NgLoader` or simple top-bar loader.
- **Trigger:** Hook into `Router` events or an `AppState` signal.
- **Location:** Fixed at the very top of `MainLayout`.

---

## 4.5 Execution Checklist

1.  [ ] **Configuration:** Update `app.config.ts` with ViewTransitions and ScrollRestoration.
2.  [ ] **Routes:** Create `app.routes.ts` with lazy loading placeholders (create dummy components if Features aren't ready).
3.  [ ] **Layout:** Build `MainLayoutComponent` (Grid/Flex structure).
4.  [ ] **Header:**
    - [ ] Implement Desktop view with `ThemePicker`.
    - [ ] Connect `AuthStore` for Login/Logout UI state.
    - [ ] Implement Mobile hamburger toggle.
5.  [ ] **Footer:** Create simple static footer.
6.  [ ] **Mobile Menu:** Create the overlay/drawer logic in `MainLayout`.
7.  [ ] **Integration:** Replace the content of `app.component.html` with `<eb-main-layout />`.
