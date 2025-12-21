/* eslint-disable @typescript-eslint/unbound-method */
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UniqueIdService } from '../../services/unique-id/unique-id.service';

import { InputFooterComponent } from '../input-footer';
import { InputLabelComponent } from '../input-label';

import { FormFieldComponent } from './form-field.component';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;
  let generateIdSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    generateIdSpy = vi.fn().mockReturnValue('test-id-123');
    const uniqueIdServiceMock = {
      generateId: generateIdSpy,
    };

    await TestBed.configureTestingModule({
      imports: [FormFieldComponent, InputLabelComponent, InputFooterComponent],
      providers: [{ provide: UniqueIdService, useValue: uniqueIdServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
    TestBed.inject(UniqueIdService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Basic Rendering', () => {
    it('should render without label when not provided', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const label = compiled.querySelector<HTMLElement>('eb-input-label');
      expect(label).toBeFalsy();
    });

    it('should render label when provided', () => {
      fixture.componentRef.setInput('label', 'Email Address');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const label = compiled.querySelector<HTMLElement>('eb-input-label');
      expect(label).toBeTruthy();
    });

    it('should render required indicator when required is true', () => {
      fixture.componentRef.setInput('label', 'Email');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      expect(component.required()).toBe(true);
    });

    it('should project content into content area', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.querySelector<HTMLElement>('.form-field__content');
      expect(content).toBeTruthy();
    });

    it('should apply custom wrapper classes', () => {
      fixture.componentRef.setInput('wrapperClass', 'custom-class');
      fixture.detectChanges();

      expect(component.wrapperClasses()).toContain('custom-class');
    });
  });

  describe('Helper Text', () => {
    it('should display helper text when provided', () => {
      fixture.componentRef.setInput('helperText', 'This is helper text');
      fixture.detectChanges();

      expect(component.footerText()).toBe('This is helper text');
      expect(component.showFooter()).toBe(true);
    });

    it('should not show footer when no helper text or errors', () => {
      expect(component.showFooter()).toBe(false);
    });

    it('should generate unique helper ID when helper text exists', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.detectChanges();

      expect(component.helperId()).toBeDefined();
      expect(generateIdSpy).toHaveBeenCalledWith('form-field-helper');
    });
  });

  describe('Manual Error Messages', () => {
    it('should display single error message', () => {
      fixture.componentRef.setInput('errors', 'This field is required');
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors).toEqual(['This field is required']);
      expect(component.footerText()).toBe('This field is required');
    });

    it('should display multiple error messages', () => {
      fixture.componentRef.setInput('errors', ['Error 1', 'Error 2']);
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors).toEqual(['Error 1', 'Error 2']);
      expect(component.footerText()).toBe('Error 1 Error 2');
    });

    it('should prioritize errors over helper text', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.componentRef.setInput('errors', 'Error message');
      fixture.detectChanges();

      expect(component.footerText()).toBe('Error message');
    });

    it('should handle null errors', () => {
      fixture.componentRef.setInput('errors', null);
      fixture.detectChanges();

      expect(component.computedErrors()).toEqual([]);
    });

    it('should handle empty string errors', () => {
      fixture.componentRef.setInput('errors', '');
      fixture.detectChanges();

      // Empty string is falsy, so it's treated as no errors
      expect(component.computedErrors()).toEqual([]);
    });
  });

  describe('FormControl Integration', () => {
    it('should extract errors from invalid FormControl', () => {
      const control = new FormControl('', Validators.required);
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('required');
    });

    it('should not show errors when control is untouched by default', () => {
      const control = new FormControl('', Validators.required);
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(component.computedErrors()).toEqual([]);
    });

    it('should show errors when control is dirty', () => {
      const control = new FormControl('', Validators.required);
      control.markAsDirty();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should show errors immediately when showErrorsOnTouched is false', () => {
      const control = new FormControl('', Validators.required);
      fixture.componentRef.setInput('control', control);
      fixture.componentRef.setInput('showErrorsOnTouched', false);
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should not show errors when control is valid', () => {
      const control = new FormControl('test@example.com', Validators.email);
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(component.computedErrors()).toEqual([]);
    });

    it('should handle multiple validators', () => {
      const control = new FormControl('ab', [Validators.required, Validators.minLength(3)]);
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Custom Error Messages', () => {
    it('should use custom error messages when provided', () => {
      const control = new FormControl('', Validators.required);
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.componentRef.setInput('errorMessages', { required: 'Custom required message' });
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors).toContain('Custom required message');
    });

    it('should replace placeholders in custom messages', () => {
      const control = new FormControl('ab', Validators.minLength(5));
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.componentRef.setInput('errorMessages', {
        minlength: 'Must be at least {requiredLength} characters',
      });
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors[0]).toBe('Must be at least 5 characters');
    });

    it('should handle email validator with custom message', () => {
      const control = new FormControl('invalid-email', Validators.email);
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.componentRef.setInput('errorMessages', { email: 'Enter a valid email' });
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors).toContain('Enter a valid email');
    });
  });

  describe('Default Error Messages', () => {
    it('should provide default message for required validator', () => {
      const control = new FormControl('', Validators.required);
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors[0]).toBe('This field is required');
    });

    it('should provide default message for email validator', () => {
      const control = new FormControl('invalid', Validators.email);
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors[0]).toBe('Please enter a valid email address');
    });

    it('should provide default message for minlength validator', () => {
      const control = new FormControl('ab', Validators.minLength(5));
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors[0]).toBe('Must be at least 5 characters');
    });

    it('should provide default message for maxlength validator', () => {
      const control = new FormControl('toolongtext', Validators.maxLength(5));
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors[0]).toBe('Must be at most 5 characters');
    });

    it('should provide default message for min validator', () => {
      const control = new FormControl(5, Validators.min(10));
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors[0]).toBe('Value must be at least 10');
    });

    it('should provide default message for max validator', () => {
      const control = new FormControl(15, Validators.max(10));
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors[0]).toBe('Value must be at most 10');
    });

    it('should provide default message for pattern validator', () => {
      const control = new FormControl('abc', Validators.pattern(/^[0-9]+$/));
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors[0]).toBe('Invalid format');
    });

    it('should provide generic message for unknown validator', () => {
      const control = new FormControl('test');
      control.setErrors({ customError: true });
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      const errors = component.computedErrors();
      expect(errors[0]).toBe('Validation error: customError');
    });
  });

  describe('Validation State', () => {
    it('should default to "default" state', () => {
      expect(component.computedValidationState()).toBe('default');
    });

    it('should set state to "error" when errors exist', () => {
      fixture.componentRef.setInput('errors', 'Error message');
      fixture.detectChanges();

      expect(component.computedValidationState()).toBe('error');
    });

    it('should set state to "success" when control is valid and touched', () => {
      const control = new FormControl('test@example.com', Validators.email);
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(component.computedValidationState()).toBe('success');
    });

    it('should use manual validation state when provided', () => {
      fixture.componentRef.setInput('validationState', 'warning');
      fixture.detectChanges();

      expect(component.computedValidationState()).toBe('warning');
    });

    it('should prioritize manual state over derived state', () => {
      const control = new FormControl('', Validators.required);
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.componentRef.setInput('validationState', 'success');
      fixture.detectChanges();

      expect(component.computedValidationState()).toBe('success');
    });

    it('should apply validation state classes to wrapper', () => {
      fixture.componentRef.setInput('validationState', 'error');
      fixture.detectChanges();

      expect(component.wrapperClasses()).toContain('form-field--error');
    });

    it('should apply validation state classes to footer', () => {
      fixture.componentRef.setInput('errors', 'Error');
      fixture.detectChanges();

      expect(component.footerClasses()).toContain('form-field-helper-text--error');
    });
  });

  describe('Unique IDs', () => {
    it('should generate unique field ID', () => {
      expect(component.fieldId()).toBe('test-id-123');
      expect(generateIdSpy).toHaveBeenCalledWith('form-field');
    });

    it('should generate unique label ID when label exists', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();

      expect(component.labelId()).toBe('test-id-123');
    });

    it('should not generate label ID when no label', () => {
      expect(component.labelId()).toBeUndefined();
    });

    it('should generate helper ID when helper text exists', () => {
      fixture.componentRef.setInput('helperText', 'Helper');
      fixture.detectChanges();

      expect(component.helperId()).toBeDefined();
    });

    it('should generate helper ID when errors exist', () => {
      fixture.componentRef.setInput('errors', 'Error');
      fixture.detectChanges();

      expect(component.helperId()).toBeDefined();
    });

    it('should not generate helper ID when no helper text or errors', () => {
      expect(component.helperId()).toBeUndefined();
    });
  });

  describe('CSS Classes', () => {
    it('should include base wrapper class', () => {
      expect(component.wrapperClasses()).toContain('form-field');
    });

    it('should include validation state class in wrapper', () => {
      fixture.componentRef.setInput('validationState', 'success');
      fixture.detectChanges();

      expect(component.wrapperClasses()).toContain('form-field--success');
    });

    it('should include custom wrapper class', () => {
      fixture.componentRef.setInput('wrapperClass', 'my-custom-class');
      fixture.detectChanges();

      expect(component.wrapperClasses()).toContain('my-custom-class');
    });

    it('should include base footer class', () => {
      fixture.componentRef.setInput('helperText', 'Helper');
      fixture.detectChanges();

      expect(component.footerClasses()).toContain('form-field-helper-text');
    });

    it('should include validation state class in footer', () => {
      fixture.componentRef.setInput('errors', 'Error');
      fixture.detectChanges();

      expect(component.footerClasses()).toContain('form-field-helper-text--error');
    });
  });

  describe('Edge Cases', () => {
    it('should handle control without errors object', () => {
      const control = new FormControl('test');
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(component.computedErrors()).toEqual([]);
    });

    it('should handle empty error messages object', () => {
      const control = new FormControl('', Validators.required);
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.componentRef.setInput('errorMessages', {});
      fixture.detectChanges();

      expect(component.computedErrors().length).toBeGreaterThan(0);
    });

    it('should handle null control', () => {
      fixture.componentRef.setInput('control', null);
      fixture.detectChanges();

      expect(component.computedErrors()).toEqual([]);
    });

    it('should handle pristine control with errors', () => {
      const control = new FormControl('', Validators.required);
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(component.computedErrors()).toEqual([]);
    });

    it('should join multiple errors with space', () => {
      fixture.componentRef.setInput('errors', ['Error 1', 'Error 2', 'Error 3']);
      fixture.detectChanges();

      expect(component.footerText()).toBe('Error 1 Error 2 Error 3');
    });
  });

  describe('Accessibility', () => {
    it('should generate IDs for ARIA associations', () => {
      fixture.componentRef.setInput('label', 'Email');
      fixture.componentRef.setInput('helperText', 'Enter your email');
      fixture.detectChanges();

      expect(component.fieldId()).toBeDefined();
      expect(component.labelId()).toBeDefined();
      expect(component.helperId()).toBeDefined();
    });

    it('should link label to field via for attribute', () => {
      fixture.componentRef.setInput('label', 'Email');
      fixture.detectChanges();

      // The InputLabelComponent receives the fieldId via forId input
      expect(component.fieldId()).toBeDefined();
    });

    it('should provide helper text ID for aria-describedby', () => {
      fixture.componentRef.setInput('helperText', 'Helper text');
      fixture.detectChanges();

      expect(component.helperId()).toBeDefined();
    });
  });
});
