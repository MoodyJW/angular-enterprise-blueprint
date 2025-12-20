# Validation Utilities

> **Last Updated**: December 6, 2025
> **Status**: Production Ready
> **Test Coverage**: 68 passing tests, >95% coverage

Comprehensive validation utilities for common data types with both standalone functions and Angular reactive form validators. Pure TypeScript implementation with zero external dependencies.

## Features

- ✅ **Standalone Validators**: Use anywhere in your code
- ✅ **Angular Validators**: Seamless integration with reactive forms
- ✅ **Email Validation**: RFC-compliant with customizable options
- ✅ **URL Validation**: Protocol, TLD, query string, fragment support
- ✅ **Phone Validation**: International formats with country-specific rules
- ✅ **Credit Card**: Luhn algorithm validation
- ✅ **Password Strength**: Configurable requirements (length, uppercase, digits, etc.)
- ✅ **Postal Codes**: Multi-country support (US, UK, CA, DE, FR, JP, AU)
- ✅ **IP Addresses**: IPv4 and IPv6 validation
- ✅ **Hex Colors**: Full and shorthand formats
- ✅ **JSON Validation**: Parse-safe JSON checking
- ✅ **Number Ranges**: Min, max, and range validators
- ✅ **Match Validator**: Password confirmation and field matching
- ✅ **Zero Dependencies**: Pure TypeScript implementation
- ✅ **Type-safe**: Full TypeScript type safety with interfaces

## Quick Start

### Import

```typescript
import {
  isValidEmail,
  isValidUrl,
  emailValidator,
  passwordStrengthValidator,
} from '@shared/utilities/validation/validation.utils';
```

### Standalone Validation

```typescript
// Use in any TypeScript code
if (isValidEmail('user@example.com')) {
  // Valid email
}

if (isValidUrl('https://example.com')) {
  // Valid URL
}
```

### Angular Reactive Forms

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  emailValidator,
  passwordStrengthValidator,
} from '@shared/utilities/validation/validation.utils';

@Component({
  selector: 'eb-signup',
  template: `...`,
})
export class SignupComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, emailValidator()]],
    password: ['', [Validators.required, passwordStrengthValidator()]],
  });
}
```

## Usage

### Email Validation

```typescript
// Standalone
isValidEmail('user@example.com'); // true
isValidEmail('user+tag@example.com'); // true
isValidEmail('invalid@'); // false

// Custom options
isValidEmail('user@localhost', { requireTld: false }); // true
isValidEmail('user+tag@example.com', { allowPlus: false }); // false

// Angular validator
const form = this.fb.group({
  email: ['', [emailValidator({ requireTld: true })]],
});
```

### URL Validation

```typescript
// Standalone
isValidUrl('https://example.com'); // true
isValidUrl('http://localhost:3000'); // true
isValidUrl('example.com'); // false (requires protocol)

// Custom options
isValidUrl('example.com', { requireProtocol: false }); // true
isValidUrl('ftp://example.com', { protocols: ['ftp'] }); // true
isValidUrl('https://example.com?q=1', { allowQueryString: false }); // false

// Angular validator
const form = this.fb.group({
  website: ['', [urlValidator({ protocols: ['http', 'https'] })]],
});
```

### Phone Validation

```typescript
// Standalone
isValidPhone('(555) 123-4567'); // true
isValidPhone('555-123-4567'); // true
isValidPhone('+1-555-123-4567'); // true

// US-specific
isValidPhone('5551234567', { country: 'US' }); // true

// With extension
isValidPhone('5551234567x123', { allowExtensions: true }); // true

// Angular validator
const form = this.fb.group({
  phone: ['', [phoneValidator({ country: 'US' })]],
});
```

### Password Strength

```typescript
// Standalone
validatePasswordStrength('MyP@ss123');
// Returns: { isValid: true, unmetRequirements: [] }

validatePasswordStrength('weak');
// Returns: {
//   isValid: false,
//   unmetRequirements: ['minLength', 'uppercase', 'digit', 'specialChar']
// }

// Custom requirements
validatePasswordStrength('Password123', {
  minLength: 12,
  requireSpecialChar: false,
});

// Angular validator
const form = this.fb.group({
  password: [
    '',
    [
      passwordStrengthValidator({
        minLength: 10,
        requireUppercase: true,
        requireLowercase: true,
        requireDigit: true,
        requireSpecialChar: true,
      }),
    ],
  ],
});
```

### Credit Card Validation

```typescript
// Standalone (uses Luhn algorithm)
isValidCreditCard('4532015112830366'); // true (Visa test number)
isValidCreditCard('4532 0151 1283 0366'); // true (with spaces)
isValidCreditCard('1234567890123456'); // false

// Angular validator
const form = this.fb.group({
  cardNumber: ['', [creditCardValidator()]],
});
```

### Postal Code Validation

```typescript
// Standalone
isValidPostalCode('12345', 'US'); // true
isValidPostalCode('12345-6789', 'US'); // true
isValidPostalCode('SW1A 1AA', 'UK'); // true
isValidPostalCode('K1A 0B1', 'CA'); // true

// Supported countries: US, UK, CA, DE, FR, JP, AU

// Angular validator
const form = this.fb.group({
  zipCode: ['', [postalCodeValidator('US')]],
  postcode: ['', [postalCodeValidator('UK')]],
});
```

### IP Address Validation

```typescript
// Standalone
isValidIpAddress('192.168.1.1'); // true
isValidIpAddress('8.8.8.8'); // true
isValidIpAddress('2001:0db8:85a3::8a2e:0370:7334'); // true (IPv6)

// Specific version
isValidIpAddress('192.168.1.1', 4); // true
isValidIpAddress('192.168.1.1', 6); // false
isValidIpAddress('2001:db8::1', 6); // true
```

### Hex Color Validation

```typescript
// Standalone
isValidHexColor('#FF5733'); // true
isValidHexColor('#F57'); // true (shorthand)
isValidHexColor('FF5733'); // false (missing #)

// Angular validator
const form = this.fb.group({
  color: ['', [hexColorValidator()]],
});
```

### JSON Validation

```typescript
// Standalone
isValidJson('{"name":"John"}'); // true
isValidJson('{}'); // true
isValidJson('[1,2,3]'); // true
isValidJson('{invalid}'); // false
```

### Number Range Validators

```typescript
// Angular validators
const form = this.fb.group({
  age: ['', [minValue(18), maxValue(120)]],
  score: ['', [rangeValidator(0, 100)]],
});

// Standalone usage
const ageControl = new FormControl(25);
const validator = minValue(18);
validator(ageControl); // null (valid)

const scoreControl = new FormControl(150);
const rangeVal = rangeValidator(0, 100);
rangeVal(scoreControl); // { range: { min: 0, max: 100, actual: 150 } }
```

### Match Validator (Password Confirmation)

```typescript
// Angular validator
const form = this.fb.group({
  password: [''],
  confirmPassword: ['', [matchValidator('password')]],
});

// The confirmPassword field will be invalid if it doesn't match password
```

## API Reference

### Standalone Validation Functions

#### `isValidEmail(email: string, options?: EmailValidationOptions): boolean`

Validate email address.

**Options**:

```typescript
interface EmailValidationOptions {
  allowPlus?: boolean; // Default: true
  allowIpDomain?: boolean; // Default: false
  requireTld?: boolean; // Default: true
}
```

---

#### `isValidUrl(url: string, options?: UrlValidationOptions): boolean`

Validate URL.

**Options**:

```typescript
interface UrlValidationOptions {
  protocols?: string[]; // Default: ['http', 'https']
  requireProtocol?: boolean; // Default: true
  requireTld?: boolean; // Default: true
  allowQueryString?: boolean; // Default: true
  allowFragments?: boolean; // Default: true
}
```

---

#### `isValidPhone(phone: string, options?: PhoneValidationOptions): boolean`

Validate phone number.

**Options**:

```typescript
interface PhoneValidationOptions {
  country?: string; // e.g., 'US', 'UK', 'CA'
  allowExtensions?: boolean; // Default: true
}
```

---

#### `isValidCreditCard(cardNumber: string): boolean`

Validate credit card number using Luhn algorithm.

---

#### `validatePasswordStrength(password: string, options?: PasswordStrengthOptions): { isValid: boolean; unmetRequirements: string[] }`

Validate password strength.

**Options**:

```typescript
interface PasswordStrengthOptions {
  minLength?: number; // Default: 8
  requireUppercase?: boolean; // Default: true
  requireLowercase?: boolean; // Default: true
  requireDigit?: boolean; // Default: true
  requireSpecialChar?: boolean; // Default: true
}
```

---

#### `isValidPostalCode(postalCode: string, country?: string): boolean`

Validate postal code for supported countries.

**Supported Countries**: US, UK, CA, DE, FR, JP, AU

---

#### `isValidIpAddress(ip: string, version?: 4 | 6 | 'both'): boolean`

Validate IP address (IPv4 or IPv6).

---

#### `isValidHexColor(color: string): boolean`

Validate hex color code (e.g., #FF5733 or #F57).

---

#### `isValidJson(jsonString: string): boolean`

Validate JSON string.

### Angular Validators

All Angular validators return `ValidatorFn` compatible with reactive forms.

#### `emailValidator(options?: EmailValidationOptions): ValidatorFn`

Email validator for Angular forms.

**Error**: `{ email: { value: string } }`

---

#### `urlValidator(options?: UrlValidationOptions): ValidatorFn`

URL validator for Angular forms.

**Error**: `{ url: { value: string } }`

---

#### `phoneValidator(options?: PhoneValidationOptions): ValidatorFn`

Phone validator for Angular forms.

**Error**: `{ phone: { value: string } }`

---

#### `passwordStrengthValidator(options?: PasswordStrengthOptions): ValidatorFn`

Password strength validator for Angular forms.

**Error**: `{ passwordStrength: { unmetRequirements: string[] } }`

---

#### `matchValidator(matchTo: string): ValidatorFn`

Match validator for password confirmation.

**Error**: `{ match: { matchTo: string } }`

---

#### `creditCardValidator(): ValidatorFn`

Credit card validator for Angular forms.

**Error**: `{ creditCard: { value: string } }`

---

#### `postalCodeValidator(country?: string): ValidatorFn`

Postal code validator for Angular forms.

**Error**: `{ postalCode: { value: string, country: string } }`

---

#### `hexColorValidator(): ValidatorFn`

Hex color validator for Angular forms.

**Error**: `{ hexColor: { value: string } }`

---

#### `minValue(min: number): ValidatorFn`

Minimum value validator for numbers.

**Error**: `{ minValue: { min: number, actual: number } }`

---

#### `maxValue(max: number): ValidatorFn`

Maximum value validator for numbers.

**Error**: `{ maxValue: { max: number, actual: number } }`

---

#### `rangeValidator(min: number, max: number): ValidatorFn`

Range validator for numbers.

**Error**: `{ range: { min: number, max: number, actual: number } }`

## Common Patterns

### User Registration Form

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  emailValidator,
  passwordStrengthValidator,
  matchValidator,
  phoneValidator,
} from '@shared/utilities/validation/validation.utils';

@Component({
  selector: 'eb-register',
  template: `...`,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, emailValidator()]],
    phone: ['', [phoneValidator({ country: 'US' })]],
    password: ['', [Validators.required, passwordStrengthValidator({ minLength: 10 })]],
    confirmPassword: ['', [Validators.required, matchValidator('password')]],
  });

  onSubmit() {
    if (this.form.valid) {
      // Form is valid
    }
  }
}
```

### Payment Form

```typescript
const paymentForm = this.fb.group({
  cardNumber: ['', [Validators.required, creditCardValidator()]],
  zipCode: ['', [Validators.required, postalCodeValidator('US')]],
});
```

### Settings Form with URL

```typescript
const settingsForm = this.fb.group({
  website: [
    '',
    [
      urlValidator({
        protocols: ['http', 'https'],
        requireProtocol: true,
      }),
    ],
  ],
  email: ['', [emailValidator()]],
});
```

### Dynamic Validation

```typescript
// Change validation based on user selection
countryControl.valueChanges.subscribe((country) => {
  const postalCodeControl = this.form.get('postalCode');
  postalCodeControl?.setValidators([Validators.required, postalCodeValidator(country)]);
  postalCodeControl?.updateValueAndValidity();
});
```

### Custom Error Messages

```typescript
getErrorMessage(controlName: string): string {
  const control = this.form.get(controlName);

  if (control?.hasError('required')) {
    return 'This field is required';
  }

  if (control?.hasError('email')) {
    return 'Please enter a valid email address';
  }

  if (control?.hasError('passwordStrength')) {
    const unmet = control.getError('passwordStrength').unmetRequirements;
    return `Password must have: ${unmet.join(', ')}`;
  }

  if (control?.hasError('match')) {
    return 'Passwords do not match';
  }

  if (control?.hasError('minValue')) {
    const { min } = control.getError('minValue');
    return `Value must be at least ${min}`;
  }

  return '';
}
```

### Async Validation with API Check

```typescript
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';

function uniqueUsernameValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(300),
      switchMap((username) => userService.checkUsername(username)),
      map((isTaken) => (isTaken ? { usernameTaken: true } : null)),
      catchError(() => of(null)),
    );
  };
}

// Usage
const form = this.fb.group({
  username: ['', [Validators.required], [uniqueUsernameValidator(this.userService)]],
});
```

### Conditional Validation

```typescript
// Only validate phone if provided
const form = this.fb.group({
  phone: [
    '',
    [
      (control) => {
        if (!control.value) return null;
        return phoneValidator()(control);
      },
    ],
  ],
});
```

## Best Practices

### 1. Combine Validators Appropriately

```typescript
// Good - multiple validators
email: ['', [Validators.required, emailValidator()]];

// Good - optional but validated when present
website: ['', [urlValidator()]]; // No Validators.required
```

### 2. Use Specific Validators

```typescript
// Good - specific to use case
password: ['', [passwordStrengthValidator({ minLength: 12 })]];

// Less ideal - only checks length
password: ['', [Validators.minLength(12)]];
```

### 3. Provide Clear Error Messages

```typescript
// Good - user-friendly messages
if (control.hasError('passwordStrength')) {
  const unmet = control.getError('passwordStrength').unmetRequirements;
  return `Password must contain: ${this.formatRequirements(unmet)}`;
}

// Less ideal - generic message
if (control.hasError('passwordStrength')) {
  return 'Invalid password';
}
```

### 4. Validate on Both Client and Server

```typescript
// Client-side (user experience)
const form = this.fb.group({
  email: ['', [emailValidator()]],
});

// Server-side (security)
// Always validate on the server as well!
```

### 5. Handle Edge Cases

```typescript
// Good - handles empty values
const validator = (control) => {
  if (!control.value) return null; // Let Validators.required handle this
  return isValidEmail(control.value) ? null : { email: true };
};

// Bad - errors on empty values
const validator = (control) => {
  return isValidEmail(control.value) ? null : { email: true };
};
```

### 6. Use TypeScript for Type Safety

```typescript
// Good - type-safe
interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
}

form = this.fb.group<SignupForm>({
  email: ['', [emailValidator()]],
  password: ['', [passwordStrengthValidator()]],
  confirmPassword: ['', [matchValidator('password')]],
});
```

## Testing

Comprehensive unit tests with 68 test cases:

```bash
npm test src/app/shared/utilities/validation/validation.utils.spec.ts
```

### Test Coverage

- ✅ Email validation (5 tests)
- ✅ URL validation (6 tests)
- ✅ Phone validation (4 tests)
- ✅ Credit card validation (3 tests)
- ✅ Password strength (8 tests)
- ✅ Postal codes (4 tests)
- ✅ IP addresses (4 tests)
- ✅ Hex colors (2 tests)
- ✅ JSON validation (2 tests)
- ✅ Angular validators (14 tests)
- ✅ Number validators (8 tests)
- ✅ Match validator (2 tests)
- ✅ Edge cases (6 tests)

### Testing in Your Code

```typescript
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { emailValidator } from '@shared/utilities/validation/validation.utils';

describe('LoginComponent', () => {
  it('should validate email', () => {
    const control = new FormControl('user@example.com');
    const validator = emailValidator();
    expect(validator(control)).toBeNull();
  });

  it('should reject invalid email', () => {
    const control = new FormControl('invalid');
    const validator = emailValidator();
    expect(validator(control)).toEqual({ email: { value: 'invalid' } });
  });
});
```

## Architecture

```
utilities/
└── validation/
    ├── validation.utils.ts       # Main utility functions (700+ lines)
    ├── validation.utils.spec.ts  # Unit tests (68 tests, 500+ lines)
    └── README.md                 # This file
```

## Performance

- **Zero Dependencies**: Pure TypeScript, no external libraries
- **Efficient**: Native JavaScript methods and regex
- **Tree-shakeable**: Import only what you need
- **Type-safe**: Full TypeScript type checking
- **Form-optimized**: Validators designed for reactive forms

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

Uses standard JavaScript APIs (RegExp, URL constructor) which are widely supported.

## Security Considerations

1. **Always validate on the server**: Client-side validation is for UX only
2. **Don't trust user input**: These validators help but aren't foolproof
3. **Sanitize data**: Validation ≠ Sanitization (use appropriate tools for XSS prevention)
4. **Use HTTPS**: For sensitive data like passwords and credit cards
5. **PCI Compliance**: For credit cards, use a payment gateway (don't store card numbers)

## License

Part of the MoodyJW Portfolio project.
