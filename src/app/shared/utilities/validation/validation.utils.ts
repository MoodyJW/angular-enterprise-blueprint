/**
 * Validation utility functions and Angular validators
 *
 * @module ValidationUtils
 */

import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Helper type guards for validators
export function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function toStringIfStringOrNumber(value: unknown): string | null {
  if (isString(value)) return value;
  if (isNumber(value)) return String(value);
  return null;
}

/**
 * Email validation options
 */
export interface EmailValidationOptions {
  /** Allow plus sign in local part (default: true) */
  allowPlus?: boolean;
  /** Allow IP addresses in domain (default: false) */
  allowIpDomain?: boolean;
  /** Require TLD (top-level domain) (default: true) */
  requireTld?: boolean;
}

/**
 * URL validation options
 */
export interface UrlValidationOptions {
  /** Allowed protocols (default: ['http', 'https']) */
  protocols?: string[];
  /** Require protocol (default: true) */
  requireProtocol?: boolean;
  /** Require TLD (default: true) */
  requireTld?: boolean;
  /** Allow query string (default: true) */
  allowQueryString?: boolean;
  /** Allow fragments (default: true) */
  allowFragments?: boolean;
}

/**
 * Phone validation options
 */
export interface PhoneValidationOptions {
  /** Country code (e.g., 'US', 'UK', 'CA') */
  country?: string;
  /** Allow extensions (default: true) */
  allowExtensions?: boolean;
}

/**
 * Password strength options
 */
export interface PasswordStrengthOptions {
  /** Minimum length (default: 8) */
  minLength?: number;
  /** Require uppercase letter (default: true) */
  requireUppercase?: boolean;
  /** Require lowercase letter (default: true) */
  requireLowercase?: boolean;
  /** Require digit (default: true) */
  requireDigit?: boolean;
  /** Require special character (default: true) */
  requireSpecialChar?: boolean;
}

/**
 * Validate email address
 *
 * @param email - Email address to validate
 * @param options - Validation options
 * @returns True if email is valid
 *
 * @example
 * ```typescript
 * isValidEmail('user@example.com'); // true
 * isValidEmail('invalid@'); // false
 * isValidEmail('user+tag@example.com'); // true
 * ```
 */
export function isValidEmail(email: string, options: EmailValidationOptions = {}): boolean {
  if (email === '' || typeof email !== 'string') {
    return false;
  }

  const { allowPlus = true, allowIpDomain = false, requireTld = true } = options;

  // Basic email regex pattern
  const localPart = allowPlus
    ? "[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+"
    : "[a-zA-Z0-9.!#$%&'*\\/=?^_`{|}~-]+";
  const domain = requireTld
    ? '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\\.[a-zA-Z]{2,}'
    : '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*';

  let pattern: RegExp;

  if (allowIpDomain) {
    const ipPattern =
      '\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\]';
    pattern = new RegExp(`^${localPart}@(?:${domain}|${ipPattern})$`);
  } else {
    pattern = new RegExp(`^${localPart}@${domain}$`);
  }

  return pattern.test(email);
}

/**
 * Validate URL
 *
 * @param url - URL to validate
 * @param options - Validation options
 * @returns True if URL is valid
 *
 * @example
 * ```typescript
 * isValidUrl('https://example.com'); // true
 * isValidUrl('http://localhost:3000'); // true
 * isValidUrl('example.com'); // false (requires protocol)
 * ```
 */
export function isValidUrl(url: string, options: UrlValidationOptions = {}): boolean {
  if (url === '' || typeof url !== 'string') {
    return false;
  }

  const {
    protocols = ['http', 'https'],
    requireProtocol = true,
    requireTld = true,
    allowQueryString = true,
    allowFragments = true,
  } = options;

  try {
    const urlObj = new URL(url);

    // Check protocol
    if (requireProtocol && urlObj.protocol === '') {
      return false;
    }

    if (protocols.length > 0) {
      const protocol = urlObj.protocol.replace(':', '');
      if (!protocols.includes(protocol)) {
        return false;
      }
    }

    // Check TLD
    if (requireTld && urlObj.hostname !== '') {
      const parts = urlObj.hostname.split('.');
      if (parts.length < 2 || parts[parts.length - 1].length < 2) {
        return false;
      }
    }

    // Check query string
    if (!allowQueryString && urlObj.search !== '') {
      return false;
    }

    // Check fragments
    if (!allowFragments && urlObj.hash !== '') {
      return false;
    }

    return true;
  } catch {
    // If URL constructor throws, try without protocol if allowed
    if (!requireProtocol) {
      try {
        new URL(`http://${url}`);
        return isValidUrl(`http://${url}`, { ...options, requireProtocol: true });
      } catch {
        return false;
      }
    }
    return false;
  }
}

/**
 * Validate phone number
 *
 * @param phone - Phone number to validate
 * @param options - Validation options
 * @returns True if phone number is valid
 *
 * @example
 * ```typescript
 * isValidPhone('(555) 123-4567'); // true
 * isValidPhone('555-123-4567'); // true
 * isValidPhone('+1-555-123-4567'); // true
 * ```
 */
export function isValidPhone(phone: string, options: PhoneValidationOptions = {}): boolean {
  if (phone === '' || typeof phone !== 'string') {
    return false;
  }

  const { allowExtensions = true } = options;

  // Remove common formatting characters
  const cleaned = phone.replace(/[\s(). -]/g, '');

  // Basic pattern: optional +, 10-15 digits, optional extension
  const basePattern = allowExtensions ? /^\+?[1-9]\d{9,14}(?:x\d+)?$/ : /^\+?[1-9]\d{9,14}$/;

  if (!basePattern.test(cleaned)) {
    return false;
  }

  // US-specific validation
  if (options.country === 'US') {
    // US format: optional +1, then 10 digits
    const usPattern = /^\+?1?\d{10}$/;
    return usPattern.test(cleaned);
  }

  return true;
}

/**
 * Validate credit card number using Luhn algorithm
 *
 * @param cardNumber - Credit card number to validate
 * @returns True if card number is valid
 *
 * @example
 * ```typescript
 * isValidCreditCard('4532015112830366'); // true (Visa)
 * isValidCreditCard('1234567890123456'); // false (invalid)
 * ```
 */
export function isValidCreditCard(cardNumber: string): boolean {
  if (cardNumber === '' || typeof cardNumber !== 'string') {
    return false;
  }

  // Remove spaces and hyphens
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // Must be 13-19 digits
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validate password strength
 *
 * @param password - Password to validate
 * @param options - Strength requirements
 * @returns Object with validity and unmet requirements
 *
 * @example
 * ```typescript
 * validatePasswordStrength('MyP@ss123');
 * // Returns: { isValid: true, unmetRequirements: [] }
 *
 * validatePasswordStrength('weak');
 * // Returns: { isValid: false, unmetRequirements: ['minLength', 'uppercase', ...] }
 * ```
 */
export function validatePasswordStrength(
  password: string,
  options: PasswordStrengthOptions = {},
): { isValid: boolean; unmetRequirements: string[] } {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireDigit = true,
    requireSpecialChar = true,
  } = options;

  const unmetRequirements: string[] = [];

  if (password === '' || typeof password !== 'string') {
    return {
      isValid: false,
      unmetRequirements: ['password is required'],
    };
  }

  if (password.length < minLength) {
    unmetRequirements.push('minLength');
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    unmetRequirements.push('uppercase');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    unmetRequirements.push('lowercase');
  }

  if (requireDigit && !/\d/.test(password)) {
    unmetRequirements.push('digit');
  }

  if (requireSpecialChar && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    unmetRequirements.push('specialChar');
  }

  return {
    isValid: unmetRequirements.length === 0,
    unmetRequirements,
  };
}

/**
 * Validate postal code
 *
 * @param postalCode - Postal code to validate
 * @param country - Country code (default: 'US')
 * @returns True if postal code is valid
 *
 * @example
 * ```typescript
 * isValidPostalCode('12345', 'US'); // true
 * isValidPostalCode('12345-6789', 'US'); // true
 * isValidPostalCode('SW1A 1AA', 'UK'); // true
 * ```
 */
export function isValidPostalCode(postalCode: string, country = 'US'): boolean {
  if (postalCode === '' || typeof postalCode !== 'string') {
    return false;
  }

  const patterns: Record<string, RegExp | undefined> = {
    US: /^\d{5}(?:-\d{4})?$/, // 12345 or 12345-6789
    UK: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i, // SW1A 1AA
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i, // K1A 0B1
    DE: /^\d{5}$/, // 12345
    FR: /^\d{5}$/, // 75001
    JP: /^\d{3}-?\d{4}$/, // 123-4567
    AU: /^\d{4}$/, // 1234
  };

  const key = country.toUpperCase();
  const pattern = patterns[key];
  if (pattern === undefined) {
    return false;
  }

  return pattern.test(postalCode.trim());
}

/**
 * Validate IP address (IPv4 or IPv6)
 *
 * @param ip - IP address to validate
 * @param version - IP version (4 or 6, or 'both')
 * @returns True if IP address is valid
 *
 * @example
 * ```typescript
 * isValidIpAddress('192.168.1.1'); // true
 * isValidIpAddress('2001:0db8:85a3::8a2e:0370:7334'); // true
 * ```
 */
export function isValidIpAddress(ip: string, version: 4 | 6 | 'both' = 'both'): boolean {
  if (ip === '' || typeof ip !== 'string') {
    return false;
  }

  const ipv4Pattern =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Pattern =
    /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}$|^(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}$|^(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}$|^:(?::[0-9a-fA-F]{1,4}){1,7}$|^::$/;

  if (version === 4) {
    return ipv4Pattern.test(ip);
  }

  if (version === 6) {
    return ipv6Pattern.test(ip);
  }

  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}

/**
 * Validate hex color code
 *
 * @param color - Hex color code to validate
 * @returns True if hex color is valid
 *
 * @example
 * ```typescript
 * isValidHexColor('#FF5733'); // true
 * isValidHexColor('#F57'); // true
 * isValidHexColor('FF5733'); // false (missing #)
 * ```
 */
export function isValidHexColor(color: string): boolean {
  if (color === '' || typeof color !== 'string') {
    return false;
  }

  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Validate JSON string
 *
 * @param jsonString - JSON string to validate
 * @returns True if JSON is valid
 *
 * @example
 * ```typescript
 * isValidJson('{"name":"John"}'); // true
 * isValidJson('{invalid}'); // false
 * ```
 */
export function isValidJson(jsonString: string): boolean {
  if (jsonString === '' || typeof jsonString !== 'string') {
    return false;
  }

  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// Angular Validators
// ============================================================================

/**
 * Angular email validator
 *
 * @param options - Email validation options
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const form = this.fb.group({
 *   email: ['', [emailValidator()]],
 * });
 * ```
 */
export function emailValidator(options?: EmailValidationOptions): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as unknown;

    if (isEmptyValue(value) || !isString(value)) {
      return null;
    }

    const email = value;
    const isValid = isValidEmail(email, options);

    return isValid ? null : { email: { value: email } };
  };
}

/**
 * Angular URL validator
 *
 * @param options - URL validation options
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const form = this.fb.group({
 *   website: ['', [urlValidator()]],
 * });
 * ```
 */
export function urlValidator(options?: UrlValidationOptions): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as unknown;

    if (isEmptyValue(value) || !isString(value)) {
      return null;
    }

    const url = value;
    const isValid = isValidUrl(url, options);

    return isValid ? null : { url: { value: url } };
  };
}

/**
 * Angular phone validator
 *
 * @param options - Phone validation options
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const form = this.fb.group({
 *   phone: ['', [phoneValidator({ country: 'US' })]],
 * });
 * ```
 */
export function phoneValidator(options?: PhoneValidationOptions): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as unknown;
    if (isEmptyValue(value) || !isString(value)) {
      return null;
    }

    const isValid = isValidPhone(value, options);

    return isValid ? null : { phone: { value } };
  };
}

/**
 * Angular password strength validator
 *
 * @param options - Password strength options
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const form = this.fb.group({
 *   password: ['', [passwordStrengthValidator({ minLength: 10 })]],
 * });
 * ```
 */
export function passwordStrengthValidator(options?: PasswordStrengthOptions): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as unknown;

    if (isEmptyValue(value) || !isString(value)) {
      return null;
    }

    const result = validatePasswordStrength(value, options);

    return result.isValid
      ? null
      : { passwordStrength: { unmetRequirements: result.unmetRequirements } };
  };
}

/**
 * Angular match validator (for password confirmation)
 *
 * @param matchTo - Name of control to match against
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const form = this.fb.group({
 *   password: [''],
 *   confirmPassword: ['', [matchValidator('password')]],
 * });
 * ```
 */
export function matchValidator(matchTo: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isEmptyValue(control.value) || !control.parent) {
      return null;
    }

    const matchControl = control.parent.get(matchTo);
    if (!matchControl) {
      return null;
    }

    const isMatch = control.value === matchControl.value;

    return isMatch ? null : { match: { matchTo } };
  };
}

/**
 * Angular credit card validator
 *
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const form = this.fb.group({
 *   cardNumber: ['', [creditCardValidator()]],
 * });
 * ```
 */
export function creditCardValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as unknown;

    if (isEmptyValue(value)) {
      return null;
    }

    const str = toStringIfStringOrNumber(value);
    if (str === null) {
      return null;
    }

    const isValid = isValidCreditCard(str);

    return isValid ? null : { creditCard: { value: str } };
  };
}

/**
 * Angular postal code validator
 *
 * @param country - Country code
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const form = this.fb.group({
 *   zipCode: ['', [postalCodeValidator('US')]],
 * });
 * ```
 */
export function postalCodeValidator(country = 'US'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isEmptyValue(control.value) || !isString(control.value)) {
      return null;
    }

    const value = control.value;
    const isValid = isValidPostalCode(value, country);

    return isValid ? null : { postalCode: { value, country } };
  };
}

/**
 * Angular hex color validator
 *
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const form = this.fb.group({
 *   color: ['', [hexColorValidator()]],
 * });
 * ```
 */
export function hexColorValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as unknown;

    if (isEmptyValue(value) || !isString(value)) {
      return null;
    }

    const isValid = isValidHexColor(value);

    return isValid ? null : { hexColor: { value } };
  };
}

/**
 * Angular min value validator (for numbers)
 *
 * @param min - Minimum value
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const form = this.fb.group({
 *   age: ['', [minValue(18)]],
 * });
 * ```
 */
export function minValue(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isEmptyValue(control.value)) {
      return null;
    }

    const value = Number(control.value);

    if (isNaN(value)) {
      return { minValue: { min, actual: value } };
    }

    return value >= min ? null : { minValue: { min, actual: value } };
  };
}

/**
 * Angular max value validator (for numbers)
 *
 * @param max - Maximum value
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const form = this.fb.group({
 *   age: ['', [maxValue(120)]],
 * });
 * ```
 */
export function maxValue(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isEmptyValue(control.value)) {
      return null;
    }

    const value = Number(control.value);

    if (isNaN(value)) {
      return { maxValue: { max, actual: value } };
    }

    return value <= max ? null : { maxValue: { max, actual: value } };
  };
}

/**
 * Angular range validator (for numbers)
 *
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const form = this.fb.group({
 *   age: ['', [rangeValidator(18, 120)]],
 * });
 * ```
 */
export function rangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isEmptyValue(control.value)) {
      return null;
    }

    const value = Number(control.value);

    if (isNaN(value)) {
      return { range: { min, max, actual: value } };
    }

    if (value < min || value > max) {
      return { range: { min, max, actual: value } };
    }

    return null;
  };
}
