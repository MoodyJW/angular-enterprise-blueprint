// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ButtonComponent } from '@shared/components/button/button.component';
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
        ButtonComponent, // Import ButtonComponent
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

  describe('Initialization with Saved Preference', () => {
    it('should initialize with saved language if exists', async () => {
      // Restore mocks to set up a specific scenario
      vi.restoreAllMocks();

      const getItemMock = vi.fn().mockReturnValue('es');
      vi.stubGlobal('localStorage', {
        getItem: getItemMock,
      });

      // Re-create component to trigger ngOnInit
      TestBed.createComponent(LanguageSwitcherComponent);

      // We need to spy on TranslocoService provided in the test module
      // However, we are re-creating the fixture.
      // Easiest way is to define this BEFORE the global beforeEach runs,
      // OR modify how specific tests can override the beforeEach setup.
      // Since beforeEach runs for ALL, we can't easily "undo" it cleanly for just one test block without valid isolation.
      // Instead, we can verify the logic by spying on _loadSavedLanguage calls if possible,
      // or relying on the component state if our testbed wasn't already compiled.

      // Since TestBed is compiled in beforeEach, we can't cleanly change the provider behavior easily for init.
      // BUT `localStorage.getItem` is called during ngOnInit.
      // We mocked `localStorage` in beforeEach.

      // We can update the mock implementation for this test:
      const storageMock = {
        getItem: vi.fn().mockReturnValue('es'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      };
      vi.stubGlobal('localStorage', storageMock);

      // Create a new fixture to re-run ngOnInit with the new mock
      const initFixture = TestBed.createComponent(LanguageSwitcherComponent);
      const initComponent = initFixture.componentInstance;
      initFixture.detectChanges(); // Trigger ngOnInit

      // Wait for async operations (activeLang signal update)
      await initFixture.whenStable();

      expect(initComponent.currentLanguage().code).toBe('es');
    });
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
  });

  describe('Dropdown Variant', () => {
    it('should render dropdown trigger button', () => {
      const buttonDebugEl = fixture.debugElement.query(By.css('.language-switcher__button'));
      expect(buttonDebugEl).toBeTruthy();
    });

    it('should toggle dropdown when button is clicked', () => {
      const buttonDebugEl = fixture.debugElement.query(By.css('.language-switcher__button'));
      const buttonInstance = buttonDebugEl.componentInstance as ButtonComponent;

      expect(component.isOpen()).toBe(false);

      // Simulate output emission from eb-button
      buttonInstance.clicked.emit(new MouseEvent('click'));
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);

      buttonInstance.clicked.emit(new MouseEvent('click'));
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should display current language code', () => {
      const code = nativeElement.querySelector('.language-switcher__code') as HTMLElement;
      expect(code.textContent).toContain('EN');
    });
  });

  describe('Icon Variant', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('variant', 'icon');
      fixture.detectChanges();
    });

    it('should render icon trigger button (tertiary variant, iconOnly)', () => {
      const buttonDebugEl = fixture.debugElement.query(By.css('.language-switcher__icon-trigger'));
      expect(buttonDebugEl).toBeTruthy();

      const buttonInstance = buttonDebugEl.componentInstance as ButtonComponent;
      expect(buttonInstance.variant()).toBe('tertiary');
      expect(buttonInstance.iconOnly()).toBe(true);
    });

    it('should toggle dropdown when icon button is clicked', () => {
      const buttonDebugEl = fixture.debugElement.query(By.css('.language-switcher__icon-trigger'));
      const buttonInstance = buttonDebugEl.componentInstance as ButtonComponent;
      buttonInstance.clicked.emit(new MouseEvent('click'));
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);
    });

    it('should show dropdown menu when open', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const dropdown = nativeElement.querySelector('.language-switcher__dropdown');
      expect(dropdown).toBeTruthy();
    });
  });

  describe('Inline Variant', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('variant', 'inline');
      fixture.detectChanges();
    });

    it('should render inline buttons', () => {
      const inlineButtons = fixture.debugElement.queryAll(
        By.css('.language-switcher__inline-button'),
      );
      expect(inlineButtons.length).toBe(LANGUAGES.length);
    });

    it('should set primary variant for active language', () => {
      // Find the button for EN (default active)
      const buttons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
      const enButton = buttons.find((btn) =>
        (btn.nativeElement as HTMLElement).textContent.includes('EN'),
      );

      const instance = enButton?.componentInstance as ButtonComponent;
      expect(instance.variant()).toBe('primary');
    });

    it('should set ghost variant for inactive language', () => {
      // Find the button for ES
      const buttons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
      const esButton = buttons.find((btn) =>
        (btn.nativeElement as HTMLElement).textContent.includes('ES'),
      );

      const instance = esButton?.componentInstance as ButtonComponent;
      expect(instance).toBeTruthy();
      expect(instance.variant()).toBe('ghost');
    });

    it('should change language when inline button is clicked', () => {
      const buttons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
      const spanishButton = Array.from(buttons).find((btn) =>
        (btn.nativeElement as HTMLElement).textContent.includes('ES'),
      ) as unknown as { componentInstance: ButtonComponent };

      const instance = spanishButton.componentInstance;
      instance.clicked.emit(new MouseEvent('click'));
      fixture.detectChanges();

      expect(component.currentLanguage().code).toBe('es');
    });
  });

  // ... (Keep existing Logic/Accessibility tests if they don't rely on specific DOM structure that changed)
  // Re-implementing Language Selection and Accessibility briefly to align with eb-button

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
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleKeydown(event);

      expect(component.isOpen()).toBe(true);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should open dropdown with Space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleKeydown(event);

      expect(component.isOpen()).toBe(true);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not toggle if already open with Enter/Space', () => {
      component.toggleDropdown(); // Open it
      expect(component.isOpen()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.handleKeydown(event);

      // Should remain open (toggleDropdown is NOT called again in the implementation logic for redundancy,
      // actually the implementation checks `if (!this.isOpen())` so it strictly DOES NOT toggle close).
      expect(component.isOpen()).toBe(true);
    });

    it('should close dropdown with Escape key', () => {
      component.toggleDropdown();
      expect(component.isOpen()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleKeydown(event);

      expect(component.isOpen()).toBe(false);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should close dropdown with Tab key', () => {
      component.toggleDropdown();
      expect(component.isOpen()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      // Tab should NOT prevent default behavior (focus movement)
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleKeydown(event);

      expect(component.isOpen()).toBe(false);
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('Document Interaction', () => {
    it('should close dropdown when clicking outside element', () => {
      component.toggleDropdown();
      expect(component.isOpen()).toBe(true);

      // Create a mock event target that is NOT contained in the component
      const outsideTarget = document.createElement('div');
      const event = { target: outsideTarget } as unknown as MouseEvent;

      component.onDocumentClick(event);

      expect(component.isOpen()).toBe(false);
    });

    it('should NOT close dropdown when clicking inside element', () => {
      component.toggleDropdown();
      expect(component.isOpen()).toBe(true);

      // Mock contains to return true
      // We can't easily append to the fixture's element in jsdom without layout,
      // so checking if contains logic works is standard.
      // But better: pass the nativeElement itself as target
      const event = { target: nativeElement } as unknown as MouseEvent;

      component.onDocumentClick(event);

      expect(component.isOpen()).toBe(true);
    });

    it('should do nothing if dropdown is already closed', () => {
      expect(component.isOpen()).toBe(false);

      const outsideTarget = document.createElement('div');
      const event = { target: outsideTarget } as unknown as MouseEvent;

      const closeSpy = vi.spyOn(component, 'closeDropdown');

      component.onDocumentClick(event);

      expect(closeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Storage & Formatting', () => {
    it('should handle localStorage errors gracefully', () => {
      // Mock setItem to throw
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      component.toggleDropdown();
      fixture.detectChanges();

      const options = nativeElement.querySelectorAll('.language-switcher__option');
      const spanishOption = Array.from(options).find((opt) => opt.textContent.includes('Español'));
      (spanishOption as HTMLElement).click();

      // Should not throw and still update state
      expect(component.currentLanguage().code).toBe('es');
      expect(component.isOpen()).toBe(false);
    });
  });
});
