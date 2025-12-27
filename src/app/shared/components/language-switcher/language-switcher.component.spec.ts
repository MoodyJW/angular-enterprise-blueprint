// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LANGUAGES, LanguageSwitcherComponent } from './language-switcher.component';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let nativeElement: HTMLElement;

  const translationsEn = {
    languageSwitcher: {
      label: 'Language',
      ariaLabel: 'Select language',
      currentLanguage: 'Current language: {{ language }}',
      languages: {
        en: 'English',
        es: 'Español',
      },
    },
  };

  beforeEach(async () => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    vi.stubGlobal('localStorage', localStorageMock);

    await TestBed.configureTestingModule({
      imports: [
        LanguageSwitcherComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translationsEn },
          translocoConfig: {
            availableLangs: ['en', 'es'],
            defaultLang: 'en',
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.variant()).toBe('dropdown');
      expect(component.size()).toBe('md');
    });

    it('should accept custom input values', () => {
      fixture.componentRef.setInput('variant', 'inline');
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();

      expect(component.variant()).toBe('inline');
      expect(component.size()).toBe('sm');
    });

    it('should have all available languages', () => {
      expect(component.languages).toBe(LANGUAGES);
      expect(component.languages.length).toBe(2);
    });
  });

  describe('Dropdown Variant', () => {
    it('should render dropdown variant by default', () => {
      const button = nativeElement.querySelector('.language-switcher__button');
      expect(button).toBeTruthy();
    });

    it('should toggle dropdown when button is clicked', () => {
      const button = nativeElement.querySelector('.language-switcher__button') as HTMLButtonElement;

      expect(component.isOpen()).toBe(false);

      button.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);

      button.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should show dropdown content when open', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const dropdown = nativeElement.querySelector('.language-switcher__dropdown');
      expect(dropdown).toBeTruthy();
    });

    it('should display current language code in button', () => {
      const code = nativeElement.querySelector('.language-switcher__code') as HTMLElement;
      expect(code.textContent).toContain('EN');
    });

    it('should show all language options in dropdown', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const options = nativeElement.querySelectorAll('.language-switcher__option');
      expect(options.length).toBe(LANGUAGES.length);
    });

    it('should close dropdown after selecting a language', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const option = nativeElement.querySelector('.language-switcher__option') as HTMLElement;
      option.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Inline Variant', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('variant', 'inline');
      fixture.detectChanges();
    });

    it('should render inline buttons', () => {
      const inlineButtons = nativeElement.querySelectorAll('.language-switcher__inline-button');
      expect(inlineButtons.length).toBe(LANGUAGES.length);
    });

    it('should highlight active language', () => {
      const activeButton = nativeElement.querySelector('.language-switcher__inline-button--active');
      expect(activeButton).toBeTruthy();
    });

    it('should change language when inline button is clicked', () => {
      const buttons = nativeElement.querySelectorAll('.language-switcher__inline-button');
      const spanishButton = Array.from(buttons).find((btn) =>
        btn.textContent.includes('ES'),
      ) as HTMLButtonElement;

      spanishButton.click();
      fixture.detectChanges();

      expect(component.currentLanguage().code).toBe('es');
    });
  });

  describe('Language Selection', () => {
    it('should change language when option is selected', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const options = nativeElement.querySelectorAll('.language-switcher__option');
      const spanishOption = Array.from(options).find((opt) => opt.textContent.includes('Español'));
      expect(spanishOption).toBeTruthy();

      (spanishOption as HTMLElement).click();
      fixture.detectChanges();

      expect(component.currentLanguage().code).toBe('es');
    });

    it('should change language when selectLanguage is called', () => {
      const spanishLang = LANGUAGES.find((l) => l.code === 'es');
      expect(spanishLang).toBeDefined();
      component.selectLanguage(spanishLang as (typeof LANGUAGES)[number]);
      fixture.detectChanges();

      expect(component.currentLanguage().code).toBe('es');
    });

    it('should close dropdown when language is selected', () => {
      component.toggleDropdown();
      expect(component.isOpen()).toBe(true);

      const spanishLang = LANGUAGES.find((l) => l.code === 'es');
      expect(spanishLang).toBeDefined();
      component.selectLanguage(spanishLang as (typeof LANGUAGES)[number]);
      expect(component.isOpen()).toBe(false);
    });

    it('should persist language preference to localStorage', () => {
      const spanishLang = LANGUAGES.find((l) => l.code === 'es');
      expect(spanishLang).toBeDefined();
      component.selectLanguage(spanishLang as (typeof LANGUAGES)[number]);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(localStorage.setItem).toHaveBeenCalledWith('preferred-language', 'es');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open dropdown with Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });

      component.handleKeydown(event);

      expect(component.isOpen()).toBe(true);
    });

    it('should open dropdown with Space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });

      component.handleKeydown(event);

      expect(component.isOpen()).toBe(true);
    });

    it('should close dropdown with Escape key', () => {
      component.toggleDropdown();
      const event = new KeyboardEvent('keydown', { key: 'Escape' });

      component.handleKeydown(event);

      expect(component.isOpen()).toBe(false);
    });

    it('should close dropdown with Tab key', () => {
      component.toggleDropdown();
      const event = new KeyboardEvent('keydown', { key: 'Tab' });

      component.handleKeydown(event);

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-expanded on dropdown button', () => {
      const button = nativeElement.querySelector('.language-switcher__button');

      expect(button?.getAttribute('aria-expanded')).toBe('false');

      component.toggleDropdown();
      fixture.detectChanges();

      expect(button?.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have aria-haspopup on dropdown button', () => {
      const button = nativeElement.querySelector('.language-switcher__button');
      expect(button?.getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('should have role listbox on menu', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const menu = nativeElement.querySelector('.language-switcher__menu');
      expect(menu?.getAttribute('role')).toBe('listbox');
    });

    it('should have role option on each language option', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const options = nativeElement.querySelectorAll('.language-switcher__option');
      options.forEach((option) => {
        expect(option.getAttribute('role')).toBe('option');
      });
    });

    it('should have aria-selected on selected option', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const selectedOption = nativeElement.querySelector('.language-switcher__option--selected');
      expect(selectedOption?.getAttribute('aria-selected')).toBe('true');
    });

    it('should have aria-pressed on inline buttons', () => {
      fixture.componentRef.setInput('variant', 'inline');
      fixture.detectChanges();

      const activeButton = nativeElement.querySelector('.language-switcher__inline-button--active');
      expect(activeButton?.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('CSS Classes', () => {
    it('should generate correct picker classes', () => {
      expect(component.pickerClasses()).toContain('language-switcher');
      expect(component.pickerClasses()).toContain('language-switcher--md');
      expect(component.pickerClasses()).toContain('language-switcher--dropdown');
    });

    it('should update classes when size changes', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();

      expect(component.pickerClasses()).toContain('language-switcher--sm');
    });

    it('should update classes when variant changes', () => {
      fixture.componentRef.setInput('variant', 'inline');
      fixture.detectChanges();

      expect(component.pickerClasses()).toContain('language-switcher--inline');
    });
  });

  describe('Current Language', () => {
    it('should return default language initially', () => {
      expect(component.currentLanguage().code).toBe('en');
      expect(component.currentLanguage().nativeName).toBe('English');
    });

    it('should update current language when changed', () => {
      const spanishLang = LANGUAGES.find((l) => l.code === 'es');
      expect(spanishLang).toBeDefined();
      component.selectLanguage(spanishLang as (typeof LANGUAGES)[number]);

      expect(component.currentLanguage().code).toBe('es');
      expect(component.currentLanguage().nativeName).toBe('Español');
    });
  });

  describe('Dropdown ARIA Label', () => {
    it('should compute dropdown aria label with current language', () => {
      const ariaLabel = component.dropdownAriaLabel();
      expect(ariaLabel).toContain('English');
    });
  });
});
