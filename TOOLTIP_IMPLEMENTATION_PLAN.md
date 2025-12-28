# Tooltip Component Implementation Plan

**Created:** 2025-12-28
**Status:** Planning Phase
**Priority:** Medium
**Estimated Time:** 4-6 hours

---

## Overview

Create a fully accessible, theme-aware tooltip component that can be applied to any element via a directive. The tooltip should follow WCAG 2.1 AA accessibility standards and integrate seamlessly with our existing design system.

---

## Table of Contents

1. [Requirements](#requirements)
2. [Component Architecture](#component-architecture)
3. [Files to Create](#files-to-create)
4. [Implementation Details](#implementation-details)
5. [Accessibility Requirements](#accessibility-requirements)
6. [Testing Requirements](#testing-requirements)
7. [Storybook Stories](#storybook-stories)
8. [Integration Steps](#integration-steps)

---

## Requirements

### Functional Requirements

- **Trigger on hover** - Show tooltip when user hovers over an element
- **Trigger on focus** - Show tooltip when element receives keyboard focus
- **Multiple positions** - Support top, right, bottom, left positioning
- **Auto-positioning** - Automatically adjust position if tooltip would overflow viewport
- **Delay support** - Configurable show/hide delays
- **Theme integration** - Use existing CSS custom properties
- **Accessibility** - Full WCAG 2.1 AA compliance
- **Customizable content** - Support text and basic HTML content
- **Touch support** - Work on touch devices (tap to show, tap outside to hide)
- **Directive-based** - Apply via `ebTooltip` directive

### Non-Functional Requirements

- **Performance** - No impact on page render performance
- **SSR compatible** - Must work with Angular Universal
- **Type-safe** - Full TypeScript type safety
- **BEM CSS** - Follow BEM methodology for styling
- **OnPush change detection** - Use OnPush strategy
- **Signal-based** - Use signals for reactive state
- **Zero dependencies** - No external libraries required

---

## Component Architecture

### Structure

```
src/app/shared/components/tooltip/
├── tooltip.directive.ts         # Main directive users apply to elements
├── tooltip.component.ts         # Tooltip popup component
├── tooltip.component.html       # Tooltip template
├── tooltip.component.scss       # Tooltip styles (BEM)
├── tooltip.component.spec.ts    # Unit tests
├── tooltip.directive.spec.ts    # Directive tests
├── tooltip.stories.ts           # Storybook stories
├── tooltip.types.ts            # Type definitions
└── index.ts                     # Barrel export
```

### Design Pattern

**Directive + Component Pattern:**

- `TooltipDirective` - Applied to host elements, manages show/hide logic
- `TooltipComponent` - Dynamically created overlay, renders tooltip content

---

## Files to Create

### 1. Type Definitions (`tooltip.types.ts`)

```typescript
/**
 * Tooltip position relative to the host element
 */
export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left' | 'auto';

/**
 * Tooltip trigger events
 */
export type TooltipTrigger = 'hover' | 'focus' | 'click' | 'manual';

/**
 * Tooltip theme variant
 */
export type TooltipVariant = 'default' | 'dark' | 'light' | 'primary' | 'error';

/**
 * Configuration for tooltip behavior
 */
export interface TooltipConfig {
  /**
   * Position of the tooltip relative to host
   * @default 'top'
   */
  position?: TooltipPosition;

  /**
   * How the tooltip is triggered
   * @default 'hover'
   */
  trigger?: TooltipTrigger;

  /**
   * Visual theme variant
   * @default 'default'
   */
  variant?: TooltipVariant;

  /**
   * Delay in ms before showing tooltip
   * @default 200
   */
  showDelay?: number;

  /**
   * Delay in ms before hiding tooltip
   * @default 0
   */
  hideDelay?: number;

  /**
   * Maximum width of tooltip in pixels
   * @default 200
   */
  maxWidth?: number;

  /**
   * Offset from host element in pixels
   * @default 8
   */
  offset?: number;

  /**
   * Whether tooltip can be dismissed by clicking outside
   * @default true
   */
  closeOnClickOutside?: boolean;

  /**
   * Whether to show arrow pointing to host
   * @default true
   */
  showArrow?: boolean;

  /**
   * Custom CSS class to apply to tooltip
   */
  customClass?: string;

  /**
   * Whether tooltip is disabled
   * @default false
   */
  disabled?: boolean;
}
```

### 2. Tooltip Directive (`tooltip.directive.ts`)

**Key Features:**

- Signal inputs for all configuration
- Uses `inject()` for dependencies
- Implements `OnDestroy` for cleanup
- Creates tooltip component dynamically using `ComponentRef`
- Manages show/hide with configurable delays
- Handles positioning logic
- Supports keyboard navigation (Escape to close)
- Touch-friendly (tap to show, tap outside to hide)

**Inputs:**

```typescript
readonly ebTooltip = input.required<string>(); // Tooltip text content
readonly tooltipPosition = input<TooltipPosition>('top');
readonly tooltipVariant = input<TooltipVariant>('default');
readonly tooltipShowDelay = input<number>(200);
readonly tooltipHideDelay = input<number>(0);
readonly tooltipMaxWidth = input<number>(200);
readonly tooltipOffset = input<number>(8);
readonly tooltipDisabled = input<boolean>(false);
readonly tooltipShowArrow = input<boolean>(true);
readonly tooltipCustomClass = input<string>('');
```

**Host Bindings:**

```typescript
host: {
  '(mouseenter)': 'onMouseEnter()',
  '(mouseleave)': 'onMouseLeave()',
  '(focus)': 'onFocus()',
  '(blur)': 'onBlur()',
  '(click)': 'onClick($event)',
  '[attr.aria-describedby]': 'tooltipId()',
  '[attr.tabindex]': 'tabindex()',
}
```

**Core Methods:**

- `show()` - Show tooltip with delay
- `hide()` - Hide tooltip with delay
- `toggle()` - Toggle tooltip visibility
- `updatePosition()` - Calculate and update tooltip position
- `destroy()` - Clean up component reference

### 3. Tooltip Component (`tooltip.component.ts`)

**Key Features:**

- OnPush change detection
- Signal-based state management
- BEM CSS classes
- Aria attributes for accessibility
- Computed positioning classes
- Animation support

**Inputs:**

```typescript
readonly content = input.required<string>();
readonly position = input<TooltipPosition>('top');
readonly variant = input<TooltipVariant>('default');
readonly maxWidth = input<number>(200);
readonly showArrow = input<boolean>(true);
readonly customClass = input<string>('');
readonly id = input.required<string>(); // For aria-describedby
```

**State:**

```typescript
readonly isVisible = signal<boolean>(false);
readonly actualPosition = signal<TooltipPosition>('top'); // After auto-positioning
```

**Computed:**

```typescript
readonly tooltipClasses = computed(() => {
  const classes = ['tooltip'];
  classes.push(`tooltip--${this.variant()}`);
  classes.push(`tooltip--${this.actualPosition()}`);
  if (this.isVisible()) classes.push('tooltip--visible');
  const custom = this.customClass();
  if (custom) classes.push(custom);
  return classes.join(' ');
});

readonly tooltipStyles = computed(() => ({
  'max-width.px': this.maxWidth(),
}));

readonly arrowClasses = computed(() => [
  'tooltip__arrow',
  `tooltip__arrow--${this.actualPosition()}`
].join(' '));
```

### 4. Tooltip Template (`tooltip.component.html`)

```html
<div
  [id]="id()"
  [class]="tooltipClasses()"
  [ngStyle]="tooltipStyles()"
  role="tooltip"
  [attr.aria-hidden]="!isVisible()"
>
  @if (showArrow()) {
  <div [class]="arrowClasses()"></div>
  }
  <div class="tooltip__content">{{ content() }}</div>
</div>
```

### 5. Tooltip Styles (`tooltip.component.scss`)

**Key Features:**

- BEM methodology
- CSS custom properties for theming
- Smooth animations
- All 4 position variants
- Arrow styling
- Responsive max-width
- High z-index for overlay

**CSS Custom Properties to Use:**

```scss
// From existing theme system
--color-background-tooltip
--color-text-tooltip
--color-border-tooltip
--shadow-tooltip
--border-radius-sm
--space-1
--space-2
--font-size-sm
--font-weight-regular
--z-tooltip (z-index: 9999)
--duration-fast (150ms)
--ease-out
```

**Structure:**

```scss
.tooltip {
  position: absolute;
  z-index: var(--z-tooltip);
  max-width: 200px;
  padding: var(--space-1) var(--space-2);
  background-color: var(--color-background-tooltip);
  color: var(--color-text-tooltip);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-tooltip);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  pointer-events: none;
  opacity: 0;
  transform: scale(0.95);
  transition:
    opacity var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);

  &--visible {
    opacity: 1;
    transform: scale(1);
  }

  // Variants
  &--default {
    /* use default colors */
  }
  &--dark {
    /* darker background */
  }
  &--light {
    /* lighter background */
  }
  &--primary {
    /* primary color background */
  }
  &--error {
    /* error color background */
  }

  // Positions with appropriate transforms
  &--top {
    /* position above */
  }
  &--right {
    /* position to right */
  }
  &--bottom {
    /* position below */
  }
  &--left {
    /* position to left */
  }

  // Arrow
  &__arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: inherit;
    transform: rotate(45deg);

    &--top {
      bottom: -4px;
      left: 50%;
      margin-left: -4px;
    }
    &--right {
      left: -4px;
      top: 50%;
      margin-top: -4px;
    }
    &--bottom {
      top: -4px;
      left: 50%;
      margin-left: -4px;
    }
    &--left {
      right: -4px;
      top: 50%;
      margin-top: -4px;
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    word-wrap: break-word;
  }
}
```

### 6. Barrel Export (`index.ts`)

```typescript
export * from './tooltip.directive';
export * from './tooltip.component';
export * from './tooltip.types';
```

---

## Implementation Details

### Positioning Algorithm

1. **Calculate initial position** based on `position` input
2. **Check viewport boundaries** - Will tooltip overflow?
3. **Auto-adjust if needed** - If position='auto' or would overflow:
   - Try preferred position first
   - Try opposite position
   - Try perpendicular positions
   - Choose position with most space
4. **Apply offset** - Add configured offset from host element
5. **Center tooltip** - Align tooltip center with host center (for top/bottom)
6. **Update actual position** - Set `actualPosition` signal for CSS classes

### Show/Hide Logic

```typescript
private showTimeout: number | null = null;
private hideTimeout: number | null = null;

show(): void {
  if (this.tooltipDisabled()) return;

  // Clear any pending hide
  if (this.hideTimeout) {
    clearTimeout(this.hideTimeout);
    this.hideTimeout = null;
  }

  // Schedule show
  this.showTimeout = setTimeout(() => {
    this.createTooltip();
    this.updatePosition();
    this.tooltipComponent.isVisible.set(true);
  }, this.tooltipShowDelay());
}

hide(): void {
  // Clear any pending show
  if (this.showTimeout) {
    clearTimeout(this.showTimeout);
    this.showTimeout = null;
  }

  // Schedule hide
  this.hideTimeout = setTimeout(() => {
    if (this.tooltipComponent) {
      this.tooltipComponent.isVisible.set(false);
      // Destroy after animation completes
      setTimeout(() => this.destroyTooltip(), 200);
    }
  }, this.tooltipHideDelay());
}
```

### Dynamic Component Creation

```typescript
private createTooltip(): void {
  if (this.tooltipRef) return;

  const injector = this.injector;
  const vcr = this.viewContainerRef;

  // Create component
  this.tooltipRef = vcr.createComponent(TooltipComponent, { injector });

  // Set inputs
  const instance = this.tooltipRef.instance;
  instance.content.set(this.ebTooltip());
  instance.position.set(this.tooltipPosition());
  instance.variant.set(this.tooltipVariant());
  instance.maxWidth.set(this.tooltipMaxWidth());
  instance.showArrow.set(this.tooltipShowArrow());
  instance.customClass.set(this.tooltipCustomClass());
  instance.id.set(this.tooltipId());

  // Append to body for proper positioning
  document.body.appendChild(this.tooltipRef.location.nativeElement);
}

private destroyTooltip(): void {
  if (this.tooltipRef) {
    this.tooltipRef.destroy();
    this.tooltipRef = null;
  }
}
```

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

1. **Keyboard Accessible**
   - Tooltip shows on focus
   - Tooltip hides on blur
   - ESC key dismisses tooltip
   - Tab navigation works correctly

2. **Screen Reader Support**
   - Use `role="tooltip"` on tooltip element
   - Use `aria-describedby` on host element
   - Use `aria-hidden` to hide tooltip from screen readers when not visible
   - Generate unique IDs for `aria-describedby` linkage

3. **Visual Requirements**
   - Color contrast ratio ≥ 4.5:1 for text
   - Do not rely solely on color to convey information
   - Tooltip remains visible on hover/focus
   - Sufficient padding for touch targets (if interactive)

4. **Focus Management**
   - Do not trap focus inside tooltip
   - Return focus to trigger element when dismissed
   - Ensure tooltip doesn't interfere with tab order

5. **Timing**
   - User can dismiss tooltip easily
   - Configurable delays for users who need more time
   - No automatic timeout (unless explicitly configured)

### Aria Attributes

```html
<!-- On host element -->
<button ebTooltip="Save your changes" aria-describedby="tooltip-123">Save</button>

<!-- On tooltip -->
<div id="tooltip-123" role="tooltip" aria-hidden="false">Save your changes</div>
```

---

## Testing Requirements

### Unit Tests (`tooltip.component.spec.ts`)

```typescript
describe('TooltipComponent', () => {
  // Component creation
  it('should create', () => {});

  // Inputs
  it('should display content from input', () => {});
  it('should apply position class', () => {});
  it('should apply variant class', () => {});
  it('should apply custom class', () => {});
  it('should set max-width style', () => {});

  // Visibility
  it('should add visible class when isVisible is true', () => {});
  it('should remove visible class when isVisible is false', () => {});

  // Arrow
  it('should show arrow when showArrow is true', () => {});
  it('should hide arrow when showArrow is false', () => {});
  it('should position arrow based on tooltip position', () => {});

  // Accessibility
  it('should set role="tooltip"', () => {});
  it('should set aria-hidden based on visibility', () => {});
  it('should set id from input', () => {});

  // Theming
  it('should apply correct variant classes for each variant', () => {});
});
```

### Directive Tests (`tooltip.directive.spec.ts`)

```typescript
describe('TooltipDirective', () => {
  // Directive creation
  it('should create', () => {});

  // Show/Hide on hover
  it('should show tooltip on mouseenter', fakeAsync(() => {}));
  it('should hide tooltip on mouseleave', fakeAsync(() => {}));

  // Show/Hide on focus
  it('should show tooltip on focus', fakeAsync(() => {}));
  it('should hide tooltip on blur', fakeAsync(() => {}));

  // Delays
  it('should respect showDelay', fakeAsync(() => {}));
  it('should respect hideDelay', fakeAsync(() => {}));
  it('should cancel show if mouse leaves before delay', fakeAsync(() => {}));

  // Disabled state
  it('should not show tooltip when disabled', () => {});

  // Positioning
  it('should position tooltip at top by default', () => {});
  it('should position tooltip at specified position', () => {});
  it('should auto-adjust position if would overflow viewport', () => {});

  // Accessibility
  it('should set aria-describedby on host', () => {});
  it('should generate unique tooltip ID', () => {});

  // Cleanup
  it('should destroy tooltip on directive destroy', () => {});
  it('should clear timeouts on destroy', () => {});

  // Dynamic content
  it('should update tooltip content when input changes', () => {});

  // Touch support
  it('should show tooltip on click for touch devices', () => {});
  it('should hide tooltip on outside click', () => {});
});
```

### Integration Tests

```typescript
describe('Tooltip Integration', () => {
  it('should work with buttons', () => {});
  it('should work with icons', () => {});
  it('should work with disabled elements', () => {});
  it('should work with multiple tooltips on page', () => {});
  it('should not interfere with keyboard navigation', () => {});
  it('should work correctly when rapidly hovering multiple elements', () => {});
});
```

---

## Storybook Stories

### File: `tooltip.stories.ts`

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { TooltipDirective } from './tooltip.directive';
import { TooltipComponent } from './tooltip.component';

const meta: Meta<TooltipDirective> = {
  title: 'Components/Tooltip',
  component: TooltipDirective,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible tooltip component that displays helpful information on hover or focus.',
      },
    },
  },
  argTypes: {
    ebTooltip: {
      control: 'text',
      description: 'The text content to display in the tooltip',
    },
    tooltipPosition: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left', 'auto'],
      description: 'Position of the tooltip relative to the host element',
    },
    tooltipVariant: {
      control: 'select',
      options: ['default', 'dark', 'light', 'primary', 'error'],
      description: 'Visual variant of the tooltip',
    },
    tooltipShowDelay: {
      control: 'number',
      description: 'Delay in milliseconds before showing tooltip',
    },
    tooltipHideDelay: {
      control: 'number',
      description: 'Delay in milliseconds before hiding tooltip',
    },
    tooltipMaxWidth: {
      control: 'number',
      description: 'Maximum width of tooltip in pixels',
    },
    tooltipDisabled: {
      control: 'boolean',
      description: 'Whether the tooltip is disabled',
    },
    tooltipShowArrow: {
      control: 'boolean',
      description: 'Whether to show the arrow pointing to host',
    },
  },
};

export default meta;
type Story = StoryObj<TooltipDirective>;

// Default story
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button
        [ebTooltip]="ebTooltip"
        [tooltipPosition]="tooltipPosition"
        [tooltipVariant]="tooltipVariant"
        [tooltipShowDelay]="tooltipShowDelay"
        [tooltipHideDelay]="tooltipHideDelay"
        [tooltipMaxWidth]="tooltipMaxWidth"
        [tooltipDisabled]="tooltipDisabled"
        [tooltipShowArrow]="tooltipShowArrow"
        style="margin: 100px;"
      >
        Hover me
      </button>
    `,
  }),
  args: {
    ebTooltip: 'This is a helpful tooltip!',
    tooltipPosition: 'top',
    tooltipVariant: 'default',
    tooltipShowDelay: 200,
    tooltipHideDelay: 0,
    tooltipMaxWidth: 200,
    tooltipDisabled: false,
    tooltipShowArrow: true,
  },
};

// All positions
export const Positions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; margin: 100px; flex-wrap: wrap;">
        <button ebTooltip="Top tooltip" tooltipPosition="top">Top</button>
        <button ebTooltip="Right tooltip" tooltipPosition="right">Right</button>
        <button ebTooltip="Bottom tooltip" tooltipPosition="bottom">Bottom</button>
        <button ebTooltip="Left tooltip" tooltipPosition="left">Left</button>
        <button ebTooltip="Auto positioning" tooltipPosition="auto">Auto</button>
      </div>
    `,
  }),
};

// All variants
export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; margin: 100px; flex-wrap: wrap;">
        <button ebTooltip="Default variant" tooltipVariant="default">Default</button>
        <button ebTooltip="Dark variant" tooltipVariant="dark">Dark</button>
        <button ebTooltip="Light variant" tooltipVariant="light">Light</button>
        <button ebTooltip="Primary variant" tooltipVariant="primary">Primary</button>
        <button ebTooltip="Error variant" tooltipVariant="error">Error</button>
      </div>
    `,
  }),
};

// With long text
export const LongText: Story = {
  render: () => ({
    template: `
      <button
        ebTooltip="This is a very long tooltip text that demonstrates how the tooltip wraps when the content exceeds the maximum width. The text should wrap nicely and remain readable."
        [tooltipMaxWidth]="200"
        style="margin: 100px;"
      >
        Long tooltip
      </button>
    `,
  }),
};

// Without arrow
export const NoArrow: Story = {
  render: () => ({
    template: `
      <button
        ebTooltip="Tooltip without arrow"
        [tooltipShowArrow]="false"
        style="margin: 100px;"
      >
        No arrow
      </button>
    `,
  }),
};

// Disabled
export const Disabled: Story = {
  render: () => ({
    template: `
      <button
        ebTooltip="You won't see this"
        [tooltipDisabled]="true"
        style="margin: 100px;"
      >
        Disabled tooltip
      </button>
    `,
  }),
};

// With delays
export const WithDelays: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; margin: 100px;">
        <button
          ebTooltip="Instant show"
          [tooltipShowDelay]="0"
          [tooltipHideDelay]="0"
        >
          No delay
        </button>
        <button
          ebTooltip="Slow show"
          [tooltipShowDelay]="1000"
          [tooltipHideDelay]="0"
        >
          1s show delay
        </button>
        <button
          ebTooltip="Slow hide"
          [tooltipShowDelay]="0"
          [tooltipHideDelay]="1000"
        >
          1s hide delay
        </button>
      </div>
    `,
  }),
};

// On different elements
export const DifferentElements: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; margin: 100px; align-items: center;">
        <button ebTooltip="Button tooltip">Button</button>
        <a href="#" ebTooltip="Link tooltip" (click)="$event.preventDefault()">Link</a>
        <span ebTooltip="Span tooltip" tabindex="0" style="cursor: pointer;">Span</span>
        <input type="text" ebTooltip="Input tooltip" placeholder="Input" />
        <select ebTooltip="Select tooltip">
          <option>Select</option>
        </select>
      </div>
    `,
  }),
};

// Accessibility demo
export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="margin: 100px;">
        <p style="margin-bottom: 16px;">
          <strong>Accessibility features:</strong>
        </p>
        <ul style="margin-bottom: 24px;">
          <li>✅ Shows on keyboard focus</li>
          <li>✅ Hides on blur</li>
          <li>✅ ESC key dismisses tooltip</li>
          <li>✅ Screen reader support via aria-describedby</li>
          <li>✅ Proper color contrast</li>
        </ul>
        <button ebTooltip="Try navigating with keyboard (Tab and Shift+Tab)">
          Keyboard accessible
        </button>
      </div>
    `,
  }),
};
```

---

## Integration Steps

### Phase 1: File Creation (30 min)

1. Create directory: `src/app/shared/components/tooltip/`
2. Create all files listed in "Files to Create" section
3. Add barrel export to `src/app/shared/components/index.ts`:
   ```typescript
   export * from './tooltip';
   ```

### Phase 2: Implementation (2-3 hours)

1. **Implement types** (`tooltip.types.ts`)
   - Define all TypeScript interfaces and types
   - Document each property

2. **Implement component** (`tooltip.component.ts`)
   - Set up component with OnPush
   - Define all signal inputs
   - Implement computed properties for classes and styles
   - Create template binding logic

3. **Create template** (`tooltip.component.html`)
   - Simple structure with conditional arrow
   - Proper aria attributes

4. **Style component** (`tooltip.component.scss`)
   - BEM methodology
   - Use CSS custom properties
   - All position variants
   - Arrow styling
   - Animation transitions

5. **Implement directive** (`tooltip.directive.ts`)
   - Set up all signal inputs
   - Implement host event listeners
   - Create dynamic component creation logic
   - Implement positioning algorithm
   - Add show/hide with delays
   - Implement cleanup on destroy

### Phase 3: Testing (1-2 hours)

1. **Write component tests** (`tooltip.component.spec.ts`)
   - Test all inputs
   - Test computed properties
   - Test visibility states
   - Test aria attributes

2. **Write directive tests** (`tooltip.directive.spec.ts`)
   - Test show/hide behavior
   - Test event listeners
   - Test delays
   - Test positioning
   - Test cleanup

3. **Run tests and fix issues**
   ```bash
   npm test -- tooltip
   ```

### Phase 4: Storybook (1 hour)

1. **Create stories** (`tooltip.stories.ts`)
   - Implement all stories listed above
   - Test interactivity in Storybook

2. **Verify in Storybook**

   ```bash
   npm run storybook
   ```

3. **Test accessibility**
   - Use axe-core in Storybook
   - Test keyboard navigation
   - Test screen reader announcements

### Phase 5: Documentation (30 min)

1. **Add to component library docs**
   - Usage examples
   - API documentation
   - Accessibility notes

2. **Update README** if needed

3. **Add to CHANGELOG** (when releasing)

---

## CSS Custom Properties Needed

### Add to theme files if not present:

```scss
// Tooltip colors
--color-background-tooltip: var(--color-neutral-900);
--color-text-tooltip: var(--color-neutral-50);
--color-border-tooltip: transparent;

// Tooltip shadow
--shadow-tooltip: var(--shadow-lg);

// Z-index
--z-tooltip: 9999;

// Dark variant
--color-background-tooltip-dark: var(--color-neutral-950);
--color-text-tooltip-dark: var(--color-neutral-50);

// Light variant
--color-background-tooltip-light: var(--color-neutral-50);
--color-text-tooltip-light: var(--color-neutral-900);

// Primary variant
--color-background-tooltip-primary: var(--color-primary-600);
--color-text-tooltip-primary: var(--color-neutral-50);

// Error variant
--color-background-tooltip-error: var(--color-error-600);
--color-text-tooltip-error: var(--color-neutral-50);
```

---

## Usage Examples

### Basic Usage

```html
<button ebTooltip="Save your changes">Save</button>
```

### With Configuration

```html
<button
  ebTooltip="Delete this item permanently"
  tooltipPosition="top"
  tooltipVariant="error"
  [tooltipShowDelay]="500"
  [tooltipMaxWidth]="250"
>
  Delete
</button>
```

### On Icon Buttons

```html
<button ebTooltip="Settings" tooltipPosition="bottom" aria-label="Open settings">
  <eb-icon name="settings" />
</button>
```

### Conditional Tooltip

```html
<button ebTooltip="Action requires authentication" [tooltipDisabled]="isAuthenticated()">
  Protected Action
</button>
```

### With Forms

```html
<input
  type="email"
  ebTooltip="Enter a valid email address"
  tooltipPosition="right"
  placeholder="Email"
/>
```

---

## Edge Cases to Handle

1. **Viewport overflow** - Auto-adjust position
2. **Multiple tooltips** - Only one visible at a time
3. **Disabled elements** - Tooltip won't show on disabled buttons
4. **Touch devices** - Show on tap, hide on tap outside
5. **Rapid hover** - Cancel pending shows/hides
6. **SSR/SSG** - Don't break during server-side rendering
7. **Dynamic content** - Update tooltip when content input changes
8. **Long text** - Wrap text, respect max-width
9. **RTL languages** - Support right-to-left text direction
10. **Tiny screens** - Don't overflow on mobile devices

---

## Success Criteria

- ✅ All unit tests passing
- ✅ All Storybook stories rendering correctly
- ✅ WCAG 2.1 AA compliant (verified with axe)
- ✅ Works on keyboard navigation
- ✅ Works on touch devices
- ✅ No console errors or warnings
- ✅ Follows BEM CSS methodology
- ✅ Uses existing CSS custom properties
- ✅ OnPush change detection
- ✅ Signal-based reactive state
- ✅ Proper TypeScript types
- ✅ Comprehensive documentation

---

## Future Enhancements (Not in initial implementation)

- HTML content support (not just text)
- Custom positioning offsets (x, y)
- Tooltip on disabled elements (wrap in span)
- Animation variants (fade, scale, slide)
- Max height with scroll
- Interactive tooltips (can hover tooltip itself)
- Trigger on click only
- Programmatic control (show/hide via reference)
- Global configuration service
- Tooltip groups (show multiple related tooltips)

---

**End of Implementation Plan**
