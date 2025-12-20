// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import type { BreadcrumbItem, BreadcrumbSize, BreadcrumbVariant } from './breadcrumb.component';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (BreadcrumbComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (BreadcrumbComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - Items', () => {
    it('should accept items input', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', route: '/' },
        { label: 'About', route: '/about' },
      ];

      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      expect(component.items()).toEqual(items);
    });

    it('should handle empty items array', () => {
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();

      expect(component.items()).toEqual([]);
      expect(component.displayItems()).toEqual([]);
    });

    it('should handle items with icons', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', route: '/', icon: 'heroHome' },
        { label: 'Projects', route: '/projects', icon: 'heroFolder' },
      ];

      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      expect(component.items()[0].icon).toBe('heroHome');
      expect(component.items()[1].icon).toBe('heroFolder');
    });

    it('should handle items with query params', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Search', route: '/search', queryParams: { q: 'test' } },
      ];

      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      expect(component.items()[0].queryParams).toEqual({ q: 'test' });
    });

    it('should handle items with fragment', () => {
      const items: BreadcrumbItem[] = [{ label: 'Docs', route: '/docs', fragment: 'section-1' }];

      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      expect(component.items()[0].fragment).toBe('section-1');
    });

    it('should mark current item correctly', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', route: '/' },
        { label: 'Current', current: true },
      ];

      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      expect(component.items()[1].current).toBe(true);
    });
  });

  describe('Input Handling - Variant', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('items', [{ label: 'Home', route: '/' }]);
    });

    it('should have default variant as default', () => {
      fixture.detectChanges();
      expect(component.variant()).toBe('default');
    });

    it('should apply custom variant', () => {
      const variants: BreadcrumbVariant[] = ['default', 'slash', 'chevron', 'arrow'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(component.variant()).toBe(variant);
      });
    });

    it('should update CSS classes based on variant', () => {
      const variants: BreadcrumbVariant[] = ['default', 'slash', 'chevron', 'arrow'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(component.breadcrumbClasses()).toContain(`breadcrumb--${variant}`);
      });
    });
  });

  describe('Input Handling - Size', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('items', [{ label: 'Home', route: '/' }]);
    });

    it('should have default size as md', () => {
      fixture.detectChanges();
      expect(component.size()).toBe('md');
    });

    it('should apply custom size', () => {
      const sizes: BreadcrumbSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(component.size()).toBe(size);
      });
    });

    it('should update CSS classes based on size', () => {
      const sizes: BreadcrumbSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(component.breadcrumbClasses()).toContain(`breadcrumb--${size}`);
      });
    });
  });

  describe('Input Handling - Other Props', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('items', [{ label: 'Home', route: '/' }]);
    });

    it('should have default showIcons as true', () => {
      fixture.detectChanges();
      expect(component.showIcons()).toBe(true);
    });

    it('should toggle showIcons', () => {
      fixture.componentRef.setInput('showIcons', false);
      fixture.detectChanges();
      expect(component.showIcons()).toBe(false);

      fixture.componentRef.setInput('showIcons', true);
      fixture.detectChanges();
      expect(component.showIcons()).toBe(true);
    });

    it('should have default maxItems as 0', () => {
      fixture.detectChanges();
      expect(component.maxItems()).toBe(0);
    });

    it('should set custom maxItems', () => {
      fixture.componentRef.setInput('maxItems', 3);
      fixture.detectChanges();
      expect(component.maxItems()).toBe(3);
    });

    it('should have default ariaLabel as "Breadcrumb"', () => {
      fixture.detectChanges();
      expect(component.ariaLabel()).toBe('Breadcrumb');
    });

    it('should set custom ariaLabel', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom navigation');
      fixture.detectChanges();
      expect(component.ariaLabel()).toBe('Custom navigation');
    });
  });

  describe('Separator Logic', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('items', [{ label: 'Home', route: '/' }]);
    });

    it('should return null separator icon for default variant', () => {
      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();
      expect(component.separatorIcon()).toBeNull();
    });

    it('should return null separator icon for slash variant', () => {
      fixture.componentRef.setInput('variant', 'slash');
      fixture.detectChanges();
      expect(component.separatorIcon()).toBeNull();
    });

    it('should return chevron icon for chevron variant', () => {
      fixture.componentRef.setInput('variant', 'chevron');
      fixture.detectChanges();
      expect(component.separatorIcon()).toBe('heroChevronRight');
    });

    it('should return arrow icon for arrow variant', () => {
      fixture.componentRef.setInput('variant', 'arrow');
      fixture.detectChanges();
      expect(component.separatorIcon()).toBe('heroArrowRight');
    });

    it('should return › text for default variant', () => {
      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();
      expect(component.separatorText()).toBe('›');
    });

    it('should return / text for slash variant', () => {
      fixture.componentRef.setInput('variant', 'slash');
      fixture.detectChanges();
      expect(component.separatorText()).toBe('/');
    });
  });

  describe('Display Items with Collapsing', () => {
    it('should show all items when maxItems is 0', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Item 1', route: '/1' },
        { label: 'Item 2', route: '/2' },
        { label: 'Item 3', route: '/3' },
        { label: 'Item 4', route: '/4' },
        { label: 'Item 5', route: '/5' },
      ];

      fixture.componentRef.setInput('items', items);
      fixture.componentRef.setInput('maxItems', 0);
      fixture.detectChanges();

      const displayItems = component.displayItems();
      expect(displayItems.length).toBe(5);
      expect(component.isBreadcrumbItem(displayItems[0])).toBe(true);
    });

    it('should show all items when items.length <= maxItems', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Item 1', route: '/1' },
        { label: 'Item 2', route: '/2' },
      ];

      fixture.componentRef.setInput('items', items);
      fixture.componentRef.setInput('maxItems', 3);
      fixture.detectChanges();

      const displayItems = component.displayItems();
      expect(displayItems.length).toBe(2);
    });

    it('should collapse middle items when items.length > maxItems', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Item 1', route: '/1' },
        { label: 'Item 2', route: '/2' },
        { label: 'Item 3', route: '/3' },
        { label: 'Item 4', route: '/4' },
        { label: 'Item 5', route: '/5' },
      ];

      fixture.componentRef.setInput('items', items);
      fixture.componentRef.setInput('maxItems', 3);
      fixture.detectChanges();

      const displayItems = component.displayItems();
      expect(displayItems.length).toBe(4); // first + ellipsis + last 2
      expect(component.isBreadcrumbItem(displayItems[0])).toBe(true);
      expect(component.isEllipsis(displayItems[1])).toBe(true);
      expect(component.isBreadcrumbItem(displayItems[2])).toBe(true);
      expect(component.isBreadcrumbItem(displayItems[3])).toBe(true);
    });

    it('should show first item and last (maxItems-1) items when collapsing', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Item 1', route: '/1' },
        { label: 'Item 2', route: '/2' },
        { label: 'Item 3', route: '/3' },
        { label: 'Item 4', route: '/4' },
        { label: 'Item 5', route: '/5' },
      ];

      fixture.componentRef.setInput('items', items);
      fixture.componentRef.setInput('maxItems', 3);
      fixture.detectChanges();

      const displayItems = component.displayItems();
      const firstItem = displayItems[0];
      const lastItem1 = displayItems[2];
      const lastItem2 = displayItems[3];

      if (component.isBreadcrumbItem(firstItem)) {
        expect(firstItem.label).toBe('Item 1');
      }
      if (component.isBreadcrumbItem(lastItem1)) {
        expect(lastItem1.label).toBe('Item 4');
      }
      if (component.isBreadcrumbItem(lastItem2)) {
        expect(lastItem2.label).toBe('Item 5');
      }
    });
  });

  describe('Type Guards', () => {
    it('should correctly identify ellipsis', () => {
      const ellipsis = { isEllipsis: true as const };
      expect(component.isEllipsis(ellipsis)).toBe(true);
    });

    it('should correctly identify breadcrumb item', () => {
      const item: BreadcrumbItem = { label: 'Home', route: '/' };
      expect(component.isBreadcrumbItem(item)).toBe(true);
    });

    it('should correctly distinguish between ellipsis and item', () => {
      const ellipsis = { isEllipsis: true as const };
      const item: BreadcrumbItem = { label: 'Home', route: '/' };

      expect(component.isEllipsis(item)).toBe(false);
      expect(component.isBreadcrumbItem(ellipsis)).toBe(false);
    });
  });

  describe('Event Handling', () => {
    it('should emit itemClicked when non-current item is clicked', () => {
      const item: BreadcrumbItem = { label: 'Home', route: '/' };
      let emittedItem: BreadcrumbItem | null = null;

      fixture.componentRef.setInput('items', [item]);
      component.itemClicked.subscribe((clickedItem) => {
        emittedItem = clickedItem;
      });

      component.onItemClick(item);

      expect(emittedItem).toEqual(item);
    });

    it('should not emit itemClicked when current item is clicked', () => {
      const item: BreadcrumbItem = { label: 'Current', current: true };
      let emitted = false;

      fixture.componentRef.setInput('items', [item]);
      component.itemClicked.subscribe(() => {
        emitted = true;
      });

      component.onItemClick(item);

      expect(emitted).toBe(false);
    });
  });

  describe('Track By Function', () => {
    it('should return index for trackByIndex', () => {
      expect(component.trackByIndex(0)).toBe(0);
      expect(component.trackByIndex(1)).toBe(1);
      expect(component.trackByIndex(5)).toBe(5);
    });
  });

  describe('CSS Classes', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('items', [{ label: 'Home', route: '/' }]);
    });

    it('should generate correct base classes', () => {
      fixture.detectChanges();
      const classes = component.breadcrumbClasses();

      expect(classes).toContain('breadcrumb');
      expect(classes).toContain('breadcrumb--default');
      expect(classes).toContain('breadcrumb--md');
    });

    it('should update classes when variant changes', () => {
      fixture.componentRef.setInput('variant', 'chevron');
      fixture.detectChanges();

      expect(component.breadcrumbClasses()).toContain('breadcrumb--chevron');
    });

    it('should update classes when size changes', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      expect(component.breadcrumbClasses()).toContain('breadcrumb--lg');
    });
  });

  describe('Template Rendering', () => {
    it('should render navigation element with correct aria-label', () => {
      fixture.componentRef.setInput('items', [{ label: 'Home', route: '/' }]);
      fixture.componentRef.setInput('ariaLabel', 'Site navigation');
      fixture.detectChanges();

      const nav = nativeElement.querySelector('nav');
      expect(nav).toBeTruthy();
      expect(nav?.getAttribute('aria-label')).toBe('Site navigation');
    });

    it('should render ordered list', () => {
      fixture.componentRef.setInput('items', [{ label: 'Home', route: '/' }]);
      fixture.detectChanges();

      const ol = nativeElement.querySelector('ol.breadcrumb__list');
      expect(ol).toBeTruthy();
    });

    it('should render list items for each breadcrumb', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', route: '/' },
        { label: 'Projects', route: '/projects' },
      ];

      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      const listItems = nativeElement.querySelectorAll('li.breadcrumb__item');
      expect(listItems.length).toBe(2);
    });

    it('should render links for non-current items with routes', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', route: '/' },
        { label: 'Projects', route: '/projects' },
      ];

      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      const links = nativeElement.querySelectorAll('a.breadcrumb__link');
      expect(links.length).toBe(2);
    });

    it('should render current item as span with aria-current', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', route: '/' },
        { label: 'Current', current: true },
      ];

      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      const current = nativeElement.querySelector('.breadcrumb__current');
      expect(current).toBeTruthy();
      expect(current?.getAttribute('aria-current')).toBe('page');
    });

    it('should render separators between items', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', route: '/' },
        { label: 'Projects', route: '/projects' },
        { label: 'Detail', current: true },
      ];

      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      const separators = nativeElement.querySelectorAll('.breadcrumb__separator');
      expect(separators.length).toBe(2); // No separator after last item
    });

    it('should render ellipsis when items are collapsed', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Item 1', route: '/1' },
        { label: 'Item 2', route: '/2' },
        { label: 'Item 3', route: '/3' },
        { label: 'Item 4', route: '/4' },
        { label: 'Item 5', route: '/5' },
      ];

      fixture.componentRef.setInput('items', items);
      fixture.componentRef.setInput('maxItems', 3);
      fixture.detectChanges();

      const ellipsis = nativeElement.querySelector('.breadcrumb__ellipsis');
      expect(ellipsis).toBeTruthy();
      expect(ellipsis?.textContent.trim()).toBe('...');
    });

    it('should render icons when showIcons is true', () => {
      const items: BreadcrumbItem[] = [{ label: 'Home', route: '/', icon: 'heroHome' }];

      fixture.componentRef.setInput('items', items);
      fixture.componentRef.setInput('showIcons', true);
      fixture.detectChanges();

      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
      // should be visible (no hidden attribute)
      expect(icon?.getAttribute('hidden')).toBeNull();
    });

    it('should not render icons when showIcons is false', () => {
      const items: BreadcrumbItem[] = [{ label: 'Home', route: '/', icon: 'heroHome' }];

      fixture.componentRef.setInput('items', items);
      fixture.componentRef.setInput('showIcons', false);
      fixture.detectChanges();

      const icon = nativeElement.querySelector('eb-icon');
      // element is present but hidden via [hidden]
      expect(icon).toBeTruthy();
      expect(icon?.getAttribute('hidden')).not.toBeNull();
    });
  });
});
