# Breadcrumb Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Accessible breadcrumb navigation component following WAI-ARIA breadcrumb pattern for showing current location in site hierarchy.

## Features

- ✅ **Four Variants**: Default, Slash, Chevron, Arrow separators
- ✅ **Three Sizes**: Small, Medium, Large
- ✅ **Icon Support**: Optional icons for breadcrumb items
- ✅ **Router Integration**: Angular Router support for navigation
- ✅ **Collapsing**: Optional collapsing with max items limit
- ✅ **Click Events**: Emits events on item clicks
- ✅ **Accessible**: WCAG 2.1 AAA compliant, follows WAI-ARIA breadcrumb pattern
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Theme Integration**: Uses CSS variables
- ✅ **Signal-based**: Modern Angular signals API

## Usage

### Basic Examples

```typescript
import { Component } from '@angular/core';
import { BreadcrumbComponent, type BreadcrumbItem } from '@shared/components';
import { ICON_NAMES } from '@shared/constants';

@Component({
  selector: 'eb-example',
  standalone: true,
  imports: [BreadcrumbComponent],
  template: `
    <!-- Basic breadcrumb -->
    <eb-breadcrumb [items]="breadcrumbs" ariaLabel="Breadcrumb navigation" />

    <!-- With chevron separator -->
    <eb-breadcrumb [items]="breadcrumbs" variant="chevron" ariaLabel="Breadcrumb" />

    <!-- With slash separator -->
    <eb-breadcrumb [items]="breadcrumbs" variant="slash" ariaLabel="Breadcrumb" />

    <!-- With arrow separator -->
    <eb-breadcrumb [items]="breadcrumbs" variant="arrow" ariaLabel="Breadcrumb" />

    <!-- Large size -->
    <eb-breadcrumb [items]="breadcrumbs" size="lg" ariaLabel="Breadcrumb" />

    <!-- Small size -->
    <eb-breadcrumb [items]="breadcrumbs" size="sm" ariaLabel="Breadcrumb" />
  `,
})
export class ExampleComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Projects', route: '/projects' },
    { label: 'Portfolio Website', current: true },
  ];
}
```

### With Icons

```typescript
@Component({
  template: `
    <eb-breadcrumb
      [items]="breadcrumbsWithIcons"
      [showIcons]="true"
      variant="chevron"
      ariaLabel="Breadcrumb navigation"
    />
  `,
})
export class IconsExample {
  breadcrumbsWithIcons: BreadcrumbItem[] = [
    {
      label: 'Home',
      route: '/',
      icon: ICON_NAMES.HOME,
    },
    {
      label: 'Products',
      route: '/products',
      icon: ICON_NAMES.SHOPPING_BAG,
    },
    {
      label: 'Electronics',
      route: '/products/electronics',
      icon: ICON_NAMES.DEVICE_PHONE_MOBILE,
    },
    {
      label: 'Laptop',
      current: true,
    },
  ];
}
```

### With Collapsing

```typescript
@Component({
  template: `
    <!-- Show only first and last 2 items, collapse middle -->
    <eb-breadcrumb [items]="longBreadcrumbs" [maxItems]="3" ariaLabel="Breadcrumb" />
  `,
})
export class CollapsingExample {
  longBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Category 1', route: '/cat1' },
    { label: 'Category 2', route: '/cat1/cat2' },
    { label: 'Category 3', route: '/cat1/cat2/cat3' },
    { label: 'Category 4', route: '/cat1/cat2/cat3/cat4' },
    { label: 'Product', current: true },
  ];
  // Renders: Home > ... > Category 4 > Product
}
```

### With Click Events

```typescript
@Component({
  template: `
    <eb-breadcrumb
      [items]="breadcrumbs"
      ariaLabel="Breadcrumb"
      (itemClicked)="handleBreadcrumbClick($event)"
    />
  `,
})
export class ClickEventExample {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Users', route: '/users' },
    { label: 'Profile', current: true },
  ];

  handleBreadcrumbClick(item: BreadcrumbItem) {
    console.log('Clicked breadcrumb:', item);
    // Custom navigation logic if needed
    // (Angular Router will still handle route navigation)
  }
}
```

### With Query Params

```typescript
@Component({
  template: ` <eb-breadcrumb [items]="breadcrumbsWithParams" ariaLabel="Breadcrumb" /> `,
})
export class QueryParamsExample {
  breadcrumbsWithParams: BreadcrumbItem[] = [
    { label: 'Products', route: '/products' },
    {
      label: 'Search Results',
      route: '/products/search',
      queryParams: { q: 'laptop', category: 'electronics' },
    },
    { label: 'Item Details', current: true },
  ];
}
```

## Component API

### Inputs

| Input       | Type                                           | Default                   | Description                                                                         |
| ----------- | ---------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------- |
| `items`     | `BreadcrumbItem[]`                             | **REQUIRED**              | Array of breadcrumb items                                                           |
| `variant`   | `'default' \| 'slash' \| 'chevron' \| 'arrow'` | `'default'`               | Visual variant (separator style)                                                    |
| `size`      | `'sm' \| 'md' \| 'lg'`                         | `'md'`                    | Size of text and icons                                                              |
| `showIcons` | `boolean`                                      | `true`                    | Whether to show icons for items that have them                                      |
| `maxItems`  | `number`                                       | `0`                       | Max items before collapsing (0 = no collapsing)                                     |
| `ariaLabel` | `string`                                       | `'Breadcrumb navigation'` | ARIA label for navigation landmark. Default provided; can be customized for context |

### Outputs

| Output        | Type                           | Description                               |
| ------------- | ------------------------------ | ----------------------------------------- |
| `itemClicked` | `EventEmitter<BreadcrumbItem>` | Emitted when a breadcrumb item is clicked |

### BreadcrumbItem Interface

```typescript
interface BreadcrumbItem {
  label: string; // Display label (required)
  route?: string; // Optional route path for navigation
  icon?: IconName; // Optional icon
  queryParams?: Record<string, string>; // Optional query parameters
  fragment?: string; // Optional fragment
  current?: boolean; // Whether this is the current page
}
```

### Size Specifications

| Size | Font Size | Icon Size |
| ---- | --------- | --------- |
| `sm` | 14px      | 16px      |
| `md` | 16px      | 18px      |
| `lg` | 18px      | 20px      |

## Separator Variants

| Variant   | Separator          |
| --------- | ------------------ |
| `default` | `›` (text)         |
| `slash`   | `/` (text)         |
| `chevron` | Chevron right icon |
| `arrow`   | Arrow right icon   |

## Accessibility

### WAI-ARIA Pattern

Follows the WAI-ARIA breadcrumb pattern:

- `<nav aria-label="Breadcrumb navigation">` (default label provided)
- `<ol>` list structure
- Current page marked with `aria-current="page"`
- Links are keyboard accessible

**ARIA Label:** The component provides a default `ariaLabel` of "Breadcrumb navigation". You can customize it for specific contexts:

```html
<!-- Default: Uses "Breadcrumb navigation" -->
<eb-breadcrumb [items]="items" />

<!-- Custom: Provide specific context -->
<eb-breadcrumb [items]="items" ariaLabel="Documentation navigation path" />
```

### Screen Reader Support

- Navigation landmark announced
- Each breadcrumb item announced
- Current page identified
- Separators hidden from screen readers (`aria-hidden="true"`)

### Keyboard Navigation

- **Tab**: Navigate through breadcrumb links
- **Enter**: Activate link
- **Shift+Tab**: Navigate backwards

## Styling

Uses BEM methodology with theme integration:

```scss
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  list-style: none;
  padding: 0;
  margin: 0;

  &__item {
    display: flex;
    align-items: center;
    gap: var(--space-1);

    a {
      color: var(--color-text-secondary);
      text-decoration: none;

      &:hover {
        color: var(--color-primary);
        text-decoration: underline;
      }

      &:focus-visible {
        outline: 2px solid var(--color-focus-ring);
        outline-offset: 2px;
      }
    }

    &--current {
      color: var(--color-text);
      font-weight: var(--font-weight-medium);
    }
  }

  &__separator {
    color: var(--color-text-muted);
    user-select: none;
  }
}
```

## Common Patterns

### Standard Page Breadcrumb

```html
<eb-breadcrumb
  [items]="[
    { label: 'Home', route: '/' },
    { label: 'About', current: true }
  ]"
  ariaLabel="Page navigation"
/>
```

### E-commerce Product

```html
<eb-breadcrumb
  [items]="[
    { label: 'Home', route: '/', icon: ICON_NAMES.HOME },
    { label: 'Electronics', route: '/electronics' },
    { label: 'Laptops', route: '/electronics/laptops' },
    { label: 'MacBook Pro', current: true }
  ]"
  variant="chevron"
  ariaLabel="Product navigation"
/>
```

### Documentation

```html
<eb-breadcrumb
  [items]="[
    { label: 'Docs', route: '/docs' },
    { label: 'Components', route: '/docs/components' },
    { label: 'Breadcrumb', current: true }
  ]"
  variant="slash"
  size="sm"
  ariaLabel="Documentation navigation"
/>
```

## Testing

Run tests:

```bash
npm test -- breadcrumb.component
```

## Architecture

```
breadcrumb/
├── breadcrumb.component.ts
├── breadcrumb.component.html
├── breadcrumb.component.scss
├── breadcrumb.component.spec.ts
├── breadcrumb.component.stories.ts
├── index.ts
└── README.md
```

## Dependencies

- `@angular/common`: CommonModule
- `@angular/router`: RouterModule for navigation
- `@angular/core`: Core functionality
- `icon`: Icon component for separators and item icons

## Best Practices

1. **Current page**: Always mark the current page with `current: true`
2. **Don't link current**: Current page should not be clickable
3. **Home icon**: Consider adding a home icon to the first item
4. **Descriptive labels**: Use clear, concise labels
5. **Max items**: Use collapsing for deep hierarchies (maxItems: 3-4)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Part of the MoodyJW Portfolio project.
