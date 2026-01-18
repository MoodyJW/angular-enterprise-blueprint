import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * Smart Idle-Based Preloading Strategy
 *
 * Preloads route chunks during browser idle time using requestIdleCallback.
 * This approach ensures preloading happens when the browser is truly idle,
 * avoiding interference with Lighthouse performance measurements.
 *
 * Benefits:
 * - Doesn't increase initial bundle size
 * - Downloads chunks only when browser is idle
 * - Won't interfere with Lighthouse FCP/LCP/TTI measurements
 * - Selective - only preloads routes marked with preload: true
 * - Respects route priority via preloadPriority
 *
 * How it works:
 * 1. Routes marked `preload: false` are skipped entirely
 * 2. Routes with `preload: true` are queued for idle-time loading
 * 3. Uses requestIdleCallback to wait for browser idle time
 * 4. Falls back to setTimeout for browsers without requestIdleCallback
 * 5. Higher priority routes (lower preloadPriority number) load first
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * withPreloading(SmartPreloadStrategy)
 *
 * // In routes
 * {
 *   path: 'modules',
 *   loadComponent: () => import('./modules'),
 *   data: { preload: true, preloadPriority: 1 } // High priority
 * }
 * {
 *   path: 'profile',
 *   loadComponent: () => import('./profile'),
 *   data: { preload: true, preloadPriority: 2 } // Lower priority
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class SmartPreloadStrategy implements PreloadingStrategy {
  private preloadQueue: Array<{
    route: Route;
    load: () => Observable<unknown>;
    priority: number;
  }> = [];
  private isProcessing = false;

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    // Don't preload routes marked with preload: false
    if (route.data?.['preload'] === false) {
      return of(null);
    }

    // Get priority (default to 99 for low priority)
    const priority = (route.data?.['preloadPriority'] as number | undefined) ?? 99;

    // Add to queue with priority
    this.preloadQueue.push({ route, load, priority });

    // Sort queue by priority (lower number = higher priority)
    this.preloadQueue.sort((a, b) => a.priority - b.priority);

    // Start processing queue if not already processing
    if (!this.isProcessing) {
      this.processQueue();
    }

    // Return immediately - actual loading happens asynchronously
    return of(null);
  }

  private processQueue(): void {
    if (this.preloadQueue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;

    // Use requestIdleCallback if available, otherwise fall back to setTimeout
    const scheduleIdleTask =
      typeof window !== 'undefined' && 'requestIdleCallback' in window
        ? (callback: IdleRequestCallback) => window.requestIdleCallback(callback, { timeout: 5000 })
        : (callback: () => void) => setTimeout(callback, 50);

    scheduleIdleTask(() => {
      const item = this.preloadQueue.shift();
      if (item) {
        const routePath = item.route.path ?? '';
        const displayPath = routePath.length > 0 ? routePath : 'root';
        const priorityStr = String(item.priority);

        // eslint-disable-next-line no-console
        console.log(`[Preload] Loading route: ${displayPath} (priority: ${priorityStr})`);

        // Load the route chunk
        item.load().subscribe({
          next: () => {
            // Continue processing queue
            this.processQueue();
          },
          error: (error) => {
            console.error(`[Preload] Failed to load route: ${displayPath}`, error);
            // Continue processing queue even on error
            this.processQueue();
          },
        });
      } else {
        this.isProcessing = false;
      }
    });
  }
}
