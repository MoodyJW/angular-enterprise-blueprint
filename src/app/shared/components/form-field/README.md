# Form Field Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Reusable form field wrapper component that provides consistent label and error display for any form control.

## Features

- ✅ **Automatic Error Detection**: Extracts errors from Angular FormControl
- ✅ **Manual Error Support**: Can display custom error messages
- ✅ **Validation States**: Auto-detects or manual override (default, success, warning, error)
- ✅ **Helper Text**: Shows instructions or validation messages
- ✅ **Content Projection**: Works with any form control
- ✅ **Touch State Handling**: Shows errors only after touched (configurable)
- ✅ **Custom Error Messages**: Map validation errors to user-friendly text
- ✅ **Accessible**: WCAG 2.1 AAA compliant with proper ARIA attributes
- ✅ **Signal-based**: Modern Angular signals API

## Usage

### Basic Examples

```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@shared/components';

@Component({
  selector: 'eb-example',
  imports: [FormFieldComponent, ReactiveFormsModule],
  template: `
    <!-- With Angular FormControl -->
    <eb-form-field label="Email" [required]="true" [control]="emailControl">
      <input type="email" [formControl]="emailControl" class="form-input" />
    </eb-form-field>

    <!-- With helper text -->
    <eb-form-field
      label="Password"
      helperText="Must be at least 8 characters"
      [required]="true"
      [control]="passwordControl"
    >
      <input type="password" [formControl]="passwordControl" class="form-input" />
    </eb-form-field>

    <!-- With manual errors -->
    <eb-form-field label="Username" [errors]="usernameErrors()" validationState="error">
      <input type="text" class="form-input" />
    </eb-form-field>

    <!-- Without FormControl (manual mode) -->
    <eb-form-field label="Bio" helperText="Tell us about yourself">
      <textarea rows="4" class="form-input"></textarea>
    </eb-form-field>
  `,
})
export class ExampleComponent {
  emailControl = new FormControl('', [Validators.required, Validators.email]);

  passwordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  usernameErrors = signal<string[]>(['Username is already taken']);
}
```

### With Custom Error Messages

```typescript
@Component({
  template: `
    <eb-form-field label="Age" [control]="ageControl" [errorMessages]="ageErrorMessages">
      <input type="number" [formControl]="ageControl" class="form-input" />
    </eb-form-field>
  `,
})
export class CustomErrorsExample {
  ageControl = new FormControl('', [Validators.required, Validators.min(18), Validators.max(100)]);

  ageErrorMessages = {
    required: 'Age is required',
    min: 'You must be at least 18 years old',
    max: 'Age must be less than 100',
  };
}
```

### Show Errors Immediately

```typescript
@Component({
  template: `
    <!-- Show errors without waiting for touch -->
    <eb-form-field label="Required Field" [control]="requiredControl" [showErrorsOnTouched]="false">
      <input [formControl]="requiredControl" class="form-input" />
    </eb-form-field>
  `,
})
export class ImmediateErrorsExample {
  requiredControl = new FormControl('', Validators.required);
}
```

### With Reactive Forms

```typescript
@Component({
  template: `
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
      <eb-form-field
        label="First Name"
        [required]="true"
        [control]="profileForm.controls.firstName"
      >
        <input formControlName="firstName" class="form-input" />
      </eb-form-field>

      <eb-form-field label="Last Name" [required]="true" [control]="profileForm.controls.lastName">
        <input formControlName="lastName" class="form-input" />
      </eb-form-field>

      <eb-form-field
        label="Email"
        [required]="true"
        [control]="profileForm.controls.email"
        [errorMessages]="emailErrors"
      >
        <input type="email" formControlName="email" class="form-input" />
      </eb-form-field>

      <button type="submit">Submit</button>
    </form>
  `,
})
export class ReactiveFormExample {
  profileForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  emailErrors = {
    required: 'Email is required',
    email: 'Please enter a valid email address',
  };

  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
    }
  }
}
```

### Manual Validation State

```typescript
@Component({
  template: `
    <eb-form-field label="API Key" validationState="success" helperText="API key is valid">
      <input value="sk_test_..." readonly class="form-input" />
    </eb-form-field>

    <eb-form-field label="Connection" validationState="warning" helperText="Connection is slow">
      <input value="Connected" readonly class="form-input" />
    </eb-form-field>
  `,
})
export class ManualStateExample {}
```

## Component API

### Inputs

| Input                 | Type                                                     | Default | Description                                  |
| --------------------- | -------------------------------------------------------- | ------- | -------------------------------------------- |
| `label`               | `string`                                                 | `''`    | Label text displayed above the field         |
| `required`            | `boolean`                                                | `false` | Whether the field is required                |
| `helperText`          | `string`                                                 | `''`    | Helper text shown when no errors             |
| `errors`              | `string \| string[] \| null`                             | `null`  | Manual error messages to display             |
| `control`             | `AbstractControl \| null`                                | `null`  | Angular FormControl for auto error detection |
| `validationState`     | `'default' \| 'success' \| 'warning' \| 'error' \| null` | `null`  | Manual validation state override             |
| `showErrorsOnTouched` | `boolean`                                                | `true`  | Show errors only after field is touched      |
| `errorMessages`       | `Record<string, string>`                                 | `{}`    | Custom error messages for validation errors  |
| `wrapperClass`        | `string`                                                 | `''`    | Additional CSS classes for wrapper           |

### Content Projection

The component uses default content projection. Place your form control inside:

```html
<eb-form-field label="Field Label">
  <!-- Your input, select, textarea, etc. -->
  <input type="text" />
</eb-form-field>
```

## Error Message Customization

### Default Error Messages

The component provides default messages for common validators:

- `required`: "This field is required"
- `email`: "Please enter a valid email address"
- `min`: "Value must be at least {min}"
- `max`: "Value must be at most {max}"
- `minlength`: "Must be at least {requiredLength} characters"
- `maxlength`: "Must be at most {requiredLength} characters"
- `pattern`: "Invalid format"

### Custom Messages

Override defaults using the `errorMessages` input:

```typescript
errorMessages = {
  required: 'Please fill out this field',
  minlength: 'Password must be at least {requiredLength} characters long',
  pattern: 'Username can only contain letters and numbers',
};
```

### Message Placeholders

Error messages support placeholders from validator metadata:

```typescript
// Validator provides { requiredLength: 8, actualLength: 5 }
errorMessages = {
  minlength: 'Must be at least {requiredLength} characters (you entered {actualLength})',
};
```

## Validation State Logic

The component automatically determines validation state:

1. **Manual override**: If `validationState` is provided, use it
2. **Error state**: If `errors` array has items, state is `'error'`
3. **FormControl state**:
   - If control is valid and touched/dirty: `'success'`
   - If control is invalid and touched: `'error'`
4. **Default**: `'default'` state

## Accessibility

### Automatic ARIA Attributes

The form-field wrapper component handles all ARIA relationships automatically:

- Generates unique IDs for label and helper text
- Associates label with form control via `for` attribute
- Associates helper/error text via `aria-describedby`
- Sets `aria-invalid` when showing errors

**Important:** When using form-field, the wrapped input/select/textarea components do NOT need `ariaLabel` since the form-field's `label` prop provides the accessible name through proper HTML label association. The wrapper manages all accessibility attributes.

### Required Indicator

When `required` is true, a visual indicator is shown (typically "\*").

## Styling

The component reuses existing form styling components:

- `InputLabelComponent`: For consistent label rendering
- `InputFooterComponent`: For helper text and error display

```scss
.form-field {
  margin-bottom: var(--space-3);

  &--error {
    // Error state styling
  }

  &--success {
    // Success state styling
  }

  &--warning {
    // Warning state styling
  }
}
```

## Testing

Run tests:

```bash
npm test -- form-field.component
```

## Architecture

```
form-field/
├── form-field.component.ts
├── form-field.component.html
├── form-field.component.scss
├── form-field.component.spec.ts
├── form-field.component.stories.ts
├── index.ts
└── README.md
```

## Dependencies

- `@angular/common`: CommonModule
- `@angular/forms`: AbstractControl types
- `@angular/core`: Core functionality
- `input-label`: Shared label component
- `input-footer`: Shared footer component
- `unique-id.service`: ID generation service

## Use Cases

### Wrapping Custom Components

```html
<eb-form-field label="Date" [control]="dateControl">
  <eb-date-picker [formControl]="dateControl" />
</eb-form-field>
```

### Integration with Design System

```html
<eb-form-field label="Status" [control]="statusControl">
  <eb-select [formControl]="statusControl" [options]="statuses" />
</eb-form-field>
```

### File Upload

```html
<eb-form-field label="Profile Photo" [control]="photoControl" helperText="Max size: 5MB">
  <eb-file-upload [formControl]="photoControl" />
</eb-form-field>
```

## Best Practices

1. **Use with FormControl**: Leverage automatic error detection
2. **Custom messages**: Provide user-friendly error text
3. **Helper text**: Guide users with instructions
4. **Touch state**: Use `showErrorsOnTouched` for better UX
5. **Consistent styling**: Apply consistent CSS classes to projected controls

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Part of the MoodyJW Portfolio project.
