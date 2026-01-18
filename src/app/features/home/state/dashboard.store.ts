import { inject } from '@angular/core';
import {
  DashboardMetrics,
  DashboardService,
  ExtendedMetrics,
} from '@features/home/services/dashboard.service';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

type DashboardState = {
  metrics: DashboardMetrics | null;
  extendedMetrics: ExtendedMetrics | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: DashboardState = {
  metrics: null,
  extendedMetrics: null,
  isLoading: false,
  error: null,
};

export const DashboardStore = signalStore(
  withState(initialState),
  withMethods((store, dashboardService = inject(DashboardService)) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    loadMetrics: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { isLoading: true, error: null });
        }),
        switchMap(() =>
          dashboardService.getMetrics().pipe(
            tapResponse({
              next: (metrics: DashboardMetrics) => {
                patchState(store, { metrics, isLoading: false });
              },
              error: (err: Error) => {
                patchState(store, {
                  isLoading: false,
                  error: Boolean(err.message) ? err.message : 'Failed to load dashboard metrics',
                });
              },
            }),
          ),
        ),
      ),
    ),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    loadExtendedMetrics: rxMethod<void>(
      pipe(
        switchMap(() =>
          dashboardService.getExtendedMetrics().pipe(
            tapResponse({
              next: (extendedMetrics: ExtendedMetrics) => {
                patchState(store, { extendedMetrics });
              },
              error: () => {
                // Silently fail for extended metrics - not critical
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
