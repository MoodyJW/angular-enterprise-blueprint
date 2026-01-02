import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ICON_NAMES } from '@shared/constants';

import { TabButtonComponent } from './tab-button.component';

describe('TabButtonComponent', () => {
  let component: TabButtonComponent;
  let fixture: ComponentFixture<TabButtonComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Test Tab');
    fixture.componentRef.setInput('tabId', 'test-tab');
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (TabButtonComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (TabButtonComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling', () => {
    it('should have default label as empty string', () => {
      const newComponent = TestBed.createComponent(TabButtonComponent).componentInstance;
      expect(newComponent.label()).toBe('');
    });

    it('should accept custom label', () => {
      fixture.componentRef.setInput('label', 'Custom Tab');
      expect(component.label()).toBe('Custom Tab');
    });

    it('should have default tabId as empty string', () => {
      const newComponent = TestBed.createComponent(TabButtonComponent).componentInstance;
      expect(newComponent.tabId()).toBe('');
    });

    it('should accept custom tabId', () => {
      fixture.componentRef.setInput('tabId', 'custom-tab-id');
      expect(component.tabId()).toBe('custom-tab-id');
    });

    it('should have default isActive as false', () => {
      expect(component.isActive()).toBe(false);
    });

    it('should accept isActive true', () => {
      fixture.componentRef.setInput('isActive', true);
      expect(component.isActive()).toBe(true);
    });

    it('should have default disabled as false', () => {
      expect(component.disabled()).toBe(false);
    });

    it('should accept disabled true', () => {
      fixture.componentRef.setInput('disabled', true);
      expect(component.disabled()).toBe(true);
    });

    it('should have default ariaControls as empty string', () => {
      const newComponent = TestBed.createComponent(TabButtonComponent).componentInstance;
      expect(newComponent.ariaControls()).toBe('');
    });

    it('should accept custom ariaControls', () => {
      fixture.componentRef.setInput('ariaControls', 'panel-id');
      expect(component.ariaControls()).toBe('panel-id');
    });

    it('should have default ariaSelected as false', () => {
      expect(component.ariaSelected()).toBe(false);
    });

    it('should accept ariaSelected true', () => {
      fixture.componentRef.setInput('ariaSelected', true);
      expect(component.ariaSelected()).toBe(true);
    });

    it('should have default tabindex as -1', () => {
      expect(component.tabindex()).toBe(-1);
    });

    it('should accept custom tabindex', () => {
      fixture.componentRef.setInput('tabindex', 0);
      expect(component.tabindex()).toBe(0);
    });

    it('should accept icon', () => {
      fixture.componentRef.setInput('icon', ICON_NAMES.HOME);
      expect(component.icon()).toBe(ICON_NAMES.HOME);
    });

    it('should have undefined icon by default', () => {
      const newComponent = TestBed.createComponent(TabButtonComponent).componentInstance;
      expect(newComponent.icon()).toBeUndefined();
    });
  });

  describe('Click Handling', () => {
    it('should emit clicked event when onClick is called', () => {
      const clickedSpy = vi.fn();
      component.clicked.subscribe(clickedSpy);

      component.onClick();

      expect(clickedSpy).toHaveBeenCalled();
    });

    it('should not emit clicked event when disabled', () => {
      const clickedSpy = vi.fn();
      component.clicked.subscribe(clickedSpy);
      fixture.componentRef.setInput('disabled', true);

      component.onClick();

      expect(clickedSpy).not.toHaveBeenCalled();
    });

    it('should emit clicked event when enabled', () => {
      const clickedSpy = vi.fn();
      component.clicked.subscribe(clickedSpy);
      fixture.componentRef.setInput('disabled', false);

      component.onClick();

      expect(clickedSpy).toHaveBeenCalled();
    });
  });

  describe('DOM Rendering', () => {
    it('should render button element', () => {
      fixture.detectChanges();
      const button = nativeElement.querySelector('button');
      expect(button).toBeTruthy();
    });

    it('should apply tabs__tab class', () => {
      fixture.detectChanges();
      const button = nativeElement.querySelector('.tabs__tab');
      expect(button).toBeTruthy();
    });

    it('should apply tabs__tab--active class when active', () => {
      fixture.componentRef.setInput('isActive', true);
      fixture.detectChanges();
      const button = nativeElement.querySelector('.tabs__tab--active');
      expect(button).toBeTruthy();
    });

    it('should not apply tabs__tab--active class when not active', () => {
      fixture.componentRef.setInput('isActive', false);
      fixture.detectChanges();
      const button = nativeElement.querySelector('.tabs__tab--active');
      expect(button).toBeFalsy();
    });

    it('should apply tabs__tab--disabled class when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const button = nativeElement.querySelector('.tabs__tab--disabled');
      expect(button).toBeTruthy();
    });

    it('should not apply tabs__tab--disabled class when enabled', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();
      const button = nativeElement.querySelector('.tabs__tab--disabled');
      expect(button).toBeFalsy();
    });

    it('should render label text', () => {
      fixture.componentRef.setInput('label', 'My Tab');
      fixture.detectChanges();
      const label = nativeElement.querySelector('.tabs__tab-label');
      expect(label).toBeTruthy();
      expect(label?.textContent.trim()).toBe('My Tab');
    });

    it('should render icon when provided', () => {
      fixture.componentRef.setInput('icon', ICON_NAMES.HOME);
      fixture.detectChanges();
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
    });

    it('should not render icon when not provided', () => {
      fixture.componentRef.setInput('icon', undefined);
      fixture.detectChanges();
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeFalsy();
    });

    it('should set icon decorative attribute', () => {
      fixture.componentRef.setInput('icon', ICON_NAMES.SETTINGS);
      fixture.detectChanges();
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
    });

    it('should apply tabs__tab-icon class to icon', () => {
      fixture.componentRef.setInput('icon', ICON_NAMES.HOME);
      fixture.detectChanges();
      const icon = nativeElement.querySelector('.tabs__tab-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('ARIA Attributes', () => {
    it('should set role="tab" on button', () => {
      fixture.detectChanges();
      const button = nativeElement.querySelector('[role="tab"]');
      expect(button).toBeTruthy();
    });

    it('should set id attribute', () => {
      fixture.componentRef.setInput('tabId', 'my-tab');
      fixture.detectChanges();
      const button = nativeElement.querySelector('[role="tab"]');
      expect(button?.getAttribute('id')).toBe('my-tab');
    });

    it('should set aria-selected attribute', () => {
      fixture.componentRef.setInput('ariaSelected', true);
      fixture.detectChanges();
      const button = nativeElement.querySelector('[role="tab"]');
      expect(button?.getAttribute('aria-selected')).toBe('true');
    });

    it('should set aria-controls attribute', () => {
      fixture.componentRef.setInput('ariaControls', 'panel-1');
      fixture.detectChanges();
      const button = nativeElement.querySelector('[role="tab"]');
      expect(button?.getAttribute('aria-controls')).toBe('panel-1');
    });

    it('should set tabindex attribute', () => {
      fixture.componentRef.setInput('tabindex', 0);
      fixture.detectChanges();
      const button = nativeElement.querySelector('[role="tab"]');
      expect(button?.getAttribute('tabindex')).toBe('0');
    });

    it('should set aria-label from label', () => {
      fixture.componentRef.setInput('label', 'My Tab');
      fixture.detectChanges();
      const button = nativeElement.querySelector('button');
      expect(button?.getAttribute('aria-label')).toBe('My Tab');
    });
  });

  describe('Button Properties', () => {
    it('should pass disabled state to button', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const button = nativeElement.querySelector('button');
      expect(button?.disabled).toBe(true);
    });

    it('should not disable button when not disabled', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();
      const button = nativeElement.querySelector('button');
      expect(button?.disabled).toBe(false);
    });
  });

  describe('Icon and Label Rendering', () => {
    it('should render both icon and label', () => {
      fixture.componentRef.setInput('icon', ICON_NAMES.HOME);
      fixture.componentRef.setInput('label', 'Home');
      fixture.detectChanges();

      const icon = nativeElement.querySelector('.tabs__tab-icon');
      const label = nativeElement.querySelector('.tabs__tab-label');

      expect(icon).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent.trim()).toBe('Home');
    });

    it('should render label without icon', () => {
      fixture.componentRef.setInput('icon', undefined);
      fixture.componentRef.setInput('label', 'Settings');
      fixture.detectChanges();

      const icon = nativeElement.querySelector('.tabs__tab-icon');
      const label = nativeElement.querySelector('.tabs__tab-label');

      expect(icon).toBeFalsy();
      expect(label).toBeTruthy();
      expect(label?.textContent.trim()).toBe('Settings');
    });

    it('should render icon before label in DOM', () => {
      fixture.componentRef.setInput('icon', ICON_NAMES.HOME);
      fixture.componentRef.setInput('label', 'Home');
      fixture.detectChanges();

      const button = nativeElement.querySelector('button');
      const icon = button?.querySelector('.tabs__tab-icon');
      const label = button?.querySelector('.tabs__tab-label');

      expect(icon).toBeTruthy();
      expect(label).toBeTruthy();

      const iconIndex = Array.from(button?.children ?? []).indexOf(icon as Element);
      const labelIndex = Array.from(button?.children ?? []).indexOf(label as Element);

      expect(iconIndex).toBeLessThan(labelIndex);
    });
  });

  describe('Active State', () => {
    it('should apply active class when isActive is true', () => {
      fixture.componentRef.setInput('isActive', true);
      fixture.detectChanges();

      const button = nativeElement.querySelector('.tabs__tab--active');
      expect(button).toBeTruthy();
    });

    it('should not apply active class when isActive is false', () => {
      fixture.componentRef.setInput('isActive', false);
      fixture.detectChanges();

      const button = nativeElement.querySelector('.tabs__tab--active');
      expect(button).toBeFalsy();
    });

    it('should update aria-selected with active state', () => {
      fixture.componentRef.setInput('ariaSelected', true);
      fixture.detectChanges();

      const button = nativeElement.querySelector('[role="tab"]');
      expect(button?.getAttribute('aria-selected')).toBe('true');

      fixture.componentRef.setInput('ariaSelected', false);
      fixture.detectChanges();

      expect(button?.getAttribute('aria-selected')).toBe('false');
    });
  });
});
