/**
 * Debounce and Throttle Utility Functions
 *
 * Provides debouncing and throttling for standalone functions (not Observables).
 * For RxJS streams, use `debounceTime` and `throttleTime` operators directly.
 *
 * @module DebounceThrottleUtils
 */

/**
 * Options for debounce operations
 */
export interface DebounceOptions {
  /** Execute on the leading edge instead of trailing (default: false) */
  leading?: boolean;
  /** Execute on the trailing edge (default: true) */
  trailing?: boolean;
  /** Maximum wait time before forced execution (in ms) */
  maxWait?: number;
}

/**
 * Options for throttle operations
 */
export interface ThrottleOptions {
  /** Execute on the leading edge (default: true) */
  leading?: boolean;
  /** Execute on the trailing edge (default: false) */
  trailing?: boolean;
}

/** Debounced function interface with control methods */
export interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  /** Cancel any pending execution */
  cancel: () => void;
  /** Execute pending function immediately */
  flush: () => ReturnType<T> | undefined;
  /** Check if there's a pending execution */
  pending: () => boolean;
}

/**
 * Creates a debounced function that delays invoking func until after
 * wait milliseconds have elapsed since the last time the debounced
 * function was invoked.
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param options - Debounce options
 * @returns The debounced function with cancel, flush, and pending methods
 *
 * @example
 * ```typescript
 * // Basic debounce - waits 300ms after last call
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * // Leading edge execution
 * const debouncedClick = debounce(handleClick, 500, { leading: true, trailing: false });
 *
 * // With max wait
 * const debouncedScroll = debounce(handleScroll, 100, { maxWait: 500 });
 *
 * // Cancel pending execution
 * debouncedSearch.cancel();
 *
 * // Flush pending execution immediately
 * debouncedSearch.flush();
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options: DebounceOptions = {},
): DebouncedFunction<T> {
  const { leading = false, trailing = true, maxWait } = options;

  let timerId: ReturnType<typeof setTimeout> | undefined;
  let maxTimerId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | undefined;
  let result: ReturnType<T> | undefined;

  function invokeFunc(time: number): ReturnType<T> | undefined {
    const args = lastArgs;

    lastArgs = undefined;
    lastInvokeTime = time;

    if (args !== undefined) {
      result = func(...args) as ReturnType<T>;
    }
    return result;
  }

  function startTimer(pendingFunc: () => void, delay: number): ReturnType<typeof setTimeout> {
    return setTimeout(pendingFunc, delay);
  }

  function cancelTimer(id: ReturnType<typeof setTimeout> | undefined): void {
    if (id !== undefined) {
      clearTimeout(id);
    }
  }

  function leadingEdge(time: number): ReturnType<T> | undefined {
    lastInvokeTime = time;
    timerId = startTimer(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = lastCallTime !== undefined ? time - lastCallTime : 0;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = lastCallTime !== undefined ? time - lastCallTime : 0;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired(): ReturnType<T> | undefined {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = startTimer(timerExpired, remainingWait(time));
    return undefined;
  }

  function trailingEdge(time: number): ReturnType<T> | undefined {
    timerId = undefined;

    if (trailing && lastArgs !== undefined) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    return result;
  }

  function cancel(): void {
    cancelTimer(timerId);
    cancelTimer(maxTimerId);
    lastInvokeTime = 0;
    lastArgs = undefined;
    lastCallTime = undefined;
    timerId = undefined;
    maxTimerId = undefined;
  }

  function flush(): ReturnType<T> | undefined {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function pending(): boolean {
    return timerId !== undefined;
  }

  function debounced(...args: Parameters<T>): ReturnType<T> | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    timerId ??= startTimer(timerExpired, wait);
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced;
}

/**
 * Creates a throttled function that only invokes func at most once per
 * every wait milliseconds.
 *
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @param options - Throttle options
 * @returns The throttled function with cancel, flush, and pending methods
 *
 * @example
 * ```typescript
 * // Basic throttle - executes at most once per 200ms
 * const throttledResize = throttle(() => {
 *   console.log('Window resized');
 * }, 200);
 *
 * // Trailing edge execution
 * const throttledScroll = throttle(handleScroll, 100, { trailing: true });
 *
 * // Leading edge disabled
 * const throttledInput = throttle(handleInput, 300, { leading: false, trailing: true });
 *
 * // Cancel pending execution
 * throttledResize.cancel();
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options: ThrottleOptions = {},
): DebouncedFunction<T> {
  const { leading = true, trailing = false } = options;

  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  });
}
