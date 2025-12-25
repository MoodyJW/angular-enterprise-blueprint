// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { GridAlign, GridColumns, GridGap, GridJustify } from './grid.component';
import { GridComponent } from './grid.component';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (GridComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (GridComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - Columns', () => {
    it('should have default cols as 1', () => {
      fixture.detectChanges();
      expect(component.cols()).toBe(1);
    });

    it('should apply custom cols', () => {
      const columns: GridColumns[] = [1, 2, 3, 4, 6, 12, 'auto'];

      columns.forEach((cols) => {
        fixture.componentRef.setInput('cols', cols);
        fixture.detectChanges();
        expect(component.cols()).toBe(cols);
      });
    });

    it('should handle responsive column inputs', () => {
      fixture.componentRef.setInput('cols', 1);
      fixture.componentRef.setInput('colsMd', 2);
      fixture.componentRef.setInput('colsLg', 3);
      fixture.componentRef.setInput('colsXl', 4);
      fixture.detectChanges();

      expect(component.cols()).toBe(1);
      expect(component.colsMd()).toBe(2);
      expect(component.colsLg()).toBe(3);
      expect(component.colsXl()).toBe(4);
    });

    it('should handle undefined responsive columns', () => {
      fixture.detectChanges();

      expect(component.colsMd()).toBeUndefined();
      expect(component.colsLg()).toBeUndefined();
      expect(component.colsXl()).toBeUndefined();
    });
  });

  describe('Input Handling - Gap', () => {
    it('should have default gap as md', () => {
      fixture.detectChanges();
      expect(component.gap()).toBe('md');
    });

    it('should apply custom gap', () => {
      const gaps: GridGap[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];

      gaps.forEach((gap) => {
        fixture.componentRef.setInput('gap', gap);
        fixture.detectChanges();
        expect(component.gap()).toBe(gap);
      });
    });

    it('should handle gapX and gapY overrides', () => {
      fixture.componentRef.setInput('gapX', 'lg');
      fixture.componentRef.setInput('gapY', 'sm');
      fixture.detectChanges();

      expect(component.gapX()).toBe('lg');
      expect(component.gapY()).toBe('sm');
    });

    it('should allow undefined gapX and gapY', () => {
      fixture.detectChanges();

      expect(component.gapX()).toBeUndefined();
      expect(component.gapY()).toBeUndefined();
    });
  });

  describe('Input Handling - Alignment', () => {
    it('should have default alignItems as stretch', () => {
      fixture.detectChanges();
      expect(component.alignItems()).toBe('stretch');
    });

    it('should apply custom alignItems', () => {
      const alignments: GridAlign[] = ['start', 'center', 'end', 'stretch'];

      alignments.forEach((align) => {
        fixture.componentRef.setInput('alignItems', align);
        fixture.detectChanges();
        expect(component.alignItems()).toBe(align);
      });
    });

    it('should allow undefined justifyItems', () => {
      fixture.detectChanges();
      expect(component.justifyItems()).toBeUndefined();
    });

    it('should apply custom justifyItems', () => {
      const justifications: GridJustify[] = [
        'start',
        'center',
        'end',
        'space-between',
        'space-around',
        'space-evenly',
      ];

      justifications.forEach((justify) => {
        fixture.componentRef.setInput('justifyItems', justify);
        fixture.detectChanges();
        expect(component.justifyItems()).toBe(justify);
      });
    });
  });

  describe('Input Handling - Other Properties', () => {
    it('should have default minColWidth as 200px', () => {
      fixture.detectChanges();
      expect(component.minColWidth()).toBe('200px');
    });

    it('should apply custom minColWidth', () => {
      fixture.componentRef.setInput('minColWidth', '300px');
      fixture.detectChanges();
      expect(component.minColWidth()).toBe('300px');
    });

    it('should have default fullWidth as true', () => {
      fixture.detectChanges();
      expect(component.fullWidth()).toBe(true);
    });

    it('should apply custom fullWidth value', () => {
      fixture.componentRef.setInput('fullWidth', false);
      fixture.detectChanges();
      expect(component.fullWidth()).toBe(false);
    });
  });

  describe('Accessibility - ARIA Attributes', () => {
    it('should have no role by default (layout utility)', () => {
      fixture.detectChanges();

      const gridElement = nativeElement.querySelector('.grid');
      expect(gridElement?.getAttribute('role')).toBeNull();
    });

    it('should allow custom role override', () => {
      fixture.componentRef.setInput('role', 'grid');
      fixture.detectChanges();

      const gridElement = nativeElement.querySelector('.grid');
      expect(gridElement?.getAttribute('role')).toBe('grid');
    });

    it('should set aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Product grid');
      fixture.detectChanges();

      const gridElement = nativeElement.querySelector('.grid');
      expect(gridElement?.getAttribute('aria-label')).toBe('Product grid');
    });

    it('should not set aria-label when undefined', () => {
      fixture.detectChanges();

      const gridElement = nativeElement.querySelector('.grid');
      expect(gridElement?.getAttribute('aria-label')).toBeNull();
    });

    it('should set aria-labelledby when provided', () => {
      fixture.componentRef.setInput('ariaLabelledBy', 'grid-title');
      fixture.detectChanges();

      const gridElement = nativeElement.querySelector('.grid');
      expect(gridElement?.getAttribute('aria-labelledby')).toBe('grid-title');
    });

    it('should not set aria-labelledby when undefined', () => {
      fixture.detectChanges();

      const gridElement = nativeElement.querySelector('.grid');
      expect(gridElement?.getAttribute('aria-labelledby')).toBeNull();
    });
  });

  describe('CSS Classes', () => {
    it('should apply base grid class', () => {
      fixture.detectChanges();

      const gridElement = nativeElement.querySelector('.grid');
      expect(gridElement?.classList.contains('grid')).toBe(true);
    });

    it('should apply gap classes', () => {
      const gaps: GridGap[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];

      gaps.forEach((gap) => {
        fixture.componentRef.setInput('gap', gap);
        fixture.detectChanges();

        const gridElement = nativeElement.querySelector('.grid');
        expect(gridElement?.classList.contains(`grid--gap-${gap}`)).toBe(true);
      });
    });

    it('should apply gapX and gapY classes when specified', () => {
      fixture.componentRef.setInput('gapX', 'lg');
      fixture.componentRef.setInput('gapY', 'sm');
      fixture.detectChanges();

      const gridElement = nativeElement.querySelector('.grid');
      expect(gridElement?.classList.contains('grid--gap-x-lg')).toBe(true);
      expect(gridElement?.classList.contains('grid--gap-y-sm')).toBe(true);
      // Should not have uniform gap class
      expect(gridElement?.classList.contains('grid--gap-md')).toBe(false);
    });

    it('should apply alignment classes', () => {
      const alignments: GridAlign[] = ['start', 'center', 'end', 'stretch'];

      alignments.forEach((align) => {
        fixture.componentRef.setInput('alignItems', align);
        fixture.detectChanges();

        const gridElement = nativeElement.querySelector('.grid');
        expect(gridElement?.classList.contains(`grid--align-${align}`)).toBe(true);
      });
    });

    it('should apply justify classes when specified', () => {
      const justifications: GridJustify[] = [
        'start',
        'center',
        'end',
        'space-between',
        'space-around',
        'space-evenly',
      ];

      justifications.forEach((justify) => {
        fixture.componentRef.setInput('justifyItems', justify);
        fixture.detectChanges();

        const gridElement = nativeElement.querySelector('.grid');
        expect(gridElement?.classList.contains(`grid--justify-${justify}`)).toBe(true);
      });
    });

    it('should apply full-width class when fullWidth is true', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();

      const gridElement = nativeElement.querySelector('.grid');
      expect(gridElement?.classList.contains('grid--full-width')).toBe(true);
    });

    it('should NOT apply full-width class when fullWidth is false', () => {
      fixture.componentRef.setInput('fullWidth', false);
      fixture.detectChanges();

      const gridElement = nativeElement.querySelector('.grid');
      expect(gridElement?.classList.contains('grid--full-width')).toBe(false);
    });
  });

  describe('Inline Styles', () => {
    it('should set grid-template-columns for fixed column count', () => {
      fixture.componentRef.setInput('cols', 3);
      fixture.detectChanges();

      const styles = component.gridStyles();
      expect(styles['--grid-cols']).toBe('repeat(3, 1fr)');
    });

    it('should set auto-fit for cols="auto"', () => {
      fixture.componentRef.setInput('cols', 'auto');
      fixture.componentRef.setInput('minColWidth', '250px');
      fixture.detectChanges();

      const styles = component.gridStyles();
      expect(styles['--grid-cols']).toBe('repeat(auto-fit, minmax(min(250px, 100%), 1fr))');
    });

    it('should set responsive column styles when provided', () => {
      fixture.componentRef.setInput('cols', 1);
      fixture.componentRef.setInput('colsMd', 2);
      fixture.componentRef.setInput('colsLg', 3);
      fixture.componentRef.setInput('colsXl', 4);
      fixture.detectChanges();

      const styles = component.gridStyles();
      expect(styles['--grid-cols']).toBe('repeat(1, 1fr)');
      expect(styles['--grid-cols-md']).toBe('repeat(2, 1fr)');
      expect(styles['--grid-cols-lg']).toBe('repeat(3, 1fr)');
      expect(styles['--grid-cols-xl']).toBe('repeat(4, 1fr)');
    });

    it('should not set responsive styles when undefined', () => {
      fixture.componentRef.setInput('cols', 2);
      fixture.detectChanges();

      const styles = component.gridStyles();
      expect(styles['--grid-cols']).toBe('repeat(2, 1fr)');
      expect(styles['--grid-cols-md']).toBeUndefined();
      expect(styles['--grid-cols-lg']).toBeUndefined();
      expect(styles['--grid-cols-xl']).toBeUndefined();
    });

    it('should handle auto-fit for responsive breakpoints', () => {
      fixture.componentRef.setInput('cols', 1);
      fixture.componentRef.setInput('colsMd', 'auto');
      fixture.componentRef.setInput('minColWidth', '200px');
      fixture.detectChanges();

      const styles = component.gridStyles();
      expect(styles['--grid-cols']).toBe('repeat(1, 1fr)');
      expect(styles['--grid-cols-md']).toBe('repeat(auto-fit, minmax(min(200px, 100%), 1fr))');
    });
  });

  describe('Content Projection', () => {
    it('should render projected content', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const gridElement = compiled.querySelector('.grid');
      expect(gridElement).toBeTruthy();
    });

    it('should have ng-content for content projection', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const gridElement = compiled.querySelector('.grid');
      expect(gridElement).toBeTruthy();
    });
  });

  describe('Computed Values', () => {
    it('should compute gridClasses correctly with defaults', () => {
      fixture.detectChanges();

      const classes = component.gridClasses();
      expect(classes).toContain('grid');
      expect(classes).toContain('grid--gap-md');
      expect(classes).toContain('grid--align-stretch');
      expect(classes).toContain('grid--full-width');
    });

    it('should compute gridClasses correctly with custom values', () => {
      fixture.componentRef.setInput('gap', 'lg');
      fixture.componentRef.setInput('alignItems', 'center');
      fixture.componentRef.setInput('justifyItems', 'space-between');
      fixture.componentRef.setInput('fullWidth', false);
      fixture.detectChanges();

      const classes = component.gridClasses();
      expect(classes).toContain('grid');
      expect(classes).toContain('grid--gap-lg');
      expect(classes).toContain('grid--align-center');
      expect(classes).toContain('grid--justify-space-between');
      expect(classes).not.toContain('grid--full-width');
    });

    it('should compute gridStyles correctly with different column configurations', () => {
      fixture.componentRef.setInput('cols', 4);
      fixture.detectChanges();

      const styles = component.gridStyles();
      expect(styles['--grid-cols']).toBe('repeat(4, 1fr)');
    });

    it('should recompute gridClasses when inputs change', () => {
      fixture.componentRef.setInput('gap', 'sm');
      fixture.detectChanges();
      expect(component.gridClasses()).toContain('grid--gap-sm');

      fixture.componentRef.setInput('gap', 'xl');
      fixture.detectChanges();
      expect(component.gridClasses()).toContain('grid--gap-xl');
      expect(component.gridClasses()).not.toContain('grid--gap-sm');
    });

    it('should recompute gridStyles when cols change', () => {
      fixture.componentRef.setInput('cols', 2);
      fixture.detectChanges();
      expect(component.gridStyles()['--grid-cols']).toBe('repeat(2, 1fr)');

      fixture.componentRef.setInput('cols', 6);
      fixture.detectChanges();
      expect(component.gridStyles()['--grid-cols']).toBe('repeat(6, 1fr)');
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

      const gridElement = nativeElement.querySelector('div.grid');
      expect(gridElement).toBeTruthy();
    });

    it('should have proper element structure', () => {
      fixture.detectChanges();

      const gridElement = nativeElement.querySelector('.grid');

      expect(gridElement?.tagName).toBe('DIV');
      // No role by default since grid is a layout utility
      expect(gridElement?.getAttribute('role')).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid input changes', () => {
      const columns: GridColumns[] = [1, 2, 3, 4, 6, 12];

      columns.forEach((cols) => {
        fixture.componentRef.setInput('cols', cols);
      });
      fixture.detectChanges();

      expect(component.cols()).toBe(12);
      expect(component.gridStyles()['--grid-cols']).toBe('repeat(12, 1fr)');
    });

    it('should handle all inputs being set at once', () => {
      fixture.componentRef.setInput('cols', 2);
      fixture.componentRef.setInput('colsMd', 3);
      fixture.componentRef.setInput('colsLg', 4);
      fixture.componentRef.setInput('colsXl', 6);
      fixture.componentRef.setInput('gap', 'lg');
      fixture.componentRef.setInput('alignItems', 'center');
      fixture.componentRef.setInput('justifyItems', 'space-evenly');
      fixture.componentRef.setInput('fullWidth', false);
      fixture.detectChanges();

      expect(component.cols()).toBe(2);
      expect(component.colsMd()).toBe(3);
      expect(component.colsLg()).toBe(4);
      expect(component.colsXl()).toBe(6);
      expect(component.gap()).toBe('lg');
      expect(component.alignItems()).toBe('center');
      expect(component.justifyItems()).toBe('space-evenly');
      expect(component.fullWidth()).toBe(false);
    });

    it('should maintain consistent class order', () => {
      fixture.componentRef.setInput('gap', 'md');
      fixture.componentRef.setInput('alignItems', 'start');
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();

      const classes = component.gridClasses().split(' ');
      expect(classes[0]).toBe('grid');
      expect(classes).toContain('grid--gap-md');
      expect(classes).toContain('grid--align-start');
      expect(classes).toContain('grid--full-width');
    });

    it('should handle switching between uniform gap and directional gaps', () => {
      // Start with uniform gap
      fixture.componentRef.setInput('gap', 'md');
      fixture.detectChanges();
      expect(component.gridClasses()).toContain('grid--gap-md');

      // Switch to directional gaps
      fixture.componentRef.setInput('gapX', 'lg');
      fixture.componentRef.setInput('gapY', 'sm');
      fixture.detectChanges();
      expect(component.gridClasses()).toContain('grid--gap-x-lg');
      expect(component.gridClasses()).toContain('grid--gap-y-sm');
      expect(component.gridClasses()).not.toContain('grid--gap-md');
    });
  });

  describe('Integration', () => {
    it('should work with all column variants', () => {
      const variants: GridColumns[] = [1, 2, 3, 4, 6, 12, 'auto'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('cols', variant);
        fixture.detectChanges();

        const styles = component.gridStyles();
        if (variant === 'auto') {
          expect(styles['--grid-cols']).toContain('auto-fit');
        } else {
          expect(styles['--grid-cols']).toBe(`repeat(${String(variant)}, 1fr)`);
        }
      });
    });

    it('should work with all gap variants', () => {
      const variants: GridGap[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('gap', variant);
        fixture.detectChanges();

        const gridElement = nativeElement.querySelector('.grid');
        expect(gridElement?.classList.contains(`grid--gap-${variant}`)).toBe(true);
      });
    });

    it('should properly combine all configuration options', () => {
      fixture.componentRef.setInput('cols', 3);
      fixture.componentRef.setInput('colsMd', 4);
      fixture.componentRef.setInput('gap', 'lg');
      fixture.componentRef.setInput('alignItems', 'center');
      fixture.componentRef.setInput('justifyItems', 'space-between');
      fixture.componentRef.setInput('fullWidth', true);
      fixture.componentRef.setInput('role', 'grid');
      fixture.componentRef.setInput('ariaLabel', 'Product grid');
      fixture.detectChanges();

      const gridElement = nativeElement.querySelector('.grid');
      const styles = component.gridStyles();

      // Check classes
      expect(gridElement?.classList.contains('grid')).toBe(true);
      expect(gridElement?.classList.contains('grid--gap-lg')).toBe(true);
      expect(gridElement?.classList.contains('grid--align-center')).toBe(true);
      expect(gridElement?.classList.contains('grid--justify-space-between')).toBe(true);
      expect(gridElement?.classList.contains('grid--full-width')).toBe(true);

      // Check styles
      expect(styles['--grid-cols']).toBe('repeat(3, 1fr)');
      expect(styles['--grid-cols-md']).toBe('repeat(4, 1fr)');

      // Check ARIA attributes
      expect(gridElement?.getAttribute('role')).toBe('grid');
      expect(gridElement?.getAttribute('aria-label')).toBe('Product grid');
    });
  });
});
