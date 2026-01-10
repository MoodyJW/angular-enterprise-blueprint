import { computed, inject, Provider } from '@angular/core';
import { GitHubStats } from '@features/profile/models/github-stats.interface';
import { ProfileService } from '@features/profile/services/profile.service';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

/**
 * Cache duration in milliseconds (1 hour).
 */
const CACHE_DURATION_MS = 60 * 60 * 1000;

/**
 * State shape for the profile store.
 */
type ProfileState = {
  stats: GitHubStats | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
};

const initialState: ProfileState = {
  stats: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

/**
 * Profile store using NgRx SignalStore.
 *
 * Manages GitHub statistics with caching to avoid
 * exceeding API rate limits.
 *
 * @example
 * ```typescript
 * const store = inject(ProfileStore);
 *
 * // Load stats (uses cache if fresh)
 * store.loadGitHubStats();
 *
 * // Force refresh
 * store.refreshStats();
 *
 * // Access computed values
 * store.stats();
 * store.isLoading();
 * store.shouldRefresh();
 * ```
 */
export const ProfileStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    /**
     * Determines if cached data is stale and should be refreshed.
     * Returns true if:
     * - No data has been fetched yet
     * - Data is older than CACHE_DURATION_MS
     */
    shouldRefresh: computed(() => {
      const lastFetched = store.lastFetched();
      if (lastFetched === null) {
        return true;
      }
      return Date.now() - lastFetched > CACHE_DURATION_MS;
    }),

    /**
     * Whether stats are available (loaded and not null).
     */
    hasStats: computed(() => store.stats() !== null),
  })),
  withMethods((store, profileService = inject(ProfileService)) => ({
    /**
     * Load GitHub stats from the API.
     * Uses cached data if available and fresh.
     */
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    loadGitHubStats: rxMethod<void>(
      pipe(
        tap(() => {
          // Skip loading if we have fresh cached data
          const lastFetched = store.lastFetched();
          if (lastFetched !== null && Date.now() - lastFetched < CACHE_DURATION_MS) {
            return;
          }
          patchState(store, { isLoading: true, error: null });
        }),
        switchMap(() => {
          // Skip API call if we have fresh cached data
          const lastFetched = store.lastFetched();
          if (lastFetched !== null && Date.now() - lastFetched < CACHE_DURATION_MS) {
            return [];
          }

          return profileService.getGitHubStats().pipe(
            tapResponse({
              next: (stats: GitHubStats | null) => {
                patchState(store, {
                  stats,
                  isLoading: false,
                  lastFetched: Date.now(),
                });
              },
              error: (err: Error) => {
                patchState(store, {
                  isLoading: false,
                  error: err.message !== '' ? err.message : 'Failed to load GitHub stats',
                });
              },
            }),
          );
        }),
      ),
    ),

    /**
     * Force refresh stats from the API, ignoring cache.
     */
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    refreshStats: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { isLoading: true, error: null });
        }),
        switchMap(() =>
          profileService.getGitHubStats().pipe(
            tapResponse({
              next: (stats: GitHubStats | null) => {
                patchState(store, {
                  stats,
                  isLoading: false,
                  lastFetched: Date.now(),
                });
              },
              error: (err: Error) => {
                patchState(store, {
                  isLoading: false,
                  error: err.message !== '' ? err.message : 'Failed to load GitHub stats',
                });
              },
            }),
          ),
        ),
      ),
    ),

    /**
     * Clear all cached stats and reset to initial state.
     */
    clearCache(): void {
      patchState(store, initialState);
    },
  })),
);

/**
 * Provider for the ProfileStore.
 * Include this in app.config.ts to ensure profile stats are cached
 * at the application level.
 */
export function provideProfileStore(): Provider {
  return ProfileStore;
}
