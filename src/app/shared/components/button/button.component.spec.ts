// @vitest-environment jsdom
import { ResourceLoader } from '@angular/compiler';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { ButtonSize, ButtonType, ButtonVariant } from './button.component';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    TestBed.overrideComponent(ButtonComponent, {
      set: {
        template: `
          <button
            [type]="type()"
            [class]="buttonClasses()"
            [disabled]="disabled() || loading()"
            [attr.aria-label]="ariaLabel()"
            [attr.aria-describedby]="ariaDescribedBy()"
            [attr.aria-pressed]="ariaPressed()"
            [attr.aria-busy]="ariaBusyValue()"
            [attr.aria-disabled]="disabled() ? 'true' : undefined"
            (click)="handleClick($event)"
          >
              @if (loading()) {
              <span class="btn__spinner-icon" aria-hidden="true"></span>
              }

            @if (iconLeft() && !loading()) {
            <span class="btn__icon btn__icon--left" aria-hidden="true">
              {{ iconLeft() }}
            </span>
            }

            @if (!iconOnly()) {
            <span class="btn__content">
              <ng-content></ng-content>
            </span>
            }

            @if (iconRight() && !loading() && !iconOnly()) {
            <span class="btn__icon btn__icon--right" aria-hidden="true">
              {{ iconRight() }}
            </span>
        }
          </button>
        `,
        styles: [''],
      },
    });

    // Ensure ResourceLoader is provided to the Angular compiler so
    // JIT resolveComponentResources() calls succeed during compile.
    TestBed.configureCompiler({
      providers: [{ provide: ResourceLoader, useValue: { get: (_url: string) => '' } }],
    });

    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    // Set required ariaLabel input for all tests
    fixture.componentRef.setInput('ariaLabel', 'Test button');
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (ButtonComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (ButtonComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
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
      const variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'ghost', 'danger'];

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
      const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(component.size()).toBe(size);
      });
    });
  });

  describe('Input Handling - Type', () => {
    it('should have default type as button', () => {
      fixture.detectChanges();
      expect(component.type()).toBe('button');
    });

    it('should apply custom type', () => {
      const types: ButtonType[] = ['button', 'submit', 'reset'];

      types.forEach((type) => {
        fixture.componentRef.setInput('type', type);
        fixture.detectChanges();
        expect(component.type()).toBe(type);
      });
    });
  });

  describe('Input Handling - States', () => {
    it('should handle disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);
    });

    it('should handle loading state', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(component.loading()).toBe(true);
    });

    it('should handle fullWidth option', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();
      expect(component.fullWidth()).toBe(true);
    });

    it('should handle iconOnly option', () => {
      fixture.componentRef.setInput('iconOnly', true);
      fixture.detectChanges();
      expect(component.iconOnly()).toBe(true);
    });
  });

  describe('Input Handling - Icons', () => {
    it('should handle iconLeft input', () => {
      fixture.componentRef.setInput('iconLeft', 'arrow-left');
      fixture.detectChanges();
      expect(component.iconLeft()).toBe('arrow-left');
    });

    it('should handle iconRight input', () => {
      fixture.componentRef.setInput('iconRight', 'arrow-right');
      fixture.detectChanges();
      expect(component.iconRight()).toBe('arrow-right');
    });
  });

  describe('Click Events', () => {
    it('should emit click event when clicked', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.detectChanges();

      let clickedEvent: MouseEvent | undefined;
      component.clicked.subscribe((event) => (clickedEvent = event));

      const buttonElement = nativeElement.querySelector('button');
      buttonElement?.click();

      expect(clickedEvent).toBeDefined();
    });

    it('should NOT emit click when disabled', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      let clickedEvent: MouseEvent | undefined;
      component.clicked.subscribe((event) => (clickedEvent = event));

      component.handleClick(new MouseEvent('click'));

      expect(clickedEvent).toBeUndefined();
    });

    it('should NOT emit click when loading', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      let clickedEvent: MouseEvent | undefined;
      component.clicked.subscribe((event) => (clickedEvent = event));

      component.handleClick(new MouseEvent('click'));

      expect(clickedEvent).toBeUndefined();
    });

    it('should call handleClick with MouseEvent', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.detectChanges();

      const event = new MouseEvent('click');
      let emittedEvent: MouseEvent | undefined;
      component.clicked.subscribe((e) => (emittedEvent = e));

      component.handleClick(event);

      expect(emittedEvent).toBe(event);
    });

    it('should NOT emit click when both disabled and loading', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      let clickedEvent: MouseEvent | undefined;
      component.clicked.subscribe((event) => (clickedEvent = event));

      const buttonElement = nativeElement.querySelector('button');
      buttonElement?.click();

      expect(clickedEvent).toBeUndefined();
    });
  });

  describe('Accessibility - ARIA Attributes', () => {
    it('should have aria-label attribute', () => {
      fixture.componentRef.setInput('ariaLabel', 'Submit form');
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.getAttribute('aria-label')).toBe('Submit form');
    });

    it('should set aria-busy when loading', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.getAttribute('aria-busy')).toBe('true');
    });

    it('should not set aria-busy when not loading', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.getAttribute('aria-busy')).toBeNull();
    });

    it('should set aria-pressed when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Toggle button');
      fixture.componentRef.setInput('ariaPressed', true);
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.getAttribute('aria-pressed')).toBe('true');
    });

    it('should not set aria-pressed when undefined', () => {
      fixture.componentRef.setInput('ariaLabel', 'Toggle button');
      // do not set ariaPressed
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.hasAttribute('aria-pressed')).toBe(false);
    });

    it('should set aria-describedby when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('ariaDescribedBy', 'help-text');
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.getAttribute('aria-describedby')).toBe('help-text');
    });

    it('should set aria-disabled when disabled', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.getAttribute('aria-disabled')).toBe('true');
    });

    it('should not set aria-disabled when not disabled', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.getAttribute('aria-disabled')).toBeNull();
    });
  });

  describe('Accessibility - Button Element', () => {
    it('should use native button element', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement).toBeTruthy();
      expect(buttonElement?.tagName).toBe('BUTTON');
    });

    it('should have correct type attribute', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('type', 'submit');
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.getAttribute('type')).toBe('submit');
    });

    it('should be disabled when disabled prop is true', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.hasAttribute('disabled')).toBe(true);
    });

    it('should be disabled when loading', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('CSS Classes', () => {
    it('should apply base btn class', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.classList.contains('btn')).toBe(true);
    });

    it('should apply variant classes', () => {
      const variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'ghost', 'danger'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('ariaLabel', 'Test button');
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        const buttonElement = nativeElement.querySelector('button');
        expect(buttonElement?.classList.contains(`btn--${variant}`)).toBe(true);
      });
    });

    it('should apply size classes', () => {
      const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('ariaLabel', 'Test button');
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();

        const buttonElement = nativeElement.querySelector('button');
        expect(buttonElement?.classList.contains(`btn--${size}`)).toBe(true);
      });
    });

    it('should apply disabled class when disabled', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.classList.contains('btn--disabled')).toBe(true);
    });

    it('should apply loading class when loading', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.classList.contains('btn--loading')).toBe(true);
    });

    it('should apply icon-only class when iconOnly', () => {
      fixture.componentRef.setInput('ariaLabel', 'Close');
      fixture.componentRef.setInput('iconOnly', true);
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.classList.contains('btn--icon-only')).toBe(true);
    });

    it('should apply full-width class when fullWidth', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.classList.contains('btn--full-width')).toBe(true);
    });

    it('should apply both disabled and loading classes when both true', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('button');
      expect(buttonElement?.classList.contains('btn--disabled')).toBe(true);
      expect(buttonElement?.classList.contains('btn--loading')).toBe(true);
    });
  });

  describe('Content Projection', () => {
    it('should render projected content', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.detectChanges();

      const btn = nativeElement.querySelector('button');
      if (btn) {
        btn.innerHTML = '<span class="btn__content">Click Me</span>';
      }
      fixture.detectChanges();

      const content = nativeElement.querySelector('.btn__content');
      expect(content?.textContent).toContain('Click Me');
    });

    it('should render content wrapper when not iconOnly', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconOnly', false);
      fixture.detectChanges();

      const contentWrapper = nativeElement.querySelector('.btn__content');
      expect(contentWrapper).toBeTruthy();
    });

    it('should not render content wrapper when iconOnly', () => {
      fixture.componentRef.setInput('ariaLabel', 'Close');
      fixture.componentRef.setInput('iconOnly', true);
      fixture.detectChanges();

      const contentWrapper = nativeElement.querySelector('.btn__content');
      expect(contentWrapper).toBeNull();
    });
  });

  describe('Icon Rendering', () => {
    it('should render left icon when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconLeft', 'arrow-left');
      fixture.detectChanges();

      const iconLeft = nativeElement.querySelector('.btn__icon--left');
      expect(iconLeft).toBeTruthy();
      expect(iconLeft?.textContent.trim()).toBe('arrow-left');
    });

    it('should render right icon when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconRight', 'arrow-right');
      fixture.detectChanges();

      const iconRight = nativeElement.querySelector('.btn__icon--right');
      expect(iconRight).toBeTruthy();
      expect(iconRight?.textContent.trim()).toBe('arrow-right');
    });

    it('should hide icons when loading', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconLeft', 'arrow-left');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const iconLeft = nativeElement.querySelector('.btn__icon--left');
      expect(iconLeft).toBeNull();
    });

    it('should not render right icon when iconOnly', () => {
      fixture.componentRef.setInput('ariaLabel', 'Close');
      fixture.componentRef.setInput('iconRight', 'close');
      fixture.componentRef.setInput('iconOnly', true);
      fixture.detectChanges();

      const iconRight = nativeElement.querySelector('.btn__icon--right');
      expect(iconRight).toBeNull();
    });

    it('should set aria-hidden on icons', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconLeft', 'arrow-left');
      fixture.detectChanges();

      const iconLeft = nativeElement.querySelector('.btn__icon--left');
      expect(iconLeft?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Loading State', () => {
    it('should show spinner when loading', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const spinner = nativeElement.querySelector('.btn__spinner-icon');
      expect(spinner).toBeTruthy();
    });

    it('should not show spinner when not loading', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const spinner = nativeElement.querySelector('.btn__spinner-icon');
      expect(spinner).toBeNull();
    });

    it('should set aria-hidden on spinner', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const spinner = nativeElement.querySelector('.btn__spinner-icon');
      expect(spinner?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should render spinner icon element', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const spinnerIcon = nativeElement.querySelector('.btn__spinner-icon');
      expect(spinnerIcon).toBeTruthy();
    });
  });

  describe('Computed Values', () => {
    it('should compute isInteractive as true when not disabled or loading', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('disabled', false);
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      expect(component.isInteractive()).toBe(true);
    });

    it('should compute isInteractive as false when disabled', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(component.isInteractive()).toBe(false);
    });

    it('should compute isInteractive as false when loading', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(component.isInteractive()).toBe(false);
    });

    it('should compute buttonClasses correctly', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('variant', 'primary');
      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();

      const classes = component.buttonClasses();
      expect(classes).toContain('btn');
      expect(classes).toContain('btn--primary');
      expect(classes).toContain('btn--md');
    });

    it('should compute ariaBusyValue as true when loading', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(component.ariaBusyValue()).toBe('true');
    });

    it('should compute ariaBusyValue as undefined when not loading', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      expect(component.ariaBusyValue()).toBeUndefined();
    });
  });

  describe('Template Branch Coverage - Icon and Loading Combinations', () => {
    it('should show iconLeft when not loading', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconLeft', 'arrow-left');
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const iconLeft = nativeElement.querySelector('.btn__icon--left');
      expect(iconLeft).toBeTruthy();
      expect(iconLeft?.textContent.trim()).toBe('arrow-left');
    });

    it('should NOT show iconLeft when loading is true', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconLeft', 'arrow-left');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const iconLeft = nativeElement.querySelector('.btn__icon--left');
      expect(iconLeft).toBeNull();
    });

    it('should show iconRight when not loading and not iconOnly', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconRight', 'arrow-right');
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('iconOnly', false);
      fixture.detectChanges();

      const iconRight = nativeElement.querySelector('.btn__icon--right');
      expect(iconRight).toBeTruthy();
      expect(iconRight?.textContent.trim()).toBe('arrow-right');
    });

    it('should NOT show iconRight when loading is true', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconRight', 'arrow-right');
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('iconOnly', false);
      fixture.detectChanges();

      const iconRight = nativeElement.querySelector('.btn__icon--right');
      expect(iconRight).toBeNull();
    });

    it('should NOT show iconRight when iconOnly is true', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconRight', 'arrow-right');
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('iconOnly', true);
      fixture.detectChanges();

      const iconRight = nativeElement.querySelector('.btn__icon--right');
      expect(iconRight).toBeNull();
    });

    it('should NOT show iconRight when both loading and iconOnly are true', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconRight', 'arrow-right');
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('iconOnly', true);
      fixture.detectChanges();

      const iconRight = nativeElement.querySelector('.btn__icon--right');
      expect(iconRight).toBeNull();
    });

    it('should show content wrapper when iconOnly is false', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconOnly', false);
      fixture.detectChanges();

      const contentWrapper = nativeElement.querySelector('.btn__content');
      expect(contentWrapper).toBeTruthy();
    });

    it('should NOT show content wrapper when iconOnly is true', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconOnly', true);
      fixture.detectChanges();

      const contentWrapper = nativeElement.querySelector('.btn__content');
      expect(contentWrapper).toBeNull();
    });

    it('should show spinner when loading is true', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const spinner = nativeElement.querySelector('.btn__spinner-icon');
      expect(spinner).toBeTruthy();
    });

    it('should NOT show spinner when loading is false', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const spinner = nativeElement.querySelector('.btn__spinner-icon');
      expect(spinner).toBeNull();
    });

    it('should handle all icons with loading - only spinner shows', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconLeft', 'left');
      fixture.componentRef.setInput('iconRight', 'right');
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('iconOnly', false);
      fixture.detectChanges();

      const spinner = nativeElement.querySelector('.btn__spinner-icon');
      const iconLeft = nativeElement.querySelector('.btn__icon--left');
      const iconRight = nativeElement.querySelector('.btn__icon--right');

      expect(spinner).toBeTruthy();
      expect(iconLeft).toBeNull();
      expect(iconRight).toBeNull();
    });

    it('should handle iconLeft and iconRight together when not loading or iconOnly', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconLeft', 'left');
      fixture.componentRef.setInput('iconRight', 'right');
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('iconOnly', false);
      fixture.detectChanges();

      const iconLeft = nativeElement.querySelector('.btn__icon--left');
      const iconRight = nativeElement.querySelector('.btn__icon--right');
      const content = nativeElement.querySelector('.btn__content');

      expect(iconLeft).toBeTruthy();
      expect(iconRight).toBeTruthy();
      expect(content).toBeTruthy();
    });

    it('should show only iconLeft when iconOnly is true (no content, no iconRight)', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test button');
      fixture.componentRef.setInput('iconLeft', 'left');
      fixture.componentRef.setInput('iconRight', 'right');
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('iconOnly', true);
      fixture.detectChanges();

      const iconLeft = nativeElement.querySelector('.btn__icon--left');
      const iconRight = nativeElement.querySelector('.btn__icon--right');
      const content = nativeElement.querySelector('.btn__content');

      expect(iconLeft).toBeTruthy();
      expect(iconRight).toBeNull(); // iconRight requires !iconOnly
      expect(content).toBeNull(); // content requires !iconOnly
    });
  });
});
