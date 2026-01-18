import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { provideIcons } from '@ng-icons/core';
import { heroCheck, heroChevronDown } from '@ng-icons/heroicons/outline';
import { matFormatPaint } from '@ng-icons/material-icons/baseline';
import { fromEvent } from 'rxjs';

import type { Theme, ThemeId } from '@core/services';
import { ThemeService } from '@core/services';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IconComponent } from '@shared/components/icon';

import { TooltipDirective } from '@shared/components/tooltip/tooltip.directive';
import { CHANGE_THEME_TOOLTIP } from './theme-picker.constants';

export type ThemePickerVariant = 'dropdown' | 'grid' | 'inline' | 'icon';
export type ThemePickerSize = 'sm' | 'md' | 'lg';

/** Theme categories for grouping */
type GroupedThemeKey = 'light' | 'dark' | 'highContrast';

/**
 * Component to select and switch application themes.
 * Supports multiple distinct visual variants (dropdown, grid, inline, icon).
 */
@Component({
  selector: 'eb-theme-picker',
  imports: [IconComponent, TooltipDirective, ButtonComponent],
  viewProviders: [provideIcons({ heroChevronDown, heroCheck, matFormatPaint })],
  templateUrl: './theme-picker.component.html',
  styleUrl: './theme-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerComponent {
  private readonly _themeService = inject(ThemeService);
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Tooltip text for the trigger button */
  readonly changeThemeTooltip = CHANGE_THEME_TOOLTIP;

  /**
   * Close dropdown when clicking outside
   */
  constructor() {
    fromEvent<MouseEvent>(document, 'click')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => {
        const target = event.target;
        if (
          target instanceof Node &&
          !this._elementRef.nativeElement.contains(target) &&
          this.isOpen()
        ) {
          this.closeDropdown();
        }
      });
  }

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
  getThemePreview(_theme: Theme): string {
    return 'linear-gradient(135deg, var(--color-background) 50%, var(--color-primary) 50%)';
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
