import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { DividerComponent } from './divider.component';

describe('DividerComponent', () => {
  let component: DividerComponent;
  let fixture: ComponentFixture<DividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DividerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default orientation as horizontal', () => {
      expect(component.orientation()).toBe('horizontal');
    });

    it('should have default variant as solid', () => {
      expect(component.variant()).toBe('solid');
    });

    it('should have default spacing as md', () => {
      expect(component.spacing()).toBe('md');
    });

    it('should have default thickness as thin', () => {
      expect(component.thickness()).toBe('thin');
    });

    it('should have default inset as false', () => {
      expect(component.inset()).toBe(false);
    });

    it('should have default ariaRole as separator', () => {
      expect(component.ariaRole()).toBe('separator');
    });

    it('should have no label by default', () => {
      expect(component.label()).toBeUndefined();
    });
  });

  describe('Input Handling', () => {
    it('should accept orientation input', () => {
      fixture.componentRef.setInput('orientation', 'vertical');
      fixture.detectChanges();
      expect(component.orientation()).toBe('vertical');
    });

    it('should accept variant input', () => {
      fixture.componentRef.setInput('variant', 'dashed');
      fixture.detectChanges();
      expect(component.variant()).toBe('dashed');
    });

    it('should accept spacing input', () => {
      fixture.componentRef.setInput('spacing', 'lg');
      fixture.detectChanges();
      expect(component.spacing()).toBe('lg');
    });

    it('should accept thickness input', () => {
      fixture.componentRef.setInput('thickness', 'thick');
      fixture.detectChanges();
      expect(component.thickness()).toBe('thick');
    });

    it('should accept label input', () => {
      fixture.componentRef.setInput('label', 'Section Divider');
      fixture.detectChanges();
      expect(component.label()).toBe('Section Divider');
    });

    it('should accept inset input', () => {
      fixture.componentRef.setInput('inset', true);
      fixture.detectChanges();
      expect(component.inset()).toBe(true);
    });

    it('should accept ariaRole input', () => {
      fixture.componentRef.setInput('ariaRole', 'presentation');
      fixture.detectChanges();
      expect(component.ariaRole()).toBe('presentation');
    });

    it('should accept ariaLabel input', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom separator');
      fixture.detectChanges();
      expect(component.ariaLabel()).toBe('Custom separator');
    });
  });

  describe('Container Classes', () => {
    it('should include base divider class', () => {
      expect(component.containerClasses()).toContain('divider');
    });

    it('should include orientation class', () => {
      expect(component.containerClasses()).toContain('divider--horizontal');
    });

    it('should update orientation class when changed', () => {
      fixture.componentRef.setInput('orientation', 'vertical');
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('divider--vertical');
      expect(component.containerClasses()).not.toContain('divider--horizontal');
    });

    it('should include variant class', () => {
      expect(component.containerClasses()).toContain('divider--solid');
    });

    it('should update variant class when changed', () => {
      fixture.componentRef.setInput('variant', 'dashed');
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('divider--dashed');
    });

    it('should include spacing class', () => {
      expect(component.containerClasses()).toContain('divider--spacing-md');
    });

    it('should update spacing class when changed', () => {
      fixture.componentRef.setInput('spacing', 'xl');
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('divider--spacing-xl');
    });

    it('should include thickness class', () => {
      expect(component.containerClasses()).toContain('divider--thin');
    });

    it('should update thickness class when changed', () => {
      fixture.componentRef.setInput('thickness', 'medium');
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('divider--medium');
    });

    it('should include inset class when enabled', () => {
      fixture.componentRef.setInput('inset', true);
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('divider--inset');
    });

    it('should not include inset class when disabled', () => {
      expect(component.containerClasses()).not.toContain('divider--inset');
    });

    it('should include with-label class when label is provided', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('divider--with-label');
    });

    it('should not include with-label class when no label', () => {
      expect(component.containerClasses()).not.toContain('divider--with-label');
    });
  });

  describe('Computed ARIA Label', () => {
    it('should use custom ariaLabel if provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom separator');
      fixture.detectChanges();
      expect(component.computedAriaLabel()).toBe('Custom separator');
    });

    it('should default to "Horizontal divider" for horizontal orientation', () => {
      expect(component.computedAriaLabel()).toBe('Horizontal divider');
    });

    it('should default to "Vertical divider" for vertical orientation', () => {
      fixture.componentRef.setInput('orientation', 'vertical');
      fixture.detectChanges();
      expect(component.computedAriaLabel()).toBe('Vertical divider');
    });

    it('should prioritize custom ariaLabel over default', () => {
      fixture.componentRef.setInput('orientation', 'vertical');
      fixture.componentRef.setInput('ariaLabel', 'My custom label');
      fixture.detectChanges();
      expect(component.computedAriaLabel()).toBe('My custom label');
    });
  });

  describe('Has Label Computed', () => {
    it('should return false when no label', () => {
      expect(component.hasLabel()).toBe(false);
    });

    it('should return true when label is provided', () => {
      fixture.componentRef.setInput('label', 'Test');
      fixture.detectChanges();
      expect(component.hasLabel()).toBe(true);
    });

    it('should return false when label is empty string', () => {
      fixture.componentRef.setInput('label', '');
      fixture.detectChanges();
      expect(component.hasLabel()).toBe(false);
    });
  });

  describe('Template Rendering', () => {
    it('should render hr element when no label', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const hr = compiled.querySelector('hr');
      expect(hr).toBeTruthy();
    });

    it('should render div with label when label is provided', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const div = compiled.querySelector('div.divider');
      const label = compiled.querySelector('.divider__label');
      expect(div).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent.trim()).toBe('Test Label');
    });

    it('should render two lines when label is provided', () => {
      fixture.componentRef.setInput('label', 'Or');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const lines = compiled.querySelectorAll('.divider__line');
      expect(lines.length).toBe(2);
    });

    it('should apply container classes to hr element', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const hr = compiled.querySelector('hr');
      expect(hr?.className).toContain('divider');
      expect(hr?.className).toContain('divider--horizontal');
      expect(hr?.className).toContain('divider--solid');
    });

    it('should apply container classes to div when label present', () => {
      fixture.componentRef.setInput('label', 'Test');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const div = compiled.querySelector('div.divider');
      expect(div?.className).toContain('divider');
      expect(div?.className).toContain('divider--with-label');
    });

    it('should set role attribute', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const hr = compiled.querySelector('hr');
      expect(hr?.getAttribute('role')).toBe('separator');
    });

    it('should set custom role attribute', () => {
      fixture.componentRef.setInput('ariaRole', 'presentation');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const hr = compiled.querySelector('hr');
      expect(hr?.getAttribute('role')).toBe('presentation');
    });

    it('should set aria-label attribute', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const hr = compiled.querySelector('hr');
      expect(hr?.getAttribute('aria-label')).toBe('Horizontal divider');
    });

    it('should set custom aria-label attribute', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom separator');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const hr = compiled.querySelector('hr');
      expect(hr?.getAttribute('aria-label')).toBe('Custom separator');
    });
  });

  describe('Orientation Variants', () => {
    it('should render horizontal divider by default', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const hr = compiled.querySelector('hr');
      expect(hr?.className).toContain('divider--horizontal');
    });

    it('should render vertical divider when orientation is vertical', () => {
      fixture.componentRef.setInput('orientation', 'vertical');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const hr = compiled.querySelector('hr');
      expect(hr?.className).toContain('divider--vertical');
    });
  });

  describe('Visual Variants', () => {
    it('should render solid divider by default', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const hr = compiled.querySelector('hr');
      expect(hr?.className).toContain('divider--solid');
    });

    it('should render dashed divider', () => {
      fixture.componentRef.setInput('variant', 'dashed');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const hr = compiled.querySelector('hr');
      expect(hr?.className).toContain('divider--dashed');
    });

    it('should render dotted divider', () => {
      fixture.componentRef.setInput('variant', 'dotted');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const hr = compiled.querySelector('hr');
      expect(hr?.className).toContain('divider--dotted');
    });
  });

  describe('Spacing Variants', () => {
    it('should apply spacing-none class', () => {
      fixture.componentRef.setInput('spacing', 'none');
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('divider--spacing-none');
    });

    it('should apply spacing-xs class', () => {
      fixture.componentRef.setInput('spacing', 'xs');
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('divider--spacing-xs');
    });

    it('should apply spacing-sm class', () => {
      fixture.componentRef.setInput('spacing', 'sm');
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('divider--spacing-sm');
    });

    it('should apply spacing-md class', () => {
      expect(component.containerClasses()).toContain('divider--spacing-md');
    });

    it('should apply spacing-lg class', () => {
      fixture.componentRef.setInput('spacing', 'lg');
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('divider--spacing-lg');
    });

    it('should apply spacing-xl class', () => {
      fixture.componentRef.setInput('spacing', 'xl');
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('divider--spacing-xl');
    });

    it('should apply spacing-2xl class', () => {
      fixture.componentRef.setInput('spacing', '2xl');
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('divider--spacing-2xl');
    });
  });

  describe('Thickness Variants', () => {
    it('should apply thin class by default', () => {
      expect(component.containerClasses()).toContain('divider--thin');
    });

    it('should apply medium class', () => {
      fixture.componentRef.setInput('thickness', 'medium');
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('divider--medium');
    });

    it('should apply thick class', () => {
      fixture.componentRef.setInput('thickness', 'thick');
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('divider--thick');
    });
  });

  describe('Label Functionality', () => {
    it('should only render label for horizontal orientation', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('orientation', 'horizontal');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const label = compiled.querySelector('.divider__label');
      expect(label).toBeTruthy();
    });

    it('should not render label div for vertical orientation even if label provided', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('orientation', 'vertical');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const label = compiled.querySelector('.divider__label');
      expect(label).toBeFalsy();
    });

    it('should display correct label text', () => {
      fixture.componentRef.setInput('label', 'Or continue with');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const label = compiled.querySelector('.divider__label');
      expect(label?.textContent.trim()).toBe('Or continue with');
    });
  });

  describe('Inset Modifier', () => {
    it('should apply inset class when inset is true', () => {
      fixture.componentRef.setInput('inset', true);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const hr = compiled.querySelector('hr');
      expect(hr?.className).toContain('divider--inset');
    });

    it('should not apply inset class when inset is false', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const hr = compiled.querySelector('hr');
      expect(hr?.className).not.toContain('divider--inset');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty label string', () => {
      fixture.componentRef.setInput('label', '');
      fixture.detectChanges();
      expect(component.hasLabel()).toBe(false);
      const compiled = fixture.nativeElement as HTMLElement;
      const hr = compiled.querySelector('hr');
      expect(hr).toBeTruthy();
    });

    it('should handle whitespace-only label', () => {
      fixture.componentRef.setInput('label', '   ');
      fixture.detectChanges();
      expect(component.hasLabel()).toBe(true);
      const compiled = fixture.nativeElement as HTMLElement;
      const label = compiled.querySelector('.divider__label');
      expect(label).toBeTruthy();
    });

    it('should handle multiple class combinations', () => {
      fixture.componentRef.setInput('orientation', 'vertical');
      fixture.componentRef.setInput('variant', 'dashed');
      fixture.componentRef.setInput('spacing', 'xl');
      fixture.componentRef.setInput('thickness', 'thick');
      fixture.componentRef.setInput('inset', true);
      fixture.detectChanges();

      const classes = component.containerClasses();
      expect(classes).toContain('divider--vertical');
      expect(classes).toContain('divider--dashed');
      expect(classes).toContain('divider--spacing-xl');
      expect(classes).toContain('divider--thick');
      expect(classes).toContain('divider--inset');
    });
  });
});
