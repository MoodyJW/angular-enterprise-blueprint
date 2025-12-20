# Grid Component

> **Last Updated**: December 4, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Responsive 12-column grid system for creating flexible, consistent layouts with powerful responsive features.

## Features

- ✅ **12-Column System**: Traditional grid with column spans
- ✅ **Responsive Breakpoints**: Mobile (base), Tablet (md), Desktop (lg), XL (xl)
- ✅ **Auto-fit Columns**: Automatically size columns based on content
- ✅ **Gap Control**: Seven gap sizes with separate horizontal/vertical options
- ✅ **Alignment Options**: Control vertical and horizontal alignment
- ✅ **Flexible Distribution**: Multiple justify options
- ✅ **Accessible**: Semantic HTML with ARIA support
- ✅ **Theme Integration**: Uses CSS variables
- ✅ **Signal-based**: Modern Angular signals API

## Usage

### Basic Examples

```typescript
import { Component } from '@angular/core';
import { GridComponent } from '@shared/components';

@Component({
  selector: 'eb-example',
  standalone: true,
  imports: [GridComponent],
  template: `
    <!-- Responsive grid: 1 column mobile, 2 tablet, 3 desktop -->
    <eb-grid [cols]="1" [colsMd]="2" [colsLg]="3" gap="lg">
      <div class="grid-item">Item 1</div>
      <div class="grid-item">Item 2</div>
      <div class="grid-item">Item 3</div>
      <div class="grid-item">Item 4</div>
      <div class="grid-item">Item 5</div>
      <div class="grid-item">Item 6</div>
    </eb-grid>

    <!-- Auto-fit columns with minimum width -->
    <eb-grid cols="auto" [minColWidth]="'250px'" gap="md">
      <div class="card">Auto-sized card</div>
      <div class="card">Auto-sized card</div>
      <div class="card">Auto-sized card</div>
    </eb-grid>

    <!-- 12-column layout -->
    <eb-grid [cols]="12" gap="md">
      <div class="col-span-6">Half width</div>
      <div class="col-span-6">Half width</div>
      <div class="col-span-4">One third</div>
      <div class="col-span-4">One third</div>
      <div class="col-span-4">One third</div>
    </eb-grid>

    <!-- Fixed 4-column grid -->
    <eb-grid [cols]="4" gap="lg">
      <div>Column 1</div>
      <div>Column 2</div>
      <div>Column 3</div>
      <div>Column 4</div>
    </eb-grid>
  `,
})
export class ExampleComponent {}
```

### Responsive Layouts

```typescript
@Component({
  template: `
    <!-- Card grid: stack on mobile, 2 cols tablet, 3 cols desktop, 4 cols XL -->
    <eb-grid [cols]="1" [colsMd]="2" [colsLg]="3" [colsXl]="4" gap="lg">
      <eb-card *ngFor="let item of items">
        {{ item.title }}
      </eb-card>
    </eb-grid>
  `,
})
export class ResponsiveExample {
  items = [
    /* ... */
  ];
}
```

### Custom Gap Spacing

```typescript
@Component({
  template: `
    <!-- Different horizontal and vertical gaps -->
    <eb-grid [cols]="3" gapX="lg" gapY="sm">
      <div>Larger horizontal gap</div>
      <div>Between columns</div>
      <div>Smaller vertical gap between rows</div>
    </eb-grid>

    <!-- No gap -->
    <eb-grid [cols]="4" gap="none">
      <div>No spacing</div>
      <div>Between items</div>
      <div>Flush grid</div>
      <div>Layout</div>
    </eb-grid>
  `,
})
export class GapExample {}
```

### Alignment

```typescript
@Component({
  template: `
    <!-- Center items vertically -->
    <eb-grid [cols]="3" gap="md" alignItems="center">
      <div style="height: 100px;">Tall item</div>
      <div style="height: 50px;">Short item centered</div>
      <div style="height: 80px;">Medium item</div>
    </eb-grid>

    <!-- Distribute items with space-between -->
    <eb-grid [cols]="3" gap="md" justifyItems="space-between">
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </eb-grid>
  `,
})
export class AlignmentExample {}
```

### Auto-fit Columns

```typescript
@Component({
  template: `
    <!-- Auto-fit: creates as many columns as fit -->
    <eb-grid cols="auto" [minColWidth]="'300px'" gap="lg">
      <eb-card>Card 1</eb-card>
      <eb-card>Card 2</eb-card>
      <eb-card>Card 3</eb-card>
      <!-- Automatically wraps based on container width -->
    </eb-grid>
  `,
})
export class AutoFitExample {}
```

## Component API

### Inputs

| Input            | Type                                                                                               | Default     | Description                             |
| ---------------- | -------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------- |
| `cols`           | `1 \| 2 \| 3 \| 4 \| 6 \| 12 \| 'auto'`                                                            | `1`         | Number of columns (mobile-first base)   |
| `colsMd`         | Same as cols \| undefined                                                                          | `undefined` | Columns at tablet breakpoint (≥768px)   |
| `colsLg`         | Same as cols \| undefined                                                                          | `undefined` | Columns at desktop breakpoint (≥1024px) |
| `colsXl`         | Same as cols \| undefined                                                                          | `undefined` | Columns at large desktop (≥1280px)      |
| `gap`            | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`                                          | `'md'`      | Gap spacing between items               |
| `gapX`           | Same as gap \| undefined                                                                           | `undefined` | Horizontal gap (overrides gap)          |
| `gapY`           | Same as gap \| undefined                                                                           | `undefined` | Vertical gap (overrides gap)            |
| `minColWidth`    | `string`                                                                                           | `'200px'`   | Min column width for auto-fit mode      |
| `alignItems`     | `'start' \| 'center' \| 'end' \| 'stretch'`                                                        | `'stretch'` | Vertical alignment of items             |
| `justifyItems`   | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around' \| 'space-evenly' \| undefined` | `undefined` | Horizontal distribution                 |
| `fullWidth`      | `boolean`                                                                                          | `true`      | Whether grid takes full width           |
| `role`           | `string`                                                                                           | `'list'`    | ARIA role for the grid                  |
| `ariaLabel`      | `string \| undefined`                                                                              | `undefined` | ARIA label for the grid                 |
| `ariaLabelledBy` | `string \| undefined`                                                                              | `undefined` | ID of labeling element                  |

### Gap Specifications

| Size   | Spacing |
| ------ | ------- |
| `none` | 0       |
| `xs`   | 4px     |
| `sm`   | 8px     |
| `md`   | 16px    |
| `lg`   | 24px    |
| `xl`   | 32px    |
| `2xl`  | 48px    |

### Breakpoints

| Name          | Min Width | Input    |
| ------------- | --------- | -------- |
| Mobile (base) | 0px       | `cols`   |
| Tablet        | 768px     | `colsMd` |
| Desktop       | 1024px    | `colsLg` |
| XL Desktop    | 1280px    | `colsXl` |

## CSS Grid Integration

The component uses CSS Grid with custom properties:

```scss
.grid {
  display: grid;
  grid-template-columns: var(--grid-cols);
  gap: var(--gap-size);

  // Responsive columns via CSS variables
  @media (min-width: 768px) {
    grid-template-columns: var(--grid-cols-md, var(--grid-cols));
  }

  @media (min-width: 1024px) {
    grid-template-columns: var(--grid-cols-lg, var(--grid-cols-md, var(--grid-cols)));
  }
}
```

### Column Spans

Add utility classes to grid items:

```html
<eb-grid [cols]="12" gap="md">
  <div class="col-span-12">Full width</div>
  <div class="col-span-6">Half</div>
  <div class="col-span-6">Half</div>
  <div class="col-span-4">One third</div>
  <div class="col-span-4">One third</div>
  <div class="col-span-4">One third</div>
</eb-grid>
```

```scss
// Add these utility classes to your global styles
.col-span-1 {
  grid-column: span 1;
}
.col-span-2 {
  grid-column: span 2;
}
.col-span-3 {
  grid-column: span 3;
}
.col-span-4 {
  grid-column: span 4;
}
.col-span-6 {
  grid-column: span 6;
}
.col-span-12 {
  grid-column: span 12;
}
```

## Common Layouts

### Product Grid

```html
<eb-grid [cols]="1" [colsMd]="2" [colsLg]="4" gap="lg">
  <eb-card *ngFor="let product of products">
    <img [src]="product.image" />
    <h3>{{ product.name }}</h3>
    <p>{{ product.price }}</p>
  </eb-card>
</eb-grid>
```

### Dashboard

```html
<eb-grid [cols]="12" gap="md">
  <div class="col-span-12">
    <eb-card>Header</eb-card>
  </div>
  <div class="col-span-8">
    <eb-card>Main content</eb-card>
  </div>
  <div class="col-span-4">
    <eb-card>Sidebar</eb-card>
  </div>
</eb-grid>
```

### Image Gallery

```html
<eb-grid cols="auto" [minColWidth]="'200px'" gap="sm">
  <img *ngFor="let img of images" [src]="img" />
</eb-grid>
```

## Testing

Run tests:

```bash
npm test -- grid.component
```

## Architecture

```
grid/
├── grid.component.ts
├── grid.component.html
├── grid.component.scss
├── grid.component.spec.ts
├── grid.component.stories.ts
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
