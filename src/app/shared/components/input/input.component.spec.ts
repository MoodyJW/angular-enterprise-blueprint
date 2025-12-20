// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { InputSize, InputType, InputValidationState, InputVariant } from './input.component';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    // Set required ariaLabel input for all tests
    fixture.componentRef.setInput('ariaLabel', 'Test input');
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (InputComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (InputComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - Variant', () => {
    it('should have default variant as default', () => {
      fixture.detectChanges();
      expect(component.variant()).toBe('default');
    });

    it('should apply custom variant', () => {
      const variants: InputVariant[] = ['default', 'filled', 'outlined'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(component.variant()).toBe(variant);
      });
    });

    it('should apply variant CSS class', () => {
      const variants: InputVariant[] = ['default', 'filled', 'outlined'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        const input = compiled.querySelector('input');
        expect(input?.className).toContain(`input--${variant}`);
      });
    });
  });

  describe('Input Handling - Size', () => {
    it('should have default size as md', () => {
      fixture.detectChanges();
      expect(component.size()).toBe('md');
    });

    it('should apply custom size', () => {
      const sizes: InputSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(component.size()).toBe(size);
      });
    });

    it('should apply size CSS class to wrapper', () => {
      const sizes: InputSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        const wrapper = compiled.querySelector('.input-wrapper');
        expect(wrapper?.className).toContain(`input-wrapper--${size}`);
      });
    });

    it('should apply size CSS class to input', () => {
      const sizes: InputSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        const input = compiled.querySelector('input');
        expect(input?.className).toContain(`input--${size}`);
      });
    });
  });

  describe('Input Handling - Type', () => {
    it('should have default type as text', () => {
      fixture.detectChanges();
      expect(component.type()).toBe('text');
    });

    it('should apply custom type', () => {
      const types: InputType[] = ['text', 'email', 'password', 'tel', 'url', 'search', 'number'];

      types.forEach((type) => {
        fixture.componentRef.setInput('type', type);
        fixture.detectChanges();
        expect(component.type()).toBe(type);
      });
    });

    it('should apply type attribute to input element', () => {
      const types: InputType[] = ['text', 'email', 'password', 'tel', 'url', 'search', 'number'];

      types.forEach((type) => {
        fixture.componentRef.setInput('type', type);
        fixture.detectChanges();
        const input = compiled.querySelector('input');
        expect(input?.getAttribute('type')).toBe(type);
      });
    });
  });

  describe('Input Handling - Value', () => {
    it('should have empty default value', () => {
      fixture.detectChanges();
      expect(component.value()).toBe('');
    });

    it('should apply custom value', () => {
      fixture.componentRef.setInput('value', 'test value');
      fixture.detectChanges();
      expect(component.value()).toBe('test value');
    });

    it('should sync value to input element', () => {
      fixture.componentRef.setInput('value', 'test value');
      fixture.detectChanges();
      const input = compiled.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('test value');
    });

    it('should emit valueChange when input changes', () => {
      let emittedValue = '';
      component.valueChange.subscribe((value) => {
        emittedValue = value;
      });

      fixture.detectChanges();
      const input = compiled.querySelector('input') as HTMLInputElement;
      input.value = 'new value';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(emittedValue).toBe('new value');
    });
  });

  describe('Input Handling - Label', () => {
    it('should not render label when not provided', () => {
      fixture.detectChanges();
      const label = compiled.querySelector('.input-label');
      expect(label).toBeNull();
    });

    it('should render label when provided', () => {
      fixture.componentRef.setInput('label', 'Username');
      fixture.detectChanges();
      const label = compiled.querySelector('.input-label');
      expect(label?.textContent.trim()).toContain('Username');
    });

    it('should show required indicator when required', () => {
      fixture.componentRef.setInput('label', 'Username');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const required = compiled.querySelector('.input-label__required');
      expect(required).toBeTruthy();
      expect(required?.textContent).toBe('*');
    });
  });

  describe('Input Handling - Placeholder', () => {
    it('should apply placeholder to input', () => {
      fixture.componentRef.setInput('placeholder', 'Enter text...');
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      expect(input?.getAttribute('placeholder')).toBe('Enter text...');
    });
  });

  describe('Input Handling - Helper Text', () => {
    it('should not render helper text when not provided', () => {
      fixture.detectChanges();
      const helperText = compiled.querySelector('.input-helper-text');
      expect(helperText).toBeNull();
    });

    it('should render helper text when provided', () => {
      fixture.componentRef.setInput('helperText', 'This is a hint');
      fixture.detectChanges();
      const helperText = compiled.querySelector('.input-helper-text');
      expect(helperText?.textContent.trim()).toBe('This is a hint');
    });
  });

  describe('Input Handling - Validation States', () => {
    it('should have default validation state as default', () => {
      fixture.detectChanges();
      expect(component.validationState()).toBe('default');
    });

    it('should apply custom validation state', () => {
      const states: InputValidationState[] = ['default', 'success', 'warning', 'error'];

      states.forEach((state) => {
        fixture.componentRef.setInput('validationState', state);
        fixture.detectChanges();
        expect(component.validationState()).toBe(state);
      });
    });

    it('should apply validation CSS class to input', () => {
      const states: InputValidationState[] = ['success', 'warning', 'error'];

      states.forEach((state) => {
        fixture.componentRef.setInput('validationState', state);
        fixture.detectChanges();
        const input = compiled.querySelector('input');
        expect(input?.className).toContain(`input--${state}`);
      });
    });

    it('should not apply validation CSS class for default state', () => {
      fixture.componentRef.setInput('validationState', 'default');
      fixture.detectChanges();
      const classes = component.inputClasses();
      // Should not have validation state class, only variant and size classes
      expect(classes).toContain('input--default'); // variant
      expect(classes).toContain('input--md'); // size
      // But validation states like success, warning, error should not be present
      expect(classes).not.toContain('input--success');
      expect(classes).not.toContain('input--warning');
      expect(classes).not.toContain('input--error');
    });

    it('should apply validation CSS class to helper text', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.componentRef.setInput('validationState', 'error');
      fixture.detectChanges();
      const helperText = compiled.querySelector('.input-helper-text');
      expect(helperText?.className).toContain('input-helper-text--error');
    });
  });

  describe('Input Handling - States', () => {
    it('should handle disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);
      const input = compiled.querySelector('input') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it('should handle readonly state', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();
      expect(component.readonly()).toBe(true);
      const input = compiled.querySelector('input') as HTMLInputElement;
      expect(input.readOnly).toBe(true);
    });

    it('should handle required state', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      expect(component.required()).toBe(true);
      const input = compiled.querySelector('input') as HTMLInputElement;
      expect(input.required).toBe(true);
    });

    it('should apply disabled CSS class', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      expect(input?.className).toContain('input--disabled');
    });

    it('should apply readonly CSS class', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      expect(input?.className).toContain('input--readonly');
    });
  });

  describe('Input Handling - Length Constraints', () => {
    it('should apply maxLength attribute', () => {
      fixture.componentRef.setInput('maxLength', 10);
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      expect(input?.getAttribute('maxlength')).toBe('10');
    });

    it('should apply minLength attribute', () => {
      fixture.componentRef.setInput('minLength', 3);
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      expect(input?.getAttribute('minlength')).toBe('3');
    });
  });

  describe('Input Handling - Pattern', () => {
    it('should apply pattern attribute', () => {
      fixture.componentRef.setInput('pattern', '[0-9]+');
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      expect(input?.getAttribute('pattern')).toBe('[0-9]+');
    });
  });

  describe('Input Handling - Autocomplete', () => {
    it('should apply autocomplete attribute', () => {
      fixture.componentRef.setInput('autocomplete', 'email');
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      expect(input?.getAttribute('autocomplete')).toBe('email');
    });
  });

  describe('Input Handling - Prefix and Suffix', () => {
    it('should render prefix when provided', () => {
      fixture.componentRef.setInput('prefix', '$');
      fixture.detectChanges();
      const prefix = compiled.querySelector('.input-prefix');
      expect(prefix?.textContent.trim()).toBe('$');
    });

    it('should render suffix when provided', () => {
      fixture.componentRef.setInput('suffix', '.com');
      fixture.detectChanges();
      const suffix = compiled.querySelector('.input-suffix');
      expect(suffix?.textContent.trim()).toBe('.com');
    });

    it('should apply prefix CSS class to input', () => {
      fixture.componentRef.setInput('prefix', '$');
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      expect(input?.className).toContain('input--has-prefix');
    });

    it('should apply suffix CSS class to input', () => {
      fixture.componentRef.setInput('suffix', '.com');
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      expect(input?.className).toContain('input--has-suffix');
    });
  });

  describe('Input Handling - Character Count', () => {
    it('should not show character count by default', () => {
      fixture.componentRef.setInput('maxLength', 10);
      fixture.detectChanges();
      const charCount = compiled.querySelector('.input-char-count');
      expect(charCount).toBeNull();
    });

    it('should show character count when enabled', () => {
      fixture.componentRef.setInput('maxLength', 10);
      fixture.componentRef.setInput('showCharCount', true);
      fixture.detectChanges();
      const charCount = compiled.querySelector('.input-char-count');
      expect(charCount).toBeTruthy();
    });

    it('should display correct character count', () => {
      fixture.componentRef.setInput('maxLength', 10);
      fixture.componentRef.setInput('showCharCount', true);
      fixture.componentRef.setInput('value', 'test');
      fixture.detectChanges();
      // Wait for effect to sync value
      fixture.detectChanges();
      const charCount = compiled.querySelector('.input-char-count');
      expect(charCount?.textContent.trim()).toBe('4/10');
    });

    it('should update character count on input', () => {
      fixture.componentRef.setInput('maxLength', 10);
      fixture.componentRef.setInput('showCharCount', true);
      fixture.detectChanges();

      // Manually call handleInput to update the internal value
      const mockEvent = {
        target: {
          value: 'hello',
        },
      } as unknown as Event;
      component.handleInput(mockEvent);
      fixture.detectChanges();

      // The internalValue signal should be updated
      expect(component.internalValue()).toBe('hello');

      const charCount = compiled.querySelector('.input-char-count');
      expect(charCount?.textContent.trim()).toBe('5/10');
    });
  });

  describe('Input Handling - Full Width', () => {
    it('should apply full width CSS class', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();
      const wrapper = compiled.querySelector('.input-wrapper');
      expect(wrapper?.className).toContain('input-wrapper--full-width');
    });
  });

  describe('Accessibility - ARIA Attributes', () => {
    it('should have required aria-label', () => {
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      expect(input?.getAttribute('aria-label')).toBe('Test input');
    });

    it('should apply custom aria-describedby', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'custom-description');
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      expect(input?.getAttribute('aria-describedby')).toContain('custom-description');
    });

    it('should link helper text with aria-describedby', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      const helperTextId = component.helperTextId();
      expect(input?.getAttribute('aria-describedby')).toContain(helperTextId);
    });

    it('should set aria-invalid when validationState is error', () => {
      fixture.componentRef.setInput('validationState', 'error');
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      expect(input?.getAttribute('aria-invalid')).toBe('true');
    });

    it('should set aria-invalid when ariaInvalid is true', () => {
      fixture.componentRef.setInput('ariaInvalid', true);
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      expect(input?.getAttribute('aria-invalid')).toBe('true');
    });

    it('should set aria-required when required', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      expect(input?.getAttribute('aria-required')).toBe('true');
    });

    it('should link label with aria-labelledby', () => {
      fixture.componentRef.setInput('label', 'Username');
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      const labelId = component.labelId();
      expect(input?.getAttribute('aria-labelledby')).toBe(labelId);
    });
  });

  describe('Event Handling', () => {
    it('should emit focused event on focus', () => {
      let focusedCalled = false;
      component.focused.subscribe(() => {
        focusedCalled = true;
      });

      fixture.detectChanges();
      const input = compiled.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new FocusEvent('focus'));
      fixture.detectChanges();

      expect(focusedCalled).toBe(true);
    });

    it('should emit blurred event on blur', () => {
      let blurredCalled = false;
      component.blurred.subscribe(() => {
        blurredCalled = true;
      });

      fixture.detectChanges();
      const input = compiled.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new FocusEvent('blur'));
      fixture.detectChanges();

      expect(blurredCalled).toBe(true);
    });

    it('should update isFocused signal on focus', () => {
      fixture.detectChanges();
      expect(component.isFocused()).toBe(false);

      const input = compiled.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new FocusEvent('focus'));
      fixture.detectChanges();

      expect(component.isFocused()).toBe(true);
    });

    it('should update isFocused signal on blur', () => {
      fixture.detectChanges();
      const input = compiled.querySelector('input') as HTMLInputElement;

      input.dispatchEvent(new FocusEvent('focus'));
      fixture.detectChanges();
      expect(component.isFocused()).toBe(true);

      input.dispatchEvent(new FocusEvent('blur'));
      fixture.detectChanges();
      expect(component.isFocused()).toBe(false);
    });

    it('should emit enterPressed event on Enter key', () => {
      let enterPressed = false;
      component.enterPressed.subscribe(() => {
        enterPressed = true;
      });

      fixture.detectChanges();
      const input = compiled.querySelector('input') as HTMLInputElement;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      input.dispatchEvent(event);
      fixture.detectChanges();

      expect(enterPressed).toBe(true);
    });

    it('should not emit enterPressed on other keys', () => {
      let enterPressed = false;
      component.enterPressed.subscribe(() => {
        enterPressed = true;
      });

      fixture.detectChanges();
      const input = compiled.querySelector('input') as HTMLInputElement;
      const event = new KeyboardEvent('keydown', { key: 'a' });
      input.dispatchEvent(event);
      fixture.detectChanges();

      expect(enterPressed).toBe(false);
    });
  });

  describe('Public Methods', () => {
    it('should focus input programmatically', () => {
      fixture.detectChanges();
      const input = compiled.querySelector('input') as HTMLInputElement;
      const focusSpy = vi.spyOn(input, 'focus');

      component.focus();

      expect(focusSpy).toHaveBeenCalled();
    });

    it('should blur input programmatically', () => {
      fixture.detectChanges();
      const input = compiled.querySelector('input') as HTMLInputElement;
      const blurSpy = vi.spyOn(input, 'blur');

      component.blur();

      expect(blurSpy).toHaveBeenCalled();
    });

    it('should select input text programmatically', () => {
      fixture.detectChanges();
      const input = compiled.querySelector('input') as HTMLInputElement;
      const selectSpy = vi.spyOn(input, 'select');

      component.select();

      expect(selectSpy).toHaveBeenCalled();
    });
  });

  describe('CSS Classes', () => {
    it('should generate correct wrapper classes', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();

      const classes = component.wrapperClasses();
      expect(classes).toContain('input-wrapper');
      expect(classes).toContain('input-wrapper--lg');
      expect(classes).toContain('input-wrapper--full-width');
    });

    it('should generate correct input classes', () => {
      fixture.componentRef.setInput('variant', 'outlined');
      fixture.componentRef.setInput('size', 'sm');
      fixture.componentRef.setInput('validationState', 'error');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const classes = component.inputClasses();
      expect(classes).toContain('input');
      expect(classes).toContain('input--outlined');
      expect(classes).toContain('input--sm');
      expect(classes).toContain('input--error');
      expect(classes).toContain('input--disabled');
    });

    it('should apply focused class when focused', () => {
      fixture.detectChanges();
      const input = compiled.querySelector('input') as HTMLInputElement;

      input.dispatchEvent(new FocusEvent('focus'));
      fixture.detectChanges();

      expect(component.inputClasses()).toContain('input--focused');
    });
  });

  describe('Computed Values', () => {
    it('should compute character count text correctly', () => {
      fixture.componentRef.setInput('maxLength', 20);
      fixture.componentRef.setInput('showCharCount', true);
      fixture.componentRef.setInput('value', 'Hello');
      fixture.detectChanges();

      expect(component.charCountText()).toBe('5/20');
    });

    it('should return empty string when showCharCount is false', () => {
      fixture.componentRef.setInput('maxLength', 20);
      fixture.componentRef.setInput('showCharCount', false);
      fixture.componentRef.setInput('value', 'Hello');
      fixture.detectChanges();

      expect(component.charCountText()).toBe('');
    });

    it('should return empty string when maxLength is not set', () => {
      fixture.componentRef.setInput('showCharCount', true);
      fixture.componentRef.setInput('value', 'Hello');
      fixture.detectChanges();

      expect(component.charCountText()).toBe('');
    });
  });

  describe('Rendering', () => {
    it('should render input element', () => {
      fixture.detectChanges();
      const input = compiled.querySelector('input');
      expect(input).toBeTruthy();
    });

    it('should render with all components when fully configured', () => {
      fixture.componentRef.setInput('label', 'Username');
      fixture.componentRef.setInput('placeholder', 'Enter username');
      fixture.componentRef.setInput('helperText', 'Required field');
      fixture.componentRef.setInput('prefix', '@');
      fixture.componentRef.setInput('suffix', '.com');
      fixture.componentRef.setInput('maxLength', 20);
      fixture.componentRef.setInput('showCharCount', true);
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      expect(compiled.querySelector('.input-label')).toBeTruthy();
      expect(compiled.querySelector('.input-prefix')).toBeTruthy();
      expect(compiled.querySelector('.input-suffix')).toBeTruthy();
      expect(compiled.querySelector('.input-helper-text')).toBeTruthy();
      expect(compiled.querySelector('.input-char-count')).toBeTruthy();
    });
  });
});
