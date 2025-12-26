import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { debounce, throttle } from './debounce-throttle.utils';

describe('DebounceThrottleUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('debounce', () => {
    it('should debounce function calls', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();
      debounced();
      debounced();

      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced('test', 123);
      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledWith('test', 123);
    });

    it('should use the latest arguments', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced('first');
      debounced('second');
      debounced('third');

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledWith('third');
    });

    it('should support leading edge execution', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { leading: true, trailing: false });

      debounced();
      expect(func).toHaveBeenCalledTimes(1);

      debounced();
      debounced();
      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should support both leading and trailing execution', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { leading: true, trailing: true });

      debounced();
      expect(func).toHaveBeenCalledTimes(1);

      debounced();
      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should support maxWait option', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { maxWait: 200 });

      debounced();
      vi.advanceTimersByTime(150);
      debounced();
      vi.advanceTimersByTime(60);

      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should cancel pending execution', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();
      debounced.cancel();

      vi.advanceTimersByTime(100);
      expect(func).not.toHaveBeenCalled();
    });

    it('should flush pending execution', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced('test');
      debounced.flush();

      expect(func).toHaveBeenCalledWith('test');
    });

    it('should indicate if execution is pending', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      expect(debounced.pending()).toBe(false);

      debounced();
      expect(debounced.pending()).toBe(true);

      vi.advanceTimersByTime(100);
      expect(debounced.pending()).toBe(false);
    });

    it('should return undefined when no result yet', () => {
      const func = vi.fn(() => 'result');
      const debounced = debounce(func, 100);

      const result = debounced();
      expect(result).toBeUndefined();

      vi.advanceTimersByTime(100);
    });

    it('should return cached result after execution', () => {
      const func = vi.fn(() => 'result');
      const debounced = debounce(func, 100);

      debounced();
      vi.advanceTimersByTime(100);

      // Next call before timer expires returns cached result
      const result = debounced();
      expect(result).toBe('result');
    });

    it('should reschedule timer when called during wait period', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced('first');
      vi.advanceTimersByTime(50); // Half the wait time

      debounced('second');
      vi.advanceTimersByTime(50); // Another half - original timer would have fired

      expect(func).not.toHaveBeenCalled(); // Should not have fired yet

      vi.advanceTimersByTime(50); // Complete the new timer
      expect(func).toHaveBeenCalledTimes(1);
      expect(func).toHaveBeenCalledWith('second');
    });

    it('should invoke immediately with maxWait when timer exists', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { maxWait: 150 });

      debounced('first');
      vi.advanceTimersByTime(50);
      debounced('second');
      vi.advanceTimersByTime(50);
      debounced('third');
      vi.advanceTimersByTime(50); // 150ms total - maxWait reached

      expect(func).toHaveBeenCalledTimes(1);
      expect(func).toHaveBeenCalledWith('third');
    });

    it('should not invoke trailing when trailing is false and no leading', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { leading: false, trailing: false });

      debounced();
      vi.advanceTimersByTime(100);

      expect(func).not.toHaveBeenCalled();
    });

    it('should handle flush when no timer is pending', () => {
      const func = vi.fn(() => 'result');
      const debounced = debounce(func, 100);

      // Flush without ever calling debounced
      const result = debounced.flush();
      expect(result).toBeUndefined();
      expect(func).not.toHaveBeenCalled();
    });

    it('should handle negative time since last call', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();
      // Simulate time going backwards (edge case)
      vi.setSystemTime(Date.now() - 1000);
      debounced();

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalled();
    });

    it('should handle cancel when maxWait timer is pending', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100, { maxWait: 200 });

      debounced();
      vi.advanceTimersByTime(50);
      debounced.cancel();

      vi.advanceTimersByTime(200);
      expect(func).not.toHaveBeenCalled();
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttled();
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should support leading edge execution', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100, { leading: true });

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      vi.advanceTimersByTime(50);
      throttled();

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should support trailing edge execution', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100, { leading: false, trailing: true });

      throttled();
      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should support both leading and trailing execution', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100, { leading: true, trailing: true });

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should cancel pending execution', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100, { trailing: true });

      throttled();
      throttled.cancel();

      vi.advanceTimersByTime(100);
      // Leading edge executed, but trailing should be canceled
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should flush pending execution', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100, { leading: true, trailing: true });

      throttled();
      throttled();
      throttled.flush();

      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments correctly', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled('first', 1);
      expect(func).toHaveBeenCalledWith('first', 1);

      vi.advanceTimersByTime(100);
      throttled('second', 2);
      expect(func).toHaveBeenCalledWith('second', 2);
    });
  });
});
