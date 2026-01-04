# Theme System

This document describes the theming architecture for the Angular Enterprise Blueprint.

## Overview

The theme system provides **6 pre-configured themes** using CSS custom properties (CSS variables), with automatic system preference detection and local storage persistence.

| Theme ID              | Display Name        | Category      | Description                      |
| --------------------- | ------------------- | ------------- | -------------------------------- |
| `light-default`       | Daylight            | Light         | Clean blue primary, professional |
| `light-warm`          | Sunrise             | Light         | Warm-toned with softer colors    |
| `dark-default`        | Midnight            | Dark          | Deep blue-black dark theme       |
| `dark-cool`           | Twilight            | Dark          | Cool purple-tinted dark theme    |
| `high-contrast-light` | High Contrast Light | Accessibility | WCAG AAA compliant (7:1 ratio)   |
| `high-contrast-dark`  | High Contrast Dark  | Accessibility | WCAG AAA compliant (7:1 ratio)   |

## Architecture

```
src/styles/themes/
├── _variables.scss          # Base tokens (default values)
├── _light-default.scss      # Theme overrides
├── _dark-default.scss
├── _light-warm.scss
├── _dark-cool.scss
├── _high-contrast-light.scss
├── _high-contrast-dark.scss
└── _index.scss              # Theme barrel file
```

### How It Works

1. **Base tokens** in `_variables.scss` define default values for all CSS custom properties under `:root`
2. **Theme files** override these properties using `[data-theme='theme-id']` attribute selectors
3. **ThemeService** sets the `data-theme` attribute on the `<html>` element and persists the selection to `localStorage`
4. Components reference CSS variables (e.g., `var(--color-primary)`) which automatically update when themes change

## CSS Custom Properties

### Colors

**Primary Brand Colors:**

```scss
--color-primary              // Main brand color
--color-primary-hover        // Hover state
--color-primary-active       // Active/pressed state
--color-primary-subtle       // Subtle background tint
--color-on-primary           // Text color on primary backgrounds (ensures contrast)
--color-text-brand           // Brand color for inline text
```

**Secondary Colors:**

```scss
--color-secondary
--color-secondary-hover
--color-secondary-active
--color-secondary-subtle
--color-on-secondary         // Text color on secondary backgrounds
```

**Semantic Colors:**

```scss
// Success (green)
--color-success
--color-success-hover
--color-success-subtle
--color-on-success

// Warning (amber/orange)
--color-warning
--color-warning-hover
--color-warning-subtle
--color-on-warning

// Error (red)
--color-error
--color-error-hover
--color-error-subtle
--color-on-error

// Info (blue)
--color-info
--color-info-hover
--color-info-subtle
--color-on-info
```

**Surface Colors:**

```scss
--color-background           // Page/app background
--color-surface              // Card/component backgrounds
--color-surface-hover        // Hover state for interactive surfaces
--color-surface-active       // Active/selected state
--color-surface-elevated     // Elevated surfaces (modals, dropdowns, tooltips)
```

**Text Colors:**

```scss
--color-text                 // Primary body text
--color-text-secondary       // Secondary/less prominent text
--color-text-muted           // Muted/helper/placeholder text
--color-text-disabled        // Disabled state text
--color-text-inverse         // Text on dark backgrounds (in light themes)
```

**Border & Focus Colors:**

```scss
--color-border               // Default border color
--color-border-hover         // Border color on hover
--color-border-focus         // Border color when focused
--color-focus-ring           // Focus ring/outline color (semi-transparent)
```

**Utility Colors:**

```scss
--color-overlay              // Modal/drawer backdrop overlay
--color-skeleton             // Skeleton loading placeholder
--color-skeleton-wave        // Skeleton loading shimmer effect
```

### Typography

```scss
--font-family-sans
--font-family-mono
--font-size-{xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl}
--font-weight-{light|normal|medium|semibold|bold}
--line-height-{extra-tight|tight|normal|relaxed}
```

### Spacing & Layout

```scss
--space-{0|1|2|3|4|5|6|8|10|12|16|20|24}    // 0.25rem scale
--border-radius-{none|sm|base|md|lg|xl|2xl|full}
--max-width-{xs|sm|md|lg|xl|full}
```

### Shadows & Motion

```scss
--shadow-{none|sm|base|md|lg|xl|2xl|inner}
--duration-{instant|fast|normal|slow|slower}
--ease-{linear|in|out|in-out}
```

### Z-Index Layers

```scss
--z-dropdown: 1000 // Dropdown menus
  --z-sticky: 1020 // Sticky headers/navigation
  --z-modal-backdrop: 1040 // Modal backdrop overlay
  --z-modal: 1050 // Modal dialogs
  --z-tooltip: 1070 // Tooltips (above modals)
  --z-toast: 1080; // Toast notifications (highest)
```

**Usage Note:** These values create a stacking context hierarchy. Higher values appear above lower values.

## ThemeService API

```typescript
import { ThemeService } from '@core/services';

@Component({...})
export class MyComponent {
  private themeService = inject(ThemeService);

  // Reactive signals
  currentTheme = this.themeService.currentTheme;       // Theme config
  currentThemeId = this.themeService.currentThemeId;   // 'light-default', etc.
  isDarkMode = this.themeService.isDarkMode;
  isHighContrast = this.themeService.isHighContrast;

  // Methods
  changeTheme() {
    this.themeService.setTheme('dark-default');
  }

  resetToSystem() {
    this.themeService.clearPersistedTheme();
  }
}
```

### Available Methods

```typescript
// Get all themes
themeService.getAllThemes(); // Returns all 6 themes

// Get themes by category
themeService.getThemesByCategory('light'); // [light-default, light-warm]
themeService.getThemesByCategory('dark'); // [dark-default, dark-cool]
themeService.getThemesByCategory('high-contrast-light'); // [high-contrast-light]
themeService.getThemesByCategory('high-contrast-dark'); // [high-contrast-dark]

// Get specific theme config
themeService.getTheme('light-default'); // Returns Theme object

// Clear persisted theme (reverts to system preference)
themeService.clearPersistedTheme();
```

## Usage in Components

### Using CSS Variables

```scss
.my-component {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--space-4);

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-border-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
}
```

### Semantic Color Usage

```scss
// Buttons - Use --color-on-{color} for guaranteed contrast
.primary-button {
  background: var(--color-primary);
  color: var(--color-on-primary); // Always use --color-on-* for text

  &:hover {
    background: var(--color-primary-hover);
  }
}

// Status indicators - Use -subtle for backgrounds
.success-badge {
  background: var(--color-success-subtle);
  color: var(--color-success);
  border: 1px solid var(--color-success);
}

.error-message {
  color: var(--color-error);
}

// Alert components
.alert-error {
  background: var(--color-error-subtle);
  color: var(--color-error);
  border-left: 4px solid var(--color-error);
}
```

## Creating a New Theme

1. Create `src/styles/themes/_my-theme.scss`:

```scss
[data-theme='my-theme'] {
  --color-primary: #your-color;
  --color-primary-hover: #darker-shade;
  // ... override other variables as needed
}
```

2. Import in `_index.scss`:

```scss
@forward 'my-theme';
```

3. Register in `theme.types.ts`:

```typescript
export const THEMES = [
  // ... existing themes
  { id: 'my-theme', name: 'My Theme', category: 'light' },
] as const;
```

## Accessibility Compliance

### WCAG Contrast Ratios

- **High-Contrast themes** (high-contrast-light, high-contrast-dark)
  - Text: WCAG AAA compliant (7:1 minimum contrast ratio)
  - Best for users with visual impairments
  - Enhanced border visibility and focus indicators

- **Standard themes** (all other themes)
  - Text: WCAG AA compliant (4.5:1 minimum contrast ratio)
  - Large text: 3:1 minimum contrast ratio
  - UI components: 3:1 minimum contrast ratio

### Motion & Interaction

- All themes respect `prefers-reduced-motion` media query
- Transitions and animations are disabled when user prefers reduced motion
- Focus indicators are always visible with sufficient contrast
- Interactive elements have clear hover and active states

### Theme-Specific Features

- High-contrast themes use thicker borders (2px vs 1px)
- Focus rings are more prominent in high-contrast modes
- All `--color-on-*` variables ensure proper contrast on colored backgrounds
- Text color hierarchy maintained across all themes (primary → secondary → muted → disabled)

## System Preference Detection

The `ThemeService` automatically detects and respects user preferences using the following priority order:

### Theme Selection Priority (First Match Wins)

1. **URL Parameter:** `?theme=light-warm` (useful for testing, Lighthouse audits, sharing links)
2. **Local Storage:** Previously selected theme persisted in `localStorage` (key: `theme-id`)
3. **System Preference:** `prefers-color-scheme` media query
   - `prefers-color-scheme: dark` → `dark-default`
   - `prefers-color-scheme: light` → `light-default`
4. **Default Fallback:** `light-default` if no preference detected

### Persistence Behavior

- User theme selections are **automatically persisted** to `localStorage`
- Persisted theme takes precedence over system preference
- Call `clearPersistedTheme()` to reset and re-enable system preference detection
- Theme persists across browser sessions and tabs

## Testing Themes

### In Storybook

Use the **theme switcher** in the Storybook toolbar to test components across all 6 themes:

1. Open any story in Storybook
2. Click the theme icon in the toolbar
3. Select a theme from the dropdown
4. Component re-renders with new theme instantly

**Best Practice:** Test every component in at least 3 themes (light, dark, high-contrast) during development.

### URL Parameter Testing

Test specific themes by appending `?theme=theme-id` to the URL:

```
http://localhost:4200?theme=dark-default
http://localhost:4200?theme=high-contrast-light
```

**Use Cases:**

- Lighthouse audits with specific theme
- Sharing screenshots/demos in a specific theme
- Automated testing with fixed theme
- QA testing specific theme combinations

### Browser DevTools

Test system preference detection by emulating `prefers-color-scheme`:

**Chrome DevTools:**

1. Open DevTools (F12)
2. `Cmd/Ctrl + Shift + P` → "Show Rendering"
3. Find "Emulate CSS media feature prefers-color-scheme"
4. Select `prefers-color-scheme: dark` or `prefers-color-scheme: light`

---

## Best Practices

### DO ✅

- Always use CSS custom properties for colors, spacing, and typography
- Use `--color-on-*` variables for text on colored backgrounds
- Test components in light, dark, and high-contrast themes
- Use semantic color variables (`--color-success`, `--color-error`) for meaning
- Respect `prefers-reduced-motion` for animations
- Use theme service signals for reactive theme-aware logic

### DON'T ❌

- Don't hardcode color values in component styles
- Don't assume light background - components must work in all themes
- Don't use insufficient contrast (always check WCAG compliance)
- Don't override CSS variables with `!important`
- Don't create theme-specific component variants (use CSS variables instead)
- Don't forget to test focus states in high-contrast themes

---

**Last Updated:** 2026-01-04
**Related Documents:**

- [Design System](./DESIGN_SYSTEM.md)
- [Accessibility Guidelines](./ACCESSIBILITY.md)
