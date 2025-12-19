import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  computed,
  effect,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
  type Signal,
  type WritableSignal,
} from '@angular/core';

import {
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  THEME_DATA_ATTRIBUTE,
  THEME_STORAGE_KEY,
  THEMES,
  type Theme,
  type ThemeCategory,
  type ThemeId,
} from './theme.types';

/**
 * Service for managing application themes.
 *
 * Features:
 * - Multiple named themes (light, dark, high-contrast variants)
 * - System preference detection and automatic theme selection
 * - Persistence via localStorage
 * - Smooth CSS transitions between themes
 * - Signal-based reactive state
 *
 * @example
 * ```typescript
 * const themeService = inject(ThemeService);
 *
 * // Get current theme
 * const theme = themeService.currentTheme();
 *
 * // Change theme
 * themeService.setTheme('dark-default');
 *
 * // Get themes by category
 * const darkThemes = themeService.getThemesByCategory('dark');
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  /** Internal signal for the current theme ID */
  private readonly _currentThemeId: WritableSignal<ThemeId>;

  /** Media query for detecting system dark mode preference */
  private readonly darkModeMediaQuery: MediaQueryList | null;

  /**
   * Signal containing the current theme ID.
   */
  readonly currentThemeId: Signal<ThemeId>;

  /**
   * Signal containing the current theme configuration.
   */
  readonly currentTheme: Signal<Theme>;

  /**
   * Signal containing all available themes.
   */
  readonly availableThemes: Signal<readonly Theme[]> = signal(THEMES);

  /**
   * Signal indicating whether the current theme is a dark theme.
   */
  readonly isDarkMode: Signal<boolean>;

  /**
   * Signal indicating whether the current theme is a high-contrast theme.
   */
  readonly isHighContrast: Signal<boolean>;

  /**
   * Signal indicating whether the system prefers dark mode.
   */
  readonly systemPrefersDark: Signal<boolean>;

  constructor() {
    const isBrowser = isPlatformBrowser(this.platformId);

    // Initialize media query for system preference detection
    if (isBrowser) {
      this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    } else {
      this.darkModeMediaQuery = null;
    }

    // Initialize system preference signal
    const systemPrefersDarkSignal = signal(this.getSystemPrefersDark());
    this.systemPrefersDark = systemPrefersDarkSignal.asReadonly();

    // Listen for system preference changes
    if (this.darkModeMediaQuery) {
      this.darkModeMediaQuery.addEventListener('change', (event) => {
        systemPrefersDarkSignal.set(event.matches);
      });
    }

    // Initialize theme from storage or system preference
    const initialThemeId = this.getInitialThemeId();
    this._currentThemeId = signal(initialThemeId);
    this.currentThemeId = this._currentThemeId.asReadonly();

    // Computed signal for current theme configuration
    this.currentTheme = computed(() => {
      const themeId = this._currentThemeId();
      return this.getThemeById(themeId);
    });

    // Computed signal for dark mode
    this.isDarkMode = computed(() => {
      const theme = this.currentTheme();
      return theme.category === 'dark' || theme.category === 'high-contrast-dark';
    });

    // Computed signal for high contrast
    this.isHighContrast = computed(() => {
      const theme = this.currentTheme();
      return theme.category === 'high-contrast-light' || theme.category === 'high-contrast-dark';
    });

    // Effect to apply theme changes to the DOM and persist to storage
    effect(() => {
      const themeId = this._currentThemeId();
      this.applyThemeToDOM(themeId);
      this.persistTheme(themeId);
    });
  }

  /**
   * Sets the current theme by ID.
   *
   * @param themeId - The theme ID to set
   * @throws Error if the theme ID is not valid
   */
  setTheme(themeId: ThemeId): void {
    if (!this.isValidThemeId(themeId)) {
      throw new Error(`Invalid theme ID: ${String(themeId)}`);
    }
    this._currentThemeId.set(themeId);
  }

  /**
   * Sets the theme based on system preference.
   * Uses the default light or dark theme based on system settings.
   */
  setThemeBySystemPreference(): void {
    const prefersDark = this.getSystemPrefersDark();
    const themeId = prefersDark ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
    this._currentThemeId.set(themeId);
  }

  /**
   * Gets all themes in a specific category.
   *
   * @param category - The theme category to filter by
   * @returns Array of themes in the specified category
   */
  getThemesByCategory(category: ThemeCategory): readonly Theme[] {
    return THEMES.filter((theme) => theme.category === category);
  }

  /**
   * Gets a theme by its ID.
   *
   * @param themeId - The theme ID to look up
   * @returns The theme configuration
   * @throws Error if the theme ID is not valid
   */
  getThemeById(themeId: ThemeId): Theme {
    const theme = THEMES.find((t) => t.id === themeId);
    if (!theme) {
      throw new Error(`Theme not found: ${themeId}`);
    }
    return theme;
  }

  /**
   * Clears the persisted theme and reverts to system preference.
   */
  clearPersistedTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
    this.setThemeBySystemPreference();
  }

  /**
   * Checks if a theme ID is valid.
   *
   * @param themeId - The theme ID to validate
   * @returns True if the theme ID is valid
   */
  private isValidThemeId(themeId: string): themeId is ThemeId {
    return THEMES.some((theme) => theme.id === themeId);
  }

  /**
   * Gets the initial theme ID from storage or system preference.
   */
  private getInitialThemeId(): ThemeId {
    if (isPlatformBrowser(this.platformId)) {
      const storedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
      if (storedThemeId !== null && storedThemeId !== '' && this.isValidThemeId(storedThemeId)) {
        return storedThemeId;
      }
    }

    // Fall back to system preference
    const prefersDark = this.getSystemPrefersDark();
    return prefersDark ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
  }

  /**
   * Gets the system's dark mode preference.
   */
  private getSystemPrefersDark(): boolean {
    if (this.darkModeMediaQuery) {
      return this.darkModeMediaQuery.matches;
    }
    return false;
  }

  /**
   * Applies the theme to the DOM by setting the data attribute.
   */
  private applyThemeToDOM(themeId: ThemeId): void {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = this.document.documentElement;
      htmlElement.setAttribute(THEME_DATA_ATTRIBUTE, themeId);
    }
  }

  /**
   * Persists the theme ID to localStorage.
   */
  private persistTheme(themeId: ThemeId): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    }
  }
}
