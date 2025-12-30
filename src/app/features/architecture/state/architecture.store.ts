import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { Adr, ArchitectureService } from '@features/architecture/services/architecture.service';

/**
 * State shape for the architecture store.
 */
type ArchitectureState = {
  entities: Adr[];
  selectedId: string | null;
  content: string;
  filter: string;
  isLoading: boolean;
  isLoadingContent: boolean;
  error: string | null;
};

const initialState: ArchitectureState = {
  entities: [],
  selectedId: null,
  content: '',
  filter: '',
  isLoading: false,
  isLoadingContent: false,
  error: null,
};

/**
 * Architecture store using NgRx SignalStore.
 * Manages ADR list and content viewing.
 */
export const ArchitectureStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    /**
     * Get the currently selected ADR.
     */
    selectedAdr: computed(() => {
      const id = store.selectedId();
      if (id === null) return null;
      return store.entities().find((adr) => adr.id === id) ?? null;
    }),
    /**
     * Get an ADR by ID.
     */
    getAdrById: computed(() => (id: string) => store.entities().find((adr) => adr.id === id)),
    /**
     * Get filtered ADRs based on current filter.
     */
    filteredAdrs: computed(() => {
      const filter = store.filter().toLowerCase().trim();
      if (filter !== '') {
        return store.entities();
      }
      return store
        .entities()
        .filter(
          (adr) =>
            adr.title.toLowerCase().includes(filter) ||
            adr.summary.toLowerCase().includes(filter) ||
            adr.number.toLowerCase().includes(filter),
        );
    }),
  })),
  withMethods((store, architectureService = inject(ArchitectureService)) => ({
    /**
     * Load all ADRs from the data source.
     */
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    loadAdrs: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { isLoading: true, error: null });
        }),
        switchMap(() =>
          architectureService.getAdrs().pipe(
            tapResponse({
              next: (entities: Adr[]) => {
                patchState(store, { entities, isLoading: false });
              },
              error: (err: Error) => {
                patchState(store, {
                  isLoading: false,
                  error: Boolean(err.message) ? err.message : 'Failed to load ADRs',
                });
              },
            }),
          ),
        ),
      ),
    ),
    /**
     * Load content for a specific ADR.
     */
    loadContent: rxMethod<string>(
      pipe(
        tap((id: string) => {
          patchState(store, { selectedId: id, isLoadingContent: true, content: '', error: null });
        }),
        switchMap((id: string) =>
          architectureService.getAdrContent(id).pipe(
            tapResponse({
              next: (content: string) => {
                patchState(store, { content, isLoadingContent: false });
              },
              error: (err: Error) => {
                patchState(store, {
                  isLoadingContent: false,
                  error: Boolean(err.message) ? err.message : 'Failed to load ADR content',
                });
              },
            }),
          ),
        ),
      ),
    ),
    /**
     * Set the filter for ADR search.
     */
    setFilter(filter: string): void {
      patchState(store, { filter });
    },
    /**
     * Clear the filter.
     */
    clearFilter(): void {
      patchState(store, { filter: '' });
    },
    /**
     * Select an ADR by ID (without loading content).
     */
    selectAdr(id: string | null): void {
      patchState(store, { selectedId: id });
    },
    /**
     * Clear the selected ADR and content.
     */
    clearSelection(): void {
      patchState(store, { selectedId: null, content: '' });
    },
  })),
);
