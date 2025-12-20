# Toast Notification Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Toast notifications for displaying temporary messages with auto-dismiss and manual dismiss functionality.

## Features

- ✅ **Four Variants**: Success, Error, Warning, Info
- ✅ **Auto-dismiss**: Configurable duration (or disable with `duration: 0`)
- ✅ **Manual Dismiss**: Optional close button
- ✅ **Positioning**: Six positions (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right)
- ✅ **Accessible**: WCAG 2.1 AAA compliant with ARIA live regions
- ✅ **Keyboard Navigation**: Dismiss button is keyboard accessible
- ✅ **Reduced Motion**: Respects `prefers-reduced-motion` preference
- ✅ **Theme Integration**: Uses CSS variables for theming
- ✅ **Service-based**: Manage toasts from anywhere in the app

## Usage

### 1. Add Toast Container to App Layout

Add the toast container once in your app root or main layout:

```html
<!-- In app.component.html or main-layout.component.html -->
<eb-toast-container />
```

### 2. Use the Toast Service

Inject the `ToastService` and use its convenience methods:

```typescript
import { Component, inject } from '@angular/core';
import { ToastService } from '@shared/services';

@Component({
  // ...
})
export class MyComponent {
  private toastService = inject(ToastService);

  showSuccess() {
    this.toastService.success('Changes saved successfully!', {
      title: 'Success',
      duration: 5000,
    });
  }

  showError() {
    this.toastService.error('Failed to save changes', {
      title: 'Error',
      duration: 7000,
    });
  }

  showWarning() {
    this.toastService.warning('Your session will expire soon', {
      title: 'Warning',
      duration: 6000,
    });
  }

  showInfo() {
    this.toastService.info('New features available', {
      title: 'Info',
      duration: 5000,
    });
  }

  // Custom toast with all options
  showCustom() {
    this.toastService.show({
      message: 'Custom notification',
      title: 'Custom',
      variant: 'info',
      duration: 5000,
      dismissible: true,
      position: 'bottom-center',
    });
  }

  // Persistent toast (no auto-dismiss)
  showPersistent() {
    this.toastService.warning('This will not auto-dismiss', {
      duration: 0, // Set to 0 to disable auto-dismiss
    });
  }

  // Dismiss all toasts
  dismissAll() {
    this.toastService.dismissAll();
  }
}
```

## Service Methods

### `success(message: string, config?: Partial<ToastConfig>): string`

Show a success toast (green).

### `error(message: string, config?: Partial<ToastConfig>): string`

Show an error toast (red).

### `warning(message: string, config?: Partial<ToastConfig>): string`

Show a warning toast (orange/yellow).

### `info(message: string, config?: Partial<ToastConfig>): string`

Show an info toast (blue).

### `show(config: ToastConfig): string`

Show a custom toast with full configuration.

### `dismiss(id: string): void`

Dismiss a specific toast by its ID.

### `dismissAll(): void`

Dismiss all active toasts.

## Configuration Options

```typescript
interface ToastConfig {
  message: string; // Required: The message to display
  title?: string; // Optional: Toast title
  variant?: ToastVariant; // Optional: 'success' | 'error' | 'warning' | 'info' (default: 'info')
  duration?: number; // Optional: Auto-dismiss duration in ms (default: 5000, 0 = no auto-dismiss)
  dismissible?: boolean; // Optional: Show dismiss button (default: true)
  position?: ToastPosition; // Optional: Position on screen (default: 'top-right')
}
```

### Positions

- `'top-left'`
- `'top-center'`
- `'top-right'` (default)
- `'bottom-left'`
- `'bottom-center'`
- `'bottom-right'`

## Accessibility

### ARIA Live Regions

- **Error & Warning**: Use `aria-live="assertive"` (interrupts screen readers)
- **Success & Info**: Use `aria-live="polite"` (doesn't interrupt)

### Keyboard Navigation

- **Tab**: Focus the dismiss button
- **Enter/Space**: Dismiss the toast

### Color Contrast

All color combinations meet WCAG 2.1 AAA contrast requirements (7:1 minimum).

### Reduced Motion

Respects `prefers-reduced-motion` setting. Animations are simplified or removed for users who prefer less motion.

## Styling

The component uses BEM methodology and integrates with the existing theme system via CSS variables:

```scss
// Customize toast appearance
.toast {
  // Uses theme CSS variables
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
}
```

## Examples

### Simple Success Toast

```typescript
this.toastService.success('Operation completed!');
```

### Error with Custom Duration

```typescript
this.toastService.error('Something went wrong', {
  duration: 10000, // 10 seconds
});
```

### Warning at Bottom Center

```typescript
this.toastService.warning('Review your changes', {
  position: 'bottom-center',
});
```

### Non-Dismissible Info Toast

```typescript
this.toastService.info('Processing...', {
  dismissible: false,
  duration: 0, // Will not auto-dismiss
});
```

### Multiple Toasts

```typescript
// Show multiple toasts - they stack automatically
this.toastService.success('Step 1 complete');
this.toastService.info('Processing step 2...');
this.toastService.success('All steps complete!');
```

## Testing

Comprehensive unit tests are provided:

- **ToastComponent**: 45 tests
- **ToastService**: 29 tests
- **ToastContainerComponent**: 19 tests

Run tests:

```bash
npm test
```

## Storybook

View the component in Storybook:

```bash
npm run storybook
```

Navigate to `Shared/Toast` to see all variants and examples.

## Architecture

```
toast/
├── toast.component.ts              # Individual toast notification
├── toast.component.html
├── toast.component.scss
├── toast.component.spec.ts         # 45 tests
├── toast.component.stories.ts      # Storybook stories
├── toast-container.component.ts    # Container for managing all toasts
├── toast-container.component.html
├── toast-container.component.scss
├── toast-container.component.spec.ts  # 19 tests
├── index.ts                        # Barrel export
└── README.md                       # This file

services/
├── toast.service.ts                # Service for managing toasts
├── toast.service.spec.ts           # 29 tests
└── index.ts                        # Barrel export
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

Part of the MoodyJW Portfolio project.
