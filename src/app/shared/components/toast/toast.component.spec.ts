// @vitest-environment jsdom
import { ResourceLoader } from '@angular/compiler';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { ToastPosition, ToastVariant } from './toast.component';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    TestBed.overrideComponent(ToastComponent, {
      set: {
        template: `
          <div
            [class]="toastClasses()"
            [attr.role]="ariaRole()"
            [attr.aria-live]="ariaLive()"
            [attr.aria-atomic]="true"
          >
            <div class="toast__icon" [attr.aria-label]="variantIconLabel()">
              <span class="toast__icon-symbol">{{ variantIcon() }}</span>
            </div>
            <div class="toast__content">
              @if (title()) {
                <div class="toast__title">{{ title() }}</div>
              }
              <div class="toast__message">{{ message() }}</div>
            </div>
            @if (dismissible()) {
              <button
                class="toast__dismiss"
                type="button"
                aria-label="Dismiss notification"
                (click)="handleDismiss()"
              >
                ×
              </button>
            }
          </div>
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

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('message', 'Test message');
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (ToastComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (ToastComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - Variant', () => {
    it('should have default variant as info', () => {
      fixture.detectChanges();
      expect(component.variant()).toBe('info');
    });

    it('should apply custom variant', () => {
      const variants: ToastVariant[] = ['success', 'error', 'warning', 'info'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(component.variant()).toBe(variant);
      });
    });

    it('should compute correct variant icon for each variant', () => {
      const expectedIcons: Record<ToastVariant, string> = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
      };

      Object.entries(expectedIcons).forEach(([variant, icon]) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(component.variantIcon()).toBe(icon);
      });
    });

    it('should compute correct variant icon label for each variant', () => {
      const expectedLabels: Record<ToastVariant, string> = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information',
      };

      Object.entries(expectedLabels).forEach(([variant, label]) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(component.variantIconLabel()).toBe(label);
      });
    });
  });

  describe('Input Handling - Position', () => {
    it('should have default position as top-right', () => {
      fixture.detectChanges();
      expect(component.position()).toBe('top-right');
    });

    it('should apply custom position', () => {
      const positions: ToastPosition[] = [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ];

      positions.forEach((position) => {
        fixture.componentRef.setInput('position', position);
        fixture.detectChanges();
        expect(component.position()).toBe(position);
      });
    });
  });

  describe('Input Handling - Content', () => {
    it('should accept required message input', () => {
      fixture.componentRef.setInput('message', 'Custom message');
      fixture.detectChanges();
      expect(component.message()).toBe('Custom message');
    });

    it('should accept optional title input', () => {
      fixture.componentRef.setInput('title', 'Custom title');
      fixture.detectChanges();
      expect(component.title()).toBe('Custom title');
    });

    it('should have undefined title by default', () => {
      fixture.detectChanges();
      expect(component.title()).toBeUndefined();
    });
  });

  describe('Input Handling - Duration and Dismissible', () => {
    it('should have default duration of 5000ms', () => {
      fixture.detectChanges();
      expect(component.duration()).toBe(5000);
    });

    it('should accept custom duration', () => {
      fixture.componentRef.setInput('duration', 10000);
      fixture.detectChanges();
      expect(component.duration()).toBe(10000);
    });

    it('should accept duration of 0 for no auto-dismiss', () => {
      fixture.componentRef.setInput('duration', 0);
      fixture.detectChanges();
      expect(component.duration()).toBe(0);
    });

    it('should be dismissible by default', () => {
      fixture.detectChanges();
      expect(component.dismissible()).toBe(true);
    });

    it('should accept dismissible as false', () => {
      fixture.componentRef.setInput('dismissible', false);
      fixture.detectChanges();
      expect(component.dismissible()).toBe(false);
    });
  });

  describe('Input Handling - Exiting State', () => {
    it('should not be exiting by default', () => {
      fixture.detectChanges();
      expect(component.isExiting()).toBe(false);
    });

    it('should accept isExiting as true', () => {
      fixture.componentRef.setInput('isExiting', true);
      fixture.detectChanges();
      expect(component.isExiting()).toBe(true);
    });
  });

  describe('Computed Properties - ARIA', () => {
    it('should have alert role for error variant', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();
      expect(component.ariaRole()).toBe('alert');
    });

    it('should have status role for success variant', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      expect(component.ariaRole()).toBe('status');
    });

    it('should have status role for info variant', () => {
      fixture.componentRef.setInput('variant', 'info');
      fixture.detectChanges();
      expect(component.ariaRole()).toBe('status');
    });

    it('should have status role for warning variant', () => {
      fixture.componentRef.setInput('variant', 'warning');
      fixture.detectChanges();
      expect(component.ariaRole()).toBe('status');
    });

    it('should have assertive aria-live for error variant', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();
      expect(component.ariaLive()).toBe('assertive');
    });

    it('should have assertive aria-live for warning variant', () => {
      fixture.componentRef.setInput('variant', 'warning');
      fixture.detectChanges();
      expect(component.ariaLive()).toBe('assertive');
    });

    it('should have polite aria-live for success variant', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      expect(component.ariaLive()).toBe('polite');
    });

    it('should have polite aria-live for info variant', () => {
      fixture.componentRef.setInput('variant', 'info');
      fixture.detectChanges();
      expect(component.ariaLive()).toBe('polite');
    });
  });

  describe('Computed Properties - CSS Classes', () => {
    it('should include base toast class', () => {
      fixture.detectChanges();
      const classes = component.toastClasses();
      expect(classes).toContain('toast');
    });

    it('should include variant class', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      expect(component.toastClasses()).toContain('toast--success');
    });

    it('should include position class', () => {
      fixture.componentRef.setInput('position', 'bottom-left');
      fixture.detectChanges();
      expect(component.toastClasses()).toContain('toast--bottom-left');
    });

    it('should include exiting class when isExiting is true', () => {
      fixture.componentRef.setInput('isExiting', true);
      fixture.detectChanges();
      expect(component.toastClasses()).toContain('toast--exiting');
    });

    it('should not include exiting class when isExiting is false', () => {
      fixture.componentRef.setInput('isExiting', false);
      fixture.detectChanges();
      expect(component.toastClasses()).not.toContain('toast--exiting');
    });
  });

  describe('Dismiss Functionality', () => {
    it('should emit dismissed event when handleDismiss is called', () => {
      fixture.detectChanges();

      let dismissedCalled = false;
      component.dismissed.subscribe(() => (dismissedCalled = true));

      component.handleDismiss();

      expect(dismissedCalled).toBe(true);
    });

    it('should emit dismissed event when dismiss button is clicked', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();

      let dismissedCalled = false;
      component.dismissed.subscribe(() => (dismissedCalled = true));

      const dismissButton = nativeElement.querySelector<HTMLButtonElement>('.toast__dismiss');
      dismissButton?.click();

      expect(dismissedCalled).toBe(true);
    });

    it('should not render dismiss button when dismissible is false', () => {
      fixture.componentRef.setInput('dismissible', false);
      fixture.detectChanges();

      const dismissButton = nativeElement.querySelector('.toast__dismiss');
      expect(dismissButton).toBeNull();
    });
  });

  describe('DOM Rendering', () => {
    it('should render message in the DOM', () => {
      fixture.componentRef.setInput('message', 'Test notification');
      fixture.detectChanges();

      const messageElement = nativeElement.querySelector('.toast__message');
      expect(messageElement?.textContent).toContain('Test notification');
    });

    it('should render title when provided', () => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.detectChanges();

      const titleElement = nativeElement.querySelector('.toast__title');
      expect(titleElement?.textContent).toContain('Test Title');
    });

    it('should not render title element when title is not provided', () => {
      fixture.detectChanges();

      const titleElement = nativeElement.querySelector('.toast__title');
      expect(titleElement).toBeNull();
    });

    it('should render variant icon', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();

      const iconElement = nativeElement.querySelector('.toast__icon-symbol');
      expect(iconElement).toBeTruthy();
      expect(iconElement?.textContent).toContain('✓');
    });

    it('should set correct ARIA attributes on container', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();

      const toastElement = nativeElement.querySelector('.toast');
      expect(toastElement?.getAttribute('role')).toBe('alert');
      expect(toastElement?.getAttribute('aria-live')).toBe('assertive');
      expect(toastElement?.getAttribute('aria-atomic')).toBe('true');
    });

    it('should set correct aria-label on icon', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();

      const iconElement = nativeElement.querySelector('.toast__icon');
      expect(iconElement?.getAttribute('aria-label')).toBe('Success');
    });

    it('should set correct aria-label on dismiss button', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();

      const dismissButton = nativeElement.querySelector('.toast__dismiss');
      expect(dismissButton?.getAttribute('aria-label')).toBe('Dismiss notification');
    });
  });

  describe('CSS Class Application', () => {
    it('should apply correct variant classes to DOM element', () => {
      const variants: ToastVariant[] = ['success', 'error', 'warning', 'info'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        const toastElement = nativeElement.querySelector('.toast');
        expect(toastElement?.classList.contains(`toast--${variant}`)).toBe(true);
      });
    });

    it('should apply correct position classes to DOM element', () => {
      const positions: ToastPosition[] = [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ];

      positions.forEach((position) => {
        fixture.componentRef.setInput('position', position);
        fixture.detectChanges();

        const toastElement = nativeElement.querySelector('.toast');
        expect(toastElement?.classList.contains(`toast--${position}`)).toBe(true);
      });
    });

    it('should apply exiting class when isExiting is true', () => {
      fixture.componentRef.setInput('isExiting', true);
      fixture.detectChanges();

      const toastElement = nativeElement.querySelector('.toast');
      expect(toastElement?.classList.contains('toast--exiting')).toBe(true);
    });
  });
});
