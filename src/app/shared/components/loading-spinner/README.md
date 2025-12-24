# Loading Spinner Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Accessible loading spinner component for indicating loading states with optional overlay and message.

## Features

- ✅ **Four Sizes**: Small (20px), Medium (32px), Large (48px), XL (64px)
- ✅ **Four Variants**: Primary, Secondary, Light, Dark
- ✅ **Optional Message**: Text below spinner
- ✅ **Center Mode**: Automatically center in container
- ✅ **Overlay Mode**: Full-screen backdrop overlay
- ✅ **Accessible**: WCAG 2.1 AAA compliant with ARIA labels
- ✅ **Reduced Motion**: Respects prefers-reduced-motion preference
- ✅ **Theme Integration**: Uses CSS variables
- ✅ **Signal-based**: Modern Angular signals API

## Usage

### Basic Examples

```typescript
import { Component, signal } from '@angular/core';
import { LoadingSpinnerComponent } from '@shared/components';

@Component({
  selector: 'eb-example',
  imports: [LoadingSpinnerComponent],
  template: `
    <!-- Default spinner -->
    <eb-loading-spinner ariaLabel="Loading content" />

    <!-- Small spinner with secondary variant -->
    <eb-loading-spinner size="sm" variant="secondary" ariaLabel="Loading" />

    <!-- Large spinner with message -->
    <eb-loading-spinner
      size="lg"
      ariaLabel="Loading data"
      message="Please wait while we load your data..."
    />

    <!-- Centered spinner -->
    <eb-loading-spinner [center]="true" ariaLabel="Loading page" />

    <!-- Full-screen overlay -->
    <eb-loading-spinner
      [overlay]="true"
      size="xl"
      ariaLabel="Processing request"
      message="Processing your request..."
    />

    <!-- Light variant (for dark backgrounds) -->
    <div style="background: #333; padding: 2rem;">
      <eb-loading-spinner variant="light" ariaLabel="Loading" />
    </div>

    <!-- Dark variant (for light backgrounds) -->
    <div style="background: #fff; padding: 2rem;">
      <eb-loading-spinner variant="dark" ariaLabel="Loading" />
    </div>
  `,
})
export class ExampleComponent {}
```

### Loading States

```typescript
@Component({
  template: `
    <!-- Conditional loading -->
    @if (isLoading()) {
      <eb-loading-spinner [center]="true" ariaLabel="Loading data" />
    } @else {
      <div class="content">
        {{ data() }}
      </div>
    }

    <!-- Button with loading state -->
    <eb-button [loading]="isSubmitting()" ariaLabel="Submit form" (clicked)="handleSubmit()">
      Submit
    </eb-button>
  `,
})
export class LoadingStateExample {
  isLoading = signal(true);
  isSubmitting = signal(false);
  data = signal('Content loaded!');

  handleSubmit() {
    this.isSubmitting.set(true);
    // Simulate API call
    setTimeout(() => this.isSubmitting.set(false), 2000);
  }
}
```

### Overlay Loading

```typescript
@Component({
  template: `
    <div class="page-content">
      <h1>Page Content</h1>
      <p>Main content here...</p>
    </div>

    <!-- Full-screen loading overlay -->
    @if (isProcessing()) {
      <eb-loading-spinner
        [overlay]="true"
        size="xl"
        ariaLabel="Processing data"
        message="Processing your data..."
      />
    }
  `,
})
export class OverlayExample {
  isProcessing = signal(false);

  processData() {
    this.isProcessing.set(true);
    // Perform async operation
    setTimeout(() => this.isProcessing.set(false), 3000);
  }
}
```

### Inline Loading

```typescript
@Component({
  template: `
    <!-- Inline with text -->
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <eb-loading-spinner size="sm" ariaLabel="Loading" />
      <span>Loading data...</span>
    </div>

    <!-- In a card -->
    <eb-card>
      <div card-body>
        @if (loadingCard()) {
          <eb-loading-spinner [center]="true" ariaLabel="Loading card content" />
        } @else {
          <p>Card content</p>
        }
      </div>
    </eb-card>
  `,
})
export class InlineExample {
  loadingCard = signal(true);
}
```

### Different Sizes

```typescript
@Component({
  template: `
    <!-- Small (20px) -->
    <eb-loading-spinner size="sm" ariaLabel="Small spinner" />

    <!-- Medium/Default (32px) -->
    <eb-loading-spinner size="md" ariaLabel="Medium spinner" />

    <!-- Large (48px) -->
    <eb-loading-spinner size="lg" ariaLabel="Large spinner" />

    <!-- Extra Large (64px) -->
    <eb-loading-spinner size="xl" ariaLabel="Extra large spinner" />
  `,
})
export class SizesExample {}
```

## Component API

### Inputs

| Input       | Type                                            | Default      | Description                                                                             |
| ----------- | ----------------------------------------------- | ------------ | --------------------------------------------------------------------------------------- |
| `size`      | `'sm' \| 'md' \| 'lg' \| 'xl'`                  | `'md'`       | Size of the spinner                                                                     |
| `variant`   | `'primary' \| 'secondary' \| 'light' \| 'dark'` | `'primary'`  | Visual variant (color)                                                                  |
| `ariaLabel` | `string`                                        | **REQUIRED** | ARIA label announcing loading state. Required because spinner has no visible text label |
| `message`   | `string \| undefined`                           | `undefined`  | Optional visible message below spinner                                                  |
| `center`    | `boolean`                                       | `false`      | Whether to center spinner in container                                                  |
| `overlay`   | `boolean`                                       | `false`      | Whether to show as full-screen overlay                                                  |

### Size Specifications

| Size | Diameter |
| ---- | -------- |
| `sm` | 20px     |
| `md` | 32px     |
| `lg` | 48px     |
| `xl` | 64px     |

### Variant Colors

| Variant     | Use Case              | Color                 |
| ----------- | --------------------- | --------------------- |
| `primary`   | Default, main content | Primary theme color   |
| `secondary` | Secondary content     | Secondary theme color |
| `light`     | Dark backgrounds      | Light/white color     |
| `dark`      | Light backgrounds     | Dark/black color      |

## Accessibility

### ARIA Labels

The `ariaLabel` is **required** because the spinner has no visible text label. It should describe what is loading:

```html
<!-- Good: Descriptive label -->
<eb-loading-spinner ariaLabel="Loading user profile" />

<!-- Good: With visible message, ariaLabel still required -->
<eb-loading-spinner ariaLabel="Loading data" message="Please wait while we load your data..." />

<!-- Bad: Generic label -->
<eb-loading-spinner ariaLabel="Loading" />
```

Even when using the `message` prop to display visible text, `ariaLabel` is still required as it provides the semantic loading state announcement.

### Screen Reader Support

- Spinner announced as "Loading [label]"
- `role="status"` indicates loading region
- `aria-live="polite"` announces status changes
- Message text is read by screen readers

### Reduced Motion

Automatically reduces animation speed when user prefers reduced motion:

```scss
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation-duration: 2s; // Slower
  }
}
```

## Styling

Uses CSS animations and theme variables:

```scss
.spinner {
  border: 3px solid var(--spinner-background);
  border-top-color: var(--spinner-foreground);
  border-radius: var(--border-radius-half);
  animation: spinner-spin 0.8s linear infinite;

  &--sm {
    width: 20px;
    height: 20px;
    border-width: 2px;
  }
  &--md {
    width: 32px;
    height: 32px;
    border-width: 3px;
  }
  &--lg {
    width: 48px;
    height: 48px;
    border-width: 4px;
  }
  &--xl {
    width: 64px;
    height: 64px;
    border-width: 5px;
  }

  &--primary {
    --spinner-foreground: var(--color-primary);
    --spinner-background: var(--color-primary-light);
  }

  &--light {
    --spinner-foreground: #ffffff;
    --spinner-background: rgba(255, 255, 255, 0.2);
  }
}

@keyframes spinner-spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner-container {
  &--center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  &--overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
  }
}
```

## Common Patterns

### Page Loading

```html
@if (loading()) {
<eb-loading-spinner [center]="true" size="lg" ariaLabel="Loading page content" />
} @else {
<div class="page-content">
  <!-- content -->
</div>
}
```

### Form Submission

```html
<form (ngSubmit)="onSubmit()">
  <!-- form fields -->
  <eb-button [loading]="submitting()" type="submit" ariaLabel="Submit form"> Submit </eb-button>
</form>

@if (submitting()) {
<eb-loading-spinner
  [overlay]="true"
  ariaLabel="Submitting form"
  message="Submitting your form..."
/>
}
```

### Data Table Loading

```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody>
    @if (loadingData()) {
    <tr>
      <td colspan="2">
        <eb-loading-spinner [center]="true" ariaLabel="Loading table data" />
      </td>
    </tr>
    } @else { @for (row of data(); track row.id) {
    <tr>
      <td>{{ row.name }}</td>
      <td>{{ row.email }}</td>
    </tr>
    } }
  </tbody>
</table>
```

### Card Loading

```html
<eb-card>
  <div card-body>
    @if (loading()) {
    <eb-loading-spinner [center]="true" ariaLabel="Loading card content" />
    } @else {
    <h3>{{ title }}</h3>
    <p>{{ content }}</p>
    }
  </div>
</eb-card>
```

## Best Practices

1. **Use appropriate sizes**: sm for inline, lg/xl for full-page
2. **Descriptive labels**: Tell users what's loading
3. **Show messages**: For long operations, show progress message
4. **Overlay for blocking**: Use overlay for operations that block UI
5. **Center for space**: Use center mode for large containers

## Testing

Run tests:

```bash
npm test -- loading-spinner.component
```

## Architecture

```
loading-spinner/
├── loading-spinner.component.ts
├── loading-spinner.component.html
├── loading-spinner.component.scss
├── loading-spinner.component.spec.ts
├── loading-spinner.component.stories.ts
├── index.ts
└── README.md
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Part of the MoodyJW Portfolio project.
