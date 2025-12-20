# Stack Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Layout component for consistent vertical or horizontal spacing between child elements with flexible alignment options.

## Features

- ✅ **Nine Spacing Sizes**: None, XS, SM, MD, LG, XL, 2XL, 3XL, 4XL
- ✅ **Two Directions**: Vertical (default) and Horizontal
- ✅ **Alignment Options**: Start, Center, End, Stretch
- ✅ **Distribution**: Space-between, Space-around, Space-evenly
- ✅ **Dividers**: Optional dividers between items
- ✅ **Wrapping**: Horizontal stacks can wrap
- ✅ **Inline Mode**: Vertical stacks can be inline
- ✅ **Accessible**: Semantic HTML with ARIA support
- ✅ **Theme Integration**: Uses CSS variables
- ✅ **Signal-based**: Modern Angular signals API

## Usage

### Basic Examples

```typescript
import { Component } from '@angular/core';
import { StackComponent } from '@shared/components';

@Component({
  selector: 'eb-example',
  standalone: true,
  imports: [StackComponent],
  template: `
    <!-- Vertical stack with medium spacing (default) -->
    <eb-stack spacing="md">
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </eb-stack>

    <!-- Horizontal stack with large spacing -->
    <eb-stack direction="horizontal" spacing="lg">
      <button>Cancel</button>
      <button>Save</button>
    </eb-stack>

    <!-- Centered vertical stack -->
    <eb-stack spacing="xl" align="center">
      <h1>Title</h1>
      <p>Subtitle</p>
      <button>Action</button>
    </eb-stack>

    <!-- Stack with dividers -->
    <eb-stack spacing="md" [divider]="true">
      <div>Section 1</div>
      <div>Section 2</div>
      <div>Section 3</div>
    </eb-stack>

    <!-- Horizontal stack with wrapping -->
    <eb-stack direction="horizontal" spacing="sm" [wrap]="true">
      <span class="tag">Tag 1</span>
      <span class="tag">Tag 2</span>
      <span class="tag">Tag 3</span>
      <span class="tag">Tag 4</span>
    </eb-stack>
  `,
})
export class ExampleComponent {}
```

### Form Layout

```typescript
@Component({
  template: `
    <eb-stack spacing="lg">
      <h2>Sign Up</h2>

      <eb-stack spacing="md">
        <eb-input label="Email" ariaLabel="Email" />
        <eb-input label="Password" type="password" ariaLabel="Password" />
        <eb-input label="Confirm Password" type="password" ariaLabel="Confirm password" />
      </eb-stack>

      <eb-stack direction="horizontal" spacing="md" justify="end">
        <eb-button variant="ghost" ariaLabel="Cancel">Cancel</eb-button>
        <eb-button variant="primary" ariaLabel="Sign up">Sign Up</eb-button>
      </eb-stack>
    </eb-stack>
  `,
})
export class FormLayoutExample {}
```

### Button Groups

```typescript
@Component({
  template: `
    <!-- Horizontal button group -->
    <eb-stack direction="horizontal" spacing="sm">
      <eb-button variant="secondary" ariaLabel="Previous">Previous</eb-button>
      <eb-button variant="primary" ariaLabel="Next">Next</eb-button>
    </eb-stack>

    <!-- Centered button group -->
    <eb-stack direction="horizontal" spacing="md" justify="center">
      <eb-button ariaLabel="Action 1">Action 1</eb-button>
      <eb-button ariaLabel="Action 2">Action 2</eb-button>
      <eb-button ariaLabel="Action 3">Action 3</eb-button>
    </eb-stack>

    <!-- Space-between buttons -->
    <eb-stack direction="horizontal" justify="space-between" [fullWidth]="true">
      <eb-button ariaLabel="Back">Back</eb-button>
      <eb-button ariaLabel="Continue">Continue</eb-button>
    </eb-stack>
  `,
})
export class ButtonGroupExample {}
```

### Card Content

```typescript
@Component({
  template: `
    <eb-card>
      <eb-stack spacing="lg">
        <eb-stack spacing="sm">
          <h3>Card Title</h3>
          <p class="meta">Subtitle or metadata</p>
        </eb-stack>

        <p>Card body content with natural spacing...</p>

        <eb-stack direction="horizontal" spacing="sm" justify="end">
          <eb-button variant="ghost" ariaLabel="Cancel">Cancel</eb-button>
          <eb-button variant="primary" ariaLabel="Save">Save</eb-button>
        </eb-stack>
      </eb-stack>
    </eb-card>
  `,
})
export class CardContentExample {}
```

### Navigation Items

```typescript
@Component({
  template: `
    <!-- Vertical navigation -->
    <eb-stack spacing="xs" [divider]="true">
      <a href="/home">Home</a>
      <a href="/about">About</a>
      <a href="/services">Services</a>
      <a href="/contact">Contact</a>
    </eb-stack>

    <!-- Horizontal navigation -->
    <eb-stack direction="horizontal" spacing="lg">
      <a href="/home">Home</a>
      <a href="/about">About</a>
      <a href="/services">Services</a>
      <a href="/contact">Contact</a>
    </eb-stack>
  `,
})
export class NavigationExample {}
```

## Component API

### Inputs

| Input            | Type                                                                                               | Default      | Description                                |
| ---------------- | -------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------ |
| `spacing`        | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl'`                        | `'md'`       | Spacing between stack items                |
| `direction`      | `'vertical' \| 'horizontal'`                                                                       | `'vertical'` | Stack direction                            |
| `align`          | `'start' \| 'center' \| 'end' \| 'stretch'`                                                        | `'stretch'`  | Alignment perpendicular to stack direction |
| `justify`        | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around' \| 'space-evenly' \| undefined` | `undefined`  | Distribution along stack direction         |
| `fullWidth`      | `boolean`                                                                                          | `false`      | Whether stack takes full width/height      |
| `wrap`           | `boolean`                                                                                          | `false`      | Whether to wrap items (horizontal only)    |
| `inline`         | `boolean`                                                                                          | `false`      | Whether items are inline (vertical only)   |
| `divider`        | `boolean`                                                                                          | `false`      | Add divider between items                  |
| `role`           | `string`                                                                                           | `'list'`     | ARIA role for the stack                    |
| `ariaLabel`      | `string \| undefined`                                                                              | `undefined`  | ARIA label                                 |
| `ariaLabelledBy` | `string \| undefined`                                                                              | `undefined`  | ID of labeling element                     |

### Spacing Specifications

| Size   | Spacing |
| ------ | ------- |
| `none` | 0       |
| `xs`   | 4px     |
| `sm`   | 8px     |
| `md`   | 16px    |
| `lg`   | 24px    |
| `xl`   | 32px    |
| `2xl`  | 48px    |
| `3xl`  | 64px    |
| `4xl`  | 96px    |

## Alignment Behavior

### Vertical Stack

- `align="start"`: Items aligned to left
- `align="center"`: Items centered horizontally
- `align="end"`: Items aligned to right
- `align="stretch"`: Items fill width (default)

### Horizontal Stack

- `align="start"`: Items aligned to top
- `align="center"`: Items centered vertically
- `align="end"`: Items aligned to bottom
- `align="stretch"`: Items fill height (default)

## Distribution (Justify)

- `"start"`: Pack items to start
- `"center"`: Center items
- `"end"`: Pack items to end
- `"space-between"`: Space between items, flush edges
- `"space-around"`: Space around items
- `"space-evenly"`: Even space distribution

## Styling

Uses flexbox for layout:

```scss
.stack {
  display: flex;

  &--vertical {
    flex-direction: column;
    gap: var(--spacing);
  }

  &--horizontal {
    flex-direction: row;
    gap: var(--spacing);
  }

  &--wrap {
    flex-wrap: wrap;
  }

  &--divider {
    > * + * {
      border-top: 1px solid var(--color-border); // vertical
      border-left: 1px solid var(--color-border); // horizontal
    }
  }
}
```

## Common Patterns

### Page Layout

```html
<eb-stack spacing="2xl">
  <header>Header content</header>
  <main>Main content</main>
  <footer>Footer content</footer>
</eb-stack>
```

### Form Section

```html
<eb-stack spacing="lg">
  <h2>Personal Information</h2>
  <eb-stack spacing="md">
    <eb-input label="Name" />
    <eb-input label="Email" />
    <eb-input label="Phone" />
  </eb-stack>
</eb-stack>
```

### Action Bar

```html
<eb-stack direction="horizontal" spacing="sm" justify="space-between" align="center">
  <h2>Page Title</h2>
  <eb-button ariaLabel="Add new">Add New</eb-button>
</eb-stack>
```

## Testing

Run tests:

```bash
npm test -- stack.component
```

## Architecture

```
stack/
├── stack.component.ts
├── stack.component.html
├── stack.component.scss
├── stack.component.spec.ts
├── stack.component.stories.ts
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
