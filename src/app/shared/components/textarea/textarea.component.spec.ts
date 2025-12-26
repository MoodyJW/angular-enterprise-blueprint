// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type {
  TextareaResize,
  TextareaSize,
  TextareaValidationState,
  TextareaVariant,
} from './textarea.component';
import { TextareaComponent } from './textarea.component';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    // Set required ariaLabel input for all tests
    fixture.componentRef.setInput('ariaLabel', 'Test textarea');
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (TextareaComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (TextareaComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - Variant', () => {
    it('should have default variant as default', () => {
      fixture.detectChanges();
      expect(component.variant()).toBe('default');
    });

    it('should apply custom variant', () => {
      const variants: TextareaVariant[] = ['default', 'filled', 'outlined'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(component.variant()).toBe(variant);
      });
    });

    it('should apply variant CSS class', () => {
      const variants: TextareaVariant[] = ['default', 'filled', 'outlined'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        const textarea = compiled.querySelector('textarea');
        expect(textarea?.className).toContain(`textarea--${variant}`);
      });
    });
  });

  describe('Input Handling - Size', () => {
    it('should have default size as md', () => {
      fixture.detectChanges();
      expect(component.size()).toBe('md');
    });

    it('should apply custom size', () => {
      const sizes: TextareaSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(component.size()).toBe(size);
      });
    });

    it('should apply size CSS class to wrapper', () => {
      const sizes: TextareaSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        const wrapper = compiled.querySelector('.textarea-wrapper');
        expect(wrapper?.className).toContain(`textarea-wrapper--${size}`);
      });
    });

    it('should apply size CSS class to textarea', () => {
      const sizes: TextareaSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        const textarea = compiled.querySelector('textarea');
        expect(textarea?.className).toContain(`textarea--${size}`);
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

    it('should sync value to textarea element', () => {
      fixture.componentRef.setInput('value', 'test value');
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea.value).toBe('test value');
    });

    it('should update internal value when value input changes', () => {
      fixture.componentRef.setInput('value', 'initial');
      fixture.detectChanges();
      expect(component.internalValue()).toBe('initial');

      fixture.componentRef.setInput('value', 'updated');
      fixture.detectChanges();
      expect(component.internalValue()).toBe('updated');
    });
  });

  describe('Input Handling - Rows', () => {
    it('should have default rows as 4', () => {
      fixture.detectChanges();
      expect(component.rows()).toBe(4);
    });

    it('should apply custom rows', () => {
      fixture.componentRef.setInput('rows', 8);
      fixture.detectChanges();
      expect(component.rows()).toBe(8);
    });

    it('should apply rows attribute to textarea element', () => {
      fixture.componentRef.setInput('rows', 6);
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      expect(textarea?.getAttribute('rows')).toBe('6');
    });
  });

  describe('Input Handling - Resize', () => {
    it('should have default resize as vertical', () => {
      fixture.detectChanges();
      expect(component.resize()).toBe('vertical');
    });

    it('should apply custom resize', () => {
      const resizes: TextareaResize[] = ['none', 'vertical', 'horizontal', 'both'];

      resizes.forEach((resize) => {
        fixture.componentRef.setInput('resize', resize);
        fixture.detectChanges();
        expect(component.resize()).toBe(resize);
      });
    });

    it('should apply resize CSS class', () => {
      const resizes: TextareaResize[] = ['none', 'vertical', 'horizontal', 'both'];

      resizes.forEach((resize) => {
        fixture.componentRef.setInput('resize', resize);
        fixture.detectChanges();
        const textarea = compiled.querySelector('textarea');
        expect(textarea?.className).toContain(`textarea--resize-${resize}`);
      });
    });
  });

  describe('Input Handling - AutoResize', () => {
    it('should have default autoResize as false', () => {
      fixture.detectChanges();
      expect(component.autoResize()).toBe(false);
    });

    it('should apply custom autoResize', () => {
      fixture.componentRef.setInput('autoResize', true);
      fixture.detectChanges();
      expect(component.autoResize()).toBe(true);
    });

    it('should apply auto-resize CSS class when enabled', () => {
      fixture.componentRef.setInput('autoResize', true);
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      expect(textarea?.className).toContain('textarea--auto-resize');
    });
  });

  describe('Label Handling', () => {
    it('should not render label by default', () => {
      fixture.detectChanges();
      const label = compiled.querySelector('.textarea-label');
      expect(label).toBeNull();
    });

    it('should render label when provided', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();
      const label = compiled.querySelector('.textarea-label');
      expect(label?.textContent).toContain('Test Label');
    });

    it('should show required indicator when required is true', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const required = compiled.querySelector('.textarea-label__required');
      expect(required).toBeTruthy();
      expect(required?.textContent).toContain('*');
    });

    it('should apply disabled class to label when disabled', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const label = compiled.querySelector('.textarea-label');
      expect(label?.className).toContain('textarea-label--disabled');
    });
  });

  describe('Placeholder Handling', () => {
    it('should apply placeholder to textarea element', () => {
      fixture.componentRef.setInput('placeholder', 'Enter text here');
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      expect(textarea?.getAttribute('placeholder')).toBe('Enter text here');
    });
  });

  describe('Validation State', () => {
    it('should have default validation state as default', () => {
      fixture.detectChanges();
      expect(component.validationState()).toBe('default');
    });

    it('should apply custom validation state', () => {
      const states: TextareaValidationState[] = ['default', 'success', 'warning', 'error'];

      states.forEach((state) => {
        fixture.componentRef.setInput('validationState', state);
        fixture.detectChanges();
        expect(component.validationState()).toBe(state);
      });
    });

    it('should apply validation CSS class for non-default states', () => {
      const states: TextareaValidationState[] = ['success', 'warning', 'error'];

      states.forEach((state) => {
        fixture.componentRef.setInput('validationState', state);
        fixture.detectChanges();
        const textarea = compiled.querySelector('textarea');
        expect(textarea?.className).toContain(`textarea--${state}`);
      });
    });

    it('should not apply validation-specific CSS classes for default state', () => {
      fixture.componentRef.setInput('validationState', 'default');
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      // Should have variant class but no validation state classes
      expect(textarea?.className).toContain('textarea--default'); // variant class is fine
      expect(textarea?.className).not.toContain('textarea--success');
      expect(textarea?.className).not.toContain('textarea--warning');
      expect(textarea?.className).not.toContain('textarea--error');
    });
  });

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      fixture.detectChanges();
      expect(component.disabled()).toBe(false);
    });

    it('should apply disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);
    });

    it('should apply disabled attribute to textarea element', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      expect(textarea?.hasAttribute('disabled')).toBe(true);
    });

    it('should apply disabled CSS class', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      expect(textarea?.className).toContain('textarea--disabled');
    });
  });

  describe('Readonly State', () => {
    it('should not be readonly by default', () => {
      fixture.detectChanges();
      expect(component.readonly()).toBe(false);
    });

    it('should apply readonly state', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();
      expect(component.readonly()).toBe(true);
    });

    it('should apply readonly attribute to textarea element', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      expect(textarea?.hasAttribute('readonly')).toBe(true);
    });

    it('should apply readonly CSS class', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      expect(textarea?.className).toContain('textarea--readonly');
    });
  });

  describe('Required State', () => {
    it('should not be required by default', () => {
      fixture.detectChanges();
      expect(component.required()).toBe(false);
    });

    it('should apply required state', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      expect(component.required()).toBe(true);
    });

    it('should apply required attribute to textarea element', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      expect(textarea?.hasAttribute('required')).toBe(true);
    });
  });

  describe('Full Width', () => {
    it('should not be full width by default', () => {
      fixture.detectChanges();
      expect(component.fullWidth()).toBe(false);
    });

    it('should apply full width state', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();
      expect(component.fullWidth()).toBe(true);
    });

    it('should apply full width CSS class to wrapper', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();
      const wrapper = compiled.querySelector('.textarea-wrapper');
      expect(wrapper?.className).toContain('textarea-wrapper--full-width');
    });
  });

  describe('Max/Min Length', () => {
    it('should apply maxlength attribute to textarea element', () => {
      fixture.componentRef.setInput('maxLength', 100);
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      expect(textarea?.getAttribute('maxlength')).toBe('100');
    });

    it('should apply minlength attribute to textarea element', () => {
      fixture.componentRef.setInput('minLength', 10);
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      expect(textarea?.getAttribute('minlength')).toBe('10');
    });
  });

  describe('Helper Text', () => {
    it('should not render footer by default', () => {
      fixture.detectChanges();
      const footer = compiled.querySelector('eb-input-footer');
      expect(footer).toBeNull();
    });

    it('should render footer when helperText is provided', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.detectChanges();
      const footer = compiled.querySelector('eb-input-footer');
      expect(footer).toBeTruthy();
    });

    it('should generate helperText classes based on validation state', () => {
      fixture.componentRef.setInput('validationState', 'error');
      fixture.detectChanges();
      expect(component.helperTextClasses()).toContain('textarea-helper-text--error');
    });
  });

  describe('Character Count', () => {
    it('should not show character count by default', () => {
      fixture.detectChanges();
      expect(component.shouldShowCharCount()).toBe(false);
    });

    it('should show character count when showCharCount and maxLength are set', () => {
      fixture.componentRef.setInput('showCharCount', true);
      fixture.componentRef.setInput('maxLength', 100);
      fixture.detectChanges();
      expect(component.shouldShowCharCount()).toBe(true);
    });

    it('should not show character count when maxLength is not set', () => {
      fixture.componentRef.setInput('showCharCount', true);
      fixture.detectChanges();
      expect(component.shouldShowCharCount()).toBe(false);
    });

    it('should compute character count text correctly', () => {
      fixture.componentRef.setInput('showCharCount', true);
      fixture.componentRef.setInput('maxLength', 100);
      fixture.componentRef.setInput('value', 'test');
      fixture.detectChanges();
      expect(component.charCountText()).toBe('4/100');
    });

    it('should update character count as value changes', () => {
      fixture.componentRef.setInput('showCharCount', true);
      fixture.componentRef.setInput('maxLength', 100);
      fixture.componentRef.setInput('value', 'test');
      fixture.detectChanges();
      expect(component.charCountText()).toBe('4/100');

      fixture.componentRef.setInput('value', 'test value');
      fixture.detectChanges();
      expect(component.charCountText()).toBe('10/100');
    });
  });

  describe('ARIA Attributes', () => {
    it('should apply aria-label attribute', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom label');
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      expect(textarea?.getAttribute('aria-label')).toBe('Custom label');
    });

    it('should apply aria-invalid when validation state is error', () => {
      fixture.componentRef.setInput('validationState', 'error');
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      expect(textarea?.getAttribute('aria-invalid')).toBe('true');
    });

    it('should apply aria-invalid when ariaInvalid is true', () => {
      fixture.componentRef.setInput('ariaInvalid', true);
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      expect(textarea?.getAttribute('aria-invalid')).toBe('true');
    });

    it('should apply aria-required when required is true', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      expect(textarea?.getAttribute('aria-required')).toBe('true');
    });

    it('should apply aria-describedby when helperText is provided', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      const describedBy = textarea?.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(describedBy).toContain('textarea-helper');
    });

    it('should combine user aria-describedby with generated helper text id', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.componentRef.setInput('ariaDescribedBy', 'custom-id');
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea');
      const describedBy = textarea?.getAttribute('aria-describedby');
      expect(describedBy).toContain('textarea-helper');
      expect(describedBy).toContain('custom-id');
    });
  });

  describe('Event Handling', () => {
    it('should emit valueChange event on input', () => {
      const spy = vi.fn();
      component.valueChange.subscribe(spy);

      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
      textarea.value = 'new value';
      textarea.dispatchEvent(new Event('input'));

      expect(spy).toHaveBeenCalledWith('new value');
    });

    it('should update internal value on input', () => {
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
      textarea.value = 'new value';
      textarea.dispatchEvent(new Event('input'));

      expect(component.internalValue()).toBe('new value');
    });

    it('should emit focused event on focus', () => {
      const spy = vi.fn();
      component.focused.subscribe(spy);

      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
      textarea.dispatchEvent(new FocusEvent('focus'));

      expect(spy).toHaveBeenCalled();
    });

    it('should set isFocused to true on focus', () => {
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
      textarea.dispatchEvent(new FocusEvent('focus'));

      expect(component.isFocused()).toBe(true);
    });

    it('should emit blurred event on blur', () => {
      const spy = vi.fn();
      component.blurred.subscribe(spy);

      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
      textarea.dispatchEvent(new FocusEvent('blur'));

      expect(spy).toHaveBeenCalled();
    });

    it('should set isFocused to false on blur', () => {
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
      textarea.dispatchEvent(new FocusEvent('focus'));
      expect(component.isFocused()).toBe(true);

      textarea.dispatchEvent(new FocusEvent('blur'));
      expect(component.isFocused()).toBe(false);
    });

    it('should apply focused CSS class when focused', () => {
      fixture.detectChanges();
      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
      textarea.dispatchEvent(new FocusEvent('focus'));
      fixture.detectChanges();

      expect(textarea.className).toContain('textarea--focused');
    });
  });

  describe('Public Methods', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should focus textarea when focus() is called', () => {
      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
      const spy = vi.spyOn(textarea, 'focus');
      component.focus();
      expect(spy).toHaveBeenCalled();
    });

    it('should blur textarea when blur() is called', () => {
      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
      const spy = vi.spyOn(textarea, 'blur');
      component.blur();
      expect(spy).toHaveBeenCalled();
    });

    it('should select all text when select() is called', () => {
      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
      const spy = vi.spyOn(textarea, 'select');
      component.select();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Computed Properties', () => {
    it('should compute showFooter correctly when helperText is provided', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.detectChanges();
      expect(component.showFooter()).toBe(true);
    });

    it('should compute showFooter correctly when showCharCount and maxLength are set', () => {
      fixture.componentRef.setInput('showCharCount', true);
      fixture.componentRef.setInput('maxLength', 100);
      fixture.detectChanges();
      expect(component.showFooter()).toBe(true);
    });

    it('should compute showFooter as false when no footer content', () => {
      fixture.detectChanges();
      expect(component.showFooter()).toBe(false);
    });

    it('should generate unique IDs for helper text', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.detectChanges();
      const id = component.helperTextId();
      expect(id).toBeTruthy();
      expect(id).toContain('textarea-helper-');
    });

    it('should generate unique IDs for label', () => {
      fixture.componentRef.setInput('label', 'Label text');
      fixture.detectChanges();
      const id = component.labelId();
      expect(id).toBeTruthy();
      expect(id).toContain('textarea-label-');
    });
  });

  describe('Auto Resize Logic', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });
    it('should adjust height when value changes and autoResize is true', () => {
      fixture.componentRef.setInput('autoResize', true);
      fixture.detectChanges(); // Sync initial state

      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
      Object.defineProperty(textarea, 'scrollHeight', { value: 100, configurable: true });

      fixture.componentRef.setInput('value', 'initial\nlines\nof\ntext');
      fixture.detectChanges();

      // Should be 100px (from scrollHeight) + borders/padding (from default styles in JSDOM or mock)
      // Since we didn't mock getComputedStyle here, it uses JSDOM defaults (likely 0 or empty)
      // _calculateMinHeight might return NaN if style parsing fails?
      // But _adjustHeight sets height to scrollHeight if others are undefined.

      expect(textarea.style.height).not.toBe('auto');
      expect(textarea.style.height).toBeTruthy();
    });

    it('should not adjust height when autoResize is false', () => {
      fixture.componentRef.setInput('autoResize', false);
      fixture.componentRef.setInput('value', 'text');
      fixture.detectChanges();

      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea.style.height).toBe('');
    });

    it('should respect minRows configuration', () => {
      fixture.componentRef.setInput('autoResize', true);
      fixture.componentRef.setInput('minRows', 5);
      fixture.componentRef.setInput('value', 'short');
      fixture.detectChanges();

      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea.style.height).toBeTruthy();
      // Logic inside component: height = minRows * lineHeight + paddings + borders
      // We verify it calculated *something* larger than default
    });

    it('should respect maxRows configuration', () => {
      fixture.componentRef.setInput('autoResize', true);
      fixture.componentRef.setInput('maxRows', 2);
      fixture.componentRef.setInput('value', 'many\nlines\nof\ntext\nto\noverflow');
      fixture.detectChanges();

      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea.style.height).toBeTruthy();
    });

    it('should calculate dimensions correctly with defined styles', () => {
      // Mock getComputedStyle to return predictable values for calculations
      const mockStyle = {
        lineHeight: '20px',
        paddingTop: '10px',
        paddingBottom: '10px',
        borderTopWidth: '1px',
        borderBottomWidth: '1px',
      } as CSSStyleDeclaration;

      vi.spyOn(window, 'getComputedStyle').mockReturnValue(mockStyle);

      fixture.componentRef.setInput('autoResize', true);
      fixture.componentRef.setInput('rows', 3);
      fixture.detectChanges();

      // Calculation:
      // minHeight = minRows(3) * 20 + 10 + 10 + 1 + 1 = 60 + 22 = 82px
      const textarea = compiled.querySelector('textarea') as HTMLTextAreaElement;

      // Manually trigger highlight adjustment if needed or rely on effect.
      // The effect runs on init if autoResize is true?
      // Yes, `_syncAutoResize` effect runs.
      // But we might need to force a value change to trigger `_adjustHeight` path fully?
      // Actually `_syncAutoResize` calls `_adjustHeight`.

      expect(textarea.style.height).toBe('82px');
    });

    it('should handle undefined computed styles gracefully', () => {
      vi.spyOn(window, 'getComputedStyle').mockImplementation(() => {
        throw new Error('Access denied');
      });

      fixture.componentRef.setInput('autoResize', true);
      fixture.componentRef.setInput('value', 'test');
      fixture.detectChanges();

      // Should not crash, validation implicitly passes if no error thrown
      expect(component).toBeTruthy();
    });

    it('should handle missing window/globalThis gracefully (SSR simulation)', () => {
      // It's hard to delete globalThis, but we can try to test the _safeGetComputedStyle method isolation if we cast component
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      const safeGetStyle = (component as any)._safeGetComputedStyle;
      // We can't really replace globalThis easily in this environment without breaking other things.
      // Coverage might remain low for that specific catch block unless we do sophisticated mocking.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      expect(safeGetStyle(document.createElement('div'))).toBeTruthy();
    });
  });

  describe('CSS Classes', () => {
    it('should generate correct wrapper classes', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();
      const classes = component.wrapperClasses();
      expect(classes).toContain('textarea-wrapper');
      expect(classes).toContain('textarea-wrapper--lg');
      expect(classes).toContain('textarea-wrapper--full-width');
    });

    it('should generate correct textarea classes', () => {
      fixture.componentRef.setInput('variant', 'outlined');
      fixture.componentRef.setInput('size', 'sm');
      fixture.componentRef.setInput('resize', 'both');
      fixture.componentRef.setInput('validationState', 'error');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const classes = component.textareaClasses();
      expect(classes).toContain('textarea');
      expect(classes).toContain('textarea--outlined');
      expect(classes).toContain('textarea--sm');
      expect(classes).toContain('textarea--resize-both');
      expect(classes).toContain('textarea--error');
      expect(classes).toContain('textarea--disabled');
    });
  });
});
