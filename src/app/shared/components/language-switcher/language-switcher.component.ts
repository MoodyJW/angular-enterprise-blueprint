import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { heroCheck, heroChevronDown, heroGlobeAlt } from '@ng-icons/heroicons/outline';

import { AVAILABLE_LANGUAGES, type AvailableLanguage } from '@core/i18n';
import { IconComponent } from '../icon';

/** Language information for display */
export interface Language {
  code: AvailableLanguage;
  nativeName: string;
}

/** Available languages with display names */
export const LANGUAGES: readonly Language[] = [
  { code: 'en', nativeName: 'English' },
  { code: 'es', nativeName: 'Español' },
] as const;

/** Storage key for language preference */
const LANGUAGE_STORAGE_KEY = 'preferred-language';

export type LanguageSwitcherVariant = 'dropdown' | 'inline';
export type LanguageSwitcherSize = 'sm' | 'md';

/**
 * Language switcher component for changing the application's active language.
 *
 * Provides:
 * - Dropdown menu with available languages
 * - Current language display
 * - Persistent language preference in localStorage
 * - Keyboard navigation support
 *
 * @example
 * ```html
 * <eb-language-switcher variant="dropdown" size="sm" />
 * ```
 */
@Component({
  selector: 'eb-language-switcher',
  standalone: true,
  imports: [TranslocoModule, IconComponent],
  viewProviders: [provideIcons({ heroChevronDown, heroCheck, heroGlobeAlt })],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent implements OnInit {
  private readonly _transloco = inject(TranslocoService);
  private readonly _destroyRef = inject(DestroyRef);

  /**
   * Display variant
   * - dropdown: Compact dropdown menu (default)
   * - inline: Horizontal button row
   */
  readonly variant = input<LanguageSwitcherVariant>('dropdown');

  /**
   * Size of the picker
   */
  readonly size = input<LanguageSwitcherSize>('md');

  /**
   * Available languages
   */
  readonly languages = LANGUAGES;

  /**
   * Whether dropdown is open
   */
  readonly isOpen = signal<boolean>(false);

  /**
   * Current active language code (reactive signal)
   */
  private readonly _activeLangCode = signal<AvailableLanguage>(
    this._transloco.getActiveLang() as AvailableLanguage,
  );

  /**
   * Current active language (derived from reactive signal)
   */
  readonly currentLanguage = computed((): Language => {
    const code = this._activeLangCode();
    return this.languages.find((lang) => lang.code === code) ?? this.languages[0];
  });

  /**
   * ARIA label for the dropdown button
   */
  readonly dropdownAriaLabel = computed((): string => {
    return this._transloco.translate('languageSwitcher.currentLanguage', {
      language: this.currentLanguage().nativeName,
    });
  });

  /**
   * Picker CSS classes
   */
  readonly pickerClasses = computed((): string => {
    const classes = ['language-switcher'];
    classes.push(`language-switcher--${this.size()}`);
    classes.push(`language-switcher--${this.variant()}`);
    return classes.join(' ');
  });

  ngOnInit(): void {
    // Subscribe to language changes to update the reactive signal
    this._transloco.langChanges$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((lang) => {
      this._activeLangCode.set(lang as AvailableLanguage);
    });

    // Load saved language preference on initialization
    this._loadSavedLanguage();
  }

  /**
   * Select and apply a new language
   */
  selectLanguage(language: Language): void {
    this._transloco.setActiveLang(language.code);
    this.isOpen.set(false);

    // Persist preference
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language.code);
    } catch {
      // localStorage may not be available
    }
  }

  /**
   * Toggle dropdown visibility
   */
  toggleDropdown(): void {
    this.isOpen.update((open) => !open);
  }

  /**
   * Close dropdown
   */
  closeDropdown(): void {
    this.isOpen.set(false);
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggleDropdown();
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;

      case 'Tab':
        this.closeDropdown();
        break;
    }
  }

  /**
   * Load saved language preference from localStorage
   */
  private _loadSavedLanguage(): void {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved !== null && AVAILABLE_LANGUAGES.includes(saved as AvailableLanguage)) {
        this._transloco.setActiveLang(saved);
      }
    } catch {
      // localStorage may not be available
    }
  }
}
