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

  describe('Dropdown Menu Rendering', () => {
    it('should render menu with role="menu" when open', () => {
      component.toggleMenu();
      fixture.detectChanges();

      const menu = document.querySelector('.nav-dropdown__menu');
      expect(menu).toBeTruthy();
      expect(menu?.getAttribute('role')).toBe('menu');
    });

    it('should not render menu when closed', () => {
      fixture.detectChanges();

      const menu = document.querySelector('.nav-dropdown__menu');
      expect(menu).toBeFalsy();
    });

    it('should render correct number of menu items', () => {
      component.toggleMenu();
      fixture.detectChanges();

      const menuItems = document.querySelectorAll('.nav-dropdown__item');
      expect(menuItems.length).toBe(4);
    });

    it('should render all menu items with role="menuitem"', () => {
      component.toggleMenu();
      fixture.detectChanges();

      const menuItems = document.querySelectorAll('.nav-dropdown__item');
      menuItems.forEach((item) => {
        expect(item.getAttribute('role')).toBe('menuitem');
      });
    });
  });

  describe('Internal Route Items', () => {
    it('should render internal items as router links', () => {
      component.toggleMenu();
      fixture.detectChanges();

      const internalItems = document.querySelectorAll(
        '.nav-dropdown__item:not(.nav-dropdown__item--external)',
      );
      expect(internalItems.length).toBe(2);
    });

    it('should display internal item labels', () => {
      component.toggleMenu();
      fixture.detectChanges();

      const internalItems = document.querySelectorAll(
        '.nav-dropdown__item:not(.nav-dropdown__item--external)',
      );
      expect(internalItems[0].textContent.trim()).toBe('Modules');
      expect(internalItems[1].textContent.trim()).toBe('Architecture');
    });

    it('should close menu when internal item is clicked', () => {
      component.toggleMenu();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      const internalItem = document.querySelector(
        '.nav-dropdown__item:not(.nav-dropdown__item--external)',
      ) as HTMLElement;
      internalItem.click();

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('External Link Items', () => {
    it('should render external items with --external class', () => {
      component.toggleMenu();
      fixture.detectChanges();

      const externalItems = document.querySelectorAll('.nav-dropdown__item--external');
      expect(externalItems.length).toBe(2);
    });

    it('should render external items as anchor tags with href', () => {
      component.toggleMenu();
      fixture.detectChanges();

      const externalItems = document.querySelectorAll('.nav-dropdown__item--external');
      expect((externalItems[0] as HTMLAnchorElement).href).toContain('/storybook');
      expect((externalItems[1] as HTMLAnchorElement).href).toContain('/docs');
    });

    it('should set target="_blank" on external links', () => {
      component.toggleMenu();
      fixture.detectChanges();

      const externalItems = document.querySelectorAll('.nav-dropdown__item--external');
      externalItems.forEach((item) => {
        expect(item.getAttribute('target')).toBe('_blank');
      });
    });

    it('should set rel="noopener noreferrer" on external links for security', () => {
      component.toggleMenu();
      fixture.detectChanges();

      const externalItems = document.querySelectorAll('.nav-dropdown__item--external');
      externalItems.forEach((item) => {
        expect(item.getAttribute('rel')).toBe('noopener noreferrer');
      });
    });

    it('should render external icon for external links', () => {
      component.toggleMenu();
      fixture.detectChanges();

      const externalIcons = document.querySelectorAll('.nav-dropdown__external-icon');
      expect(externalIcons.length).toBe(2);
    });

    it('should hide external icon from screen readers', () => {
      component.toggleMenu();
      fixture.detectChanges();

      const externalIcons = document.querySelectorAll('.nav-dropdown__external-icon');
      externalIcons.forEach((icon) => {
        expect(icon.getAttribute('aria-hidden')).toBe('true');
      });
    });

    it('should display external item labels', () => {
      component.toggleMenu();
      fixture.detectChanges();

      const externalLabels = document.querySelectorAll(
        '.nav-dropdown__item--external .nav-dropdown__item-label',
      );
      expect(externalLabels[0].textContent).toBe('Storybook');
      expect(externalLabels[1].textContent).toBe('Documentation');
    });

    it('should close menu when external item is clicked', () => {
      component.toggleMenu();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      const externalItem = document.querySelector('.nav-dropdown__item--external') as HTMLElement;
      externalItem.click();

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('CSS Class States', () => {
    it('should add --open class to trigger when menu is open', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const trigger = compiled.querySelector('.nav-dropdown__trigger');

      expect(trigger?.classList.contains('nav-dropdown__trigger--open')).toBe(false);

      component.toggleMenu();
      fixture.detectChanges();

      expect(trigger?.classList.contains('nav-dropdown__trigger--open')).toBe(true);
    });

    it('should remove --open class from trigger when menu closes', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const trigger = compiled.querySelector('.nav-dropdown__trigger');

      component.toggleMenu();
      fixture.detectChanges();
      expect(trigger?.classList.contains('nav-dropdown__trigger--open')).toBe(true);

      component.closeMenu();
      fixture.detectChanges();
      expect(trigger?.classList.contains('nav-dropdown__trigger--open')).toBe(false);
    });

    it('should add --open class to chevron when menu is open', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const chevron = compiled.querySelector('.nav-dropdown__chevron');

      expect(chevron?.classList.contains('nav-dropdown__chevron--open')).toBe(false);

      component.toggleMenu();
      fixture.detectChanges();

      expect(chevron?.classList.contains('nav-dropdown__chevron--open')).toBe(true);
    });

    it('should remove --open class from chevron when menu closes', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const chevron = compiled.querySelector('.nav-dropdown__chevron');

      component.toggleMenu();
      fixture.detectChanges();
      expect(chevron?.classList.contains('nav-dropdown__chevron--open')).toBe(true);

      component.closeMenu();
      fixture.detectChanges();
      expect(chevron?.classList.contains('nav-dropdown__chevron--open')).toBe(false);
    });
  });

  describe('CloseMenu Behavior', () => {
    it('should close menu via closeMenu() method', () => {
      component.toggleMenu();
      expect(component.isOpen()).toBe(true);

      component.closeMenu();
      expect(component.isOpen()).toBe(false);
    });

    it('should be idempotent when called multiple times', () => {
      component.toggleMenu();
      expect(component.isOpen()).toBe(true);

      component.closeMenu();
      component.closeMenu();
      component.closeMenu();
      expect(component.isOpen()).toBe(false);
    });

    it('should close menu when backdrop is clicked', () => {
      component.toggleMenu();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      const backdrop = document.querySelector('.cdk-overlay-backdrop') as HTMLElement;
      backdrop.click();

      expect(component.isOpen()).toBe(false);
    });

    it('should close menu when any internal menu item is clicked', () => {
      const internalItemCount = component.items().filter((item) => item.external !== true).length;

      for (let i = 0; i < internalItemCount; i++) {
        component.toggleMenu();
        fixture.detectChanges();
        expect(component.isOpen()).toBe(true);

        const internalItems = document.querySelectorAll(
          '.nav-dropdown__item:not(.nav-dropdown__item--external)',
        );
        (internalItems[i] as HTMLElement).click();
        expect(component.isOpen()).toBe(false);
      }
    });

    it('should close menu when any external menu item is clicked', () => {
      const externalItemCount = component.items().filter((item) => item.external === true).length;

      for (let i = 0; i < externalItemCount; i++) {
        component.toggleMenu();
        fixture.detectChanges();
        expect(component.isOpen()).toBe(true);

        const externalItems = document.querySelectorAll('.nav-dropdown__item--external');
        (externalItems[i] as HTMLElement).click();
        expect(component.isOpen()).toBe(false);
      }
    });

    it('should close menu on Escape key press', () => {
      component.toggleMenu();
      expect(component.isOpen()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeydown(event);

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();

      component.toggleMenu();
      fixture.detectChanges();

      const menu = document.querySelector('.nav-dropdown__menu');
      expect(menu).toBeTruthy();

      const menuItems = document.querySelectorAll('.nav-dropdown__item');
      expect(menuItems.length).toBe(0);
    });

    it('should handle items with missing route', () => {
      const itemsWithMissingRoute: NavItem[] = [{ labelKey: 'No Route Item' }];
      fixture.componentRef.setInput('items', itemsWithMissingRoute);
      fixture.detectChanges();

      component.toggleMenu();
      fixture.detectChanges();

      const menuItems = document.querySelectorAll('.nav-dropdown__item');
      expect(menuItems.length).toBe(1);
    });

    it('should handle rapid open/close cycles', () => {
      for (let i = 0; i < 10; i++) {
        component.toggleMenu();
        fixture.detectChanges();
        component.closeMenu();
        fixture.detectChanges();
      }
      expect(component.isOpen()).toBe(false);
    });

    it('should handle label changes', () => {
      expect(component.label()).toBe('Resources');

      fixture.componentRef.setInput('label', 'New Label');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const label = compiled.querySelector('.nav-dropdown__label');
      expect(label?.textContent).toBe('New Label');
    });

    it('should handle items changes while menu is open', () => {
      component.toggleMenu();
      fixture.detectChanges();

      const newItems: NavItem[] = [{ labelKey: 'New Item', route: '/new' }];
      fixture.componentRef.setInput('items', newItems);
      fixture.detectChanges();

      const menuItems = document.querySelectorAll('.nav-dropdown__item');
      expect(menuItems.length).toBe(1);
      expect(menuItems[0].textContent.trim()).toBe('New Item');
    });
  });

  describe('Accessibility', () => {
    it('should have chevron icon hidden from screen readers', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const chevron = compiled.querySelector('.nav-dropdown__chevron');
      expect(chevron?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should have focus trap enabled on menu', () => {
      component.toggleMenu();
      fixture.detectChanges();

      const menu = document.querySelector('.nav-dropdown__menu');
      expect(menu?.hasAttribute('cdktrapfocus')).toBe(true);
    });

    it('should have aria-expanded sync with isOpen state', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const trigger = compiled.querySelector('.nav-dropdown__trigger');

      expect(trigger?.getAttribute('aria-expanded')).toBe('false');
      expect(component.isOpen()).toBe(false);

      component.toggleMenu();
      fixture.detectChanges();

      expect(trigger?.getAttribute('aria-expanded')).toBe('true');
      expect(component.isOpen()).toBe(true);

      component.closeMenu();
      fixture.detectChanges();

      expect(trigger?.getAttribute('aria-expanded')).toBe('false');
      expect(component.isOpen()).toBe(false);
    });
  });
});
