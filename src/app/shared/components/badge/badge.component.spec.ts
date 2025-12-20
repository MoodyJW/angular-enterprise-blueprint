// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { BadgePosition, BadgeSize, BadgeVariant } from './badge.component';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    // Set required ariaLabel input for all tests
    fixture.componentRef.setInput('ariaLabel', 'Test badge');
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (BadgeComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (BadgeComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      // ChangeDetectionStrategy.OnPush = 0
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - Variant', () => {
    it('should have default variant as primary', () => {
      fixture.detectChanges();
      expect(component.variant()).toBe('primary');
    });

    it('should apply custom variant', () => {
      const variants: BadgeVariant[] = [
        'primary',
        'secondary',
        'success',
        'warning',
        'error',
        'info',
      ];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(component.variant()).toBe(variant);
      });
    });
  });

  describe('Input Handling - Size', () => {
    it('should have default size as md', () => {
      fixture.detectChanges();
      expect(component.size()).toBe('md');
    });

    it('should apply custom size', () => {
      const sizes: BadgeSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(component.size()).toBe(size);
      });
    });
  });

  describe('Input Handling - Position', () => {
    it('should have default position as top-right', () => {
      fixture.detectChanges();
      expect(component.position()).toBe('top-right');
    });

    it('should apply custom position', () => {
      const positions: BadgePosition[] = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];

      positions.forEach((position) => {
        fixture.componentRef.setInput('position', position);
        fixture.detectChanges();
        expect(component.position()).toBe(position);
      });
    });
  });

  describe('Input Handling - Content', () => {
    it('should handle numeric content', () => {
      fixture.componentRef.setInput('content', 5);
      fixture.detectChanges();
      expect(component.content()).toBe(5);
      expect(component.displayContent()).toBe('5');
    });

    it('should handle string content', () => {
      fixture.componentRef.setInput('content', 'NEW');
      fixture.detectChanges();
      expect(component.content()).toBe('NEW');
      expect(component.displayContent()).toBe('NEW');
    });

    it('should handle undefined content', () => {
      fixture.componentRef.setInput('content', undefined);
      fixture.detectChanges();
      expect(component.content()).toBeUndefined();
      expect(component.displayContent()).toBe('');
    });

    it('should handle zero content', () => {
      fixture.componentRef.setInput('content', 0);
      fixture.detectChanges();
      expect(component.content()).toBe(0);
      expect(component.displayContent()).toBe('0');
    });
  });

  describe('Input Handling - Max', () => {
    it('should have default max as 99', () => {
      fixture.detectChanges();
      expect(component.max()).toBe(99);
    });

    it('should apply max limit to numeric content', () => {
      fixture.componentRef.setInput('content', 150);
      fixture.componentRef.setInput('max', 99);
      fixture.detectChanges();
      expect(component.displayContent()).toBe('99+');
    });

    it('should not apply max to content at or below limit', () => {
      fixture.componentRef.setInput('content', 50);
      fixture.componentRef.setInput('max', 99);
      fixture.detectChanges();
      expect(component.displayContent()).toBe('50');
    });

    it('should not apply max to string content', () => {
      fixture.componentRef.setInput('content', 'NEW');
      fixture.componentRef.setInput('max', 99);
      fixture.detectChanges();
      expect(component.displayContent()).toBe('NEW');
    });
  });

  describe('Input Handling - Dot Mode', () => {
    it('should have default dot as false', () => {
      fixture.detectChanges();
      expect(component.dot()).toBe(false);
    });

    it('should enable dot mode', () => {
      fixture.componentRef.setInput('dot', true);
      fixture.detectChanges();
      expect(component.dot()).toBe(true);
    });

    it('should return empty string for displayContent in dot mode', () => {
      fixture.componentRef.setInput('dot', true);
      fixture.componentRef.setInput('content', 5);
      fixture.detectChanges();
      expect(component.displayContent()).toBe('');
    });
  });

  describe('Input Handling - Hide When Zero', () => {
    it('should have default hideWhenZero as true', () => {
      fixture.detectChanges();
      expect(component.hideWhenZero()).toBe(true);
    });

    it('should hide badge when content is zero and hideWhenZero is true', () => {
      fixture.componentRef.setInput('content', 0);
      fixture.componentRef.setInput('hideWhenZero', true);
      fixture.detectChanges();
      expect(component.isVisible()).toBe(false);
    });

    it('should show badge when content is zero and hideWhenZero is false', () => {
      fixture.componentRef.setInput('content', 0);
      fixture.componentRef.setInput('hideWhenZero', false);
      fixture.detectChanges();
      expect(component.isVisible()).toBe(true);
    });
  });

  describe('Input Handling - ARIA Attributes', () => {
    it('should require ariaLabel', () => {
      // ariaLabel is set in beforeEach
      expect(component.ariaLabel()).toBe('Test badge');
    });

    it('should handle ariaDescribedBy', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'description-id');
      fixture.detectChanges();
      expect(component.ariaDescribedBy()).toBe('description-id');
    });

    it('should have default ariaLive as polite', () => {
      fixture.detectChanges();
      expect(component.ariaLive()).toBe('polite');
    });

    it('should handle custom ariaLive values', () => {
      const ariaLiveValues: Array<'off' | 'polite' | 'assertive'> = ['off', 'polite', 'assertive'];

      ariaLiveValues.forEach((value) => {
        fixture.componentRef.setInput('ariaLive', value);
        fixture.detectChanges();
        expect(component.ariaLive()).toBe(value);
      });
    });
  });

  describe('Computed Properties - Display Content', () => {
    it('should format numeric content correctly', () => {
      fixture.componentRef.setInput('content', 42);
      fixture.detectChanges();
      expect(component.displayContent()).toBe('42');
    });

    it('should format content exceeding max with "+"', () => {
      fixture.componentRef.setInput('content', 100);
      fixture.componentRef.setInput('max', 99);
      fixture.detectChanges();
      expect(component.displayContent()).toBe('99+');
    });

    it('should return empty string for null content', () => {
      fixture.componentRef.setInput('content', null);
      fixture.detectChanges();
      expect(component.displayContent()).toBe('');
    });

    it('should return empty string for empty string content', () => {
      fixture.componentRef.setInput('content', '');
      fixture.detectChanges();
      expect(component.displayContent()).toBe('');
    });

    it('should handle string content with numbers', () => {
      fixture.componentRef.setInput('content', '10');
      fixture.detectChanges();
      expect(component.displayContent()).toBe('10');
    });
  });

  describe('Computed Properties - Visibility', () => {
    it('should be visible with valid numeric content', () => {
      fixture.componentRef.setInput('content', 5);
      fixture.detectChanges();
      expect(component.isVisible()).toBe(true);
    });

    it('should be visible with valid string content', () => {
      fixture.componentRef.setInput('content', 'NEW');
      fixture.detectChanges();
      expect(component.isVisible()).toBe(true);
    });

    it('should be visible in dot mode regardless of content', () => {
      fixture.componentRef.setInput('dot', true);
      fixture.componentRef.setInput('content', undefined);
      fixture.detectChanges();
      expect(component.isVisible()).toBe(true);
    });

    it('should not be visible with undefined content', () => {
      fixture.componentRef.setInput('content', undefined);
      fixture.detectChanges();
      expect(component.isVisible()).toBe(false);
    });

    it('should not be visible with null content', () => {
      fixture.componentRef.setInput('content', null);
      fixture.detectChanges();
      expect(component.isVisible()).toBe(false);
    });

    it('should not be visible with empty string content', () => {
      fixture.componentRef.setInput('content', '');
      fixture.detectChanges();
      expect(component.isVisible()).toBe(false);
    });

    it('should not be visible when content is 0 and hideWhenZero is true', () => {
      fixture.componentRef.setInput('content', 0);
      fixture.componentRef.setInput('hideWhenZero', true);
      fixture.detectChanges();
      expect(component.isVisible()).toBe(false);
    });
  });

  describe('Computed Properties - CSS Classes', () => {
    it('should generate correct base classes', () => {
      fixture.componentRef.setInput('content', 5);
      fixture.detectChanges();
      const classes = component.badgeClasses();
      expect(classes).toContain('badge');
    });

    it('should include variant class', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.componentRef.setInput('content', 5);
      fixture.detectChanges();
      const classes = component.badgeClasses();
      expect(classes).toContain('badge--error');
    });

    it('should include size class', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('content', 5);
      fixture.detectChanges();
      const classes = component.badgeClasses();
      expect(classes).toContain('badge--lg');
    });

    it('should include position class', () => {
      fixture.componentRef.setInput('position', 'bottom-left');
      fixture.componentRef.setInput('content', 5);
      fixture.detectChanges();
      const classes = component.badgeClasses();
      expect(classes).toContain('badge--bottom-left');
    });

    it('should include dot class in dot mode', () => {
      fixture.componentRef.setInput('dot', true);
      fixture.detectChanges();
      const classes = component.badgeClasses();
      expect(classes).toContain('badge--dot');
    });

    it('should not include dot class when not in dot mode', () => {
      fixture.componentRef.setInput('dot', false);
      fixture.componentRef.setInput('content', 5);
      fixture.detectChanges();
      const classes = component.badgeClasses();
      expect(classes).not.toContain('badge--dot');
    });
  });

  describe('DOM Rendering', () => {
    it('should render badge element when visible', () => {
      fixture.componentRef.setInput('content', 5);
      fixture.detectChanges();
      const badgeElement = nativeElement.querySelector('.badge');
      expect(badgeElement).toBeTruthy();
    });

    it('should not render badge element when not visible', () => {
      fixture.componentRef.setInput('content', undefined);
      fixture.detectChanges();
      const badgeElement = nativeElement.querySelector('.badge');
      expect(badgeElement).toBeFalsy();
    });

    it('should display content text', () => {
      fixture.componentRef.setInput('content', 42);
      fixture.detectChanges();
      const badgeElement = nativeElement.querySelector('.badge__content');
      expect(badgeElement?.textContent.trim()).toBe('42');
    });

    it('should not display content in dot mode', () => {
      fixture.componentRef.setInput('dot', true);
      fixture.detectChanges();
      const contentElement = nativeElement.querySelector('.badge__content');
      expect(contentElement).toBeFalsy();
    });

    it('should have correct ARIA attributes', () => {
      fixture.componentRef.setInput('content', 5);
      fixture.componentRef.setInput('ariaLabel', 'Five notifications');
      fixture.componentRef.setInput('ariaLive', 'assertive');
      fixture.detectChanges();
      const badgeElement = nativeElement.querySelector('.badge');
      expect(badgeElement?.getAttribute('aria-label')).toBe('Five notifications');
      expect(badgeElement?.getAttribute('aria-live')).toBe('assertive');
      expect(badgeElement?.getAttribute('role')).toBe('status');
    });

    it('should apply variant classes to DOM', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.componentRef.setInput('content', 10);
      fixture.detectChanges();
      const badgeElement = nativeElement.querySelector('.badge');
      expect(badgeElement?.classList.contains('badge--success')).toBe(true);
    });

    it('should apply size classes to DOM', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.componentRef.setInput('content', 3);
      fixture.detectChanges();
      const badgeElement = nativeElement.querySelector('.badge');
      expect(badgeElement?.classList.contains('badge--sm')).toBe(true);
    });

    it('should apply position classes to DOM', () => {
      fixture.componentRef.setInput('position', 'top-left');
      fixture.componentRef.setInput('content', 7);
      fixture.detectChanges();
      const badgeElement = nativeElement.querySelector('.badge');
      expect(badgeElement?.classList.contains('badge--top-left')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      fixture.componentRef.setInput('content', 9999);
      fixture.componentRef.setInput('max', 999);
      fixture.detectChanges();
      expect(component.displayContent()).toBe('999+');
    });

    it('should handle negative numbers', () => {
      fixture.componentRef.setInput('content', -5);
      fixture.detectChanges();
      expect(component.displayContent()).toBe('-5');
    });

    it('should handle long string content', () => {
      fixture.componentRef.setInput('content', 'VERY_LONG_TEXT');
      fixture.detectChanges();
      expect(component.displayContent()).toBe('VERY_LONG_TEXT');
    });

    it('should handle special characters in string content', () => {
      fixture.componentRef.setInput('content', '!@#');
      fixture.detectChanges();
      expect(component.displayContent()).toBe('!@#');
    });
  });
});
