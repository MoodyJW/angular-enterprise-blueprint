# Icon Tree-Shaking Implementation Plan

## Objective

Reduce initial bundle size by ~50-55KB by enabling tree-shaking for ng-icons. Currently all 100 icons are bundled because `ICON_NAMES` constants pull in the entire `ICON_REGISTRY`.

## Current State

- Initial bundle: **507.73 kB** (budget: 500 kB)
- Icons chunk: **60.93 kB** (all 100 heroicons)
- `IconComponent` no longer provides icons (already changed)
- `ThemePickerComponent` provides only its 2 icons (already changed)

## Strategy

Each component that uses icons must explicitly provide only the icons it needs via `viewProviders`. This enables the bundler to tree-shake unused icons.

---

## Components to Update

### Shared Components (Initial Bundle Impact)

| Component                    | Icons Used                           | File                                         |
| ---------------------------- | ------------------------------------ | -------------------------------------------- |
| `ToastComponent`             | SUCCESS, ERROR, WARNING, INFO, CLOSE | `shared/components/toast/toast.component.ts` |
| `SelectButtonComponent`      | CHEVRON_DOWN                         | `shared/components/select/select-button/`    |
| `SelectOptionComponent`      | CHECK                                | `shared/components/select/select-option/`    |
| `SelectDropdownComponent`    | (uses SelectOption)                  | `shared/components/select/select-dropdown/`  |
| `CheckboxCheckmarkComponent` | CHECK                                | `shared/components/checkbox-checkmark/`      |
| `BreadcrumbComponent`        | CHEVRON_RIGHT                        | `shared/components/breadcrumb/`              |
| `TabButtonComponent`         | (dynamic icons)                      | `shared/components/tab-button/`              |

### Feature Components (Lazy-Loaded - Lower Priority)

| Component               | Icons Used                   | File                            |
| ----------------------- | ---------------------------- | ------------------------------- |
| `ArchitectureComponent` | DOCUMENT + used icons        | `features/architecture/`        |
| `AdrViewerComponent`    | WARNING, SEARCH + used icons | `features/architecture/viewer/` |
| `ModulesComponent`      | ICON_NAMES.\*                | `features/modules/`             |
| `ModuleDetailComponent` | ICON_NAMES.\*                | `features/modules/detail/`      |

---

## Implementation Steps

### Phase 1: Update Shared Components

For each component, change from:

```typescript
import { ICON_NAMES } from '@shared/constants';
// Template uses: ICON_NAMES.SUCCESS
```

To:

```typescript
import { provideIcons } from '@ng-icons/core';
import { heroCheckCircle } from '@ng-icons/heroicons/outline';

@Component({
  viewProviders: [provideIcons({ heroCheckCircle })],
})
// Template uses: 'heroCheckCircle' directly
```

### Phase 2: Create Icon Mapping Constants

Create a lightweight `icon-names.constants.ts` that only exports string constants (no icon imports):

```typescript
export const ICON_NAMES = {
  SUCCESS: 'heroCheckCircle',
  ERROR: 'heroXCircle',
  // ... string literals only
} as const;
```

### Phase 3: Update Feature Components

Same pattern for lazy-loaded features. These have less bundle impact but should follow the same pattern for consistency.

### Phase 4: Remove Full Registry

Once all components are updated:

1. Delete or deprecate `ICON_REGISTRY` export
2. Update `icons.constants.ts` to only export `ICON_NAMES` type constants
3. Update component documentation

---

## Icon Reference

### Icons Currently in ICON_REGISTRY

**Navigation**: heroArrowLeft, heroArrowRight, heroArrowUp, heroArrowDown, heroBars3, heroXMark, heroCheck, heroChevronDown, heroChevronLeft, heroChevronRight, heroChevronUp, heroHome, heroHomeSolid

**Feedback**: heroStar, heroStarSolid, heroHeart, heroHeartSolid, heroCheckCircle, heroCheckCircleSolid, heroXCircle, heroXCircleSolid, heroExclamationTriangle, heroExclamationTriangleSolid, heroInformationCircle, heroInformationCircleSolid

**Actions**: heroMagnifyingGlass, heroCog6Tooth, heroBell, heroBellSolid, heroEye, heroEyeSlash, heroPencil, heroTrash, heroPlus, heroMinus, heroArrowPath

**Theme**: heroMoon, heroMoonSolid, heroSun, heroSunSolid

**See `icons.constants.ts` for full list**

---

## Expected Results

| Metric           | Before     | After (Estimated) |
| ---------------- | ---------- | ----------------- |
| Initial bundle   | 507.73 kB  | ~450-460 kB       |
| Icons in initial | ~100       | ~15-20            |
| Budget status    | ⚠️ Warning | ✅ Pass           |

---

## Rollback Plan

If issues arise, restore `viewProviders: [provideIcons(ICON_REGISTRY)]` to `IconComponent` and remove component-level `viewProviders`.
