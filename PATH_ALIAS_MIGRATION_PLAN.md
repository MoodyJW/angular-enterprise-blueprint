# Path Alias Migration Plan

**Created:** 2025-12-27
**Status:** Planning Phase
**Estimated Files to Update:** ~180-200 files

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Proposed Path Alias Configuration](#proposed-path-alias-configuration)
3. [New Aliases to Add](#new-aliases-to-add)
4. [Barrel Export Requirements](#barrel-export-requirements)
5. [Migration Strategy](#migration-strategy)
6. [Detailed File-by-File Changes](#detailed-file-by-file-changes)
7. [Testing & Validation](#testing--validation)

---

## Current State Analysis

### Existing Path Aliases (in tsconfig.json)

```json
{
  "baseUrl": "src",
  "paths": {
    "@app/*": ["app/*"],
    "@core/*": ["app/core/*"],
    "@shared/*": ["app/shared/*"],
    "@assets/*": ["assets/*"],
    "@env/*": ["environments/*"]
  }
}
```

### Current Usage Statistics

- **Path Alias Usage:** ~64 imports (26%)
  - `@shared/*`: 49 occurrences
  - `@core/*`: 15 occurrences
  - `@env/*`: 0 occurrences (UNUSED - alias exists but never used)

- **Relative Imports:** ~306 imports (74%)
  - `../` parent directory: 182 occurrences
  - `./` same directory: 124 occurrences

### Key Problems Identified

1. **Deep relative imports** (3-4 levels): `../../../../shared/components/`
2. **Environment imports** using 3-level relatives: `../../../environments/environment`
3. **Inconsistent import styles** across features
4. **Cross-module imports** within core using relatives
5. **Unused `@env/*` alias** while environment imports use relatives

---

## Proposed Path Alias Configuration

### Updated tsconfig.json paths configuration:

```json
{
  "baseUrl": "src",
  "paths": {
    // Top-level modules (KEEP)
    "@app/*": ["app/*"],
    "@core/*": ["app/core/*"],
    "@shared/*": ["app/shared/*"],
    "@assets/*": ["assets/*"],

    // Features module (NEW)
    "@features/*": ["app/features/*"],

    // Core sub-modules (NEW - for better granularity)
    "@core/auth/*": ["app/core/auth/*"],
    "@core/services/*": ["app/core/services/*"],
    "@core/config/*": ["app/core/config/*"],
    "@core/layout/*": ["app/core/layout/*"],
    "@core/interceptors/*": ["app/core/interceptors/*"],
    "@core/error-handling/*": ["app/core/error-handling/*"],
    "@core/i18n/*": ["app/core/i18n/*"],

    // Shared sub-modules (NEW - frequently accessed)
    "@shared/components/*": ["app/shared/components/*"],
    "@shared/services/*": ["app/shared/services/*"],
    "@shared/utilities/*": ["app/shared/utilities/*"],
    "@shared/constants/*": ["app/shared/constants/*"],

    // Environments (REPLACE @env with better name)
    "@environments/*": ["environments/*"]
  }
}
```

---

## New Aliases to Add

### 1. `@features/*` → `app/features/*`

**Reason:** Allow features to import from other features, improve discoverability

**Use cases:**

- Cross-feature navigation
- Feature-to-feature communication
- Cleaner feature component imports

**Example:**

```typescript
// Before
import { ContactComponent } from '../../contact/contact.component';

// After (using barrel export)
import { ContactComponent } from '@features/contact';
```

---

### 2. `@core/services/*` → `app/core/services/*`

**Reason:** Eliminate 2-3 level relative imports within core module

**Use cases:**

- Analytics providers importing logger
- Services importing other services
- Components importing core services

**Example:**

```typescript
// Before (from analytics provider)
import { LoggerService } from '../../logger/logger.service';

// After (using barrel export)
import { LoggerService } from '@core/services/logger';
```

---

### 3. `@core/config/*` → `app/core/config/*`

**Reason:** High-frequency import target from many locations

**Use cases:**

- Services importing environment token
- Providers importing config
- Features importing configuration

**Example:**

```typescript
// Before (from profile service - 3 levels up!)
import { ENVIRONMENT } from '../../../core/config/environment.token';

// After (using barrel export)
import { ENVIRONMENT } from '@core/config';
```

---

### 4. `@core/auth/*` → `app/core/auth/*`

**Reason:** Auth is a distinct module, often imported from features

**Use cases:**

- Guards importing auth store
- Components importing auth state
- Services checking authentication

**Example:**

```typescript
// Before
import { AuthStore } from '../../core/auth/auth.store';

// After (using barrel export)
import { AuthStore } from '@core/auth';
```

---

### 5. `@core/layout/*` → `app/core/layout/*`

**Reason:** Layout components as separate concern

**Use cases:**

- App component importing main layout
- Route components importing layouts

---

### 6. `@core/interceptors/*` → `app/core/interceptors/*`

**Reason:** Interceptors often imported in app config

**Use cases:**

- App config importing HTTP interceptors
- Testing importing interceptor mocks

---

### 7. `@core/error-handling/*` → `app/core/error-handling/*`

**Reason:** Error handling imported from multiple locations

**Use cases:**

- Services importing error handlers
- Components importing error utilities

---

### 8. `@core/i18n/*` → `app/core/i18n/*`

**Reason:** Internationalization as separate concern

**Use cases:**

- Components importing translation helpers
- Services importing i18n config

---

### 9. `@shared/components/*` → `app/shared/components/*`

**Reason:** Most frequently imported shared resource

**Use cases:**

- Features importing UI components (buttons, cards, etc.)
- Shared components importing other shared components

**Example:**

```typescript
// Before (from profile component - 2 levels up)
import { ButtonComponent } from '../../shared/components/button/button.component';

// After (using barrel export)
import { ButtonComponent } from '@shared/components/button';
```

---

### 10. `@shared/services/*` → `app/shared/services/*`

**Reason:** Shared services imported from features and components

**Use cases:**

- Components importing toast service
- Services importing utility services

**Example:**

```typescript
// Before
import { UniqueIdService } from '../../services/unique-id/unique-id.service';

// After (using barrel export)
import { UniqueIdService } from '@shared/services/unique-id';
```

---

### 11. `@shared/utilities/*` → `app/shared/utilities/*`

**Reason:** Utility functions imported across the app

**Use cases:**

- Components using debounce/throttle
- Services using helper functions

**Example:**

```typescript
// Before
import { debounce } from '../../utilities/debounce-throttle/debounce-throttle.utils';

// After (using barrel export)
import { debounce } from '@shared/utilities/debounce-throttle';
```

---

### 12. `@shared/constants/*` → `app/shared/constants/*`

**Reason:** Constants imported from many components

**Use cases:**

- Components importing timing constants
- Services importing configuration constants

**Example:**

```typescript
// Before
import { DEBOUNCE_DELAYS } from '../../constants';

// After
import { DEBOUNCE_DELAYS } from '@shared/constants';
```

---

### 13. `@environments/*` → `environments/*`

**Reason:** Replace unused `@env/*` with clearer, more descriptive alias

**Use cases:**

- Config importing environment
- Services importing environment types
- All environment access

**Example:**

```typescript
// Before (from config - 3 levels up!)
import { environment } from '../../../environments/environment';
import type { AppEnvironment } from '../../../environments/environment.type';

// After
import { environment } from '@environments/environment';
import type { AppEnvironment } from '@environments/environment.type';
```

---

## Barrel Export Requirements

**CRITICAL: This migration REQUIRES using barrel exports (index.ts) whenever they exist.**

### What are Barrel Exports?

Barrel exports are `index.ts` files that re-export components, services, and other entities from a module. They provide a clean, public API for importing from that module.

**Example barrel export (`src/app/shared/components/button/index.ts`):**

```typescript
export * from './button.component';
```

### Current Barrel Export Coverage

The codebase has excellent barrel export coverage:

**Core Module:**

- ✅ `src/app/core/auth/index.ts`
- ✅ `src/app/core/services/index.ts`
- ✅ `src/app/core/services/logger/index.ts`
- ✅ `src/app/core/services/analytics/index.ts`
- ✅ `src/app/core/config/index.ts`
- ✅ And 10+ more...

**Shared Module:**

- ✅ `src/app/shared/components/badge/index.ts`
- ✅ `src/app/shared/components/button/index.ts`
- ✅ `src/app/shared/components/card/index.ts`
- ✅ `src/app/shared/components/input/index.ts`
- ✅ `src/app/shared/components/select/index.ts`
- ✅ `src/app/shared/components/toast/index.ts`
- ✅ `src/app/shared/services/toast/index.ts`
- ✅ `src/app/shared/services/unique-id/index.ts`
- ✅ `src/app/shared/utilities/debounce-throttle/index.ts`
- ✅ `src/app/shared/constants/index.ts`
- ✅ And 30+ more...

### Mandatory Import Rules

#### ✅ CORRECT - Always use barrel exports:

```typescript
// Shared components
import { ButtonComponent } from '@shared/components/button';
import { CardComponent } from '@shared/components/card';
import { SelectComponent } from '@shared/components/select';

// Core services
import { LoggerService } from '@core/services/logger';
import { ENVIRONMENT } from '@core/config';
import { AuthStore } from '@core/auth';

// Shared services
import { ToastService } from '@shared/services/toast';
import { UniqueIdService } from '@shared/services/unique-id';

// Shared utilities
import { debounce } from '@shared/utilities/debounce-throttle';

// Shared constants
import { DEBOUNCE_DELAYS } from '@shared/constants';
```

#### ❌ INCORRECT - Never bypass barrel exports:

```typescript
// DON'T do this - bypasses barrel export
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';

// DON'T do this - bypasses barrel export
import { LoggerService } from '@core/services/logger/logger.service';
import { ENVIRONMENT } from '@core/config/environment.token';

// DON'T do this - bypasses barrel export
import { ToastService } from '@shared/services/toast/toast.service';
```

### Why Barrel Exports are Mandatory

1. **Encapsulation:** Internal file structure can change without breaking imports
2. **Cleaner imports:** Shorter, more readable import paths
3. **Better API:** Clear public interface for each module
4. **Refactoring safety:** Move files without updating all imports
5. **Consistency:** Uniform import style across the entire codebase

### Migration Requirement

**Every import in this migration MUST use barrel exports where they exist.** This is not optional. The examples throughout this document show the correct barrel export usage.

---

## Migration Strategy

### Phase 1: Add New Aliases (Low Risk)

**Duration:** 5 minutes
**Risk:** None (additive only)

1. Update `tsconfig.json` with all new path aliases
2. Update `tsconfig.app.json` if it has separate paths config
3. Verify TypeScript compilation still works
4. Verify IDE autocomplete works with new aliases

**Files to modify:**

- [tsconfig.json](tsconfig.json)
- [tsconfig.app.json](tsconfig.app.json) (if needed)

---

### Phase 2: Environment Imports (Highest Priority)

**Duration:** 30-45 minutes
**Files affected:** ~20-25 files
**Risk:** Low (isolated imports)

**Why first?**

- Highest pain point (3-level deep imports)
- Self-contained changes
- Easy to verify
- High impact on readability

**Target pattern:**

```typescript
// FIND
import { environment } from '../../../environments/environment';
import type { AppEnvironment } from '../../../environments/environment.type';

// REPLACE WITH
import { environment } from '@environments/environment';
import type { AppEnvironment } from '@environments/environment.type';
```

**Files to update:**

#### Core Config Module

- [src/app/core/config/environment.token.ts](src/app/core/config/environment.token.ts)
  - Change: `'../../../environments/environment'` → `'@environments/environment'`
  - Change: `'../../../environments/environment.type'` → `'@environments/environment.type'`

#### Core Services

- [src/app/core/services/analytics/analytics.service.ts](src/app/core/services/analytics/analytics.service.ts)
- [src/app/core/services/analytics/providers/google-analytics.provider.ts](src/app/core/services/analytics/providers/google-analytics.provider.ts)
- [src/app/core/services/api/api.service.ts](src/app/core/services/api/api.service.ts)
- All other services importing environment types

#### Feature Services

- [src/app/features/profile/services/profile.service.ts](src/app/features/profile/services/profile.service.ts)
- All other feature services using environment

#### Test Files

- All `*.spec.ts` files importing `AppEnvironment` type
- Look for pattern: `import type { AppEnvironment } from '../../../environments/environment.type';`

---

### Phase 3: Features → Shared Components (High Priority)

**Duration:** 1-2 hours
**Files affected:** ~40-50 files
**Risk:** Low (component imports)

**Why second?**

- High frequency of deep imports (4-5 levels)
- Improves feature component readability significantly
- Clear pattern to follow

**Target pattern:**

```typescript
// FIND
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';

// REPLACE WITH (using barrel exports)
import { ButtonComponent } from '@shared/components/button';
import { CardComponent } from '@shared/components/card';
```

**Files to update (by feature):**

#### Contact Feature

- [src/app/features/contact/contact.component.ts](src/app/features/contact/contact.component.ts)
  - Update 5+ shared component imports
  - Pattern: `../../shared/components/*` → `@shared/components/*`

- [src/app/features/contact/contact.component.spec.ts](src/app/features/contact/contact.component.spec.ts)
  - Update test imports to match

#### Profile Feature

- [src/app/features/profile/profile.component.ts](src/app/features/profile/profile.component.ts)
  - Update 7+ shared component imports
  - Pattern: `../../shared/components/*` → `@shared/components/*`

- [src/app/features/profile/components/profile-stats-card/profile-stats-card.component.ts](src/app/features/profile/components/profile-stats-card/profile-stats-card.component.ts)
  - Update 5+ deep imports (4 levels!)
  - Pattern: `../../../../shared/components/*` → `@shared/components/*`

- [src/app/features/profile/components/profile-header/profile-header.component.ts](src/app/features/profile/components/profile-header/profile-header.component.ts)
  - Update shared component imports

#### Architecture Feature

- [src/app/features/architecture/architecture.component.ts](src/app/features/architecture/architecture.component.ts)
  - Already using `@shared/components/*` ✓ (verify consistency)

#### Modules Feature

- [src/app/features/modules/modules.component.ts](src/app/features/modules/modules.component.ts)
  - Already using `@shared/components/*` ✓ (verify consistency)

#### Home Feature

- [src/app/features/home/home.component.ts](src/app/features/home/home.component.ts)
  - Already using `@shared/components/*` ✓ (verify consistency)

#### Other Features

- Scan remaining features in `src/app/features/` for any shared component imports

---

### Phase 4: Core Module Internal Imports (Medium Priority)

**Duration:** 1-2 hours
**Files affected:** ~30-40 files
**Risk:** Medium (internal cross-references)

**Why third?**

- Improves core module maintainability
- Reduces coupling through clearer paths
- Some complexity in service dependencies

**Target patterns:**

#### 4A. Core Config Imports

```typescript
// FIND
import { ENVIRONMENT } from '../../../core/config/environment.token';
import { ENVIRONMENT } from '../../config/environment.token';
import { ENVIRONMENT } from '../config/environment.token';

// REPLACE WITH
import { ENVIRONMENT } from '@core/config';
```

**Files affected:**

- [src/app/core/services/analytics/providers/google-analytics.provider.ts](src/app/core/services/analytics/providers/google-analytics.provider.ts)
- [src/app/core/services/analytics/providers/console-analytics.provider.ts](src/app/core/services/analytics/providers/console-analytics.provider.ts)
- All services in `src/app/core/services/` importing config
- All feature services importing core config

#### 4B. Core Services Cross-Imports

```typescript
// FIND
import { LoggerService } from '../../logger/logger.service';
import { LoggerService } from '../logger/logger.service';

// REPLACE WITH
import { LoggerService } from '@core/services/logger';
```

**Files affected:**

- [src/app/core/services/analytics/providers/google-analytics.provider.ts](src/app/core/services/analytics/providers/google-analytics.provider.ts)
- All providers/services importing LoggerService
- Services importing other core services

#### 4C. Core Auth Imports

```typescript
// FIND
import { AuthStore } from '../auth/auth.store';
import { AuthStore } from '../../core/auth/auth.store';

// REPLACE WITH
import { AuthStore } from '@core/auth';
```

**Files affected:**

- Guards importing auth store
- Services checking authentication
- Components using auth state

#### 4D. Core Layout Imports

```typescript
// FIND
import { MainLayoutComponent } from '../core/layout/main-layout/main-layout.component';

// REPLACE WITH
import { MainLayoutComponent } from '@core/layout/main-layout';
```

**Files affected:**

- [src/app/app.component.ts](src/app/app.component.ts)
- Route components using layouts

---

### Phase 5: Shared Components Internal Imports (Medium Priority)

**Duration:** 45-60 minutes
**Files affected:** ~20-30 files
**Risk:** Low (internal utilities)

**Why fourth?**

- Shared components importing shared utilities/constants
- Less visible but improves consistency
- Cleaner internal structure

**Target patterns:**

#### 5A. Shared Constants Imports

```typescript
// FIND
import { DEBOUNCE_DELAYS, FOCUS_DELAYS } from '../../constants';
import { DEBOUNCE_DELAYS } from '../../../shared/constants';

// REPLACE WITH
import { DEBOUNCE_DELAYS, FOCUS_DELAYS } from '@shared/constants';
```

**Files affected:**

- [src/app/shared/components/select/select.component.ts](src/app/shared/components/select/select.component.ts)
- [src/app/shared/services/toast/toast.service.ts](src/app/shared/services/toast/toast.service.ts)
- Any component/service importing from constants

#### 5B. Shared Services Imports

```typescript
// FIND
import { UniqueIdService } from '../../services/unique-id/unique-id.service';

// REPLACE WITH
import { UniqueIdService } from '@shared/services/unique-id';
```

**Files affected:**

- [src/app/shared/components/select/select.component.ts](src/app/shared/components/select/select.component.ts)
- Components importing shared services

#### 5C. Shared Utilities Imports

```typescript
// FIND
import { debounce } from '../../utilities/debounce-throttle/debounce-throttle.utils';

// REPLACE WITH
import { debounce } from '@shared/utilities/debounce-throttle';
```

**Files affected:**

- [src/app/shared/components/select/select.component.ts](src/app/shared/components/select/select.component.ts)
- Any component using utility functions

#### 5D. Shared Component Cross-Imports

```typescript
// FIND
import { ToastComponent } from '../../components/toast/toast.component';

// REPLACE WITH
import { ToastComponent } from '@shared/components/toast';
```

**Files affected:**

- [src/app/shared/services/toast/toast.service.ts](src/app/shared/services/toast/toast.service.ts)
- Shared components importing other shared components

---

### Phase 6: Feature Internal Structure (Lower Priority)

**Duration:** 30-45 minutes
**Files affected:** ~15-20 files
**Risk:** Low (feature isolation)

**Why fifth?**

- Internal feature organization
- Less impact on overall structure
- Some relative imports are acceptable within features

**Decision Points:**

#### Keep relative imports for:

- Same-directory component children (e.g., `./select-button/`, `./select-dropdown/`)
- Feature-local state (e.g., `./state/profile.store`)
- Feature-specific services within the same feature (debatable)

#### Convert to aliases:

- Cross-feature imports (use `@features/*`)
- Feature services importing core services (use `@core/*`)
- Feature components importing shared (already covered in Phase 3)

**Target pattern (if cross-feature imports exist):**

```typescript
// FIND
import { ContactComponent } from '../../contact/contact.component';

// REPLACE WITH (using barrel export)
import { ContactComponent } from '@features/contact';
```

**Files to review:**

- Check for any cross-feature dependencies
- Profile feature referencing other features
- Navigation data importing feature components

---

### Phase 7: Test Files (Lower Priority)

**Duration:** 30-45 minutes
**Files affected:** ~20-30 test files
**Risk:** Low (test isolation)

**Why last?**

- Tests should mirror source file imports
- Less impact on production code
- Can be updated incrementally

**Target pattern:**

```typescript
// In *.spec.ts files, match the imports from the source file

// If source uses:
import { ButtonComponent } from '@shared/components/button';

// Test should also use:
import { ButtonComponent } from '@shared/components/button';
```

**Files to update:**

- [src/app/features/contact/contact.component.spec.ts](src/app/features/contact/contact.component.spec.ts)
- [src/app/features/profile/profile.component.spec.ts](src/app/features/profile/profile.component.spec.ts)
- All `*.spec.ts` files in features
- All `*.spec.ts` files in shared components
- All `*.spec.ts` files in core services

---

## Detailed File-by-File Changes

### Priority 1: Environment Imports

#### File: src/app/core/config/environment.token.ts

```typescript
// BEFORE
import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { AppEnvironment } from '../../../environments/environment.type';

// AFTER
import { InjectionToken } from '@angular/core';
import { environment } from '@environments/environment';
import type { AppEnvironment } from '@environments/environment.type';
```

#### File: src/app/features/profile/services/profile.service.ts

```typescript
// BEFORE
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from '../../../core/config/environment.token';

// AFTER
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from '@core/config';
```

---

### Priority 2: Features → Shared Components

#### File: src/app/features/contact/contact.component.ts

```typescript
// BEFORE
import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { TextareaComponent } from '../../shared/components/textarea/textarea.component';
import { SelectComponent } from '../../shared/components/select/select.component';
import { ToastService } from '../../shared/services/toast/toast.service';
import { ContactService } from './services/contact.service';

// AFTER
import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@shared/components/button';
import { CardComponent } from '@shared/components/card';
import { InputComponent } from '@shared/components/input';
import { TextareaComponent } from '@shared/components/textarea';
import { SelectComponent } from '@shared/components/select';
import { ToastService } from '@shared/services/toast';
import { ContactService } from './services/contact.service';
```

#### File: src/app/features/profile/profile.component.ts

```typescript
// BEFORE
import { Component, signal, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { TooltipDirective } from '../../shared/components/tooltip/tooltip.directive';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { TabsComponent } from '../../shared/components/tabs/tabs.component';
import { ProfileStatsCardComponent } from './components/profile-stats-card/profile-stats-card.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { profileStore } from './state/profile.store';

// AFTER
import { Component, signal, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@shared/components/button';
import { CardComponent } from '@shared/components/card';
import { BadgeComponent } from '@shared/components/badge';
import { SpinnerComponent } from '@shared/components/spinner';
import { TooltipDirective } from '@shared/components/tooltip';
import { AvatarComponent } from '@shared/components/avatar';
import { TabsComponent } from '@shared/components/tabs';
import { ProfileStatsCardComponent } from './components/profile-stats-card/profile-stats-card.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { profileStore } from './state/profile.store';
```

#### File: src/app/features/profile/components/profile-stats-card/profile-stats-card.component.ts

```typescript
// BEFORE (4 levels deep!)
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

// AFTER
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@shared/components/button';
import { CardComponent } from '@shared/components/card';
import { BadgeComponent } from '@shared/components/badge';
import { SpinnerComponent } from '@shared/components/spinner';
```

---

### Priority 3: Core Module Internal

#### File: src/app/core/services/analytics/providers/google-analytics.provider.ts

```typescript
// BEFORE
import { inject } from '@angular/core';
import type { AnalyticsProvider } from '../analytics-provider.interface';
import { ENVIRONMENT } from '../../../config/environment.token';
import { LoggerService } from '../../logger/logger.service';

// AFTER
import { inject } from '@angular/core';
import type { AnalyticsProvider } from '../analytics-provider.interface';
import { ENVIRONMENT } from '@core/config';
import { LoggerService } from '@core/services/logger';
```

#### File: src/app/core/auth/auth.store.ts

```typescript
// BEFORE
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { LoggerService } from '../services/logger/logger.service';
import type { AuthStrategy } from './auth-strategy.interface';

// AFTER
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { LoggerService } from '@core/services/logger';
import type { AuthStrategy } from './auth-strategy.interface';
```

---

### Priority 4: Shared Components Internal

#### File: src/app/shared/components/select/select.component.ts

```typescript
// BEFORE
import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DEBOUNCE_DELAYS, FOCUS_DELAYS } from '../../constants';
import { UniqueIdService } from '../../services/unique-id/unique-id.service';
import { debounce } from '../../utilities/debounce-throttle/debounce-throttle.utils';
import { SelectButtonComponent } from './select-button/select-button.component';
import { SelectDropdownComponent } from './select-dropdown/select-dropdown.component';

// AFTER
import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DEBOUNCE_DELAYS, FOCUS_DELAYS } from '@shared/constants';
import { UniqueIdService } from '@shared/services/unique-id';
import { debounce } from '@shared/utilities/debounce-throttle';
import { SelectButtonComponent } from './select-button/select-button.component';
import { SelectDropdownComponent } from './select-dropdown/select-dropdown.component';
```

#### File: src/app/shared/services/toast/toast.service.ts

```typescript
// BEFORE
import { Injectable, inject, signal, ApplicationRef, createComponent } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DEFAULT_TOAST_DURATION } from '../../constants';
import { ToastComponent } from '../../components/toast/toast.component';

// AFTER
import { Injectable, inject, signal, ApplicationRef, createComponent } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DEFAULT_TOAST_DURATION } from '@shared/constants';
import { ToastComponent } from '@shared/components/toast';
```

---

## Testing & Validation

### Step 1: Verify TypeScript Compilation

```bash
npm run build
```

**Expected:** No compilation errors

### Step 2: Run Type Checking

```bash
npx tsc --noEmit
```

**Expected:** No type errors

### Step 3: Run Unit Tests

```bash
npm run test
```

**Expected:** All tests pass

### Step 4: Run Linting

```bash
npm run lint
```

**Expected:** No linting errors related to imports

### Step 5: Manual IDE Verification

1. Open VSCode/IDE
2. Verify autocomplete works for new aliases
3. Check "Go to Definition" works with new imports
4. Verify no red squiggles on new import paths

### Step 6: Build for Production

```bash
npm run build:prod
```

**Expected:** Successful production build

---

## Rollback Plan

If issues occur during migration:

1. **Git revert:** Each phase should be a separate commit
2. **Partial rollback:** Revert specific file changes
3. **Alias removal:** Remove problematic aliases from tsconfig.json
4. **Incremental fix:** Address issues file-by-file

---

## Additional Recommendations

### 1. Update CLAUDE.md

Add path alias usage guidelines:

```markdown
## Import Guidelines

### Use Path Aliases (Preferred)

- `@environments/*` for environment files
- `@core/config/*` for configuration
- `@core/services/*` for core services
- `@core/auth/*` for authentication
- `@shared/components/*` for shared components
- `@shared/services/*` for shared services
- `@shared/utilities/*` for utility functions
- `@shared/constants/*` for constants
- `@features/*` for cross-feature imports

### Use Relative Imports

- Same-directory component children (e.g., `./button/button.component`)
- Feature-local state (e.g., `./state/feature.store`)
- Closely coupled files in the same module

### Always Use Barrel Exports (REQUIRED)

ALWAYS import from index.ts barrel exports when they exist:

- ✅ `from '@shared/components/button'`
- ❌ `from '@shared/components/button/button.component'`
- ✅ `from '@core/services/logger'`
- ❌ `from '@core/services/logger/logger.service'`
- ✅ `from '@core/config'`
- ❌ `from '@core/config/environment.token'`

**Rule:** If a barrel export exists (index.ts file), you MUST use it. Never import the specific file directly.

**Exception:** The environments directory does not have barrel exports, so you must import directly:

- ✅ `from '@environments/environment'`
- ✅ `from '@environments/environment.type'`
```

### 2. Create ESLint Rule (Optional)

Consider adding an ESLint rule to enforce path alias usage:

```javascript
// .eslintrc.js
{
  "rules": {
    "no-restricted-imports": ["error", {
      "patterns": [
        {
          "group": ["../**/shared/components/*"],
          "message": "Use @shared/components/* instead of relative imports"
        },
        {
          "group": ["../**/core/services/*"],
          "message": "Use @core/services/* instead of relative imports"
        },
        {
          "group": ["../**/environments/*"],
          "message": "Use @environments/* instead of relative imports"
        }
      ]
    }]
  }
}
```

### 3. IDE Configuration

Ensure `tsconfig.json` is properly configured for IDE support:

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      /* all aliases */
    }
  },
  "include": ["src/**/*.ts"]
}
```

---

## Summary Statistics

### Before Migration

- **Total imports:** ~370
- **Relative imports:** ~306 (82.7%)
- **Path alias imports:** ~64 (17.3%)
- **Deep imports (3+ levels):** ~50+ occurrences

### After Migration

- **Total imports:** ~370 (same)
- **Relative imports:** ~90-100 (27%) - only same-directory/closely-coupled
- **Path alias imports:** ~270 (73%)
- **Deep imports (3+ levels):** ~0 occurrences

### Benefits

- **Reduced complexity:** 3-4 level imports → 1 level
- **Better maintainability:** Clear module boundaries
- **Improved refactoring:** Moving files doesn't break imports
- **Enhanced DX:** Better autocomplete, easier to understand
- **Consistency:** Uniform import style across codebase

---

## Appendix: Complete File List

### Environment Imports (Phase 2)

1. src/app/core/config/environment.token.ts
2. src/app/core/services/analytics/analytics.service.ts
3. src/app/core/services/analytics/providers/google-analytics.provider.ts
4. src/app/core/services/analytics/providers/console-analytics.provider.ts
5. src/app/core/services/api/api.service.ts
6. src/app/features/profile/services/profile.service.ts
7. All \*.spec.ts files importing AppEnvironment type (~15-20 files)

### Feature Components (Phase 3)

1. src/app/features/contact/contact.component.ts
2. src/app/features/contact/contact.component.spec.ts
3. src/app/features/profile/profile.component.ts
4. src/app/features/profile/profile.component.spec.ts
5. src/app/features/profile/components/profile-stats-card/profile-stats-card.component.ts
6. src/app/features/profile/components/profile-header/profile-header.component.ts
7. All other feature component files (~20-30 more)

### Core Services (Phase 4)

1. src/app/core/services/analytics/providers/google-analytics.provider.ts
2. src/app/core/services/analytics/providers/console-analytics.provider.ts
3. src/app/core/auth/auth.store.ts
4. src/app/core/auth/guards/\*.ts (if any)
5. All services cross-importing within core (~20-25 files)

### Shared Components (Phase 5)

1. src/app/shared/components/select/select.component.ts
2. src/app/shared/services/toast/toast.service.ts
3. All shared components importing utilities/constants (~15-20 files)

---

**End of Migration Plan**
