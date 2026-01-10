// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { THEMES } from '@core/services';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { By } from '@angular/platform-browser';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { ThemePickerComponent } from './theme-picker.component';

describe('ThemePickerComponent', () => {
  let component: ThemePickerComponent;
  let fixture: ComponentFixture<ThemePickerComponent>;
  let nativeElement: HTMLElement;

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

    await TestBed.configureTestingModule({
      imports: [ThemePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemePickerComponent);
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
      expect(component.showLabels()).toBe(true);
      expect(component.groupByCategory()).toBe(false);
      expect(component.ariaLabel()).toBe('Select theme');
    });

    it('should accept custom input values', () => {
      fixture.componentRef.setInput('variant', 'grid');
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('showLabels', false);
      fixture.componentRef.setInput('groupByCategory', true);
      fixture.componentRef.setInput('ariaLabel', 'Choose theme');
      fixture.detectChanges();

      expect(component.variant()).toBe('grid');
      expect(component.size()).toBe('lg');
      expect(component.showLabels()).toBe(false);
      expect(component.groupByCategory()).toBe(true);
      expect(component.ariaLabel()).toBe('Choose theme');
    });
  });

  describe('Dropdown Variant', () => {
    it('should render dropdown variant by default', () => {
      const trigger = nativeElement.querySelector('.theme-picker__trigger');
      expect(trigger).toBeTruthy();
    });

    it('should toggle dropdown when trigger is clicked', () => {
      const trigger = nativeElement.querySelector('.theme-picker__trigger') as HTMLButtonElement;

      expect(component.isOpen()).toBe(false);

      trigger.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);

      trigger.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should show dropdown content when open', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const dropdown = nativeElement.querySelector('.theme-picker__dropdown');
      expect(dropdown).toBeTruthy();
    });

    it('should display current theme in trigger', () => {
      const label = nativeElement.querySelector('.theme-picker__label') as HTMLElement;
      expect(label.textContent).toBe('Daylight');
    });

    it('should hide label when showLabels is false', () => {
      fixture.componentRef.setInput('showLabels', false);
      fixture.detectChanges();

      const label = nativeElement.querySelector('.theme-picker__label');
      expect(label).toBeFalsy();
    });

    it('should show all theme options in dropdown', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const options = nativeElement.querySelectorAll('.theme-picker__option');
      expect(options.length).toBe(THEMES.length);
    });

    it('should close dropdown after selecting a theme', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const option = nativeElement.querySelector('.theme-picker__option') as HTMLButtonElement;
      option.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });

    it('should close dropdown when clicking outside', () => {
      component.toggleDropdown();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      document.body.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Grid Variant', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('variant', 'grid');
      fixture.detectChanges();
    });

    it('should render grid variant', () => {
      const grid = nativeElement.querySelector('.theme-picker__grid');
      expect(grid).toBeTruthy();
    });

    it('should show all themes as grid items', () => {
      const gridItems = nativeElement.querySelectorAll('.theme-picker__grid-item');
      expect(gridItems.length).toBe(THEMES.length);
    });

    it('should highlight active theme', () => {
      const activeItem = nativeElement.querySelector('.theme-picker__grid-item--active');
      expect(activeItem).toBeTruthy();
    });

    it('should show labels in grid variant', () => {
      const labels = nativeElement.querySelectorAll('.theme-picker__grid-label');
      expect(labels.length).toBe(THEMES.length);
    });

    it('should hide labels when showLabels is false', () => {
      fixture.componentRef.setInput('showLabels', false);
      fixture.detectChanges();

      const labels = nativeElement.querySelectorAll('.theme-picker__grid-label');
      expect(labels.length).toBe(0);
    });

    it('should select theme when grid item is clicked', () => {
      const gridItems = nativeElement.querySelectorAll('.theme-picker__grid-item');
      const darkItem = Array.from(gridItems).find(
        (item) => item.getAttribute('aria-label')?.includes('Midnight') ?? false,
      ) as HTMLButtonElement;

      darkItem.click();
      fixture.detectChanges();

      expect(component.currentTheme().id).toBe('dark-default');
    });
  });

  describe('Inline Variant', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('variant', 'inline');
      fixture.detectChanges();
    });

    it('should render inline variant', () => {
      const inline = nativeElement.querySelector('.theme-picker__inline');
      expect(inline).toBeTruthy();
    });

    it('should show all themes as inline options', () => {
      const inlineOptions = nativeElement.querySelectorAll('.theme-picker__inline-option');
      expect(inlineOptions.length).toBe(THEMES.length);
    });

    it('should highlight active theme', () => {
      const activeOption = nativeElement.querySelector('.theme-picker__inline-option--active');
      expect(activeOption).toBeTruthy();
    });

    it('should use radiogroup role', () => {
      const inline = nativeElement.querySelector('.theme-picker__inline') as HTMLElement;
      expect(inline.getAttribute('role')).toBe('radiogroup');
    });

    it('should select theme when inline option is clicked', () => {
      const inlineOptions = nativeElement.querySelectorAll('.theme-picker__inline-option');
      const darkOption = Array.from(inlineOptions).find(
        (item) => item.getAttribute('aria-label')?.includes('Midnight') ?? false,
      ) as HTMLButtonElement;

      darkOption.click();
      fixture.detectChanges();

      expect(component.currentTheme().id).toBe('dark-default');
    });
  });

  describe('Icon Variant', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('variant', 'icon');
      fixture.detectChanges();
    });

    it('should render icon variant', () => {
      const wrapper = nativeElement.querySelector('.theme-picker__icon-wrapper');
      expect(wrapper).toBeTruthy();
    });

    it('should have icon trigger button', () => {
      const trigger = nativeElement.querySelector('.theme-picker__icon-trigger');
      expect(trigger).toBeTruthy();
    });

    it('should display paint brush icon', () => {
      const icon = nativeElement.querySelector('eb-icon[name="matFormatPaint"]');
      expect(icon).toBeTruthy();
    });

    it('should have tooltip on icon trigger', () => {
      const triggerDebugEl = fixture.debugElement.query(By.css('.theme-picker__icon-trigger'));
      const tooltipDirective = triggerDebugEl.injector.get(TooltipDirective);
      expect(tooltipDirective).toBeTruthy();
      expect(tooltipDirective.ebTooltip()).toBe('Change theme');
    });

    it('should toggle dropdown when icon is clicked', () => {
      const trigger = nativeElement.querySelector(
        '.theme-picker__icon-trigger',
      ) as HTMLButtonElement;
      expect(component.isOpen()).toBe(false);

      trigger.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);

      const dropdown = nativeElement.querySelector('.theme-picker__dropdown');
      expect(dropdown).toBeTruthy();
    });

    it('should have correct aria labels', () => {
      const trigger = nativeElement.querySelector('.theme-picker__icon-trigger');
      expect(trigger?.getAttribute('aria-label')).toContain('Change theme');
    });
  });

  describe('Theme Selection', () => {
    it('should change theme when option is selected', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const options = nativeElement.querySelectorAll('.theme-picker__option');
      const darkOption = Array.from(options).find((opt) =>
        opt.textContent.includes('Midnight'),
      ) as HTMLButtonElement;

      darkOption.click();
      fixture.detectChanges();

      expect(component.currentTheme().id).toBe('dark-default');
    });

    it('should change theme when selectTheme is called', () => {
      component.selectTheme('dark-cool');
      fixture.detectChanges();

      expect(component.currentTheme().id).toBe('dark-cool');
    });

    it('should close dropdown when theme is selected', () => {
      component.toggleDropdown();
      expect(component.isOpen()).toBe(true);

      component.selectTheme('dark-default');
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Grouped Categories', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('groupByCategory', true);
      component.toggleDropdown();
      fixture.detectChanges();
    });

    it('should show category groups', () => {
      const groups = nativeElement.querySelectorAll('.theme-picker__group');
      expect(groups.length).toBe(3); // light, dark, highContrast
    });

    it('should show category labels', () => {
      const labels = nativeElement.querySelectorAll('.theme-picker__group-label');
      const labelTexts = Array.from(labels).map((l) => l.textContent);

      expect(labelTexts).toContain('Light');
      expect(labelTexts).toContain('Dark');
      expect(labelTexts).toContain('High Contrast');
    });

    it('should select theme when grouped option is clicked', () => {
      const options = nativeElement.querySelectorAll('.theme-picker__option');
      const darkOption = Array.from(options).find((opt) =>
        opt.textContent.includes('Midnight'),
      ) as HTMLButtonElement;

      darkOption.click();
      fixture.detectChanges();

      expect(component.currentTheme().id).toBe('dark-default');
      expect(component.isOpen()).toBe(false);
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

    it('should open dropdown with ArrowDown key when closed', () => {
      expect(component.isOpen()).toBe(false);

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.handleKeydown(event);

      expect(component.isOpen()).toBe(true);
    });

    it('should navigate down with ArrowDown key when open', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.handleKeydown(event);

      expect(component.focusedIndex()).toBe(1);
    });

    it('should open dropdown with ArrowUp key when closed', () => {
      expect(component.isOpen()).toBe(false);

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      component.handleKeydown(event);

      expect(component.isOpen()).toBe(true);
    });

    it('should navigate up with ArrowUp key when open', () => {
      component.toggleDropdown();
      component.focusedIndex.set(2);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      component.handleKeydown(event);

      expect(component.focusedIndex()).toBe(1);
    });

    it('should go to first option with Home key', () => {
      component.toggleDropdown();
      component.focusedIndex.set(3);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Home' });
      component.handleKeydown(event);

      expect(component.focusedIndex()).toBe(0);
    });

    it('should go to last option with End key', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'End' });
      component.handleKeydown(event);

      expect(component.focusedIndex()).toBe(THEMES.length - 1);
    });

    it('should close dropdown with Tab key', () => {
      component.toggleDropdown();
      const event = new KeyboardEvent('keydown', { key: 'Tab' });

      component.handleKeydown(event);

      expect(component.isOpen()).toBe(false);
    });

    it('should select focused theme with Enter when dropdown is open', () => {
      component.toggleDropdown();
      component.focusedIndex.set(2);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.handleKeydown(event);

      expect(component.currentTheme().id).toBe(THEMES[2].id);
    });

    it('should not do anything when Home is pressed and dropdown is closed', () => {
      expect(component.isOpen()).toBe(false);
      const initialIndex = component.focusedIndex();

      const event = new KeyboardEvent('keydown', { key: 'Home' });
      component.handleKeydown(event);

      expect(component.focusedIndex()).toBe(initialIndex);
      expect(component.isOpen()).toBe(false);
    });

    it('should not do anything when End is pressed and dropdown is closed', () => {
      expect(component.isOpen()).toBe(false);
      const initialIndex = component.focusedIndex();

      const event = new KeyboardEvent('keydown', { key: 'End' });
      component.handleKeydown(event);

      expect(component.focusedIndex()).toBe(initialIndex);
      expect(component.isOpen()).toBe(false);
    });

    it('should not select theme when Enter is pressed with negative focused index', () => {
      component.toggleDropdown();
      component.focusedIndex.set(-1);
      fixture.detectChanges();

      const currentThemeId = component.currentTheme().id;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.handleKeydown(event);

      // Should not change theme
      expect(component.currentTheme().id).toBe(currentThemeId);
    });

    it('should not select theme when Enter is pressed with out-of-bounds focused index', () => {
      component.toggleDropdown();
      component.focusedIndex.set(999);
      fixture.detectChanges();

      const currentThemeId = component.currentTheme().id;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.handleKeydown(event);

      // Should not change theme
      expect(component.currentTheme().id).toBe(currentThemeId);
    });

    it('should not navigate beyond first theme with ArrowUp', () => {
      component.toggleDropdown();
      component.focusedIndex.set(0);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      component.handleKeydown(event);

      expect(component.focusedIndex()).toBe(0);
    });

    it('should not navigate beyond last theme with ArrowDown', () => {
      component.toggleDropdown();
      component.focusedIndex.set(THEMES.length - 1);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.handleKeydown(event);

      expect(component.focusedIndex()).toBe(THEMES.length - 1);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on dropdown', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const dropdown = nativeElement.querySelector('.theme-picker__dropdown');
      expect(dropdown?.getAttribute('aria-label')).toBe('Select theme');
    });

    it('should have role listbox on dropdown', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const dropdown = nativeElement.querySelector('.theme-picker__dropdown');
      expect(dropdown?.getAttribute('role')).toBe('listbox');
    });

    it('should have aria-expanded on dropdown trigger', () => {
      const trigger = nativeElement.querySelector('.theme-picker__trigger');

      expect(trigger?.getAttribute('aria-expanded')).toBe('false');

      component.toggleDropdown();
      fixture.detectChanges();

      expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have aria-haspopup on dropdown trigger', () => {
      const trigger = nativeElement.querySelector('.theme-picker__trigger');
      expect(trigger?.getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('should have role option on each theme option', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const options = nativeElement.querySelectorAll('.theme-picker__option');
      options.forEach((option) => {
        expect(option.getAttribute('role')).toBe('option');
      });
    });

    it('should have aria-selected on active option', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const activeOption = nativeElement.querySelector('.theme-picker__option--active');
      expect(activeOption?.getAttribute('aria-selected')).toBe('true');
    });

    it('should use role radio for inline variant', () => {
      fixture.componentRef.setInput('variant', 'inline');
      fixture.detectChanges();

      const options = nativeElement.querySelectorAll('.theme-picker__inline-option');
      options.forEach((option) => {
        expect(option.getAttribute('role')).toBe('radio');
      });
    });

    it('should have aria-checked for inline variant', () => {
      fixture.componentRef.setInput('variant', 'inline');
      fixture.detectChanges();

      const activeOption = nativeElement.querySelector('.theme-picker__inline-option--active');
      expect(activeOption?.getAttribute('aria-checked')).toBe('true');
    });
  });

  describe('CSS Classes', () => {
    it('should generate correct picker classes', () => {
      expect(component.pickerClasses()).toContain('theme-picker');
      expect(component.pickerClasses()).toContain('theme-picker--md');
      expect(component.pickerClasses()).toContain('theme-picker--dropdown');
    });

    it('should update classes when size changes', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      expect(component.pickerClasses()).toContain('theme-picker--lg');
    });

    it('should update classes when variant changes', () => {
      fixture.componentRef.setInput('variant', 'grid');
      fixture.detectChanges();

      expect(component.pickerClasses()).toContain('theme-picker--grid');
    });
  });

  describe('Theme Preview', () => {
    it('should generate preview for light themes', () => {
      const lightTheme = THEMES.find((t) => t.category === 'light');
      if (lightTheme) {
        const preview = component.getThemePreview(lightTheme);
        expect(preview).toContain('var(--color-background)');
        expect(preview).toContain('var(--color-primary)');
      }
    });

    it('should generate preview for dark themes', () => {
      const darkTheme = THEMES.find((t) => t.category === 'dark');
      if (darkTheme) {
        const preview = component.getThemePreview(darkTheme);
        expect(preview).toContain('var(--color-background)');
        expect(preview).toContain('var(--color-primary)');
      }
    });

    it('should generate preview for high-contrast themes', () => {
      const hcTheme = THEMES.find((t) => t.category === 'high-contrast-light');
      if (hcTheme) {
        const preview = component.getThemePreview(hcTheme);
        expect(preview).toContain('var(--color-background)');
        expect(preview).toContain('var(--color-primary)');
      }
    });

    it('should apply data-theme attribute to swatch', () => {
      component.toggleDropdown();
      fixture.detectChanges();

      const options = nativeElement.querySelectorAll('.theme-picker__option');
      const lightOption = Array.from(options).find((opt) =>
        opt.textContent.includes('Daylight'),
      ) as HTMLButtonElement;

      const swatch = lightOption.querySelector('.theme-picker__swatch');
      expect(swatch?.getAttribute('data-theme')).toBe('light-default');
    });

    it('should display swatch with theme preview', () => {
      const swatch = nativeElement.querySelector('.theme-picker__swatch') as HTMLElement;
      expect(swatch.style.background).toContain('linear-gradient');
    });
  });

  describe('Edge Cases', () => {
    it('should not close dropdown when clicking inside', () => {
      component.toggleDropdown();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      const trigger = nativeElement.querySelector('.theme-picker__dropdown');
      (trigger as HTMLElement).click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);
    });

    it('should correctly merge high contrast themes in grouped view', () => {
      const grouped = component.groupedThemes();
      const hcThemes = [...THEMES.filter((t) => t.category.includes('high-contrast'))];
      expect(grouped.highContrast.length).toBe(hcThemes.length);
      expect(grouped.highContrast[0].id).toBe(hcThemes[0].id);
    });

    it('should handle click with null target safely', () => {
      component.toggleDropdown();
      expect(component.isOpen()).toBe(true);

      // Simulate a click event with null target (e.g. detached element)
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: null });
      document.dispatchEvent(event);
      fixture.detectChanges();

      // Should remain open as target is not a Node outside
      expect(component.isOpen()).toBe(true);
    });
  });
});
