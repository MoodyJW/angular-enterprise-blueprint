# Icon Component

> **Last Updated**: December 24, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Accessible icon component wrapping ng-icons with size variants, color options, and full accessibility support.

## Features

- ✅ **Six Sizes**: Extra Small (xs), Small (sm), Medium (md), Large (lg), Extra Large (xl), 2XL (2xl)
- ✅ **Seven Colors**: Current, Primary, Secondary, Success, Warning, Error, Info
- ✅ **Spin Animation**: Built-in spinning animation for loading indicators
- ✅ **Decorative Mode**: Option to hide icons from screen readers
- ✅ **Type-Safe Icons**: Full TypeScript support with IconName type
- ✅ **Accessible**: WCAG 2.1 AAA compliant with ARIA support
- ✅ **Theme Integration**: Uses CSS variables for theming
- ✅ **Signal-based**: Modern Angular signals API

## Usage

### Basic Examples

```typescript
import { Component } from '@angular/core';
import { IconComponent } from '@shared/components';

@Component({
  selector: 'eb-example',
  standalone: true,
  imports: [IconComponent],
  template: `
    <!-- Simple icon -->
    <eb-icon name="heroHome" />

    <!-- With size and color -->
    <eb-icon name="heroCheck" size="lg" color="success" />

    <!-- Decorative icon (hidden from screen readers) -->
    <eb-icon name="heroStar" [decorative]="true" />

    <!-- Icon with label (accessible to screen readers) -->
    <eb-icon name="heroUser" ariaLabel="User profile" />

    <!-- Spinning icon for loading states -->
    <eb-icon name="heroArrowPath" [spin]="true" ariaLabel="Loading" />
  `,
})
export class ExampleComponent {}
```

### Using Type-Safe Icon Names

```typescript
import { Component } from '@angular/core';
import { IconComponent, ICON_NAMES } from '@shared/components';

@Component({
  selector: 'eb-example',
  standalone: true,
  imports: [IconComponent],
  template: `
    <eb-icon [name]="homeIcon" ariaLabel="Home" />
    <eb-icon [name]="settingsIcon" ariaLabel="Settings" />
  `,
})
export class ExampleComponent {
  readonly homeIcon = ICON_NAMES.HOME;
  readonly settingsIcon = ICON_NAMES.SETTINGS;
}
```

### Size Variants

```typescript
@Component({
  template: `
    <!-- Extra small (12px) -->
    <eb-icon name="heroStar" size="xs" ariaLabel="Rating" />

    <!-- Small (16px) -->
    <eb-icon name="heroStar" size="sm" ariaLabel="Rating" />

    <!-- Medium (20px) - default -->
    <eb-icon name="heroStar" size="md" ariaLabel="Rating" />

    <!-- Large (24px) -->
    <eb-icon name="heroStar" size="lg" ariaLabel="Rating" />

    <!-- Extra large (32px) -->
    <eb-icon name="heroStar" size="xl" ariaLabel="Rating" />

    <!-- 2x Extra large (40px) -->
    <eb-icon name="heroStar" size="2xl" ariaLabel="Rating" />
  `,
})
export class SizeExample {}
```

### Color Variants

```typescript
@Component({
  template: `
    <!-- Current color (inherits from parent) -->
    <eb-icon name="heroHeart" color="current" ariaLabel="Like" />

    <!-- Primary theme color -->
    <eb-icon name="heroHeart" color="primary" ariaLabel="Like" />

    <!-- Secondary theme color -->
    <eb-icon name="heroHeart" color="secondary" ariaLabel="Like" />

    <!-- Success/positive -->
    <eb-icon name="heroCheckCircle" color="success" ariaLabel="Success" />

    <!-- Warning/caution -->
    <eb-icon name="heroExclamationTriangle" color="warning" ariaLabel="Warning" />

    <!-- Error/danger -->
    <eb-icon name="heroXCircle" color="error" ariaLabel="Error" />

    <!-- Informational -->
    <eb-icon name="heroInformationCircle" color="info" ariaLabel="Info" />
  `,
})
export class ColorExample {}
```

### Loading Spinner

```typescript
@Component({
  template: `
    <button [disabled]="isLoading()">
      @if (isLoading()) {
        <eb-icon name="heroArrowPath" [spin]="true" ariaLabel="Loading" />
        Loading...
      } @else {
        <eb-icon name="heroCheck" [decorative]="true" />
        Submit
      }
    </button>
  `,
})
export class LoadingExample {
  isLoading = signal(false);
}
```

### Icon Button

```typescript
@Component({
  template: `
    <button type="button" aria-label="Delete item" class="icon-button">
      <eb-icon name="heroTrash" color="error" [decorative]="true" />
    </button>

    <button type="button" aria-label="Edit item" class="icon-button">
      <eb-icon name="heroPencil" [decorative]="true" />
    </button>

    <button type="button" aria-label="Share" class="icon-button">
      <eb-icon name="heroShare" [decorative]="true" />
    </button>
  `,
})
export class IconButtonExample {}
```

## Component API

### Inputs

| Input        | Type                                                                                   | Default      | Description                                               |
| ------------ | -------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------- |
| `name`       | `IconName`                                                                             | **REQUIRED** | Icon name from the icon registry                          |
| `size`       | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`                                        | `'md'`       | Size of the icon                                          |
| `color`      | `'current' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'current'`  | Color of the icon                                         |
| `decorative` | `boolean`                                                                              | `false`      | If true, icon is hidden from screen readers               |
| `ariaLabel`  | `string \| undefined`                                                                  | `undefined`  | ARIA label for accessibility (required if not decorative) |
| `spin`       | `boolean`                                                                              | `false`      | Whether the icon should spin continuously                 |

### Size Specifications

| Size  | Dimensions | rem Value |
| ----- | ---------- | --------- |
| `xs`  | 12px       | 0.75rem   |
| `sm`  | 16px       | 1rem      |
| `md`  | 20px       | 1.25rem   |
| `lg`  | 24px       | 1.5rem    |
| `xl`  | 32px       | 2rem      |
| `2xl` | 40px       | 2.5rem    |

## Available Icons

Icons are sourced from Heroicons (outline and solid variants) and Ionicons (brand logos). Use the `ICON_NAMES` constant for type-safe icon references:

### Navigation

- `ICON_NAMES.HOME` / `ICON_NAMES.HOME_SOLID`
- `ICON_NAMES.ARROW_LEFT` / `ARROW_RIGHT` / `ARROW_UP` / `ARROW_DOWN`
- `ICON_NAMES.CHEVRON_LEFT` / `CHEVRON_RIGHT` / `CHEVRON_UP` / `CHEVRON_DOWN`
- `ICON_NAMES.MENU` / `ICON_NAMES.CLOSE`

### User & Profile

- `ICON_NAMES.USER` / `ICON_NAMES.USER_SOLID`
- `ICON_NAMES.USER_GROUP` / `ICON_NAMES.USER_CIRCLE`

### Actions

- `ICON_NAMES.SEARCH` / `ICON_NAMES.SETTINGS`
- `ICON_NAMES.ADD` / `ICON_NAMES.REMOVE`
- `ICON_NAMES.EDIT` / `ICON_NAMES.DELETE`
- `ICON_NAMES.REFRESH` / `ICON_NAMES.DOWNLOAD`
- `ICON_NAMES.COPY` / `ICON_NAMES.SHARE`

### Feedback & Status

- `ICON_NAMES.SUCCESS` / `ICON_NAMES.SUCCESS_SOLID`
- `ICON_NAMES.ERROR` / `ICON_NAMES.ERROR_SOLID`
- `ICON_NAMES.WARNING` / `ICON_NAMES.WARNING_SOLID`
- `ICON_NAMES.INFO` / `ICON_NAMES.INFO_SOLID`

### Brand Logos

- `ICON_NAMES.GITHUB`
- `ICON_NAMES.LINKEDIN`

See `icons.constants.ts` for the complete list of available icons.

## Accessibility

### Decorative vs Meaningful Icons

Icons fall into two categories:

1. **Decorative icons**: Purely visual, add no information
2. **Meaningful icons**: Convey information to users

```html
<!-- Decorative: Icon next to text that already describes the action -->
<button>
  <eb-icon name="heroTrash" [decorative]="true" />
  Delete
</button>

<!-- Meaningful: Icon-only button needs aria-label -->
<button aria-label="Delete item">
  <eb-icon name="heroTrash" [decorative]="true" />
</button>

<!-- Meaningful: Standalone icon needs ariaLabel -->
<eb-icon name="heroCheckCircle" color="success" ariaLabel="Completed" />
```

### Best Practices

1. **Always provide `ariaLabel`** when the icon conveys meaning
2. **Use `[decorative]="true"`** when the icon is purely visual
3. **For icon-only buttons**, put the `aria-label` on the button, not the icon
4. **Avoid redundant labels** - don't repeat text that's already visible

```html
<!-- Good: aria-label on button, decorative icon -->
<button aria-label="Close dialog">
  <eb-icon name="heroXMark" [decorative]="true" />
</button>

<!-- Good: Standalone icon with meaning -->
<eb-icon name="heroExclamationTriangle" color="warning" ariaLabel="Warning: Form has errors" />

<!-- Bad: Redundant label -->
<button>
  <eb-icon name="heroTrash" ariaLabel="Delete" />
  <!-- Redundant! -->
  Delete
</button>
```

### Color Contrast

All icon color variants meet WCAG 2.1 AAA contrast requirements (7:1 minimum).

## Styling

The component uses BEM methodology and integrates with the theme system:

```scss
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  // Size variants
  &--xs {
    width: 0.75rem;
    height: 0.75rem;
  }
  &--sm {
    width: 1rem;
    height: 1rem;
  }
  &--md {
    width: 1.25rem;
    height: 1.25rem;
  }
  &--lg {
    width: 1.5rem;
    height: 1.5rem;
  }
  &--xl {
    width: 2rem;
    height: 2rem;
  }
  &--2xl {
    width: 2.5rem;
    height: 2.5rem;
  }

  // Color variants
  &--primary {
    color: var(--color-primary);
  }
  &--secondary {
    color: var(--color-text-secondary);
  }
  &--success {
    color: var(--color-success);
  }
  &--warning {
    color: var(--color-warning);
  }
  &--error {
    color: var(--color-error);
  }
  &--info {
    color: var(--color-info);
  }

  // Spin animation
  &--spin {
    animation: icon-spin 1s linear infinite;
  }
}

@keyframes icon-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

## Testing

Comprehensive unit tests are provided in `icon.component.spec.ts`.

Run tests:

```bash
npm test -- icon.component
```

## Storybook

View the component in Storybook:

```bash
npm run storybook
```

Navigate to `Shared/Icon` to see all variants and examples.

## Architecture

```
icon/
├── icon.component.ts              # Main icon component
├── icon.component.html            # Template
├── icon.component.scss            # Styles
├── icon.component.spec.ts         # Unit tests
├── icon.component.stories.ts      # Storybook stories
├── index.ts                       # Barrel export
└── README.md                      # This file
```

## Dependencies

- `@angular/core`: Core Angular functionality
- `@ng-icons/core`: Icon rendering library
- `@ng-icons/heroicons`: Heroicons icon set
- `@ng-icons/ionicons`: Ionicons icon set (for brand logos)

## Common Use Cases

### Navigation Icon

```html
<a routerLink="/home">
  <eb-icon name="heroHome" size="lg" [decorative]="true" />
  Home
</a>
```

### Status Indicator

```html
<span class="status">
  <eb-icon name="heroCheckCircle" color="success" ariaLabel="Active" />
  Active
</span>
```

### Social Links

```html
<a href="https://github.com/user" aria-label="GitHub Profile">
  <eb-icon name="ionLogoGithub" size="xl" [decorative]="true" />
</a>
<a href="https://linkedin.com/in/user" aria-label="LinkedIn Profile">
  <eb-icon name="ionLogoLinkedin" size="xl" [decorative]="true" />
</a>
```

### Form Validation

```html
@if (field.valid) {
<eb-icon name="heroCheckCircle" color="success" size="sm" ariaLabel="Valid" />
} @else if (field.invalid && field.touched) {
<eb-icon name="heroXCircle" color="error" size="sm" ariaLabel="Invalid" />
}
```

### Loading State

```html
<button [disabled]="loading()">
  @if (loading()) {
  <eb-icon name="heroArrowPath" [spin]="true" [decorative]="true" />
  } {{ loading() ? 'Saving...' : 'Save' }}
</button>
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

Part of the Angular Enterprise Blueprint project.
