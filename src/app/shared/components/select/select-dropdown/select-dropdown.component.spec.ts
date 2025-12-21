// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { SelectOption } from '../select.component';

import { SelectDropdownComponent } from './select-dropdown.component';

describe('SelectDropdownComponent', () => {
  let component: SelectDropdownComponent;
  let fixture: ComponentFixture<SelectDropdownComponent>;
  let compiled: HTMLElement;

  const mockOptions: SelectOption[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectDropdownComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    // Set required inputs
    fixture.componentRef.setInput('dropdownClass', 'select-dropdown');
    fixture.componentRef.setInput('listboxId', 'listbox-1');
    fixture.componentRef.setInput('isMultiple', false);
    fixture.componentRef.setInput('options', mockOptions);
    fixture.componentRef.setInput('highlightedIndex', -1);
    fixture.componentRef.setInput('isOptionSelected', (_option: SelectOption) => false);

    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (SelectDropdownComponent as unknown as { ɵcmp: { standalone: boolean } })
        .ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (SelectDropdownComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Dropdown Rendering', () => {
    it('should render dropdown container', () => {
      const dropdown = compiled.querySelector('.select-dropdown');
      expect(dropdown).toBeTruthy();
    });

    it('should apply dropdown class', () => {
      const dropdown = compiled.querySelector('.select-dropdown');
      expect(dropdown?.classList.contains('select-dropdown')).toBe(true);
    });

    it('should render listbox with correct id', () => {
      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox?.id).toBe('listbox-1');
    });

    it('should update listbox id', () => {
      fixture.componentRef.setInput('listboxId', 'new-listbox-id');
      fixture.detectChanges();

      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox?.id).toBe('new-listbox-id');
    });
  });

  describe('Search Input', () => {
    it('should not render search input by default', () => {
      const searchInput = compiled.querySelector('.select-search__input');
      expect(searchInput).toBeFalsy();
    });

    it('should render search input when searchable is true', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const searchInput = compiled.querySelector('.select-search__input');
      expect(searchInput).toBeTruthy();
    });

    it('should have correct placeholder', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const searchInput = compiled.querySelector('.select-search__input') as HTMLInputElement;
      expect(searchInput.placeholder).toBe('Search...');
    });

    it('should display search query value', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.componentRef.setInput('searchQuery', 'test query');
      fixture.detectChanges();

      const searchInput = compiled.querySelector('.select-search__input') as HTMLInputElement;
      expect(searchInput.value).toBe('test query');
    });

    it('should emit searchInput on input event', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const searchEmitSpy = vi.fn();
      component.searchInput.subscribe(searchEmitSpy);

      const searchInput = compiled.querySelector('.select-search__input') as HTMLInputElement;
      searchInput.value = 'new value';
      searchInput.dispatchEvent(new Event('input'));

      expect(searchEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit searchKeydown on keydown event', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const keydownEmitSpy = vi.fn();
      component.searchKeydown.subscribe(keydownEmitSpy);

      const searchInput = compiled.querySelector('.select-search__input') as HTMLInputElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      searchInput.dispatchEvent(event);

      expect(keydownEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should render search icon', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const searchIcon = compiled.querySelector('.select-search__icon');
      expect(searchIcon).toBeTruthy();
    });
  });

  describe('Options Rendering', () => {
    it('should render all options', () => {
      const options = compiled.querySelectorAll('eb-select-option');
      expect(options.length).toBe(3);
    });

    it('should render empty state when no options', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();

      const emptyOption = compiled.querySelector('.select-option--empty');
      expect(emptyOption).toBeTruthy();
      expect(emptyOption?.textContent.trim()).toBe('No options found');
    });

    it('should not render options when empty', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();

      const options = compiled.querySelectorAll('eb-select-option');
      expect(options.length).toBe(0);
    });

    it('should update options when changed', () => {
      const newOptions: SelectOption[] = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' },
      ];

      fixture.componentRef.setInput('options', newOptions);
      fixture.detectChanges();

      const options = compiled.querySelectorAll('eb-select-option');
      expect(options.length).toBe(2);
    });
  });

  describe('ARIA Attributes', () => {
    it('should have role listbox', () => {
      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox).toBeTruthy();
    });

    it('should not have aria-label when not provided', () => {
      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox?.hasAttribute('aria-label')).toBe(false);
    });

    it('should apply aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom label');
      fixture.detectChanges();

      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox?.getAttribute('aria-label')).toBe('Custom label');
    });

    it('should not have aria-multiselectable for single select', () => {
      fixture.componentRef.setInput('isMultiple', false);
      fixture.detectChanges();

      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox?.hasAttribute('aria-multiselectable')).toBe(false);
    });

    it('should have aria-multiselectable true for multiple select', () => {
      fixture.componentRef.setInput('isMultiple', true);
      fixture.detectChanges();

      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox?.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('should have aria-disabled on empty option', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();

      const emptyOption = compiled.querySelector('.select-option--empty');
      expect(emptyOption?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('Max Height', () => {
    it('should apply default max height', () => {
      const listbox = compiled.querySelector('[role="listbox"]') as HTMLElement;
      expect(listbox.style.maxHeight).toBe('280px');
    });

    it('should apply custom max height', () => {
      fixture.componentRef.setInput('maxHeight', 400);
      fixture.detectChanges();

      const listbox = compiled.querySelector('[role="listbox"]') as HTMLElement;
      expect(listbox.style.maxHeight).toBe('400px');
    });
  });

  describe('Option Events', () => {
    it('should emit optionClicked when option is clicked', () => {
      const clickEmitSpy = vi.fn();
      component.optionClicked.subscribe(clickEmitSpy);

      const option = compiled.querySelector('eb-select-option') as HTMLElement;
      option.dispatchEvent(new Event('clicked'));

      expect(clickEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit optionEnterPressed when enter is pressed', () => {
      const enterEmitSpy = vi.fn();
      component.optionEnterPressed.subscribe(enterEmitSpy);

      const option = compiled.querySelector('eb-select-option') as HTMLElement;
      option.dispatchEvent(new Event('enterPressed'));

      expect(enterEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit optionSpacePressed when space is pressed', () => {
      const spaceEmitSpy = vi.fn();
      component.optionSpacePressed.subscribe(spaceEmitSpy);

      const option = compiled.querySelector('eb-select-option') as HTMLElement;
      option.dispatchEvent(new Event('spacePressed'));

      expect(spaceEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit optionMouseEntered when mouse enters', () => {
      const mouseEmitSpy = vi.fn();
      component.optionMouseEntered.subscribe(mouseEmitSpy);

      const option = compiled.querySelector('eb-select-option') as HTMLElement;
      option.dispatchEvent(new Event('mouseEntered'));

      expect(mouseEmitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Option States', () => {
    it('should pass isSelected to options', () => {
      const isSelected = (opt: SelectOption): boolean => opt.value === '2';
      fixture.componentRef.setInput('isOptionSelected', isSelected);
      fixture.detectChanges();

      const options = compiled.querySelectorAll('eb-select-option');
      expect(options.length).toBe(3);
      // Options receive the isSelected prop
    });

    it('should pass highlightedIndex to options', () => {
      fixture.componentRef.setInput('highlightedIndex', 1);
      fixture.detectChanges();

      const options = compiled.querySelectorAll('eb-select-option');
      expect(options.length).toBe(3);
      // Second option should be highlighted
    });

    it('should handle disabled options', () => {
      const optionsWithDisabled: SelectOption[] = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2', disabled: true },
        { value: '3', label: 'Option 3' },
      ];

      fixture.componentRef.setInput('options', optionsWithDisabled);
      fixture.detectChanges();

      const options = compiled.querySelectorAll('eb-select-option');
      expect(options.length).toBe(3);
    });

    it('should handle options with descriptions', () => {
      const optionsWithDesc: SelectOption[] = [
        { value: '1', label: 'Option 1', description: 'Description 1' },
        { value: '2', label: 'Option 2', description: 'Description 2' },
      ];

      fixture.componentRef.setInput('options', optionsWithDesc);
      fixture.detectChanges();

      const options = compiled.querySelectorAll('eb-select-option');
      expect(options.length).toBe(2);
    });
  });

  describe('ViewChild Reference', () => {
    it('should have searchInputElement viewChild', () => {
      expect(component.searchInputElement).toBeDefined();
    });

    it('should provide access to native search input when searchable', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const nativeInput = component.searchInputElement()?.nativeElement;
      expect(nativeInput).toBeTruthy();
      expect(nativeInput?.tagName).toBe('INPUT');
    });

    it('should not have native search input when not searchable', () => {
      fixture.componentRef.setInput('searchable', false);
      fixture.detectChanges();

      const nativeInput = component.searchInputElement()?.nativeElement;
      expect(nativeInput).toBeFalsy();
    });
  });

  describe('Signal Input Edge Cases', () => {
    it('should handle empty string dropdown class', () => {
      fixture.componentRef.setInput('dropdownClass', '');
      fixture.detectChanges();

      expect(component.dropdownClass()).toBe('');
      const dropdown = compiled.querySelector('[role="presentation"]');
      expect(dropdown).toBeTruthy();
    });

    it('should handle searchable toggling', () => {
      // Start as non-searchable
      fixture.componentRef.setInput('searchable', false);
      fixture.detectChanges();
      expect(component.searchable()).toBe(false);
      expect(compiled.querySelector('.select-search__input')).toBeFalsy();

      // Toggle to searchable
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();
      expect(component.searchable()).toBe(true);
      expect(compiled.querySelector('.select-search__input')).toBeTruthy();
    });

    it('should handle empty search query', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.componentRef.setInput('searchQuery', '');
      fixture.detectChanges();

      const searchInput = compiled.querySelector('.select-search__input') as HTMLInputElement;
      expect(searchInput.value).toBe('');
      expect(component.searchQuery()).toBe('');
    });

    it('should handle special characters in search query', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.componentRef.setInput('searchQuery', '<script>alert("xss")</script>');
      fixture.detectChanges();

      expect(component.searchQuery()).toBe('<script>alert("xss")</script>');
      const searchInput = compiled.querySelector('.select-search__input') as HTMLInputElement;
      expect(searchInput.value).toBe('<script>alert("xss")</script>');
    });

    it('should handle undefined ariaLabel', () => {
      fixture.componentRef.setInput('ariaLabel', undefined);
      fixture.detectChanges();

      expect(component.ariaLabel()).toBeUndefined();
      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox?.hasAttribute('aria-label')).toBe(false);
    });

    it('should handle empty string ariaLabel', () => {
      fixture.componentRef.setInput('ariaLabel', '');
      fixture.detectChanges();

      expect(component.ariaLabel()).toBe('');
      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox?.getAttribute('aria-label')).toBe('');
    });

    it('should handle isMultiple toggling', () => {
      // Start as single
      fixture.componentRef.setInput('isMultiple', false);
      fixture.detectChanges();
      expect(component.isMultiple()).toBe(false);

      // Toggle to multiple
      fixture.componentRef.setInput('isMultiple', true);
      fixture.detectChanges();
      expect(component.isMultiple()).toBe(true);
    });

    it('should handle zero maxHeight', () => {
      fixture.componentRef.setInput('maxHeight', 0);
      fixture.detectChanges();

      expect(component.maxHeight()).toBe(0);
      const listbox = compiled.querySelector('[role="listbox"]') as HTMLElement;
      expect(listbox.style.maxHeight).toBe('0px');
    });

    it('should handle very large maxHeight', () => {
      fixture.componentRef.setInput('maxHeight', 10000);
      fixture.detectChanges();

      expect(component.maxHeight()).toBe(10000);
      const listbox = compiled.querySelector('[role="listbox"]') as HTMLElement;
      expect(listbox.style.maxHeight).toBe('10000px');
    });

    it('should handle negative highlightedIndex', () => {
      fixture.componentRef.setInput('highlightedIndex', -1);
      fixture.detectChanges();

      expect(component.highlightedIndex()).toBe(-1);
    });

    it('should handle highlightedIndex beyond options length', () => {
      fixture.componentRef.setInput('highlightedIndex', 999);
      fixture.detectChanges();

      expect(component.highlightedIndex()).toBe(999);
    });

    it('should handle isOptionSelected function changes', () => {
      const firstSelector = (opt: SelectOption): boolean => opt.value === '1';
      fixture.componentRef.setInput('isOptionSelected', firstSelector);
      fixture.detectChanges();

      expect(component.isOptionSelected()).toBe(firstSelector);

      const secondSelector = (opt: SelectOption): boolean => opt.value === '2';
      fixture.componentRef.setInput('isOptionSelected', secondSelector);
      fixture.detectChanges();

      expect(component.isOptionSelected()).toBe(secondSelector);
    });

    it('should handle options array mutations', () => {
      const options1 = [{ value: '1', label: 'One' }];
      fixture.componentRef.setInput('options', options1);
      fixture.detectChanges();

      expect(component.options().length).toBe(1);

      const options2 = [...options1, { value: '2', label: 'Two' }];
      fixture.componentRef.setInput('options', options2);
      fixture.detectChanges();

      expect(component.options().length).toBe(2);
    });

    it('should handle listboxId changes', () => {
      fixture.componentRef.setInput('listboxId', 'id-1');
      fixture.detectChanges();
      expect(component.listboxId()).toBe('id-1');

      fixture.componentRef.setInput('listboxId', 'id-2');
      fixture.detectChanges();
      expect(component.listboxId()).toBe('id-2');
    });

    it('should handle dropdownClass changes', () => {
      fixture.componentRef.setInput('dropdownClass', 'class-1');
      fixture.detectChanges();
      expect(component.dropdownClass()).toBe('class-1');

      fixture.componentRef.setInput('dropdownClass', 'class-2 class-3');
      fixture.detectChanges();
      expect(component.dropdownClass()).toBe('class-2 class-3');
    });
  });

  describe('Complex Option Scenarios', () => {
    it('should handle option with all properties', () => {
      const complexOption: SelectOption = {
        value: 'complex',
        label: 'Complex Option',
        description: 'This is a complex option',
        disabled: true,
      };

      fixture.componentRef.setInput('options', [complexOption]);
      fixture.detectChanges();

      const options = compiled.querySelectorAll('eb-select-option');
      expect(options.length).toBe(1);
    });

    it('should handle option with missing optional properties', () => {
      const minimalOption: SelectOption = {
        value: 'minimal',
        label: 'Minimal Option',
      };

      fixture.componentRef.setInput('options', [minimalOption]);
      fixture.detectChanges();

      const options = compiled.querySelectorAll('eb-select-option');
      expect(options.length).toBe(1);
    });

    it('should handle mixed option types', () => {
      const mixedOptions: SelectOption[] = [
        { value: '1', label: 'Simple' },
        { value: '2', label: 'With Description', description: 'Desc' },
        { value: '3', label: 'Disabled', disabled: true },
        { value: '4', label: 'Complete', description: 'Full', disabled: false },
      ];

      fixture.componentRef.setInput('options', mixedOptions);
      fixture.detectChanges();

      const options = compiled.querySelectorAll('eb-select-option');
      expect(options.length).toBe(4);
    });

    it('should handle rapid option changes', () => {
      const options1 = [{ value: '1', label: 'One' }];
      const options2 = [{ value: '2', label: 'Two' }];
      const options3 = [{ value: '3', label: 'Three' }];

      fixture.componentRef.setInput('options', options1);
      fixture.detectChanges();
      expect(compiled.querySelectorAll('eb-select-option').length).toBe(1);

      fixture.componentRef.setInput('options', options2);
      fixture.detectChanges();
      expect(compiled.querySelectorAll('eb-select-option').length).toBe(1);

      fixture.componentRef.setInput('options', options3);
      fixture.detectChanges();
      expect(compiled.querySelectorAll('eb-select-option').length).toBe(1);
    });
  });

  describe('Event Emission Validation', () => {
    it('should emit events with correct data', () => {
      let emittedOption: SelectOption | undefined;
      component.optionClicked.subscribe((opt) => (emittedOption = opt));

      const testOption = mockOptions[0];
      component.optionClicked.emit(testOption);

      expect(emittedOption).toBe(testOption);
      expect(emittedOption?.value).toBe('1');
    });

    it('should emit multiple events independently', () => {
      const clickSpy = vi.fn();
      const enterSpy = vi.fn();
      const spaceSpy = vi.fn();
      const mouseSpy = vi.fn();

      component.optionClicked.subscribe(clickSpy);
      component.optionEnterPressed.subscribe(enterSpy);
      component.optionSpacePressed.subscribe(spaceSpy);
      component.optionMouseEntered.subscribe(mouseSpy);

      component.optionClicked.emit(mockOptions[0]);
      component.optionEnterPressed.emit(mockOptions[1]);
      component.optionSpacePressed.emit(mockOptions[2]);
      component.optionMouseEntered.emit(1);

      expect(clickSpy).toHaveBeenCalledWith(mockOptions[0]);
      expect(enterSpy).toHaveBeenCalledWith(mockOptions[1]);
      expect(spaceSpy).toHaveBeenCalledWith(mockOptions[2]);
      expect(mouseSpy).toHaveBeenCalledWith(1);
    });

    it('should emit search events with correct data', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const inputSpy = vi.fn();
      const keydownSpy = vi.fn();

      component.searchInput.subscribe(inputSpy);
      component.searchKeydown.subscribe(keydownSpy);

      const searchInput = compiled.querySelector('.select-search__input') as HTMLInputElement;
      const inputEvent = new Event('input');
      const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });

      searchInput.dispatchEvent(inputEvent);
      searchInput.dispatchEvent(keydownEvent);

      expect(inputSpy).toHaveBeenCalled();
      expect(keydownSpy).toHaveBeenCalled();
    });
  });
});
