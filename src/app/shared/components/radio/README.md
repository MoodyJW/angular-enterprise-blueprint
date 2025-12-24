# Radio Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

An accessible radio button component following WCAG 2.1 AAA guidelines with full theme integration.

## Features

- ✅ **3 Size Variants**: Small (16px), Medium (20px), Large (24px)
- ✅ **4 Validation States**: Default, Success, Warning, Error
- ✅ **Accessibility**: Full WCAG 2.1 AAA compliance
- ✅ **Keyboard Navigation**: Arrow keys to navigate, Space to select
- ✅ **Theme Integration**: Adapts to light and dark themes
- ✅ **Mobile Friendly**: Proper touch target sizes (minimum 44px)
- ✅ **Radio Groups**: Support for mutually exclusive selections

## Basic Usage

```typescript
import { RadioComponent } from '@shared/components/radio';

@Component({
  selector: 'eb-example',
  imports: [RadioComponent],
  template: `
    <div role="radiogroup" aria-label="Payment method">
      <eb-radio
        label="Credit Card"
        name="payment"
        value="credit"
        [(checked)]="paymentMethod"
        ariaLabel="Credit Card"
      />
      <eb-radio
        label="PayPal"
        name="payment"
        value="paypal"
        [(checked)]="paymentMethod"
        ariaLabel="PayPal"
      />
    </div>
  `,
})
export class ExampleComponent {
  paymentMethod = false;
}
```

## Examples

### Basic Radio Button

```html
<eb-radio label="Option A" name="choice" value="a" ariaLabel="Option A" />
```

### Required Radio Button

```html
<eb-radio
  label="I agree to the terms"
  name="agreement"
  value="agree"
  [required]="true"
  helperText="You must accept to continue"
  ariaLabel="I agree to the terms"
/>
```

### Validation States

```html
<!-- Error State -->
<eb-radio
  label="Required field"
  name="required"
  value="option"
  validationState="error"
  helperText="This field is required"
  ariaLabel="Required field"
/>

<!-- Success State -->
<eb-radio
  label="Verified"
  name="verified"
  value="verified"
  [checked]="true"
  validationState="success"
  helperText="Your selection is valid"
  ariaLabel="Verified"
/>
```

### Different Sizes

```html
<eb-radio size="sm" label="Small" name="size" value="sm" ariaLabel="Small radio button" />
<eb-radio size="md" label="Medium" name="size" value="md" ariaLabel="Medium radio button" />
<eb-radio size="lg" label="Large" name="size" value="lg" ariaLabel="Large radio button" />
```

### Radio Group Pattern

```html
<div role="radiogroup" aria-label="Notification preferences">
  <eb-radio
    label="Email notifications"
    name="notifications"
    value="email"
    [(checked)]="notificationPreference"
    ariaLabel="Email notifications"
  />
  <eb-radio
    label="SMS notifications"
    name="notifications"
    value="sms"
    [(checked)]="notificationPreference"
    ariaLabel="SMS notifications"
  />
  <eb-radio
    label="No notifications"
    name="notifications"
    value="none"
    [(checked)]="notificationPreference"
    ariaLabel="No notifications"
  />
</div>
```

### Using the selected Output

```typescript
import { signal } from '@angular/core';

@Component({
  template: `
    <div role="radiogroup" aria-label="Theme selection">
      <eb-radio
        label="Light"
        name="theme"
        value="light"
        [checked]="theme() === 'light'"
        (selected)="theme.set($event)"
        ariaLabel="Light theme"
      />
      <eb-radio
        label="Dark"
        name="theme"
        value="dark"
        [checked]="theme() === 'dark'"
        (selected)="theme.set($event)"
        ariaLabel="Dark theme"
      />
    </div>
  `,
})
export class ThemePickerComponent {
  theme = signal('light');
}
```

## API Reference

### Inputs

| Input             | Type                                             | Default      | Description                               |
| ----------------- | ------------------------------------------------ | ------------ | ----------------------------------------- |
| `size`            | `'sm' \| 'md' \| 'lg'`                           | `'md'`       | Size of the radio button                  |
| `checked`         | `boolean`                                        | `false`      | Checked state (two-way bindable)          |
| `label`           | `string`                                         | `''`         | Label text displayed next to radio button |
| `helperText`      | `string`                                         | `''`         | Helper text displayed below radio button  |
| `validationState` | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`  | Validation state                          |
| `disabled`        | `boolean`                                        | `false`      | Whether the radio button is disabled      |
| `required`        | `boolean`                                        | `false`      | Whether the radio button is required      |
| `value`           | `string`                                         | **required** | Value attribute for the radio button      |
| `name`            | `string`                                         | **required** | Name attribute for grouping radio buttons |
| `ariaLabel`       | `string`                                         | **required** | ARIA label for accessibility              |
| `ariaDescribedBy` | `string`                                         | `undefined`  | ID of describing element                  |
| `ariaInvalid`     | `boolean`                                        | `false`      | Whether the value is invalid              |

### Outputs

| Output          | Type         | Description                                     |
| --------------- | ------------ | ----------------------------------------------- |
| `checkedChange` | `boolean`    | Emitted when checked state changes              |
| `selected`      | `string`     | Emitted when radio is selected (includes value) |
| `focused`       | `FocusEvent` | Emitted when radio receives focus               |
| `blurred`       | `FocusEvent` | Emitted when radio loses focus                  |

### Public Methods

| Method     | Description                                             |
| ---------- | ------------------------------------------------------- |
| `focus()`  | Programmatically focus the radio button                 |
| `blur()`   | Programmatically blur the radio button                  |
| `select()` | Select the radio button (respects disabled and checked) |

## Accessibility

The radio component follows WCAG 2.1 AAA guidelines:

- ✅ **ARIA Labels**: Required `ariaLabel` for all radio buttons
- ✅ **ARIA Attributes**: Proper use of `aria-invalid`, `aria-describedby`, `aria-labelledby`
- ✅ **Keyboard Navigation**: Arrow keys to navigate within group, Space to select
- ✅ **Focus Management**: Visible focus indicators
- ✅ **Color Contrast**: AAA compliant contrast ratios (7:1 for text)
- ✅ **Touch Targets**: Minimum 44px on mobile devices
- ✅ **Screen Reader Support**: Proper announcements for all states
- ✅ **Radio Groups**: Use `role="radiogroup"` on container with `aria-label`

### Keyboard Navigation

- **Tab**: Move focus to/from the radio group
- **Arrow Up/Down**: Navigate between radio buttons in a group
- **Arrow Left/Right**: Navigate between radio buttons in a group
- **Space**: Select the focused radio button
- **Shift + Tab**: Move focus backward

### Radio Group Best Practices

When creating radio groups:

1. Wrap radio buttons in a container with `role="radiogroup"`
2. Provide an `aria-label` or `aria-labelledby` on the group
3. Use the same `name` attribute for all radios in the group
4. Only one radio in a group should be checked at a time
5. Provide clear labels for each option

```html
<div role="radiogroup" aria-label="Payment method selection">
  <eb-radio
    label="Credit Card"
    name="payment"
    value="credit"
    [checked]="paymentMethod === 'credit'"
    (selected)="paymentMethod = $event"
    ariaLabel="Credit Card"
  />
  <!-- More radio buttons... -->
</div>
```

## Theme Support

The component uses CSS variables for theming:

```scss
--color-primary
--color-success
--color-warning
--color-error
--color-border
--color-background
--color-text
--space-1
--space-2
--border-radius
--border-radius-sm
--duration-normal
--ease-in-out
```

## Testing

The component includes comprehensive unit tests:

- 70+ tests covering all functionality
- 100% pass rate
- Tests for all size variants
- Tests for all validation states
- Tests for checked and unchecked states
- Tests for keyboard navigation
- Tests for accessibility (ARIA attributes)
- Tests for focus management
- Tests for public methods

Run tests:

```bash
npm test
```

## Storybook

The component includes 15 Storybook stories demonstrating:

- All size variants
- All validation states
- Checked/unchecked states
- Required radio buttons
- Radio groups
- Form integration
- Keyboard navigation
- Accessibility demo
- Dark theme support

View in Storybook:

```bash
npm run storybook
```

## Best Practices

1. **Always provide `ariaLabel`**: Required for accessibility
2. **Use `name` attribute**: Required for grouping radio buttons
3. **Use validation states**: Provide visual feedback for errors
4. **Provide helper text**: Add context for complex choices
5. **Wrap in radiogroup**: Use `role="radiogroup"` on container
6. **Label the group**: Add `aria-label` or `aria-labelledby` to group
7. **One checked per group**: Ensure mutually exclusive selection
8. **Touch targets**: Component automatically handles mobile touch targets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- Angular 21+
- UniqueIdService (for generating accessible IDs)

## Related Components

- [CheckboxComponent](../checkbox/README.md)
- [InputComponent](../input/README.md)
- [SelectComponent](../select/README.md)
