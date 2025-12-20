// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { SpinnerSize, SpinnerVariant } from './loading-spinner.component';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    // Set required ariaLabel input for all tests
    fixture.componentRef.setInput('ariaLabel', 'Loading content');
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (LoadingSpinnerComponent as unknown as { ɵcmp: { standalone: boolean } })
        .ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (LoadingSpinnerComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - Size', () => {
    it('should have default size as md', () => {
      fixture.detectChanges();
      expect(component.size()).toBe('md');
    });

    it('should apply custom size', () => {
      const sizes: SpinnerSize[] = ['sm', 'md', 'lg', 'xl'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(component.size()).toBe(size);
      });
    });

    it('should include size class in spinner classes', () => {
      const sizes: SpinnerSize[] = ['sm', 'md', 'lg', 'xl'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(component.spinnerClasses()).toContain(`spinner--${size}`);
      });
    });
  });

  describe('Input Handling - Variant', () => {
    it('should have default variant as primary', () => {
      fixture.detectChanges();
      expect(component.variant()).toBe('primary');
    });

    it('should apply custom variant', () => {
      const variants: SpinnerVariant[] = ['primary', 'secondary', 'light', 'dark'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(component.variant()).toBe(variant);
      });
    });

    it('should include variant class in spinner classes', () => {
      const variants: SpinnerVariant[] = ['primary', 'secondary', 'light', 'dark'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(component.spinnerClasses()).toContain(`spinner--${variant}`);
      });
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
      const spinnerElement = nativeElement.querySelector('[role="status"]');
      expect(spinnerElement?.getAttribute('aria-label')).toBe('Loading user profile');
    });
  });

  describe('Input Handling - Message', () => {
    it('should have undefined message by default', () => {
      fixture.detectChanges();
      expect(component.message()).toBeUndefined();
    });

    it('should accept custom message', () => {
      fixture.componentRef.setInput('message', 'Please wait...');
      fixture.detectChanges();
      expect(component.message()).toBe('Please wait...');
    });

    it('should not render message element when message is undefined', () => {
      fixture.detectChanges();
      const messageElement = nativeElement.querySelector('.spinner-container__message');
      expect(messageElement).toBeNull();
    });

    it('should render message element when message is provided', () => {
      fixture.componentRef.setInput('message', 'Loading your data');
      fixture.detectChanges();
      const messageElement = nativeElement.querySelector('.spinner-container__message');
      expect(messageElement).toBeTruthy();
      expect(messageElement?.textContent).toBe('Loading your data');
    });
  });

  describe('Input Handling - Center', () => {
    it('should have center as false by default', () => {
      fixture.detectChanges();
      expect(component.center()).toBe(false);
    });

    it('should accept center input', () => {
      fixture.componentRef.setInput('center', true);
      fixture.detectChanges();
      expect(component.center()).toBe(true);
    });

    it('should not include center class when center is false', () => {
      fixture.componentRef.setInput('center', false);
      fixture.detectChanges();
      expect(component.containerClasses()).not.toContain('spinner-container--center');
    });

    it('should include center class when center is true', () => {
      fixture.componentRef.setInput('center', true);
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('spinner-container--center');
    });
  });

  describe('Input Handling - Overlay', () => {
    it('should have overlay as false by default', () => {
      fixture.detectChanges();
      expect(component.overlay()).toBe(false);
    });

    it('should accept overlay input', () => {
      fixture.componentRef.setInput('overlay', true);
      fixture.detectChanges();
      expect(component.overlay()).toBe(true);
    });

    it('should not include overlay class when overlay is false', () => {
      fixture.componentRef.setInput('overlay', false);
      fixture.detectChanges();
      expect(component.containerClasses()).not.toContain('spinner-container--overlay');
    });

    it('should include overlay class when overlay is true', () => {
      fixture.componentRef.setInput('overlay', true);
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('spinner-container--overlay');
    });

    it('should not render backdrop when overlay is false', () => {
      fixture.componentRef.setInput('overlay', false);
      fixture.detectChanges();
      const backdrop = nativeElement.querySelector('.spinner-container__backdrop');
      expect(backdrop).toBeNull();
    });

    it('should render backdrop when overlay is true', () => {
      fixture.componentRef.setInput('overlay', true);
      fixture.detectChanges();
      const backdrop = nativeElement.querySelector('.spinner-container__backdrop');
      expect(backdrop).toBeTruthy();
    });
  });

  describe('CSS Classes Computation', () => {
    it('should always include base spinner class', () => {
      fixture.detectChanges();
      expect(component.spinnerClasses()).toContain('spinner');
    });

    it('should always include base container class', () => {
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('spinner-container');
    });

    it('should combine multiple classes correctly', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.componentRef.setInput('center', true);
      fixture.componentRef.setInput('overlay', true);
      fixture.detectChanges();

      const spinnerClasses = component.spinnerClasses();
      expect(spinnerClasses).toContain('spinner');
      expect(spinnerClasses).toContain('spinner--lg');
      expect(spinnerClasses).toContain('spinner--secondary');

      const containerClasses = component.containerClasses();
      expect(containerClasses).toContain('spinner-container');
      expect(containerClasses).toContain('spinner-container--center');
      expect(containerClasses).toContain('spinner-container--overlay');
    });
  });

  describe('Accessibility', () => {
    it('should have role="status" on spinner element', () => {
      fixture.detectChanges();
      const spinnerElement = nativeElement.querySelector('[role="status"]');
      expect(spinnerElement).toBeTruthy();
    });

    it('should have aria-live="polite" on spinner element', () => {
      fixture.detectChanges();
      const spinnerElement = nativeElement.querySelector('[role="status"]');
      expect(spinnerElement?.getAttribute('aria-live')).toBe('polite');
    });

    it('should have aria-label attribute on spinner element', () => {
      fixture.componentRef.setInput('ariaLabel', 'Loading content');
      fixture.detectChanges();
      const spinnerElement = nativeElement.querySelector('[role="status"]');
      expect(spinnerElement?.getAttribute('aria-label')).toBe('Loading content');
    });

    it('should have aria-hidden="true" on backdrop element', () => {
      fixture.componentRef.setInput('overlay', true);
      fixture.detectChanges();
      const backdrop = nativeElement.querySelector('.spinner-container__backdrop');
      expect(backdrop?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('SVG Rendering', () => {
    it('should render SVG element', () => {
      fixture.detectChanges();
      const svg = nativeElement.querySelector('.spinner__svg');
      expect(svg).toBeTruthy();
    });

    it('should render circle element within SVG', () => {
      fixture.detectChanges();
      const circle = nativeElement.querySelector('.spinner__circle');
      expect(circle).toBeTruthy();
    });

    it('should have correct SVG viewBox', () => {
      fixture.detectChanges();
      const svg = nativeElement.querySelector('.spinner__svg');
      expect(svg?.getAttribute('viewBox')).toBe('0 0 50 50');
    });

    it('should have correct circle attributes', () => {
      fixture.detectChanges();
      const circle = nativeElement.querySelector('.spinner__circle');
      expect(circle?.getAttribute('cx')).toBe('25');
      expect(circle?.getAttribute('cy')).toBe('25');
      expect(circle?.getAttribute('r')).toBe('20');
      expect(circle?.getAttribute('fill')).toBe('none');
      expect(circle?.getAttribute('stroke-width')).toBe('4');
    });
  });

  describe('Template Rendering', () => {
    it('should render container element', () => {
      fixture.detectChanges();
      const container = nativeElement.querySelector('.spinner-container');
      expect(container).toBeTruthy();
    });

    it('should render content wrapper', () => {
      fixture.detectChanges();
      const content = nativeElement.querySelector('.spinner-container__content');
      expect(content).toBeTruthy();
    });

    it('should apply container classes to container element', () => {
      fixture.componentRef.setInput('center', true);
      fixture.detectChanges();
      const container = nativeElement.querySelector('.spinner-container');
      expect(container?.className).toContain('spinner-container--center');
    });

    it('should apply spinner classes to spinner element', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();
      const spinner = nativeElement.querySelector('[role="status"]');
      expect(spinner?.className).toContain('spinner--lg');
      expect(spinner?.className).toContain('spinner--secondary');
    });
  });

  describe('Signal Reactivity', () => {
    it('should update computed classes when size changes', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      expect(component.spinnerClasses()).toContain('spinner--sm');

      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(component.spinnerClasses()).toContain('spinner--lg');
      expect(component.spinnerClasses()).not.toContain('spinner--sm');
    });

    it('should update computed classes when variant changes', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      expect(component.spinnerClasses()).toContain('spinner--primary');

      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();
      expect(component.spinnerClasses()).toContain('spinner--secondary');
      expect(component.spinnerClasses()).not.toContain('spinner--primary');
    });

    it('should update computed classes when center changes', () => {
      fixture.componentRef.setInput('center', false);
      fixture.detectChanges();
      expect(component.containerClasses()).not.toContain('spinner-container--center');

      fixture.componentRef.setInput('center', true);
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('spinner-container--center');
    });

    it('should update computed classes when overlay changes', () => {
      fixture.componentRef.setInput('overlay', false);
      fixture.detectChanges();
      expect(component.containerClasses()).not.toContain('spinner-container--overlay');

      fixture.componentRef.setInput('overlay', true);
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('spinner-container--overlay');
    });
  });
});
