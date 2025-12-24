# Input Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Accessible text input component with comprehensive validation states and features for building forms.

## Features

- ✅ **Three Variants**: Default, Filled, Outlined
- ✅ **Three Sizes**: Small (sm), Medium (md), Large (lg)
- ✅ **Seven Input Types**: Text, Email, Password, Tel, URL, Search, Number
- ✅ **Validation States**: Default, Success, Warning, Error
- ✅ **Helper Text**: Instructions and validation messages
- ✅ **Character Count**: Optional character counter with max length
- ✅ **Prefix/Suffix**: Text or icon slots before/after input
- ✅ **Full Validation**: Required, min/max length, pattern support
- ✅ **Two-way Binding**: Signal-based [(value)] binding
- ✅ **Accessible**: WCAG 2.1 AAA compliant with ARIA attributes
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Theme Integration**: Uses CSS variables for theming

## Usage

### Basic Examples

```typescript
import { Component, signal } from '@angular/core';
import { InputComponent } from '@shared/components';

@Component({
  selector: 'eb-example',
  imports: [InputComponent],
  template: `
    <!-- Basic input -->
    <eb-input
      label="Email address"
      type="email"
      [(value)]="email"
      ariaLabel="Enter your email address"
    />

    <!-- Input with validation -->
    <eb-input
      label="Username"
      [(value)]="username"
      validationState="error"
      helperText="Username is required"
      ariaLabel="Enter your username"
      [required]="true"
    />

    <!-- Input with character count -->
    <eb-input
      label="Bio"
      [(value)]="bio"
      [maxLength]="160"
      [showCharCount]="true"
      helperText="Tell us about yourself"
      ariaLabel="Enter your bio"
    />

    <!-- Input with prefix -->
    <eb-input
      label="Website"
      type="url"
      [(value)]="website"
      prefix="https://"
      ariaLabel="Enter your website URL"
    />

    <!-- Input with suffix -->
    <eb-input label="Domain" [(value)]="domain" suffix=".com" ariaLabel="Enter your domain name" />

    <!-- Password input -->
    <eb-input
      label="Password"
      type="password"
      [(value)]="password"
      [minLength]="8"
      [required]="true"
      helperText="Must be at least 8 characters"
      ariaLabel="Enter your password"
    />

    <!-- Disabled input -->
    <eb-input label="ID" [(value)]="userId" [disabled]="true" ariaLabel="User ID" />

    <!-- Read-only input -->
    <eb-input
      label="Created Date"
      [(value)]="createdDate"
      [readonly]="true"
      ariaLabel="Created date"
    />
  `,
})
export class ExampleComponent {
  email = signal('');
  username = signal('');
  bio = signal('');
  website = signal('');
  domain = signal('');
  password = signal('');
  userId = signal('12345');
  createdDate = signal('2024-01-01');
}
```

### With Validation States

```typescript
@Component({
  template: `
    <!-- Success state -->
    <eb-input
      label="Email"
      [(value)]="email"
      validationState="success"
      helperText="Email is available"
      ariaLabel="Enter email"
    />

    <!-- Warning state -->
    <eb-input
      label="Username"
      [(value)]="username"
      validationState="warning"
      helperText="Username is already taken but can be used"
      ariaLabel="Enter username"
    />

    <!-- Error state -->
    <eb-input
      label="Password"
      type="password"
      [(value)]="password"
      validationState="error"
      helperText="Password must be at least 8 characters"
      [ariaInvalid]="true"
      ariaLabel="Enter password"
    />
  `,
})
export class ValidationExample {
  email = signal('user@example.com');
  username = signal('john');
  password = signal('123');
}
```

### With Event Handling

```typescript
@Component({
  template: `
    <eb-input
      label="Search"
      type="search"
      [(value)]="searchQuery"
      ariaLabel="Search"
      (valueChange)="handleSearch($event)"
      (enterPressed)="performSearch()"
      (focused)="handleFocus($event)"
      (blurred)="handleBlur($event)"
    />
  `,
})
export class EventExample {
  searchQuery = signal('');

  handleSearch(value: string) {
    console.log('Search value:', value);
  }

  performSearch() {
    console.log('Perform search for:', this.searchQuery());
  }

  handleFocus(event: FocusEvent) {
    console.log('Input focused');
  }

  handleBlur(event: FocusEvent) {
    console.log('Input blurred');
  }
}
```

### Programmatic Control

```typescript
@Component({
  template: `
    <eb-input #emailInput label="Email" [(value)]="email" ariaLabel="Enter email" />

    <eb-button ariaLabel="Focus input" (clicked)="focusInput()"> Focus Input </eb-button>
    <eb-button ariaLabel="Select text" (clicked)="selectText()"> Select Text </eb-button>
  `,
})
export class ProgrammaticExample {
  @ViewChild('emailInput') emailInput!: InputComponent;
  email = signal('test@example.com');

  focusInput() {
    this.emailInput.focus();
  }

  selectText() {
    this.emailInput.select();
  }
}
```

## Component API

### Inputs

| Input             | Type                                                                        | Default                               | Description                                                                                                             |
| ----------------- | --------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `variant`         | `'default' \| 'filled' \| 'outlined'`                                       | `'default'`                           | Visual variant of the input                                                                                             |
| `size`            | `'sm' \| 'md' \| 'lg'`                                                      | `'md'`                                | Size of the input                                                                                                       |
| `type`            | `'text' \| 'email' \| 'password' \| 'tel' \| 'url' \| 'search' \| 'number'` | `'text'`                              | HTML input type attribute                                                                                               |
| `value`           | `string`                                                                    | `''`                                  | Current value (two-way bindable with [(value)])                                                                         |
| `label`           | `string`                                                                    | `''`                                  | Label text displayed above the input                                                                                    |
| `placeholder`     | `string`                                                                    | `''`                                  | Placeholder text shown when empty                                                                                       |
| `helperText`      | `string`                                                                    | `''`                                  | Helper text displayed below the input                                                                                   |
| `validationState` | `'default' \| 'success' \| 'warning' \| 'error'`                            | `'default'`                           | Validation state                                                                                                        |
| `disabled`        | `boolean`                                                                   | `false`                               | Whether the input is disabled                                                                                           |
| `readonly`        | `boolean`                                                                   | `false`                               | Whether the input is readonly                                                                                           |
| `required`        | `boolean`                                                                   | `false`                               | Whether the input is required                                                                                           |
| `maxLength`       | `number \| undefined`                                                       | `undefined`                           | Maximum length of input value                                                                                           |
| `minLength`       | `number \| undefined`                                                       | `undefined`                           | Minimum length of input value                                                                                           |
| `pattern`         | `string \| undefined`                                                       | `undefined`                           | Pattern for input validation (regex)                                                                                    |
| `autocomplete`    | `string \| undefined`                                                       | `undefined`                           | Autocomplete attribute value                                                                                            |
| `prefix`          | `string \| undefined`                                                       | `undefined`                           | Text or icon displayed before the input                                                                                 |
| `suffix`          | `string \| undefined`                                                       | `undefined`                           | Text or icon displayed after the input                                                                                  |
| `showCharCount`   | `boolean`                                                                   | `false`                               | Whether to show character count                                                                                         |
| `fullWidth`       | `boolean`                                                                   | `false`                               | Whether input should take full width                                                                                    |
| `ariaLabel`       | `string`                                                                    | **OPTIONAL when `label` is provided** | ARIA label for the input. Optional when a visible `label` is present, as the label element provides the accessible name |
| `ariaDescribedBy` | `string \| undefined`                                                       | `undefined`                           | ID of element that describes the input                                                                                  |
| `ariaInvalid`     | `boolean`                                                                   | `false`                               | Whether the input value is invalid                                                                                      |

### Outputs

| Output         | Type                          | Description                           |
| -------------- | ----------------------------- | ------------------------------------- |
| `valueChange`  | `EventEmitter<string>`        | Emitted when the input value changes  |
| `focused`      | `EventEmitter<FocusEvent>`    | Emitted when the input receives focus |
| `blurred`      | `EventEmitter<FocusEvent>`    | Emitted when the input loses focus    |
| `enterPressed` | `EventEmitter<KeyboardEvent>` | Emitted when Enter key is pressed     |

### Methods

| Method     | Return Type | Description                      |
| ---------- | ----------- | -------------------------------- |
| `focus()`  | `void`      | Focus the input programmatically |
| `blur()`   | `void`      | Blur the input programmatically  |
| `select()` | `void`      | Select all text in the input     |

### Size Specifications

| Size | Height | Font Size | Padding   |
| ---- | ------ | --------- | --------- |
| `sm` | 32px   | 14px      | 8px 12px  |
| `md` | 40px   | 16px      | 10px 14px |
| `lg` | 48px   | 18px      | 12px 16px |

## Accessibility

### ARIA Labels

The `ariaLabel` input is **optional when a visible `label` is provided**, since the `<label>` element is properly associated with the input and provides the accessible name.

You may optionally provide `ariaLabel` to:

- Override the visible label text for screen readers
- Provide additional context not visible in the label

```html
<!-- Good: Label provides accessible name -->
<eb-input label="Email address" [(value)]="email" />

<!-- Good: ariaLabel provides additional context -->
<eb-input label="Email" [(value)]="email" ariaLabel="Your work email address" />

<!-- Required: No visible label, ariaLabel needed -->
<eb-input placeholder="Search..." [(value)]="search" ariaLabel="Search users" />
```

### Validation States

When showing error states:

- Set `validationState="error"`
- Set `ariaInvalid="true"`
- Provide descriptive `helperText`

```html
<eb-input
  validationState="error"
  [ariaInvalid]="true"
  helperText="Please enter a valid email address"
  ariaLabel="Email address"
/>
```

### Helper Text Association

Helper text is automatically associated with the input via `aria-describedby`.

### Keyboard Support

- **Tab**: Move focus to/from input
- **Escape**: Clear input (for search type)
- **Enter**: Triggers `enterPressed` event

## Styling

The component uses BEM methodology and integrates with the theme system:

```scss
.input {
  width: 100%;
  font-family: var(--font-family-sans);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-on-surface);
  transition: all var(--transition-fast);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }

  &--error {
    border-color: var(--color-error);
    &:focus {
      box-shadow: 0 0 0 3px var(--color-error-light);
    }
  }

  &--success {
    border-color: var(--color-success);
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

## Testing

Comprehensive unit tests are provided in `input.component.spec.ts`.

Run tests:

```bash
npm test -- input.component
```

## Storybook

View the component in Storybook:

```bash
npm run storybook
```

Navigate to `Shared/Input` to see all variants and examples.

## Architecture

```
input/
├── input.component.ts              # Main input component
├── input.component.html            # Template
├── input.component.scss            # Styles
├── input.component.spec.ts         # Unit tests
├── input.component.stories.ts      # Storybook stories
├── index.ts                        # Barrel export
└── README.md                       # This file

input-footer/                       # Shared footer component
├── input-footer.component.ts
└── ...
```

## Dependencies

- `@angular/common`: CommonModule
- `@angular/forms`: FormsModule for [(ngModel)]
- `@angular/core`: Core Angular functionality
- `input-footer`: Shared component for helper text and character count

## Best Practices

1. **Use appropriate types**: Email for emails, tel for phones, etc.
2. **Provide clear labels**: Use descriptive label and ariaLabel
3. **Show validation states**: Provide feedback on user input
4. **Helper text**: Guide users with instructions and requirements
5. **Character limits**: Show character count for fields with limits
6. **Autocomplete**: Use appropriate autocomplete values for better UX

## Common Use Cases

### Email Input

```html
<eb-input
  label="Email"
  type="email"
  [(value)]="email"
  [required]="true"
  autocomplete="email"
  ariaLabel="Enter your email address"
/>
```

### Phone Number

```html
<eb-input
  label="Phone"
  type="tel"
  [(value)]="phone"
  pattern="[0-9]{10}"
  autocomplete="tel"
  ariaLabel="Enter your phone number"
/>
```

### Search Bar

```html
<eb-input
  type="search"
  placeholder="Search..."
  [(value)]="query"
  (enterPressed)="search()"
  ariaLabel="Search"
/>
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

Part of the MoodyJW Portfolio project.
