# 🎨 Phase 3: Design System & Shared Library Specifications

**Objective:** Implement a production-grade, WCAG AAA compliant component library. This library must be decoupled from the business logic (`features`) and serve as the visual foundation of the application.
**Principle:** "Dumb" components only. They receive data via `inputs()` and emit events via `outputs()`. No direct API calls. All UI state must be strictly typed.

---

## 3.1 Design Tokens & Global Styling

We avoid hardcoded hex values in components. All styling is driven by CSS Variables defined in the global layer.

### **1. Architecture (`src/styles/`)**

- `_variables.scss`: Core palette (primitive colors), spacing units, and breakpoints.
- `_themes.scss`: Semantic mappings (e.g., `--color-bg-primary` maps to `white` in Light Mode and `#121212` in Dark Mode).
- `_typography.scss`: Font stacks, weights, and clamp-based fluid sizing.
- `_reset.scss`: Modern CSS reset (box-sizing, margin removal).

### **2. Theming Strategy**

- **Mechanism:** CSS Custom Properties scoped to `body[data-theme="..."]`.
- **Required Themes:**
  1.  `light` (Default Professional)
  2.  `dark` (Midnight/Dev Mode)
  3.  `high-contrast` (Accessibility First)
  4.  `dim` (Low light / Sepia tone)

---

## 3.2 Component Governance

All components in `src/app/shared/components` must adhere to these strict standards (Angular v21+).

1.  **Signal-Based Inputs:** Use `input.required<T>()` and `input<T>()`.
2.  **Signal-Based Outputs:** Use `output<T>()`.
3.  **Change Detection:** `ChangeDetectionStrategy.OnPush` is mandatory.
4.  **View Encapsulation:** `ViewEncapsulation.Emulated` (Default).
5.  **No External UI Libs:** No Material, No Bootstrap. Pure CSS/SCSS.

---

## 3.3 Atomic Components (Primitives)

Low-level building blocks used by everything else.

### **1. ButtonComponent** (`shared/components/button`)

- **Inputs:** `variant` ('primary' | 'secondary' | 'outline' | 'ghost'), `size` ('sm' | 'md' | 'lg'), `disabled` (boolean), `loading` (boolean).
- **Behavior:** When `loading` is true, disable the button and swap the label for a spinner.
- **Accessibility:** Ensure `aria-label` is passed or inferred.

### **2. IconComponent** (`shared/components/icon`)

- **Inputs:** `name` (Strict union type of available icons), `size` (number/string), `color` (string).
- **Implementation:** Use an SVG sprite approach or raw SVG injection for performance. Avoid large icon font downloads.

### **3. BadgeComponent** (`shared/components/badge`)

- **Inputs:** `variant` ('success' | 'warning' | 'error' | 'info' | 'neutral').
- **Styling:** Pill shape, small caps font.

### **4. SpinnerComponent** (`shared/components/spinner`)

- **Inputs:** `size`, `color`.
- **Animation:** CSS-only keyframe rotation.

---

## 3.4 Layout Molecules

Components that control whitespace and positioning.

### **1. ContainerComponent** (`shared/components/container`)

- **Goal:** Center content with max-width based on breakpoints.
- **Inputs:** `maxWidth` ('sm' | 'md' | 'lg' | 'xl' | 'full').

### **2. StackComponent** (`shared/components/stack`)

- **Goal:** Vertical or horizontal flexbox layout with consistent gaps.
- **Inputs:** `direction` ('row' | 'column'), `gap` (number), `align` ('start' | 'center' | 'end').

### **3. CardComponent** (`shared/components/card`)

- **Slots (Content Projection):**
  - `<div card-header>`
  - `<div card-content>` (Default)
  - `<div card-footer>`
- **Styling:** Border radius, subtle shadow (theme dependent), background color.

---

## 3.5 Form Components (The Hard Part)

Must implement `ControlValueAccessor` (CVA) to work with Reactive Forms.

### **1. InputComponent** (`shared/components/input`)

- **Inputs:** `label`, `placeholder`, `type`, `error` (string | null), `hint`.
- **Features:** Floating label support (optional), show/hide password toggle.

### **2. SelectComponent** (`shared/components/select`)

- **Note:** Custom implementation, do not use native `<select>`.
- **Architecture:**
  - `SelectTrigger`: The button displaying current value.
  - `SelectDropdown`: The overlay panel (using CDK Overlay or simple absolute positioning if adhering to strict "No Deps").
  - `SelectOption`: Individual items.
- **Accessibility:** Keyboard navigation (Arrow Up/Down, Enter to select, Esc to close).

### **3. CheckboxComponent** (`shared/components/checkbox`)

- **Inputs:** `label`, `checked`, `indeterminate`.
- **Styling:** Custom SVG checkmark with transition.

---

## 3.6 Feedback & Overlays

### **1. ToastComponent & ToastService** (`shared/components/toast`)

- **Service API:** `toast.show({ message, type, duration })`.
- **Component:** `ToastContainer` (Fixed position z-index 9999) that loops over active toasts via Signals.
- **Animation:** Slide in from top-right or bottom-right.

### **2. ModalComponent** (`shared/components/modal`)

- **Usage:** `<eb-modal [(open)]="isOpen">...</eb-modal>`.
- **Features:** Backdrop blur, click-outside to close, 'Esc' to close, focus trapping.

### **3. SkeletonComponent** (`shared/components/skeleton`)

- **Inputs:** `width`, `height`, `shape` ('rect' | 'circle').
- **Animation:** Shimmer effect using linear-gradient background.

---

## 3.7 The Theme Picker

### **ThemePickerComponent** (`shared/components/theme-picker`)

- **Dependency:** Injects `ThemeService` (from Core).
- **UI:** A dropdown or grid of color swatches representing the 4 themes.
- **Active State:** Highlights the currently active theme.

---

## 3.8 Storybook Requirements

Every component listed above must have a corresponding `.stories.ts` file.

- **Format:** Component Story Format (CSF) v3.
- **Required Stories:**
  - `Default`: Base state.
  - `Variations`: (e.g., Primary vs Secondary buttons).
  - `Interactive`: Play function to demonstrate click/hover/focus.
  - `Accessibility`: Ensure `a11y` addon passes.

---

## 3.9 Execution Checklist

1.  [ ] **Global Styles:** Setup Variables, Mixins, and Themes SCSS.
2.  [ ] **Atoms:** Build Button, Icon, Badge, Spinner + Stories.
3.  [ ] **Layout:** Build Container, Stack, Grid, Divider + Stories.
4.  [ ] **Molecules:** Build Card, Breadcrumb + Stories.
5.  [ ] **Forms (CVA):** Build Input, Select, Checkbox, Textarea + Stories.
6.  [ ] **Feedback:** Build Toast system, Modal, Skeleton + Stories.
7.  [ ] **Theme:** Build ThemePicker and verify switching works.
8.  [ ] **Verification:** Run `npm run storybook` and verify all components render correctly in all 4 themes.
