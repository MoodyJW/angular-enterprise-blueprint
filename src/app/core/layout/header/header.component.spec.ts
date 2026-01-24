import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { AuthStore, User } from '@core/auth';
import { UserMenuComponent } from '@shared/components/user-menu/user-menu.component';
import { HeaderComponent } from './header.component';

interface MockAuthStore {
  user: WritableSignal<User | null>;
  isAuthenticated: WritableSignal<boolean>;
  isLoading: WritableSignal<boolean>;
  displayName: WritableSignal<string>;
  logout: Mock;
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthStore: MockAuthStore;

  beforeEach(async () => {
    // Mock matchMedia for ThemeService
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('dark') ? false : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );

    // Create mock AuthStore
    mockAuthStore = {
      user: signal(null),
      isAuthenticated: signal(false),
      isLoading: signal(false),
      displayName: signal('Guest'),
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        UserMenuComponent, // Add UserMenuComponent
        TranslocoTestingModule.forRoot({
          langs: {
            en: {
              nav: {
                home: 'Home',
                modules: 'Modules',
                architecture: 'Architecture',
                profile: 'Profile',
                blog: 'Blog',
                contact: 'Contact',
                resources: 'Resources',
                storybook: 'Component Library',
                docs: 'Documentation',
              },
              header: {
                brand: 'Enterprise Blueprint',
                login: 'Login',
                logout: 'Logout',
                ariaLabels: {
                  home: 'Home',
                  mainNav: 'Main navigation',
                  toggleMenu: 'Toggle menu',
                  login: 'Login',
                  logout: 'Logout',
                },
              },
              languageSwitcher: { currentLanguage: 'English' },
            },
          },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
      providers: [provideRouter([]), { provide: AuthStore, useValue: mockAuthStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navItems', () => {
    it('should have navigation items', () => {
      expect(component.navItems).toBeDefined();
      expect(component.navItems.length).toBeGreaterThan(0);
    });

    it('should include Dashboard link', () => {
      const dashboardItem = component.navItems.find((item) => item.route === '/');
      expect(dashboardItem).toBeDefined();
      expect(dashboardItem?.labelKey).toBe('nav.home');
    });
  });

  describe('auth state', () => {
    it('should reflect unauthenticated state', () => {
      expect(component.isAuthenticated()).toBe(false);
      expect(component.displayName()).toBe('Guest');
    });

    it('should reflect authenticated state', () => {
      mockAuthStore.isAuthenticated.set(true);
      mockAuthStore.displayName.set('TestUser');
      fixture.detectChanges();

      expect(component.isAuthenticated()).toBe(true);
      expect(component.displayName()).toBe('TestUser');
    });
  });

  describe('toggleMenu output', () => {
    it('should emit when onToggleMenu is called', () => {
      const emitSpy = vi.spyOn(component.toggleMenu, 'emit');

      component.onToggleMenu();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('onLogout', () => {
    it('should call authStore.logout', () => {
      component.onLogout();

      expect(mockAuthStore.logout).toHaveBeenCalledWith(undefined);
    });
  });

  describe('template rendering', () => {
    it('should display the brand logo', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const logo = compiled.querySelector('.header__logo');
      expect(logo).toBeTruthy();
      expect(logo?.textContent).toBe('EB');
    });

    it('should display navigation items', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const navItems = compiled.querySelectorAll('.header__nav-item');
      // Count should match total nav items (including dropdowns)
      expect(navItems.length).toBe(component.navItems.length);
    });

    it('should render dropdown for Resources nav item', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const dropdown = compiled.querySelector('eb-nav-dropdown');
      expect(dropdown).toBeTruthy();
    });

    it('should have correct routerLinkActive configuration', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const navLinks = compiled.querySelectorAll('.header__nav-link');

      // Check local dashboard link (first one usually) that needs exact match
      const dashboardLink = navLinks[0];
      // We can't verify runtime active class switch easily without RouterTestingModule validation,
      // but checking the attribute/input existence is good enough for unit tests.
      // Actually, let's checking the directive instance via DebugElement

      const debugLinks = fixture.debugElement.queryAll(By.css('.header__nav-link'));
      expect(debugLinks.length).toBeGreaterThan(0);

      // Just verify it's not null and has some property bindings
      expect(dashboardLink.getAttribute('routerLinkActive')).toBe('header__nav-link--active');
    });

    it('should show login button when not authenticated', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      // The text content should include "Login"
      expect(compiled.textContent).toContain('Login');
    });

    it('should show mobile menu toggle button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector('.header__mobile-toggle');
      expect(toggleButton).toBeTruthy();
    });

    it('should show user menu when authenticated', () => {
      const mockUser: User = {
        id: '1',
        username: 'john',
        email: 'john@example.com',
        roles: ['user'],
      };
      mockAuthStore.isAuthenticated.set(true);
      mockAuthStore.user.set(mockUser);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const userMenu = compiled.querySelector('eb-user-menu');
      expect(userMenu).toBeTruthy();
    });

    it('should not show login button when authenticated', () => {
      const mockUser: User = {
        id: '1',
        username: 'john',
        email: 'john@example.com',
        roles: ['user'],
      };
      mockAuthStore.isAuthenticated.set(true);
      mockAuthStore.user.set(mockUser);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      // When authenticated, we should NOT have the Login button visible
      // (the button is replaced by user info + logout)
      const loginButton = compiled.querySelector('eb-button[routerLink="/auth/login"]');
      expect(loginButton).toBeFalsy();
    });

    it('should have loading state in isLoading signal when loading', () => {
      mockAuthStore.isAuthenticated.set(true);
      mockAuthStore.isLoading.set(true);
      fixture.detectChanges();

      // Verify that the isLoading state is reflected in the component
      expect(component.isLoading()).toBe(true);
    });

    it('should render all navigation items', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const navItems = compiled.querySelectorAll('.header__nav-item');
      expect(navItems.length).toBe(component.navItems.length);
    });

    it('should render theme picker', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const themePicker = compiled.querySelector('eb-theme-picker');
      expect(themePicker).toBeTruthy();
    });

    it('should render language switcher', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const languageSwitcher = compiled.querySelector('eb-language-switcher');
      expect(languageSwitcher).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should emit toggleMenu when mobile toggle is clicked', () => {
      const emitSpy = vi.spyOn(component.toggleMenu, 'emit');

      // Use DebugElement to find the ButtonComponent directive
      const toggleDebugEl = fixture.debugElement.query(By.css('.header__mobile-toggle'));
      expect(toggleDebugEl).toBeTruthy();

      // Trigger the custom 'clicked' event from eb-button
      toggleDebugEl.triggerEventHandler('clicked', null);

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should call logout when user menu emits logout', () => {
      const mockUser: User = {
        id: '1',
        username: 'john',
        email: 'john@example.com',
        roles: ['user'],
      };
      mockAuthStore.isAuthenticated.set(true);
      mockAuthStore.user.set(mockUser);
      fixture.detectChanges();

      const logoutSpy = vi.spyOn(component, 'onLogout');
      const userMenu = fixture.debugElement.query(By.css('eb-user-menu'));

      expect(userMenu).toBeTruthy();

      userMenu.triggerEventHandler('logout', null);

      expect(logoutSpy).toHaveBeenCalled();
      expect(mockAuthStore.logout).toHaveBeenCalled();
    });
  });
});
