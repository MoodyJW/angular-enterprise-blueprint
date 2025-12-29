# Profile Stats Caching Implementation Plan

> **Objective**: Persist GitHub stats data across navigation by moving ProfileStore from component-level to app-level scope.

---

## Executive Summary

**Current Issue:**

- ProfileStore is provided at component level (`providers: [ProfileStore]` in ProfileComponent)
- Store instance is destroyed when navigating away from profile page
- Cached data is lost despite having 1-hour cache duration logic
- Data refetches every time user navigates to profile page

**Solution:**

- Move ProfileStore to app-level (root) scope
- Store instance will persist for the lifetime of the application
- Cache will survive navigation but clear on page refresh
- No changes needed to existing cache logic (already implemented correctly)

**Total Effort**: 1-2 hours including testing

---

## Current Implementation Analysis

### ProfileStore (Already Has Caching Logic)

The store at [src/app/features/profile/state/profile.store.ts](src/app/features/profile/state/profile.store.ts) already implements:

- ✅ 1-hour cache duration (`CACHE_DURATION_MS = 60 * 60 * 1000`)
- ✅ `lastFetched` timestamp tracking
- ✅ `shouldRefresh` computed signal to check cache freshness
- ✅ Cache validation in `loadGitHubStats()` method (lines 83-96)
- ✅ `refreshStats()` method to force refresh
- ✅ `clearCache()` method to reset state

### ProfileComponent (Component-Level Provider)

Current provider configuration at [src/app/features/profile/profile.component.ts:51](src/app/features/profile/profile.component.ts#L51):

```typescript
@Component({
  selector: 'eb-profile',
  standalone: true,
  providers: [ProfileStore], // ❌ Component-level: destroyed on navigation
  // ...
})
export class ProfileComponent implements OnInit {
  readonly store = inject(ProfileStore);

  ngOnInit(): void {
    this.store.loadGitHubStats(); // Calls every time component initializes
  }
}
```

**Problem**: New store instance created each time ProfileComponent is instantiated.

---

## Implementation Steps

### Step 1: Create Profile Store Provider Function

**File**: Create new file `src/app/features/profile/state/profile.store.provider.ts`

**Action**: Create a provider function following the same pattern as analytics providers.

**Implementation**:

````typescript
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ProfileStore } from './profile.store';

/**
 * Provides ProfileStore at app root level for persistence across navigation.
 *
 * Cache persists until page refresh, avoiding unnecessary API calls
 * when navigating back and forth to the profile page.
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     // ...
 *     provideProfileStore(),
 *   ],
 * };
 * ```
 */
export function provideProfileStore(): EnvironmentProviders {
  return makeEnvironmentProviders([ProfileStore]);
}
````

**Rationale**:

- Follows Angular best practices for providing stores at app level
- Consistent with existing codebase patterns (see `provideAnalytics`, `provideAuth`)
- Enables tree-shakable providers
- Self-documenting with JSDoc

**Estimated Time**: 10 minutes

---

### Step 2: Register ProfileStore in App Config

**File**: `src/app/app.config.ts`

**Change 1 - Add Import** (after line 25):

```typescript
import { provideAnalytics, withAnalyticsRouterTracking } from './core/services';
import { provideProfileStore } from './features/profile/state/profile.store.provider'; // ADD
```

**Change 2 - Add Provider** (after line 57):

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideEnvironment(),
    provideRouter(/* ... */),
    provideHttpClient(withInterceptors([csrfInterceptor, httpErrorInterceptor])),
    provideTranslocoConfig(),
    provideAnalyticsFn(),
    withAnalyticsRouterTrackingFn(),
    provideAuth(),
    provideProfileStore(), // ADD - Provides ProfileStore at root level
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
```

**Rationale**:

- Store provided at app root level
- Single instance shared across entire application
- Survives component creation/destruction during navigation

**Estimated Time**: 5 minutes

---

### Step 3: Remove Component-Level Provider

**File**: `src/app/features/profile/profile.component.ts`

**Change**:

```typescript
// BEFORE (line 51)
providers: [ProfileStore],

// AFTER
// providers: [] - Remove entirely or leave empty array
```

**Full Context** (lines 38-66):

```typescript
@Component({
  selector: 'eb-profile',
  standalone: true,
  imports: [
    TranslocoModule,
    CardComponent,
    ButtonComponent,
    BadgeComponent,
    GridComponent,
    IconComponent,
    ModalComponent,
    ProfileStatsCardComponent,
  ],
  // providers: [ProfileStore], // REMOVE - Now provided at app level
  viewProviders: [
    provideIcons({
      heroArrowDownTray,
      heroBuildingOffice2,
      heroDocument,
      heroEnvelope,
      heroMapPin,
      heroUser,
      ionLogoGithub,
    }),
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

**Rationale**:

- Component now injects app-level store instance
- Same `inject(ProfileStore)` call works automatically
- No other component code changes needed

**Estimated Time**: 2 minutes

---

## How It Works After Implementation

### Navigation Flow

**First Visit to Profile Page:**

1. Component calls `this.store.loadGitHubStats()`
2. Store checks `lastFetched` → null
3. API call made, data cached with timestamp
4. `lastFetched` = current timestamp

**Navigate Away from Profile:**

1. ProfileComponent destroyed
2. ✅ ProfileStore instance **persists** (app-level provider)
3. ✅ Cached data **retained** in store state

**Return to Profile Page:**

1. ProfileComponent re-created
2. Component calls `this.store.loadGitHubStats()`
3. Store checks `lastFetched` → 5 minutes ago (example)
4. Cache is fresh (< 1 hour), **no API call made**
5. Existing data displayed instantly

**Page Refresh (F5 / Ctrl+R):**

1. Entire Angular app restarts
2. ProfileStore instance recreated with `initialState`
3. All cache data cleared
4. Next visit fetches fresh data

### Cache Duration Behavior

- **< 1 hour since last fetch**: Uses cached data (no API call)
- **> 1 hour since last fetch**: Fetches fresh data from API
- **Manual refresh**: User can call `store.refreshStats()` to force refresh

---

## Testing Plan

### Step 4: Update Unit Tests

**File**: `src/app/features/profile/profile.component.spec.ts`

**Changes Required**:

The component tests likely mock ProfileStore. Update mocks to ensure they don't fail:

```typescript
// BEFORE (if exists)
providers: [ProfileStore /* mocks */];

// AFTER
// Remove ProfileStore from component-level providers
// Tests should provide mock at TestBed level if needed
```

**Example Test Pattern**:

```typescript
describe('ProfileComponent', () => {
  let mockProfileStore: Partial<InstanceType<typeof ProfileStore>>;

  beforeEach(() => {
    mockProfileStore = {
      loadGitHubStats: vi.fn(),
      stats: signal(null),
      isLoading: signal(false),
      error: signal(null),
      // ...
    };

    TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [{ provide: ProfileStore, useValue: mockProfileStore }],
    });
  });

  it('should load GitHub stats on init', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();

    expect(mockProfileStore.loadGitHubStats).toHaveBeenCalled();
  });
});
```

**Estimated Time**: 30 minutes

---

### Step 5: Manual Browser Testing

**Test Scenarios**:

**Scenario 1: Cache Persistence Across Navigation**

1. ✅ Navigate to Profile page
2. ✅ Wait for GitHub stats to load
3. ✅ Navigate to Home page
4. ✅ Navigate back to Profile page
5. ✅ **Expected**: Stats appear instantly (no loading spinner)
6. ✅ **Verify**: Network tab shows no new GitHub API calls

**Scenario 2: Cache Expiration After 1 Hour**

1. ✅ Navigate to Profile page
2. ✅ Wait for stats to load
3. ✅ Simulate time passing (modify `CACHE_DURATION_MS` to 5 seconds for testing)
4. ✅ Wait 6 seconds
5. ✅ Navigate away and back to Profile
6. ✅ **Expected**: New API call made (loading spinner shows)

**Scenario 3: Page Refresh Clears Cache**

1. ✅ Navigate to Profile page
2. ✅ Wait for stats to load
3. ✅ Press F5 / Ctrl+R to refresh browser
4. ✅ Navigate to Profile page
5. ✅ **Expected**: New API call made (cache was cleared)

**Scenario 4: Error Handling**

1. ✅ Disconnect network
2. ✅ Navigate to Profile page (no cache)
3. ✅ **Expected**: Error message displayed
4. ✅ Navigate away and back
5. ✅ **Expected**: Error state persists (no infinite loading)

**Estimated Time**: 15 minutes

---

## Complete Implementation Checklist

### Phase 1: Code Changes (20 minutes)

- [ ] Create `src/app/features/profile/state/profile.store.provider.ts`
- [ ] Add `provideProfileStore()` function with JSDoc
- [ ] Import `provideProfileStore` in `app.config.ts`
- [ ] Add `provideProfileStore()` to app providers array
- [ ] Remove `providers: [ProfileStore]` from ProfileComponent
- [ ] Verify no TypeScript errors

### Phase 2: Testing (45 minutes)

- [ ] Update ProfileComponent unit tests
- [ ] Run `npm test` - all tests pass
- [ ] Manual test: Cache persistence across navigation
- [ ] Manual test: Cache expiration after 1 hour (reduce timeout for testing)
- [ ] Manual test: Page refresh clears cache
- [ ] Manual test: Error handling persists across navigation

### Phase 3: Verification (10 minutes)

- [ ] Build production bundle: `npm run build`
- [ ] No build errors
- [ ] Lighthouse audit shows no performance regression
- [ ] Verify bundle size not significantly increased

---

## Files Modified Summary

| File                                                       | Lines Changed | Type of Change        |
| ---------------------------------------------------------- | ------------- | --------------------- |
| `src/app/features/profile/state/profile.store.provider.ts` | +25           | New file              |
| `src/app/app.config.ts`                                    | +2            | Add import & provider |
| `src/app/features/profile/profile.component.ts`            | -1            | Remove provider       |
| `src/app/features/profile/profile.component.spec.ts`       | ~5-10         | Update test setup     |

**Total Lines Changed**: ~30-35 lines

---

## Benefits of This Implementation

1. **Performance**: No unnecessary API calls when navigating back to profile
2. **User Experience**: Instant display of cached data (no loading spinner)
3. **Rate Limit Protection**: Reduces GitHub API calls (5000/hour limit)
4. **Consistency**: Follows Angular best practices for singleton stores
5. **Maintainability**: Clear separation of concerns (app config vs component)
6. **Testability**: Store can be mocked at TestBed level in any component

---

## Edge Cases Handled

### Store Already Handles These

✅ **No username configured**: Returns null gracefully (ProfileService line 111-116)
✅ **No PAT configured**: Returns null gracefully (ProfileService line 118-123)
✅ **API rate limit exceeded**: Error mapped to user-friendly message (ProfileService line 194)
✅ **Network failure**: Caught and logged with error state (ProfileStore line 107-112)
✅ **Concurrent calls**: `switchMap` cancels previous in-flight requests (ProfileStore line 91)
✅ **Stale cache check**: Validates timestamp before API call (ProfileStore line 85-88, 93-96)

### No Additional Handling Needed

The existing implementation already handles all edge cases correctly. Moving to app-level provider doesn't introduce new edge cases.

---

## Risk Assessment

**Risk Level**: ✅ **Very Low**

**Reasons**:

1. Only moving provider location (no logic changes)
2. Store already has robust cache validation
3. No breaking changes to component API
4. Easy to rollback if issues occur
5. Well-tested pattern (used by analytics, auth services)

**Rollback Plan**:
If issues occur, simply:

1. Remove `provideProfileStore()` from `app.config.ts`
2. Restore `providers: [ProfileStore]` in ProfileComponent
3. Delete `profile.store.provider.ts`

---

## Success Criteria

✅ **GitHub stats load on first visit**
✅ **Stats persist across navigation (no refetch)**
✅ **Cache clears on page refresh**
✅ **Cache expires after 1 hour**
✅ **All unit tests pass**
✅ **No TypeScript compilation errors**
✅ **No console errors in browser**
✅ **Network tab shows reduced API calls**

---

## Related Documentation

- **Coding Standards**: See `docs/CODING_STANDARDS.md` section on state management
- **NgRx SignalStore Docs**: https://ngrx.io/guide/signals/signal-store
- **Angular Providers**: https://angular.dev/guide/di/dependency-injection-providers

---

**Plan Created**: 2025-12-29
**Status**: Ready for Implementation
**Next Step**: Begin with Step 1 - Create Profile Store Provider Function
