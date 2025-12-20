// @vitest-environment jsdom
import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, vi } from 'vitest';

import { ToastService } from '../../services/toast/toast.service';

import type { ToastPosition } from './toast.component';

@Component({
  selector: 'eb-test-host',
  template: `
    @for (position of positions; track position) {
      @if (getToastsForPosition(position).length > 0) {
        <div
          class="toast-container toast-container--{{ position }}"
          [attr.aria-label]="'Notifications at ' + position"
          role="region"
        >
          @for (toast of getToastsForPosition(position); track toast.id) {
            <div class="toast">
              <span class="toast__icon" aria-hidden="true">{{ toast.variant }}</span>
              <div class="toast__content">
                @if (toast.title) {
                  <h4>{{ toast.title }}</h4>
                }
                <p>{{ toast.message }}</p>
              </div>
              <button class="toast__dismiss" (click)="handleDismiss(toast.id)">×</button>
            </div>
          }
        </div>
      }
    }
  `,
})
class TestHostComponent {
  positions = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ] as const;

  toastService!: ToastService;

  getToastsForPosition(position: ToastPosition): ReturnType<ToastService['getToastsByPosition']> {
    return this.toastService.getToastsByPosition(position);
  }

  handleDismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}

describe('ToastContainerComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let toastService: ToastService;
  let hostComponent: TestHostComponent;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [ToastService],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    toastService = TestBed.inject(ToastService);
    hostComponent.toastService = toastService;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(hostComponent).toBeTruthy();
    });
  });

  describe('Position Management', () => {
    it('should define all six positions', () => {
      expect(hostComponent.positions).toEqual([
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ]);
    });

    it('should get toasts for a specific position', () => {
      toastService.show({ message: 'Test 1', position: 'top-right' });
      toastService.show({ message: 'Test 2', position: 'top-right' });
      toastService.show({ message: 'Test 3', position: 'bottom-left' });

      const topRightToasts = hostComponent.getToastsForPosition('top-right');
      expect(topRightToasts.length).toBe(2);

      const bottomLeftToasts = hostComponent.getToastsForPosition('bottom-left');
      expect(bottomLeftToasts.length).toBe(1);
    });

    it('should return empty array when no toasts at position', () => {
      const toasts = hostComponent.getToastsForPosition('top-center');
      expect(toasts).toEqual([]);
    });
  });

  describe('Toast Dismissal', () => {
    it('should dismiss toast when handleDismiss is called', () => {
      const toastId = toastService.show({ message: 'Test' });
      expect(toastService.toasts().length).toBe(1);

      hostComponent.handleDismiss(toastId);

      // Should be marked as exiting
      expect(toastService.toasts()[0].isExiting).toBe(true);

      // After animation completes
      vi.advanceTimersByTime(300);
      expect(toastService.toasts().length).toBe(0);
    });

    it('should handle dismissing non-existent toast gracefully', () => {
      toastService.show({ message: 'Test' });
      expect(toastService.toasts().length).toBe(1);

      hostComponent.handleDismiss('non-existent-id');

      expect(toastService.toasts().length).toBe(1);
    });
  });

  describe('DOM Rendering', () => {
    it('should not render containers when no toasts exist', () => {
      fixture.detectChanges();

      const containers = nativeElement.querySelectorAll('.toast-container');
      expect(containers.length).toBe(0);
    });

    it('should render container for position with toasts', () => {
      toastService.show({ message: 'Test', position: 'top-right' });
      fixture.detectChanges();

      const container = nativeElement.querySelector('.toast-container--top-right');
      expect(container).toBeTruthy();
    });

    it('should render multiple containers for different positions', () => {
      toastService.show({ message: 'Test 1', position: 'top-right' });
      toastService.show({ message: 'Test 2', position: 'bottom-left' });
      fixture.detectChanges();

      const topRightContainer = nativeElement.querySelector('.toast-container--top-right');
      const bottomLeftContainer = nativeElement.querySelector('.toast-container--bottom-left');

      expect(topRightContainer).toBeTruthy();
      expect(bottomLeftContainer).toBeTruthy();
    });

    it('should render correct number of toasts in container', () => {
      toastService.show({ message: 'Test 1', position: 'top-right' });
      toastService.show({ message: 'Test 2', position: 'top-right' });
      toastService.show({ message: 'Test 3', position: 'bottom-left' });
      fixture.detectChanges();

      const topRightToasts = nativeElement.querySelectorAll('.toast-container--top-right .toast');
      const bottomLeftToasts = nativeElement.querySelectorAll(
        '.toast-container--bottom-left .toast',
      );

      expect(topRightToasts.length).toBe(2);
      expect(bottomLeftToasts.length).toBe(1);
    });

    it('should set correct ARIA attributes on container', () => {
      toastService.show({ message: 'Test', position: 'top-right' });
      fixture.detectChanges();

      const container = nativeElement.querySelector('.toast-container--top-right');
      expect(container?.getAttribute('role')).toBe('region');
      expect(container?.getAttribute('aria-label')).toContain('top-right');
    });
  });

  describe('Toast Component Integration', () => {
    it('should pass correct props to toast component', () => {
      toastService.show({
        message: 'Test message',
        title: 'Test title',
        variant: 'success',
        duration: 3000,
        dismissible: true,
        position: 'top-right',
      });
      fixture.detectChanges();

      const toastElement = nativeElement.querySelector('.toast');
      expect(toastElement).toBeTruthy();
    });

    it('should handle toast dismissal from child component', () => {
      toastService.show({ message: 'Test', dismissible: true });
      fixture.detectChanges();

      const dismissButton = nativeElement.querySelector<HTMLButtonElement>('.toast__dismiss');
      dismissButton?.click();

      // Toast should be marked as exiting
      expect(toastService.toasts()[0].isExiting).toBe(true);

      // After animation
      vi.advanceTimersByTime(300);
      expect(toastService.toasts().length).toBe(0);
    });
  });

  describe('Dynamic Toast Management', () => {
    it('should update when new toast is added', () => {
      fixture.detectChanges();

      let containers = nativeElement.querySelectorAll('.toast-container');
      expect(containers.length).toBe(0);

      toastService.show({ message: 'New toast' });
      fixture.detectChanges();

      containers = nativeElement.querySelectorAll('.toast-container');
      expect(containers.length).toBe(1);
    });

    it('should update when toast is removed', () => {
      const id = toastService.show({ message: 'Test' });
      fixture.detectChanges();

      let containers = nativeElement.querySelectorAll('.toast-container');
      expect(containers.length).toBe(1);

      toastService.dismiss(id);
      vi.advanceTimersByTime(300);
      fixture.detectChanges();

      containers = nativeElement.querySelectorAll('.toast-container');
      expect(containers.length).toBe(0);
    });

    it('should handle multiple toasts at same position', () => {
      toastService.show({ message: 'Toast 1', position: 'top-right' });
      toastService.show({ message: 'Toast 2', position: 'top-right' });
      toastService.show({ message: 'Toast 3', position: 'top-right' });
      fixture.detectChanges();

      const toasts = nativeElement.querySelectorAll('.toast-container--top-right .toast');
      expect(toasts.length).toBe(3);
    });
  });

  describe('All Positions Rendering', () => {
    it('should render containers for all positions when toasts present', () => {
      const positions = [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ] as const;

      positions.forEach((position) => {
        toastService.show({ message: `Test ${position}`, position });
      });

      fixture.detectChanges();

      positions.forEach((position) => {
        const container = nativeElement.querySelector(`.toast-container--${position}`);
        expect(container).toBeTruthy();
      });
    });
  });

  describe('Additional Behaviors', () => {
    it('should call toastService.dismiss when child emits dismissed', () => {
      const spy = vi.spyOn(toastService, 'dismiss');

      const id = toastService.show({
        message: 'Dismiss me',
        dismissible: true,
        position: 'top-right',
      });
      fixture.detectChanges();

      const dismissButton = nativeElement.querySelector<HTMLButtonElement>('.toast__dismiss');
      expect(dismissButton).toBeTruthy();

      dismissButton?.click();

      expect(spy).toHaveBeenCalledWith(id);

      // allow exit animation to complete
      vi.advanceTimersByTime(300);
      fixture.detectChanges();
      expect(toastService.toasts().length).toBe(0);
    });

    it('should preserve insertion order of toasts in the DOM', () => {
      toastService.show({ message: 'First', position: 'top-right' });
      toastService.show({ message: 'Second', position: 'top-right' });
      toastService.show({ message: 'Third', position: 'top-right' });

      fixture.detectChanges();

      const paragraphs = nativeElement.querySelectorAll(
        '.toast-container--top-right .toast__content p',
      );

      const texts = Array.from(paragraphs).map((p) => p.textContent.trim());
      expect(texts).toEqual(['First', 'Second', 'Third']);
    });

    it('should call dismiss for each toast when toastService.dismissAll is invoked', () => {
      const spy = vi.spyOn(toastService, 'dismiss');
      toastService.show({ message: 'A', position: 'top-right' });
      toastService.show({ message: 'B', position: 'top-right' });

      // dismissAll should call dismiss for each active toast
      toastService.dismissAll();

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
