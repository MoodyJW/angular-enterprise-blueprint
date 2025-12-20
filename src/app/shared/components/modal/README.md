# Modal Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

A WCAG 2.1 AAA compliant modal/dialog component with backdrop, focus trapping, and comprehensive keyboard navigation support.

## Features

- ✅ **WCAG 2.1 AAA Compliant** - Full accessibility support
- ✅ **Focus Trapping** - Keyboard focus stays within modal using Angular CDK A11y
- ✅ **Keyboard Navigation** - ESC to close, Tab/Shift+Tab to navigate
- ✅ **Multiple Variants** - Default, fullscreen, dialog, sidebar
- ✅ **Flexible Sizes** - sm, md, lg, xl
- ✅ **Content Projection** - Separate slots for header, body, footer
- ✅ **Body Scroll Lock** - Prevents background scrolling when open
- ✅ **Theme Integration** - Uses CSS variables for seamless theming
- ✅ **Animations** - Respects `prefers-reduced-motion`
- ✅ **Mobile Responsive** - Auto fullscreen on mobile devices
- ✅ **Programmatic API** - ModalService for code-based control

## Installation

The modal component is already included in the shared components library. Import it where needed:

```typescript
import { ModalComponent } from '@shared/components';
```

For programmatic usage, inject the ModalService:

```typescript
import { ModalService } from '@shared/services/modal.service';

private modalService = inject(ModalService);
```

## Basic Usage

### Component-Based (Template)

```html
<eb-button variant="primary" ariaLabel="Open settings" (clicked)="isModalOpen.set(true)">
  Open Settings
</eb-button>

<eb-modal [open]="isModalOpen()" ariaLabel="User Settings" (closed)="isModalOpen.set(false)">
  <div modal-header>
    <h2>User Settings</h2>
  </div>

  <div modal-body>
    <p>Your settings content goes here...</p>
  </div>

  <div modal-footer>
    <eb-button variant="secondary" ariaLabel="Cancel" (clicked)="isModalOpen.set(false)">
      Cancel
    </eb-button>
    <eb-button variant="primary" ariaLabel="Save changes" (clicked)="saveSettings()">
      Save
    </eb-button>
  </div>
</eb-modal>
```

### Service-Based (Programmatic)

```typescript
import { Component, inject } from '@angular/core';
import { ModalService } from '@shared/services/modal.service';

@Component({
  // ...
})
export class MyComponent {
  private modalService = inject(ModalService);

  openModal() {
    const modalRef = this.modalService.open({
      ariaLabel: 'Confirmation Dialog',
      variant: 'dialog',
      size: 'sm',
    });

    modalRef.afterClosed().then((result) => {
      console.log('Modal closed with result:', result);
    });
  }

  async confirmAction() {
    const confirmed = await this.modalService.confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item?',
      confirmText: 'Delete',
      confirmVariant: 'danger',
    });

    if (confirmed) {
      // Perform deletion
    }
  }

  async showAlert() {
    await this.modalService.alert({
      title: 'Success',
      message: 'Your changes have been saved.',
      okText: 'OK',
    });
  }
}
```

## API Reference

### Inputs

| Input                  | Type                                                 | Default      | Description                                                 |
| ---------------------- | ---------------------------------------------------- | ------------ | ----------------------------------------------------------- |
| `variant`              | `'default' \| 'fullscreen' \| 'dialog' \| 'sidebar'` | `'default'`  | Visual variant of the modal                                 |
| `size`                 | `'sm' \| 'md' \| 'lg' \| 'xl'`                       | `'md'`       | Size of modal (not used for fullscreen)                     |
| `open`                 | `boolean`                                            | `false`      | Whether the modal is open                                   |
| `closeOnBackdropClick` | `boolean`                                            | `true`       | Close modal when backdrop is clicked                        |
| `closeOnEscape`        | `boolean`                                            | `true`       | Close modal when ESC key is pressed                         |
| `showCloseButton`      | `boolean`                                            | `true`       | Show close button in header                                 |
| `preventBodyScroll`    | `boolean`                                            | `true`       | Prevent body scroll when modal is open                      |
| `ariaLabel`            | `string`                                             | **required** | ARIA label for accessibility                                |
| `ariaDescribedBy`      | `string \| undefined`                                | `undefined`  | ID of describing element                                    |
| `ariaLabelledBy`       | `string \| undefined`                                | `undefined`  | ID of labeling element (use when modal has visible heading) |

### Outputs

| Output            | Type      | Description                      |
| ----------------- | --------- | -------------------------------- |
| `closed`          | `void`    | Emitted when modal is closed     |
| `backdropClicked` | `void`    | Emitted when backdrop is clicked |
| `openedChange`    | `boolean` | Emitted when open state changes  |

### Content Projection Slots

Use these attribute selectors to project content into specific slots:

| Selector         | Description                      |
| ---------------- | -------------------------------- |
| `[modal-header]` | Header section (title, subtitle) |
| `[modal-body]`   | Main content area (scrollable)   |
| `[modal-footer]` | Footer section (action buttons)  |

## Variants

### Default

Standard centered modal with configurable size.

```html
<eb-modal [open]="isOpen()" variant="default" size="md" ariaLabel="Standard modal">
  <!-- content -->
</eb-modal>
```

### Fullscreen

Takes entire viewport, useful for mobile or immersive content.

```html
<eb-modal [open]="isOpen()" variant="fullscreen" ariaLabel="Fullscreen modal">
  <!-- content -->
</eb-modal>
```

### Dialog

Small modal for confirmations and alerts.

```html
<eb-modal [open]="isOpen()" variant="dialog" ariaLabel="Confirmation">
  <!-- content -->
</eb-modal>
```

### Sidebar

Slides in from the right side, great for filters or settings.

```html
<eb-modal [open]="isOpen()" variant="sidebar" ariaLabel="Filters">
  <!-- content -->
</eb-modal>
```

## Accessibility

### WCAG 2.1 AAA Compliance

The modal component meets all WCAG 2.1 AAA requirements:

- **Focus Management**: Auto-focuses modal on open, traps focus within modal, restores focus on close
- **Keyboard Support**:
  - `ESC` - Close modal
  - `Tab` - Move to next focusable element (trapped within modal)
  - `Shift+Tab` - Move to previous focusable element
- **ARIA Attributes**: Proper `role="dialog"`, `aria-modal="true"`, and labeling
- **Screen Reader Support**: Announced when opened with clear semantic structure
- **Color Contrast**: All colors meet AAA contrast ratios (≥7:1 for text)

### Best Practices

1. **Always provide `ariaLabel`** - Required for screen readers
2. **Use `ariaLabelledBy`** when modal has visible heading
3. **Ensure focus order** - Tab order should be logical within modal
4. **Provide clear close actions** - Multiple ways to close (X button, ESC, cancel button)
5. **Keep it simple** - Don't nest modals if possible

## Styling

The modal uses BEM CSS naming and integrates with the theme system via CSS variables.

### CSS Custom Properties

You can customize the modal by overriding these CSS variables:

```scss
:root {
  --modal-backdrop-color: rgba(0, 0, 0, 0.5);
  --modal-backdrop-blur: 4px;
  --modal-width-sm: 400px;
  --modal-width-md: 600px;
  --modal-width-lg: 800px;
  --modal-width-xl: 1000px;
  --modal-sidebar-width: 480px;
}
```

### Theming

The modal automatically uses theme colors:

- `--color-surface` - Modal background
- `--color-text` - Text color
- `--color-text-secondary` - Secondary text color
- `--color-border` - Borders and dividers
- `--color-primary` - Focus outline

## Examples

### Confirmation Dialog

```typescript
async deleteItem(itemId: string) {
  const confirmed = await this.modalService.confirm({
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmVariant: 'danger',
  });

  if (confirmed) {
    await this.itemService.delete(itemId);
    this.showSuccess();
  }
}
```

### Form Modal

```html
<eb-modal [open]="isEditingUser()" size="lg" ariaLabel="Edit User Profile" (closed)="cancelEdit()">
  <div modal-header>
    <h2 id="edit-user-heading">Edit User Profile</h2>
  </div>

  <div modal-body>
    <form [formGroup]="userForm">
      <!-- Form fields -->
    </form>
  </div>

  <div modal-footer>
    <eb-button variant="secondary" ariaLabel="Cancel editing" (clicked)="cancelEdit()">
      Cancel
    </eb-button>
    <eb-button
      variant="primary"
      ariaLabel="Save changes"
      [disabled]="!userForm.valid"
      (clicked)="saveUser()"
    >
      Save Changes
    </eb-button>
  </div>
</eb-modal>
```

### Sidebar Filters

```html
<eb-modal
  [open]="showFilters()"
  variant="sidebar"
  ariaLabel="Filter options"
  (closed)="closeFilters()"
>
  <div modal-header>
    <h2>Filters</h2>
  </div>

  <div modal-body>
    <!-- Filter controls -->
  </div>

  <div modal-footer>
    <eb-button variant="secondary" ariaLabel="Clear all filters" (clicked)="clearFilters()">
      Clear All
    </eb-button>
    <eb-button variant="primary" ariaLabel="Apply filters" (clicked)="applyFilters()">
      Apply
    </eb-button>
  </div>
</eb-modal>
```

## Testing

The modal component includes comprehensive unit tests. To run tests:

```bash
npm test -- modal.component.spec.ts
```

### Coverage

- Statement coverage: >95%
- Branch coverage: >80%
- Function coverage: >95%
- Line coverage: >95%

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Related Components

- [ButtonComponent](../button/README.md) - For modal action buttons
- [CardComponent](../card/README.md) - Similar content projection pattern

## Change Log

### v1.0.0 (2025-11-26)

- Initial release
- WCAG 2.1 AAA compliant
- Full keyboard navigation
- Multiple variants and sizes
- ModalService for programmatic usage
