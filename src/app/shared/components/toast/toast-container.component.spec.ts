import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ToastService } from '../../services/toast/toast.service';
import { ToastContainerComponent } from './toast-container.component';
import { ToastComponent } from './toast.component';

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;
  let toastService: ToastService;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent, ToastComponent],
      providers: [ToastService],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    toastService = TestBed.inject(ToastService);

    vi.useFakeTimers();
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Position Rendering', () => {
    it('should render nothing initially', () => {
      const containers = nativeElement.querySelectorAll('.toast-container');
      expect(containers.length).toBe(0);
    });

    it('should render container when toast is added', () => {
      toastService.show({ message: 'Test', position: 'top-right' });
      fixture.detectChanges();

      const container = nativeElement.querySelector('.toast-container--top-right');
      expect(container).toBeTruthy();
      expect(container?.getAttribute('role')).toBe('region');
      expect(container?.getAttribute('aria-label')).toBe('Notifications at top-right');
    });

    it('should render correct number of toasts', () => {
      toastService.show({ message: '1', position: 'top-right' });
      toastService.show({ message: '2', position: 'top-right' });
      fixture.detectChanges();

      const toasts = nativeElement.querySelectorAll('.toast-container--top-right .toast');
      expect(toasts.length).toBe(2);
    });

    it('should render toasts in multiple positions', () => {
      toastService.show({ message: '1', position: 'top-right' });
      toastService.show({ message: '2', position: 'bottom-left' });
      fixture.detectChanges();

      const trContainer = nativeElement.querySelector('.toast-container--top-right');
      const blContainer = nativeElement.querySelector('.toast-container--bottom-left');

      expect(trContainer).toBeTruthy();
      expect(blContainer).toBeTruthy();
    });
  });

  describe('Toast Dismissal', () => {
    it('should dismiss toast from service', () => {
      const id = toastService.show({ message: 'Dismiss me' });
      fixture.detectChanges();
      expect(nativeElement.querySelector('.toast')).toBeTruthy();

      toastService.dismiss(id);
      fixture.detectChanges();

      // Wait for animation (component logic handles transition state)
      vi.advanceTimersByTime(500);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.toast')).toBeFalsy();
    });

    it('should handle dismiss event from toast component', () => {
      toastService.show({ message: 'Dismiss me', dismissible: true });
      fixture.detectChanges();

      // Locate the toast component instance
      const toastDebugEl = fixture.debugElement.query(
        (de) => de.componentInstance instanceof ToastComponent,
      );
      expect(toastDebugEl).toBeTruthy();

      // Emit the dismissed event directly from the child component
      (toastDebugEl.componentInstance as ToastComponent).dismissed.emit();
      fixture.detectChanges();

      // Wait for exit animation
      vi.advanceTimersByTime(500);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.toast')).toBeFalsy();
    });
  });
});
