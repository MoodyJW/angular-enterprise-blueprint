import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { AuthStore } from '@core/auth';
import { HeaderComponent } from './header.component';

interface MockAuthStore {
  user: WritableSignal<null>;
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
      imports: [HeaderComponent],
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
      expect(dashboardItem?.label).toBe('Dashboard');
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
      const navLinks = compiled.querySelectorAll('.header__nav-link');
      expect(navLinks.length).toBe(component.navItems.length);
    });

    it('should show login button when not authenticated', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      // The text content should include "Login"
      expect(compiled.textContent).toContain('Login');
    });

    it('should show mobile menu toggle button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector('.header__menu-toggle');
      expect(toggleButton).toBeTruthy();
    });
  });
});
