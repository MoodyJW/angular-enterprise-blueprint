import { TestBed } from '@angular/core/testing';
import { Route } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SmartPreloadStrategy } from './preload-strategy';

describe('SmartPreloadStrategy', () => {
  let strategy: SmartPreloadStrategy;
  let mockLoad: () => Observable<unknown>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let originalRequestIdleCallback: typeof window.requestIdleCallback | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmartPreloadStrategy],
    });

    strategy = TestBed.inject(SmartPreloadStrategy);
    mockLoad = vi.fn().mockReturnValue(of('loaded'));
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Save original requestIdleCallback for restoration
    originalRequestIdleCallback = window.requestIdleCallback;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    // Restore original requestIdleCallback
    if (originalRequestIdleCallback) {
      window.requestIdleCallback = originalRequestIdleCallback;
    }
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

  describe('idle-based preloading with requestIdleCallback', () => {
    it('should use requestIdleCallback when available', async () => {
      const mockRequestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
        // Execute callback immediately for testing
        callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
        return 1;
      });

      window.requestIdleCallback =
        mockRequestIdleCallback as unknown as typeof window.requestIdleCallback;

      const route: Route = {
        path: 'modules',
        data: { preload: true, preloadPriority: 1 },
      };

      strategy.preload(route, mockLoad).subscribe();

      // Wait for async processing
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockRequestIdleCallback).toHaveBeenCalled();
      expect(mockLoad).toHaveBeenCalledOnce();
    });

    it('should fall back to setTimeout when requestIdleCallback is not available', () => {
      vi.useFakeTimers();

      // Remove requestIdleCallback to test fallback
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      delete (window as any).requestIdleCallback;

      const route: Route = {
        path: 'modules',
        data: { preload: true, preloadPriority: 1 },
      };

      strategy.preload(route, mockLoad).subscribe();

      // Fast-forward time for setTimeout fallback (50ms)
      vi.advanceTimersByTime(50);

      expect(mockLoad).toHaveBeenCalledOnce();
    });

    it('should return null immediately without blocking', () => {
      const route: Route = {
        path: 'modules',
        data: { preload: true, preloadPriority: 1 },
      };

      const result$ = strategy.preload(route, mockLoad);

      result$.subscribe({
        next: (value) => {
          expect(value).toBeNull();
        },
      });
    });
  });

  describe('priority-based queue processing', () => {
    it('should process routes in priority order (lower number = higher priority)', async () => {
      const mockRequestIdleCallback = vi.fn();
      const callbacks: IdleRequestCallback[] = [];

      // Capture callbacks instead of executing them immediately
      mockRequestIdleCallback.mockImplementation((callback: IdleRequestCallback) => {
        callbacks.push(callback);
        return callbacks.length;
      });

      window.requestIdleCallback =
        mockRequestIdleCallback as unknown as typeof window.requestIdleCallback;

      const mockLoad1 = vi.fn().mockReturnValue(of('loaded1'));
      const mockLoad2 = vi.fn().mockReturnValue(of('loaded2'));
      const mockLoad3 = vi.fn().mockReturnValue(of('loaded3'));

      const route1: Route = { path: 'low-priority', data: { preload: true, preloadPriority: 3 } };
      const route2: Route = { path: 'high-priority', data: { preload: true, preloadPriority: 1 } };
      const route3: Route = {
        path: 'medium-priority',
        data: { preload: true, preloadPriority: 2 },
      };

      // Add routes in non-priority order
      strategy.preload(route1, mockLoad1).subscribe();
      strategy.preload(route2, mockLoad2).subscribe();
      strategy.preload(route3, mockLoad3).subscribe();

      // Execute first callback (should be high-priority)
      callbacks[0]({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(mockLoad2).toHaveBeenCalled(); // high-priority first

      // Execute second callback (should be medium-priority)
      callbacks[1]({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(mockLoad3).toHaveBeenCalled(); // medium-priority second

      // Execute third callback (should be low-priority)
      callbacks[2]({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(mockLoad1).toHaveBeenCalled(); // low-priority last
    });

    it('should use default priority of 99 when not specified', async () => {
      const mockRequestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
        callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
        return 1;
      });

      window.requestIdleCallback =
        mockRequestIdleCallback as unknown as typeof window.requestIdleCallback;

      const route: Route = {
        path: 'no-priority',
        data: { preload: true },
      };

      strategy.preload(route, mockLoad).subscribe();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Preload] Loading route: no-priority (priority: 99)',
      );
    });

    it('should process queue one item at a time', async () => {
      const callbacks: IdleRequestCallback[] = [];
      const mockRequestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
        callbacks.push(callback);
        return callbacks.length;
      });

      window.requestIdleCallback =
        mockRequestIdleCallback as unknown as typeof window.requestIdleCallback;

      const mockLoad1 = vi.fn().mockReturnValue(of('loaded1'));
      const mockLoad2 = vi.fn().mockReturnValue(of('loaded2'));

      strategy
        .preload({ path: 'route1', data: { preload: true, preloadPriority: 1 } }, mockLoad1)
        .subscribe();
      strategy
        .preload({ path: 'route2', data: { preload: true, preloadPriority: 2 } }, mockLoad2)
        .subscribe();

      // First callback should only process first route
      callbacks[0]({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockLoad1).toHaveBeenCalledOnce();
      expect(mockLoad2).not.toHaveBeenCalled();

      // Second callback should process second route
      callbacks[1]({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockLoad2).toHaveBeenCalledOnce();
    });
  });

  describe('console logging', () => {
    it('should log preload action with route path and priority', async () => {
      const mockRequestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
        callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
        return 1;
      });

      window.requestIdleCallback =
        mockRequestIdleCallback as unknown as typeof window.requestIdleCallback;

      const route: Route = {
        path: 'test-route',
        data: { preload: true, preloadPriority: 2 },
      };

      strategy.preload(route, mockLoad).subscribe();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Preload] Loading route: test-route (priority: 2)',
      );
    });

    it('should log "root" for routes without path', async () => {
      const mockRequestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
        callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
        return 1;
      });

      window.requestIdleCallback =
        mockRequestIdleCallback as unknown as typeof window.requestIdleCallback;

      const route: Route = {
        path: '',
        data: { preload: true, preloadPriority: 1 },
      };

      strategy.preload(route, mockLoad).subscribe();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(consoleLogSpy).toHaveBeenCalledWith('[Preload] Loading route: root (priority: 1)');
    });

    it('should log "root" for undefined path', async () => {
      const mockRequestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
        callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
        return 1;
      });

      window.requestIdleCallback =
        mockRequestIdleCallback as unknown as typeof window.requestIdleCallback;

      const route: Route = {
        data: { preload: true, preloadPriority: 1 },
      };

      strategy.preload(route, mockLoad).subscribe();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(consoleLogSpy).toHaveBeenCalledWith('[Preload] Loading route: root (priority: 1)');
    });
  });

  describe('error handling', () => {
    it('should log errors and continue processing queue', async () => {
      const callbacks: IdleRequestCallback[] = [];
      const mockRequestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
        callbacks.push(callback);
        return callbacks.length;
      });

      window.requestIdleCallback =
        mockRequestIdleCallback as unknown as typeof window.requestIdleCallback;

      const error = new Error('Load failed');
      const failingLoad = vi.fn().mockReturnValue(throwError(() => error));
      const successLoad = vi.fn().mockReturnValue(of('loaded'));

      strategy
        .preload({ path: 'failing', data: { preload: true, preloadPriority: 1 } }, failingLoad)
        .subscribe();
      strategy
        .preload({ path: 'success', data: { preload: true, preloadPriority: 2 } }, successLoad)
        .subscribe();

      // Process first route (fails)
      callbacks[0]({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Preload] Failed to load route: failing',
        error,
      );

      // Process second route (succeeds despite first failing)
      callbacks[1]({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(successLoad).toHaveBeenCalledOnce();
    });
  });

  describe('edge cases', () => {
    it('should handle route without data property', async () => {
      const mockRequestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
        callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
        return 1;
      });

      window.requestIdleCallback =
        mockRequestIdleCallback as unknown as typeof window.requestIdleCallback;

      const route: Route = {
        path: 'no-data',
      };

      strategy.preload(route, mockLoad).subscribe();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockLoad).toHaveBeenCalledOnce();
      expect(consoleLogSpy).toHaveBeenCalledWith('[Preload] Loading route: no-data (priority: 99)');
    });

    it('should handle route with empty data object', async () => {
      const mockRequestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
        callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
        return 1;
      });

      window.requestIdleCallback =
        mockRequestIdleCallback as unknown as typeof window.requestIdleCallback;

      const route: Route = {
        path: 'empty-data',
        data: {},
      };

      strategy.preload(route, mockLoad).subscribe();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockLoad).toHaveBeenCalledOnce();
    });

    it('should handle route with preload: true but no priority specified', async () => {
      const mockRequestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
        callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
        return 1;
      });

      window.requestIdleCallback =
        mockRequestIdleCallback as unknown as typeof window.requestIdleCallback;

      const route: Route = {
        path: 'explicit-preload',
        data: { preload: true },
      };

      strategy.preload(route, mockLoad).subscribe();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockLoad).toHaveBeenCalledOnce();
    });
  });

  describe('real-world route configurations', () => {
    it('should handle modules route with priority 1', async () => {
      const mockRequestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
        callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
        return 1;
      });

      window.requestIdleCallback =
        mockRequestIdleCallback as unknown as typeof window.requestIdleCallback;

      const route: Route = {
        path: 'modules',
        data: { preload: true, preloadPriority: 1 },
      };

      strategy.preload(route, mockLoad).subscribe();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockLoad).toHaveBeenCalledOnce();
      expect(consoleLogSpy).toHaveBeenCalledWith('[Preload] Loading route: modules (priority: 1)');
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

    it('should handle blog route with priority 2', async () => {
      const mockRequestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
        callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
        return 1;
      });

      window.requestIdleCallback =
        mockRequestIdleCallback as unknown as typeof window.requestIdleCallback;

      const route: Route = {
        path: 'blog',
        data: { preload: true, preloadPriority: 2 },
      };

      strategy.preload(route, mockLoad).subscribe();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockLoad).toHaveBeenCalledOnce();
      expect(consoleLogSpy).toHaveBeenCalledWith('[Preload] Loading route: blog (priority: 2)');
    });

    it('should handle contact route with priority 4', async () => {
      const mockRequestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
        callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
        return 1;
      });

      window.requestIdleCallback =
        mockRequestIdleCallback as unknown as typeof window.requestIdleCallback;

      const route: Route = {
        path: 'contact',
        data: { preload: true, preloadPriority: 4 },
      };

      strategy.preload(route, mockLoad).subscribe();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockLoad).toHaveBeenCalledOnce();
      expect(consoleLogSpy).toHaveBeenCalledWith('[Preload] Loading route: contact (priority: 4)');
    });
  });
});
