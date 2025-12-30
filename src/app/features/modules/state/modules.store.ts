import { computed, inject } from '@angular/core';
import { Module, ModulesService } from '@features/modules/services/modules.service';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

/**
 * State shape for the modules store.
 */
type ModulesState = {
  entities: Module[];
  filter: string;
  isLoading: boolean;
  error: string | null;
};

const initialState: ModulesState = {
  entities: [],
  filter: '',
  isLoading: false,
  error: null,
};

/**
 * Modules store using NgRx SignalStore.
 * Manages the reference modules catalog with search/filter functionality.
 */
export const ModulesStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    /**
     * Filtered modules based on the current search filter.
     * Searches in title, description, tags, and category.
     */
    filteredModules: computed(() => {
      const filter = store.filter().toLowerCase().trim();
      const entities = store.entities();

      if (filter === '') {
        return entities;
      }

      return entities.filter(
        (module) =>
          module.title.toLowerCase().includes(filter) ||
          module.description.toLowerCase().includes(filter) ||
          module.category.toLowerCase().includes(filter) ||
          module.tags.some((tag) => tag.toLowerCase().includes(filter)),
      );
    }),
    /**
     * Get a module by its ID.
     */
    getModuleById: computed(() => (id: string) => store.entities().find((m) => m.id === id)),
  })),
  withMethods((store, modulesService = inject(ModulesService)) => ({
    /**
     * Load all modules from the data source.
     */
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    loadModules: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { isLoading: true, error: null });
        }),
        switchMap(() =>
          modulesService.getModules().pipe(
            tapResponse({
              next: (entities: Module[]) => {
                patchState(store, { entities, isLoading: false });
              },
              error: (err: Error) => {
                patchState(store, {
                  isLoading: false,
                  error: Boolean(err.message) ? err.message : 'Failed to load modules',
                });
              },
            }),
          ),
        ),
      ),
    ),
    /**
     * Set the search filter.
     */
    setFilter(filter: string): void {
      patchState(store, { filter });
    },
    /**
     * Clear the search filter.
     */
    clearFilter(): void {
      patchState(store, { filter: '' });
    },
  })),
);
