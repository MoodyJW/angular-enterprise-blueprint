import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { ModalSize, ModalVariant } from './modal.component';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    // Set required ariaLabel input for all tests
    fixture.componentRef.setInput('ariaLabel', 'Test modal');
  });

  afterEach(() => {
    // Clean up body styles after each test
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (ModalComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (ModalComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      // ChangeDetectionStrategy.OnPush = 0
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - Variant', () => {
    it('should have default variant as default', () => {
      fixture.detectChanges();
      expect(component.variant()).toBe('default');
    });

    it('should apply custom variant', () => {
      const variants: ModalVariant[] = ['default', 'fullscreen', 'dialog', 'sidebar'];

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
      const sizes: ModalSize[] = ['sm', 'md', 'lg', 'xl'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(component.size()).toBe(size);
      });
    });
  });

  describe('Input Handling - Open State', () => {
    it('should have default open state as false', () => {
      fixture.detectChanges();
      expect(component.open()).toBe(false);
    });

    it('should update open state', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();
      expect(component.open()).toBe(true);

      fixture.componentRef.setInput('open', false);
      fixture.detectChanges();
      expect(component.open()).toBe(false);
    });
  });

  describe('Input Handling - Behavior Options', () => {
    it('should have default closeOnBackdropClick as true', () => {
      fixture.detectChanges();
      expect(component.closeOnBackdropClick()).toBe(true);
    });

    it('should update closeOnBackdropClick', () => {
      fixture.componentRef.setInput('closeOnBackdropClick', false);
      fixture.detectChanges();
      expect(component.closeOnBackdropClick()).toBe(false);
    });

    it('should have default closeOnEscape as true', () => {
      fixture.detectChanges();
      expect(component.closeOnEscape()).toBe(true);
    });

    it('should update closeOnEscape', () => {
      fixture.componentRef.setInput('closeOnEscape', false);
      fixture.detectChanges();
      expect(component.closeOnEscape()).toBe(false);
    });

    it('should have default showCloseButton as true', () => {
      fixture.detectChanges();
      expect(component.showCloseButton()).toBe(true);
    });

    it('should update showCloseButton', () => {
      fixture.componentRef.setInput('showCloseButton', false);
      fixture.detectChanges();
      expect(component.showCloseButton()).toBe(false);
    });

    it('should have default preventBodyScroll as true', () => {
      fixture.detectChanges();
      expect(component.preventBodyScroll()).toBe(true);
    });

    it('should update preventBodyScroll', () => {
      fixture.componentRef.setInput('preventBodyScroll', false);
      fixture.detectChanges();
      expect(component.preventBodyScroll()).toBe(false);
    });
  });

  describe('Input Handling - ARIA Attributes', () => {
    it('should require ariaLabel', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test modal label');
      fixture.detectChanges();
      expect(component.ariaLabel()).toBe('Test modal label');
    });

    it('should handle ariaDescribedBy', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'description-id');
      fixture.detectChanges();
      expect(component.ariaDescribedBy()).toBe('description-id');
    });

    it('should handle ariaLabelledBy', () => {
      fixture.componentRef.setInput('ariaLabelledBy', 'label-id');
      fixture.detectChanges();
      expect(component.ariaLabelledBy()).toBe('label-id');
    });
  });

  describe('Computed Properties', () => {
    it('should compute modal classes correctly for default variant', () => {
      fixture.componentRef.setInput('variant', 'default');
      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();

      const classes = component.modalClasses();
      expect(classes).toContain('modal');
      expect(classes).toContain('modal--default');
      expect(classes).toContain('modal--md');
    });

    it('should compute modal classes correctly for fullscreen variant', () => {
      fixture.componentRef.setInput('variant', 'fullscreen');
      fixture.detectChanges();

      const classes = component.modalClasses();
      expect(classes).toContain('modal');
      expect(classes).toContain('modal--fullscreen');
      expect(classes).not.toContain('modal--md');
    });

    it('should compute modal classes correctly for sidebar variant', () => {
      fixture.componentRef.setInput('variant', 'sidebar');
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      const classes = component.modalClasses();
      expect(classes).toContain('modal');
      expect(classes).toContain('modal--sidebar');
      expect(classes).toContain('modal--lg');
    });

    it('should compute backdrop classes correctly when closed', () => {
      fixture.componentRef.setInput('open', false);
      fixture.detectChanges();

      const classes = component.backdropClasses();
      expect(classes).toContain('modal-backdrop');
      expect(classes).not.toContain('modal-backdrop--open');
    });

    it('should compute backdrop classes correctly when open', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      const classes = component.backdropClasses();
      expect(classes).toContain('modal-backdrop');
      expect(classes).toContain('modal-backdrop--open');
    });

    it('should compute ARIA attributes correctly with ariaLabel only', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test modal');
      fixture.detectChanges();

      const attrs = component.ariaAttrs();
      expect(attrs['aria-label']).toBe('Test modal');
      expect(attrs['aria-labelledby']).toBeUndefined();
      expect(attrs['aria-modal']).toBe('true');
      expect(attrs.role).toBe('dialog');
    });

    it('should compute ARIA attributes correctly with ariaLabelledBy', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test modal');
      fixture.componentRef.setInput('ariaLabelledBy', 'heading-id');
      fixture.detectChanges();

      const attrs = component.ariaAttrs();
      expect(attrs['aria-label']).toBeUndefined();
      expect(attrs['aria-labelledby']).toBe('heading-id');
    });

    it('should compute ARIA attributes with ariaDescribedBy', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'desc-id');
      fixture.detectChanges();

      const attrs = component.ariaAttrs();
      expect(attrs['aria-describedby']).toBe('desc-id');
    });
  });

  describe('Event Handling - Close', () => {
    it('should emit closed event when close is called', () => {
      let closedEmitted = false;
      component.closed.subscribe(() => {
        closedEmitted = true;
      });

      component.close();
      expect(closedEmitted).toBe(true);
    });
  });

  describe('Event Handling - Backdrop Click', () => {
    it('should close modal on backdrop click when enabled', () => {
      let closedEmitted = false;
      component.closed.subscribe(() => {
        closedEmitted = true;
      });

      fixture.componentRef.setInput('closeOnBackdropClick', true);
      fixture.detectChanges();

      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: event.currentTarget });
      component.handleBackdropClick(event);

      expect(closedEmitted).toBe(true);
    });

    it('should not close modal on backdrop click when disabled', () => {
      let closedEmitted = false;
      component.closed.subscribe(() => {
        closedEmitted = true;
      });

      fixture.componentRef.setInput('closeOnBackdropClick', false);
      fixture.detectChanges();

      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: event.currentTarget });
      component.handleBackdropClick(event);

      expect(closedEmitted).toBe(false);
    });

    it('should emit backdropClicked event when backdrop is clicked', () => {
      let backdropClickedEmitted = false;
      component.backdropClicked.subscribe(() => {
        backdropClickedEmitted = true;
      });

      fixture.componentRef.setInput('closeOnBackdropClick', true);
      fixture.detectChanges();

      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: event.currentTarget });
      component.handleBackdropClick(event);

      expect(backdropClickedEmitted).toBe(true);
    });

    it('should not close modal when clicking modal container (not backdrop)', () => {
      let closedEmitted = false;
      component.closed.subscribe(() => {
        closedEmitted = true;
      });

      fixture.componentRef.setInput('closeOnBackdropClick', true);
      fixture.detectChanges();

      // Simulate clicking on a different target (not backdrop)
      const event = new MouseEvent('click', { bubbles: true });
      const differentTarget = document.createElement('div');
      Object.defineProperty(event, 'target', { value: differentTarget });
      component.handleBackdropClick(event);

      expect(closedEmitted).toBe(false);
    });
  });

  describe('Event Handling - Keyboard', () => {
    it('should close modal on ESC key when enabled', () => {
      let closedEmitted = false;
      component.closed.subscribe(() => {
        closedEmitted = true;
      });

      fixture.componentRef.setInput('closeOnEscape', true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      component.handleKeydown(event);

      expect(closedEmitted).toBe(true);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not close modal on ESC key when disabled', () => {
      let closedEmitted = false;
      component.closed.subscribe(() => {
        closedEmitted = true;
      });

      fixture.componentRef.setInput('closeOnEscape', false);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.handleKeydown(event);

      expect(closedEmitted).toBe(false);
    });

    it('should not close modal on non-ESC key', () => {
      let closedEmitted = false;
      component.closed.subscribe(() => {
        closedEmitted = true;
      });

      fixture.componentRef.setInput('closeOnEscape', true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.handleKeydown(event);

      expect(closedEmitted).toBe(false);
    });
  });

  describe('Body Scroll Lock', () => {
    it('should prevent body scroll when modal opens', async () => {
      fixture.componentRef.setInput('preventBodyScroll', true);
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      // Wait for effect to run
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll when modal closes', async () => {
      fixture.componentRef.setInput('preventBodyScroll', true);
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 0));

      fixture.componentRef.setInput('open', false);
      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(document.body.style.overflow).toBe('');
      expect(document.body.style.paddingRight).toBe('');
    });

    it('should not prevent body scroll when disabled', async () => {
      fixture.componentRef.setInput('preventBodyScroll', false);
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(document.body.style.overflow).not.toBe('hidden');
    });
  });

  describe('Open State Changes', () => {
    it('should emit openedChange event when modal opens', async () => {
      let openedChangeValue: boolean | undefined;
      component.openedChange.subscribe((value) => {
        openedChangeValue = value;
      });

      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(openedChangeValue).toBe(true);
    });

    it('should emit openedChange event when modal closes', async () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      let openedChangeValue: boolean | undefined;
      component.openedChange.subscribe((value) => {
        openedChangeValue = value;
      });

      await new Promise((resolve) => setTimeout(resolve, 0));

      fixture.componentRef.setInput('open', false);
      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(openedChangeValue).toBe(false);
    });
  });

  describe('DOM Rendering', () => {
    it('should not render modal when closed', () => {
      fixture.componentRef.setInput('open', false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const backdrop = compiled.querySelector('.modal-backdrop');
      expect(backdrop).toBeNull();
    });

    it('should render modal when open', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const backdrop = compiled.querySelector('.modal-backdrop');
      expect(backdrop).toBeTruthy();
    });

    it('should render close button when showCloseButton is true', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showCloseButton', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const closeButton = compiled.querySelector('.modal__close');
      expect(closeButton).toBeTruthy();
    });

    it('should not render close button when showCloseButton is false', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showCloseButton', false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const closeButton = compiled.querySelector('.modal__close');
      expect(closeButton).toBeNull();
    });

    it('should have correct ARIA attributes on modal container', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('ariaLabel', 'Test Modal');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const modal = compiled.querySelector('[role="dialog"]');
      expect(modal).toBeTruthy();
      expect(modal?.getAttribute('aria-modal')).toBe('true');
      expect(modal?.getAttribute('aria-label')).toBe('Test Modal');
    });

    it('should close modal when close button is clicked', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showCloseButton', true);
      fixture.detectChanges();

      let closedEmitted = false;
      component.closed.subscribe(() => {
        closedEmitted = true;
      });

      const compiled = fixture.nativeElement as HTMLElement;
      const closeButton = compiled.querySelector('.modal__close') as HTMLButtonElement;
      expect(closeButton).toBeTruthy();

      closeButton.click();
      fixture.detectChanges();

      expect(closedEmitted).toBe(true);
    });

    it('should handle keydown event on backdrop', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('closeOnEscape', true);
      fixture.detectChanges();

      let closedEmitted = false;
      component.closed.subscribe(() => {
        closedEmitted = true;
      });

      const compiled = fixture.nativeElement as HTMLElement;
      const backdrop = compiled.querySelector('.modal-backdrop') as HTMLElement;
      expect(backdrop).toBeTruthy();

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      backdrop.dispatchEvent(event);
      fixture.detectChanges();

      expect(closedEmitted).toBe(true);
    });

    it('should handle keyup event on backdrop', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('closeOnEscape', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const backdrop = compiled.querySelector('.modal-backdrop') as HTMLElement;
      expect(backdrop).toBeTruthy();

      const event = new KeyboardEvent('keyup', { key: 'Escape', bubbles: true });
      const handleKeydownSpy = vi.spyOn(component, 'handleKeydown');
      backdrop.dispatchEvent(event);
      fixture.detectChanges();

      expect(handleKeydownSpy).toHaveBeenCalled();
    });

    it('should stop propagation on modal container click', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const modalContainer = compiled.querySelector('.modal') as HTMLElement;
      expect(modalContainer).toBeTruthy();

      const event = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');
      modalContainer.dispatchEvent(event);
      fixture.detectChanges();

      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should stop propagation on modal container keydown', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const modalContainer = compiled.querySelector('.modal') as HTMLElement;
      expect(modalContainer).toBeTruthy();

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');
      modalContainer.dispatchEvent(event);
      fixture.detectChanges();

      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  describe('Content Projection', () => {
    it('should project header content', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const header = compiled.querySelector('.modal__header');
      expect(header).toBeTruthy();
    });

    it('should project body content', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const body = compiled.querySelector('.modal__body');
      expect(body).toBeTruthy();
    });

    it('should project footer content', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const footer = compiled.querySelector('.modal__footer');
      expect(footer).toBeTruthy();
    });
  });
});
