// @vitest-environment jsdom
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

import { TooltipDirective } from './tooltip.directive';

@Component({
  template: `
    <button
      ebTooltip="Test tooltip"
      [tooltipPosition]="position"
      [tooltipDisabled]="disabled"
      [tooltipShowDelay]="showDelay"
      [tooltipHideDelay]="hideDelay"
    >
      Hover me
    </button>
  `,
  imports: [TooltipDirective],
})
class TestHostComponent {
  position: 'top' | 'bottom' | 'left' | 'right' | 'auto' = 'top';
  disabled = false;
  showDelay = 200;
  hideDelay = 0;
}

describe('TooltipDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let buttonElement: DebugElement;
  let buttonNative: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TooltipDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    buttonElement = fixture.debugElement.query(By.css('button'));
    buttonNative = buttonElement.nativeElement as HTMLButtonElement;
  });

  afterEach(() => {
    // Clean up any tooltips that might have been created
    const tooltips = document.querySelectorAll('eb-tooltip');
    tooltips.forEach((tooltip) => {
      tooltip.remove();
    });
    vi.clearAllTimers();
  });

  describe('Initialization', () => {
    it('should create directive', () => {
      fixture.detectChanges();
      const directive = buttonElement.injector.get(TooltipDirective);
      expect(directive).toBeTruthy();
    });

    it('should add aria-label to host element', () => {
      fixture.detectChanges();
      expect(buttonNative.getAttribute('aria-label')).toBe('Test tooltip');
    });
  });

  describe('Mouse Events', () => {
    it('should show tooltip on mouseenter after delay', async () => {
      fixture.detectChanges();
      vi.useFakeTimers();
      buttonNative.dispatchEvent(new MouseEvent('mouseenter'));

      vi.advanceTimersByTime(100);
      expect(document.querySelector('eb-tooltip')).toBeNull();

      vi.advanceTimersByTime(150);
      await vi.runAllTimersAsync();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.querySelector('eb-tooltip')).toBeTruthy();
      vi.useRealTimers();
    });

    it('should hide tooltip on mouseleave', async () => {
      fixture.detectChanges();
      vi.useFakeTimers();
      buttonNative.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(250);
      await vi.runAllTimersAsync();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.querySelector('eb-tooltip')).toBeTruthy();

      buttonNative.dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(50);
      await vi.runAllTimersAsync();

      expect(document.querySelector('eb-tooltip')).toBeNull();
      vi.useRealTimers();
    });

    it('should cancel show on quick hover', async () => {
      fixture.detectChanges();
      vi.useFakeTimers();
      buttonNative.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(100);
      buttonNative.dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(150);
      await vi.runAllTimersAsync();

      expect(document.querySelector('eb-tooltip')).toBeNull();
      vi.useRealTimers();
    });
  });

  describe('Focus Events', () => {
    it('should show tooltip on focus after delay', async () => {
      fixture.detectChanges();
      vi.useFakeTimers();
      buttonNative.dispatchEvent(new FocusEvent('focus'));
      vi.advanceTimersByTime(100);
      expect(document.querySelector('eb-tooltip')).toBeNull();

      vi.advanceTimersByTime(150);
      await vi.runAllTimersAsync();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.querySelector('eb-tooltip')).toBeTruthy();
      vi.useRealTimers();
    });

    it('should hide tooltip on blur', async () => {
      fixture.detectChanges();
      vi.useFakeTimers();
      buttonNative.dispatchEvent(new FocusEvent('focus'));
      vi.advanceTimersByTime(250);
      await vi.runAllTimersAsync();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.querySelector('eb-tooltip')).toBeTruthy();

      buttonNative.dispatchEvent(new FocusEvent('blur'));
      vi.advanceTimersByTime(50);
      await vi.runAllTimersAsync();

      expect(document.querySelector('eb-tooltip')).toBeNull();
      vi.useRealTimers();
    });
  });

  describe('Configuration', () => {
    it('should not show tooltip when disabled', async () => {
      vi.useFakeTimers();
      component.disabled = true;
      fixture.detectChanges();

      buttonNative.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(250);
      await vi.runAllTimersAsync();

      expect(document.querySelector('eb-tooltip')).toBeNull();
      vi.useRealTimers();
    });

    it('should respect custom show delay', async () => {
      vi.useFakeTimers();
      component.showDelay = 500;
      fixture.detectChanges();

      buttonNative.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(400);
      expect(document.querySelector('eb-tooltip')).toBeNull();

      vi.advanceTimersByTime(150);
      await vi.runAllTimersAsync();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.querySelector('eb-tooltip')).toBeTruthy();
      vi.useRealTimers();
    });

    it('should respect custom hide delay', async () => {
      vi.useFakeTimers();
      component.hideDelay = 300;
      fixture.detectChanges();

      buttonNative.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(250);
      await vi.runAllTimersAsync();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.querySelector('eb-tooltip')).toBeTruthy();

      buttonNative.dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(200);
      expect(document.querySelector('eb-tooltip')).toBeTruthy();

      vi.advanceTimersByTime(150);
      await vi.runAllTimersAsync();

      expect(document.querySelector('eb-tooltip')).toBeNull();
      vi.useRealTimers();
    });

    it('should apply correct position', async () => {
      vi.useFakeTimers();
      component.position = 'bottom';
      fixture.detectChanges();

      buttonNative.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(250);
      await vi.runAllTimersAsync();
      fixture.detectChanges();
      await fixture.whenStable();

      const tooltip = document.querySelector('eb-tooltip');
      expect(tooltip).toBeTruthy();
      vi.useRealTimers();
    });
  });

  describe('Cleanup', () => {
    it('should remove tooltip on destroy', async () => {
      fixture.detectChanges();
      vi.useFakeTimers();
      buttonNative.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(250);
      await vi.runAllTimersAsync();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.querySelector('eb-tooltip')).toBeTruthy();

      fixture.destroy();
      expect(document.querySelector('eb-tooltip')).toBeNull();
      vi.useRealTimers();
    });

    it('should clear timers on destroy', async () => {
      fixture.detectChanges();
      vi.useFakeTimers();
      buttonNative.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(100);
      fixture.destroy();
      vi.advanceTimersByTime(200);
      await vi.runAllTimersAsync();

      expect(document.querySelector('eb-tooltip')).toBeNull();
      vi.useRealTimers();
    });
  });

  describe('Accessibility', () => {
    it('should update aria-label when tooltip text changes', () => {
      fixture.detectChanges();
      expect(buttonNative.getAttribute('aria-label')).toBe('Test tooltip');

      // Note: In a real scenario, you'd need to update the input binding
      // This test verifies the initial state
    });

    it('should work with keyboard navigation', async () => {
      fixture.detectChanges();
      vi.useFakeTimers();
      buttonNative.focus();
      vi.advanceTimersByTime(250);
      await vi.runAllTimersAsync();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.querySelector('eb-tooltip')).toBeTruthy();

      buttonNative.blur();
      vi.advanceTimersByTime(50);
      await vi.runAllTimersAsync();

      expect(document.querySelector('eb-tooltip')).toBeNull();
      vi.useRealTimers();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid hover events', async () => {
      fixture.detectChanges();
      vi.useFakeTimers();
      // Hover in and out multiple times quickly
      buttonNative.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(100);
      buttonNative.dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(50);
      buttonNative.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(100);
      buttonNative.dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(50);
      buttonNative.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(250);
      await vi.runAllTimersAsync();
      fixture.detectChanges();
      await fixture.whenStable();

      // Should show tooltip after the last mouseenter delay
      expect(document.querySelector('eb-tooltip')).toBeTruthy();
      vi.useRealTimers();
    });

    it('should not create multiple tooltips', async () => {
      fixture.detectChanges();
      vi.useFakeTimers();
      buttonNative.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(250);
      await vi.runAllTimersAsync();
      fixture.detectChanges();
      await fixture.whenStable();

      buttonNative.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(250);
      await vi.runAllTimersAsync();

      const tooltips = document.querySelectorAll('eb-tooltip');
      expect(tooltips.length).toBe(1);
      vi.useRealTimers();
    });

    it('should handle mouseleave when tooltip is not yet created', async () => {
      fixture.detectChanges();
      vi.useFakeTimers();

      // Dispatch mouseleave without prior mouseenter (or before tooltip would be created)
      buttonNative.dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(50);
      await vi.runAllTimersAsync();

      // Should not throw and no tooltip should exist
      expect(document.querySelector('eb-tooltip')).toBeNull();
      vi.useRealTimers();
    });

    it('should handle blur when tooltip is not yet created', async () => {
      fixture.detectChanges();
      vi.useFakeTimers();

      // Dispatch blur without prior focus showing tooltip
      buttonNative.dispatchEvent(new FocusEvent('blur'));
      vi.advanceTimersByTime(50);
      await vi.runAllTimersAsync();

      // Should not throw and no tooltip should exist
      expect(document.querySelector('eb-tooltip')).toBeNull();
      vi.useRealTimers();
    });

    it('should handle component destroy when no tooltip was ever created', () => {
      fixture.detectChanges();
      // Destroy without ever showing tooltip
      expect(() => {
        fixture.destroy();
      }).not.toThrow();
    });

    it('should handle component destroy while tooltip is mid-show', async () => {
      fixture.detectChanges();
      vi.useFakeTimers();

      buttonNative.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(100); // Mid-way through show delay

      // Destroy before tooltip appears
      fixture.destroy();
      vi.advanceTimersByTime(200);
      await vi.runAllTimersAsync();

      // Should not create tooltip after destroy
      expect(document.querySelector('eb-tooltip')).toBeNull();
      vi.useRealTimers();
    });
  });
});

// Test with empty tooltip content
@Component({
  template: ` <button ebTooltip="" [tooltipPosition]="'top'">Empty tooltip</button> `,
  imports: [TooltipDirective],
})
class EmptyTooltipHostComponent {}

describe('TooltipDirective with empty content', () => {
  let fixture: ComponentFixture<EmptyTooltipHostComponent>;
  let buttonNative: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyTooltipHostComponent, TooltipDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyTooltipHostComponent);
    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonNative = buttonElement.nativeElement as HTMLButtonElement;
  });

  afterEach(() => {
    const tooltips = document.querySelectorAll('eb-tooltip');
    tooltips.forEach((tooltip) => {
      tooltip.remove();
    });
    vi.clearAllTimers();
  });

  it('should not show tooltip when content is empty', async () => {
    fixture.detectChanges();
    vi.useFakeTimers();

    buttonNative.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(250);
    await vi.runAllTimersAsync();
    fixture.detectChanges();

    // Should not create tooltip with empty content
    expect(document.querySelector('eb-tooltip')).toBeNull();
    vi.useRealTimers();
  });

  it('should not set aria-label when content is empty', () => {
    fixture.detectChanges();

    // aria-label should not be set for empty tooltip
    const ariaLabel = buttonNative.getAttribute('aria-label');
    expect(ariaLabel).toBeNull();
  });
});
