import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeService } from './theme.service';
import {
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  THEME_DATA_ATTRIBUTE,
  THEME_STORAGE_KEY,
  THEMES,
  type ThemeId,
} from './theme.types';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockDocument: Document;
  let mockLocalStorage: Record<string, string>;
  let mockMatchMedia: ReturnType<typeof vi.fn>;
  let mediaQueryListeners: Array<(event: { matches: boolean }) => void>;

  beforeEach(() => {
    // Create a mock document
    mockDocument = document.implementation.createHTMLDocument('Test');

    // Mock localStorage
    mockLocalStorage = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key: string) => mockLocalStorage[key] ?? null,
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- Required for mock localStorage
      delete mockLocalStorage[key];
    });

    // Track media query listeners
    mediaQueryListeners = [];

    // Mock matchMedia
    mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('dark') ? false : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_event: string, listener: (event: { matches: boolean }) => void) => {
        mediaQueryListeners.push(listener);
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    vi.stubGlobal('matchMedia', mockMatchMedia);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    TestBed.resetTestingModule();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with default light theme when no storage and system prefers light', () => {
      expect(service.currentThemeId()).toBe(DEFAULT_LIGHT_THEME);
    });

    it('should initialize with stored theme when available', () => {
      mockLocalStorage[THEME_STORAGE_KEY] = 'dark-default';

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: DOCUMENT, useValue: mockDocument },
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });

      const newService = TestBed.inject(ThemeService);
      expect(newService.currentThemeId()).toBe('dark-default');
    });

    it('should initialize with theme from URL query param when present', () => {
      // Mock window.location.search
      const mockLocation = {
        search: '?theme=dark-cool',
      };
      vi.stubGlobal('window', { location: mockLocation, matchMedia: mockMatchMedia });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: DOCUMENT, useValue: mockDocument },
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });

      const newService = TestBed.inject(ThemeService);
      expect(newService.currentThemeId()).toBe('dark-cool');

      vi.unstubAllGlobals();
      vi.stubGlobal('matchMedia', mockMatchMedia); // Restore matchMedia stub
    });

    it('should initialize with dark theme when system prefers dark', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query.includes('dark'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: DOCUMENT, useValue: mockDocument },
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });

      const newService = TestBed.inject(ThemeService);
      expect(newService.currentThemeId()).toBe(DEFAULT_DARK_THEME);
    });

    it('should apply theme to DOM on initialization', () => {
      TestBed.tick(); // Flush initial effect
      const htmlElement = mockDocument.documentElement;
      expect(htmlElement.getAttribute(THEME_DATA_ATTRIBUTE)).toBe(DEFAULT_LIGHT_THEME);
    });

    it('should persist theme to localStorage on initialization', () => {
      TestBed.tick(); // Flush initial effect
      expect(mockLocalStorage[THEME_STORAGE_KEY]).toBe(DEFAULT_LIGHT_THEME);
    });
  });

  describe('currentTheme', () => {
    it('should return the full theme configuration', () => {
      const theme = service.currentTheme();

      expect(theme).toBeDefined();
      expect(theme.id).toBe(DEFAULT_LIGHT_THEME);
      expect(theme.name).toBe('Daylight');
      expect(theme.category).toBe('light');
    });
  });

  describe('availableThemes', () => {
    it('should return all available themes', () => {
      const themes = service.availableThemes();

      expect(themes).toBe(THEMES);
      expect(themes.length).toBe(6);
    });
  });

  describe('isDarkMode', () => {
    it('should return false for light themes', () => {
      service.setTheme('light-default');
      expect(service.isDarkMode()).toBe(false);

      service.setTheme('light-warm');
      expect(service.isDarkMode()).toBe(false);
    });

    it('should return true for dark themes', () => {
      service.setTheme('dark-default');
      expect(service.isDarkMode()).toBe(true);

      service.setTheme('dark-cool');
      expect(service.isDarkMode()).toBe(true);
    });

    it('should return false for high-contrast-light theme', () => {
      service.setTheme('high-contrast-light');
      expect(service.isDarkMode()).toBe(false);
    });

    it('should return true for high-contrast-dark theme', () => {
      service.setTheme('high-contrast-dark');
      expect(service.isDarkMode()).toBe(true);
    });
  });

  describe('isHighContrast', () => {
    it('should return false for standard light themes', () => {
      service.setTheme('light-default');
      expect(service.isHighContrast()).toBe(false);

      service.setTheme('light-warm');
      expect(service.isHighContrast()).toBe(false);
    });

    it('should return false for standard dark themes', () => {
      service.setTheme('dark-default');
      expect(service.isHighContrast()).toBe(false);

      service.setTheme('dark-cool');
      expect(service.isHighContrast()).toBe(false);
    });

    it('should return true for high-contrast themes', () => {
      service.setTheme('high-contrast-light');
      expect(service.isHighContrast()).toBe(true);

      service.setTheme('high-contrast-dark');
      expect(service.isHighContrast()).toBe(true);
    });
  });

  describe('systemPrefersDark', () => {
    it('should return false when system prefers light', () => {
      expect(service.systemPrefersDark()).toBe(false);
    });

    it('should update when system preference changes', () => {
      // Simulate system preference change
      mediaQueryListeners.forEach((listener) => {
        listener({ matches: true });
      });

      expect(service.systemPrefersDark()).toBe(true);
    });
  });

  describe('setTheme', () => {
    it('should set the current theme', () => {
      service.setTheme('dark-default');

      expect(service.currentThemeId()).toBe('dark-default');
      expect(service.currentTheme().name).toBe('Midnight');
    });

    it('should apply theme to DOM', () => {
      service.setTheme('dark-cool');
      TestBed.tick(); // Allow effect to run

      const htmlElement = mockDocument.documentElement;
      expect(htmlElement.getAttribute(THEME_DATA_ATTRIBUTE)).toBe('dark-cool');
    });

    it('should persist theme to localStorage', () => {
      service.setTheme('light-warm');
      TestBed.tick(); // Allow effect to run

      expect(mockLocalStorage[THEME_STORAGE_KEY]).toBe('light-warm');
    });

    it('should throw error for invalid theme ID', () => {
      expect(() => {
        service.setTheme('invalid-theme' as ThemeId);
      }).toThrow('Invalid theme ID: invalid-theme');
    });

    it('should update isDarkMode computed signal', () => {
      expect(service.isDarkMode()).toBe(false);

      service.setTheme('dark-default');

      expect(service.isDarkMode()).toBe(true);
    });

    it('should update isHighContrast computed signal', () => {
      expect(service.isHighContrast()).toBe(false);

      service.setTheme('high-contrast-light');

      expect(service.isHighContrast()).toBe(true);
    });
  });

  describe('setThemeBySystemPreference', () => {
    it('should set light theme when system prefers light', () => {
      service.setTheme('dark-default'); // Start with dark
      service.setThemeBySystemPreference();

      expect(service.currentThemeId()).toBe(DEFAULT_LIGHT_THEME);
    });

    it('should set dark theme when system prefers dark', () => {
      // Create a new service with dark mode preference
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query.includes('dark'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: DOCUMENT, useValue: mockDocument },
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });

      const darkPrefService = TestBed.inject(ThemeService);
      darkPrefService.setThemeBySystemPreference();

      expect(darkPrefService.currentThemeId()).toBe(DEFAULT_DARK_THEME);
    });
  });

  describe('getThemesByCategory', () => {
    it('should return light themes', () => {
      const lightThemes = service.getThemesByCategory('light');

      expect(lightThemes.length).toBe(2);
      expect(lightThemes.every((t) => t.category === 'light')).toBe(true);
      expect(lightThemes.map((t) => t.id)).toContain('light-default');
      expect(lightThemes.map((t) => t.id)).toContain('light-warm');
    });

    it('should return dark themes', () => {
      const darkThemes = service.getThemesByCategory('dark');

      expect(darkThemes.length).toBe(2);
      expect(darkThemes.every((t) => t.category === 'dark')).toBe(true);
      expect(darkThemes.map((t) => t.id)).toContain('dark-default');
      expect(darkThemes.map((t) => t.id)).toContain('dark-cool');
    });

    it('should return high-contrast-light themes', () => {
      const highContrastLightThemes = service.getThemesByCategory('high-contrast-light');

      expect(highContrastLightThemes.length).toBe(1);
      expect(highContrastLightThemes[0].id).toBe('high-contrast-light');
    });

    it('should return high-contrast-dark themes', () => {
      const highContrastDarkThemes = service.getThemesByCategory('high-contrast-dark');

      expect(highContrastDarkThemes.length).toBe(1);
      expect(highContrastDarkThemes[0].id).toBe('high-contrast-dark');
    });
  });

  describe('getThemeById', () => {
    it('should return the theme configuration for a valid ID', () => {
      const theme = service.getThemeById('dark-cool');

      expect(theme.id).toBe('dark-cool');
      expect(theme.name).toBe('Twilight');
      expect(theme.category).toBe('dark');
      expect(theme.icon).toBe('moon');
    });

    it('should throw error for invalid theme ID', () => {
      expect(() => {
        service.getThemeById('nonexistent' as ThemeId);
      }).toThrow('Theme not found: nonexistent');
    });
  });

  describe('clearPersistedTheme', () => {
    it('should remove theme from localStorage', () => {
      service.setTheme('dark-default');
      TestBed.tick(); // Allow effect to run
      expect(mockLocalStorage[THEME_STORAGE_KEY]).toBe('dark-default');

      service.clearPersistedTheme();
      TestBed.tick(); // Allow effect to run

      // After clearing, it should set back to system preference
      // The removeItem is called, then setItem is called with the new value
      // eslint-disable-next-line @typescript-eslint/unbound-method -- Testing spy on prototype
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
    });

    it('should revert to system preference after clearing', () => {
      service.setTheme('dark-cool');
      service.clearPersistedTheme();

      // System prefers light (default mock)
      expect(service.currentThemeId()).toBe(DEFAULT_LIGHT_THEME);
    });
  });

  describe('server-side rendering', () => {
    it('should not access localStorage on server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: DOCUMENT, useValue: mockDocument },
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });

      const serverService = TestBed.inject(ThemeService);

      // Should still work but use defaults
      expect(serverService.currentThemeId()).toBe(DEFAULT_LIGHT_THEME);
    });

    it('should not access matchMedia on server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: DOCUMENT, useValue: mockDocument },
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });

      const serverService = TestBed.inject(ThemeService);

      expect(serverService.systemPrefersDark()).toBe(false);
    });

    it('should not apply theme to DOM on server', () => {
      const serverDocument = document.implementation.createHTMLDocument('Server');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: DOCUMENT, useValue: serverDocument },
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });

      TestBed.inject(ThemeService);

      // Should not have the data attribute on server
      expect(serverDocument.documentElement.hasAttribute(THEME_DATA_ATTRIBUTE)).toBe(false);
    });
  });

  describe('theme data integrity', () => {
    it('should have all required properties for each theme', () => {
      THEMES.forEach((theme) => {
        expect(theme.id).toBeDefined();
        expect(theme.name).toBeDefined();
        expect(theme.category).toBeDefined();
        expect(theme.description).toBeDefined();
        expect(theme.icon).toBeDefined();
      });
    });

    it('should have unique theme IDs', () => {
      const ids = THEMES.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid icons for each theme', () => {
      const validIcons = ['sun', 'moon', 'contrast'];
      THEMES.forEach((theme) => {
        expect(validIcons).toContain(theme.icon);
      });
    });

    it('should have matching icon for theme category', () => {
      THEMES.forEach((theme) => {
        if (theme.category === 'light') {
          expect(theme.icon).toBe('sun');
        } else if (theme.category === 'dark') {
          expect(theme.icon).toBe('moon');
        } else {
          expect(theme.icon).toBe('contrast');
        }
      });
    });
  });

  describe('all theme setters', () => {
    it('should successfully set each available theme', () => {
      THEMES.forEach((theme) => {
        service.setTheme(theme.id);
        expect(service.currentThemeId()).toBe(theme.id);
        expect(service.currentTheme().name).toBe(theme.name);
      });
    });
  });
});
