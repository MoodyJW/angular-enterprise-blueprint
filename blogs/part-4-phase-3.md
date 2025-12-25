# Phase 3: The Design System

## Building a Production-Grade Component Library from Scratch

In the previous articles, I covered the tooling foundation (Phase 1) and the invisible architecture that powers the application (Phase 2). With ESLint boundaries enforcing strict layering, comprehensive error handling, and a signal-based authentication system in place, the infrastructure was ready. Phase 3 shifts focus to what users actually see: the design system.

A design system is more than a collection of buttons and inputs. It's a shared visual language that ensures consistency across an entire application. In enterprise contexts, design systems become the contract between designers and developers—a single source of truth that eliminates ambiguity about how components should look and behave.

This phase builds that foundation from scratch: no Material, no Bootstrap, no external component libraries. Every component is hand-crafted with CSS custom properties, BEM methodology, and WCAG AAA accessibility as the baseline. The result is a library of 24 components that work together seamlessly across six themes, with full Storybook documentation and comprehensive test coverage.

## The Philosophy: Presentational Components Only

Before writing any component code, I established a strict rule: shared components must be "dumb." They receive data through inputs and emit events through outputs. They never fetch data, never call APIs, and never contain business logic. This principle is enforced by [ESLint boundary rules](eslint.config.mjs) that prevent shared components from importing feature-specific code.

This constraint isn't arbitrary. Presentational components are inherently more reusable because they make no assumptions about where their data comes from. A `ButtonComponent` that accepts a `loading` input works equally well in a login form, a checkout flow, or a settings panel. If that button contained logic to determine its own loading state, it would be coupled to a specific use case and impossible to reuse elsewhere.

The boundary enforcement goes further. Shared components can only import from other shared code—they cannot reach into core services or feature modules. This ensures the design system remains a self-contained library that could theoretically be extracted into a separate package.

## Design Tokens: The Foundation of Theming

Every visual property in the design system derives from CSS custom properties defined in a central location. Colors, spacing, typography, shadows, and animations are all tokenized. This approach enables theming without touching component code—switching themes simply means updating custom property values.

The token architecture lives in [`src/styles/themes/`](src/styles/themes/) and follows a layered approach:

```scss
// _variables.scss - Primitive values
:root {
  // Spacing scale
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;

  // Typography
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;

  // Transitions
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

These primitive tokens define the raw values. Semantic tokens then map these primitives to meaningful contexts:

```scss
// _light-default.scss - Semantic mappings for light theme
[data-theme='light-default'] {
  --color-text: var(--gray-900);
  --color-text-secondary: var(--gray-600);
  --color-surface: var(--white);
  --color-surface-hover: var(--gray-50);
  --color-border: var(--gray-200);
  --color-primary: var(--blue-600);
  --color-focus: var(--blue-500);
}
```

Components reference semantic tokens exclusively. A button uses `var(--color-primary)` for its background, not a specific hex value. When the theme changes, the button automatically updates because the underlying custom property values change.

### Six Themes for Every Context

The design system supports six complete themes, each targeting different use cases:

1. **Daylight** (`light-default`): The professional default with neutral grays and accessible contrast ratios
2. **Sunrise** (`light-warm`): Warmer tones for a friendlier feel, using amber and warm gray palette
3. **Midnight** (`dark-default`): A deep dark theme optimized for low-light environments
4. **Twilight** (`dark-cool`): Cool-toned dark theme with blue undertones
5. **High Contrast Light** (`high-contrast-light`): Maximum contrast for users with visual impairments
6. **High Contrast Dark** (`high-contrast-dark`): Dark mode with enhanced contrast ratios

The high-contrast themes aren't afterthoughts. They're designed from the ground up to meet WCAG AAA contrast requirements (7:1 for normal text, 4.5:1 for large text). This matters because accessibility isn't optional in enterprise software—it's often a legal requirement.

Theme switching is handled by the [`ThemeService`](src/app/core/services/theme/theme.service.ts) built in Phase 2. The service sets a `data-theme` attribute on the document element, and CSS selectors handle the rest. Transitions between themes are smooth by default but respect `prefers-reduced-motion` for users who need it:

```scss
// Global smooth theme transition
* {
  transition: var(--theme-transition);
}

@media (prefers-reduced-motion: reduce) {
  * {
    --theme-transition: none;
    transition: none !important;
  }
}
```

## Component Architecture: Angular v20+ Patterns

Every component in the design system follows Angular v20+ best practices. This means standalone components by default, signal-based inputs and outputs, OnPush change detection, and functional patterns throughout.

### Signal-Based Inputs

Angular's `input()` and `output()` functions replace the traditional `@Input()` and `@Output()` decorators. The benefits are significant: better type inference, required inputs without workarounds, and seamless integration with signals.

Here's the pattern used throughout the design system, exemplified by the [`ButtonComponent`](src/app/shared/components/button/button.component.ts):

```typescript
@Component({
  selector: 'eb-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly ariaLabel = input.required<string>();

  readonly clicked = output<MouseEvent>();

  readonly isInteractive = computed(() => !this.disabled() && !this.loading());

  readonly buttonClasses = computed(() => {
    const classes = ['btn', `btn--${this.variant()}`, `btn--${this.size()}`];
    if (this.disabled()) classes.push('btn--disabled');
    if (this.loading()) classes.push('btn--loading');
    return classes.join(' ');
  });
}
```

Several patterns emerge here:

1. **Required inputs with `input.required()`**: The `ariaLabel` is required because buttons must be accessible. The compiler enforces this—templates that omit the aria label won't compile.

2. **Computed signals for derived state**: The `buttonClasses` signal derives from multiple inputs. When any input changes, the computed value automatically updates. No manual subscription management.

3. **Boolean expressions with `computed()`**: The `isInteractive` signal combines `disabled` and `loading` states. Components can bind to this single signal rather than repeating the logic.

### OnPush Change Detection

Every component uses `ChangeDetectionStrategy.OnPush`. This means Angular only checks the component when its inputs change or when an event occurs within the component. Combined with signals, this results in extremely efficient change detection.

The practical benefit: the design system scales to applications with hundreds of component instances without performance degradation. Traditional change detection would check every component on every browser event; OnPush checks only what's necessary.

### Standalone by Default

Angular v20+ defaults to standalone components, so the decorator no longer needs `standalone: true`. This aligns with Angular's direction toward simpler, more composable components. Each component explicitly declares its dependencies in the `imports` array:

```typescript
@Component({
  selector: 'eb-button',
  imports: [CommonModule, ButtonContentComponent],
  // ...
})
```

This explicit dependency declaration makes components self-documenting. Looking at the component file tells you exactly what it depends on, with no need to trace module hierarchies.

## The Component Catalog

Phase 3 delivered 24 components across four categories: atoms, layout, forms, and feedback. Each component has a dedicated Storybook story documenting its variants and usage patterns.

### Atoms: The Building Blocks

The atomic components are the smallest units of the design system. They're intentionally simple, handling single responsibilities with minimal configuration.

**ButtonComponent** ([source](src/app/shared/components/button/button.component.ts)): Five variants (primary, secondary, tertiary, ghost, danger), three sizes, loading states with spinner integration, and full keyboard accessibility. The component handles icon positioning, full-width layouts, and icon-only buttons for toolbars.

**IconComponent** ([source](src/app/shared/components/icon/icon.component.ts)): Integrates with Heroicons, providing access to 200+ SVG icons. Icons are inlined for performance and support size, color inheritance, and decorative vs. meaningful ARIA modes. The icon registry is tree-shakable—only imported icons are bundled.

**BadgeComponent** ([source](src/app/shared/components/badge/badge.component.ts)): Semantic variants (success, warning, error, info) for status indicators. Badges can be standalone or attached to other elements. The component handles text truncation and optional dismiss functionality.

**SpinnerComponent** ([source](src/app/shared/components/spinner/spinner.component.ts)): A CSS-only loading indicator with smooth animation. No JavaScript animation loops, no library dependencies. The spinner inherits the current text color, so it works in any context without additional configuration.

### Layout Components

Layout components handle spacing, alignment, and responsive behavior. They're compositional—meant to wrap other components rather than display content directly.

**ContainerComponent** ([source](src/app/shared/components/container/container.component.ts)): A responsive wrapper with max-width constraints and horizontal padding. The container centers content and prevents it from stretching uncomfortably wide on large screens.

**StackComponent** ([source](src/app/shared/components/stack/stack.component.ts)): A flexbox-based component for vertical or horizontal stacking with consistent spacing. The spacing input accepts semantic values (`sm`, `md`, `lg`) that map to the spacing scale:

```typescript
private readonly _spacingClassMap: Record<StackSpacing, string> = {
  none: 'spacing-none',
  xs: 'space-1',
  sm: 'space-2',
  md: 'space-3',
  lg: 'space-4',
  xl: 'space-5',
};
```

This mapping keeps component APIs semantic (developers think in terms of "medium spacing") while CSS uses the numeric scale.

**GridComponent** ([source](src/app/shared/components/grid/grid.component.ts)): CSS Grid with responsive column configuration. The component accepts column counts at different breakpoints, handling the media query complexity internally.

**DividerComponent** ([source](src/app/shared/components/divider/divider.component.ts)): Horizontal and vertical dividers with spacing options. A small component, but essential for visual separation in complex layouts.

**CardComponent** ([source](src/app/shared/components/card/card.component.ts)): A container with header, content, and footer slots. Cards support variants for different visual treatments and optional interactive states for clickable cards.

### Form Components

Form components are where complexity increases significantly. They need to integrate with Angular's forms system, handle validation states, support accessibility requirements, and maintain consistent styling across all states.

**InputComponent** ([source](src/app/shared/components/input/input.component.ts)): The foundational text input with full feature coverage. Supports multiple types (text, email, password, tel, url, search, number), three sizes, validation states with visual feedback, helper text, character counting, and prefix/suffix slots.

The component uses a two-way binding pattern with signals:

```typescript
readonly value = input<string>('');
readonly valueChange = output<string>();

handleInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  this.valueChange.emit(value);
}
```

This enables both template-driven and reactive forms patterns while maintaining signal-based reactivity.

**SelectComponent** ([source](src/app/shared/components/select/select.component.ts)): A custom dropdown that replaces the native `<select>` element. The custom implementation enables consistent styling across browsers and full keyboard navigation. Arrow keys navigate options, Enter selects, Escape closes the dropdown.

**CheckboxComponent** ([source](src/app/shared/components/checkbox/checkbox.component.ts)): Custom-styled checkboxes with support for indeterminate state. The component handles the complexity of hiding the native checkbox while maintaining accessibility, using ARIA attributes and proper labeling.

**TextareaComponent** ([source](src/app/shared/components/textarea/textarea.component.ts)): Multi-line text input with auto-resize capability and character counting. The component calculates optimal height based on content, preventing awkward scrollbars in most cases.

**RadioGroupComponent** ([source](src/app/shared/components/radio-group/radio-group.component.ts)): A group of radio buttons with proper ARIA roles and keyboard navigation within the group. Arrow keys move selection, which matches native radio button behavior.

**ToggleComponent** ([source](src/app/shared/components/toggle/toggle.component.ts)): A switch control for boolean settings. Toggles are more intuitive than checkboxes for on/off settings and work better on touch devices.

### Feedback Components

Feedback components communicate system state to users. They handle success messages, errors, loading states, and user confirmations.

**ToastComponent** and **ToastService** ([source](src/app/shared/components/toast/)): A notification system with stacked toasts, auto-dismiss, and manual dismissal. The service provides a simple API for showing notifications:

```typescript
this.toastService.success('Changes saved successfully');
this.toastService.error('Failed to save changes');
this.toastService.warning('Your session will expire soon');
```

Toasts stack from the bottom of the viewport and automatically dismiss after a configurable duration. Users can dismiss early by clicking the close button.

**ModalComponent** ([source](src/app/shared/components/modal/modal.component.ts)): A dialog component with focus trapping, backdrop, and keyboard handling. When a modal opens, focus moves inside; when it closes, focus returns to the trigger element. The Escape key closes the modal. These behaviors are WCAG requirements for accessible dialogs.

**SkeletonComponent** ([source](src/app/shared/components/skeleton/skeleton.component.ts)): Loading placeholders with shimmer animation. Skeletons improve perceived performance by showing content structure before data loads. The component supports text, circular, and rectangular variants.

**TabsComponent** ([source](src/app/shared/components/tabs/tabs.component.ts)): Accessible tab panels with proper ARIA roles. Arrow keys navigate between tab buttons, Enter/Space activates tabs, and the tab panel content updates accordingly.

## The ThemePicker: Bringing Theming to Users

The capstone component of Phase 3 is the [`ThemePickerComponent`](src/app/shared/components/theme-picker/theme-picker.component.ts), which gives users control over theme selection. This component integrates with the ThemeService to persist preferences and applies changes in real-time.

The picker supports three display variants:

1. **Dropdown**: A compact picker for headers and toolbars
2. **Grid**: A visual grid showing all themes with preview swatches
3. **Inline**: A horizontal row for settings panels

Each theme displays as a color swatch—a gradient showing the theme's primary colors. This visual preview helps users understand what they're selecting without needing to read theme names:

```typescript
const THEME_PREVIEW_COLORS: Record<ThemeCategory, string> = {
  light: 'linear-gradient(135deg, #ffffff 50%, #f0f0f0 50%)',
  dark: 'linear-gradient(135deg, #1a1a2e 50%, #16213e 50%)',
  'high-contrast-light': 'linear-gradient(135deg, #ffffff 50%, #000000 50%)',
  'high-contrast-dark': 'linear-gradient(135deg, #000000 50%, #ffffff 50%)',
};
```

The dropdown variant implements full keyboard navigation. Arrow keys move through options, Enter selects, Escape closes the dropdown, Home jumps to the first option, and End jumps to the last. This matches the expected behavior of native select elements and meets WCAG keyboard accessibility requirements.

The component also supports grouping themes by category (Light, Dark, High Contrast), which helps users find themes that match their preference when there are many options.

## Accessibility as a Core Requirement

Accessibility isn't a feature in this design system—it's a constraint. Every component is designed from the start to meet WCAG 2.1 AA compliance, with many components meeting the stricter AAA requirements.

### ARIA Attributes

Components include appropriate ARIA attributes for screen readers. Buttons announce their state (`aria-busy` when loading, `aria-pressed` for toggles). Form inputs associate with their labels via `id` and `for` attributes. Interactive elements have `aria-expanded`, `aria-haspopup`, and `aria-selected` where appropriate.

The theme picker demonstrates comprehensive ARIA usage:

```html
<div
  role="listbox"
  [attr.aria-label]="ariaLabel()"
  [attr.aria-activedescendant]="currentTheme().id"
>
  <button role="option" [attr.aria-selected]="theme.id === currentTheme().id">
    <!-- theme option content -->
  </button>
</div>
```

### Keyboard Navigation

Every interactive component works without a mouse. Focus indicators are visible and consistent. Tab order follows logical reading order. Composite widgets (tabs, radio groups, dropdowns) implement arrow key navigation within the component.

### Color Contrast

All color combinations meet minimum contrast ratios. The design tokens were selected specifically to ensure text remains readable against backgrounds in all themes. The high-contrast themes exceed minimum requirements, providing 7:1 contrast for normal text.

### Motion Preferences

Animations respect `prefers-reduced-motion`. Users who need reduced motion see instant transitions instead of animated ones. This is implemented at the global level, so individual components don't need special handling.

## Testing the Design System

Each component has a corresponding spec file with comprehensive tests. The test strategy focuses on three areas: rendering, interaction, and accessibility.

**Rendering tests** verify that components display correctly with various input combinations. Does the button show a loading spinner when `loading` is true? Does the input display helper text when provided?

**Interaction tests** verify behavior. Does clicking the button emit the `clicked` event? Does pressing Escape close the dropdown? Does typing in the input update the value?

**Accessibility tests** verify ARIA attributes and keyboard behavior. Does the button have the correct `aria-label`? Can the select be operated entirely with keyboard? Does focus move correctly in the modal?

The [`ThemePickerComponent` tests](src/app/shared/components/theme-picker/theme-picker.component.spec.ts) demonstrate this approach with 48 tests covering all three areas:

```typescript
describe('Keyboard Navigation', () => {
  it('should open dropdown with Enter key');
  it('should navigate options with Arrow keys');
  it('should select with Enter key');
  it('should close with Escape key');
  it('should go to first option with Home key');
  it('should go to last option with End key');
});

describe('Accessibility', () => {
  it('should have aria-label');
  it('should have role listbox');
  it('should have aria-expanded on dropdown trigger');
  it('should have role option on each theme option');
  it('should have aria-selected on active option');
});
```

Across all 24 components, Phase 3 adds over 400 new tests to the suite. Combined with the infrastructure tests from Phase 2, the application now has approximately 1,900 passing tests.

## Storybook: The Living Documentation

Every component has a Storybook story file that documents its API and usage patterns. Storybook serves multiple purposes:

1. **Component catalog**: Developers can browse available components and see them in action
2. **Visual testing**: Components are visible in isolation, making visual bugs obvious
3. **Documentation**: Each story demonstrates a specific use case or variant
4. **Accessibility auditing**: Storybook's a11y addon runs automated accessibility checks

The [`theme-picker.component.stories.ts`](src/app/shared/components/theme-picker/theme-picker.component.stories.ts) file demonstrates the pattern:

```typescript
export default {
  title: 'Shared/ThemePicker',
  component: ThemePickerComponent,
  tags: ['autodocs'],
} as Meta<ThemePickerComponent>;

export const Default: Story = {};

export const GridVariant: Story = {
  args: { variant: 'grid' },
};

export const InHeaderContext: Story = {
  render: () => ({
    template: `
      <header style="display: flex; justify-content: space-between;">
        <span>My App</span>
        <eb-theme-picker size="sm" />
      </header>
    `,
  }),
};
```

Stories range from simple variant demonstrations to complex contextual examples showing how components integrate into real layouts.

## Bundle Size Discipline

Enterprise applications must load quickly, which means watching bundle sizes carefully. During Phase 3, I optimized component SCSS to keep individual component bundles under 4KB. This involved:

- Consolidating redundant selectors
- Removing verbose comments from production SCSS
- Using CSS custom properties instead of repeated values
- Eliminating unused style rules

The build process includes bundle budgets that fail if any component exceeds size thresholds. This catches size regressions before they reach production.

## Lessons Learned

Building a design system from scratch reinforced several principles:

**Start with tokens, not components.** The temptation is to build the fun stuff (buttons, modals) first. But without a token system, you end up with inconsistent values scattered throughout component SCSS. Defining the token architecture first makes everything downstream easier.

**Accessibility constraints improve design.** Designing for keyboard navigation and screen readers forces you to think about component structure more carefully. The resulting components are cleaner and more logical, not just more accessible.

**Signals simplify component state.** Previous Angular projects used services with BehaviorSubjects or complex OnPush strategies with async pipes. Signals make reactive state trivial—computed values update automatically, templates bind directly to signal values, and there's no subscription management.

**Storybook catches issues early.** Seeing components in isolation reveals problems that aren't visible when components are buried in application pages. Spacing issues, color contrast problems, and responsive breakpoint bugs become obvious in Storybook.

**Test behavior, not implementation.** Component tests that verify implementation details (checking specific CSS classes, for example) break when you refactor. Tests that verify behavior (clicking a button emits an event) remain stable through refactoring.

## What's Next

With Phase 3 complete, the application has a full visual vocabulary. Twenty-four components cover the needs of typical enterprise applications: navigation, forms, feedback, and layout. The theming system supports six themes with easy extensibility for more. Everything is tested, documented, and accessible.

Phase 4 will assemble these components into the application shell—the header, footer, and navigation that frame the content. The theme picker will integrate into the header, giving users easy access to theme switching. The authentication state from Phase 2 will connect to the navigation, showing appropriate options based on login status.

The design system's real value will become clear in Phase 5 when features consume these components. A login form needs inputs, buttons, and validation states. A data table needs cards, badges, and loading skeletons. Because the design system handles these concerns consistently, feature development can focus on business logic rather than visual details.

You can explore the complete Phase 3 implementation on GitHub: [MoodyJW/angular-enterprise-blueprint](https://github.com/MoodyJW/angular-enterprise-blueprint)

---

_Next in series: Phase 4 Deep Dive – The Application Shell and Navigation_
