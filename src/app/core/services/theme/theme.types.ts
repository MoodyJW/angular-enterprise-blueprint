/**
 * Theme type definitions for the ThemeService.
 *
 * These types provide strict typing for the theme system,
 * including theme identifiers, categories, and configuration.
 */

/**
 * Theme identifiers for all available themes.
 */
export type ThemeId =
  | 'light-default'
  | 'light-warm'
  | 'dark-default'
  | 'dark-cool'
  | 'high-contrast-light'
  | 'high-contrast-dark';

/**
 * Theme categories for grouping themes.
 */
export type ThemeCategory = 'light' | 'dark' | 'high-contrast-light' | 'high-contrast-dark';

/**
 * Theme configuration.
 */
export interface Theme {
  /** Unique identifier for the theme */
  readonly id: ThemeId;
  /** Human-readable display name */
  readonly name: string;
  /** Theme category for grouping and system preference matching */
  readonly category: ThemeCategory;
  /** Short description of the theme */
  readonly description: string;
  /** Icon identifier for UI display (e.g., 'sun', 'moon', 'contrast') */
  readonly icon: ThemeIcon;
}

/**
 * Icon identifiers for theme indicators.
 */
export type ThemeIcon = 'sun' | 'moon' | 'contrast';

/**
 * All available themes.
 */
export const THEMES: readonly Theme[] = [
  {
    id: 'light-default',
    name: 'Daylight',
    category: 'light',
    description: 'Clean, professional light theme',
    icon: 'sun',
  },
  {
    id: 'light-warm',
    name: 'Sunrise',
    category: 'light',
    description: 'Warm-toned light theme with softer colors',
    icon: 'sun',
  },
  {
    id: 'dark-default',
    name: 'Midnight',
    category: 'dark',
    description: 'Deep blue-black dark theme',
    icon: 'moon',
  },
  {
    id: 'dark-cool',
    name: 'Twilight',
    category: 'dark',
    description: 'Cool purple-tinted dark theme',
    icon: 'moon',
  },
  {
    id: 'high-contrast-light',
    name: 'High Contrast Light',
    category: 'high-contrast-light',
    description: 'WCAG AAA compliant high contrast light theme',
    icon: 'contrast',
  },
  {
    id: 'high-contrast-dark',
    name: 'High Contrast Dark',
    category: 'high-contrast-dark',
    description: 'WCAG AAA compliant high contrast dark theme',
    icon: 'contrast',
  },
] as const;

/**
 * Default theme for light mode preference.
 */
export const DEFAULT_LIGHT_THEME: ThemeId = 'light-default';

/**
 * Default theme for dark mode preference.
 */
export const DEFAULT_DARK_THEME: ThemeId = 'dark-default';

/**
 * LocalStorage key for persisting theme selection.
 */
export const THEME_STORAGE_KEY = 'theme-id';

/**
 * Data attribute name for the theme on the HTML element.
 */
export const THEME_DATA_ATTRIBUTE = 'data-theme';
