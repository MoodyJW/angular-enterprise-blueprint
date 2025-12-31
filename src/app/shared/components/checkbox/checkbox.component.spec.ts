// @vitest-environment jsdom
import { ResourceLoader } from '@angular/compiler';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { UniqueIdService } from '@shared/services/unique-id';

import type { CheckboxSize, CheckboxValidationState } from './checkbox.component';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;
  let nativeElement: HTMLElement;
  let uniqueIdService: UniqueIdService;

  beforeEach(async () => {
    TestBed.overrideComponent(CheckboxComponent, {
      set: {
        template: `
          <div [class]="wrapperClasses()">
            <div class="checkbox__wrapper">
              <input
                #checkboxElement
                type="checkbox"
                [id]="checkboxId()"
                [class]="checkboxClasses()"
                [checked]="checked()"
                [indeterminate]="indeterminate()"
                [disabled]="disabled()"
                [required]="required()"
                [value]="value()"
                [name]="name()"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-describedby]="computedAriaDescribedBy()"
                [attr.aria-invalid]="computedAriaInvalid()"
                [attr.aria-labelledby]="labelId()"
                (change)="handleChange($event)"
                (focus)="handleFocus($event)"
                (blur)="handleBlur($event)"
              />
              <span class="checkbox-checkmark" aria-hidden="true">
                @if (indeterminate()) {
                  <svg class="checkbox-icon checkbox-icon--indeterminate" viewBox="0 0 16 16">
                    <path d="M4 8H12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg>
                } @else if (checked()) {
                  <svg class="checkbox-icon checkbox-icon--checked" viewBox="0 0 16 16">
                    <path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" />
                  </svg>
                }
              </span>
            </div>

            @if (label()) {
              <label [id]="labelId()" [for]="checkboxId()" [class]="labelClasses()">
                {{ label() }}
                @if (required()) {
                  <span class="input-label__required" aria-hidden="true">*</span>
                }
              </label>
            }

            @if (helperText()) {
              <div [id]="helperTextId()" [class]="helperTextClasses()">
                {{ helperText() }}
              </div>
            }
          </div>
        `,
        styles: [''],
      },
    });

    TestBed.configureCompiler({
      providers: [{ provide: ResourceLoader, useValue: { get: (_url: string) => '' } }],
    });

    await TestBed.configureTestingModule({
      providers: [UniqueIdService],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    uniqueIdService = TestBed.inject(UniqueIdService);
    uniqueIdService.resetAllCounters();
    fixture.componentRef.setInput('ariaLabel', 'Test checkbox');
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (CheckboxComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (CheckboxComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - Size', () => {
    it('should have default size as md', () => {
      fixture.detectChanges();
      expect(component.size()).toBe('md');
    });

    it('should apply custom size', () => {
      const sizes: CheckboxSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(component.size()).toBe(size);
      });
    });
  });

  describe('Input Handling - Checked State', () => {
    it('should have default checked state as false', () => {
      fixture.detectChanges();
      expect(component.checked()).toBe(false);
    });

    it('should handle checked state', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      expect(component.checked()).toBe(true);
    });

    it('should handle unchecked state', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.detectChanges();
      expect(component.checked()).toBe(false);
    });
  });

  describe('Input Handling - Indeterminate State', () => {
    it('should have default indeterminate state as false', () => {
      fixture.detectChanges();
      expect(component.indeterminate()).toBe(false);
    });

    it('should handle indeterminate state', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      expect(component.indeterminate()).toBe(true);
    });
  });

  describe('Input Handling - States', () => {
    it('should handle disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);
    });

    it('should handle required state', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      expect(component.required()).toBe(true);
    });

    it('should handle label input', () => {
      fixture.componentRef.setInput('label', 'Accept terms');
      fixture.detectChanges();
      expect(component.label()).toBe('Accept terms');
    });

    it('should handle helperText input', () => {
      fixture.componentRef.setInput('helperText', 'This is required');
      fixture.detectChanges();
      expect(component.helperText()).toBe('This is required');
    });

    it('should handle value input', () => {
      fixture.componentRef.setInput('value', 'option1');
      fixture.detectChanges();
      expect(component.value()).toBe('option1');
    });

    it('should handle name input', () => {
      fixture.componentRef.setInput('name', 'preferences');
      fixture.detectChanges();
      expect(component.name()).toBe('preferences');
    });
  });

  describe('Input Handling - Validation State', () => {
    it('should have default validation state as default', () => {
      fixture.detectChanges();
      expect(component.validationState()).toBe('default');
    });

    it('should apply custom validation state', () => {
      const states: CheckboxValidationState[] = ['default', 'success', 'warning', 'error'];

      states.forEach((state) => {
        fixture.componentRef.setInput('validationState', state);
        fixture.detectChanges();
        expect(component.validationState()).toBe(state);
      });
    });
  });

  describe('Change Events', () => {
    it('should emit checkedChange event when changed', () => {
      fixture.detectChanges();

      let emittedValue: boolean | undefined;
      component.checkedChange.subscribe((value) => (emittedValue = value));

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      checkboxElement.click();

      expect(emittedValue).toBe(true);
    });

    it('should emit checkedChange with correct value when unchecked', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();

      let emittedValue: boolean | undefined;
      component.checkedChange.subscribe((value) => (emittedValue = value));

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      checkboxElement.click();

      expect(emittedValue).toBe(false);
    });

    it('should handle change via handleChange method', () => {
      fixture.detectChanges();

      let emittedValue: boolean | undefined;
      component.checkedChange.subscribe((value) => (emittedValue = value));

      const mockEvent = {
        target: { checked: true },
      } as unknown as Event;

      component.handleChange(mockEvent);

      expect(emittedValue).toBe(true);
    });
  });

  describe('Focus Events', () => {
    it('should emit focused event when focused', () => {
      fixture.detectChanges();

      let focusedEvent: FocusEvent | undefined;
      component.focused.subscribe((event) => (focusedEvent = event));

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      checkboxElement.dispatchEvent(new FocusEvent('focus'));

      expect(focusedEvent).toBeDefined();
      expect(component.isFocused()).toBe(true);
    });

    it('should emit blurred event when blurred', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.detectChanges();

      // First focus
      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      checkboxElement.dispatchEvent(new FocusEvent('focus'));
      fixture.detectChanges();

      let blurredEvent: FocusEvent | undefined;
      component.blurred.subscribe((event) => (blurredEvent = event));

      checkboxElement.dispatchEvent(new FocusEvent('blur'));
      fixture.detectChanges();

      expect(blurredEvent).toBeDefined();
      expect(component.isFocused()).toBe(false);
    });
  });

  describe('Accessibility - ARIA Attributes', () => {
    it('should have aria-label attribute', () => {
      fixture.componentRef.setInput('ariaLabel', 'Accept terms');
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      expect(checkboxElement.getAttribute('aria-label')).toBe('Accept terms');
    });

    it('should set aria-invalid when validationState is error', () => {
      fixture.componentRef.setInput('validationState', 'error');
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      expect(checkboxElement.getAttribute('aria-invalid')).toBe('true');
    });

    it('should not set aria-invalid when validationState is default', () => {
      fixture.componentRef.setInput('validationState', 'default');
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      expect(checkboxElement.getAttribute('aria-invalid')).toBeNull();
    });

    it('should set aria-invalid when ariaInvalid is true', () => {
      fixture.componentRef.setInput('ariaInvalid', true);
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      expect(checkboxElement.getAttribute('aria-invalid')).toBe('true');
    });

    it('should set aria-describedby when helperText is provided', () => {
      fixture.componentRef.setInput('helperText', 'This is required');
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      const ariaDescribedBy = checkboxElement.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toBeTruthy();
    });

    it('should set aria-labelledby when label is provided', () => {
      fixture.componentRef.setInput('label', 'Accept terms');
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      const ariaLabelledBy = checkboxElement.getAttribute('aria-labelledby');
      expect(ariaLabelledBy).toBeTruthy();
    });
  });

  describe('Accessibility - Checkbox Element', () => {
    it('should use native checkbox input', () => {
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      expect(checkboxElement).toBeTruthy();
      expect(checkboxElement.tagName).toBe('INPUT');
      expect(checkboxElement.type).toBe('checkbox');
    });

    it('should be checked when checked prop is true', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      expect(checkboxElement.checked).toBe(true);
    });

    it('should be disabled when disabled prop is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      expect(checkboxElement.hasAttribute('disabled')).toBe(true);
    });

    it('should be required when required prop is true', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      expect(checkboxElement.hasAttribute('required')).toBe(true);
    });

    it('should be indeterminate when indeterminate prop is true', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      expect(checkboxElement.indeterminate).toBe(true);
    });
  });

  describe('CSS Classes', () => {
    it('should apply base checkbox class', () => {
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      expect(checkboxElement.classList.contains('checkbox__control')).toBe(true);
    });

    it('should apply size classes', () => {
      const sizes: CheckboxSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();

        const checkboxElement =
          nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
        if (!checkboxElement) {
          throw new Error('Checkbox element not found');
        }
        expect(checkboxElement.classList.contains(`checkbox__control--${size}`)).toBe(true);
      });
    });

    it('should apply validation state classes', () => {
      const states: CheckboxValidationState[] = ['success', 'warning', 'error'];

      states.forEach((state) => {
        fixture.componentRef.setInput('validationState', state);
        fixture.detectChanges();

        const checkboxElement =
          nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
        if (!checkboxElement) {
          throw new Error('Checkbox element not found');
        }
        expect(checkboxElement.classList.contains(`checkbox__control--${state}`)).toBe(true);
      });
    });

    it('should apply disabled class when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      expect(checkboxElement.classList.contains('checkbox__control--disabled')).toBe(true);
    });

    it('should apply checked class when checked', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      expect(checkboxElement.classList.contains('checkbox__control--checked')).toBe(true);
    });

    it('should apply indeterminate class when indeterminate', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      expect(checkboxElement.classList.contains('checkbox__control--indeterminate')).toBe(true);
    });

    it('should apply wrapper size class', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      const wrapper = nativeElement.querySelector<HTMLElement>('.checkbox');
      if (!wrapper) {
        throw new Error('Checkbox wrapper not found');
      }
      expect(wrapper.classList.contains('checkbox--lg')).toBe(true);
    });

    it('should apply wrapper disabled class', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const wrapper = nativeElement.querySelector<HTMLElement>('.checkbox');
      if (!wrapper) {
        throw new Error('Checkbox wrapper not found');
      }
      expect(wrapper.classList.contains('checkbox--disabled')).toBe(true);
    });
  });

  describe('Label Rendering', () => {
    it('should render label when provided', () => {
      fixture.componentRef.setInput('label', 'Accept terms');
      fixture.detectChanges();

      const label = nativeElement.querySelector<HTMLLabelElement>('label');
      if (!label) {
        throw new Error('Label not found');
      }
      expect(label).toBeTruthy();
      const labelText = typeof label.textContent === 'string' ? label.textContent.trim() : '';
      expect(labelText).toContain('Accept terms');
    });

    it('should not render label when not provided', () => {
      fixture.componentRef.setInput('label', '');
      fixture.detectChanges();

      const label = nativeElement.querySelector<HTMLLabelElement>('label');
      expect(label).toBeNull();
    });

    it('should render required indicator when required', () => {
      fixture.componentRef.setInput('label', 'Accept terms');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const requiredIndicator = nativeElement.querySelector<HTMLElement>('.input-label__required');
      if (!requiredIndicator) {
        throw new Error('Required indicator not found');
      }
      expect(requiredIndicator).toBeTruthy();
      expect(requiredIndicator.textContent).toBe('*');
    });

    it('should not render required indicator when not required', () => {
      fixture.componentRef.setInput('label', 'Accept terms');
      fixture.componentRef.setInput('required', false);
      fixture.detectChanges();

      const requiredIndicator = nativeElement.querySelector<HTMLElement>('.input-label__required');
      expect(requiredIndicator).toBeNull();
    });

    it('should link label to checkbox with for attribute', () => {
      fixture.componentRef.setInput('label', 'Accept terms');
      fixture.detectChanges();

      const label = nativeElement.querySelector<HTMLLabelElement>('label');
      const checkbox = nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!label || !checkbox) {
        throw new Error('Label or checkbox not found');
      }
      expect(label.getAttribute('for')).toBe(checkbox.id);
    });
  });

  describe('Helper Text Rendering', () => {
    it('should render helper text when provided', () => {
      fixture.componentRef.setInput('helperText', 'This is required');
      fixture.detectChanges();

      const helperText = nativeElement.querySelector<HTMLElement>('.checkbox__helper-text');
      if (!helperText) {
        throw new Error('Helper text not found');
      }
      expect(helperText).toBeTruthy();
      const helperTextContent =
        typeof helperText.textContent === 'string' ? helperText.textContent.trim() : '';
      expect(helperTextContent).toBe('This is required');
    });

    it('should not render helper text when not provided', () => {
      fixture.componentRef.setInput('helperText', '');
      fixture.detectChanges();

      const helperText = nativeElement.querySelector<HTMLElement>('.checkbox__helper-text');
      expect(helperText).toBeNull();
    });

    it('should apply validation state classes to helper text', () => {
      fixture.componentRef.setInput('helperText', 'Error message');
      fixture.componentRef.setInput('validationState', 'error');
      fixture.detectChanges();

      const helperText = nativeElement.querySelector<HTMLElement>('.checkbox__helper-text');
      if (!helperText) {
        throw new Error('Helper text not found');
      }
      expect(helperText.classList.contains('checkbox__helper-text--error')).toBe(true);
    });
  });

  describe('Icon Rendering', () => {
    it('should render checkmark icon when checked', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();

      const checkedIcon = nativeElement.querySelector<HTMLElement>('.checkbox-icon--checked');
      expect(checkedIcon).toBeTruthy();
    });

    it('should render indeterminate icon when indeterminate', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();

      const indeterminateIcon = nativeElement.querySelector<HTMLElement>(
        '.checkbox-icon--indeterminate',
      );
      expect(indeterminateIcon).toBeTruthy();
    });

    it('should not render any icon when unchecked and not indeterminate', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();

      const checkedIcon = nativeElement.querySelector<HTMLElement>('.checkbox-icon--checked');
      const indeterminateIcon = nativeElement.querySelector<HTMLElement>(
        '.checkbox-icon--indeterminate',
      );
      expect(checkedIcon).toBeNull();
      expect(indeterminateIcon).toBeNull();
    });

    it('should prioritize indeterminate icon over checked icon', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();

      const checkedIcon = nativeElement.querySelector<HTMLElement>('.checkbox-icon--checked');
      const indeterminateIcon = nativeElement.querySelector<HTMLElement>(
        '.checkbox-icon--indeterminate',
      );
      expect(indeterminateIcon).toBeTruthy();
      expect(checkedIcon).toBeNull();
    });
  });

  describe('Public Methods', () => {
    it('should focus checkbox with focus() method', () => {
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      const focusSpy = vi.spyOn(checkboxElement, 'focus');

      component.focus();

      expect(focusSpy).toHaveBeenCalled();
    });

    it('should blur checkbox with blur() method', () => {
      fixture.detectChanges();

      const checkboxElement =
        nativeElement.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkboxElement) {
        throw new Error('Checkbox element not found');
      }
      const blurSpy = vi.spyOn(checkboxElement, 'blur');

      component.blur();

      expect(blurSpy).toHaveBeenCalled();
    });

    it('should toggle checked state with toggle() method', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.detectChanges();

      let emittedValue: boolean | undefined;
      component.checkedChange.subscribe((value) => (emittedValue = value));

      component.toggle();

      expect(emittedValue).toBe(true);
    });

    it('should not toggle when disabled', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      let emittedValue: boolean | undefined;
      component.checkedChange.subscribe((value) => (emittedValue = value));

      component.toggle();

      expect(emittedValue).toBeUndefined();
    });
  });

  describe('Computed Values', () => {
    it('should compute checkboxId', () => {
      fixture.detectChanges();

      const checkboxId = component.checkboxId();
      expect(checkboxId).toBeTruthy();
      expect(checkboxId).toContain('checkbox-');
    });

    it('should compute labelId when label is provided', () => {
      fixture.componentRef.setInput('label', 'Test label');
      fixture.detectChanges();

      const labelId = component.labelId();
      expect(labelId).toBeTruthy();
      expect(labelId).toContain('checkbox-label-');
    });

    it('should not compute labelId when label is not provided', () => {
      fixture.componentRef.setInput('label', '');
      fixture.detectChanges();

      const labelId = component.labelId();
      expect(labelId).toBeUndefined();
    });

    it('should compute helperTextId when helperText is provided', () => {
      fixture.componentRef.setInput('helperText', 'Test helper');
      fixture.detectChanges();

      const helperTextId = component.helperTextId();
      expect(helperTextId).toBeTruthy();
      expect(helperTextId).toContain('checkbox-helper-');
    });

    it('should compute wrapperClasses correctly', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const classes = component.wrapperClasses();
      expect(classes).toContain('checkbox');
      expect(classes).toContain('checkbox--lg');
      expect(classes).toContain('checkbox--disabled');
    });

    it('should compute checkboxClasses correctly', () => {
      fixture.componentRef.setInput('size', 'md');
      fixture.componentRef.setInput('validationState', 'error');
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();

      const classes = component.checkboxClasses();
      expect(classes).toContain('checkbox__control');
      expect(classes).toContain('checkbox__control--md');
      expect(classes).toContain('checkbox__control--error');
      expect(classes).toContain('checkbox__control--checked');
    });

    it('should compute labelClasses correctly', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const classes = component.labelClasses();
      expect(classes).toContain('checkbox__label');
      expect(classes).toContain('checkbox__label--sm');
      expect(classes).toContain('checkbox__label--disabled');
      expect(classes).toContain('checkbox__label--required');
    });
  });

  describe('Template Branch Coverage', () => {
    it('should render both label and helper text when provided', () => {
      fixture.componentRef.setInput('label', 'Test label');
      fixture.componentRef.setInput('helperText', 'Test helper');
      fixture.detectChanges();

      const label = nativeElement.querySelector<HTMLLabelElement>('label');
      const helperText = nativeElement.querySelector<HTMLElement>('.checkbox__helper-text');
      if (!label) {
        throw new Error('Label not found');
      }
      if (!helperText) {
        throw new Error('Helper text not found');
      }
      expect(label).toBeTruthy();
      expect(helperText).toBeTruthy();
    });

    it('should render neither label nor helper text when not provided', () => {
      fixture.componentRef.setInput('label', '');
      fixture.componentRef.setInput('helperText', '');
      fixture.detectChanges();

      const label = nativeElement.querySelector<HTMLLabelElement>('label');
      const helperText = nativeElement.querySelector<HTMLElement>('.checkbox__helper-text');
      expect(label).toBeNull();
      expect(helperText).toBeNull();
    });

    it('should show checkmark when checked and not indeterminate', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();

      const checkedIcon = nativeElement.querySelector<HTMLElement>('.checkbox-icon--checked');
      const indeterminateIcon = nativeElement.querySelector<HTMLElement>(
        '.checkbox-icon--indeterminate',
      );
      expect(checkedIcon).toBeTruthy();
      expect(indeterminateIcon).toBeNull();
    });

    it('should show indeterminate icon when indeterminate (regardless of checked)', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();

      const checkedIcon = nativeElement.querySelector<HTMLElement>('.checkbox-icon--checked');
      const indeterminateIcon = nativeElement.querySelector<HTMLElement>(
        '.checkbox-icon--indeterminate',
      );
      expect(indeterminateIcon).toBeTruthy();
      expect(checkedIcon).toBeNull();
    });

    it('should show no icon when unchecked and not indeterminate', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();

      const checkedIcon = nativeElement.querySelector<HTMLElement>('.checkbox-icon--checked');
      const indeterminateIcon = nativeElement.querySelector<HTMLElement>(
        '.checkbox-icon--indeterminate',
      );
      expect(checkedIcon).toBeNull();
      expect(indeterminateIcon).toBeNull();
    });
  });
  describe('Branch Coverage Improvements', () => {
    it('should combine ariaDescribedBy input and helperTextId', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'external-id');
      fixture.componentRef.setInput('helperText', 'helper');
      fixture.detectChanges();
      const desc = component.computedAriaDescribedBy();
      expect(desc).toContain('checkbox-helper');
      expect(desc).toContain('external-id');
    });

    it('should explicitly use ariaDescribedBy input when no helper text', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'external-id');
      fixture.componentRef.setInput('helperText', '');
      fixture.detectChanges();
      const desc = component.computedAriaDescribedBy();
      expect(desc).toBe('external-id');
    });

    it('should be valid (undefined) when no error and no ariaInvalid', () => {
      fixture.componentRef.setInput('validationState', 'default');
      fixture.componentRef.setInput('ariaInvalid', false);
      const invalid = component.computedAriaInvalid();
      expect(invalid).toBeUndefined();
    });

    it('should be invalid if ariaInvalid is true even if state is default', () => {
      fixture.componentRef.setInput('validationState', 'default');
      fixture.componentRef.setInput('ariaInvalid', true);
      const invalid = component.computedAriaInvalid();
      expect(invalid).toBe('true');
    });
  });
});
