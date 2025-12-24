# Skeleton Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Loading skeleton component for displaying placeholder content while data loads, improving perceived performance.

## Features

- ✅ **Three Variants**: Text, Circular, Rectangular
- ✅ **Three Animations**: Pulse, Wave, None
- ✅ **Multiple Items**: Render multiple skeleton lines
- ✅ **Customizable Size**: Width and height control
- ✅ **Custom Spacing**: Gap between multiple items
- ✅ **Rounded Corners**: Optional for rectangular variant
- ✅ **Accessible**: WCAG 2.1 AAA compliant with ARIA labels
- ✅ **Reduced Motion**: Respects prefers-reduced-motion preference
- ✅ **Theme Integration**: Uses CSS variables
- ✅ **Signal-based**: Modern Angular signals API

## Usage

### Basic Examples

```typescript
import { Component } from '@angular/core';
import { SkeletonComponent } from '@shared/components';

@Component({
  selector: 'eb-example',
  imports: [SkeletonComponent],
  template: `
    <!-- Text skeleton (single line) -->
    <eb-skeleton ariaLabel="Loading text" />

    <!-- Multiple text lines -->
    <eb-skeleton variant="text" [count]="3" ariaLabel="Loading content" />

    <!-- Circular avatar skeleton -->
    <eb-skeleton variant="circular" width="48px" height="48px" ariaLabel="Loading avatar" />

    <!-- Rectangular image skeleton -->
    <eb-skeleton variant="rectangular" width="100%" height="200px" ariaLabel="Loading image" />

    <!-- Card skeleton with custom spacing -->
    <eb-skeleton
      variant="rectangular"
      width="100%"
      height="300px"
      [spacing]="16"
      ariaLabel="Loading card"
    />

    <!-- Rounded rectangle -->
    <eb-skeleton
      variant="rectangular"
      width="200px"
      height="100px"
      [rounded]="true"
      ariaLabel="Loading card"
    />
  `,
})
export class ExampleComponent {}
```

### Animation Variants

```typescript
@Component({
  template: `
    <!-- Wave animation (default) -->
    <eb-skeleton animation="wave" ariaLabel="Loading with wave" />

    <!-- Pulse animation -->
    <eb-skeleton animation="pulse" ariaLabel="Loading with pulse" />

    <!-- No animation -->
    <eb-skeleton animation="none" ariaLabel="Loading" />
  `,
})
export class AnimationExample {}
```

### Loading States

```typescript
@Component({
  template: `
    <!-- Show skeleton while loading -->
    @if (loading()) {
      <eb-skeleton variant="text" [count]="3" ariaLabel="Loading article" />
    } @else {
      <article>
        <h2>{{ article.title }}</h2>
        <p>{{ article.content }}</p>
      </article>
    }
  `,
})
export class LoadingStateExample {
  loading = signal(true);
  article = signal({ title: '', content: '' });
}
```

### Card Skeleton

```typescript
@Component({
  template: `
    <div class="card-skeleton">
      <!-- Avatar -->
      <eb-skeleton variant="circular" width="40px" height="40px" ariaLabel="Loading avatar" />

      <!-- Text lines -->
      <div class="content">
        <eb-skeleton variant="text" width="60%" ariaLabel="Loading title" />
        <eb-skeleton variant="text" [count]="2" ariaLabel="Loading description" />
      </div>

      <!-- Image -->
      <eb-skeleton
        variant="rectangular"
        width="100%"
        height="200px"
        [rounded]="true"
        ariaLabel="Loading image"
      />

      <!-- Button -->
      <eb-skeleton
        variant="rectangular"
        width="100px"
        height="36px"
        [rounded]="true"
        ariaLabel="Loading button"
      />
    </div>
  `,
  styles: [
    `
      .card-skeleton {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid #eee;
        border-radius: 8px;
      }
      .content {
        flex: 1;
      }
    `,
  ],
})
export class CardSkeletonExample {}
```

### List Skeleton

```typescript
@Component({
  template: `
    <div class="list-skeleton">
      @for (item of items(); track $index) {
        <div class="list-item">
          <eb-skeleton variant="circular" width="40px" height="40px" ariaLabel="Loading avatar" />
          <div class="item-content">
            <eb-skeleton variant="text" width="70%" ariaLabel="Loading name" />
            <eb-skeleton variant="text" width="50%" ariaLabel="Loading details" />
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .list-item {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .item-content {
        flex: 1;
      }
    `,
  ],
})
export class ListSkeletonExample {
  items = signal(Array.from({ length: 5 }));
}
```

### Profile Skeleton

```typescript
@Component({
  template: `
    <div class="profile-skeleton">
      <!-- Avatar -->
      <eb-skeleton
        variant="circular"
        width="80px"
        height="80px"
        ariaLabel="Loading profile picture"
      />

      <!-- Name and bio -->
      <eb-skeleton variant="text" width="60%" ariaLabel="Loading name" />
      <eb-skeleton variant="text" [count]="3" ariaLabel="Loading bio" />

      <!-- Stats -->
      <div class="stats">
        @for (stat of [1, 2, 3]; track stat) {
          <eb-skeleton
            variant="rectangular"
            width="100px"
            height="60px"
            [rounded]="true"
            ariaLabel="Loading stat"
          />
        }
      </div>
    </div>
  `,
  styles: [
    `
      .profile-skeleton {
        text-align: center;
        padding: 2rem;
      }
      .stats {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 1rem;
      }
    `,
  ],
})
export class ProfileSkeletonExample {}
```

## Component API

### Inputs

| Input       | Type                                    | Default      | Description                                                                              |
| ----------- | --------------------------------------- | ------------ | ---------------------------------------------------------------------------------------- |
| `variant`   | `'text' \| 'circular' \| 'rectangular'` | `'text'`     | Shape variant of skeleton                                                                |
| `animation` | `'pulse' \| 'wave' \| 'none'`           | `'wave'`     | Animation type                                                                           |
| `width`     | `string \| undefined`                   | `undefined`  | Width (CSS value: px, %, rem, etc.)                                                      |
| `height`    | `string \| undefined`                   | `undefined`  | Height (CSS value: px, %, rem, etc.)                                                     |
| `count`     | `number`                                | `1`          | Number of skeleton items (text variant)                                                  |
| `spacing`   | `number`                                | `8`          | Spacing between items in pixels                                                          |
| `ariaLabel` | `string`                                | **REQUIRED** | ARIA label announcing loading state. Required because skeleton has no visible text label |
| `rounded`   | `boolean`                               | `false`      | Whether to have rounded corners (rectangular only)                                       |

### Variant Defaults

| Variant       | Default Width | Default Height    |
| ------------- | ------------- | ----------------- |
| `text`        | 100%          | 1em (line height) |
| `circular`    | 40px          | 40px              |
| `rectangular` | Must specify  | Must specify      |

## Animations

### Wave (Default)

- Shimmer effect moving across skeleton
- Best for cards and content areas
- Smooth, professional appearance

### Pulse

- Subtle opacity pulse animation
- Best for simple text loading
- Less distracting than wave

### None

- No animation
- Respects `prefers-reduced-motion`
- Use for accessibility or performance

## Accessibility

### ARIA Labels

The `ariaLabel` is **required** because the skeleton placeholder has no visible text label. It should describe what content is loading:

```html
<!-- Good: Descriptive label -->
<eb-skeleton ariaLabel="Loading user profile" />

<!-- Good: Specific content loading -->
<eb-skeleton variant="text" [count]="3" ariaLabel="Loading article content" />

<!-- Bad: Generic label -->
<eb-skeleton ariaLabel="Loading" />
```

The ariaLabel announces the loading state to screen reader users who cannot see the visual placeholder.

### Screen Reader Support

- Skeleton announces as "Loading [label]"
- `role="status"` indicates loading region
- `aria-live="polite"` announces when content appears

### Reduced Motion

Automatically disables animations when user prefers reduced motion:

```scss
@media (prefers-reduced-motion: reduce) {
  .skeleton--animation-wave,
  .skeleton--animation-pulse {
    animation: none;
  }
}
```

## Styling

Uses CSS animations and theme variables:

```scss
.skeleton {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 0%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 100%
  );
  background-size: 200% 100%;
  border-radius: var(--border-radius-sm);

  &--animation-wave {
    animation: skeleton-wave 1.5s ease-in-out infinite;
  }

  &--animation-pulse {
    animation: skeleton-pulse 1.5s ease-in-out infinite;
  }

  &--circular {
    border-radius: var(--border-radius-half);
  }

  &--rounded {
    border-radius: var(--border-radius-lg);
  }
}

@keyframes skeleton-wave {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
```

## Best Practices

1. **Match content structure**: Skeleton should match the layout of actual content
2. **Use appropriate variants**: Text for text, circular for avatars, rectangular for images
3. **Multiple items**: Show multiple skeleton lines for paragraphs
4. **Descriptive labels**: Tell users what's loading
5. **Consistent sizing**: Match skeleton size to expected content

## Testing

Run tests:

```bash
npm test -- skeleton.component
```

## Architecture

```
skeleton/
├── skeleton.component.ts
├── skeleton.component.html
├── skeleton.component.scss
├── skeleton.component.spec.ts
├── skeleton.component.stories.ts
├── index.ts
└── README.md
```

## Common Patterns

### Blog Post Loading

```html
<eb-skeleton variant="rectangular" width="100%" height="300px" />
<eb-skeleton variant="text" width="80%" />
<eb-skeleton variant="text" [count]="4" />
```

### User Card Loading

```html
<eb-skeleton variant="circular" width="60px" height="60px" />
<eb-skeleton variant="text" width="50%" />
<eb-skeleton variant="text" width="70%" />
```

### Data Table Loading

```html
@for (row of [1,2,3,4,5]; track row) {
<eb-skeleton variant="rectangular" width="100%" height="40px" />
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Part of the MoodyJW Portfolio project.
