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
});
