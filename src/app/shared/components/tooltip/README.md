# Tooltip Component

An accessible, directive-based tooltip component that displays contextual information on hover and keyboard focus.

## Features

- ✅ **Directive-based**: Apply via `ebTooltip` directive to any element
- ✅ **Trigger**: Shows on hover and keyboard focus
- ✅ **Positioning**: Support for top, right, bottom, left, and auto positioning
- ✅ **Accessibility**: Full WCAG 2.1 AA compliance with proper ARIA attributes
- ✅ **Theme integration**: Uses existing CSS custom properties
- ✅ **Signal-based**: Uses signals for reactive state management
- ✅ **OnPush**: Uses OnPush change detection strategy

## Basic Usage

```html
<button ebTooltip="Save your changes">Save</button>
```

## Positioning

```html
<!-- Top position (default) -->
<button ebTooltip="Top tooltip" tooltipPosition="top">Hover me</button>

<!-- Bottom position -->
<button ebTooltip="Bottom tooltip" tooltipPosition="bottom">Hover me</button>

<!-- Left position -->
<button ebTooltip="Left tooltip" tooltipPosition="left">Hover me</button>

<!-- Right position -->
<button ebTooltip="Right tooltip" tooltipPosition="right">Hover me</button>

<!-- Auto position (smart positioning) -->
<button ebTooltip="Auto tooltip" tooltipPosition="auto">Hover me</button>
```

## Configuration

### Show/Hide Delays

```html
<!-- Custom show delay (default: 200ms) -->
<button ebTooltip="Quick tooltip" [tooltipShowDelay]="100">Fast</button>

<!-- Custom hide delay (default: 0ms) -->
<button ebTooltip="Sticky tooltip" [tooltipHideDelay]="500">Sticky</button>
```

### Disabled State

```html
<!-- Disabled tooltip -->
<button ebTooltip="Disabled" [tooltipDisabled]="true">No tooltip</button>
```

## API

### Directive Inputs

| Input              | Type                                               | Default    | Description                     |
| ------------------ | -------------------------------------------------- | ---------- | ------------------------------- |
| `ebTooltip`        | `string`                                           | _required_ | The tooltip text content        |
| `tooltipPosition`  | `'top' \| 'right' \| 'bottom' \| 'left' \| 'auto'` | `'auto'`   | Position of the tooltip         |
| `tooltipDisabled`  | `boolean`                                          | `false`    | Whether the tooltip is disabled |
| `tooltipShowDelay` | `number`                                           | `200`      | Delay in ms before showing      |
| `tooltipHideDelay` | `number`                                           | `0`        | Delay in ms before hiding       |

## Accessibility

The tooltip component is fully WCAG 2.1 AA compliant:

- **Keyboard Navigation**: Tooltip appears on focus, disappears on blur
- **Screen Readers**: Proper `role="tooltip"` and `aria-label` attributes
- **Focus Management**: No focus trapping, tooltip is purely informational
- **Reduced Motion**: Respects `prefers-reduced-motion` setting

## Examples

### On Different Elements

```html
<!-- Button -->
<button ebTooltip="Click to submit">Submit</button>

<!-- Icon -->
<eb-icon name="heroInformation" ebTooltip="More information" />

<!-- Text -->
<span ebTooltip="Helpful context">Hover for help</span>

<!-- Input -->
<input type="text" ebTooltip="Enter your email" placeholder="Email" />

<!-- Link -->
<a href="#" ebTooltip="Opens in new tab">Learn more</a>
```

### Long Content

```html
<button
  ebTooltip="This is a longer tooltip that will wrap to multiple lines when it exceeds the maximum width constraint."
>
  Hover for details
</button>
```

## Testing

The component includes comprehensive unit tests for:

- Directive initialization and cleanup
- Mouse event handling (mouseenter/mouseleave)
- Focus event handling (focus/blur)
- Position configuration
- Custom delays
- Disabled state
- Accessibility attributes
- Edge cases (rapid hovers, multiple tooltips)

Run tests:

```bash
npm run test -- --include="**/tooltip/**"
```

## Storybook

View interactive examples in Storybook:

```bash
npm run storybook
```

Navigate to `Components > Tooltip` to see all variants and configurations.

## Implementation Details

### Architecture

The tooltip system consists of two parts:

1. **TooltipDirective**: Applied to host elements, manages event listeners and tooltip lifecycle
2. **TooltipComponent**: Dynamically created component that renders the tooltip with positioning

### Dynamic Component Creation

The directive dynamically creates and destroys the tooltip component using Angular's `createComponent` API. The tooltip is appended to `document.body` to avoid z-index and overflow issues.

### Smart Positioning

When `tooltipPosition="auto"`, the component:

1. Calculates available space in all directions
2. Chooses the position with the most space
3. Falls back to opposite position if preferred position doesn't fit
4. Ensures tooltip stays within viewport bounds

### Theme Integration

Uses CSS custom properties from the design system:

- `--color-text`: Tooltip background
- `--color-background`: Tooltip text color
- `--space-2`, `--space-3`: Padding
- `--border-radius-base`: Border radius
- `--shadow-md`: Box shadow
- `--duration-fast`, `--ease-out`: Animation timing

## Browser Support

Supports all modern browsers that Angular 20+ supports:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Related Components

- [Badge](../badge/README.md) - For status indicators
- [Modal](../modal/README.md) - For complex overlays
- [Toast](../toast/README.md) - For notifications
