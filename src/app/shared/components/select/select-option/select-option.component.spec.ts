// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { SelectOptionComponent } from './select-option.component';

describe('SelectOptionComponent', () => {
  let component: SelectOptionComponent;
  let fixture: ComponentFixture<SelectOptionComponent>;
  let compiled: HTMLElement;
  let listItem: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectOptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectOptionComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    // Set required inputs
    fixture.componentRef.setInput('isSelected', false);
    fixture.componentRef.setInput('isDisabled', false);
    fixture.componentRef.setInput('isHighlighted', false);
    fixture.componentRef.setInput('isMultiple', false);
    fixture.componentRef.setInput('index', 0);
    fixture.componentRef.setInput('label', 'Test Option');

    fixture.detectChanges();
    listItem = compiled.querySelector('li') as HTMLElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (SelectOptionComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (SelectOptionComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Option Rendering', () => {
    it('should render list item element', () => {
      expect(listItem).toBeTruthy();
    });

    it('should have role option', () => {
      expect(listItem.getAttribute('role')).toBe('option');
    });

    it('should apply option class', () => {
      expect(listItem.classList.contains('select-option')).toBe(true);
    });

    it('should apply custom option class', () => {
      fixture.componentRef.setInput('optionClass', 'custom-option');
      fixture.detectChanges();

      expect(listItem.classList.contains('custom-option')).toBe(true);
    });

    it('should display label', () => {
      const label = listItem.querySelector('.select-option__label');
      expect(label?.textContent.trim()).toBe('Test Option');
    });

    it('should update label', () => {
      fixture.componentRef.setInput('label', 'Updated Option');
      fixture.detectChanges();

      const label = listItem.querySelector('.select-option__label');
      expect(label?.textContent.trim()).toBe('Updated Option');
    });
  });

  describe('Option Description', () => {
    it('should not render description by default', () => {
      const description = listItem.querySelector('.select-option__description');
      expect(description).toBeFalsy();
    });

    it('should render description when provided', () => {
      fixture.componentRef.setInput('description', 'Test description');
      fixture.detectChanges();

      const description = listItem.querySelector('.select-option__description');
      expect(description).toBeTruthy();
      expect(description?.textContent.trim()).toBe('Test description');
    });

    it('should update description', () => {
      fixture.componentRef.setInput('description', 'Original description');
      fixture.detectChanges();

      fixture.componentRef.setInput('description', 'Updated description');
      fixture.detectChanges();

      const description = listItem.querySelector('.select-option__description');
      expect(description?.textContent.trim()).toBe('Updated description');
    });
  });

  describe('Selected State', () => {
    it('should not have selected class by default', () => {
      expect(listItem.classList.contains('select-option--selected')).toBe(false);
    });

    it('should add selected class when selected', () => {
      fixture.componentRef.setInput('isSelected', true);
      fixture.detectChanges();

      expect(listItem.classList.contains('select-option--selected')).toBe(true);
    });

    it('should remove selected class when not selected', () => {
      fixture.componentRef.setInput('isSelected', false);
      fixture.detectChanges();

      expect(listItem.classList.contains('select-option--selected')).toBe(false);
    });

    it('should have aria-selected false when not selected', () => {
      fixture.componentRef.setInput('isSelected', false);
      fixture.detectChanges();

      expect(listItem.getAttribute('aria-selected')).toBe('false');
    });

    it('should have aria-selected true when selected', () => {
      fixture.componentRef.setInput('isSelected', true);
      fixture.detectChanges();

      expect(listItem.getAttribute('aria-selected')).toBe('true');
    });
  });

  describe('Disabled State', () => {
    it('should not have disabled class by default', () => {
      expect(listItem.classList.contains('select-option--disabled')).toBe(false);
    });

    it('should add disabled class when disabled', () => {
      fixture.componentRef.setInput('isDisabled', true);
      fixture.detectChanges();

      expect(listItem.classList.contains('select-option--disabled')).toBe(true);
    });

    it('should remove disabled class when not disabled', () => {
      fixture.componentRef.setInput('isDisabled', false);
      fixture.detectChanges();

      expect(listItem.classList.contains('select-option--disabled')).toBe(false);
    });

    it('should not have aria-disabled when not disabled', () => {
      fixture.componentRef.setInput('isDisabled', false);
      fixture.detectChanges();

      expect(listItem.hasAttribute('aria-disabled')).toBe(false);
    });

    it('should have aria-disabled true when disabled', () => {
      fixture.componentRef.setInput('isDisabled', true);
      fixture.detectChanges();

      expect(listItem.getAttribute('aria-disabled')).toBe('true');
    });

    it('should have tabindex 0 when not disabled', () => {
      fixture.componentRef.setInput('isDisabled', false);
      fixture.detectChanges();

      expect(listItem.tabIndex).toBe(0);
    });

    it('should have tabindex -1 when disabled', () => {
      fixture.componentRef.setInput('isDisabled', true);
      fixture.detectChanges();

      expect(listItem.tabIndex).toBe(-1);
    });
  });

  describe('Highlighted State', () => {
    it('should not have highlighted class by default', () => {
      expect(listItem.classList.contains('select-option--highlighted')).toBe(false);
    });

    it('should add highlighted class when highlighted', () => {
      fixture.componentRef.setInput('isHighlighted', true);
      fixture.detectChanges();

      expect(listItem.classList.contains('select-option--highlighted')).toBe(true);
    });

    it('should remove highlighted class when not highlighted', () => {
      fixture.componentRef.setInput('isHighlighted', false);
      fixture.detectChanges();

      expect(listItem.classList.contains('select-option--highlighted')).toBe(false);
    });
  });

  describe('Index Attribute', () => {
    it('should have data-index attribute', () => {
      expect(listItem.getAttribute('data-index')).toBe('0');
    });

    it('should update data-index attribute', () => {
      fixture.componentRef.setInput('index', 5);
      fixture.detectChanges();

      expect(listItem.getAttribute('data-index')).toBe('5');
    });
  });

  describe('Single Select Mode', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('isMultiple', false);
      fixture.detectChanges();
    });

    it('should not render checkbox', () => {
      const checkbox = listItem.querySelector('.select-option__checkbox');
      expect(checkbox).toBeFalsy();
    });

    it('should not render check mark when not selected', () => {
      fixture.componentRef.setInput('isSelected', false);
      fixture.detectChanges();

      const checkMark = listItem.querySelector('.select-option__check');
      expect(checkMark).toBeFalsy();
    });

    it('should render check mark when selected', () => {
      fixture.componentRef.setInput('isSelected', true);
      fixture.detectChanges();

      const checkMark = listItem.querySelector('.select-option__check');
      expect(checkMark).toBeTruthy();
    });

    it('should render check icon when selected', () => {
      fixture.componentRef.setInput('isSelected', true);
      fixture.detectChanges();

      const checkIcon = listItem.querySelector('.select-option__check eb-icon');
      expect(checkIcon).toBeTruthy();
    });
  });

  describe('Multiple Select Mode', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('isMultiple', true);
      fixture.detectChanges();
    });

    it('should render checkbox', () => {
      const checkbox = listItem.querySelector('.select-option__checkbox');
      expect(checkbox).toBeTruthy();
    });

    it('should not render check mark', () => {
      fixture.componentRef.setInput('isSelected', true);
      fixture.detectChanges();

      const checkMark = listItem.querySelector('.select-option__check');
      expect(checkMark).toBeFalsy();
    });

    it('should not render check icon in checkbox when not selected', () => {
      fixture.componentRef.setInput('isSelected', false);
      fixture.detectChanges();

      const checkIcon = listItem.querySelector('.select-option__checkbox eb-icon');
      expect(checkIcon).toBeFalsy();
    });

    it('should render check icon in checkbox when selected', () => {
      fixture.componentRef.setInput('isSelected', true);
      fixture.detectChanges();

      const checkIcon = listItem.querySelector('.select-option__checkbox eb-icon');
      expect(checkIcon).toBeTruthy();
    });
  });

  describe('Event Emissions', () => {
    it('should emit clicked when option is clicked', () => {
      const clickEmitSpy = vi.fn();
      component.clicked.subscribe(clickEmitSpy);

      listItem.click();

      expect(clickEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit enterPressed when Enter key is pressed', () => {
      const enterEmitSpy = vi.fn();
      component.enterPressed.subscribe(enterEmitSpy);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      listItem.dispatchEvent(event);

      expect(enterEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit spacePressed when Space key is pressed', () => {
      const spaceEmitSpy = vi.fn();
      component.spacePressed.subscribe(spaceEmitSpy);

      const event = new KeyboardEvent('keydown', { key: ' ' });
      listItem.dispatchEvent(event);

      expect(spaceEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit mouseEntered when mouse enters', () => {
      const mouseEmitSpy = vi.fn();
      component.mouseEntered.subscribe(mouseEmitSpy);

      const event = new MouseEvent('mouseenter');
      listItem.dispatchEvent(event);

      expect(mouseEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit on other key presses', () => {
      const enterEmitSpy = vi.fn();
      const spaceEmitSpy = vi.fn();
      component.enterPressed.subscribe(enterEmitSpy);
      component.spacePressed.subscribe(spaceEmitSpy);

      const event = new KeyboardEvent('keydown', { key: 'a' });
      listItem.dispatchEvent(event);

      expect(enterEmitSpy).not.toHaveBeenCalled();
      expect(spaceEmitSpy).not.toHaveBeenCalled();
    });
  });

  describe('Content Layout', () => {
    it('should render content wrapper', () => {
      const content = listItem.querySelector('.select-option__content');
      expect(content).toBeTruthy();
    });

    it('should render label inside content', () => {
      const content = listItem.querySelector('.select-option__content');
      const label = content?.querySelector('.select-option__label');
      expect(label).toBeTruthy();
    });

    it('should render description inside content when provided', () => {
      fixture.componentRef.setInput('description', 'Test description');
      fixture.detectChanges();

      const content = listItem.querySelector('.select-option__content');
      const description = content?.querySelector('.select-option__description');
      expect(description).toBeTruthy();
    });
  });

  describe('Combined States', () => {
    it('should handle selected and disabled states together', () => {
      fixture.componentRef.setInput('isSelected', true);
      fixture.componentRef.setInput('isDisabled', true);
      fixture.detectChanges();

      expect(listItem.classList.contains('select-option--selected')).toBe(true);
      expect(listItem.classList.contains('select-option--disabled')).toBe(true);
    });

    it('should handle selected and highlighted states together', () => {
      fixture.componentRef.setInput('isSelected', true);
      fixture.componentRef.setInput('isHighlighted', true);
      fixture.detectChanges();

      expect(listItem.classList.contains('select-option--selected')).toBe(true);
      expect(listItem.classList.contains('select-option--highlighted')).toBe(true);
    });

    it('should handle all states together', () => {
      fixture.componentRef.setInput('isSelected', true);
      fixture.componentRef.setInput('isDisabled', true);
      fixture.componentRef.setInput('isHighlighted', true);
      fixture.detectChanges();

      expect(listItem.classList.contains('select-option--selected')).toBe(true);
      expect(listItem.classList.contains('select-option--disabled')).toBe(true);
      expect(listItem.classList.contains('select-option--highlighted')).toBe(true);
    });

    it('should handle multiple select with description', () => {
      fixture.componentRef.setInput('isMultiple', true);
      fixture.componentRef.setInput('isSelected', true);
      fixture.componentRef.setInput('description', 'Test description');
      fixture.detectChanges();

      const checkbox = listItem.querySelector('.select-option__checkbox');
      const description = listItem.querySelector('.select-option__description');
      expect(checkbox).toBeTruthy();
      expect(description).toBeTruthy();
    });
  });
});
