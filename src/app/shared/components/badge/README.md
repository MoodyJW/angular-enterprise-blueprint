# Badge Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Accessible badge component for displaying item counts and status indicators that overlay content.

## Features

- ✅ **Six Variants**: Primary, Secondary, Success, Warning, Error, Info
- ✅ **Three Sizes**: Small (sm), Medium (md), Large (lg)
- ✅ **Four Positions**: Top-right, Top-left, Bottom-right, Bottom-left
- ✅ **Dot Mode**: Minimal notification indicator without count
- ✅ **Max Count**: Automatically shows "99+" for large numbers
- ✅ **Auto Hide**: Optional hiding when count is zero
- ✅ **Accessible**: WCAG 2.1 AAA compliant with ARIA live regions
- ✅ **Theme Integration**: Uses CSS variables for theming
- ✅ **Signal-based**: Modern Angular signals API

## Usage

### Basic Examples

```typescript
import { Component, signal } from '@angular/core';
import { BadgeComponent } from '@shared/components';

@Component({
  selector: 'eb-example',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <!-- Badge with count on a button -->
    <div style="position: relative; display: inline-block;">
      <button>Messages</button>
      <eb-badge [content]="messageCount()" ariaLabel="{{ messageCount() }} unread messages" />
    </div>

    <!-- Dot badge (no content) -->
    <div style="position: relative; display: inline-block;">
      <button>Notifications</button>
      <eb-badge [dot]="true" ariaLabel="Has notifications" />
    </div>

    <!-- Badge with variant and position -->
    <div style="position: relative; display: inline-block;">
      <span>Cart</span>
      <eb-badge
        [content]="cartItems()"
        variant="error"
        position="top-right"
        ariaLabel="{{ cartItems() }} items in cart"
      />
    </div>

    <!-- Large badge with custom max -->
    <div style="position: relative; display: inline-block;">
      <button>Inbox</button>
      <eb-badge
        [content]="emailCount()"
        [max]="999"
        size="lg"
        ariaLabel="{{ emailCount() }} unread emails"
      />
    </div>

    <!-- String content -->
    <div style="position: relative; display: inline-block;">
      <button>Status</button>
      <eb-badge content="NEW" variant="success" ariaLabel="New status available" />
    </div>
  `,
})
export class ExampleComponent {
  messageCount = signal(5);
  cartItems = signal(12);
  emailCount = signal(1234);
}
```

### Different Variants

```typescript
@Component({
  template: `
    <!-- Success badge -->
    <div class="badge-demo">
      <button>Active</button>
      <eb-badge [content]="3" variant="success" ariaLabel="3 active items" />
    </div>

    <!-- Warning badge -->
    <div class="badge-demo">
      <button>Pending</button>
      <eb-badge [content]="8" variant="warning" ariaLabel="8 pending items" />
    </div>

    <!-- Error badge -->
    <div class="badge-demo">
      <button>Errors</button>
      <eb-badge [content]="2" variant="error" ariaLabel="2 errors" />
    </div>

    <!-- Info badge -->
    <div class="badge-demo">
      <button>Info</button>
      <eb-badge [content]="15" variant="info" ariaLabel="15 information items" />
    </div>
  `,
  styles: [
    `
      .badge-demo {
        position: relative;
        display: inline-block;
        margin: 0.5rem;
      }
    `,
  ],
})
export class VariantExample {}
```

### Position Examples

```typescript
@Component({
  template: `
    <!-- Top-right (default) -->
    <div class="badge-demo">
      <button>Top Right</button>
      <eb-badge [content]="5" position="top-right" ariaLabel="5 items" />
    </div>

    <!-- Top-left -->
    <div class="badge-demo">
      <button>Top Left</button>
      <eb-badge [content]="5" position="top-left" ariaLabel="5 items" />
    </div>

    <!-- Bottom-right -->
    <div class="badge-demo">
      <button>Bottom Right</button>
      <eb-badge [content]="5" position="bottom-right" ariaLabel="5 items" />
    </div>

    <!-- Bottom-left -->
    <div class="badge-demo">
      <button>Bottom Left</button>
      <eb-badge [content]="5" position="bottom-left" ariaLabel="5 items" />
    </div>
  `,
})
export class PositionExample {}
```

### Dynamic Updates

```typescript
@Component({
  template: `
    <div style="position: relative; display: inline-block;">
      <button (click)="increment()">Add Item</button>
      <eb-badge
        [content]="count()"
        variant="primary"
        [ariaLabel]="count() + ' items'"
        ariaLive="polite"
      />
    </div>
  `,
})
export class DynamicExample {
  count = signal(0);

  increment() {
    this.count.update((c) => c + 1);
  }
}
```

## Component API

### Inputs

| Input             | Type                                                                      | Default       | Description                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `variant`         | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'`   | Visual variant of the badge                                                                                                      |
| `size`            | `'sm' \| 'md' \| 'lg'`                                                    | `'md'`        | Size of the badge                                                                                                                |
| `position`        | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'`            | `'top-right'` | Position of the badge relative to parent                                                                                         |
| `content`         | `string \| number \| undefined`                                           | `undefined`   | Content to display in the badge                                                                                                  |
| `max`             | `number`                                                                  | `99`          | Maximum number to display before showing "+"                                                                                     |
| `dot`             | `boolean`                                                                 | `false`       | Show badge as a dot (no content)                                                                                                 |
| `hideWhenZero`    | `boolean`                                                                 | `true`        | Hide badge when content is 0 or falsy                                                                                            |
| `ariaLabel`       | `string`                                                                  | **REQUIRED**  | ARIA label for the badge. Required for standalone badges without visible context to describe meaning (e.g., "5 unread messages") |
| `ariaDescribedBy` | `string \| undefined`                                                     | `undefined`   | ID of element that describes the badge                                                                                           |
| `ariaLive`        | `'off' \| 'polite' \| 'assertive'`                                        | `'polite'`    | Whether badge represents a live region that updates                                                                              |

### Size Specifications

| Size | Diameter | Font Size |
| ---- | -------- | --------- |
| `sm` | 16px     | 12px      |
| `md` | 20px     | 14px      |
| `lg` | 24px     | 16px      |

## Positioning

The badge uses `position: absolute` and requires the parent element to have `position: relative`:

```html
<div style="position: relative; display: inline-block;">
  <!-- Your content -->
  <button>Button</button>
  <!-- Badge will overlay this -->
  <eb-badge [content]="5" ariaLabel="5 notifications" />
</div>
```

## Accessibility

### ARIA Labels

The `ariaLabel` is **required** for standalone badges without visible context. It should describe the badge's meaning:

```html
<!-- Good: Descriptive label for standalone badge -->
<eb-badge [content]="5" ariaLabel="5 unread messages" />

<!-- Good: Badge overlaying button with text -->
<div style="position: relative;">
  <button>Messages</button>
  <eb-badge [content]="5" ariaLabel="5 unread messages" />
</div>

<!-- Bad: Generic label -->
<eb-badge [content]="5" ariaLabel="Badge" />
```

When a badge overlays an element with clear text (like a button labeled "Messages"), the ariaLabel provides additional context for screen reader users about the notification count.

### Live Regions

Use `ariaLive` to announce updates to screen readers:

- `'off'`: No announcements (default for static badges)
- `'polite'`: Announce when user is idle (default)
- `'assertive'`: Announce immediately (use sparingly)

```html
<!-- Announce count changes -->
<eb-badge [content]="count()" ariaLabel="{{ count() }} new items" ariaLive="polite" />
```

### Dot Mode

Dot badges should indicate presence, not count:

```html
<eb-badge [dot]="true" ariaLabel="Has new notifications" />
```

### Color Contrast

All badge variants meet WCAG 2.1 AAA contrast requirements (7:1 minimum).

## Styling

The component uses BEM methodology and integrates with the theme system:

```scss
.badge {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-half);
  font-weight: var(--font-weight-bold);
  line-height: 1;

  // Position variants
  &--top-right {
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
  }

  &--top-left {
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
  }

  // Color variants
  &--primary {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  &--error {
    background-color: var(--color-error);
    color: var(--color-on-error);
  }

  // Dot mode
  &--dot {
    width: 8px;
    height: 8px;
    padding: 0;
  }
}
```

## Testing

Comprehensive unit tests are provided in `badge.component.spec.ts`.

Run tests:

```bash
npm test -- badge.component
```

## Storybook

View the component in Storybook:

```bash
npm run storybook
```

Navigate to `Shared/Badge` to see all variants and examples.

## Architecture

```
badge/
├── badge.component.ts              # Main badge component
├── badge.component.html            # Template
├── badge.component.scss            # Styles
├── badge.component.spec.ts         # Unit tests
├── badge.component.stories.ts      # Storybook stories
├── index.ts                        # Barrel export
└── README.md                       # This file
```

## Dependencies

- `@angular/common`: CommonModule
- `@angular/core`: Core Angular functionality

## Common Use Cases

### Notification Badge

```html
<button style="position: relative;">
  <eb-icon name="heroBell" />
  <eb-badge
    [content]="notifications()"
    variant="error"
    size="sm"
    ariaLabel="{{ notifications() }} unread notifications"
  />
</button>
```

### Shopping Cart

```html
<a href="/cart" style="position: relative;">
  <eb-icon name="heroShoppingCart" />
  <eb-badge [content]="cartCount()" ariaLabel="{{ cartCount() }} items in cart" />
</a>
```

### Status Indicator

```html
<div style="position: relative;">
  <img src="avatar.jpg" alt="User avatar" />
  <eb-badge [dot]="true" variant="success" position="bottom-right" ariaLabel="Online" />
</div>
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

Part of the MoodyJW Portfolio project.
