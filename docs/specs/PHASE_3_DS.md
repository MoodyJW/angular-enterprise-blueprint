# Phase 3: Design System & Shared Library Specifications

**Objective:** Implement a production-grade, WCAG AAA compliant component library. This library must be decoupled from the business logic (`features`) and serve as the visual foundation of the application.
**Principle:** "Dumb" components only. They receive data via `inputs()` and emit events via `outputs()`. No direct API calls. All UI state must be strictly typed.

---

## 3.1 Design Tokens & Global Styling - COMPLETED

All styling is driven by CSS Variables defined in the global layer.

### **Architecture (`src/styles/`)**

- `_variables.scss`: Core palette (primitive colors), spacing units, and breakpoints.
- `_themes.scss`: Semantic mappings for 6 themes (light-default, light-warm, dark-default, dark-cool, high-contrast-light, high-contrast-dark).
- `_typography.scss`: Font stacks, weights, and clamp-based fluid sizing.
- `_reset.scss`: Modern CSS reset (box-sizing, margin removal).

### **Theming Strategy**

- **Mechanism:** CSS Custom Properties scoped to `body[data-theme="..."]`.
- **Implemented Themes:**
  1. `light-default` (Default Professional)
  2. `light-warm` (Warm tones)
  3. `dark-default` (Midnight/Dev Mode)
  4. `dark-cool` (Cool dark tones)
  5. `high-contrast-light` (Accessibility First - Light)
  6. `high-contrast-dark` (Accessibility First - Dark)

---

## 3.2 Component Governance

All components in `src/app/shared/components` must adhere to these strict standards (Angular v20+).

1. **Standalone Default:** Angular v20+ defaults `standalone: true`. Do NOT explicitly set it in decorators.
2. **Signal-Based Inputs:** Use `input.required<T>()` and `input<T>()`.
3. **Signal-Based Outputs:** Use `output<T>()`.
4. **Change Detection:** `ChangeDetectionStrategy.OnPush` is mandatory.
5. **View Encapsulation:** `ViewEncapsulation.Emulated` (Default).
6. **No External UI Libs:** No Material, No Bootstrap. Pure CSS/SCSS.

---

## 3.3-3.6 Component Implementation - COMPLETED

All atomic components, layout molecules, form components, and feedback/overlay components have been implemented:

### Atoms (Primitives)

- [x] ButtonComponent - All variants, sizes, loading states
- [x] IconComponent - Heroicons integration with 200+ icons
- [x] BadgeComponent - All semantic variants
- [x] SpinnerComponent - CSS-only animation

### Layout Molecules

- [x] ContainerComponent - Responsive max-width
- [x] StackComponent - Flexbox with semantic spacing
- [x] GridComponent - CSS Grid with responsive columns
- [x] DividerComponent - Horizontal/vertical with variants
- [x] CardComponent - Header/content/footer slots

### Form Components (CVA)

- [x] InputComponent - All input types, validation states
- [x] SelectComponent - Custom dropdown with keyboard nav
- [x] CheckboxComponent - Custom styling, indeterminate
- [x] TextareaComponent - Auto-resize, character count
- [x] RadioGroupComponent - Accessible radio buttons
- [x] ToggleComponent - Switch control

### Feedback & Overlays

- [x] ToastComponent & ToastService - Stacked notifications
- [x] ModalComponent - Focus trap, backdrop, ESC close
- [x] SkeletonComponent - Shimmer animation
- [x] TabsComponent - Accessible tab panels

---

## 3.7 Remaining Work

### Task 1: Component Cleanup - Remove Redundant `standalone: true`

Angular v20+ defaults `standalone: true`, making explicit declarations redundant. Remove from these 24 components:

#### Atoms

1. `src/app/shared/components/badge/badge.component.ts`
2. `src/app/shared/components/button/button.component.ts`
3. `src/app/shared/components/icon/icon.component.ts`
4. `src/app/shared/components/spinner/spinner.component.ts`

#### Layout

5. `src/app/shared/components/container/container.component.ts`
6. `src/app/shared/components/divider/divider.component.ts`
7. `src/app/shared/components/grid/grid.component.ts`
8. `src/app/shared/components/stack/stack.component.ts`
9. `src/app/shared/components/card/card.component.ts`

#### Form Controls

10. `src/app/shared/components/checkbox/checkbox.component.ts`
11. `src/app/shared/components/checkbox-checkmark/checkbox-checkmark.component.ts`
12. `src/app/shared/components/input/input.component.ts`
13. `src/app/shared/components/input-footer/input-footer.component.ts`
14. `src/app/shared/components/radio-group/radio-group.component.ts`
15. `src/app/shared/components/select/select.component.ts`
16. `src/app/shared/components/textarea/textarea.component.ts`
17. `src/app/shared/components/toggle/toggle.component.ts`

#### Feedback & Overlays

18. `src/app/shared/components/modal/modal.component.ts`
19. `src/app/shared/components/skeleton/skeleton.component.ts`
20. `src/app/shared/components/toast/toast.component.ts`
21. `src/app/shared/components/toast/toast-container.component.ts`

#### Navigation

22. `src/app/shared/components/breadcrumb/breadcrumb.component.ts`
23. `src/app/shared/components/tabs/tabs.component.ts`
24. `src/app/shared/components/tabs/tab.component.ts`

**Action:** For each file, remove `standalone: true,` from the `@Component` decorator.

---

### Task 2: ThemePickerComponent Implementation

#### Component Overview

The ThemePickerComponent provides a user interface for selecting application themes. It integrates with the existing `ThemeService` to persist and apply theme selections.

#### File Structure

```
src/app/shared/components/theme-picker/
├── index.ts
├── theme-picker.component.ts
├── theme-picker.component.html
├── theme-picker.component.scss
├── theme-picker.component.spec.ts
└── README.md
```

#### Component API

```typescript
// theme-picker.component.ts
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';
import { ThemeId } from '@core/services/theme.types';
import { IconComponent } from '../icon';

export type ThemePickerVariant = 'dropdown' | 'grid' | 'inline';
export type ThemePickerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'eb-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrl: './theme-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerComponent {
  private readonly _themeService = inject(ThemeService);

  /**
   * Display variant
   * - dropdown: Compact dropdown menu (default)
   * - grid: Grid of theme swatches
   * - inline: Horizontal row of options
   */
  readonly variant = input<ThemePickerVariant>('dropdown');

  /**
   * Size of the picker
   */
  readonly size = input<ThemePickerSize>('md');

  /**
   * Whether to show theme labels
   */
  readonly showLabels = input<boolean>(true);

  /**
   * Whether to group themes by category
   */
  readonly groupByCategory = input<boolean>(false);

  /**
   * ARIA label for accessibility
   */
  readonly ariaLabel = input<string>('Select theme');

  /**
   * Current theme from service
   */
  readonly currentTheme = this._themeService.currentTheme;

  /**
   * All available themes
   */
  readonly themes = this._themeService.themes;

  /**
   * Themes grouped by category (light, dark, high-contrast)
   */
  readonly groupedThemes = computed(() => {
    return {
      light: this._themeService.getThemesByCategory('light'),
      dark: this._themeService.getThemesByCategory('dark'),
      highContrast: this._themeService.getThemesByCategory('high-contrast'),
    };
  });

  /**
   * Whether dropdown is open (for dropdown variant)
   */
  readonly isOpen = signal<boolean>(false);

  /**
   * Select a theme
   */
  selectTheme(themeId: ThemeId): void {
    this._themeService.setTheme(themeId);
    this.isOpen.set(false);
  }

  /**
   * Toggle dropdown
   */
  toggleDropdown(): void {
    this.isOpen.update((open) => !open);
  }

  /**
   * Close dropdown
   */
  closeDropdown(): void {
    this.isOpen.set(false);
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(event: KeyboardEvent): void {
    // Implement arrow key navigation, Enter to select, Escape to close
  }
}
```

#### Template Structure

```html
<!-- theme-picker.component.html -->
<div
  class="theme-picker"
  [class]="pickerClasses()"
  [attr.aria-label]="ariaLabel()"
  role="listbox"
  [attr.aria-activedescendant]="currentTheme().id"
>
  @switch (variant()) { @case ('dropdown') {
  <button
    type="button"
    class="theme-picker__trigger"
    [attr.aria-expanded]="isOpen()"
    [attr.aria-haspopup]="'listbox'"
    (click)="toggleDropdown()"
    (keydown)="handleKeydown($event)"
  >
    <span class="theme-picker__swatch" [style.background]="currentTheme().preview"></span>
    @if (showLabels()) {
    <span class="theme-picker__label">{{ currentTheme().name }}</span>
    }
    <eb-icon name="heroChevronDown" size="sm" [decorative]="true" />
  </button>

  @if (isOpen()) {
  <div class="theme-picker__dropdown" role="listbox">
    @if (groupByCategory()) { @for (category of ['light', 'dark', 'highContrast']; track category) {
    <div class="theme-picker__group">
      <span class="theme-picker__group-label">{{ category }}</span>
      @for (theme of groupedThemes()[category]; track theme.id) {
      <button
        type="button"
        class="theme-picker__option"
        [class.theme-picker__option--active]="theme.id === currentTheme().id"
        role="option"
        [attr.aria-selected]="theme.id === currentTheme().id"
        (click)="selectTheme(theme.id)"
      >
        <span class="theme-picker__swatch" [style.background]="theme.preview"></span>
        <span class="theme-picker__option-label">{{ theme.name }}</span>
        @if (theme.id === currentTheme().id) {
        <eb-icon name="heroCheck" size="sm" [decorative]="true" />
        }
      </button>
      }
    </div>
    } } @else { @for (theme of themes(); track theme.id) {
    <button
      type="button"
      class="theme-picker__option"
      [class.theme-picker__option--active]="theme.id === currentTheme().id"
      role="option"
      [attr.aria-selected]="theme.id === currentTheme().id"
      (click)="selectTheme(theme.id)"
    >
      <span class="theme-picker__swatch" [style.background]="theme.preview"></span>
      @if (showLabels()) {
      <span class="theme-picker__option-label">{{ theme.name }}</span>
      }
    </button>
    } }
  </div>
  } } @case ('grid') {
  <div class="theme-picker__grid">
    @for (theme of themes(); track theme.id) {
    <button
      type="button"
      class="theme-picker__grid-item"
      [class.theme-picker__grid-item--active]="theme.id === currentTheme().id"
      role="option"
      [attr.aria-selected]="theme.id === currentTheme().id"
      [attr.aria-label]="theme.name"
      (click)="selectTheme(theme.id)"
    >
      <span
        class="theme-picker__swatch theme-picker__swatch--large"
        [style.background]="theme.preview"
      ></span>
      @if (showLabels()) {
      <span class="theme-picker__grid-label">{{ theme.name }}</span>
      }
    </button>
    }
  </div>
  } @case ('inline') {
  <div class="theme-picker__inline" role="radiogroup">
    @for (theme of themes(); track theme.id) {
    <button
      type="button"
      class="theme-picker__inline-option"
      [class.theme-picker__inline-option--active]="theme.id === currentTheme().id"
      role="radio"
      [attr.aria-checked]="theme.id === currentTheme().id"
      [attr.aria-label]="theme.name"
      (click)="selectTheme(theme.id)"
    >
      <span class="theme-picker__swatch" [style.background]="theme.preview"></span>
    </button>
    }
  </div>
  } }
</div>
```

#### Styling (BEM)

```scss
// theme-picker.component.scss
.theme-picker {
  position: relative;
  display: inline-block;

  // Trigger button
  &__trigger {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: border-color var(--duration-fast) var(--ease-out);

    &:hover {
      border-color: var(--color-border-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--color-focus);
      outline-offset: 2px;
    }
  }

  // Color swatch preview
  &__swatch {
    width: 20px;
    height: 20px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);

    &--large {
      width: 40px;
      height: 40px;
    }
  }

  // Dropdown panel
  &__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: var(--z-dropdown);
    min-width: 200px;
    margin-top: var(--space-1);
    padding: var(--space-2);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
  }

  // Individual option
  &__option {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    width: 100%;
    padding: var(--space-2) var(--space-3);
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    text-align: left;
    transition: background-color var(--duration-fast) var(--ease-out);

    &:hover {
      background: var(--color-surface-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--color-focus);
      outline-offset: -2px;
    }

    &--active {
      background: var(--color-primary-subtle);
    }
  }

  // Grid variant
  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-3);
  }

  &__grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3);
    background: transparent;
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: border-color var(--duration-fast) var(--ease-out);

    &:hover {
      border-color: var(--color-border);
    }

    &:focus-visible {
      outline: 2px solid var(--color-focus);
      outline-offset: 2px;
    }

    &--active {
      border-color: var(--color-primary);
    }
  }

  // Inline variant
  &__inline {
    display: flex;
    gap: var(--space-2);
  }

  &__inline-option {
    padding: var(--space-1);
    background: transparent;
    border: 2px solid transparent;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: border-color var(--duration-fast) var(--ease-out);

    &:hover {
      border-color: var(--color-border);
    }

    &:focus-visible {
      outline: 2px solid var(--color-focus);
      outline-offset: 2px;
    }

    &--active {
      border-color: var(--color-primary);
    }
  }

  // Size modifiers
  &--sm {
    .theme-picker__trigger {
      padding: var(--space-1) var(--space-2);
      font-size: var(--text-sm);
    }
    .theme-picker__swatch {
      width: 16px;
      height: 16px;
    }
  }

  &--lg {
    .theme-picker__trigger {
      padding: var(--space-3) var(--space-4);
      font-size: var(--text-lg);
    }
    .theme-picker__swatch {
      width: 24px;
      height: 24px;
    }
  }
}
```

#### Accessibility Requirements

1. **Keyboard Navigation:**
   - `Tab` to focus the picker
   - `Enter/Space` to open dropdown
   - `Arrow Up/Down` to navigate options
   - `Enter` to select option
   - `Escape` to close dropdown

2. **ARIA Attributes:**
   - `role="listbox"` on container
   - `role="option"` on each theme option
   - `aria-selected` on options
   - `aria-activedescendant` on container
   - `aria-expanded` on dropdown trigger
   - `aria-haspopup="listbox"` on trigger

3. **Focus Management:**
   - Focus trap within open dropdown
   - Return focus to trigger on close
   - Visible focus indicators

4. **Screen Reader:**
   - Announce current theme
   - Announce theme changes
   - Clear option labels

#### Test Cases

```typescript
// theme-picker.component.spec.ts
describe('ThemePickerComponent', () => {
  // Rendering
  it('should render with default dropdown variant');
  it('should render grid variant');
  it('should render inline variant');
  it('should display current theme');
  it('should show all available themes');

  // Interactions
  it('should open dropdown on click');
  it('should close dropdown on outside click');
  it('should select theme on option click');
  it('should close dropdown after selection');
  it('should update ThemeService on selection');

  // Keyboard
  it('should open dropdown with Enter key');
  it('should navigate options with Arrow keys');
  it('should select with Enter key');
  it('should close with Escape key');

  // Accessibility
  it('should have correct ARIA attributes');
  it('should announce theme changes');
  it('should have visible focus indicators');

  // Variants
  it('should group themes by category when groupByCategory is true');
  it('should hide labels when showLabels is false');
  it('should apply size classes');
});
```

#### Storybook Stories

```typescript
// theme-picker.stories.ts
export default {
  title: 'Components/ThemePicker',
  component: ThemePickerComponent,
} as Meta<ThemePickerComponent>;

export const Default: Story = {};

export const GridVariant: Story = {
  args: { variant: 'grid' },
};

export const InlineVariant: Story = {
  args: { variant: 'inline' },
};

export const GroupedByCategory: Story = {
  args: { variant: 'dropdown', groupByCategory: true },
};

export const WithoutLabels: Story = {
  args: { variant: 'grid', showLabels: false },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <eb-theme-picker size="sm" />
        <eb-theme-picker size="md" />
        <eb-theme-picker size="lg" />
      </div>
    `,
  }),
};
```

---

## 3.8 Storybook Requirements - COMPLETED

Every component has a corresponding `.stories.ts` file following CSF v3 format.

---

## 3.9 Execution Checklist

1. [x] **Global Styles:** Setup Variables, Mixins, and Themes SCSS.
2. [x] **Atoms:** Build Button, Icon, Badge, Spinner + Stories.
3. [x] **Layout:** Build Container, Stack, Grid, Divider + Stories.
4. [x] **Molecules:** Build Card, Breadcrumb + Stories.
5. [x] **Forms (CVA):** Build Input, Select, Checkbox, Textarea + Stories.
6. [x] **Feedback:** Build Toast system, Modal, Skeleton + Stories.
7. [ ] **Cleanup:** Remove redundant `standalone: true` from 24 components.
8. [ ] **Theme:** Build ThemePicker and verify switching works.
9. [ ] **Verification:** Run `npm run storybook` and verify all components render correctly in all 6 themes.
