// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { SelectButtonComponent } from './select-button.component';

describe('SelectButtonComponent', () => {
  let component: SelectButtonComponent;
  let fixture: ComponentFixture<SelectButtonComponent>;
  let compiled: HTMLElement;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectButtonComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    // Set required inputs
    fixture.componentRef.setInput('buttonClass', 'select-button');
    fixture.componentRef.setInput('isOpen', false);
    fixture.componentRef.setInput('ariaControls', 'listbox-1');
    fixture.componentRef.setInput('displayText', 'Select an option');
    fixture.componentRef.setInput('hasValue', false);

    fixture.detectChanges();
    button = compiled.querySelector('button') as HTMLButtonElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (SelectButtonComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (SelectButtonComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Button Rendering', () => {
    it('should render button element', () => {
      expect(button).toBeTruthy();
    });

    it('should apply button class', () => {
      expect(button.classList.contains('select-button')).toBe(true);
    });

    it('should display text', () => {
      const text = button.querySelector('.select-button__text');
      expect(text?.textContent.trim()).toBe('Select an option');
    });

    it('should display updated text', () => {
      fixture.componentRef.setInput('displayText', 'New display text');
      fixture.detectChanges();

      const text = button.querySelector('.select-button__text');
      expect(text?.textContent.trim()).toBe('New display text');
    });

    it('should render arrow icon', () => {
      const arrow = button.querySelector('.select-button__arrow');
      expect(arrow).toBeTruthy();
    });
  });

  describe('Button ID', () => {
    it('should have empty id when not provided', () => {
      expect(button.id).toBe('undefined');
    });

    it('should apply button id when provided', () => {
      fixture.componentRef.setInput('buttonId', 'custom-button-id');
      fixture.detectChanges();

      expect(button.id).toBe('custom-button-id');
    });
  });

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      expect(button.disabled).toBe(false);
    });

    it('should be disabled when disabled input is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(button.disabled).toBe(true);
    });

    it('should be enabled when disabled input is false', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();

      expect(button.disabled).toBe(false);
    });
  });

  describe('Open State', () => {
    it('should have aria-expanded false when closed', () => {
      fixture.componentRef.setInput('isOpen', false);
      fixture.detectChanges();

      expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('should have aria-expanded true when open', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      expect(button.getAttribute('aria-expanded')).toBe('true');
    });

    it('should add arrow open class when open', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      const arrow = button.querySelector('.select-button__arrow');
      expect(arrow?.classList.contains('select-button__arrow--open')).toBe(true);
    });

    it('should remove arrow open class when closed', () => {
      fixture.componentRef.setInput('isOpen', false);
      fixture.detectChanges();

      const arrow = button.querySelector('.select-button__arrow');
      expect(arrow?.classList.contains('select-button__arrow--open')).toBe(false);
    });
  });

  describe('Display Text and Value State', () => {
    it('should add placeholder class when no value', () => {
      fixture.componentRef.setInput('hasValue', false);
      fixture.detectChanges();

      const text = button.querySelector('.select-button__text');
      expect(text?.classList.contains('select-button__text--placeholder')).toBe(true);
    });

    it('should not add placeholder class when has value', () => {
      fixture.componentRef.setInput('hasValue', true);
      fixture.detectChanges();

      const text = button.querySelector('.select-button__text');
      expect(text?.classList.contains('select-button__text--placeholder')).toBe(false);
    });
  });

  describe('Clear Button', () => {
    it('should not show clear button by default', () => {
      const clearBtn = button.querySelector('.select-button__clear');
      expect(clearBtn).toBeFalsy();
    });

    it('should show clear button when showClear is true', () => {
      fixture.componentRef.setInput('showClear', true);
      fixture.detectChanges();

      const clearBtn = button.querySelector('.select-button__clear');
      expect(clearBtn).toBeTruthy();
    });

    it('should hide clear button when showClear is false', () => {
      fixture.componentRef.setInput('showClear', false);
      fixture.detectChanges();

      const clearBtn = button.querySelector('.select-button__clear');
      expect(clearBtn).toBeFalsy();
    });

    it('should emit clearClicked when clear button is clicked', () => {
      fixture.componentRef.setInput('showClear', true);
      fixture.detectChanges();

      const clearEmitSpy = vi.fn();
      component.clearClicked.subscribe(clearEmitSpy);

      const clearBtn = button.querySelector('.select-button__clear') as HTMLButtonElement;
      clearBtn.click();

      expect(clearEmitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('ARIA Attributes', () => {
    it('should have aria-haspopup listbox', () => {
      expect(button.getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('should have aria-controls', () => {
      expect(button.getAttribute('aria-controls')).toBe('listbox-1');
    });

    it('should update aria-controls', () => {
      fixture.componentRef.setInput('ariaControls', 'new-listbox-id');
      fixture.detectChanges();

      expect(button.getAttribute('aria-controls')).toBe('new-listbox-id');
    });

    it('should not have aria-label when not provided', () => {
      expect(button.hasAttribute('aria-label')).toBe(false);
    });

    it('should apply aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom label');
      fixture.detectChanges();

      expect(button.getAttribute('aria-label')).toBe('Custom label');
    });

    it('should not have aria-labelledby when not provided', () => {
      expect(button.hasAttribute('aria-labelledby')).toBe(false);
    });

    it('should apply aria-labelledby when provided', () => {
      fixture.componentRef.setInput('ariaLabelledby', 'label-id');
      fixture.detectChanges();

      expect(button.getAttribute('aria-labelledby')).toBe('label-id');
    });

    it('should not have aria-describedby when not provided', () => {
      expect(button.hasAttribute('aria-describedby')).toBe(false);
    });

    it('should apply aria-describedby when provided', () => {
      fixture.componentRef.setInput('ariaDescribedby', 'description-id');
      fixture.detectChanges();

      expect(button.getAttribute('aria-describedby')).toBe('description-id');
    });

    it('should not have aria-invalid when not provided', () => {
      expect(button.hasAttribute('aria-invalid')).toBe(false);
    });

    it('should apply aria-invalid when provided', () => {
      fixture.componentRef.setInput('ariaInvalid', 'true');
      fixture.detectChanges();

      expect(button.getAttribute('aria-invalid')).toBe('true');
    });

    it('should not have aria-required when not provided', () => {
      expect(button.hasAttribute('aria-required')).toBe(false);
    });

    it('should apply aria-required when provided', () => {
      fixture.componentRef.setInput('ariaRequired', 'true');
      fixture.detectChanges();

      expect(button.getAttribute('aria-required')).toBe('true');
    });
  });

  describe('Event Emissions', () => {
    it('should emit clicked when button is clicked', () => {
      const clickEmitSpy = vi.fn();
      component.clicked.subscribe(clickEmitSpy);

      button.click();

      expect(clickEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit focused when button receives focus', () => {
      const focusEmitSpy = vi.fn();
      component.focused.subscribe(focusEmitSpy);

      button.focus();

      expect(focusEmitSpy).toHaveBeenCalledTimes(1);
      expect(focusEmitSpy).toHaveBeenCalledWith(expect.any(FocusEvent));
    });

    it('should emit blurred when button loses focus', () => {
      const blurEmitSpy = vi.fn();
      component.blurred.subscribe(blurEmitSpy);

      button.focus();
      button.blur();

      expect(blurEmitSpy).toHaveBeenCalledTimes(1);
      expect(blurEmitSpy).toHaveBeenCalledWith(expect.any(FocusEvent));
    });

    it('should emit keydown when key is pressed', () => {
      const keydownEmitSpy = vi.fn();
      component.keydownEvent.subscribe(keydownEmitSpy);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      button.dispatchEvent(event);

      expect(keydownEmitSpy).toHaveBeenCalledTimes(1);
      expect(keydownEmitSpy).toHaveBeenCalledWith(expect.any(KeyboardEvent));
    });
  });

  describe('ViewChild Reference', () => {
    it('should have buttonElement viewChild', () => {
      expect(component.buttonElement).toBeDefined();
    });

    it('should provide access to native button element', () => {
      const nativeButton = component.buttonElement()?.nativeElement;
      expect(nativeButton).toBeTruthy();
      expect(nativeButton?.tagName).toBe('BUTTON');
    });
  });
});
