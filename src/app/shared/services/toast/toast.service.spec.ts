// @vitest-environment jsdom
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, vi } from 'vitest';

import type { ToastConfig } from './toast.service';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });
    service = TestBed.inject(ToastService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have empty toasts on initialization', () => {
      expect(service.toasts()).toEqual([]);
    });
  });

  describe('show() - Generic Toast', () => {
    it('should add a toast to the list', () => {
      const config: ToastConfig = {
        message: 'Test message',
      };

      service.show(config);

      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].message).toBe('Test message');
    });

    it('should return unique ID for each toast', () => {
      const id1 = service.show({ message: 'Message 1' });
      const id2 = service.show({ message: 'Message 2' });

      expect(id1).not.toBe(id2);
      expect(service.toasts().length).toBe(2);
    });

    it('should apply default values when not specified', () => {
      service.show({ message: 'Test' });

      const toast = service.toasts()[0];
      expect(toast.variant).toBe('info');
      expect(toast.duration).toBe(5000);
      expect(toast.dismissible).toBe(true);
      expect(toast.position).toBe('top-right');
      expect(toast.isExiting).toBe(false);
    });

    it('should apply custom configuration', () => {
      const config: ToastConfig = {
        message: 'Custom message',
        title: 'Custom title',
        variant: 'success',
        duration: 3000,
        dismissible: false,
        position: 'bottom-left',
      };

      service.show(config);

      const toast = service.toasts()[0];
      expect(toast.message).toBe('Custom message');
      expect(toast.title).toBe('Custom title');
      expect(toast.variant).toBe('success');
      expect(toast.duration).toBe(3000);
      expect(toast.dismissible).toBe(false);
      expect(toast.position).toBe('bottom-left');
    });

    it('should auto-dismiss toast after duration', () => {
      service.show({ message: 'Test', duration: 5000 });

      expect(service.toasts().length).toBe(1);

      // Fast-forward time by 300ms (exiting animation)
      vi.advanceTimersByTime(300);
      expect(service.toasts().length).toBe(1);

      // Fast-forward time by 4700ms more (total 5000ms)
      vi.advanceTimersByTime(4700);
      // Toast should be marked as exiting
      expect(service.toasts()[0].isExiting).toBe(true);

      // Fast-forward time by 300ms for removal
      vi.advanceTimersByTime(300);
      expect(service.toasts().length).toBe(0);
    });

    it('should not auto-dismiss when duration is 0', () => {
      service.show({ message: 'Test', duration: 0 });

      expect(service.toasts().length).toBe(1);

      // Fast-forward time significantly
      vi.advanceTimersByTime(10000);

      // Toast should still be there
      expect(service.toasts().length).toBe(1);
    });
  });

  describe('success() - Success Toast', () => {
    it('should create success toast with correct variant', () => {
      service.success('Success message');

      const toast = service.toasts()[0];
      expect(toast.variant).toBe('success');
      expect(toast.message).toBe('Success message');
    });

    it('should accept additional config options', () => {
      service.success('Success', {
        title: 'Great!',
        duration: 3000,
      });

      const toast = service.toasts()[0];
      expect(toast.variant).toBe('success');
      expect(toast.title).toBe('Great!');
      expect(toast.duration).toBe(3000);
    });
  });

  describe('error() - Error Toast', () => {
    it('should create error toast with correct variant', () => {
      service.error('Error message');

      const toast = service.toasts()[0];
      expect(toast.variant).toBe('error');
      expect(toast.message).toBe('Error message');
    });

    it('should accept additional config options', () => {
      service.error('Error', {
        title: 'Oops!',
        duration: 10000,
      });

      const toast = service.toasts()[0];
      expect(toast.variant).toBe('error');
      expect(toast.title).toBe('Oops!');
      expect(toast.duration).toBe(10000);
    });
  });

  describe('warning() - Warning Toast', () => {
    it('should create warning toast with correct variant', () => {
      service.warning('Warning message');

      const toast = service.toasts()[0];
      expect(toast.variant).toBe('warning');
      expect(toast.message).toBe('Warning message');
    });

    it('should accept additional config options', () => {
      service.warning('Warning', {
        title: 'Attention!',
        position: 'top-center',
      });

      const toast = service.toasts()[0];
      expect(toast.variant).toBe('warning');
      expect(toast.title).toBe('Attention!');
      expect(toast.position).toBe('top-center');
    });
  });

  describe('info() - Info Toast', () => {
    it('should create info toast with correct variant', () => {
      service.info('Info message');

      const toast = service.toasts()[0];
      expect(toast.variant).toBe('info');
      expect(toast.message).toBe('Info message');
    });

    it('should accept additional config options', () => {
      service.info('Info', {
        title: 'FYI',
        dismissible: false,
      });

      const toast = service.toasts()[0];
      expect(toast.variant).toBe('info');
      expect(toast.title).toBe('FYI');
      expect(toast.dismissible).toBe(false);
    });
  });

  describe('dismiss() - Manual Dismissal', () => {
    it('should dismiss a toast by ID', () => {
      const id = service.show({ message: 'Test' });
      expect(service.toasts().length).toBe(1);

      service.dismiss(id);

      // Should be marked as exiting
      expect(service.toasts()[0].isExiting).toBe(true);

      // After animation completes
      vi.advanceTimersByTime(300);
      expect(service.toasts().length).toBe(0);
    });

    it('should clear auto-dismiss timer when manually dismissed', () => {
      const id = service.show({ message: 'Test', duration: 5000 });

      // Manually dismiss before auto-dismiss
      service.dismiss(id);

      // Fast-forward past original auto-dismiss time
      vi.advanceTimersByTime(5000);

      // Should be gone (only called once)
      vi.advanceTimersByTime(300);
      expect(service.toasts().length).toBe(0);
    });

    it('should do nothing if toast ID does not exist', () => {
      service.show({ message: 'Test' });
      expect(service.toasts().length).toBe(1);

      service.dismiss('non-existent-id');

      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].isExiting).toBe(false);
    });

    it('should only dismiss the specified toast', () => {
      const id1 = service.show({ message: 'Test 1' });
      const id2 = service.show({ message: 'Test 2' });

      service.dismiss(id1);
      vi.advanceTimersByTime(300);

      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].id).toBe(id2);
    });
  });

  describe('dismissAll() - Dismiss All Toasts', () => {
    it('should dismiss all active toasts', () => {
      service.show({ message: 'Test 1' });
      service.show({ message: 'Test 2' });
      service.show({ message: 'Test 3' });

      expect(service.toasts().length).toBe(3);

      service.dismissAll();

      // All should be marked as exiting
      expect(service.toasts().every((t) => t.isExiting)).toBe(true);

      // After animation completes
      vi.advanceTimersByTime(300);
      expect(service.toasts().length).toBe(0);
    });

    it('should handle empty toast list', () => {
      expect(service.toasts().length).toBe(0);

      service.dismissAll();

      expect(service.toasts().length).toBe(0);
    });
  });

  describe('getToastsByPosition()', () => {
    it('should return toasts for a specific position', () => {
      service.show({ message: 'Top right 1', position: 'top-right' });
      service.show({ message: 'Top right 2', position: 'top-right' });
      service.show({ message: 'Bottom left', position: 'bottom-left' });

      const topRightToasts = service.getToastsByPosition('top-right');
      expect(topRightToasts.length).toBe(2);
      expect(topRightToasts.every((t) => t.position === 'top-right')).toBe(true);

      const bottomLeftToasts = service.getToastsByPosition('bottom-left');
      expect(bottomLeftToasts.length).toBe(1);
      expect(bottomLeftToasts[0].position).toBe('bottom-left');
    });

    it('should return empty array when no toasts at position', () => {
      service.show({ message: 'Test', position: 'top-right' });

      const bottomToasts = service.getToastsByPosition('bottom-center');
      expect(bottomToasts).toEqual([]);
    });
  });

  describe('Multiple Toasts', () => {
    it('should handle multiple toasts simultaneously', () => {
      service.success('Success 1');
      service.error('Error 1');
      service.warning('Warning 1');
      service.info('Info 1');

      expect(service.toasts().length).toBe(4);
    });

    it('should maintain insertion order', () => {
      service.show({ message: 'First' });
      service.show({ message: 'Second' });
      service.show({ message: 'Third' });

      const messages = service.toasts().map((t) => t.message);
      expect(messages).toEqual(['First', 'Second', 'Third']);
    });

    it('should auto-dismiss multiple toasts independently', () => {
      service.show({ message: 'Fast', duration: 1000 });
      service.show({ message: 'Slow', duration: 3000 });

      expect(service.toasts().length).toBe(2);

      // Fast toast should dismiss after 1000ms
      vi.advanceTimersByTime(1300);
      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].message).toBe('Slow');

      // Slow toast should dismiss after 3000ms total
      vi.advanceTimersByTime(2000);
      expect(service.toasts().length).toBe(0);
    });
  });

  describe('Unique ID Generation', () => {
    it('should generate unique IDs', () => {
      const ids = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const id = service.show({ message: `Message ${String(i)}` });
        ids.add(id);
      }

      expect(ids.size).toBe(100);
    });

    it('should include timestamp in ID', () => {
      const id = service.show({ message: 'Test' });
      expect(id).toContain('toast-');
      expect(id).toContain(Date.now().toString().slice(0, -3)); // Rough timestamp match
    });
  });
});
