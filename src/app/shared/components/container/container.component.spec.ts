// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { ContainerMaxWidth, ContainerPadding } from './container.component';
import { ContainerComponent } from './container.component';

describe('ContainerComponent', () => {
  let component: ContainerComponent;
  let fixture: ComponentFixture<ContainerComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContainerComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (ContainerComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (ContainerComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - MaxWidth', () => {
    it('should have default maxWidth as lg', () => {
      fixture.detectChanges();
      expect(component.maxWidth()).toBe('lg');
    });

    it('should apply custom maxWidth', () => {
      const maxWidths: ContainerMaxWidth[] = ['sm', 'md', 'lg', 'xl', 'full'];

      maxWidths.forEach((maxWidth) => {
        fixture.componentRef.setInput('maxWidth', maxWidth);
        fixture.detectChanges();
        expect(component.maxWidth()).toBe(maxWidth);
      });
    });
  });

  describe('Input Handling - Padding', () => {
    it('should have default padding as md', () => {
      fixture.detectChanges();
      expect(component.padding()).toBe('md');
    });

    it('should apply custom padding', () => {
      const paddings: ContainerPadding[] = ['none', 'sm', 'md', 'lg'];

      paddings.forEach((padding) => {
        fixture.componentRef.setInput('padding', padding);
        fixture.detectChanges();
        expect(component.padding()).toBe(padding);
      });
    });
  });

  describe('Input Handling - CenterContent', () => {
    it('should have centerContent true by default', () => {
      fixture.detectChanges();
      expect(component.centerContent()).toBe(true);
    });

    it('should apply custom centerContent value', () => {
      fixture.componentRef.setInput('centerContent', false);
      fixture.detectChanges();
      expect(component.centerContent()).toBe(false);

      fixture.componentRef.setInput('centerContent', true);
      fixture.detectChanges();
      expect(component.centerContent()).toBe(true);
    });
  });

  describe('Accessibility - ARIA Attributes', () => {
    it('should have region role by default', () => {
      fixture.detectChanges();

      const containerElement = nativeElement.querySelector('.container');
      expect(containerElement?.getAttribute('role')).toBe('region');
    });

    it('should allow custom role override', () => {
      fixture.componentRef.setInput('role', 'main');
      fixture.detectChanges();

      const containerElement = nativeElement.querySelector('.container');
      expect(containerElement?.getAttribute('role')).toBe('main');
    });

    it('should set aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Main content');
      fixture.detectChanges();

      const containerElement = nativeElement.querySelector('.container');
      expect(containerElement?.getAttribute('aria-label')).toBe('Main content');
    });

    it('should not set aria-label when undefined', () => {
      fixture.detectChanges();

      const containerElement = nativeElement.querySelector('.container');
      expect(containerElement?.getAttribute('aria-label')).toBeNull();
    });

    it('should set aria-labelledby when provided', () => {
      fixture.componentRef.setInput('ariaLabelledBy', 'section-title');
      fixture.detectChanges();

      const containerElement = nativeElement.querySelector('.container');
      expect(containerElement?.getAttribute('aria-labelledby')).toBe('section-title');
    });

    it('should not set aria-labelledby when undefined', () => {
      fixture.detectChanges();

      const containerElement = nativeElement.querySelector('.container');
      expect(containerElement?.getAttribute('aria-labelledby')).toBeNull();
    });
  });

  describe('CSS Classes', () => {
    it('should apply base container class', () => {
      fixture.detectChanges();

      const containerElement = nativeElement.querySelector('.container');
      expect(containerElement?.classList.contains('container')).toBe(true);
    });

    it('should apply maxWidth classes', () => {
      const maxWidths: ContainerMaxWidth[] = ['sm', 'md', 'lg', 'xl', 'full'];

      maxWidths.forEach((maxWidth) => {
        fixture.componentRef.setInput('maxWidth', maxWidth);
        fixture.detectChanges();

        const containerElement = nativeElement.querySelector('.container');
        expect(containerElement?.classList.contains(`container--${maxWidth}`)).toBe(true);
      });
    });

    it('should apply padding classes', () => {
      const paddings: ContainerPadding[] = ['none', 'sm', 'md', 'lg'];

      paddings.forEach((padding) => {
        fixture.componentRef.setInput('padding', padding);
        fixture.detectChanges();

        const containerElement = nativeElement.querySelector('.container');
        expect(containerElement?.classList.contains(`container--padding-${padding}`)).toBe(true);
      });
    });

    it('should apply centered class when centerContent is true', () => {
      fixture.componentRef.setInput('centerContent', true);
      fixture.detectChanges();

      const containerElement = nativeElement.querySelector('.container');
      expect(containerElement?.classList.contains('container--centered')).toBe(true);
    });

    it('should NOT apply centered class when centerContent is false', () => {
      fixture.componentRef.setInput('centerContent', false);
      fixture.detectChanges();

      const containerElement = nativeElement.querySelector('.container');
      expect(containerElement?.classList.contains('container--centered')).toBe(false);
    });

    it('should apply multiple classes correctly', () => {
      fixture.componentRef.setInput('maxWidth', 'md');
      fixture.componentRef.setInput('padding', 'lg');
      fixture.componentRef.setInput('centerContent', true);
      fixture.detectChanges();

      const containerElement = nativeElement.querySelector('.container');
      expect(containerElement?.classList.contains('container')).toBe(true);
      expect(containerElement?.classList.contains('container--md')).toBe(true);
      expect(containerElement?.classList.contains('container--padding-lg')).toBe(true);
      expect(containerElement?.classList.contains('container--centered')).toBe(true);
    });
  });

  describe('Content Projection', () => {
    it('should render projected content', () => {
      const testContent = 'Test content';

      // Create a new fixture with content
      const testFixture = TestBed.createComponent(ContainerComponent);
      const textFixtureNativeElement = testFixture.nativeElement as HTMLElement;
      textFixtureNativeElement.innerHTML = testContent;
      testFixture.detectChanges();

      const containerElement = nativeElement.querySelector('.container');
      expect(containerElement).toBeTruthy();
    });

    it('should have ng-content for content projection', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const containerElement = compiled.querySelector('.container');
      expect(containerElement).toBeTruthy();
    });
  });

  describe('Computed Values', () => {
    it('should compute containerClasses correctly with defaults', () => {
      fixture.detectChanges();

      const classes = component.containerClasses();
      expect(classes).toContain('container');
      expect(classes).toContain('container--lg');
      expect(classes).toContain('container--padding-md');
      expect(classes).toContain('container--centered');
    });

    it('should compute containerClasses correctly with custom values', () => {
      fixture.componentRef.setInput('maxWidth', 'sm');
      fixture.componentRef.setInput('padding', 'none');
      fixture.componentRef.setInput('centerContent', false);
      fixture.detectChanges();

      const classes = component.containerClasses();
      expect(classes).toContain('container');
      expect(classes).toContain('container--sm');
      expect(classes).toContain('container--padding-none');
      expect(classes).not.toContain('container--centered');
    });

    it('should recompute containerClasses when inputs change', () => {
      fixture.componentRef.setInput('maxWidth', 'md');
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('container--md');

      fixture.componentRef.setInput('maxWidth', 'xl');
      fixture.detectChanges();
      expect(component.containerClasses()).toContain('container--xl');
      expect(component.containerClasses()).not.toContain('container--md');
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

      const containerElement = nativeElement.querySelector('div.container');
      expect(containerElement).toBeTruthy();
    });

    it('should have proper element structure', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const containerElement = compiled.querySelector('.container');

      expect(containerElement?.tagName).toBe('DIV');
      expect(containerElement?.getAttribute('role')).toBe('region');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid input changes', () => {
      const maxWidths: ContainerMaxWidth[] = ['sm', 'md', 'lg', 'xl', 'full'];

      maxWidths.forEach((maxWidth) => {
        fixture.componentRef.setInput('maxWidth', maxWidth);
      });
      fixture.detectChanges();

      expect(component.maxWidth()).toBe('full');
      expect(component.containerClasses()).toContain('container--full');
    });

    it('should handle all inputs being set at once', () => {
      fixture.componentRef.setInput('maxWidth', 'xl');
      fixture.componentRef.setInput('padding', 'lg');
      fixture.componentRef.setInput('centerContent', false);
      fixture.componentRef.setInput('role', 'complementary');
      fixture.componentRef.setInput('ariaLabel', 'Sidebar');
      fixture.detectChanges();

      expect(component.maxWidth()).toBe('xl');
      expect(component.padding()).toBe('lg');
      expect(component.centerContent()).toBe(false);
      expect(component.role()).toBe('complementary');
      expect(component.ariaLabel()).toBe('Sidebar');
    });

    it('should maintain consistent class order', () => {
      fixture.componentRef.setInput('maxWidth', 'md');
      fixture.componentRef.setInput('padding', 'sm');
      fixture.componentRef.setInput('centerContent', true);
      fixture.detectChanges();

      const classes = component.containerClasses().split(' ');
      expect(classes[0]).toBe('container');
      expect(classes[1]).toBe('container--md');
      expect(classes[2]).toBe('container--padding-sm');
      expect(classes[3]).toBe('container--centered');
    });
  });

  describe('Integration', () => {
    it('should work with all maxWidth variants', () => {
      const variants: ContainerMaxWidth[] = ['sm', 'md', 'lg', 'xl', 'full'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('maxWidth', variant);
        fixture.detectChanges();

        const containerElement = nativeElement.querySelector('.container');
        expect(containerElement?.classList.contains(`container--${variant}`)).toBe(true);
      });
    });

    it('should work with all padding variants', () => {
      const variants: ContainerPadding[] = ['none', 'sm', 'md', 'lg'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('padding', variant);
        fixture.detectChanges();

        const containerElement = nativeElement.querySelector('.container');
        expect(containerElement?.classList.contains(`container--padding-${variant}`)).toBe(true);
      });
    });

    it('should properly combine all configuration options', () => {
      fixture.componentRef.setInput('maxWidth', 'lg');
      fixture.componentRef.setInput('padding', 'md');
      fixture.componentRef.setInput('centerContent', true);
      fixture.componentRef.setInput('role', 'main');
      fixture.componentRef.setInput('ariaLabel', 'Main content area');
      fixture.detectChanges();

      const containerElement = nativeElement.querySelector('.container');

      // Check classes
      expect(containerElement?.classList.contains('container')).toBe(true);
      expect(containerElement?.classList.contains('container--lg')).toBe(true);
      expect(containerElement?.classList.contains('container--padding-md')).toBe(true);
      expect(containerElement?.classList.contains('container--centered')).toBe(true);

      // Check ARIA attributes
      expect(containerElement?.getAttribute('role')).toBe('main');
      expect(containerElement?.getAttribute('aria-label')).toBe('Main content area');
    });
  });
});
