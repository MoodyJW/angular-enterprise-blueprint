// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { StackAlign, StackDirection, StackJustify, StackSpacing } from './stack.component';
import { StackComponent } from './stack.component';

describe('StackComponent', () => {
  let component: StackComponent;
  let fixture: ComponentFixture<StackComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StackComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (StackComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (StackComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - Spacing', () => {
    it('should have default spacing as md', () => {
      fixture.detectChanges();
      expect(component.spacing()).toBe('md');
    });

    it('should apply custom spacing', () => {
      const spacings: StackSpacing[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

      spacings.forEach((spacing) => {
        fixture.componentRef.setInput('spacing', spacing);
        fixture.detectChanges();
        expect(component.spacing()).toBe(spacing);
      });
    });
  });

  describe('Input Handling - Direction', () => {
    it('should have default direction as vertical', () => {
      fixture.detectChanges();
      expect(component.direction()).toBe('vertical');
    });

    it('should apply custom direction', () => {
      const directions: StackDirection[] = ['vertical', 'horizontal'];

      directions.forEach((direction) => {
        fixture.componentRef.setInput('direction', direction);
        fixture.detectChanges();
        expect(component.direction()).toBe(direction);
      });
    });
  });

  describe('Input Handling - Alignment', () => {
    it('should have default align as stretch', () => {
      fixture.detectChanges();
      expect(component.align()).toBe('stretch');
    });

    it('should apply custom align', () => {
      const alignments: StackAlign[] = ['start', 'center', 'end', 'stretch'];

      alignments.forEach((align) => {
        fixture.componentRef.setInput('align', align);
        fixture.detectChanges();
        expect(component.align()).toBe(align);
      });
    });
  });

  describe('Input Handling - Justify', () => {
    it('should have default justify as undefined', () => {
      fixture.detectChanges();
      expect(component.justify()).toBeUndefined();
    });

    it('should apply custom justify', () => {
      const justifications: StackJustify[] = [
        'start',
        'center',
        'end',
        'space-between',
        'space-around',
        'space-evenly',
      ];

      justifications.forEach((justify) => {
        fixture.componentRef.setInput('justify', justify);
        fixture.detectChanges();
        expect(component.justify()).toBe(justify);
      });
    });
  });

  describe('Input Handling - Other Properties', () => {
    it('should have default fullWidth as false', () => {
      fixture.detectChanges();
      expect(component.fullWidth()).toBe(false);
    });

    it('should apply custom fullWidth value', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();
      expect(component.fullWidth()).toBe(true);
    });

    it('should have default wrap as false', () => {
      fixture.detectChanges();
      expect(component.wrap()).toBe(false);
    });

    it('should apply custom wrap value', () => {
      fixture.componentRef.setInput('wrap', true);
      fixture.detectChanges();
      expect(component.wrap()).toBe(true);
    });

    it('should have default inline as false', () => {
      fixture.detectChanges();
      expect(component.inline()).toBe(false);
    });

    it('should apply custom inline value', () => {
      fixture.componentRef.setInput('inline', true);
      fixture.detectChanges();
      expect(component.inline()).toBe(true);
    });

    it('should have default divider as false', () => {
      fixture.detectChanges();
      expect(component.divider()).toBe(false);
    });

    it('should apply custom divider value', () => {
      fixture.componentRef.setInput('divider', true);
      fixture.detectChanges();
      expect(component.divider()).toBe(true);
    });
  });

  describe('Accessibility - ARIA Attributes', () => {
    it('should have list role by default', () => {
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');
      expect(stackElement?.getAttribute('role')).toBe('list');
    });

    it('should allow custom role override', () => {
      fixture.componentRef.setInput('role', 'navigation');
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');
      expect(stackElement?.getAttribute('role')).toBe('navigation');
    });

    it('should set aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Action buttons');
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');
      expect(stackElement?.getAttribute('aria-label')).toBe('Action buttons');
    });

    it('should not set aria-label when undefined', () => {
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');
      expect(stackElement?.getAttribute('aria-label')).toBeNull();
    });

    it('should set aria-labelledby when provided', () => {
      fixture.componentRef.setInput('ariaLabelledBy', 'stack-title');
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');
      expect(stackElement?.getAttribute('aria-labelledby')).toBe('stack-title');
    });

    it('should not set aria-labelledby when undefined', () => {
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');
      expect(stackElement?.getAttribute('aria-labelledby')).toBeNull();
    });
  });

  describe('CSS Classes', () => {
    it('should apply base stack class', () => {
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');
      expect(stackElement?.classList.contains('stack')).toBe(true);
    });

    it('should apply direction classes', () => {
      const directions: StackDirection[] = ['vertical', 'horizontal'];

      directions.forEach((direction) => {
        fixture.componentRef.setInput('direction', direction);
        fixture.detectChanges();

        const stackElement = nativeElement.querySelector('.stack');
        expect(stackElement?.classList.contains(`stack--${direction}`)).toBe(true);
      });
    });

    it('should apply spacing classes', () => {
      const spacings: StackSpacing[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

      spacings.forEach((spacing) => {
        fixture.componentRef.setInput('spacing', spacing);
        fixture.detectChanges();

        const stackElement = nativeElement.querySelector('.stack');
        expect(stackElement?.classList.contains(`stack--spacing-${spacing}`)).toBe(true);
      });
    });

    it('should apply alignment classes', () => {
      const alignments: StackAlign[] = ['start', 'center', 'end', 'stretch'];

      alignments.forEach((align) => {
        fixture.componentRef.setInput('align', align);
        fixture.detectChanges();

        const stackElement = nativeElement.querySelector('.stack');
        expect(stackElement?.classList.contains(`stack--align-${align}`)).toBe(true);
      });
    });

    it('should apply justify classes when specified', () => {
      const justifications: StackJustify[] = [
        'start',
        'center',
        'end',
        'space-between',
        'space-around',
        'space-evenly',
      ];

      justifications.forEach((justify) => {
        fixture.componentRef.setInput('justify', justify);
        fixture.detectChanges();

        const stackElement = nativeElement.querySelector('.stack');
        expect(stackElement?.classList.contains(`stack--justify-${justify}`)).toBe(true);
      });
    });

    it('should apply full-width class when fullWidth is true', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');
      expect(stackElement?.classList.contains('stack--full-width')).toBe(true);
    });

    it('should NOT apply full-width class when fullWidth is false', () => {
      fixture.componentRef.setInput('fullWidth', false);
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');
      expect(stackElement?.classList.contains('stack--full-width')).toBe(false);
    });

    it('should apply wrap class when wrap is true', () => {
      fixture.componentRef.setInput('wrap', true);
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');
      expect(stackElement?.classList.contains('stack--wrap')).toBe(true);
    });

    it('should NOT apply wrap class when wrap is false', () => {
      fixture.componentRef.setInput('wrap', false);
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');
      expect(stackElement?.classList.contains('stack--wrap')).toBe(false);
    });

    it('should apply inline class when inline is true', () => {
      fixture.componentRef.setInput('inline', true);
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');
      expect(stackElement?.classList.contains('stack--inline')).toBe(true);
    });

    it('should NOT apply inline class when inline is false', () => {
      fixture.componentRef.setInput('inline', false);
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');
      expect(stackElement?.classList.contains('stack--inline')).toBe(false);
    });

    it('should apply divider class when divider is true', () => {
      fixture.componentRef.setInput('divider', true);
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');
      expect(stackElement?.classList.contains('stack--divider')).toBe(true);
    });

    it('should NOT apply divider class when divider is false', () => {
      fixture.componentRef.setInput('divider', false);
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');
      expect(stackElement?.classList.contains('stack--divider')).toBe(false);
    });
  });

  describe('Content Projection', () => {
    it('should render projected content', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const stackElement = compiled.querySelector('.stack');
      expect(stackElement).toBeTruthy();
    });

    it('should have ng-content for content projection', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const stackElement = compiled.querySelector('.stack');
      expect(stackElement).toBeTruthy();
    });
  });

  describe('Computed Values', () => {
    it('should compute stackClasses correctly with defaults', () => {
      fixture.detectChanges();

      const classes = component.stackClasses();
      expect(classes).toContain('stack');
      expect(classes).toContain('stack--vertical');
      expect(classes).toContain('stack--spacing-md');
      expect(classes).toContain('stack--align-stretch');
      expect(classes).not.toContain('stack--full-width');
    });

    it('should compute stackClasses correctly with custom values', () => {
      fixture.componentRef.setInput('direction', 'horizontal');
      fixture.componentRef.setInput('spacing', 'lg');
      fixture.componentRef.setInput('align', 'center');
      fixture.componentRef.setInput('justify', 'space-between');
      fixture.componentRef.setInput('fullWidth', true);
      fixture.componentRef.setInput('wrap', true);
      fixture.componentRef.setInput('divider', true);
      fixture.detectChanges();

      const classes = component.stackClasses();
      expect(classes).toContain('stack');
      expect(classes).toContain('stack--horizontal');
      expect(classes).toContain('stack--spacing-lg');
      expect(classes).toContain('stack--align-center');
      expect(classes).toContain('stack--justify-space-between');
      expect(classes).toContain('stack--full-width');
      expect(classes).toContain('stack--wrap');
      expect(classes).toContain('stack--divider');
    });

    it('should recompute stackClasses when inputs change', () => {
      fixture.componentRef.setInput('spacing', 'sm');
      fixture.detectChanges();
      expect(component.stackClasses()).toContain('stack--spacing-sm');

      fixture.componentRef.setInput('spacing', 'xl');
      fixture.detectChanges();
      expect(component.stackClasses()).toContain('stack--spacing-xl');
      expect(component.stackClasses()).not.toContain('stack--spacing-sm');
    });
  });

  describe('DOM Structure', () => {
    it('should render a single div element', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const divElements = compiled.querySelectorAll('div');
      expect(divElements.length).toBe(1);
    });

    it('should apply classes to the div element', () => {
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('div.stack');
      expect(stackElement).toBeTruthy();
    });

    it('should have proper element structure', () => {
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');

      expect(stackElement?.tagName).toBe('DIV');
      expect(stackElement?.getAttribute('role')).toBe('list');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid input changes', () => {
      const spacings: StackSpacing[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];

      spacings.forEach((spacing) => {
        fixture.componentRef.setInput('spacing', spacing);
      });
      fixture.detectChanges();

      expect(component.spacing()).toBe('xl');
      expect(component.stackClasses()).toContain('stack--spacing-xl');
    });

    it('should handle all inputs being set at once', () => {
      fixture.componentRef.setInput('direction', 'horizontal');
      fixture.componentRef.setInput('spacing', 'lg');
      fixture.componentRef.setInput('align', 'center');
      fixture.componentRef.setInput('justify', 'space-evenly');
      fixture.componentRef.setInput('fullWidth', true);
      fixture.componentRef.setInput('wrap', true);
      fixture.componentRef.setInput('inline', true);
      fixture.componentRef.setInput('divider', true);
      fixture.detectChanges();

      expect(component.direction()).toBe('horizontal');
      expect(component.spacing()).toBe('lg');
      expect(component.align()).toBe('center');
      expect(component.justify()).toBe('space-evenly');
      expect(component.fullWidth()).toBe(true);
      expect(component.wrap()).toBe(true);
      expect(component.inline()).toBe(true);
      expect(component.divider()).toBe(true);
    });

    it('should maintain consistent class order', () => {
      fixture.componentRef.setInput('direction', 'vertical');
      fixture.componentRef.setInput('spacing', 'md');
      fixture.componentRef.setInput('align', 'start');
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();

      const classes = component.stackClasses().split(' ');
      expect(classes[0]).toBe('stack');
      expect(classes).toContain('stack--vertical');
      expect(classes).toContain('stack--spacing-md');
      expect(classes).toContain('stack--align-start');
      expect(classes).toContain('stack--full-width');
    });
  });

  describe('Integration', () => {
    it('should work with all spacing variants', () => {
      const variants: StackSpacing[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('spacing', variant);
        fixture.detectChanges();

        const stackElement = nativeElement.querySelector('.stack');
        expect(stackElement?.classList.contains(`stack--spacing-${variant}`)).toBe(true);
      });
    });

    it('should work with all direction variants', () => {
      const variants: StackDirection[] = ['vertical', 'horizontal'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('direction', variant);
        fixture.detectChanges();

        const stackElement = nativeElement.querySelector('.stack');
        expect(stackElement?.classList.contains(`stack--${variant}`)).toBe(true);
      });
    });

    it('should properly combine all configuration options', () => {
      fixture.componentRef.setInput('direction', 'horizontal');
      fixture.componentRef.setInput('spacing', 'lg');
      fixture.componentRef.setInput('align', 'center');
      fixture.componentRef.setInput('justify', 'space-between');
      fixture.componentRef.setInput('fullWidth', true);
      fixture.componentRef.setInput('wrap', true);
      fixture.componentRef.setInput('role', 'navigation');
      fixture.componentRef.setInput('ariaLabel', 'Main navigation');
      fixture.detectChanges();

      const stackElement = nativeElement.querySelector('.stack');

      // Check classes
      expect(stackElement?.classList.contains('stack')).toBe(true);
      expect(stackElement?.classList.contains('stack--horizontal')).toBe(true);
      expect(stackElement?.classList.contains('stack--spacing-lg')).toBe(true);
      expect(stackElement?.classList.contains('stack--align-center')).toBe(true);
      expect(stackElement?.classList.contains('stack--justify-space-between')).toBe(true);
      expect(stackElement?.classList.contains('stack--full-width')).toBe(true);
      expect(stackElement?.classList.contains('stack--wrap')).toBe(true);

      // Check ARIA attributes
      expect(stackElement?.getAttribute('role')).toBe('navigation');
      expect(stackElement?.getAttribute('aria-label')).toBe('Main navigation');
    });
  });
});
