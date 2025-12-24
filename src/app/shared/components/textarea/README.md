# Textarea Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Accessible multi-line text input component with auto-resize and comprehensive features.

## Features

- ✅ **Three Variants**: Default, Filled, Outlined
- ✅ **Three Sizes**: Small (sm), Medium (md), Large (lg)
- ✅ **Validation States**: Default, Success, Warning, Error
- ✅ **Auto-resize**: Automatically grow/shrink based on content
- ✅ **Character Count**: Optional counter with max length
- ✅ **Helper Text**: Instructions and validation messages
- ✅ **Resize Control**: None, Vertical, Horizontal, Both
- ✅ **Two-way Binding**: Signal-based [(value)] binding
- ✅ **Accessible**: WCAG 2.1 AAA compliant with ARIA attributes
- ✅ **Theme Integration**: Uses CSS variables for theming

## Usage

### Basic Examples

```typescript
import { Component, signal } from '@angular/core';
import { TextareaComponent } from '@shared/components';

@Component({
  selector: 'eb-example',
  imports: [TextareaComponent],
  template: `
    <!-- Basic textarea -->
    <eb-textarea label="Message" [(value)]="message" ariaLabel="Enter your message" />

    <!-- Textarea with validation -->
    <eb-textarea
      label="Comments"
      [(value)]="comments"
      validationState="error"
      helperText="Comments are required"
      [required]="true"
      ariaLabel="Enter your comments"
    />

    <!-- Textarea with auto-resize -->
    <eb-textarea
      label="Description"
      [(value)]="description"
      [rows]="3"
      [autoResize]="true"
      [minRows]="3"
      [maxRows]="10"
      ariaLabel="Enter project description"
    />

    <!-- Textarea with character count -->
    <eb-textarea
      label="Bio"
      [(value)]="bio"
      [maxLength]="500"
      [showCharCount]="true"
      helperText="Tell us about yourself"
      ariaLabel="Enter your bio"
    />

    <!-- Disabled textarea -->
    <eb-textarea label="Notes" [(value)]="notes" [disabled]="true" ariaLabel="Notes" />

    <!-- Read-only textarea -->
    <eb-textarea
      label="Output"
      [(value)]="output"
      [readonly]="true"
      [rows]="5"
      ariaLabel="Output text"
    />

    <!-- No resize -->
    <eb-textarea
      label="Fixed Size"
      [(value)]="fixed"
      resize="none"
      [rows]="4"
      ariaLabel="Enter text"
    />
  `,
})
export class ExampleComponent {
  message = signal('');
  comments = signal('');
  description = signal('');
  bio = signal('');
  notes = signal('Read-only notes...');
  output = signal('Generated output...');
  fixed = signal('');
}
```

### With Auto-resize

```typescript
@Component({
  template: `
    <eb-textarea
      label="Dynamic Content"
      [(value)]="content"
      [autoResize]="true"
      [minRows]="2"
      [maxRows]="8"
      helperText="Textarea grows with content"
      ariaLabel="Enter dynamic content"
    />
  `,
})
export class AutoResizeExample {
  content = signal('');
}
```

### With Event Handling

```typescript
@Component({
  template: `
    <eb-textarea
      label="Feedback"
      [(value)]="feedback"
      ariaLabel="Provide feedback"
      (valueChange)="handleChange($event)"
      (focused)="handleFocus($event)"
      (blurred)="handleBlur($event)"
    />
  `,
})
export class EventExample {
  feedback = signal('');

  handleChange(value: string) {
    console.log('Value changed:', value);
  }

  handleFocus(event: FocusEvent) {
    console.log('Textarea focused');
  }

  handleBlur(event: FocusEvent) {
    console.log('Textarea blurred');
  }
}
```

### Programmatic Control

```typescript
@Component({
  template: `
    <eb-textarea #contentArea label="Content" [(value)]="content" ariaLabel="Enter content" />

    <eb-button ariaLabel="Focus" (clicked)="focusTextarea()"> Focus </eb-button>
    <eb-button ariaLabel="Select all" (clicked)="selectAll()"> Select All </eb-button>
  `,
})
export class ProgrammaticExample {
  @ViewChild('contentArea') contentArea!: TextareaComponent;
  content = signal('');

  focusTextarea() {
    this.contentArea.focus();
  }

  selectAll() {
    this.contentArea.select();
  }
}
```

## Component API

### Inputs

| Input             | Type                                             | Default                               | Description                                                                                                                |
| ----------------- | ------------------------------------------------ | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `variant`         | `'default' \| 'filled' \| 'outlined'`            | `'default'`                           | Visual variant                                                                                                             |
| `size`            | `'sm' \| 'md' \| 'lg'`                           | `'md'`                                | Text size                                                                                                                  |
| `value`           | `string`                                         | `''`                                  | Current value (two-way bindable)                                                                                           |
| `label`           | `string`                                         | `''`                                  | Label text above textarea                                                                                                  |
| `placeholder`     | `string`                                         | `''`                                  | Placeholder text                                                                                                           |
| `helperText`      | `string`                                         | `''`                                  | Helper text below textarea                                                                                                 |
| `validationState` | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`                           | Validation state                                                                                                           |
| `disabled`        | `boolean`                                        | `false`                               | Whether disabled                                                                                                           |
| `readonly`        | `boolean`                                        | `false`                               | Whether readonly                                                                                                           |
| `required`        | `boolean`                                        | `false`                               | Whether required                                                                                                           |
| `rows`            | `number`                                         | `4`                                   | Number of visible rows                                                                                                     |
| `maxRows`         | `number \| undefined`                            | `undefined`                           | Max rows for auto-resize                                                                                                   |
| `minRows`         | `number \| undefined`                            | `undefined`                           | Min rows for auto-resize                                                                                                   |
| `maxLength`       | `number \| undefined`                            | `undefined`                           | Maximum text length                                                                                                        |
| `minLength`       | `number \| undefined`                            | `undefined`                           | Minimum text length                                                                                                        |
| `showCharCount`   | `boolean`                                        | `false`                               | Show character count                                                                                                       |
| `fullWidth`       | `boolean`                                        | `false`                               | Full width of container                                                                                                    |
| `resize`          | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'`                          | Resize behavior                                                                                                            |
| `autoResize`      | `boolean`                                        | `false`                               | Auto-resize based on content                                                                                               |
| `ariaLabel`       | `string`                                         | **OPTIONAL when `label` is provided** | ARIA label for the textarea. Optional when a visible `label` is present, as the label element provides the accessible name |
| `ariaDescribedBy` | `string \| undefined`                            | `undefined`                           | Described by element ID                                                                                                    |
| `ariaInvalid`     | `boolean`                                        | `false`                               | Whether value is invalid                                                                                                   |

### Outputs

| Output        | Type                       | Description    |
| ------------- | -------------------------- | -------------- |
| `valueChange` | `EventEmitter<string>`     | Value changed  |
| `focused`     | `EventEmitter<FocusEvent>` | Received focus |
| `blurred`     | `EventEmitter<FocusEvent>` | Lost focus     |

### Methods

| Method     | Return Type | Description        |
| ---------- | ----------- | ------------------ |
| `focus()`  | `void`      | Focus the textarea |
| `blur()`   | `void`      | Blur the textarea  |
| `select()` | `void`      | Select all text    |

### Size Specifications

| Size | Font Size | Line Height |
| ---- | --------- | ----------- |
| `sm` | 14px      | 1.4         |
| `md` | 16px      | 1.5         |
| `lg` | 18px      | 1.6         |

## Auto-resize Behavior

When `autoResize` is enabled:

- Textarea grows/shrinks based on content
- Respects `minRows` and `maxRows` bounds
- Updates on input changes
- Works with SSR (safe for server-side rendering)

## Accessibility

### ARIA Labels

The `ariaLabel` input is **optional when a visible `label` is provided**, since the `<label>` element is properly associated with the textarea and provides the accessible name.

You may optionally provide `ariaLabel` to:

- Override the visible label text for screen readers
- Provide additional context not visible in the label

```html
<!-- Good: Label provides accessible name -->
<eb-textarea label="Message" [(value)]="message" />

<!-- Good: ariaLabel provides additional context -->
<eb-textarea label="Comments" [(value)]="comments" ariaLabel="Additional comments or feedback" />

<!-- Required: No visible label, ariaLabel needed -->
<eb-textarea placeholder="Type your message..." [(value)]="message" ariaLabel="Message content" />
```

### Validation States

When showing errors:

- Set `validationState="error"`
- Set `ariaInvalid="true"`
- Provide descriptive `helperText`

### Keyboard Support

- **Tab**: Move focus to/from textarea
- **Shift+Enter**: Insert new line (standard)

## Styling

Uses BEM methodology with theme integration:

```scss
.textarea {
  width: 100%;
  font-family: var(--font-family-sans);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  transition: all var(--transition-fast);

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }

  &--error {
    border-color: var(--color-error);
  }

  &--resize-none {
    resize: none;
  }

  &--resize-vertical {
    resize: vertical;
  }
}
```

## Testing

Run tests:

```bash
npm test -- textarea.component
```

## Architecture

```
textarea/
├── textarea.component.ts
├── textarea.component.html
├── textarea.component.scss
├── textarea.component.spec.ts
├── textarea.component.stories.ts
├── index.ts
└── README.md

input-footer/              # Shared component
└── ...
```

## Dependencies

- `@angular/common`: CommonModule
- `@angular/forms`: FormsModule
- `@angular/core`: Core functionality
- `input-footer`: Shared footer component

## Best Practices

1. **Use auto-resize**: For dynamic content
2. **Set max length**: Prevent unlimited input
3. **Show char count**: When limits apply
4. **Clear labels**: Describe expected input
5. **Validation**: Provide clear error messages

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Part of the MoodyJW Portfolio project.
