# ADR-004: Theming System Design

## Status

Accepted

## Date

2025-12-17

## Context

The Angular Enterprise Blueprint requires a theming system that:

- Supports multiple named themes
- Includes dark mode variants
- Respects system preferences
- Is performant and maintainable

### Options Considered

1. **Angular Material Theming System** - Officially supported by Angular Material
2. **CSS Custom Properties** - Native CSS variables with runtime switching
3. **SCSS Variables** - Compile-time theming with mixins

## Decision

We chose **CSS Custom Properties** with SCSS for organization, providing runtime theme switching without JavaScript framework overhead.

### Rationale

1. **Runtime Switching**: Variables update instantly without recompile
2. **No Dependencies**: Pure CSS, works in any browser
3. **Performant**: Browser-native, no JS runtime cost
4. **System Preference Support**: `prefers-color-scheme` integration

## Implementation

### Theme Structure

```scss
// themes/_light-default.scss
[data-theme='light-default'] {
  // Primary brand colors
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-active: #1e40af;
  --color-primary-subtle: #eff6ff;
  --color-on-primary: #ffffff;

  // Surface colors
  --color-background: #ffffff;
  --color-surface: #ffffff;
  --color-surface-hover: #f8fafc;

  // Text colors
  --color-text: #0f172a;
  --color-text-secondary: #334155;
  --color-text-muted: #64748b;

  // Shadows
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
```

### Named Themes

| Theme                 | Category      | Description                        |
| --------------------- | ------------- | ---------------------------------- |
| `light-default`       | Light         | Blue professional (Daylight)       |
| `light-warm`          | Light         | Orange warm tones (Sunrise)        |
| `dark-default`        | Dark          | Blue-black professional (Midnight) |
| `dark-cool`           | Dark          | Purple-tinted cool (Twilight)      |
| `high-contrast-light` | Accessibility | High contrast light mode           |
| `high-contrast-dark`  | Accessibility | High contrast dark mode            |

### ThemeService

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _currentThemeId = signal<ThemeId>('light-default');

  readonly currentTheme = computed(() => this.getThemeById(this._currentThemeId()));

  readonly isDarkMode = computed(() => {
    const theme = this.currentTheme();
    return theme.category === 'dark' || theme.category === 'high-contrast-dark';
  });

  setTheme(themeId: ThemeId): void {
    document.documentElement.setAttribute('data-theme', themeId);
    this._currentThemeId.set(themeId);
  }
}
```

### Design Token Categories

Our theming system defines comprehensive CSS custom properties:

| Category       | Examples                                 | Purpose                  |
| -------------- | ---------------------------------------- | ------------------------ |
| **Colors**     | `--color-primary`, `--color-error`       | Semantic color palette   |
| **Typography** | `--font-size-base`, `--font-weight-bold` | Text styling             |
| **Spacing**    | `--space-4`, `--space-8`                 | Consistent spacing scale |
| **Shadows**    | `--shadow-sm`, `--shadow-lg`             | Elevation system         |
| **Motion**     | `--duration-normal`, `--ease-in-out`     | Animation timing         |
| **Z-index**    | `--z-modal`, `--z-toast`                 | Layering system          |

### Color Format

We use **hex colors** for broad browser compatibility and straightforward color definitions:

- Primary colors: `#2563eb`, `#f97316`, `#a78bfa`
- Semantic colors: `--color-success`, `--color-warning`, `--color-error`
- RGBA for transparency: `rgba(0, 0, 0, 0.5)` for overlays/shadows

## Consequences

### Positive

- Zero-JavaScript theme switching performance
- Consistent design token system
- Easy to add new themes
- Accessible color contrast maintained
- Full browser compatibility

### Negative

- More verbose than SCSS-only solution
- Requires understanding of CSS custom property cascade

### Neutral

- Standard approach in modern design systems
- Compatible with future CSS features

## References

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/colors) (inspiration for hex color values)
