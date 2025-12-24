# Button Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Accessible button component with multiple variants, sizes, and states for all user interactions.

## Features

- ✅ **Five Variants**: Primary, Secondary, Tertiary, Ghost, Danger
- ✅ **Three Sizes**: Small (sm), Medium (md), Large (lg)
- ✅ **Loading State**: Shows spinner and disables interaction
- ✅ **Icon Support**: Left icon, right icon, or icon-only buttons
- ✅ **Full Width Option**: Expand to container width
- ✅ **Accessible**: WCAG 2.1 AAA compliant with required ARIA labels
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Theme Integration**: Uses CSS variables for theming
- ✅ **Signal-based**: Modern Angular signals API
- ✅ **Type Safety**: TypeScript types for all props

## Usage

### Basic Examples

```typescript
import { Component } from '@angular/core';
import { ButtonComponent } from '@shared/components';

@Component({
  selector: 'eb-example',
  imports: [ButtonComponent],
  template: `
    <!-- Primary button -->
    <eb-button variant="primary" ariaLabel="Submit form"> Submit </eb-button>

    <!-- Secondary button with custom size -->
    <eb-button variant="secondary" size="lg" ariaLabel="Cancel action"> Cancel </eb-button>

    <!-- Danger button for destructive actions -->
    <eb-button variant="danger" ariaLabel="Delete item"> Delete </eb-button>

    <!-- Loading state -->
    <eb-button variant="primary" [loading]="isSubmitting()" ariaLabel="Save changes">
      Save
    </eb-button>

    <!-- Icon-only button -->
    <eb-button variant="ghost" iconLeft="heroXMark" [iconOnly]="true" ariaLabel="Close dialog" />

    <!-- Button with icons -->
    <eb-button variant="primary" iconLeft="heroArrowLeft" ariaLabel="Go back"> Back </eb-button>

    <eb-button variant="primary" iconRight="heroArrowRight" ariaLabel="Continue">
      Continue
    </eb-button>

    <!-- Full width button -->
    <eb-button variant="primary" [fullWidth]="true" ariaLabel="Sign in"> Sign In </eb-button>

    <!-- Disabled button -->
    <eb-button variant="primary" [disabled]="true" ariaLabel="Disabled action">
      Disabled
    </eb-button>
  `,
})
export class ExampleComponent {
  isSubmitting = signal(false);

  async handleSubmit() {
    this.isSubmitting.set(true);
    // Perform async action
    await this.saveData();
    this.isSubmitting.set(false);
  }
}
```

### With Event Handling

```typescript
import { Component } from '@angular/core';
import { ButtonComponent } from '@shared/components';

@Component({
  selector: 'eb-form',
  imports: [ButtonComponent],
  template: `
    <eb-button variant="primary" ariaLabel="Submit form" (clicked)="handleSubmit($event)">
      Submit
    </eb-button>
  `,
})
export class FormComponent {
  handleSubmit(event: MouseEvent) {
    console.log('Button clicked:', event);
    // Handle form submission
  }
}
```

### Toggle Button

```typescript
import { Component, signal } from '@angular/core';
import { ButtonComponent } from '@shared/components';

@Component({
  selector: 'eb-toggle',
  imports: [ButtonComponent],
  template: `
    <eb-button
      variant="ghost"
      [ariaPressed]="isPressed()"
      ariaLabel="Toggle feature"
      (clicked)="toggle()"
    >
      {{ isPressed() ? 'On' : 'Off' }}
    </eb-button>
  `,
})
export class ToggleComponent {
  isPressed = signal(false);

  toggle() {
    this.isPressed.update((v) => !v);
  }
}
```

## Component API

### Inputs

| Input             | Type                                                            | Default                                                       | Description                                                                                                                                  |
| ----------------- | --------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`         | `'primary' \| 'secondary' \| 'tertiary' \| 'ghost' \| 'danger'` | `'primary'`                                                   | Visual variant of the button                                                                                                                 |
| `size`            | `'sm' \| 'md' \| 'lg'`                                          | `'md'`                                                        | Size of the button                                                                                                                           |
| `type`            | `'button' \| 'submit' \| 'reset'`                               | `'button'`                                                    | HTML button type attribute                                                                                                                   |
| `disabled`        | `boolean`                                                       | `false`                                                       | Whether the button is disabled                                                                                                               |
| `loading`         | `boolean`                                                       | `false`                                                       | Whether the button is in loading state                                                                                                       |
| `iconLeft`        | `string \| undefined`                                           | `undefined`                                                   | Icon identifier for left position                                                                                                            |
| `iconRight`       | `string \| undefined`                                           | `undefined`                                                   | Icon identifier for right position                                                                                                           |
| `iconOnly`        | `boolean`                                                       | `false`                                                       | Whether this is an icon-only button (no text)                                                                                                |
| `fullWidth`       | `boolean`                                                       | `false`                                                       | Whether button should take full width of container                                                                                           |
| `ariaLabel`       | `string`                                                        | **REQUIRED for icon-only buttons, OPTIONAL for text buttons** | ARIA label for the button. Required when `iconOnly` is true or button has no visible text. Optional when button has descriptive visible text |
| `ariaDescribedBy` | `string \| undefined`                                           | `undefined`                                                   | ID of element that describes the button                                                                                                      |
| `ariaPressed`     | `boolean \| undefined`                                          | `undefined`                                                   | Whether button is in a pressed/active state (for toggle buttons)                                                                             |

### Outputs

| Output    | Type                       | Description                                                     |
| --------- | -------------------------- | --------------------------------------------------------------- |
| `clicked` | `EventEmitter<MouseEvent>` | Emitted when the button is clicked (if not disabled or loading) |

### Size Specifications

| Size | Height | Font Size | Padding   |
| ---- | ------ | --------- | --------- |
| `sm` | 32px   | 14px      | 12px 16px |
| `md` | 40px   | 16px      | 12px 20px |
| `lg` | 48px   | 18px      | 16px 24px |

## Variant Styles

### Primary

- High emphasis button for main call-to-action
- Filled background with primary color
- White text
- Use sparingly (typically one per screen)

### Secondary

- Medium emphasis for secondary actions
- Outlined style with border
- Primary color border and text
- Use for alternative actions

### Tertiary

- Low emphasis for optional actions
- Text-only with hover state
- Minimal visual weight
- Use for less important actions

### Ghost

- Minimal emphasis
- Transparent with subtle border
- Use for navigation or auxiliary actions

### Danger

- Destructive actions
- Error color (red)
- Use for delete, remove, or other destructive actions

## Accessibility

### ARIA Labels

**Required for icon-only buttons:**

- Icon-only buttons MUST have `ariaLabel` since there's no visible text
- The label describes the button's action to screen readers

**Optional for text buttons:**

- Text buttons with descriptive visible text don't require `ariaLabel`
- The visible text already provides an accessible name
- You may optionally provide `ariaLabel` to override or enhance the accessible name

```html
<!-- Required: Icon-only button needs ariaLabel -->
<eb-button iconLeft="heroTrash" [iconOnly]="true" ariaLabel="Delete item" />

<!-- Optional: Text button already has visible label -->
<eb-button variant="primary">Submit Form</eb-button>

<!-- Optional: Text button with additional ariaLabel context -->
<eb-button variant="primary" ariaLabel="Submit contact form">Submit</eb-button>
```

### Loading State

When `loading` is true:

- Button is automatically disabled
- `aria-busy="true"` is added
- Loading spinner is shown
- Button text remains visible for context

### Keyboard Support

- **Enter/Space**: Activates the button
- **Tab**: Moves focus to/from the button
- All interactive states have clear focus indicators

### Color Contrast

All button variants meet WCAG 2.1 AAA contrast requirements:

- Text: Minimum 7:1 contrast ratio
- Focus indicators: Minimum 3:1 contrast ratio

## Styling

The component uses BEM methodology and integrates with the existing theme system via CSS variables:

```scss
// Button uses theme CSS variables
.btn {
  font-family: var(--font-family-sans);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);

  &--primary {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
}
```

## Testing

Comprehensive unit tests are provided in `button.component.spec.ts`.

Run tests:

```bash
npm test -- button.component
```

## Storybook

View the component in Storybook:

```bash
npm run storybook
```

Navigate to `Shared/Button` to see all variants and examples.

## Architecture

```
button/
├── button.component.ts              # Main button component
├── button.component.html            # Template
├── button.component.scss            # Styles
├── button.component.spec.ts         # Unit tests
├── button.component.stories.ts      # Storybook stories
├── index.ts                         # Barrel export
└── README.md                        # This file

button-content/
├── button-content.component.ts      # Internal content wrapper
├── button-content.component.html
├── button-content.component.scss
├── button-content.component.spec.ts
└── index.ts
```

## Dependencies

- `@angular/common`: CommonModule
- `@angular/core`: Core Angular functionality
- `button-content`: Internal component for rendering button content

## Best Practices

1. **Use appropriate variants**: Primary for main actions, secondary for alternatives, danger for destructive actions
2. **Provide clear labels**: Always use descriptive `ariaLabel` values
3. **Limit primary buttons**: Typically one primary button per screen/section
4. **Handle loading states**: Use `loading` prop for async operations
5. **Icon-only buttons**: Always include descriptive `ariaLabel`
6. **Button groups**: Use consistent sizes within button groups

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

Part of the MoodyJW Portfolio project.
