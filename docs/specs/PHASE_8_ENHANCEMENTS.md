# ✨ Phase 8: Enhancements & New Features

**Status:** Not Started
**Goal:** Refactor existing components for better consistency, then add new capabilities and features to enhance the portfolio presentation and user experience.

**Principles:**

- Build on the solid foundation established in Phases 1-7
- Maintain consistency with existing design system
- Ensure all new features meet WCAG 2.1 AA standards
- Focus on portfolio presentation and user engagement

**Phase Organization:**

Phase 8 is organized into two parts:

1. **Part A: Refactoring & Improvements (8.1-8.5)**
   - Refactor existing components for consistency
   - Fix styling and visibility issues
   - Improve existing UX patterns

2. **Part B: New Features (8.6-8.12)**
   - Add new functionality
   - Expand capabilities
   - Enhance portfolio presentation

## Component Reuse Strategy

**IMPORTANT:** Before creating new components, leverage the existing design system in `src/app/shared/components/`.

### Components to Reuse (NOT Create New)

The following existing components should be reused instead of creating new ones:

1. **CardComponent** → Use for BlogCardComponent and MetricCardComponent
   - Already has variants (default, elevated, outlined, filled)
   - Supports clickable, hoverable, full-width modes
   - Has proper ARIA attributes and keyboard navigation
   - Located at: [card.component.ts](../src/app/shared/components/card/card.component.ts)

2. **GridComponent** → Use for MetricGridComponent layout
   - Responsive grid system already implemented
   - Located at: [grid.component.ts](../src/app/shared/components/grid/grid.component.ts)

3. **BadgeComponent** → Use for status indicators (NOT filter chips)
   - Designed for passive status/count displays
   - Located at: [badge.component.ts](../src/app/shared/components/badge/badge.component.ts)

4. **ThemePickerComponent** → Modify for ThemeMenuComponent
   - Already has theme selection logic
   - Refactor to icon-only trigger variant
   - Located at: [theme-picker.component.ts](../src/app/shared/components/theme-picker/theme-picker.component.ts)

### New Components to Create

Only create these genuinely new components with unique functionality:

1. **FilterChipsComponent** (Section 8.10)
   - **Why new:** Interactive multi-select filter UI is distinct from passive BadgeComponent
   - **Justification:** Reused across ModulesListComponent and AdrListComponent
   - **Key difference:** Active filtering vs. passive status display
   - Multi-select toggle behavior, chip removal, "Clear all" functionality

2. **UserMenuComponent** (Section 8.7)
   - **Why new:** Dropdown menu with account header and logout specific behavior
   - **Justification:** Unique authentication-related UI pattern

3. **DashboardMetricsComponent** (Section 8.12)
   - **Why new:** Smart component for fetching and orchestrating metrics data
   - **Note:** Uses existing CardComponent for individual metric displays

4. **BlogListComponent** (Section 8.11)
   - **Why new:** Smart component with blog-specific state and filtering logic
   - **Note:** Uses existing CardComponent for article previews

5. **BlogDetailComponent** (Section 8.11)
   - **Why new:** Smart component with markdown rendering and article-specific features

### Component Audit Summary

Current shared components inventory (26 total):

- ✅ Badge, Button, Card, Checkbox, Grid, Input, Modal, Radio, Select, Textarea, Toast, ThemePicker, etc.
- All components follow BEM methodology, WCAG 2.1 AA standards, and theme system integration

**Principle:** Maximize reuse to maintain consistency, reduce maintenance burden, and accelerate development.

### Benefits of This Strategy

By reusing existing components instead of creating duplicates:

1. **Consistency:** All cards, grids, and badges look and behave the same across features
2. **Maintenance:** Bug fixes and improvements benefit all use cases, not just one
3. **Development Speed:** Less code to write, test, and document
4. **Bundle Size:** Smaller production bundles (no duplicate component code)
5. **Design System Integrity:** Reinforces the shared component library as single source of truth
6. **Accessibility:** Reuses battle-tested, WCAG-compliant implementations

**Result:** Phase 8 creates only 3 new shared components (FilterChips, UserMenu, DashboardMetrics) instead of the originally planned 6+, reducing development time while improving quality.

---

## 8.1 Checkbox Component Icon Refactor

**Current:** Checkbox uses CheckboxCheckmarkComponent with conditional icon rendering (check/minus icons for checked/indeterminate, nothing for unchecked)
**Target:** Use two distinct icons - one for unchecked box and one for checked box - to improve visual clarity and consistency

### Overview

Refactor the checkbox component to use icon-based rendering for both checked and unchecked states. This will improve the visual appearance across all 6 themes, provide better consistency with the design system, and simplify the component logic.

### Current Implementation

The current checkbox uses:

- Native HTML checkbox input with custom styling
- `CheckboxCheckmarkComponent` that conditionally shows icons only when checked/indeterminate
- CSS-based box rendering for the unchecked state
- Located at: [checkbox.component.ts](../src/app/shared/components/checkbox/checkbox.component.ts)

### Proposed Changes

**Icon Strategy (Using Material Icons):**

1. **Unchecked state:** Use `matCheckBoxOutlineBlank` - outline empty square box
2. **Checked state:** Use `matCheckBox` - filled square with checkmark
3. **Indeterminate state:** Use `matIndeterminateCheckBox` - square with minus/dash line

**Why Material Icons:**

- Provides dedicated checkbox-specific icons (`matCheckBox`, `matCheckBoxOutlineBlank`, `matIndeterminateCheckBox`)
- Perfect semantic naming for checkbox UI patterns
- Designed specifically for form controls and checkboxes
- Consistent visual style with Material Design principles
- Need to install `@ng-icons/material-icons` package

**Component Updates:**

- **CheckboxCheckmarkComponent** ([checkbox-checkmark.component.ts](../src/app/shared/components/checkbox/checkbox-checkmark/checkbox-checkmark.component.ts))
  - Update to always show an icon (not conditionally)
  - Add logic to display `matCheckBoxOutlineBlank` when `!checked && !indeterminate`
  - Update icon imports from Heroicons to Material Icons
  - Icon mapping:
    - `heroCheck` → `matCheckBox`
    - `heroMinus` → `matIndeterminateCheckBox`
    - New: `matCheckBoxOutlineBlank`

- **CheckboxComponent** ([checkbox.component.ts](../src/app/shared/components/checkbox/checkbox.component.ts))
  - Update SCSS to remove CSS-based box rendering
  - Simplify styles to focus on layout and spacing
  - Ensure proper color theming for all icon states

- **ICON_NAMES Constants** (if applicable)
  - Add new Material icon names to `src/app/shared/constants/icon-names.ts` if using centralized icon name constants

### Benefits

1. **Visual Consistency:** Icons provide clearer visual feedback across all themes
2. **Accessibility:** Icon states are more distinct, improving usability for users with visual impairments
3. **Maintainability:** Removes complex CSS for custom checkbox rendering
4. **Theme Compliance:** Icons automatically inherit theme colors and contrast ratios
5. **Simplified Logic:** Clearer state representation with dedicated icons

### Implementation Steps

1. Install `@ng-icons/material-icons` package
   ```bash
   npm install @ng-icons/material-icons@^33.0.0
   ```
2. Update `CheckboxCheckmarkComponent` to:
   - Replace Heroicons imports with Material Icons
   - Import `matCheckBox`, `matCheckBoxOutlineBlank`, `matIndeterminateCheckBox`
   - Update `iconName()` computed to return appropriate Material icon for each state
   - Remove conditional `showIcon()` - always show icon
3. Update `checkbox.component.scss` to remove CSS-based box rendering
4. Update Storybook stories to showcase new icon-based states
5. Update unit tests for both components to verify icon selection logic
6. Visual regression testing across all 6 themes
7. Update component documentation and JSDoc comments

### Acceptance Criteria

- [ ] Unchecked state displays `matCheckBoxOutlineBlank` icon
- [ ] Checked state displays `matCheckBox` icon
- [ ] Indeterminate state displays `matIndeterminateCheckBox` icon
- [ ] All three states visually distinct and clear
- [ ] `@ng-icons/material-icons` package installed and configured
- [ ] Icons properly themed across all 6 themes (especially high-contrast)
- [ ] Color contrast meets WCAG 2.1 AA standards in all states
- [ ] Focus states clearly visible with proper outline
- [ ] Hover states provide visual feedback
- [ ] Disabled states have reduced opacity and proper cursor
- [ ] All existing checkbox tests pass with updates
- [ ] Storybook updated with all state variants
- [ ] No visual regressions in components using checkbox
- [ ] Keyboard navigation unchanged (Space to toggle, Tab to navigate)
- [ ] Screen reader announcements unchanged

### Files to Update

1. `src/app/shared/components/checkbox/checkbox-checkmark/checkbox-checkmark.component.ts`
2. `src/app/shared/components/checkbox/checkbox.component.scss`
3. `src/app/shared/components/checkbox/checkbox.component.spec.ts`
4. `src/app/shared/components/checkbox/checkbox-checkmark/checkbox-checkmark.component.spec.ts`
5. `src/app/shared/components/checkbox/checkbox.stories.ts`
6. Update any visual snapshots if using snapshot testing

### Testing Strategy

- Unit tests: Verify icon selection logic for all states
- Visual tests: Storybook chromatic tests across themes
- Integration tests: Verify in actual form usage (login, settings, etc.)
- Accessibility tests: axe DevTools validation in Storybook
- Cross-browser testing: Ensure icons render consistently

---

## 8.2 Radio Component Icon Refactor

**Current:** Radio uses CSS-based circle rendering for radio button states
**Target:** Use Material Icons for checked and unchecked states - `matRadioButtonChecked` and `matRadioButtonUnchecked`

### Overview

Refactor the radio component to use icon-based rendering for both checked and unchecked states, matching the checkbox icon refactor approach. This will improve visual consistency across form controls and provide better theming support.

### Current Implementation

The current radio component uses:

- Native HTML radio input with custom CSS styling
- CSS-based circle rendering for checked/unchecked states
- Located at: [radio.component.ts](../src/app/shared/components/radio/radio.component.ts)

### Proposed Changes

**Icon Strategy (Using Material Icons):**

1. **Unchecked state:** Use `matRadioButtonUnchecked` - outline empty circle
2. **Checked state:** Use `matRadioButtonChecked` - filled circle with inner dot

**Why Material Icons:**

- Matches checkbox icon refactor approach for consistency
- Provides dedicated radio button-specific icons
- Perfect semantic naming (`matRadioButtonChecked`, `matRadioButtonUnchecked`)
- Designed specifically for form controls
- Same `@ng-icons/material-icons` package already used for checkbox

**Component Updates:**

- **Create RadioButtonIconComponent** (similar to CheckboxCheckmarkComponent)
  - New presentational component for radio icon rendering
  - Location: `src/app/shared/components/radio/radio-button-icon/`
  - Props: `checked: boolean`
  - Imports Material Icons via `provideIcons`
  - Icon logic:
    - `checked === true` → `matRadioButtonChecked`
    - `checked === false` → `matRadioButtonUnchecked`

- **RadioComponent** ([radio.component.ts](../src/app/shared/components/radio/radio.component.ts))
  - Integrate `RadioButtonIconComponent` in template
  - Update SCSS to remove CSS-based circle rendering
  - Simplify styles to focus on layout and spacing
  - Ensure proper color theming for all icon states

### Benefits

1. **Visual Consistency:** Icons provide clearer visual feedback across all themes
2. **Form Control Parity:** Radio buttons match checkbox implementation pattern
3. **Maintainability:** Removes complex CSS for custom radio rendering
4. **Theme Compliance:** Icons automatically inherit theme colors and contrast ratios
5. **Simplified Logic:** Clearer state representation with dedicated icons

### Implementation Steps

1. Material Icons package already installed from checkbox refactor (8.1)
2. Create `RadioButtonIconComponent`:
   - Import `matRadioButtonChecked` and `matRadioButtonUnchecked`
   - Implement icon selection logic based on `checked` prop
   - Add proper ARIA attributes (`aria-hidden="true"`)
3. Update `radio.component.ts` to integrate new icon component
4. Update `radio.component.scss` to remove CSS-based circle rendering
5. Update Storybook stories to showcase new icon-based states
6. Update unit tests for RadioComponent and RadioButtonIconComponent
7. Visual regression testing across all 6 themes
8. Update component documentation and JSDoc comments

### Acceptance Criteria

- [ ] Unchecked state displays `matRadioButtonUnchecked` icon
- [ ] Checked state displays `matRadioButtonChecked` icon
- [ ] Both states visually distinct and clear
- [ ] Icons properly themed across all 6 themes (especially high-contrast)
- [ ] Color contrast meets WCAG 2.1 AA standards in all states
- [ ] Focus states clearly visible with proper outline
- [ ] Hover states provide visual feedback
- [ ] Disabled states have reduced opacity and proper cursor
- [ ] All existing radio tests pass with updates
- [ ] Storybook updated with all state variants
- [ ] No visual regressions in components using radio buttons
- [ ] Keyboard navigation unchanged (Arrow keys in radio group, Space to select)
- [ ] Screen reader announcements unchanged
- [ ] Radio groups function correctly with new implementation

### Files to Update

1. `src/app/shared/components/radio/radio-button-icon/radio-button-icon.component.ts` (NEW)
2. `src/app/shared/components/radio/radio-button-icon/radio-button-icon.component.spec.ts` (NEW)
3. `src/app/shared/components/radio/radio.component.ts`
4. `src/app/shared/components/radio/radio.component.html`
5. `src/app/shared/components/radio/radio.component.scss`
6. `src/app/shared/components/radio/radio.component.spec.ts`
7. `src/app/shared/components/radio/radio.stories.ts`
8. `src/app/shared/components/radio/index.ts` (export RadioButtonIconComponent)

### Testing Strategy

- Unit tests: Verify icon selection logic for checked/unchecked states
- Visual tests: Storybook chromatic tests across themes
- Integration tests: Verify in radio groups and forms
- Accessibility tests: axe DevTools validation in Storybook
- Cross-browser testing: Ensure icons render consistently

### Design Considerations

**Icon Sizing:**

- Radio icons should match checkbox icon sizes
- Size variants (sm, md, lg) must be consistent with checkbox

**Color Strategy:**

- Unchecked: Use muted color (--color-text-muted or --color-border)
- Checked: Use primary color (--color-primary)
- Disabled: Use disabled color (--color-text-disabled)
- Focus: Add focus ring with --color-focus-ring

---

## 8.3 Card Visibility Improvements in Light Themes

**Current:** Cards in light themes have poor visibility - background and surface colors are identical (#ffffff), borders are very light (#e2e8f0), and shadows are too subtle
**Target:** Improve card contrast and visibility in light themes while maintaining WCAG AA compliance

### Problem Analysis

**Light Default Theme Issues:**

- `--color-background: #ffffff` (page background)
- `--color-surface: #ffffff` (card background) - **Same as background!**
- `--color-border: #e2e8f0` - Very light gray, barely visible
- `--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)` - Only 5% opacity, nearly invisible

**Result:** Cards blend into the page background, making it difficult to distinguish card boundaries, especially for the `default` variant which relies on subtle shadows.

### Proposed Solution

Update light theme color variables to create better visual separation between surfaces:

**Option 1: Differentiate Surface from Background**

- Keep `--color-background: #ffffff` (pure white page)
- Change `--color-surface: #f8fafc` (very light blue-gray for cards)
- Increase `--color-border` darkness slightly: `#cbd5e1` → `#94a3b8`
- Enhance shadows: `rgba(0, 0, 0, 0.05)` → `rgba(0, 0, 0, 0.08)`

**Option 2: Subtle Background Tint**

- Change `--color-background: #f8fafc` (very light gray page)
- Keep `--color-surface: #ffffff` (white cards)
- Maintain current border and shadow values

**Recommendation:** Option 2 is preferred because:

- White cards on light gray background is a proven pattern
- Maintains accessibility (cards remain high contrast)
- Minimal changes to existing color system
- Better aligns with common design patterns (GitHub, Tailwind docs, etc.)

### Changes Required

**Light Default Theme** (`_light-default.scss`):

```scss
// Surface colors
--color-background: #f8fafc; // Change from #ffffff
--color-surface: #ffffff;
--color-surface-hover: #f8fafc;
--color-surface-active: #f1f5f9;
--color-surface-elevated: #ffffff;

// Optional: Slightly darker border for better visibility
--color-border: #cbd5e1; // Keep current, or darken to #94a3b8

// Optional: Enhance shadows slightly
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.08); // From 0.05
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.12), 0 2px 4px -2px rgba(0, 0, 0, 0.08); // From 0.1
```

**Light Warm Theme** (`_light-warm.scss`):

- Apply same pattern with warm color palette
- `--color-background: #fef9f5` (warm off-white)
- `--color-surface: #ffffff`

**High Contrast Light Theme** (`_high-contrast-light.scss`):

- Verify existing contrast is sufficient (likely already correct)
- May need stronger borders/shadows for maximum distinction

### Card Component Updates (Optional)

**If theme changes aren't sufficient**, enhance card variants:

```scss
// card.component.scss - Add stronger default elevation
&--default {
  box-shadow: var(--shadow-md); // From shadow-sm for better visibility
  border: 1px solid var(--color-border); // Add subtle border as fallback

  &.card--hoverable:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
}

&--elevated {
  box-shadow: var(--shadow-lg); // From shadow-md

  &.card--hoverable:hover {
    box-shadow: var(--shadow-xl);
    transform: translateY(-4px);
  }
}
```

### Implementation Steps

1. **Analyze current card usage** across the app
   - Audit all pages with cards (Home, Profile, Modules, ADRs, etc.)
   - Screenshot cards in all 6 themes for comparison
2. **Update light theme variables**
   - Modify `_light-default.scss` with new background/surface colors
   - Modify `_light-warm.scss` with warm equivalents
   - Verify `_high-contrast-light.scss` doesn't need changes
3. **Test across all card variants**
   - Default, Elevated, Outlined, Filled variants in Storybook
   - Verify clickable, hoverable, and padding variations
4. **Validate WCAG compliance**
   - Run axe DevTools on all themes
   - Verify color contrast ratios (background vs. surface, text on surface, etc.)
   - Ensure focus states remain visible
5. **Cross-component testing**
   - Verify cards in all features (Dashboard, Profile, Modules, ADRs)
   - Check nested components (buttons, badges inside cards)
   - Test responsive layouts (mobile, tablet, desktop)
6. **Optional: Adjust card component SCSS** if theme changes insufficient
7. **Update Storybook documentation**
   - Add notes about theme-based card visibility
   - Document when to use each variant

### Acceptance Criteria

- [ ] Cards clearly distinguishable from page background in light themes
- [ ] `--color-background` and `--color-surface` have visible difference (at least 2-3 shades)
- [ ] Border visibility improved (if needed) without being too prominent
- [ ] Shadow enhancements provide depth without being too heavy
- [ ] All 6 themes tested and cards visible in each
- [ ] WCAG 2.1 AA contrast ratios maintained for all text on cards
- [ ] Focus states remain clearly visible on all card variants
- [ ] No visual regressions in dark themes or high-contrast themes
- [ ] Card variants (default, elevated, outlined, filled) each have distinct appearance
- [ ] Hover states provide clear visual feedback
- [ ] Mobile responsive layouts unaffected
- [ ] Storybook stories demonstrate improved visibility
- [ ] All existing card tests pass without modification

### Files to Update

1. `src/styles/themes/_light-default.scss` (primary changes)
2. `src/styles/themes/_light-warm.scss` (apply same pattern)
3. `src/styles/themes/_high-contrast-light.scss` (verify/adjust if needed)
4. `src/app/shared/components/card/card.component.scss` (optional, if theme changes insufficient)
5. `src/app/shared/components/card/card.stories.ts` (update documentation)

### Testing Strategy

- Visual comparison: Before/after screenshots in all 6 themes
- Storybook: Test all card variants with theme switcher
- Accessibility: axe DevTools validation across themes
- User testing: Get feedback on card visibility improvements
- Cross-browser: Verify shadow rendering (Safari, Firefox, Chrome)

### Design Considerations

**Background Color Selection:**

- Too dark: Reduces overall "light theme" feel
- Too similar to surface: No improvement
- Sweet spot: `#f8fafc` to `#f1f5f9` range (barely perceptible but effective)

**Shadow Opacity:**

- Current 5% opacity is common in modern design but may be too subtle
- 8-10% opacity provides better depth without being heavy
- Consider using layered shadows (multiple shadow definitions) for richer depth

**Border Strategy:**

- Borders are fallback for when shadows aren't visible (print, high contrast, etc.)
- Very light borders (#e2e8f0) work when background/surface differ
- Darker borders (#cbd5e1 or #94a3b8) needed when colors are too similar

---

## 8.4 Toast Component Visual Improvements

**Current:**

- Dismiss button is empty block (no icon)
- Status badge/dot may be too large

**Target:**

- Replace empty dismiss button with X/close icon
- Reduce size of status badge/dot for better visual balance

### Changes

**Modify:** `ToastComponent`

```typescript
// Add icon to dismiss button
<button class="toast__dismiss" (click)="dismiss()">
  <eb-icon name="close" size="sm" [ariaLabel]="'Dismiss notification'" />
</button>
```

```scss
// Adjust badge size
.toast__badge {
  width: 8px; // Reduce from current size
  height: 8px; // Reduce from current size
}
```

### Acceptance Criteria

- [ ] Dismiss button shows X/close icon
- [ ] Icon is appropriately sized and visible
- [ ] Badge/dot size reduced and visually balanced
- [ ] ARIA label on dismiss button
- [ ] Works in all 6 themes
- [ ] Color contrast meets WCAG AA
- [ ] Storybook story updated

---

## 8.5 Profile Stats Caching

**Reference:** `/docs/PROFILE_STATS_CACHING_PLAN.md`

**Current:** Stats refetch on every navigation to profile page
**Target:** Persist stats across navigation (app-level store provider)

### Actions

1. Create `provideProfileStore()` in `profile.store.provider.ts`
2. Move provider from `ProfileComponent` to `app.config.ts`
3. Update unit tests to mock app-level store
4. Implement cache invalidation strategy

### Acceptance Criteria

- [ ] Stats persist when navigating away and back
- [ ] No API re-fetch within 1 hour cache window
- [ ] Cache clears on hard refresh
- [ ] All tests pass
- [ ] No memory leaks from store persistence

---

## 8.6 Header Theme Picker UI

**Current:** Full theme picker showing selected theme
**Target:** Icon-only button (paint palette/theme icon) → opens theme menu

### Components

**ThemePickerComponent Enhancement** (Modify Existing)

- **Why modify existing:** Theme selection logic already implemented
- Add icon-only variant mode (`compact: true` or similar)
- Keep existing full picker for other use cases
- Shows all 6 themes with visual previews (already has this)
- Current theme highlighted (already has this)
- Theme name and description (already has this)
- Located at: `src/app/shared/components/theme-picker/`

**Changes:**

- **Modify:** `ThemePickerComponent` (add compact/icon-only mode)
- **Modify:** `HeaderComponent` (use compact variant)

### Acceptance Criteria

- [ ] Icon button with tooltip ("Change theme")
- [ ] Menu shows all themes with visual previews
- [ ] Current theme has checkmark/highlight
- [ ] Keyboard accessible
- [ ] Click outside to close
- [ ] Mobile responsive
- [ ] Smooth theme transitions

---

## 8.7 Header Authentication UI

**Current:** Username text + logout button (takes up horizontal space)
**Target:** User profile icon → opens dropdown menu

### Components

**UserMenuComponent** (New Shared Component)

- **Why new:** Dropdown menu pattern with authentication-specific behavior
- Dropdown menu with account name header
- Logout option
- Future: Settings, Profile links
- Uses Angular CDK Overlay for positioning and accessibility
- Located at: `src/app/shared/components/user-menu/`

**Changes:**

- **Modify:** `HeaderComponent` (replace text/button with icon button)
- **Create:** `UserMenuComponent` as reusable shared component

### Acceptance Criteria

- [ ] Icon displays when authenticated
- [ ] Menu opens/closes on click, Escape, outside-click
- [ ] Keyboard accessible (Tab, Enter, Arrow keys)
- [ ] Mobile responsive
- [ ] ARIA attributes for accessibility
- [ ] Smooth animations (respects `prefers-reduced-motion`)

---

## 8.8 Profile Page Resume Button Layout

**Current:** Resume buttons inside profile card (feels cramped)
**Target:** Move buttons to separate section below card

### Changes

- Move `<eb-button>` elements outside profile card
- Create `.profile-actions` section below card
- Add "Resume" section heading
- Improve spacing and visual hierarchy

### Acceptance Criteria

- [ ] Buttons below card in left column
- [ ] Section has clear heading
- [ ] Mobile responsive (buttons stack or go full-width)
- [ ] ARIA labels on all buttons
- [ ] Proper focus management
- [ ] Consistent with design system spacing

---

## 8.9 Home Page Portfolio Branding

**Current:** Generic "System Status" dashboard (no personal branding)
**Target:** Add hero section with name, title, tagline

### Layout Options

- **A:** Hero above dashboard
- **B:** Split (bio left, dashboard right) ← Recommended
- **C:** Branded header bar above dashboard

### Content Structure

```typescript
interface PortfolioHero {
  readonly name: string;
  readonly title: string;
  readonly tagline: string;
  readonly bio: string;
  readonly cta: readonly {
    readonly label: string;
    readonly route: string;
  }[];
}
```

### Example Content

```typescript
{
  name: 'Jay [Last Name]',
  title: 'Senior Angular Architect',
  tagline: 'Building Enterprise-Grade Applications with Modern Angular',
  bio: 'Welcome to my Angular Enterprise Blueprint - a production-ready reference architecture demonstrating modern Angular best practices, enterprise patterns, and scalable design.',
  cta: [
    { label: 'View Projects', route: '/modules' },
    { label: 'Read Articles', route: '/blog' },
    { label: 'Contact Me', route: '/contact' }
  ]
}
```

### Acceptance Criteria

- [ ] Name prominently displayed
- [ ] Professional title/tagline clear
- [ ] CTA buttons to key sections
- [ ] Maintains dashboard functionality
- [ ] i18n support for all text
- [ ] Mobile responsive (hero stacks on mobile)
- [ ] Professional appearance in all 6 themes

---

## 8.10 Modules & ADR List Filtering

**Current:** Search only, no category/tag filtering
**Target:** Filter chips for technologies, categories, status

### Components

**FilterChipsComponent** (New Shared Component)

- **Why new:** Interactive multi-select filter UI distinct from passive BadgeComponent
- **Key difference from Badge:** Active filtering with toggle behavior vs. passive status display
- **Reuse justification:** Used in both ModulesListComponent and AdrListComponent
- Multi-select chip filter with toggle on click
- Individual chip removal with × button
- "Clear all" functionality when filters active
- Keyboard navigation (Tab, Enter/Space to toggle)
- Props: `chips: FilterChip[]`, `multiSelect: boolean`, `ariaLabel: string`
- Outputs: `chipToggled: FilterChip`, `cleared: void`
- Located at: `src/app/shared/components/filter-chips/`

**Data Model:**

```typescript
export interface FilterChip {
  readonly id: string;
  readonly label: string;
  readonly selected: boolean;
  readonly category?: string; // Optional grouping
}
```

### Changes

**Modify:** `ModulesListComponent`

- Add technology filter (Angular, React, TypeScript, Node.js, etc.)
- Add category filter (Frontend, Backend, Full-stack, etc.)
- Combine with existing search

**Modify:** `AdrListComponent`

- Add category filter (Architecture, Security, Performance, etc.)
- Add status filter (Accepted, Proposed, Deprecated, Superseded)
- Combine with existing search

### Filter Examples

```typescript
// Modules
{ id: 'angular', label: 'Angular', category: 'technology' }
{ id: 'typescript', label: 'TypeScript', category: 'technology' }
{ id: 'frontend', label: 'Frontend', category: 'category' }

// ADRs
{ id: 'architecture', label: 'Architecture', category: 'category' }
{ id: 'accepted', label: 'Accepted', category: 'status' }
```

### Acceptance Criteria

- [ ] FilterChipsComponent created and reusable
- [ ] Filters work in combination with search
- [ ] "Clear all" button when filters active
- [ ] Filter state persists during session
- [ ] Keyboard accessible
- [ ] Mobile responsive (chips wrap)
- [ ] Visual feedback for selected chips
- [ ] Smooth animations

---

## 8.11 Blog Feature Module

**Reference:** New feature for displaying technical articles

### Overview

Create a complete blog feature to showcase technical writing and thought leadership. The blog will display articles written during the project phases and future content.

### Components

**BlogListComponent** (Smart Component)

- Grid/list view of all blog articles
- Search functionality (filter by title, excerpt, tags)
- Category filter chips (Angular, Architecture, Performance, etc.)
- Pagination or infinite scroll
- Sort by date, title, or reading time
- Card-based layout with featured image, title, excerpt, date, reading time, and tags

**BlogDetailComponent** (Smart Component)

- Full article view with markdown rendering
- Table of contents (auto-generated from headings)
- Estimated reading time
- Publication date and last updated date
- Author information
- Tag list with links to filtered views
- Previous/Next article navigation
- Social sharing buttons (optional)
- Syntax highlighting for code blocks

**Article Card Display**

- **Use existing CardComponent** with `clickable` and `hoverable` props
- Pass article data (title, excerpt, date, readingTime, tags, featuredImage) via content projection
- No need for separate BlogCardComponent - leverage design system
- CardComponent already handles hover states, accessibility, and responsive layout

### Data Model

```typescript
interface BlogArticle {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly content: string; // Markdown content
  readonly featuredImage?: string;
  readonly author: {
    readonly name: string;
    readonly title: string;
  };
  readonly publishedAt: Date;
  readonly updatedAt?: Date;
  readonly readingTimeMinutes: number;
  readonly tags: readonly string[];
  readonly category: BlogCategory;
  readonly status: 'draft' | 'published';
}

type BlogCategory =
  | 'angular'
  | 'architecture'
  | 'performance'
  | 'testing'
  | 'deployment'
  | 'security'
  | 'design-system';
```

### State Management

**BlogStore** (NgRx SignalStore)

- `withState`: articles[], selectedArticle, filters, loading, error
- `withComputed`: filteredArticles, categories, tags
- `withMethods`: loadArticles, loadArticle, setFilters, clearFilters
- Data source: `src/assets/data/blog-articles.json`

### Routes

```typescript
{
  path: 'blog',
  children: [
    { path: '', component: BlogListComponent },
    { path: ':slug', component: BlogDetailComponent }
  ]
}
```

### Initial Content

Migrate existing blog articles from phase completion:

1. Phase 1: Angular Enterprise Blueprint Setup
2. Phase 2: Core Architecture Design
3. Phase 3: Design System Implementation
4. Phase 4: Application Shell
5. Phase 5: Feature Module Development
6. Phase 6: Deployment & Optimization
7. Phase 7: Technical Debt Management (to be written)

### Technical Requirements

- **Markdown Rendering**: Use a markdown library (e.g., `marked` or `ngx-markdown`)
- **Syntax Highlighting**: Code blocks with syntax highlighting (e.g., `highlight.js`)
- **SEO**: Dynamic meta tags per article (title, description, OG tags)
- **Analytics**: Track article views and reading time
- **i18n**: Translatable UI elements (article content can remain in English initially)
- **Accessibility**: Proper heading hierarchy, skip links, keyboard navigation

### Acceptance Criteria

- [ ] BlogStore created with full CRUD operations
- [ ] BlogListComponent with search, filter, and sort
- [ ] BlogDetailComponent with markdown rendering and syntax highlighting
- [ ] All existing phase articles migrated to JSON format
- [ ] Routes configured and lazy-loaded
- [ ] SEO meta tags dynamic per article
- [ ] Storybook stories for BlogCardComponent
- [ ] Unit tests for store and components (85%+ coverage)
- [ ] E2E tests for navigation and filtering
- [ ] Mobile responsive design
- [ ] WCAG 2.1 AA compliant

---

## 8.12 Enhanced Dashboard Metrics

**Current:** Basic dashboard with build status, test coverage, last deployment
**Target:** Comprehensive metrics dashboard showcasing code quality and project health

### Overview

Expand the home dashboard to display real, actionable metrics that demonstrate code quality, documentation coverage, and overall project health. This makes the portfolio more impressive and provides useful information at a glance.

### New Metrics to Add

**Code Quality Metrics:**

1. **Documentation Coverage (Compodoc)**
   - Parse `documentation.json` to extract coverage percentage
   - Display percentage with visual indicator (progress bar or gauge)
   - Show number of documented vs. total components/services
   - Link to full Compodoc documentation

2. **Test Coverage Details**
   - Expand beyond single percentage
   - Show breakdown: Statements, Branches, Functions, Lines
   - Visual indicators for each metric
   - Trend indicator (if coverage increased/decreased)

3. **Bundle Size**
   - Parse build stats to show main bundle size
   - Show gzipped size
   - Indicator if within budget thresholds
   - Link to bundle analyzer

4. **Linting Status**
   - Show ESLint warning/error count (0 is goal)
   - Prettier formatting status
   - Last lint run timestamp

5. **Dependency Health**
   - Total dependencies count
   - Outdated packages count
   - Security vulnerabilities count (from npm audit)
   - Link to dependency review

6. **Storybook Coverage**
   - Count of components with stories
   - Percentage of shared components documented
   - Link to Storybook

**Project Activity Metrics:**

7. **Git Statistics**
   - Total commits
   - Active branches count
   - Last commit timestamp
   - Contributors count

8. **Lighthouse Scores**
   - Performance, Accessibility, Best Practices, SEO scores
   - Visual badges/indicators
   - Link to latest Lighthouse report

9. **Build Performance**
   - Average build time
   - Last successful build timestamp
   - Build trend (faster/slower)

### Data Sources

**Static (Parse at Build Time):**

- `documentation.json` → Compodoc coverage
- `coverage/coverage-summary.json` → Test coverage details
- `dist/stats.json` → Bundle sizes
- `.git/` → Git statistics
- `package.json` + `package-lock.json` → Dependency counts

**Dynamic (Mock/Simulate):**

- Lighthouse scores (could parse CI artifacts or mock)
- Build times (could track via CI or mock)
- Dependency vulnerabilities (`npm audit --json`)

### Component Structure

**DashboardMetricsComponent** (Smart Component)

- **Why new:** Orchestrates metrics data fetching and state management
- Fetches all metrics data from various sources
- Parses JSON files (documentation.json, coverage-summary.json, etc.)
- Passes data to existing CardComponent instances
- Located at: `src/app/features/home/components/dashboard-metrics/`

**Metric Display**

- **Use existing CardComponent** for individual metric displays
- No need for separate MetricCardComponent - leverage design system
- Pass metric data via content projection (title, value, icon, trend, status)
- CardComponent variants handle visual differences (elevated, outlined, etc.)

**Layout**

- **Use existing GridComponent** for responsive metric card layout
- No need for separate MetricGridComponent
- GridComponent already handles responsive breakpoints and auto-adjustment

### Data Model

```typescript
interface DashboardMetric {
  readonly id: string;
  readonly category: 'quality' | 'activity' | 'performance';
  readonly title: string;
  readonly value: string | number;
  readonly subtitle?: string;
  readonly icon: string;
  readonly status: 'success' | 'warning' | 'error' | 'info';
  readonly trend?: {
    readonly direction: 'up' | 'down' | 'neutral';
    readonly value: string;
  };
  readonly link?: {
    readonly label: string;
    readonly url: string;
  };
  readonly visualType: 'number' | 'percentage' | 'badge' | 'list';
}

interface DocumentationCoverage {
  readonly total: number;
  readonly documented: number;
  readonly percentage: number;
  readonly breakdown: {
    readonly components: { total: number; documented: number };
    readonly services: { total: number; documented: number };
    readonly directives: { total: number; documented: number };
    readonly pipes: { total: number; documented: number };
  };
}

interface CoverageDetails {
  readonly statements: { pct: number; covered: number; total: number };
  readonly branches: { pct: number; covered: number; total: number };
  readonly functions: { pct: number; covered: number; total: number };
  readonly lines: { pct: number; covered: number; total: number };
}

interface BundleSize {
  readonly main: { raw: number; gzipped: number };
  readonly total: { raw: number; gzipped: number };
  readonly withinBudget: boolean;
}
```

### Implementation Approach

**Phase 1: Static Metrics (Low-hanging fruit)**

1. Parse `documentation.json` for Compodoc coverage
2. Parse `coverage/coverage-summary.json` for detailed test coverage
3. Parse `package.json` for dependency counts
4. Display in new metric cards on dashboard

**Phase 2: Build-time Metrics**

1. Add script to generate `metrics.json` during build
2. Include git stats, bundle sizes, build timestamp
3. Serve as static asset

**Phase 3: Dynamic/Simulated Metrics**

1. Mock Lighthouse scores (or parse CI artifacts)
2. Mock build performance trends
3. Add npm audit integration (or mock)

### Example Metrics Display

```
┌─────────────────────┬─────────────────────┬─────────────────────┐
│ Documentation       │ Test Coverage       │ Bundle Size         │
│ 94%                 │ 87% ↑               │ 245 KB ✓            │
│ 142/151 documented  │ All metrics >85%    │ Within budget       │
│ [View Docs]         │ [View Report]       │ [Analyze]           │
└─────────────────────┴─────────────────────┴─────────────────────┘

┌─────────────────────┬─────────────────────┬─────────────────────┐
│ Linting             │ Dependencies        │ Storybook           │
│ 0 errors ✓          │ 1,783 packages      │ 28/32 components    │
│ 0 warnings ✓        │ 3 outdated          │ 87.5% coverage      │
│ [Run Lint]          │ [Review]            │ [View Stories]      │
└─────────────────────┴─────────────────────┴─────────────────────┘

┌─────────────────────┬─────────────────────┬─────────────────────┐
│ Lighthouse          │ Git Activity        │ Build Status        │
│ 98 | 100 | 100 | 100│ 287 commits         │ ✓ Passing           │
│ Perf|A11y|BP |SEO   │ Last: 2 hours ago   │ Avg: 45s            │
│ [Latest Report]     │ [View Repo]         │ [CI Pipeline]       │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

### Scripts to Add

```json
{
  "scripts": {
    "metrics:generate": "node scripts/generate-metrics.js",
    "metrics:coverage": "node scripts/parse-coverage.js",
    "metrics:docs": "node scripts/parse-compodoc.js",
    "metrics:audit": "npm audit --json > metrics/audit.json"
  }
}
```

### Acceptance Criteria

- [ ] Compodoc documentation coverage displayed with percentage and breakdown
- [ ] Test coverage shows all 4 metrics (statements, branches, functions, lines)
- [ ] Bundle size displayed with budget status
- [ ] Linting status shows error/warning counts
- [ ] Dependency health metrics displayed
- [ ] Storybook coverage percentage calculated and shown
- [ ] Git statistics displayed (commits, last commit time)
- [ ] Lighthouse scores displayed (real or mocked)
- [ ] All metrics update when running `npm run metrics:generate`
- [ ] Metric cards have consistent design with icons and status colors
- [ ] Mobile responsive layout (cards stack on small screens)
- [ ] Links to detailed reports work correctly
- [ ] WCAG 2.1 AA compliant
- [ ] All metrics accurate and verified

---

## Timeline Estimate

| Task                       | Estimated Time   |
| -------------------------- | ---------------- |
| 8.1 Checkbox Icon Refactor | 4-6 hours        |
| 8.2 Radio Icon Refactor    | 4-6 hours        |
| 8.3 Card Visibility        | 3-5 hours        |
| 8.4 Toast Improvements     | 1-2 hours        |
| 8.5 Profile Stats Caching  | 1-2 hours        |
| 8.6 Theme Menu             | 4-6 hours        |
| 8.7 User Menu              | 6-8 hours        |
| 8.8 Profile Layout         | 2 hours          |
| 8.9 Home Branding          | 6-10 hours       |
| 8.10 Filter Chips          | 6-8 hours        |
| 8.11 Blog Feature Module   | 24-32 hours      |
| 8.12 Enhanced Dashboard    | 12-16 hours      |
| **Total**                  | **73-103 hours** |

**8.1 Breakdown:**

- Install `@ng-icons/material-icons` package: 0.25 hours
- Research Material Icons checkbox icons: 0.25 hours
- Update CheckboxCheckmarkComponent with three Material icon states: 1.5-2 hours
- Update checkbox.component.scss to remove CSS box rendering: 1 hour
- Update Storybook stories and visual tests: 1-1.5 hours
- Update unit tests: 1 hour
- Cross-theme testing and accessibility validation: 1 hour

**8.2 Breakdown:**

- Create RadioButtonIconComponent: 1.5-2 hours
- Update RadioComponent to integrate icon component: 1 hour
- Update radio.component.scss to remove CSS circle rendering: 1 hour
- Update Storybook stories and visual tests: 1-1.5 hours
- Update unit tests for both components: 1 hour
- Cross-theme testing and accessibility validation: 0.5-1 hour

**8.3 Breakdown:**

- Audit current card usage and screenshot all themes: 0.5 hours
- Update `_light-default.scss` theme variables: 0.5 hours
- Update `_light-warm.scss` theme variables: 0.5 hours
- Test all card variants in Storybook with theme switcher: 1 hour
- WCAG compliance validation with axe DevTools: 0.5 hours
- Cross-component testing in real features: 0.5-1 hour
- Optional card.component.scss adjustments (if needed): 0.5-1 hour

**8.6 Breakdown:**

- ThemePickerComponent compact mode: 2-3 hours
- HeaderComponent integration: 1-2 hours
- Testing: 1 hour

**8.7 Breakdown:**

- UserMenuComponent creation: 4-5 hours
- HeaderComponent integration: 1-2 hours
- Testing & accessibility: 1-2 hours

**8.10 Breakdown:**

- FilterChipsComponent creation: 4-5 hours
- Integration in ModulesListComponent: 1-2 hours
- Integration in AdrListComponent: 1-2 hours

**8.11 Breakdown:**

- BlogStore + data model: 4-6 hours
- BlogListComponent (uses CardComponent): 6-8 hours
- BlogDetailComponent: 8-10 hours
- Styling card content projection: 2-3 hours
- Content migration: 2-3 hours
- Routing & navigation: 2-3 hours

**8.12 Breakdown:**

- Metric parsing scripts: 4-5 hours
- DashboardMetricsComponent (uses CardComponent + GridComponent): 4-5 hours
- Styling metric content projection: 2-3 hours
- Integration & testing: 2-3 hours

---

## Success Criteria

### Quantitative

- [ ] All component icon refactors complete with Material Icons
- [ ] Card visibility improved in all light themes
- [ ] Blog feature fully functional with all existing articles
- [ ] All new components have 85%+ test coverage
- [ ] All new features WCAG 2.1 AA compliant
- [ ] Zero new accessibility violations
- [ ] Mobile responsive on all screen sizes
- [ ] All Storybook stories created

### Qualitative

- [ ] Enhanced portfolio presentation
- [ ] Improved user experience
- [ ] Professional appearance
- [ ] Consistent with existing design
- [ ] Easy content management for blog
- [ ] Form controls have consistent visual treatment
- [ ] Cards clearly distinguishable in all themes

---

## Dependencies

- Completion of Phase 7 (Polish & Cleanup)
- Design system components from Phase 3
- Theme system from Phase 2
- All existing features stable

---

## Risks & Mitigation

| Risk                              | Impact | Mitigation                                            |
| --------------------------------- | ------ | ----------------------------------------------------- |
| Blog content migration complexity | Medium | Start with simple JSON structure, iterate             |
| Markdown rendering performance    | Low    | Use virtual scrolling for long articles if needed     |
| Scope creep on blog features      | Medium | Start with MVP, create issues for future enhancements |
| Breaking existing features        | High   | Comprehensive regression testing, feature flags       |
| Icon refactor visual regressions  | Medium | Thorough cross-theme testing, Storybook visual tests  |
| Theme changes affecting contrast  | Medium | WCAG validation at each step, rollback plan ready     |

---

**Last Updated:** 2026-01-04
**Document Owner:** Development Team
**Status:** Ready for Implementation
