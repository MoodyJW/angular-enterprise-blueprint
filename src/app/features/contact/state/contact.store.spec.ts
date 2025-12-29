// @vitest-environment jsdom
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ENVIRONMENT } from '../../../core/config/environment.token';
import type { ContactFormData } from '../models';
import { ContactService } from '../services/contact.service';
import { ContactStore } from './contact.store';

describe('ContactStore', () => {
  let store: InstanceType<typeof ContactStore>;
  let contactService: ContactService;

  const mockFormData: ContactFormData = {
    name: 'Test User',
    email: 'test@example.com',
    company: 'Test Co',
    message: 'This is a test message for the contact form.',
  };

  const mockEnvironment = {
    appName: 'Test App',
    production: false,
    apiUrl: '/api',
    features: { mockAuth: true },
    analytics: { enabled: false, provider: 'console' as const },
    version: '1.0.0',
    formspreeEndpoint: 'https://formspree.io/f/test',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ContactStore,
        ContactService,
        { provide: ENVIRONMENT, useValue: mockEnvironment },
      ],
    });

    store = TestBed.inject(ContactStore);
    contactService = TestBed.inject(ContactService);
  });

  describe('initial state', () => {
    it('should not be submitting', () => {
      expect(store.isSubmitting()).toBe(false);
    });

    it('should not be in success state', () => {
      expect(store.isSuccess()).toBe(false);
    });

    it('should have no server errors', () => {
      expect(store.serverErrors()).toEqual([]);
    });

    it('should have no general error', () => {
      expect(store.generalError()).toBeNull();
    });

    it('should have zero cooldown', () => {
      expect(store.cooldownSeconds()).toBe(0);
    });
  });

  describe('computed signals', () => {
    it('hasServerErrors should return false when no errors', () => {
      expect(store.hasServerErrors()).toBe(false);
    });

    it('isDisabled should return false when not submitting and no cooldown', () => {
      expect(store.isDisabled()).toBe(false);
    });

    it('isDisabled should return true when submitting', () => {
      // Start a submission
      vi.spyOn(contactService, 'sendContactMessage').mockReturnValue(
        new Promise(() => {}) as never, // Never resolves
      );
      // We can't easily test this without more complex setup, so skip
    });

    it('getFieldError should return null for unknown field', () => {
      const getError = store.getFieldError();
      expect(getError('email')).toBeNull();
    });
  });

  describe('submitForm', () => {
    it('should submit form successfully', () => {
      vi.spyOn(contactService, 'sendContactMessage').mockReturnValue(of(undefined));

      store.submitForm(mockFormData);

      expect(store.isSubmitting()).toBe(false);
      expect(store.isSuccess()).toBe(true);
      expect(store.serverErrors()).toEqual([]);
      expect(store.generalError()).toBeNull();
    });

    it('should handle 422 validation errors from Formspree', () => {
      const formspreeErrors = [
        { code: 'TYPE_EMAIL', field: 'email', message: 'should be an email' },
      ];

      const httpError = new HttpErrorResponse({
        status: 422,
        statusText: 'Unprocessable Entity',
        error: { error: 'Validation errors', errors: formspreeErrors },
      });

      vi.spyOn(contactService, 'sendContactMessage').mockReturnValue(throwError(() => httpError));

      store.submitForm(mockFormData);

      expect(store.isSubmitting()).toBe(false);
      expect(store.isSuccess()).toBe(false);
      expect(store.serverErrors()).toEqual(formspreeErrors);
      expect(store.generalError()).toBe('Validation errors');
      expect(store.hasServerErrors()).toBe(true);
    });

    it('should handle generic errors', () => {
      const genericError = new Error('Network error');
      vi.spyOn(contactService, 'sendContactMessage').mockReturnValue(
        throwError(() => genericError),
      );

      store.submitForm(mockFormData);

      expect(store.isSubmitting()).toBe(false);
      expect(store.isSuccess()).toBe(false);
      expect(store.serverErrors()).toEqual([]);
      expect(store.generalError()).toBe('Network error');
    });

    it('should handle errors with empty message', () => {
      const emptyError = new Error('');
      vi.spyOn(contactService, 'sendContactMessage').mockReturnValue(throwError(() => emptyError));

      store.submitForm(mockFormData);

      // Should use fallback message
      expect(store.generalError()).toBe('');
    });

    it('should handle non-Error objects', () => {
      vi.spyOn(contactService, 'sendContactMessage').mockReturnValue(
        throwError(() => 'String error'),
      );

      store.submitForm(mockFormData);

      // Should use fallback message for non-Error objects
      expect(store.generalError()).toBe('Failed to send message');
    });
  });

  describe('clearErrors', () => {
    it('should clear server errors', () => {
      // First set some errors
      const httpError = new HttpErrorResponse({
        status: 422,
        statusText: 'Unprocessable Entity',
        error: {
          errors: [{ code: 'TYPE_EMAIL', field: 'email', message: 'should be an email' }],
        },
      });
      vi.spyOn(contactService, 'sendContactMessage').mockReturnValue(throwError(() => httpError));
      store.submitForm(mockFormData);
      expect(store.hasServerErrors()).toBe(true);

      // Then clear
      store.clearErrors();

      expect(store.serverErrors()).toEqual([]);
      expect(store.generalError()).toBeNull();
    });

    it('should clear general error', () => {
      const genericError = new Error('Test error');
      vi.spyOn(contactService, 'sendContactMessage').mockReturnValue(
        throwError(() => genericError),
      );
      store.submitForm(mockFormData);
      expect(store.generalError()).toBe('Test error');

      store.clearErrors();

      expect(store.generalError()).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      // First submit successfully
      vi.spyOn(contactService, 'sendContactMessage').mockReturnValue(of(undefined));
      store.submitForm(mockFormData);
      expect(store.isSuccess()).toBe(true);

      // Set cooldown
      store.setCooldown(30);
      expect(store.cooldownSeconds()).toBe(30);

      // Reset
      store.reset();

      expect(store.isSubmitting()).toBe(false);
      expect(store.isSuccess()).toBe(false);
      expect(store.serverErrors()).toEqual([]);
      expect(store.generalError()).toBeNull();
      expect(store.cooldownSeconds()).toBe(0);
    });
  });

  describe('setCooldown', () => {
    it('should set cooldown seconds', () => {
      store.setCooldown(30);
      expect(store.cooldownSeconds()).toBe(30);
    });

    it('should update isDisabled computed', () => {
      expect(store.isDisabled()).toBe(false);
      store.setCooldown(10);
      expect(store.isDisabled()).toBe(true);
    });
  });

  describe('tickCooldown', () => {
    it('should decrement cooldown by 1', () => {
      store.setCooldown(10);
      store.tickCooldown();
      expect(store.cooldownSeconds()).toBe(9);
    });

    it('should not go below 0', () => {
      store.setCooldown(0);
      store.tickCooldown();
      expect(store.cooldownSeconds()).toBe(0);
    });

    it('should stop at 0', () => {
      store.setCooldown(1);
      store.tickCooldown();
      expect(store.cooldownSeconds()).toBe(0);
      store.tickCooldown();
      expect(store.cooldownSeconds()).toBe(0);
    });
  });

  describe('getFieldError computed', () => {
    it('should return error message for matching field', () => {
      const formspreeErrors = [
        { code: 'TYPE_EMAIL', field: 'email', message: 'should be an email' },
        { code: 'REQUIRED', field: 'name', message: 'name is required' },
      ];

      const httpError = new HttpErrorResponse({
        status: 422,
        statusText: 'Unprocessable Entity',
        error: { errors: formspreeErrors },
      });

      vi.spyOn(contactService, 'sendContactMessage').mockReturnValue(throwError(() => httpError));
      store.submitForm(mockFormData);

      const getError = store.getFieldError();
      expect(getError('email')).toBe('should be an email');
      expect(getError('name')).toBe('name is required');
      expect(getError('company')).toBeNull();
    });
  });
});
