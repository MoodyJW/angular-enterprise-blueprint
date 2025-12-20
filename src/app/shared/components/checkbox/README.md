# Checkbox Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

An accessible checkbox component following WCAG 2.1 AAA guidelines with full theme integration.

## Features

- ✅ **3 Size Variants**: Small (16px), Medium (20px), Large (24px)
- ✅ **4 Validation States**: Default, Success, Warning, Error
- ✅ **Three States**: Checked, Unchecked, Indeterminate
- ✅ **Accessibility**: Full WCAG 2.1 AAA compliance
- ✅ **Keyboard Navigation**: Space to toggle, Tab to focus
- ✅ **Theme Integration**: Adapts to light and dark themes
- ✅ **Mobile Friendly**: Proper touch target sizes (minimum 44px)

## Basic Usage

```typescript
import { CheckboxComponent } from '@shared/components/checkbox';

@Component({
  selector: 'eb-example',
  standalone: true,
  imports: [CheckboxComponent],
  template: `
    <eb-checkbox
      label="Accept terms and conditions"
      [(checked)]="accepted"
      ariaLabel="Accept terms and conditions"
    />
  `,
})
export class ExampleComponent {
  accepted = false;
}
```

## Examples

### Basic Checkbox

```html
<eb-checkbox
  label="Subscribe to newsletter"
  [(checked)]="subscribed"
  ariaLabel="Subscribe to newsletter"
/>
```

### Required Checkbox

```html
<eb-checkbox
  label="I agree to the terms"
  [(checked)]="agreed"
  [required]="true"
  helperText="You must accept to continue"
  ariaLabel="I agree to the terms"
/>
```

### Validation States

```html
<!-- Error State -->
<eb-checkbox
  label="Required field"
  validationState="error"
  helperText="This field is required"
  ariaLabel="Required field"
/>

<!-- Success State -->
<eb-checkbox
  label="Verified"
  [checked]="true"
  validationState="success"
  helperText="Your selection is valid"
  ariaLabel="Verified"
/>
```

### Indeterminate State (Select All)

```html
<eb-checkbox
  label="Select all items"
  [indeterminate]="someSelected && !allSelected"
  [(checked)]="allSelected"
  ariaLabel="Select all items"
/>
```

### Different Sizes

```html
<eb-checkbox size="sm" label="Small" ariaLabel="Small checkbox" />
<eb-checkbox size="md" label="Medium" ariaLabel="Medium checkbox" />
<eb-checkbox size="lg" label="Large" ariaLabel="Large checkbox" />
```

### Checkbox Group

```html
<div>
  <h3>Select your interests</h3>
  <eb-checkbox
    label="Web Development"
    name="interests"
    value="web"
    [(checked)]="interests.web"
    ariaLabel="Web Development"
  />
  <eb-checkbox
    label="Mobile Development"
    name="interests"
    value="mobile"
    [(checked)]="interests.mobile"
    ariaLabel="Mobile Development"
  />
</div>
```

## API Reference

### Inputs

| Input             | Type                                             | Default      | Description                           |
| ----------------- | ------------------------------------------------ | ------------ | ------------------------------------- |
| `size`            | `'sm' \| 'md' \| 'lg'`                           | `'md'`       | Size of the checkbox                  |
| `checked`         | `boolean`                                        | `false`      | Checked state (two-way bindable)      |
| `indeterminate`   | `boolean`                                        | `false`      | Indeterminate state for "select all"  |
| `label`           | `string`                                         | `''`         | Label text displayed next to checkbox |
| `helperText`      | `string`                                         | `''`         | Helper text displayed below checkbox  |
| `validationState` | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`  | Validation state                      |
| `disabled`        | `boolean`                                        | `false`      | Whether the checkbox is disabled      |
| `required`        | `boolean`                                        | `false`      | Whether the checkbox is required      |
| `value`           | `string`                                         | `''`         | Value attribute for forms             |
| `name`            | `string`                                         | `''`         | Name attribute for forms              |
| `ariaLabel`       | `string`                                         | **required** | ARIA label for accessibility          |
| `ariaDescribedBy` | `string`                                         | `undefined`  | ID of describing element              |
| `ariaInvalid`     | `boolean`                                        | `false`      | Whether the value is invalid          |

### Outputs

| Output          | Type         | Description                          |
| --------------- | ------------ | ------------------------------------ |
| `checkedChange` | `boolean`    | Emitted when checked state changes   |
| `focused`       | `FocusEvent` | Emitted when checkbox receives focus |
| `blurred`       | `FocusEvent` | Emitted when checkbox loses focus    |

### Public Methods

| Method     | Description                                  |
| ---------- | -------------------------------------------- |
| `focus()`  | Programmatically focus the checkbox          |
| `blur()`   | Programmatically blur the checkbox           |
| `toggle()` | Toggle the checked state (respects disabled) |

## Accessibility

The checkbox component follows WCAG 2.1 AAA guidelines:

- ✅ **ARIA Labels**: Required `ariaLabel` for all checkboxes
- ✅ **ARIA Attributes**: Proper use of `aria-invalid`, `aria-describedby`, `aria-labelledby`
- ✅ **Keyboard Navigation**: Space to toggle, Tab to navigate
- ✅ **Focus Management**: Visible focus indicators
- ✅ **Color Contrast**: AAA compliant contrast ratios (7:1 for text)
- ✅ **Touch Targets**: Minimum 44px on mobile devices
- ✅ **Screen Reader Support**: Proper announcements for all states

### Keyboard Navigation

- **Tab**: Move focus to/from the checkbox
- **Space**: Toggle the checkbox state
- **Shift + Tab**: Move focus backward

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
--spacing-xs
--spacing-sm
--border-radius
--border-radius-sm
--transition-duration
--transition-timing
```

## Testing

The component includes comprehensive unit tests:

- 72 tests covering all functionality
- 100% pass rate
- Tests for all size variants
- Tests for all validation states
- Tests for checked, unchecked, and indeterminate states
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
- Checked/unchecked/indeterminate states
- Required checkboxes
- Checkbox groups
- Select all pattern
- Form integration
- Keyboard navigation
- Dark theme support

View in Storybook:

```bash
npm run storybook
```

## Best Practices

1. **Always provide `ariaLabel`**: Required for accessibility
2. **Use validation states**: Provide visual feedback for errors
3. **Provide helper text**: Add context for complex choices
4. **Use indeterminate state**: For "select all" scenarios
5. **Group related checkboxes**: Use same `name` attribute
6. **Touch targets**: Component automatically handles mobile touch targets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- Angular 21+
- UniqueIdService (for generating accessible IDs)

## Related Components

- [InputComponent](../input/README.md)
- [RadioComponent](../radio/README.md)
- [SelectComponent](../select/README.md)
