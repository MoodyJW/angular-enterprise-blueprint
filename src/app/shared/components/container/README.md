# Container Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Layout container component for consistent content width management and centering across the application.

## Features

- ✅ **Five Max Widths**: Small (600px), Medium (900px), Large (1200px), XL (1400px), Full (100%)
- ✅ **Four Padding Options**: None, Small, Medium, Large
- ✅ **Auto Centering**: Optional horizontal centering
- ✅ **Accessible**: Semantic HTML with ARIA region support
- ✅ **Theme Integration**: Uses CSS variables for consistency
- ✅ **Signal-based**: Modern Angular signals API

## Usage

### Basic Examples

```typescript
import { Component } from '@angular/core';
import { ContainerComponent } from '@shared/components';

@Component({
  selector: 'eb-example',
  imports: [ContainerComponent],
  template: `
    <!-- Standard page container -->
    <eb-container maxWidth="lg" padding="md">
      <h1>Page Title</h1>
      <p>Page content with standard width and padding...</p>
    </eb-container>

    <!-- Narrow content (forms, articles) -->
    <eb-container maxWidth="sm">
      <form>
        <h2>Login</h2>
        <!-- Form fields -->
      </form>
    </eb-container>

    <!-- Wide content (dashboards, tables) -->
    <eb-container maxWidth="xl" padding="lg">
      <h2>Dashboard</h2>
      <!-- Wide content -->
    </eb-container>

    <!-- Full-bleed section -->
    <eb-container maxWidth="full" padding="none">
      <img src="hero.jpg" alt="Hero image" style="width: 100%;" />
    </eb-container>

    <!-- Custom padding -->
    <eb-container maxWidth="lg" padding="sm">
      <p>Content with small padding</p>
    </eb-container>
  `,
})
export class ExampleComponent {}
```

### Nested Containers

```typescript
@Component({
  template: `
    <!-- Outer full-width container -->
    <eb-container maxWidth="full" padding="none">
      <div class="hero-section">
        <eb-container maxWidth="lg">
          <h1>Welcome</h1>
          <p>Hero content centered within section</p>
        </eb-container>
      </div>
    </eb-container>

    <!-- Standard content -->
    <eb-container maxWidth="lg" padding="md">
      <h2>Main Content</h2>
      <p>Regular page content</p>
    </eb-container>
  `,
})
export class NestedExample {}
```

### With ARIA Labels

```typescript
@Component({
  template: `
    <eb-container maxWidth="lg" role="main" ariaLabel="Main content">
      <h1>Page Content</h1>
    </eb-container>

    <eb-container maxWidth="lg" role="complementary" ariaLabel="Sidebar">
      <aside>Sidebar content</aside>
    </eb-container>
  `,
})
export class AriaExample {}
```

### Page Layouts

```typescript
@Component({
  template: `
    <!-- Article layout -->
    <eb-container maxWidth="md" padding="lg">
      <article>
        <header>
          <h1>Article Title</h1>
          <p class="meta">Published on Jan 1, 2024</p>
        </header>
        <div class="content">Article body content...</div>
      </article>
    </eb-container>

    <!-- App layout -->
    <eb-container maxWidth="xl" padding="md">
      <div class="app-layout">
        <nav>Navigation</nav>
        <main>Main content</main>
        <aside>Sidebar</aside>
      </div>
    </eb-container>
  `,
})
export class LayoutExample {}
```

## Component API

### Inputs

| Input            | Type                                     | Default     | Description                                     |
| ---------------- | ---------------------------------------- | ----------- | ----------------------------------------------- |
| `maxWidth`       | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'`      | Maximum width of the container                  |
| `padding`        | `'none' \| 'sm' \| 'md' \| 'lg'`         | `'md'`      | Horizontal padding size                         |
| `centerContent`  | `boolean`                                | `true`      | Whether content should be centered horizontally |
| `role`           | `string`                                 | `'region'`  | ARIA role for the container                     |
| `ariaLabel`      | `string \| undefined`                    | `undefined` | ARIA label for the container                    |
| `ariaLabelledBy` | `string \| undefined`                    | `undefined` | ID of element that labels the container         |

### Max Width Specifications

| Size   | Max Width | Use Case                                   |
| ------ | --------- | ------------------------------------------ |
| `sm`   | 600px     | Narrow content (forms, simple articles)    |
| `md`   | 900px     | Medium content (blog posts, documentation) |
| `lg`   | 1200px    | Default page content (standard pages)      |
| `xl`   | 1400px    | Wide content (dashboards, data tables)     |
| `full` | 100%      | Full width, no constraint                  |

### Padding Specifications

| Size   | Padding |
| ------ | ------- |
| `none` | 0       |
| `sm`   | 12px    |
| `md`   | 16px    |
| `lg`   | 24px    |

## Accessibility

### Semantic Regions

Use appropriate `role` values for different sections:

```html
<!-- Main content -->
<eb-container role="main" ariaLabel="Main content">
  <!-- content -->
</eb-container>

<!-- Navigation -->
<eb-container role="navigation" ariaLabel="Primary navigation">
  <!-- nav -->
</eb-container>

<!-- Complementary -->
<eb-container role="complementary" ariaLabel="Related content">
  <!-- aside -->
</eb-container>
```

### Landmark Regions

When using landmark roles, provide descriptive labels:

```html
<eb-container role="region" ariaLabel="Featured products">
  <!-- content -->
</eb-container>
```

## Styling

The component uses BEM methodology:

```scss
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;

  // Max-width variants
  &--sm {
    max-width: 600px;
  }
  &--md {
    max-width: 900px;
  }
  &--lg {
    max-width: 1200px;
  }
  &--xl {
    max-width: 1400px;
  }
  &--full {
    max-width: 100%;
  }

  // Padding variants
  &--padding-none {
    padding-left: 0;
    padding-right: 0;
  }
  &--padding-sm {
    padding-left: 12px;
    padding-right: 12px;
  }
  &--padding-md {
    padding-left: 16px;
    padding-right: 16px;
  }
  &--padding-lg {
    padding-left: 24px;
    padding-right: 24px;
  }

  // Centering
  &--centered {
    margin-left: auto;
    margin-right: auto;
  }
}
```

## Responsive Behavior

Containers are responsive by default:

- On mobile, padding provides breathing room
- On desktop, max-width constrains content
- Centered containers stay centered at all sizes

```html
<!-- Responsive padding -->
<eb-container maxWidth="lg" padding="sm">
  <!-- 12px padding on mobile, stays at 12px on desktop -->
</eb-container>
```

## Testing

Run tests:

```bash
npm test -- container.component
```

## Architecture

```
container/
├── container.component.ts
├── container.component.html
├── container.component.scss
├── container.component.spec.ts
├── container.component.stories.ts
├── index.ts
└── README.md
```

## Dependencies

- `@angular/core`: Core Angular functionality

## Common Patterns

### Page Wrapper

```html
<eb-container maxWidth="lg" padding="md" role="main">
  <h1>{{ pageTitle }}</h1>
  <div class="page-content">
    <!-- page content -->
  </div>
</eb-container>
```

### Section Container

```html
<section>
  <eb-container maxWidth="lg">
    <h2>Section Title</h2>
    <p>Section content</p>
  </eb-container>
</section>
```

### Hero Section

```html
<div class="hero" style="background: linear-gradient(...);">
  <eb-container maxWidth="md">
    <h1>Welcome</h1>
    <p>Hero message</p>
    <eb-button>Get Started</eb-button>
  </eb-container>
</div>
```

## Best Practices

1. **Use appropriate widths**: sm for forms, md for articles, lg for pages, xl for dashboards
2. **Consistent padding**: Use the same padding size across similar sections
3. **Semantic roles**: Provide meaningful ARIA roles and labels
4. **Nesting**: Nest containers when needed (full-width section > centered content)
5. **Mobile-first**: Container works well on all screen sizes

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Part of the MoodyJW Portfolio project.
