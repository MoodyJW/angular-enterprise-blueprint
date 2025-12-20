// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { SkeletonAnimation, SkeletonVariant } from './skeleton.component';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let component: SkeletonComponent;
  let fixture: ComponentFixture<SkeletonComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    // Set required ariaLabel input for all tests
    fixture.componentRef.setInput('ariaLabel', 'Loading content');
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (SkeletonComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (SkeletonComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - Variant', () => {
    it('should have default variant as text', () => {
      fixture.detectChanges();
      expect(component.variant()).toBe('text');
    });

    it('should apply custom variant', () => {
      const variants: SkeletonVariant[] = ['text', 'circular', 'rectangular'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(component.variant()).toBe(variant);
      });
    });

    it('should include variant class in skeleton classes', () => {
      const variants: SkeletonVariant[] = ['text', 'circular', 'rectangular'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(component.skeletonClasses()).toContain(`skeleton--${variant}`);
      });
    });
  });

  describe('Input Handling - Animation', () => {
    it('should have default animation as wave', () => {
      fixture.detectChanges();
      expect(component.animation()).toBe('wave');
    });

    it('should apply custom animation', () => {
      const animations: SkeletonAnimation[] = ['pulse', 'wave', 'none'];

      animations.forEach((animation) => {
        fixture.componentRef.setInput('animation', animation);
        fixture.detectChanges();
        expect(component.animation()).toBe(animation);
      });
    });

    it('should include animation class in skeleton classes', () => {
      const animations: SkeletonAnimation[] = ['pulse', 'wave', 'none'];

      animations.forEach((animation) => {
        fixture.componentRef.setInput('animation', animation);
        fixture.detectChanges();
        expect(component.skeletonClasses()).toContain(`skeleton--animation-${animation}`);
      });
    });
  });

  describe('Input Handling - Width', () => {
    it('should have undefined width by default', () => {
      fixture.detectChanges();
      expect(component.width()).toBeUndefined();
    });

    it('should accept custom width', () => {
      fixture.componentRef.setInput('width', '200px');
      fixture.detectChanges();
      expect(component.width()).toBe('200px');
    });

    it('should apply width to skeleton styles', () => {
      fixture.componentRef.setInput('width', '300px');
      fixture.detectChanges();
      expect(component.skeletonStyles()['width']).toBe('300px');
    });

    it('should accept percentage width', () => {
      fixture.componentRef.setInput('width', '50%');
      fixture.detectChanges();
      expect(component.skeletonStyles()['width']).toBe('50%');
    });
  });

  describe('Input Handling - Height', () => {
    it('should have undefined height by default', () => {
      fixture.detectChanges();
      expect(component.height()).toBeUndefined();
    });

    it('should accept custom height', () => {
      fixture.componentRef.setInput('height', '100px');
      fixture.detectChanges();
      expect(component.height()).toBe('100px');
    });

    it('should apply height to skeleton styles', () => {
      fixture.componentRef.setInput('height', '150px');
      fixture.detectChanges();
      expect(component.skeletonStyles()['height']).toBe('150px');
    });

    it('should accept percentage height', () => {
      fixture.componentRef.setInput('height', '75%');
      fixture.detectChanges();
      expect(component.skeletonStyles()['height']).toBe('75%');
    });
  });

  describe('Input Handling - Count', () => {
    it('should have default count as 1', () => {
      fixture.detectChanges();
      expect(component.count()).toBe(1);
    });

    it('should accept custom count', () => {
      fixture.componentRef.setInput('count', 5);
      fixture.detectChanges();
      expect(component.count()).toBe(5);
    });

    it('should generate correct number of items', () => {
      fixture.componentRef.setInput('count', 3);
      fixture.detectChanges();
      expect(component.items().length).toBe(3);
    });

    it('should render correct number of skeleton elements', () => {
      fixture.componentRef.setInput('count', 4);
      fixture.detectChanges();
      const skeletons = nativeElement.querySelectorAll('.skeleton');
      expect(skeletons.length).toBe(4);
    });
  });

  describe('Input Handling - Spacing', () => {
    it('should have default spacing as 8', () => {
      fixture.detectChanges();
      expect(component.spacing()).toBe(8);
    });

    it('should accept custom spacing', () => {
      fixture.componentRef.setInput('spacing', 16);
      fixture.detectChanges();
      expect(component.spacing()).toBe(16);
    });

    it('should apply spacing to container styles when count > 1', () => {
      fixture.componentRef.setInput('count', 2);
      fixture.componentRef.setInput('spacing', 12);
      fixture.detectChanges();
      expect(component.containerStyles()['gap']).toBe('12px');
    });

    it('should not apply spacing to container styles when count is 1', () => {
      fixture.componentRef.setInput('count', 1);
      fixture.componentRef.setInput('spacing', 12);
      fixture.detectChanges();
      expect(component.containerStyles()['gap']).toBeUndefined();
    });
  });

  describe('Input Handling - AriaLabel', () => {
    it('should accept ariaLabel input', () => {
      fixture.componentRef.setInput('ariaLabel', 'Loading data');
      fixture.detectChanges();
      expect(component.ariaLabel()).toBe('Loading data');
    });

    it('should render ariaLabel in template', () => {
      fixture.componentRef.setInput('ariaLabel', 'Loading user profile');
      fixture.detectChanges();
      const container = nativeElement.querySelector('[role="status"]');
      expect(container?.getAttribute('aria-label')).toBe('Loading user profile');
    });
  });

  describe('Input Handling - Rounded', () => {
    it('should have rounded as false by default', () => {
      fixture.detectChanges();
      expect(component.rounded()).toBe(false);
    });

    it('should accept rounded input', () => {
      fixture.componentRef.setInput('rounded', true);
      fixture.detectChanges();
      expect(component.rounded()).toBe(true);
    });

    it('should not include rounded class when rounded is false', () => {
      fixture.componentRef.setInput('variant', 'rectangular');
      fixture.componentRef.setInput('rounded', false);
      fixture.detectChanges();
      expect(component.skeletonClasses()).not.toContain('skeleton--rounded');
    });

    it('should include rounded class when rounded is true and variant is rectangular', () => {
      fixture.componentRef.setInput('variant', 'rectangular');
      fixture.componentRef.setInput('rounded', true);
      fixture.detectChanges();
      expect(component.skeletonClasses()).toContain('skeleton--rounded');
    });

    it('should not include rounded class for non-rectangular variants', () => {
      fixture.componentRef.setInput('variant', 'text');
      fixture.componentRef.setInput('rounded', true);
      fixture.detectChanges();
      expect(component.skeletonClasses()).not.toContain('skeleton--rounded');
    });
  });

  describe('CSS Classes Computation', () => {
    it('should always include base skeleton class', () => {
      fixture.detectChanges();
      expect(component.skeletonClasses()).toContain('skeleton');
    });

    it('should always include base container class', () => {
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('skeleton-container');
    });

    it('should include multiple class when count > 1', () => {
      fixture.componentRef.setInput('count', 3);
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('skeleton-container--multiple');
    });

    it('should not include multiple class when count is 1', () => {
      fixture.componentRef.setInput('count', 1);
      fixture.detectChanges();
      expect(component.containerClasses()).not.toContain('skeleton-container--multiple');
    });

    it('should combine multiple classes correctly', () => {
      fixture.componentRef.setInput('variant', 'rectangular');
      fixture.componentRef.setInput('animation', 'pulse');
      fixture.componentRef.setInput('rounded', true);
      fixture.detectChanges();

      const skeletonClasses = component.skeletonClasses();
      expect(skeletonClasses).toContain('skeleton');
      expect(skeletonClasses).toContain('skeleton--rectangular');
      expect(skeletonClasses).toContain('skeleton--animation-pulse');
      expect(skeletonClasses).toContain('skeleton--rounded');
    });
  });

  describe('Circular Variant Styles', () => {
    it('should set equal width and height for circular variant', () => {
      fixture.componentRef.setInput('variant', 'circular');
      fixture.componentRef.setInput('width', '50px');
      fixture.detectChanges();

      const styles = component.skeletonStyles();
      expect(styles['width']).toBe('50px');
      expect(styles['height']).toBe('50px');
    });

    it('should use height if width not specified for circular variant', () => {
      fixture.componentRef.setInput('variant', 'circular');
      fixture.componentRef.setInput('height', '60px');
      fixture.detectChanges();

      const styles = component.skeletonStyles();
      expect(styles['width']).toBe('60px');
      expect(styles['height']).toBe('60px');
    });

    it('should default to 40px for circular variant if no size specified', () => {
      fixture.componentRef.setInput('variant', 'circular');
      fixture.detectChanges();

      const styles = component.skeletonStyles();
      expect(styles['width']).toBe('40px');
      expect(styles['height']).toBe('40px');
    });
  });

  describe('Text Width Generation', () => {
    it('should return 100% for non-text variants', () => {
      fixture.componentRef.setInput('variant', 'circular');
      fixture.detectChanges();
      expect(component.getTextWidth(0)).toBe('100%');
    });

    it('should return varied widths for text variant', () => {
      fixture.componentRef.setInput('variant', 'text');
      fixture.componentRef.setInput('count', 3);
      fixture.detectChanges();

      const width0 = component.getTextWidth(0);
      const width1 = component.getTextWidth(1);

      // Should be percentages
      expect(width0).toMatch(/%$/);
      expect(width1).toMatch(/%$/);

      // Should be between 80-100%
      const value0 = parseInt(width0);
      expect(value0).toBeGreaterThanOrEqual(80);
      expect(value0).toBeLessThanOrEqual(100);
    });

    it('should return shorter width for last item when count > 1', () => {
      fixture.componentRef.setInput('variant', 'text');
      fixture.componentRef.setInput('count', 3);
      fixture.detectChanges();

      const lastWidth = component.getTextWidth(2);
      const lastValue = parseInt(lastWidth);

      // Last item should be between 60-80%
      expect(lastValue).toBeGreaterThanOrEqual(60);
      expect(lastValue).toBeLessThan(80);
    });

    it('should return consistent widths based on index', () => {
      fixture.componentRef.setInput('variant', 'text');
      fixture.detectChanges();

      const width1 = component.getTextWidth(0);
      const width2 = component.getTextWidth(0);

      expect(width1).toBe(width2);
    });
  });

  describe('Accessibility', () => {
    it('should have role="status" on container element', () => {
      fixture.detectChanges();
      const container = nativeElement.querySelector('[role="status"]');
      expect(container).toBeTruthy();
    });

    it('should have aria-live="polite" on container element', () => {
      fixture.detectChanges();
      const container = nativeElement.querySelector('[role="status"]');
      expect(container?.getAttribute('aria-live')).toBe('polite');
    });

    it('should have aria-busy="true" on container element', () => {
      fixture.detectChanges();
      const container = nativeElement.querySelector('[role="status"]');
      expect(container?.getAttribute('aria-busy')).toBe('true');
    });

    it('should have aria-label attribute on container element', () => {
      fixture.componentRef.setInput('ariaLabel', 'Loading content');
      fixture.detectChanges();
      const container = nativeElement.querySelector('[role="status"]');
      expect(container?.getAttribute('aria-label')).toBe('Loading content');
    });

    it('should have aria-hidden="true" on wave element', () => {
      fixture.componentRef.setInput('animation', 'wave');
      fixture.detectChanges();
      const wave = nativeElement.querySelector('.skeleton__wave');
      expect(wave?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Wave Animation Rendering', () => {
    it('should render wave element when animation is wave', () => {
      fixture.componentRef.setInput('animation', 'wave');
      fixture.detectChanges();
      const wave = nativeElement.querySelector('.skeleton__wave');
      expect(wave).toBeTruthy();
    });

    it('should not render wave element when animation is pulse', () => {
      fixture.componentRef.setInput('animation', 'pulse');
      fixture.detectChanges();
      const wave = nativeElement.querySelector('.skeleton__wave');
      expect(wave).toBeNull();
    });

    it('should not render wave element when animation is none', () => {
      fixture.componentRef.setInput('animation', 'none');
      fixture.detectChanges();
      const wave = nativeElement.querySelector('.skeleton__wave');
      expect(wave).toBeNull();
    });
  });

  describe('Template Rendering', () => {
    it('should render container element', () => {
      fixture.detectChanges();
      const container = nativeElement.querySelector('.skeleton-container');
      expect(container).toBeTruthy();
    });

    it('should render skeleton elements', () => {
      fixture.detectChanges();
      const skeleton = nativeElement.querySelector('.skeleton');
      expect(skeleton).toBeTruthy();
    });

    it('should apply container classes to container element', () => {
      fixture.componentRef.setInput('count', 2);
      fixture.detectChanges();
      const container = nativeElement.querySelector('.skeleton-container');
      expect(container?.className).toContain('skeleton-container--multiple');
    });

    it('should apply skeleton classes to skeleton elements', () => {
      fixture.componentRef.setInput('variant', 'circular');
      fixture.componentRef.setInput('animation', 'pulse');
      fixture.detectChanges();
      const skeleton = nativeElement.querySelector('.skeleton');
      expect(skeleton?.className).toContain('skeleton--circular');
      expect(skeleton?.className).toContain('skeleton--animation-pulse');
    });

    it('should apply inline styles to container', () => {
      fixture.componentRef.setInput('count', 2);
      fixture.componentRef.setInput('spacing', 16);
      fixture.detectChanges();
      const container = nativeElement.querySelector('.skeleton-container') as HTMLElement;
      expect(container.style.gap).toBe('16px');
    });

    it('should apply inline styles to skeleton elements', () => {
      fixture.componentRef.setInput('variant', 'rectangular');
      fixture.componentRef.setInput('width', '200px');
      fixture.componentRef.setInput('height', '100px');
      fixture.detectChanges();
      const skeleton = nativeElement.querySelector('.skeleton') as HTMLElement;
      expect(skeleton.style.width).toBe('200px');
      expect(skeleton.style.height).toBe('100px');
    });
  });

  describe('Signal Reactivity', () => {
    it('should update computed classes when variant changes', () => {
      fixture.componentRef.setInput('variant', 'text');
      fixture.detectChanges();
      expect(component.skeletonClasses()).toContain('skeleton--text');

      fixture.componentRef.setInput('variant', 'circular');
      fixture.detectChanges();
      expect(component.skeletonClasses()).toContain('skeleton--circular');
      expect(component.skeletonClasses()).not.toContain('skeleton--text');
    });

    it('should update computed classes when animation changes', () => {
      fixture.componentRef.setInput('animation', 'wave');
      fixture.detectChanges();
      expect(component.skeletonClasses()).toContain('skeleton--animation-wave');

      fixture.componentRef.setInput('animation', 'pulse');
      fixture.detectChanges();
      expect(component.skeletonClasses()).toContain('skeleton--animation-pulse');
      expect(component.skeletonClasses()).not.toContain('skeleton--animation-wave');
    });

    it('should update items array when count changes', () => {
      fixture.componentRef.setInput('count', 2);
      fixture.detectChanges();
      expect(component.items().length).toBe(2);

      fixture.componentRef.setInput('count', 5);
      fixture.detectChanges();
      expect(component.items().length).toBe(5);
    });

    it('should update styles when width changes', () => {
      fixture.componentRef.setInput('width', '100px');
      fixture.detectChanges();
      expect(component.skeletonStyles()['width']).toBe('100px');

      fixture.componentRef.setInput('width', '200px');
      fixture.detectChanges();
      expect(component.skeletonStyles()['width']).toBe('200px');
    });

    it('should update styles when height changes', () => {
      fixture.componentRef.setInput('height', '50px');
      fixture.detectChanges();
      expect(component.skeletonStyles()['height']).toBe('50px');

      fixture.componentRef.setInput('height', '100px');
      fixture.detectChanges();
      expect(component.skeletonStyles()['height']).toBe('100px');
    });
  });
});
