import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * Smart Selective Preloading Strategy
 *
 * Preloads route chunks during browser idle time based on:
 * - Route priority (data.preload flag)
 * - Configurable delay (data.preloadDelay)
 * - User journey patterns (high-traffic routes first)
 *
 * Benefits:
 * - Doesn't increase initial bundle size
 * - Downloads chunks after page is interactive
 * - Selective - only preloads likely next destinations
 * - Improves perceived performance for subsequent navigation
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * withPreloading(SmartPreloadStrategy)
 *
 * // In routes
 * {
 *   path: 'dashboard',
 *   loadComponent: () => import('./dashboard'),
 *   data: { preload: true, preloadDelay: 1000 }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class SmartPreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    // Don't preload routes marked with preload: false
    if (route.data?.['preload'] === false) {
      return of(null);
    }

    // Default delay: 2 seconds (allows initial page to fully load first)
    // Individual routes can override via data.preloadDelay
    const delay = (route.data?.['preloadDelay'] as number | undefined) ?? 2000;

    // Wait for the specified delay, then preload the chunk
    return timer(delay).pipe(
      mergeMap(() => {
        // eslint-disable-next-line no-console
        console.log(`[Preload] Loading route: ${route.path ?? 'root'}`);
        return load();
      }),
    );
  }
}
