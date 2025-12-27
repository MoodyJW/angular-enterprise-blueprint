import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { AuthStore } from '@core/auth';
import { MainLayoutComponent } from './main-layout.component';

interface MockAuthStore {
  user: WritableSignal<null>;
  isAuthenticated: WritableSignal<boolean>;
  isLoading: WritableSignal<boolean>;
  displayName: WritableSignal<string>;
  logout: Mock;
}

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
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

    // Create mock AuthStore for HeaderComponent
    mockAuthStore = {
      user: signal(null),
      isAuthenticated: signal(false),
      isLoading: signal(false),
      displayName: signal('Guest'),
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        MainLayoutComponent,
        TranslocoTestingModule.forRoot({
          langs: {
            en: {
              nav: {
                home: 'Home',
                modules: 'Modules',
                architecture: 'Architecture',
                profile: 'Profile',
                contact: 'Contact',
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
              footer: {
                copyright: '© {{ year }} Enterprise Blueprint',
                viewSource: 'View Source',
                builtWith: 'Built with Angular v{{ version }}',
                ariaLabels: { viewSource: 'View source' },
              },
              layout: { ariaLabels: { mobileNav: 'Mobile navigation' } },
              languageSwitcher: { currentLanguage: 'English' },
            },
          },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
      providers: [
        provideRouter([{ path: '', component: MainLayoutComponent }]),
        { provide: AuthStore, useValue: mockAuthStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
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

  describe('isMenuOpen', () => {
    it('should start with menu closed', () => {
      expect(component.isMenuOpen()).toBe(false);
    });

    it('should toggle menu open', () => {
      component.toggleMenu();
      expect(component.isMenuOpen()).toBe(true);
    });

    it('should toggle menu closed', () => {
      component.isMenuOpen.set(true);
      component.toggleMenu();
      expect(component.isMenuOpen()).toBe(false);
    });
  });

  describe('closeMenu', () => {
    it('should close the menu', () => {
      component.isMenuOpen.set(true);
      component.closeMenu();
      expect(component.isMenuOpen()).toBe(false);
    });
  });

  describe('onMobileNavClick', () => {
    it('should close the menu', () => {
      component.isMenuOpen.set(true);
      component.onMobileNavClick();
      expect(component.isMenuOpen()).toBe(false);
    });
  });

  describe('navItems', () => {
    it('should have navigation items', () => {
      expect(component.navItems).toBeDefined();
      expect(component.navItems.length).toBeGreaterThan(0);
    });
  });

  describe('template rendering', () => {
    it('should render the header component', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const header = compiled.querySelector('eb-header');
      expect(header).toBeTruthy();
    });

    it('should render the footer component', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const footer = compiled.querySelector('eb-footer');
      expect(footer).toBeTruthy();
    });

    it('should render the main content area', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const main = compiled.querySelector('.main-content');
      expect(main).toBeTruthy();
    });

    it('should render router outlet', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const outlet = compiled.querySelector('router-outlet');
      expect(outlet).toBeTruthy();
    });

    it('should render toast container', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const toastContainer = compiled.querySelector('eb-toast-container');
      expect(toastContainer).toBeTruthy();
    });

    it('should add mobile-menu-open class when menu is open', () => {
      component.isMenuOpen.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const appShell = compiled.querySelector('.app-shell');
      expect(appShell?.classList.contains('mobile-menu-open')).toBe(true);
    });

    it('should show mobile nav overlay when menu is open', () => {
      component.isMenuOpen.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const overlay = compiled.querySelector('.mobile-nav-overlay');
      expect(overlay).toBeTruthy();
    });

    it('should not show mobile nav overlay when menu is closed', () => {
      component.isMenuOpen.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const overlay = compiled.querySelector('.mobile-nav-overlay');
      expect(overlay).toBeFalsy();
    });

    it('should render mobile nav links when menu is open', () => {
      component.isMenuOpen.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const mobileNavLinks = compiled.querySelectorAll('.mobile-nav__link');
      // Should have navItems + Contact link
      expect(mobileNavLinks.length).toBe(component.navItems.length + 1);
    });

    it('should close menu when overlay is clicked', () => {
      component.isMenuOpen.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const overlay = compiled.querySelector('.mobile-nav-overlay') as HTMLElement;
      expect(overlay).toBeTruthy();

      overlay.click();
      fixture.detectChanges();

      expect(component.isMenuOpen()).toBe(false);
    });

    it('should close menu when mobile nav link is clicked', () => {
      component.isMenuOpen.set(true);
      fixture.detectChanges();

      const closeMenuSpy = vi.spyOn(component, 'closeMenu');
      component.onMobileNavClick();

      expect(closeMenuSpy).toHaveBeenCalled();
    });

    it('should have nav items with translation keys', () => {
      component.navItems.forEach((item) => {
        expect(item.labelKey).toBeDefined();
        expect(item.labelKey.startsWith('nav.')).toBe(true);
      });
    });
  });
});
