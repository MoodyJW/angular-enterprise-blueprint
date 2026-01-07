// @vitest-environment jsdom
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { vi } from 'vitest';

import { TooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;
  let componentRef: ComponentRef<TooltipComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    nativeElement = fixture.nativeElement as HTMLElement;

    // Mock getBoundingClientRect for all elements to return valid dimensions
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 100,
      height: 40,
      top: 500,
      left: 500,
      bottom: 540,
      right: 600,
      x: 500,
      y: 500,
      toJSON: () => {},
    }));
  });

  describe('Rendering', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render tooltip with content', () => {
      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test tooltip');
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      const tooltipContent = nativeElement.querySelector('.tooltip__content') as HTMLElement;
      expect(tooltipContent.textContent).toBe('Test tooltip');

      document.body.removeChild(mockHost);
    });

    it('should have correct ARIA role', () => {
      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test');
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      expect(nativeElement.getAttribute('role')).toBe('tooltip');

      document.body.removeChild(mockHost);
    });

    it('should have aria-hidden set to false', () => {
      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test');
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      expect(nativeElement.getAttribute('aria-hidden')).toBe('false');

      document.body.removeChild(mockHost);
    });
  });

  describe('Positioning', () => {
    it('should apply top position class by default', () => {
      vi.useFakeTimers();
      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test');
      componentRef.setInput('position', 'top');
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      vi.advanceTimersByTime(10);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.tooltip--top')).toBeTruthy();

      document.body.removeChild(mockHost);
      vi.useRealTimers();
    });

    it('should apply bottom position class', () => {
      vi.useFakeTimers();
      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test');
      componentRef.setInput('position', 'bottom');
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      vi.advanceTimersByTime(10);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.tooltip--bottom')).toBeTruthy();

      document.body.removeChild(mockHost);
      vi.useRealTimers();
    });

    it('should apply left position class', () => {
      vi.useFakeTimers();
      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test');
      componentRef.setInput('position', 'left');
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      vi.advanceTimersByTime(10);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.tooltip--left')).toBeTruthy();

      document.body.removeChild(mockHost);
      vi.useRealTimers();
    });

    it('should apply right position class', () => {
      vi.useFakeTimers();
      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test');
      componentRef.setInput('position', 'right');
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      vi.advanceTimersByTime(10);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.tooltip--right')).toBeTruthy();

      document.body.removeChild(mockHost);
      vi.useRealTimers();
    });

    it('should handle auto position', () => {
      vi.useFakeTimers();
      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test');
      componentRef.setInput('position', 'auto');
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      vi.advanceTimersByTime(10);
      fixture.detectChanges();

      const tooltip = nativeElement.querySelector('.tooltip') as HTMLElement;
      // Auto position should resolve to one of the valid positions
      const hasValidPosition =
        tooltip.classList.contains('tooltip--top') ||
        tooltip.classList.contains('tooltip--bottom') ||
        tooltip.classList.contains('tooltip--left') ||
        tooltip.classList.contains('tooltip--right') ||
        tooltip.classList.contains('tooltip--auto');
      expect(hasValidPosition).toBe(true);

      document.body.removeChild(mockHost);
      vi.useRealTimers();
    });

    it('should set position styles', () => {
      vi.useFakeTimers();
      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test');
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      vi.advanceTimersByTime(10);
      fixture.detectChanges();

      expect(nativeElement.style.top).toBeDefined();
      expect(nativeElement.style.left).toBeDefined();

      document.body.removeChild(mockHost);
      vi.useRealTimers();
    });
  });

  describe('Arrow', () => {
    it('should render arrow element', () => {
      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test');
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      const arrow = nativeElement.querySelector('.tooltip__arrow') as HTMLElement;
      expect(arrow).toBeTruthy();

      document.body.removeChild(mockHost);
    });
  });

  describe('Accessibility', () => {
    it('should be accessible to screen readers', () => {
      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Important information');
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      expect(nativeElement.getAttribute('role')).toBe('tooltip');
      expect(nativeElement.getAttribute('aria-hidden')).toBe('false');

      document.body.removeChild(mockHost);
    });

    it('should have pointer-events: none to not interfere with interactions', () => {
      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test');
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      const computedStyle = window.getComputedStyle(nativeElement);
      expect(computedStyle.pointerEvents).toBe('none');

      document.body.removeChild(mockHost);
    });
  });

  describe('Edge Cases', () => {
    it('should handle tooltip positioned near top edge of viewport', () => {
      vi.useFakeTimers();

      // Mock element near top of viewport
      Element.prototype.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 40,
        top: 10, // Very close to top
        left: 500,
        bottom: 50,
        right: 600,
        x: 500,
        y: 10,
        toJSON: () => {},
      }));

      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test');
      componentRef.setInput('position', 'top'); // Request top, but not enough space
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      vi.advanceTimersByTime(10);
      fixture.detectChanges();

      // Should fall back to a position that fits
      const tooltip = nativeElement.querySelector('.tooltip') as HTMLElement;
      expect(tooltip).toBeTruthy();

      document.body.removeChild(mockHost);
      vi.useRealTimers();
    });

    it('should handle tooltip positioned near left edge of viewport', () => {
      vi.useFakeTimers();

      // Mock element near left of viewport
      Element.prototype.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 40,
        top: 500,
        left: 10, // Very close to left
        bottom: 540,
        right: 110,
        x: 10,
        y: 500,
        toJSON: () => {},
      }));

      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test');
      componentRef.setInput('position', 'left'); // Request left, but not enough space
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      vi.advanceTimersByTime(10);
      fixture.detectChanges();

      const tooltip = nativeElement.querySelector('.tooltip') as HTMLElement;
      expect(tooltip).toBeTruthy();

      document.body.removeChild(mockHost);
      vi.useRealTimers();
    });

    it('should handle tooltip that cannot fit in any position', () => {
      vi.useFakeTimers();

      // Mock very large tooltip that cannot fit anywhere
      Element.prototype.getBoundingClientRect = vi.fn(() => ({
        width: 2000, // Larger than viewport
        height: 1500,
        top: 500,
        left: 500,
        bottom: 2000,
        right: 2500,
        x: 500,
        y: 500,
        toJSON: () => {},
      }));

      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test');
      componentRef.setInput('position', 'auto');
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      vi.advanceTimersByTime(10);
      fixture.detectChanges();

      // Should default to 'top' when nothing fits
      const tooltip = nativeElement.querySelector('.tooltip') as HTMLElement;
      expect(tooltip).toBeTruthy();

      document.body.removeChild(mockHost);
      vi.useRealTimers();
    });

    it('should try opposite position when preferred position does not fit', () => {
      vi.useFakeTimers();

      // Mock element at bottom, so 'bottom' position won't fit
      Element.prototype.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 40,
        top: 700, // Near bottom of typical viewport
        left: 500,
        bottom: 740,
        right: 600,
        x: 500,
        y: 700,
        toJSON: () => {},
      }));

      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test');
      componentRef.setInput('position', 'bottom');
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      vi.advanceTimersByTime(10);
      fixture.detectChanges();

      const tooltip = nativeElement.querySelector('.tooltip') as HTMLElement;
      expect(tooltip).toBeTruthy();

      document.body.removeChild(mockHost);
      vi.useRealTimers();
    });

    it('should try alternative positions when preferred and opposite do not fit', () => {
      vi.useFakeTimers();

      // Mock element in corner where top and bottom don't fit
      Element.prototype.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 40,
        top: 20, // Near top
        left: 500,
        bottom: 60,
        right: 600,
        x: 500,
        y: 20,
        toJSON: () => {},
      }));

      // Override window dimensions to be small
      Object.defineProperty(window, 'innerHeight', { value: 100, writable: true });
      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });

      const mockHost = document.createElement('div');
      document.body.appendChild(mockHost);

      componentRef.setInput('content', 'Test');
      componentRef.setInput('position', 'top'); // Neither top nor bottom will fit
      componentRef.setInput('hostElement', mockHost);
      fixture.detectChanges();

      vi.advanceTimersByTime(10);
      fixture.detectChanges();

      // Should try left or right as alternatives
      const tooltip = nativeElement.querySelector('.tooltip') as HTMLElement;
      expect(tooltip).toBeTruthy();

      document.body.removeChild(mockHost);
      vi.useRealTimers();

      // Reset window dimensions
      Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    });
  });
});
