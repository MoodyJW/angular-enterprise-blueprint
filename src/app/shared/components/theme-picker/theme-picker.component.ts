import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import type { Theme, ThemeCategory, ThemeId } from '@core/services';
import { ThemeService } from '@core/services';
import { IconComponent } from '../icon';

export type ThemePickerVariant = 'dropdown' | 'grid' | 'inline';
export type ThemePickerSize = 'sm' | 'md' | 'lg';

/** Map theme categories to preview colors */
const THEME_PREVIEW_COLORS: Record<ThemeCategory, string> = {
  light: 'linear-gradient(135deg, #ffffff 50%, #f0f0f0 50%)',
  dark: 'linear-gradient(135deg, #1a1a2e 50%, #16213e 50%)',
  'high-contrast-light': 'linear-gradient(135deg, #ffffff 50%, #000000 50%)',
  'high-contrast-dark': 'linear-gradient(135deg, #000000 50%, #ffffff 50%)',
};

/** Theme categories for grouping */
type GroupedThemeKey = 'light' | 'dark' | 'highContrast';

@Component({
  selector: 'eb-theme-picker',
  imports: [IconComponent],
  templateUrl: './theme-picker.component.html',
  styleUrl: './theme-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerComponent {
  private readonly _themeService = inject(ThemeService);

  /**
   * Display variant
   * - dropdown: Compact dropdown menu (default)
   * - grid: Grid of theme swatches
   * - inline: Horizontal row of options
   */
  readonly variant = input<ThemePickerVariant>('dropdown');

  /**
   * Size of the picker
   */
  readonly size = input<ThemePickerSize>('md');

  /**
   * Whether to show theme labels
   */
  readonly showLabels = input<boolean>(true);

  /**
   * Whether to group themes by category
   */
  readonly groupByCategory = input<boolean>(false);

  /**
   * ARIA label for accessibility
   */
  readonly ariaLabel = input<string>('Select theme');

  /**
   * Current theme from service
   */
  readonly currentTheme = this._themeService.currentTheme;

  /**
   * All available themes
   */
  readonly themes = this._themeService.availableThemes;

  /**
   * Themes grouped by category (light, dark, high-contrast)
   */
  readonly groupedThemes = computed((): Record<GroupedThemeKey, readonly Theme[]> => {
    return {
      light: this._themeService.getThemesByCategory('light'),
      dark: this._themeService.getThemesByCategory('dark'),
      highContrast: [
        ...this._themeService.getThemesByCategory('high-contrast-light'),
        ...this._themeService.getThemesByCategory('high-contrast-dark'),
      ],
    };
  });

  /** Category keys for template iteration */
  readonly categoryKeys: readonly GroupedThemeKey[] = ['light', 'dark', 'highContrast'];

  /** Category display labels */
  readonly categoryLabels: Record<GroupedThemeKey, string> = {
    light: 'Light',
    dark: 'Dark',
    highContrast: 'High Contrast',
  };

  /**
   * Whether dropdown is open (for dropdown variant)
   */
  readonly isOpen = signal<boolean>(false);

  /**
   * Currently focused option index for keyboard navigation
   */
  readonly focusedIndex = signal<number>(-1);

  /**
   * Computed CSS classes for the picker container
   */
  readonly pickerClasses = computed(() => {
    const classes = ['theme-picker'];
    classes.push(`theme-picker--${this.size()}`);
    classes.push(`theme-picker--${this.variant()}`);
    return classes.join(' ');
  });

  /**
   * Get preview color for a theme
   */
  getThemePreview(theme: Theme): string {
    return THEME_PREVIEW_COLORS[theme.category];
  }

  /**
   * Select a theme
   */
  selectTheme(themeId: ThemeId): void {
    this._themeService.setTheme(themeId);
    this.isOpen.set(false);
  }

  /**
   * Toggle dropdown
   */
  toggleDropdown(): void {
    this.isOpen.update((open) => !open);
    if (this.isOpen()) {
      this.focusedIndex.set(0);
    }
  }

  /**
   * Close dropdown
   */
  closeDropdown(): void {
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(event: KeyboardEvent): void {
    const themes = this.themes();

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggleDropdown();
        } else if (this.focusedIndex() >= 0 && this.focusedIndex() < themes.length) {
          this.selectTheme(themes[this.focusedIndex()].id);
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggleDropdown();
        } else {
          this.focusedIndex.update((i) => Math.min(i + 1, themes.length - 1));
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggleDropdown();
        } else {
          this.focusedIndex.update((i) => Math.max(i - 1, 0));
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;

      case 'Home':
        if (this.isOpen()) {
          event.preventDefault();
          this.focusedIndex.set(0);
        }
        break;

      case 'End':
        if (this.isOpen()) {
          event.preventDefault();
          this.focusedIndex.set(themes.length - 1);
        }
        break;

      case 'Tab':
        this.closeDropdown();
        break;
    }
  }
}
