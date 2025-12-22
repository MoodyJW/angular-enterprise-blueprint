# Card Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Flexible card container component with content projection slots for consistent layouts.

## Features

- ✅ **Four Variants**: Default, Elevated, Outlined, Filled
- ✅ **Four Padding Options**: None, Small, Medium, Large
- ✅ **Content Slots**: Header, Media, Body, Footer sections
- ✅ **Clickable Cards**: Optional interactive mode with click events
- ✅ **Hover Effects**: Configurable hover states
- ✅ **Full Width Option**: Expand to container width
- ✅ **Accessible**: WCAG 2.1 AAA compliant with proper ARIA attributes
- ✅ **Keyboard Navigation**: Full keyboard support for clickable cards
- ✅ **Theme Integration**: Uses CSS variables for theming
- ✅ **Signal-based**: Modern Angular signals API

## Usage

### Basic Examples

```typescript
import { Component } from '@angular/core';
import { CardComponent, ButtonComponent } from '@shared/components';

@Component({
  selector: 'eb-example',
  standalone: true,
  imports: [CardComponent, ButtonComponent],
  template: `
    <!-- Simple card -->
    <eb-card variant="default" padding="lg">
      <div card-header>
        <h3>Card Title</h3>
      </div>
      <div card-body>
        <p>Card content goes here.</p>
      </div>
    </eb-card>

    <!-- Card with all sections -->
    <eb-card variant="elevated" padding="md">
      <div card-header>
        <h3>Product Card</h3>
        <p>Subtitle or description</p>
      </div>

      <div card-media>
        <img src="product.jpg" alt="Product image" />
      </div>

      <div card-body>
        <p>Product description and details...</p>
      </div>

      <div card-footer>
        <eb-button variant="primary" ariaLabel="Add to cart"> Add to Cart </eb-button>
        <eb-button variant="secondary" ariaLabel="Learn more"> Learn More </eb-button>
      </div>
    </eb-card>

    <!-- Outlined card -->
    <eb-card variant="outlined">
      <div card-body>
        <p>Simple outlined card</p>
      </div>
    </eb-card>

    <!-- Filled card -->
    <eb-card variant="filled" padding="lg">
      <div card-body>
        <p>Card with background fill</p>
      </div>
    </eb-card>
  `,
})
export class ExampleComponent {}
```

### Clickable Cards

```typescript
@Component({
  template: `
    <eb-card
      variant="elevated"
      [clickable]="true"
      ariaLabel="View project details"
      (clicked)="handleCardClick()"
    >
      <div card-header>
        <h3>Project Name</h3>
      </div>
      <div card-body>
        <p>Click anywhere on this card to view details</p>
      </div>
    </eb-card>
  `,
})
export class ClickableExample {
  handleCardClick() {
    console.log('Card clicked!');
    // Navigate or perform action
  }
}
```

### Product Card

```typescript
@Component({
  template: `
    <eb-card variant="elevated" padding="none">
      <div card-media>
        <img
          src="product.jpg"
          alt="Product name"
          style="width: 100%; height: 200px; object-fit: cover;"
        />
      </div>

      <div card-body style="padding: 1rem;">
        <h3>Product Name</h3>
        <p class="price">$99.99</p>
        <p>Product description goes here...</p>
      </div>

      <div card-footer style="padding: 1rem; padding-top: 0;">
        <eb-button variant="primary" [fullWidth]="true" ariaLabel="Add to cart">
          Add to Cart
        </eb-button>
      </div>
    </eb-card>
  `,
})
export class ProductCardExample {}
```

### Blog Post Card

```typescript
@Component({
  template: `
    <eb-card
      variant="default"
      [clickable]="true"
      ariaLabel="Read blog post"
      (clicked)="navigateToPost()"
    >
      <div card-media>
        <img
          src="blog-cover.jpg"
          alt="Blog post cover"
          style="width: 100%; height: 200px; object-fit: cover;"
        />
      </div>

      <div card-body>
        <h3>Blog Post Title</h3>
        <p class="meta">Published on Jan 1, 2024 · 5 min read</p>
        <p>Excerpt of the blog post content...</p>
      </div>

      <div card-footer>
        <div class="tags">
          <span class="tag">Angular</span>
          <span class="tag">TypeScript</span>
        </div>
      </div>
    </eb-card>
  `,
})
export class BlogCardExample {
  navigateToPost() {
    // Navigate to full post
  }
}
```

### Profile Card

```typescript
@Component({
  template: `
    <eb-card variant="outlined" padding="lg">
      <div card-header style="text-align: center;">
        <img
          src="avatar.jpg"
          alt="User avatar"
          style="width: 80px; height: 80px; border-radius: var(--border-radius-half);"
        />
        <h3>John Doe</h3>
        <p>Software Engineer</p>
      </div>

      <div card-body>
        <p>Bio and description...</p>
      </div>

      <div card-footer>
        <eb-button variant="primary" [fullWidth]="true" ariaLabel="View profile">
          View Profile
        </eb-button>
      </div>
    </eb-card>
  `,
})
export class ProfileCardExample {}
```

## Component API

### Inputs

| Input             | Type                                                | Default     | Description                                               |
| ----------------- | --------------------------------------------------- | ----------- | --------------------------------------------------------- |
| `variant`         | `'default' \| 'elevated' \| 'outlined' \| 'filled'` | `'default'` | Visual variant of the card                                |
| `padding`         | `'none' \| 'sm' \| 'md' \| 'lg'`                    | `'md'`      | Padding size for card sections                            |
| `clickable`       | `boolean`                                           | `false`     | Whether the entire card is clickable                      |
| `hoverable`       | `boolean`                                           | `true`      | Whether the card shows hover effects                      |
| `fullWidth`       | `boolean`                                           | `false`     | Whether card takes full width of container                |
| `ariaLabel`       | `string \| undefined`                               | `undefined` | ARIA label for the card (recommended for clickable cards) |
| `ariaLabelledBy`  | `string \| undefined`                               | `undefined` | ID of element that labels the card                        |
| `ariaDescribedBy` | `string \| undefined`                               | `undefined` | ID of element that describes the card                     |
| `role`            | `string \| undefined`                               | `undefined` | ARIA role override (defaults to 'article' or 'button')    |

### Outputs

| Output    | Type                       | Description                              |
| --------- | -------------------------- | ---------------------------------------- |
| `clicked` | `EventEmitter<MouseEvent>` | Emitted when a clickable card is clicked |

### Content Projection Slots

Use these attributes to project content into specific card sections:

| Slot   | Attribute     | Description                      |
| ------ | ------------- | -------------------------------- |
| Header | `card-header` | Title and metadata section       |
| Media  | `card-media`  | Images or media content          |
| Body   | `card-body`   | Main content area                |
| Footer | `card-footer` | Actions or supplementary content |

### Padding Specifications

| Padding | Header/Footer | Body |
| ------- | ------------- | ---- |
| `none`  | 0             | 0    |
| `sm`    | 12px          | 12px |
| `md`    | 16px          | 24px |
| `lg`    | 24px          | 32px |

## Variants

### Default

- Subtle elevation with light shadow
- Use for most card layouts

### Elevated

- Prominent shadow for emphasis
- Use for important content or hover states

### Outlined

- Flat with defined border
- Use for secondary content or lists

### Filled

- Background color fill
- Use for sections that need visual separation

## Accessibility

### Clickable Cards

When `clickable` is true:

- Card becomes focusable
- Role changes to `button`
- Click and keyboard events (Enter/Space) work
- **MUST** provide `ariaLabel` describing the action

```html
<!-- Good: Descriptive label -->
<eb-card
  [clickable]="true"
  ariaLabel="View project details for Portfolio Website"
  (clicked)="viewProject()"
>
  <!-- content -->
</eb-card>

<!-- Bad: Missing label -->
<eb-card [clickable]="true" (clicked)="viewProject()">
  <!-- content -->
</eb-card>
```

### Non-clickable Cards

For regular cards:

- Default role is `article`
- Use `ariaLabelledBy` to associate with heading
- Not focusable

### Keyboard Support

Clickable cards support:

- **Enter**: Activates the card
- **Space**: Activates the card
- **Tab**: Moves focus to/from the card

### Focus Indicators

Clickable cards have clear focus indicators meeting WCAG AAA requirements.

## Styling

The component uses BEM methodology and integrates with the theme system:

```scss
.card {
  border-radius: var(--border-radius-lg);
  background-color: var(--color-surface);
  transition: all var(--transition-normal);

  // Variant styles
  &--default {
    box-shadow: var(--shadow-sm);
  }

  &--elevated {
    box-shadow: var(--shadow-lg);
  }

  &--outlined {
    border: 1px solid var(--color-border);
  }

  &--filled {
    background-color: var(--color-surface-variant);
  }

  // State modifiers
  &--clickable {
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);
    }

    &:focus-visible {
      outline: 2px solid var(--color-focus-ring);
      outline-offset: 2px;
    }
  }
}
```

## Testing

Comprehensive unit tests are provided in `card.component.spec.ts`.

Run tests:

```bash
npm test -- card.component
```

## Storybook

View the component in Storybook:

```bash
npm run storybook
```

Navigate to `Shared/Card` to see all variants and examples.

## Architecture

```
card/
├── card.component.ts              # Main card component
├── card.component.html            # Template
├── card.component.scss            # Styles
├── card.component.spec.ts         # Unit tests
├── card.component.stories.ts      # Storybook stories
├── index.ts                       # Barrel export
└── README.md                      # This file
```

## Dependencies

- `@angular/common`: CommonModule
- `@angular/core`: Core Angular functionality

## Best Practices

1. **Use semantic sections**: Utilize card-header, card-body, card-footer slots appropriately
2. **Images in card-media**: Place images in the media slot for proper spacing
3. **Clickable vs interactive children**: Avoid putting clickable elements inside clickable cards
4. **Padding consistency**: Use padding variants consistently across similar cards
5. **Accessibility**: Always provide `ariaLabel` for clickable cards

## Common Patterns

### Grid of Cards

```html
<eb-grid [cols]="1" [colsMd]="2" [colsLg]="3" gap="lg">
  <eb-card *ngFor="let item of items" variant="elevated">
    <!-- card content -->
  </eb-card>
</eb-grid>
```

### Card with Actions

```html
<eb-card>
  <div card-body>
    <!-- content -->
  </div>
  <div card-footer style="display: flex; gap: 0.5rem; justify-content: flex-end;">
    <eb-button variant="ghost" ariaLabel="Cancel">Cancel</eb-button>
    <eb-button variant="primary" ariaLabel="Save">Save</eb-button>
  </div>
</eb-card>
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

Part of the MoodyJW Portfolio project.
