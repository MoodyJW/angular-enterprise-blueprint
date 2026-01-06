# Theme Picker Component

> **Last Updated**: January 2026
> **Status**: Production Ready
> **Test Coverage**: >90%

UI component for selecting the application theme with support for dropdown, grid, and inline variants.

## Features

- ✅ **Three Variants**: Dropdown, Grid, Inline
- ✅ **Three Sizes**: Small (sm), Medium (md), Large (lg)
- ✅ **6 Themes**: Light, Dark, Warm, Cool, High-Contrast Light/Dark
- ✅ **Category Grouping**: Optional grouping by light/dark/high-contrast
- ✅ **Visual Previews**: Color swatches show theme appearance
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Persistence**: Theme choice saved automatically
- ✅ **Accessible**: ARIA labels and focus management

## Usage

```html
<!-- Default dropdown -->
<eb-theme-picker />

<!-- Grid variant with labels -->
<eb-theme-picker variant="grid" [showLabels]="true" />

<!-- Inline variant grouped by category -->
<eb-theme-picker variant="inline" [groupByCategory]="true" />

<!-- Small dropdown -->
<eb-theme-picker variant="dropdown" size="sm" />
```

## API

### Inputs

| Input             | Type                               | Default          | Description                  |
| ----------------- | ---------------------------------- | ---------------- | ---------------------------- |
| `variant`         | `'dropdown' \| 'grid' \| 'inline'` | `'dropdown'`     | Display variant              |
| `size`            | `'sm' \| 'md' \| 'lg'`             | `'md'`           | Size of the component        |
| `showLabels`      | `boolean`                          | `true`           | Show theme name labels       |
| `groupByCategory` | `boolean`                          | `false`          | Group themes by category     |
| `ariaLabel`       | `string`                           | `'Select theme'` | ARIA label for accessibility |

## Available Themes

| Theme ID              | Category            | Description                    |
| --------------------- | ------------------- | ------------------------------ |
| `light-default`       | Light               | Clean blue primary             |
| `light-warm`          | Light               | Warm orange-amber tones        |
| `dark-default`        | Dark                | Blue primary on dark surfaces  |
| `dark-cool`           | Dark                | Cool blue-gray aesthetic       |
| `high-contrast-light` | High Contrast Light | WCAG AAA compliant light theme |
| `high-contrast-dark`  | High Contrast Dark  | WCAG AAA compliant dark theme  |

## Service Integration

The component uses `ThemeService` from `@core/services`:

```typescript
import { ThemeService } from '@core/services';

private themeService = inject(ThemeService);

// Get current theme
currentTheme = this.themeService.currentTheme;

// Change theme programmatically
this.themeService.setTheme('dark-default');

// Check if dark mode
isDark = this.themeService.isDarkMode;

// Reset to system preference
this.themeService.clearPersistedTheme();
```

## Keyboard Navigation

| Key             | Action                                 |
| --------------- | -------------------------------------- |
| `Enter`/`Space` | Open dropdown or select focused option |
| `ArrowDown`     | Move focus down / open dropdown        |
| `ArrowUp`       | Move focus up                          |
| `Home`          | Focus first option                     |
| `End`           | Focus last option                      |
| `Escape`        | Close dropdown                         |
| `Tab`           | Close dropdown and move focus          |

## Accessibility

- **ARIA Attributes**: `aria-label`, `aria-expanded`, `aria-selected`
- **Focus Management**: Visible focus indicators
- **Screen Reader Support**: Theme names announced on selection
- **High Contrast**: Themes tested for WCAG AAA compliance

## Storybook

```bash
npm run storybook
```

Navigate to `Shared/Theme Picker`.

## Architecture

```
theme-picker/
├── theme-picker.component.ts
├── theme-picker.component.html
├── theme-picker.component.scss
├── theme-picker.component.spec.ts
├── theme-picker.component.stories.ts
├── index.ts
└── README.md
```

## Related

- [Theme System Documentation](/docs/THEME_SYSTEM.md)
- [ThemeService API](/src/app/core/services/theme/)
