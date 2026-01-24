// @vitest-environment jsdom
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { vi } from 'vitest';

import type { NavItem } from '@core/layout/navigation.data';
import { NavDropdownComponent } from './nav-dropdown.component';

describe('NavDropdownComponent', () => {
  let component: NavDropdownComponent;
  let fixture: ComponentFixture<NavDropdownComponent>;

  const mockItems: NavItem[] = [
    { labelKey: 'Modules', route: '/modules' },
    { labelKey: 'Architecture', route: '/architecture' },
    { labelKey: 'Storybook', route: '/storybook', external: true },
    { labelKey: 'Documentation', route: '/docs', external: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavDropdownComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: {} },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavDropdownComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Resources');
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have ICONS constant defined', () => {
      expect(component['icons']).toBeDefined();
    });

    it('should accept label input', () => {
      expect(component.label()).toBe('Resources');
    });

    it('should accept items input', () => {
      expect(component.items()).toEqual(mockItems);
      expect(component.items().length).toBe(4);
    });
  });

  describe('Menu State', () => {
    it('should start with menu closed', () => {
      expect(component.isOpen()).toBe(false);
    });

    it('should toggle menu state', () => {
      expect(component.isOpen()).toBe(false);

      component.toggleMenu();
      expect(component.isOpen()).toBe(true);

      component.toggleMenu();
      expect(component.isOpen()).toBe(false);
    });

    it('should close menu with closeMenu()', () => {
      component.toggleMenu();
      expect(component.isOpen()).toBe(true);

      component.closeMenu();
      expect(component.isOpen()).toBe(false);
    });

    it('should remain closed when closeMenu() is called on closed menu', () => {
      expect(component.isOpen()).toBe(false);
      component.closeMenu();
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close menu on Escape key when open', () => {
      component.toggleMenu();
      expect(component.isOpen()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onKeydown(event);

      expect(component.isOpen()).toBe(false);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not close menu on Escape key when already closed', () => {
      expect(component.isOpen()).toBe(false);

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeydown(event);

      expect(component.isOpen()).toBe(false);
    });

    it('should ignore other keys', () => {
      component.toggleMenu();
      expect(component.isOpen()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeydown(event);

      expect(component.isOpen()).toBe(true);
    });
  });

  describe('Template Rendering', () => {
    it('should render the trigger button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const trigger = compiled.querySelector('.nav-dropdown__trigger');
      expect(trigger).toBeTruthy();
    });

    it('should display the label', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const label = compiled.querySelector('.nav-dropdown__label');
      expect(label?.textContent).toBe('Resources');
    });

    it('should render chevron icon', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const chevron = compiled.querySelector('.nav-dropdown__chevron');
      expect(chevron).toBeTruthy();
    });

    it('should set aria-expanded correctly', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const trigger = compiled.querySelector('.nav-dropdown__trigger');

      expect(trigger?.getAttribute('aria-expanded')).toBe('false');

      component.toggleMenu();
      fixture.detectChanges();

      expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    });

    it('should set aria-haspopup to menu', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const trigger = compiled.querySelector('.nav-dropdown__trigger');
      expect(trigger?.getAttribute('aria-haspopup')).toBe('menu');
    });
  });

  describe('Trigger Click', () => {
    it('should toggle menu when trigger is clicked', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const trigger = compiled.querySelector('.nav-dropdown__trigger') as HTMLButtonElement;

      expect(component.isOpen()).toBe(false);

      trigger.click();
      expect(component.isOpen()).toBe(true);

      trigger.click();
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Item Types', () => {
    it('should have internal route items', () => {
      const internalItems = component.items().filter((item) => item.external !== true);
      expect(internalItems.length).toBe(2);
    });

    it('should have external link items', () => {
      const externalItems = component.items().filter((item) => item.external === true);
      expect(externalItems.length).toBe(2);
    });
  });
});
