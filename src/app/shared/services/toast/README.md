# ToastService

> **Last Updated**: December 6, 2025  
> **Status**: Production Ready  
> **Test Coverage**: 100%

Service for displaying toast notifications throughout the application. Supports success, error, warning, and info variants, custom configuration, auto-dismiss, manual dismissal, and accessibility features.

## Features

- ✅ **Show Toasts Programmatically**: Display toasts with custom messages and configuration
- ✅ **Success, Error, Warning, Info**: Built-in helpers for common variants
- ✅ **Custom Positioning**: 6 positions (top/bottom, left/center/right)
- ✅ **Auto-Dismiss & Manual Dismiss**: Configurable duration and dismissibility
- ✅ **Signal-based State**: Reactive toast list for UI components
- ✅ **Type-safe**: Full TypeScript type safety
- ✅ **Accessibility**: ARIA roles, focus management, and keyboard support

## Usage

### Inject and Use the Service

```typescript
import { Component, inject } from '@angular/core';
import { ToastService } from '@shared/services/toast/toast.service';

@Component({
  selector: 'app-my-component',
  // ...
})
export class MyComponent {
  private toastService = inject(ToastService);

  save() {
    this.toastService.success('Changes saved successfully!');
  }

  showError() {
    this.toastService.error('Failed to save changes', {
      duration: 10000,
      title: 'Error',
    });
  }

  showCustom() {
    this.toastService.show({
      message: 'Custom message',
      variant: 'info',
      position: 'bottom-center',
      duration: 3000,
    });
  }
}
```

### Dismiss Toasts

```typescript
toastService.dismiss(toastId); // Dismiss a specific toast
toastService.dismissAll(); // Dismiss all active toasts
```

### Get Toasts by Position

```typescript
const topRightToasts = toastService.getToastsByPosition('top-right');
```

## API

### `show(config: ToastConfig): string`

Shows a toast with custom configuration. Returns the unique toast ID.

### `success(message: string, config?: Partial<ToastConfig>): string`

Shows a success toast.

### `error(message: string, config?: Partial<ToastConfig>): string`

Shows an error toast.

### `warning(message: string, config?: Partial<ToastConfig>): string`

Shows a warning toast.

### `info(message: string, config?: Partial<ToastConfig>): string`

Shows an info toast.

### `dismiss(id: string): void`

Dismisses a toast by ID.

### `dismissAll(): void`

Dismisses all active toasts.

### `getToastsByPosition(position: ToastPosition): Toast[]`

Returns all toasts at the specified position.

### `toasts: Signal<Toast[]>`

Readonly signal of all active toasts.

## Accessibility

- Toasts use ARIA roles and are announced to screen readers.
- Keyboard dismissibility and focus management supported.
- Follows WCAG 2.1 AAA standards.

## Testing

- See `toast.service.spec.ts` for comprehensive unit tests.
- All methods and edge cases are covered.

## License

This project is licensed under the MIT License.
