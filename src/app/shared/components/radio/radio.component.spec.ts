// @vitest-environment jsdom
import { ResourceLoader } from '@angular/compiler';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { UniqueIdService } from '@shared/services/unique-id';

import type { RadioSize, RadioValidationState } from './radio.component';
import { RadioComponent } from './radio.component';

describe('RadioComponent', () => {
  let component: RadioComponent;
  let fixture: ComponentFixture<RadioComponent>;
  let nativeElement: HTMLElement;
  let uniqueIdService: UniqueIdService;

  beforeEach(async () => {
    TestBed.overrideComponent(RadioComponent, {
      set: {
        template: `
          <div [class]="wrapperClasses()">
            <div class="radio-input-wrapper">
              <input
                #radioElement
                type="radio"
                [id]="radioId()"
                [class]="radioClasses()"
                [checked]="checked()"
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
              <div class="radio-indicator">
                <span class="radio-indicator__dot"></span>
              </div>
            </div>

            @if (label()) {
              <label [id]="labelId()" [for]="radioId()" [class]="labelClasses()">
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

    fixture = TestBed.createComponent(RadioComponent);
    component = fixture.componentInstance;
    uniqueIdService = TestBed.inject(UniqueIdService);
    uniqueIdService.resetAllCounters();
    fixture.componentRef.setInput('ariaLabel', 'Test radio');
    fixture.componentRef.setInput('name', 'test-group');
    fixture.componentRef.setInput('value', 'test-value');
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (RadioComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (RadioComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Properties', () => {
    it('should have default size of md', () => {
      expect(component.size()).toBe('md');
    });

    it('should accept size input', () => {
      const sizes: RadioSize[] = ['sm', 'md', 'lg'];
      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        expect(component.size()).toBe(size);
      });
    });

    it('should have default checked state of false', () => {
      expect(component.checked()).toBe(false);
    });

    it('should accept checked input', () => {
      fixture.componentRef.setInput('checked', true);
      expect(component.checked()).toBe(true);

      fixture.componentRef.setInput('checked', false);
      expect(component.checked()).toBe(false);
    });

    it('should have default disabled state of false', () => {
      expect(component.disabled()).toBe(false);
    });

    it('should accept disabled input', () => {
      fixture.componentRef.setInput('disabled', true);
      expect(component.disabled()).toBe(true);
    });

    it('should have default required state of false', () => {
      expect(component.required()).toBe(false);
    });

    it('should accept required input', () => {
      fixture.componentRef.setInput('required', true);
      expect(component.required()).toBe(true);
    });

    it('should have default label of empty string', () => {
      expect(component.label()).toBe('');
    });

    it('should accept label input', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      expect(component.label()).toBe('Test Label');
    });

    it('should have default helperText of empty string', () => {
      expect(component.helperText()).toBe('');
    });

    it('should accept helperText input', () => {
      fixture.componentRef.setInput('helperText', 'Test Helper');
      expect(component.helperText()).toBe('Test Helper');
    });

    it('should have default validationState of default', () => {
      expect(component.validationState()).toBe('default');
    });

    it('should accept validationState input', () => {
      const states: RadioValidationState[] = ['default', 'success', 'warning', 'error'];
      states.forEach((state) => {
        fixture.componentRef.setInput('validationState', state);
        expect(component.validationState()).toBe(state);
      });
    });

    it('should require value input', () => {
      expect(component.value()).toBe('test-value');
    });

    it('should require name input', () => {
      expect(component.name()).toBe('test-group');
    });

    it('should require ariaLabel input', () => {
      expect(component.ariaLabel()).toBe('Test radio');
    });

    it('should accept ariaDescribedBy input', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'external-description');
      expect(component.ariaDescribedBy()).toBe('external-description');
    });

    it('should have default ariaInvalid of false', () => {
      expect(component.ariaInvalid()).toBe(false);
    });

    it('should accept ariaInvalid input', () => {
      fixture.componentRef.setInput('ariaInvalid', true);
      expect(component.ariaInvalid()).toBe(true);
    });
  });

  describe('Computed Properties', () => {
    it('should generate unique radioId', () => {
      const id = component.radioId();
      expect(id).toContain('radio');
    });

    it('should generate labelId only when label is provided', () => {
      expect(component.labelId()).toBeUndefined();

      fixture.componentRef.setInput('label', 'Test Label');
      expect(component.labelId()).toContain('radio-label');
    });

    it('should generate helperTextId only when helperText is provided', () => {
      expect(component.helperTextId()).toBeUndefined();

      fixture.componentRef.setInput('helperText', 'Helper text');
      expect(component.helperTextId()).toContain('radio-helper');
    });

    it('should compute aria-describedby correctly', () => {
      expect(component.computedAriaDescribedBy()).toBeUndefined();

      fixture.componentRef.setInput('helperText', 'Helper');
      fixture.detectChanges();
      const helperTextId = component.helperTextId();
      expect(component.computedAriaDescribedBy()).toBe(helperTextId);

      fixture.componentRef.setInput('ariaDescribedBy', 'external');
      expect(component.computedAriaDescribedBy()).toContain(helperTextId);
      expect(component.computedAriaDescribedBy()).toContain('external');
    });

    it('should compute aria-invalid correctly', () => {
      expect(component.computedAriaInvalid()).toBeUndefined();

      fixture.componentRef.setInput('ariaInvalid', true);
      expect(component.computedAriaInvalid()).toBe('true');

      fixture.componentRef.setInput('ariaInvalid', false);
      fixture.componentRef.setInput('validationState', 'error');
      expect(component.computedAriaInvalid()).toBe('true');
    });
  });

  describe('CSS Classes', () => {
    describe('wrapperClasses', () => {
      it('should include base class', () => {
        const classes = component.wrapperClasses();
        expect(classes).toContain('radio-wrapper');
      });

      it('should include size class', () => {
        const sizes: RadioSize[] = ['sm', 'md', 'lg'];
        sizes.forEach((size) => {
          fixture.componentRef.setInput('size', size);
          const classes = component.wrapperClasses();
          expect(classes).toContain(`radio-wrapper--${size}`);
        });
      });

      it('should include disabled class when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        const classes = component.wrapperClasses();
        expect(classes).toContain('radio-wrapper--disabled');
      });
    });

    describe('radioClasses', () => {
      it('should include base class', () => {
        const classes = component.radioClasses();
        expect(classes).toContain('radio');
      });

      it('should include size class', () => {
        const sizes: RadioSize[] = ['sm', 'md', 'lg'];
        sizes.forEach((size) => {
          fixture.componentRef.setInput('size', size);
          const classes = component.radioClasses();
          expect(classes).toContain(`radio--${size}`);
        });
      });

      it('should include validation state class', () => {
        const states: RadioValidationState[] = ['success', 'warning', 'error'];
        states.forEach((state) => {
          fixture.componentRef.setInput('validationState', state);
          const classes = component.radioClasses();
          expect(classes).toContain(`radio--${state}`);
        });
      });

      it('should not include default validation state class', () => {
        fixture.componentRef.setInput('validationState', 'default');
        const classes = component.radioClasses();
        expect(classes).not.toContain('radio--default');
      });

      it('should include disabled class when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        const classes = component.radioClasses();
        expect(classes).toContain('radio--disabled');
      });

      it('should include focused class when focused', () => {
        component.isFocused.set(true);
        const classes = component.radioClasses();
        expect(classes).toContain('radio--focused');
      });

      it('should include checked class when checked', () => {
        fixture.componentRef.setInput('checked', true);
        const classes = component.radioClasses();
        expect(classes).toContain('radio--checked');
      });
    });

    describe('labelClasses', () => {
      it('should include base class', () => {
        const classes = component.labelClasses();
        expect(classes).toContain('radio-label');
      });

      it('should include size class', () => {
        const sizes: RadioSize[] = ['sm', 'md', 'lg'];
        sizes.forEach((size) => {
          fixture.componentRef.setInput('size', size);
          const classes = component.labelClasses();
          expect(classes).toContain(`radio-label--${size}`);
        });
      });

      it('should include disabled class when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        const classes = component.labelClasses();
        expect(classes).toContain('radio-label--disabled');
      });

      it('should include required class when required', () => {
        fixture.componentRef.setInput('required', true);
        const classes = component.labelClasses();
        expect(classes).toContain('radio-label--required');
      });
    });

    describe('helperTextClasses', () => {
      it('should include base class', () => {
        const classes = component.helperTextClasses();
        expect(classes).toContain('radio__helper-text');
      });

      it('should include validation state classes', () => {
        fixture.componentRef.setInput('validationState', 'success');
        expect(component.helperTextClasses()).toContain('radio__helper-text--success');

        fixture.componentRef.setInput('validationState', 'warning');
        expect(component.helperTextClasses()).toContain('radio__helper-text--warning');

        fixture.componentRef.setInput('validationState', 'error');
        expect(component.helperTextClasses()).toContain('radio__helper-text--error');
      });
    });
  });

  describe('Event Handlers', () => {
    it('should emit checkedChange on change', () => {
      const emitSpy = vi.fn();
      component.checkedChange.subscribe(emitSpy);

      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        value: { checked: true },
        writable: false,
      });

      component.handleChange(event);
      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('should emit selected when checked', () => {
      const emitSpy = vi.fn();
      component.selected.subscribe(emitSpy);

      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        value: { checked: true },
        writable: false,
      });

      component.handleChange(event);
      expect(emitSpy).toHaveBeenCalledWith('test-value');
    });

    it('should not emit selected when unchecked', () => {
      const emitSpy = vi.fn();
      component.selected.subscribe(emitSpy);

      const event = new Event('change');
      Object.defineProperty(event, 'target', {
        value: { checked: false },
        writable: false,
      });

      component.handleChange(event);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should handle focus events', () => {
      const emitSpy = vi.fn();
      component.focused.subscribe(emitSpy);

      const focusEvent = new FocusEvent('focus');
      component.handleFocus(focusEvent);

      expect(component.isFocused()).toBe(true);
      expect(emitSpy).toHaveBeenCalledWith(focusEvent);
    });

    it('should handle blur events', () => {
      const emitSpy = vi.fn();
      component.blurred.subscribe(emitSpy);

      component.isFocused.set(true);
      const blurEvent = new FocusEvent('blur');
      component.handleBlur(blurEvent);

      expect(component.isFocused()).toBe(false);
      expect(emitSpy).toHaveBeenCalledWith(blurEvent);
    });
  });

  describe('Public Methods', () => {
    it('should focus the radio element', () => {
      fixture.detectChanges();
      const radioEl = nativeElement.querySelector<HTMLInputElement>('input[type="radio"]');
      if (!radioEl) {
        throw new Error('Radio element not found');
      }
      const focusSpy = vi.spyOn(radioEl, 'focus');

      component.focus();
      expect(focusSpy).toHaveBeenCalled();
    });

    it('should blur the radio element', () => {
      fixture.detectChanges();
      const radioEl = nativeElement.querySelector<HTMLInputElement>('input[type="radio"]');
      if (!radioEl) {
        throw new Error('Radio element not found');
      }
      const blurSpy = vi.spyOn(radioEl, 'blur');

      component.blur();
      expect(blurSpy).toHaveBeenCalled();
    });

    it('should select the radio when not disabled or checked', () => {
      const checkedEmitSpy = vi.fn();
      const selectedEmitSpy = vi.fn();
      component.checkedChange.subscribe(checkedEmitSpy);
      component.selected.subscribe(selectedEmitSpy);

      component.select();

      expect(checkedEmitSpy).toHaveBeenCalledWith(true);
      expect(selectedEmitSpy).toHaveBeenCalledWith('test-value');
    });

    it('should not select when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      const emitSpy = vi.fn();
      component.checkedChange.subscribe(emitSpy);

      component.select();
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not select when already checked', () => {
      fixture.componentRef.setInput('checked', true);
      const emitSpy = vi.fn();
      component.checkedChange.subscribe(emitSpy);

      component.select();
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('DOM Rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render radio input element', () => {
      const radioInput = nativeElement.querySelector<HTMLInputElement>('input[type="radio"]');
      expect(radioInput).toBeTruthy();
    });

    it('should set radio input attributes correctly', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const radioInput = nativeElement.querySelector<HTMLInputElement>('input[type="radio"]');
      if (!radioInput) {
        throw new Error('Radio input not found');
      }
      expect(radioInput.disabled).toBe(true);
      expect(radioInput.required).toBe(true);
      expect(radioInput.name).toBe('test-group');
      expect(radioInput.value).toBe('test-value');
    });

    it('should render label when provided', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();

      const label = nativeElement.querySelector<HTMLLabelElement>('label');
      if (!label) {
        throw new Error('Label not found');
      }
      expect(label).toBeTruthy();
      expect(label.textContent).toContain('Test Label');
    });

    it('should not render label when not provided', () => {
      const label = nativeElement.querySelector<HTMLLabelElement>('label');
      expect(label).toBeFalsy();
    });

    it('should render required indicator when required', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const requiredIndicator = nativeElement.querySelector<HTMLElement>('.input-label__required');
      if (!requiredIndicator) {
        throw new Error('Required indicator not found');
      }
      expect(requiredIndicator).toBeTruthy();
      expect(requiredIndicator.textContent).toBe('*');
    });

    it('should render helper text when provided', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.detectChanges();

      const helperId = component.helperTextId();
      if (helperId === undefined || helperId === '') {
        throw new Error('Helper text id not generated');
      }
      const helperText = nativeElement.querySelector<HTMLElement>(`#${helperId}`);
      if (!helperText) {
        throw new Error('Helper text element not found');
      }
      expect(helperText).toBeTruthy();
      expect(helperText.textContent).toContain('Helper text');
    });

    it('should not render helper text when not provided', () => {
      const helperText = nativeElement.querySelector<HTMLElement>('.radio__helper-text');
      expect(helperText).toBeFalsy();
    });

    it('should apply correct wrapper classes', () => {
      const wrapper = nativeElement.querySelector<HTMLElement>('.radio-wrapper');
      if (!wrapper) {
        throw new Error('Wrapper not found');
      }
      expect(wrapper.className).toContain('radio-wrapper');
      expect(wrapper.className).toContain('radio-wrapper--md');
    });

    it('should apply correct radio classes', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('validationState', 'error');
      fixture.detectChanges();

      const radio = nativeElement.querySelector<HTMLInputElement>('input[type="radio"]');
      if (!radio) {
        throw new Error('Radio element not found');
      }
      expect(radio.className).toContain('radio');
      expect(radio.className).toContain('radio--lg');
      expect(radio.className).toContain('radio--error');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have correct ARIA label', () => {
      const radio = nativeElement.querySelector<HTMLInputElement>('input[type="radio"]');
      if (!radio) {
        throw new Error('Radio element not found');
      }
      expect(radio.getAttribute('aria-label')).toBe('Test radio');
    });

    it('should link label with radio input', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();

      const radio = nativeElement.querySelector<HTMLInputElement>('input[type="radio"]');
      const label = nativeElement.querySelector<HTMLLabelElement>('label');
      if (!radio || !label) {
        throw new Error('Radio or label not found');
      }
      expect(label.getAttribute('for')).toBe(radio.id);
      expect(radio.getAttribute('aria-labelledby')).toBe(label.id);
    });

    it('should link helper text with radio input', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.detectChanges();

      const radio = nativeElement.querySelector<HTMLInputElement>('input[type="radio"]');
      const helperText = nativeElement.querySelector<HTMLElement>('.radio__helper-text');
      if (!radio || !helperText) {
        throw new Error('Radio or helper text not found');
      }
      expect(radio.getAttribute('aria-describedby')).toContain(helperText.id);
    });

    it('should set aria-invalid when validationState is error', () => {
      fixture.componentRef.setInput('validationState', 'error');
      fixture.detectChanges();

      const radio = nativeElement.querySelector<HTMLInputElement>('input[type="radio"]');
      if (!radio) {
        throw new Error('Radio element not found');
      }
      expect(radio.getAttribute('aria-invalid')).toBe('true');
    });

    it('should set aria-invalid when ariaInvalid is true', () => {
      fixture.componentRef.setInput('ariaInvalid', true);
      fixture.detectChanges();

      const radio = nativeElement.querySelector<HTMLInputElement>('input[type="radio"]');
      if (!radio) {
        throw new Error('Radio element not found');
      }
      expect(radio.getAttribute('aria-invalid')).toBe('true');
    });

    it('should hide required indicator from screen readers', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const requiredIndicator = nativeElement.querySelector<HTMLElement>('.input-label__required');
      if (!requiredIndicator) {
        throw new Error('Required indicator not found');
      }
      expect(requiredIndicator.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
