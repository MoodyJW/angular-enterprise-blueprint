import { TestBed } from '@angular/core/testing';
import { Route } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SmartPreloadStrategy } from './preload-strategy';

describe('SmartPreloadStrategy', () => {
  let strategy: SmartPreloadStrategy;
  let mockLoad: () => Observable<unknown>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmartPreloadStrategy],
    });

    strategy = TestBed.inject(SmartPreloadStrategy);
    mockLoad = vi.fn().mockReturnValue(of('loaded'));
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(strategy).toBeTruthy();
    });

    it('should be provided as singleton', () => {
      const strategy2 = TestBed.inject(SmartPreloadStrategy);
      expect(strategy).toBe(strategy2);
    });
  });

  describe('preload with data.preload = false', () => {
    it('should not preload routes explicitly marked with preload: false', () => {
      const route: Route = {
        path: 'test',
        data: { preload: false },
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe({
        next: (value) => {
          expect(value).toBeNull();
          expect(mockLoad).not.toHaveBeenCalled();
        },
      });
    });

    it('should return observable that emits null immediately', () => {
      const route: Route = {
        path: 'test',
        data: { preload: false },
      };

      const startTime = Date.now();
      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe({
        next: () => {
          const elapsed = Date.now() - startTime;
          expect(elapsed).toBeLessThan(100); // Should be immediate
        },
      });
    });
  });

  describe('preload with default delay', () => {
    it('should preload routes without explicit preload flag after default delay', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: 'modules',
      };

      const result$ = strategy.preload(route, mockLoad);

      const subscription = result$.subscribe({
        next: () => {
          expect(mockLoad).toHaveBeenCalledOnce();
          expect(consoleLogSpy).toHaveBeenCalledWith('[Preload] Loading route: modules');
        },
      });

      // Fast-forward time by 2000ms (default delay)
      vi.advanceTimersByTime(2000);

      subscription.unsubscribe();
    });

    it('should use 2000ms as default delay when preloadDelay is not specified', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: 'blog',
        data: { preload: true },
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe();

      // Should not load before 2000ms
      vi.advanceTimersByTime(1999);
      expect(mockLoad).not.toHaveBeenCalled();

      // Should load at 2000ms
      vi.advanceTimersByTime(1);
      expect(mockLoad).toHaveBeenCalledOnce();
    });
  });

  describe('preload with custom delay', () => {
    it('should respect custom preloadDelay from route data', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: 'modules',
        data: { preload: true, preloadDelay: 1000 },
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe();

      // Should not load before custom delay
      vi.advanceTimersByTime(999);
      expect(mockLoad).not.toHaveBeenCalled();

      // Should load at custom delay
      vi.advanceTimersByTime(1);
      expect(mockLoad).toHaveBeenCalledOnce();
    });

    it('should support different delays for different routes', () => {
      vi.useFakeTimers();

      const route1: Route = {
        path: 'high-priority',
        data: { preload: true, preloadDelay: 500 },
      };

      const route2: Route = {
        path: 'low-priority',
        data: { preload: true, preloadDelay: 5000 },
      };

      const mockLoad1 = vi.fn().mockReturnValue(of('loaded1'));
      const mockLoad2 = vi.fn().mockReturnValue(of('loaded2'));

      strategy.preload(route1, mockLoad1).subscribe();
      strategy.preload(route2, mockLoad2).subscribe();

      // After 500ms, only high-priority should load
      vi.advanceTimersByTime(500);
      expect(mockLoad1).toHaveBeenCalledOnce();
      expect(mockLoad2).not.toHaveBeenCalled();

      // After 5000ms total, low-priority should also load
      vi.advanceTimersByTime(4500);
      expect(mockLoad2).toHaveBeenCalledOnce();
    });

    it('should allow zero delay for immediate preloading', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: 'immediate',
        data: { preload: true, preloadDelay: 0 },
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe({
        next: () => {
          expect(mockLoad).toHaveBeenCalledOnce();
        },
      });

      // Advance by 0ms (timer with 0 delay fires on next tick)
      vi.advanceTimersByTime(0);
    });
  });

  describe('console logging', () => {
    it('should log preload action with route path', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: 'test-route',
        data: { preload: true, preloadDelay: 0 },
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe({
        next: () => {
          expect(consoleLogSpy).toHaveBeenCalledWith('[Preload] Loading route: test-route');
        },
      });

      vi.advanceTimersByTime(0);
    });

    it('should log "root" for routes without path', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: '',
        data: { preload: true, preloadDelay: 0 },
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe({
        next: () => {
          expect(consoleLogSpy).toHaveBeenCalledWith('[Preload] Loading route: root');
        },
      });

      vi.advanceTimersByTime(0);
    });

    it('should log "root" for undefined path', () => {
      vi.useFakeTimers();

      const route: Route = {
        data: { preload: true, preloadDelay: 0 },
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe({
        next: () => {
          expect(consoleLogSpy).toHaveBeenCalledWith('[Preload] Loading route: root');
        },
      });

      vi.advanceTimersByTime(0);
    });
  });

  describe('load function invocation', () => {
    it('should call the load function once after delay', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: 'test',
        data: { preload: true, preloadDelay: 100 },
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe({
        next: () => {
          expect(mockLoad).toHaveBeenCalledOnce();
          expect(mockLoad).toHaveBeenCalledWith();
        },
      });

      vi.advanceTimersByTime(100);
    });

    it('should return the result from the load function', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: 'test',
        data: { preload: true, preloadDelay: 0 },
      };

      const expectedResult = { module: 'TestModule' };
      const customLoad = vi.fn().mockReturnValue(of(expectedResult));

      const result$ = strategy.preload(route, customLoad);

      result$.subscribe({
        next: (value) => {
          expect(value).toEqual(expectedResult);
        },
      });

      vi.advanceTimersByTime(0);
    });

    it('should propagate errors from load function', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: 'test',
        data: { preload: true, preloadDelay: 0 },
      };

      const error = new Error('Load failed');
      const failingLoad = vi.fn().mockReturnValue(throwError(() => error));

      const result$ = strategy.preload(route, failingLoad);

      result$.subscribe({
        error: (err) => {
          expect(err).toBe(error);
        },
      });

      vi.advanceTimersByTime(0);
    });
  });

  describe('edge cases', () => {
    it('should handle route without data property', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: 'no-data',
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe({
        next: () => {
          expect(mockLoad).toHaveBeenCalledOnce();
        },
      });

      vi.advanceTimersByTime(2000);
    });

    it('should handle route with empty data object', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: 'empty-data',
        data: {},
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe({
        next: () => {
          expect(mockLoad).toHaveBeenCalledOnce();
        },
      });

      vi.advanceTimersByTime(2000);
    });

    it('should handle route with preload: true but no delay specified', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: 'explicit-preload',
        data: { preload: true },
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe({
        next: () => {
          expect(mockLoad).toHaveBeenCalledOnce();
        },
      });

      vi.advanceTimersByTime(2000);
    });

    it('should handle very long delays', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: 'long-delay',
        data: { preload: true, preloadDelay: 10000 },
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe();

      vi.advanceTimersByTime(9999);
      expect(mockLoad).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(mockLoad).toHaveBeenCalledOnce();
    });
  });

  describe('real-world route configurations', () => {
    it('should handle modules route with 1s delay', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: 'modules',
        data: { preload: true, preloadDelay: 1000 },
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe({
        next: () => {
          expect(mockLoad).toHaveBeenCalledOnce();
          expect(consoleLogSpy).toHaveBeenCalledWith('[Preload] Loading route: modules');
        },
      });

      vi.advanceTimersByTime(1000);
    });

    it('should not preload architecture route', () => {
      const route: Route = {
        path: 'architecture',
        data: { preload: false },
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe({
        next: (value) => {
          expect(value).toBeNull();
          expect(mockLoad).not.toHaveBeenCalled();
        },
      });
    });

    it('should handle blog route with 2s delay', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: 'blog',
        data: { preload: true, preloadDelay: 2000 },
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe({
        next: () => {
          expect(mockLoad).toHaveBeenCalledOnce();
        },
      });

      vi.advanceTimersByTime(2000);
    });

    it('should handle contact route with 5s delay', () => {
      vi.useFakeTimers();

      const route: Route = {
        path: 'contact',
        data: { preload: true, preloadDelay: 5000 },
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe({
        next: () => {
          expect(mockLoad).toHaveBeenCalledOnce();
        },
      });

      vi.advanceTimersByTime(5000);
    });
  });

  describe('concurrent preloading', () => {
    it('should handle multiple routes preloading concurrently', () => {
      vi.useFakeTimers();

      const routes: Route[] = [
        { path: 'route1', data: { preload: true, preloadDelay: 100 } },
        { path: 'route2', data: { preload: true, preloadDelay: 200 } },
        { path: 'route3', data: { preload: true, preloadDelay: 300 } },
      ];

      const loadFunctions = routes.map(() => vi.fn().mockReturnValue(of('loaded')));

      routes.forEach((route, index) => {
        strategy.preload(route, loadFunctions[index]).subscribe();
      });

      // After 100ms, only first route should load
      vi.advanceTimersByTime(100);
      expect(loadFunctions[0]).toHaveBeenCalledOnce();
      expect(loadFunctions[1]).not.toHaveBeenCalled();
      expect(loadFunctions[2]).not.toHaveBeenCalled();

      // After 200ms total, first two routes should load
      vi.advanceTimersByTime(100);
      expect(loadFunctions[0]).toHaveBeenCalledOnce();
      expect(loadFunctions[1]).toHaveBeenCalledOnce();
      expect(loadFunctions[2]).not.toHaveBeenCalled();

      // After 300ms total, all routes should load
      vi.advanceTimersByTime(100);
      expect(loadFunctions[0]).toHaveBeenCalledOnce();
      expect(loadFunctions[1]).toHaveBeenCalledOnce();
      expect(loadFunctions[2]).toHaveBeenCalledOnce();
    });
  });
});
