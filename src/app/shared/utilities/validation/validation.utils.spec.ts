import { FormControl } from '@angular/forms';

import { describe, expect, it } from 'vitest';

import * as ValidationUtils from './validation.utils';

describe('Validation Utils', () => {
  describe('helper type guards', () => {
    it('isEmptyValue should detect null/undefined/empty', () => {
      expect(ValidationUtils.isEmptyValue(null)).toBe(true);
      expect(ValidationUtils.isEmptyValue(undefined)).toBe(true);
      expect(ValidationUtils.isEmptyValue('')).toBe(true);
      expect(ValidationUtils.isEmptyValue(0)).toBe(false);
      expect(ValidationUtils.isEmptyValue(false)).toBe(false);
    });

    it('isString should narrow strings', () => {
      expect(ValidationUtils.isString('hello')).toBe(true);
      expect(ValidationUtils.isString(123)).toBe(false);
      expect(ValidationUtils.isString(null)).toBe(false);
    });

    it('isNumber should detect numbers (not NaN)', () => {
      expect(ValidationUtils.isNumber(0)).toBe(true);
      expect(ValidationUtils.isNumber(3.14)).toBe(true);
      expect(ValidationUtils.isNumber(NaN)).toBe(false);
      expect(ValidationUtils.isNumber('123' as unknown as number)).toBe(false);
    });

    it('toStringIfStringOrNumber should convert values', () => {
      expect(ValidationUtils.toStringIfStringOrNumber('abc')).toBe('abc');
      expect(ValidationUtils.toStringIfStringOrNumber(123)).toBe('123');
      expect(ValidationUtils.toStringIfStringOrNumber(null)).toBeNull();
      expect(ValidationUtils.toStringIfStringOrNumber(undefined)).toBeNull();
    });
  });
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(ValidationUtils.isValidEmail('user@example.com')).toBe(true);
      expect(ValidationUtils.isValidEmail('user.name@example.com')).toBe(true);
      expect(ValidationUtils.isValidEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(ValidationUtils.isValidEmail('invalid')).toBe(false);
      expect(ValidationUtils.isValidEmail('invalid@')).toBe(false);
      expect(ValidationUtils.isValidEmail('@example.com')).toBe(false);
      expect(ValidationUtils.isValidEmail('user @example.com')).toBe(false);
    });

    it('should handle plus signs based on option', () => {
      expect(ValidationUtils.isValidEmail('user+tag@example.com', { allowPlus: true })).toBe(true);
      expect(ValidationUtils.isValidEmail('user+tag@example.com', { allowPlus: false })).toBe(
        false,
      );
    });

    it('should handle TLD requirement', () => {
      expect(ValidationUtils.isValidEmail('user@localhost', { requireTld: false })).toBe(true);
      expect(ValidationUtils.isValidEmail('user@localhost', { requireTld: true })).toBe(false);
    });

    it('should handle empty or invalid input', () => {
      expect(ValidationUtils.isValidEmail('')).toBe(false);
      expect(ValidationUtils.isValidEmail(null as unknown as string)).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(ValidationUtils.isValidUrl('https://example.com')).toBe(true);
      expect(ValidationUtils.isValidUrl('http://example.com')).toBe(true);
      expect(ValidationUtils.isValidUrl('https://sub.example.com')).toBe(true);
      expect(ValidationUtils.isValidUrl('https://example.com/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(ValidationUtils.isValidUrl('not a url')).toBe(false);
      expect(ValidationUtils.isValidUrl('htp://example.com')).toBe(false);
    });

    it('should handle protocol requirement', () => {
      expect(ValidationUtils.isValidUrl('example.com', { requireProtocol: false })).toBe(true);
      expect(ValidationUtils.isValidUrl('example.com', { requireProtocol: true })).toBe(false);
    });

    it('should validate allowed protocols', () => {
      expect(ValidationUtils.isValidUrl('ftp://example.com', { protocols: ['ftp'] })).toBe(true);
      expect(
        ValidationUtils.isValidUrl('ftp://example.com', { protocols: ['http', 'https'] }),
      ).toBe(false);
    });

    it('should handle query strings', () => {
      expect(
        ValidationUtils.isValidUrl('https://example.com?query=1', { allowQueryString: true }),
      ).toBe(true);
      expect(
        ValidationUtils.isValidUrl('https://example.com?query=1', { allowQueryString: false }),
      ).toBe(false);
    });

    it('should handle fragments', () => {
      expect(
        ValidationUtils.isValidUrl('https://example.com#section', { allowFragments: true }),
      ).toBe(true);
      expect(
        ValidationUtils.isValidUrl('https://example.com#section', { allowFragments: false }),
      ).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate correct phone numbers', () => {
      expect(ValidationUtils.isValidPhone('(555) 123-4567')).toBe(true);
      expect(ValidationUtils.isValidPhone('555-123-4567')).toBe(true);
      expect(ValidationUtils.isValidPhone('+1-555-123-4567')).toBe(true);
      expect(ValidationUtils.isValidPhone('5551234567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(ValidationUtils.isValidPhone('123')).toBe(false);
      expect(ValidationUtils.isValidPhone('abc-def-ghij')).toBe(false);
    });

    it('should validate US phone numbers', () => {
      expect(ValidationUtils.isValidPhone('5551234567', { country: 'US' })).toBe(true);
      expect(ValidationUtils.isValidPhone('+15551234567', { country: 'US' })).toBe(true);
      expect(ValidationUtils.isValidPhone('123', { country: 'US' })).toBe(false);
    });

    it('should handle extensions', () => {
      expect(ValidationUtils.isValidPhone('5551234567x123', { allowExtensions: true })).toBe(true);
      expect(ValidationUtils.isValidPhone('5551234567x123', { allowExtensions: false })).toBe(
        false,
      );
    });
  });

  describe('isValidCreditCard', () => {
    it('should validate correct card numbers', () => {
      // Valid Visa test number
      expect(ValidationUtils.isValidCreditCard('4532015112830366')).toBe(true);
      // Valid with spaces
      expect(ValidationUtils.isValidCreditCard('4532 0151 1283 0366')).toBe(true);
    });

    it('should reject invalid card numbers', () => {
      expect(ValidationUtils.isValidCreditCard('1234567890123456')).toBe(false);
      expect(ValidationUtils.isValidCreditCard('123')).toBe(false);
    });

    it('should handle empty input', () => {
      expect(ValidationUtils.isValidCreditCard('')).toBe(false);
      expect(ValidationUtils.isValidCreditCard(null as unknown as string)).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should validate strong passwords', () => {
      const result = ValidationUtils.validatePasswordStrength('MyP@ss123');
      expect(result.isValid).toBe(true);
      expect(result.unmetRequirements).toEqual([]);
    });

    it('should reject weak passwords', () => {
      const result = ValidationUtils.validatePasswordStrength('weak');
      expect(result.isValid).toBe(false);
      expect(result.unmetRequirements).toContain('uppercase');
      expect(result.unmetRequirements).toContain('digit');
      expect(result.unmetRequirements).toContain('specialChar');
    });

    it('should check minimum length', () => {
      const result = ValidationUtils.validatePasswordStrength('P@ss1', { minLength: 8 });
      expect(result.isValid).toBe(false);
      expect(result.unmetRequirements).toContain('minLength');
    });

    it('should check for uppercase', () => {
      const result = ValidationUtils.validatePasswordStrength('p@ssword123');
      expect(result.isValid).toBe(false);
      expect(result.unmetRequirements).toContain('uppercase');
    });

    it('should check for lowercase', () => {
      const result = ValidationUtils.validatePasswordStrength('P@SSWORD123');
      expect(result.isValid).toBe(false);
      expect(result.unmetRequirements).toContain('lowercase');
    });

    it('should check for digit', () => {
      const result = ValidationUtils.validatePasswordStrength('P@ssword');
      expect(result.isValid).toBe(false);
      expect(result.unmetRequirements).toContain('digit');
    });

    it('should check for special character', () => {
      const result = ValidationUtils.validatePasswordStrength('Password123');
      expect(result.isValid).toBe(false);
      expect(result.unmetRequirements).toContain('specialChar');
    });

    it('should handle custom requirements', () => {
      const result = ValidationUtils.validatePasswordStrength('password', {
        requireUppercase: false,
        requireDigit: false,
        requireSpecialChar: false,
      });
      expect(result.isValid).toBe(true);
    });
  });

  describe('isValidPostalCode', () => {
    it('should validate US zip codes', () => {
      expect(ValidationUtils.isValidPostalCode('12345', 'US')).toBe(true);
      expect(ValidationUtils.isValidPostalCode('12345-6789', 'US')).toBe(true);
    });

    it('should validate UK postal codes', () => {
      expect(ValidationUtils.isValidPostalCode('SW1A 1AA', 'UK')).toBe(true);
      expect(ValidationUtils.isValidPostalCode('SW1A1AA', 'UK')).toBe(true);
    });

    it('should validate Canadian postal codes', () => {
      expect(ValidationUtils.isValidPostalCode('K1A 0B1', 'CA')).toBe(true);
      expect(ValidationUtils.isValidPostalCode('K1A0B1', 'CA')).toBe(true);
    });

    it('should reject invalid postal codes', () => {
      expect(ValidationUtils.isValidPostalCode('123', 'US')).toBe(false);
      expect(ValidationUtils.isValidPostalCode('ABCDE', 'US')).toBe(false);
    });
  });

  describe('isValidIpAddress', () => {
    it('should validate IPv4 addresses', () => {
      expect(ValidationUtils.isValidIpAddress('192.168.1.1')).toBe(true);
      expect(ValidationUtils.isValidIpAddress('8.8.8.8')).toBe(true);
      expect(ValidationUtils.isValidIpAddress('255.255.255.255')).toBe(true);
    });

    it('should validate IPv6 addresses', () => {
      expect(ValidationUtils.isValidIpAddress('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(
        true,
      );
      expect(ValidationUtils.isValidIpAddress('2001:db8:85a3::8a2e:370:7334')).toBe(true);
      expect(ValidationUtils.isValidIpAddress('::')).toBe(true);
    });

    it('should reject invalid IP addresses', () => {
      expect(ValidationUtils.isValidIpAddress('256.1.1.1')).toBe(false);
      expect(ValidationUtils.isValidIpAddress('192.168.1')).toBe(false);
      expect(ValidationUtils.isValidIpAddress('not an ip')).toBe(false);
    });

    it('should validate by version', () => {
      expect(ValidationUtils.isValidIpAddress('192.168.1.1', 4)).toBe(true);
      expect(ValidationUtils.isValidIpAddress('192.168.1.1', 6)).toBe(false);
      expect(ValidationUtils.isValidIpAddress('2001:db8::1', 6)).toBe(true);
      expect(ValidationUtils.isValidIpAddress('2001:db8::1', 4)).toBe(false);
    });
  });

  describe('isValidHexColor', () => {
    it('should validate hex colors', () => {
      expect(ValidationUtils.isValidHexColor('#FF5733')).toBe(true);
      expect(ValidationUtils.isValidHexColor('#F57')).toBe(true);
      expect(ValidationUtils.isValidHexColor('#000')).toBe(true);
      expect(ValidationUtils.isValidHexColor('#FFFFFF')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(ValidationUtils.isValidHexColor('FF5733')).toBe(false);
      expect(ValidationUtils.isValidHexColor('#GG5733')).toBe(false);
      expect(ValidationUtils.isValidHexColor('#FF57')).toBe(false);
    });
  });

  describe('isValidJson', () => {
    it('should validate JSON strings', () => {
      expect(ValidationUtils.isValidJson('{}')).toBe(true);
      expect(ValidationUtils.isValidJson('{"name":"John"}')).toBe(true);
      expect(ValidationUtils.isValidJson('[]')).toBe(true);
      expect(ValidationUtils.isValidJson('[1,2,3]')).toBe(true);
    });

    it('should reject invalid JSON', () => {
      expect(ValidationUtils.isValidJson('{invalid}')).toBe(false);
      expect(ValidationUtils.isValidJson('{"name":}')).toBe(false);
      expect(ValidationUtils.isValidJson('not json')).toBe(false);
    });
  });

  // Angular Validators
  describe('emailValidator', () => {
    it('should return null for valid email', () => {
      const control = new FormControl('user@example.com');
      const validator = ValidationUtils.emailValidator();
      expect(validator(control)).toBeNull();
    });

    it('should return error for invalid email', () => {
      const control = new FormControl('invalid');
      const validator = ValidationUtils.emailValidator();
      expect(validator(control)).toEqual({ email: { value: 'invalid' } });
    });

    it('should return null for empty value', () => {
      const control = new FormControl('');
      const validator = ValidationUtils.emailValidator();
      expect(validator(control)).toBeNull();
    });
  });

  describe('urlValidator', () => {
    it('should return null for valid URL', () => {
      const control = new FormControl('https://example.com');
      const validator = ValidationUtils.urlValidator();
      expect(validator(control)).toBeNull();
    });

    it('should return error for invalid URL', () => {
      const control = new FormControl('not a url');
      const validator = ValidationUtils.urlValidator();
      expect(validator(control)).toEqual({ url: { value: 'not a url' } });
    });

    it('should return null for empty value', () => {
      const control = new FormControl('');
      const validator = ValidationUtils.urlValidator();
      expect(validator(control)).toBeNull();
    });
  });

  describe('phoneValidator', () => {
    it('should return null for valid phone', () => {
      const control = new FormControl('555-123-4567');
      const validator = ValidationUtils.phoneValidator();
      expect(validator(control)).toBeNull();
    });

    it('should return error for invalid phone', () => {
      const control = new FormControl('123');
      const validator = ValidationUtils.phoneValidator();
      expect(validator(control)).toEqual({ phone: { value: '123' } });
    });
  });

  describe('passwordStrengthValidator', () => {
    it('should return null for strong password', () => {
      const control = new FormControl('MyP@ss123');
      const validator = ValidationUtils.passwordStrengthValidator();
      expect(validator(control)).toBeNull();
    });

    it('should return error for weak password', () => {
      const control = new FormControl('weak');
      const validator = ValidationUtils.passwordStrengthValidator();
      const result = validator(control);
      expect(result).toBeTruthy();
      expect(result?.['passwordStrength']).toBeTruthy();
    });

    it('should return null for empty value', () => {
      const control = new FormControl('');
      const validator = ValidationUtils.passwordStrengthValidator();
      expect(validator(control)).toBeNull();
    });
  });

  describe('matchValidator', () => {
    it('should return null for matching values', () => {
      const password = new FormControl('password');
      const confirm = new FormControl('password');

      // Mock parent
      Object.defineProperty(confirm, 'parent', {
        get: () => ({
          get: (name: string) => (name === 'password' ? password : null),
        }),
      });

      const validator = ValidationUtils.matchValidator('password');
      expect(validator(confirm)).toBeNull();
    });

    it('should return error for non-matching values', () => {
      const password = new FormControl('password');
      const confirm = new FormControl('different');

      // Mock parent
      Object.defineProperty(confirm, 'parent', {
        get: () => ({
          get: (name: string) => (name === 'password' ? password : null),
        }),
      });

      const validator = ValidationUtils.matchValidator('password');
      expect(validator(confirm)).toEqual({ match: { matchTo: 'password' } });
    });
  });

  describe('creditCardValidator', () => {
    it('should return null for valid card', () => {
      const control = new FormControl('4532015112830366');
      const validator = ValidationUtils.creditCardValidator();
      expect(validator(control)).toBeNull();
    });

    it('should return error for invalid card', () => {
      const control = new FormControl('1234567890123456');
      const validator = ValidationUtils.creditCardValidator();
      expect(validator(control)).toEqual({ creditCard: { value: '1234567890123456' } });
    });
  });

  describe('postalCodeValidator', () => {
    it('should return null for valid postal code', () => {
      const control = new FormControl('12345');
      const validator = ValidationUtils.postalCodeValidator('US');
      expect(validator(control)).toBeNull();
    });

    it('should return error for invalid postal code', () => {
      const control = new FormControl('123');
      const validator = ValidationUtils.postalCodeValidator('US');
      expect(validator(control)).toEqual({ postalCode: { value: '123', country: 'US' } });
    });
  });

  describe('hexColorValidator', () => {
    it('should return null for valid hex color', () => {
      const control = new FormControl('#FF5733');
      const validator = ValidationUtils.hexColorValidator();
      expect(validator(control)).toBeNull();
    });

    it('should return error for invalid hex color', () => {
      const control = new FormControl('FF5733');
      const validator = ValidationUtils.hexColorValidator();
      expect(validator(control)).toEqual({ hexColor: { value: 'FF5733' } });
    });
  });

  describe('minValue', () => {
    it('should return null for value >= min', () => {
      const control = new FormControl(20);
      const validator = ValidationUtils.minValue(18);
      expect(validator(control)).toBeNull();
    });

    it('should return error for value < min', () => {
      const control = new FormControl(15);
      const validator = ValidationUtils.minValue(18);
      expect(validator(control)).toEqual({ minValue: { min: 18, actual: 15 } });
    });

    it('should return null for empty value', () => {
      const control = new FormControl('');
      const validator = ValidationUtils.minValue(18);
      expect(validator(control)).toBeNull();
    });

    it('should handle string numbers', () => {
      const control = new FormControl('20');
      const validator = ValidationUtils.minValue(18);
      expect(validator(control)).toBeNull();
    });
  });

  describe('maxValue', () => {
    it('should return null for value <= max', () => {
      const control = new FormControl(100);
      const validator = ValidationUtils.maxValue(120);
      expect(validator(control)).toBeNull();
    });

    it('should return error for value > max', () => {
      const control = new FormControl(150);
      const validator = ValidationUtils.maxValue(120);
      expect(validator(control)).toEqual({ maxValue: { max: 120, actual: 150 } });
    });

    it('should return null for empty value', () => {
      const control = new FormControl('');
      const validator = ValidationUtils.maxValue(120);
      expect(validator(control)).toBeNull();
    });
  });

  describe('rangeValidator', () => {
    it('should return null for value within range', () => {
      const control = new FormControl(50);
      const validator = ValidationUtils.rangeValidator(18, 120);
      expect(validator(control)).toBeNull();
    });

    it('should return error for value below range', () => {
      const control = new FormControl(10);
      const validator = ValidationUtils.rangeValidator(18, 120);
      expect(validator(control)).toEqual({ range: { min: 18, max: 120, actual: 10 } });
    });

    it('should return error for value above range', () => {
      const control = new FormControl(150);
      const validator = ValidationUtils.rangeValidator(18, 120);
      expect(validator(control)).toEqual({ range: { min: 18, max: 120, actual: 150 } });
    });

    it('should allow values at boundaries', () => {
      const control1 = new FormControl(18);
      const control2 = new FormControl(120);
      const validator = ValidationUtils.rangeValidator(18, 120);
      expect(validator(control1)).toBeNull();
      expect(validator(control2)).toBeNull();
    });
  });
});
