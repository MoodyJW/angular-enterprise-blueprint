// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ICON_NAMES } from '../../constants';
import type { IconColor, IconSize } from './icon.component';
import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    // Set required name input for all tests
    fixture.componentRef.setInput('name', ICON_NAMES.HOME);
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (IconComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (IconComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - Name', () => {
    it('should require name input', () => {
      expect(component.name()).toBe(ICON_NAMES.HOME);
    });

    it('should accept different icon names', () => {
      const iconNames = [ICON_NAMES.HOME, ICON_NAMES.USER, ICON_NAMES.SEARCH, ICON_NAMES.SETTINGS];

      iconNames.forEach((name) => {
        fixture.componentRef.setInput('name', name);
        fixture.detectChanges();
        expect(component.name()).toBe(name);
      });
    });
  });

  describe('Input Handling - Size', () => {
    it('should have default size as md', () => {
      fixture.detectChanges();
      expect(component.size()).toBe('md');
    });

    it('should apply custom size', () => {
      const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(component.size()).toBe(size);
      });
    });
  });

  describe('Input Handling - Color', () => {
    it('should have default color as current', () => {
      fixture.detectChanges();
      expect(component.color()).toBe('current');
    });

    it('should apply custom color', () => {
      const colors: IconColor[] = [
        'current',
        'primary',
        'secondary',
        'success',
        'warning',
        'error',
        'info',
      ];

      colors.forEach((color) => {
        fixture.componentRef.setInput('color', color);
        fixture.detectChanges();
        expect(component.color()).toBe(color);
      });
    });
  });

  describe('Input Handling - Decorative', () => {
    it('should have default decorative as false', () => {
      fixture.detectChanges();
      expect(component.decorative()).toBe(false);
    });

    it('should accept decorative true', () => {
      fixture.componentRef.setInput('decorative', true);
      fixture.detectChanges();
      expect(component.decorative()).toBe(true);
    });
  });

  describe('Input Handling - ARIA Label', () => {
    it('should have undefined ariaLabel by default', () => {
      fixture.detectChanges();
      expect(component.ariaLabel()).toBeUndefined();
    });

    it('should accept custom ariaLabel', () => {
      fixture.componentRef.setInput('ariaLabel', 'Home icon');
      fixture.detectChanges();
      expect(component.ariaLabel()).toBe('Home icon');
    });
  });

  describe('Input Handling - Spin', () => {
    it('should have default spin as false', () => {
      fixture.detectChanges();
      expect(component.spin()).toBe(false);
    });

    it('should accept spin true', () => {
      fixture.componentRef.setInput('spin', true);
      fixture.detectChanges();
      expect(component.spin()).toBe(true);
    });
  });

  describe('Computed Properties - Icon Size', () => {
    it('should compute correct size for xs', () => {
      fixture.componentRef.setInput('size', 'xs');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('0.75rem');
    });

    it('should compute correct size for sm', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('1rem');
    });

    it('should compute correct size for md', () => {
      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('1.25rem');
    });

    it('should compute correct size for lg', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('1.5rem');
    });

    it('should compute correct size for xl', () => {
      fixture.componentRef.setInput('size', 'xl');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('2rem');
    });

    it('should compute correct size for 2xl', () => {
      fixture.componentRef.setInput('size', '2xl');
      fixture.detectChanges();
      expect(component.iconSize()).toBe('2.5rem');
    });
  });

  describe('Computed Properties - CSS Classes', () => {
    it('should generate correct base classes', () => {
      fixture.detectChanges();
      const classes = component.iconClasses();
      expect(classes).toContain('icon');
      expect(classes).toContain('icon--md');
    });

    it('should include size class', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      const classes = component.iconClasses();
      expect(classes).toContain('icon--lg');
    });

    it('should include color class when not current', () => {
      fixture.componentRef.setInput('color', 'primary');
      fixture.detectChanges();
      const classes = component.iconClasses();
      expect(classes).toContain('icon--primary');
    });

    it('should not include color class when current', () => {
      fixture.componentRef.setInput('color', 'current');
      fixture.detectChanges();
      const classes = component.iconClasses();
      expect(classes).not.toContain('icon--current');
    });

    it('should include spin class when spinning', () => {
      fixture.componentRef.setInput('spin', true);
      fixture.detectChanges();
      const classes = component.iconClasses();
      expect(classes).toContain('icon--spin');
    });

    it('should not include spin class when not spinning', () => {
      fixture.componentRef.setInput('spin', false);
      fixture.detectChanges();
      const classes = component.iconClasses();
      expect(classes).not.toContain('icon--spin');
    });
  });

  describe('Computed Properties - ARIA Hidden', () => {
    it('should be undefined when not decorative', () => {
      fixture.componentRef.setInput('decorative', false);
      fixture.detectChanges();
      expect(component.ariaHidden()).toBeUndefined();
    });

    it('should be "true" when decorative', () => {
      fixture.componentRef.setInput('decorative', true);
      fixture.detectChanges();
      expect(component.ariaHidden()).toBe('true');
    });
  });

  describe('DOM Rendering', () => {
    it('should render icon wrapper element', () => {
      fixture.detectChanges();
      const wrapper = nativeElement.querySelector('.icon');
      expect(wrapper).toBeTruthy();
    });

    it('should render ng-icon component', () => {
      fixture.detectChanges();
      const ngIcon = nativeElement.querySelector('ng-icon');
      expect(ngIcon).toBeTruthy();
    });

    it('should apply CSS classes to wrapper', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('color', 'primary');
      fixture.detectChanges();
      const wrapper = nativeElement.querySelector('.icon');
      expect(wrapper?.classList.contains('icon')).toBe(true);
      expect(wrapper?.classList.contains('icon--lg')).toBe(true);
      expect(wrapper?.classList.contains('icon--primary')).toBe(true);
    });

    it('should set aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test icon');
      fixture.detectChanges();
      const wrapper = nativeElement.querySelector('.icon');
      expect(wrapper?.getAttribute('aria-label')).toBe('Test icon');
    });

    it('should set aria-hidden when decorative', () => {
      fixture.componentRef.setInput('decorative', true);
      fixture.detectChanges();
      const wrapper = nativeElement.querySelector('.icon');
      expect(wrapper?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should not set aria-hidden when not decorative', () => {
      fixture.componentRef.setInput('decorative', false);
      fixture.detectChanges();
      const wrapper = nativeElement.querySelector('.icon');
      expect(wrapper?.getAttribute('aria-hidden')).toBeNull();
    });

    it('should have role="img"', () => {
      fixture.detectChanges();
      const wrapper = nativeElement.querySelector('.icon');
      expect(wrapper?.getAttribute('role')).toBe('img');
    });
  });

  describe('All Color Variants', () => {
    it('should apply all color variants correctly', () => {
      const colors: IconColor[] = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];

      colors.forEach((color) => {
        fixture.componentRef.setInput('color', color);
        fixture.detectChanges();
        const classes = component.iconClasses();
        expect(classes).toContain(`icon--${color}`);
      });
    });
  });

  describe('All Size Variants', () => {
    it('should apply all size variants correctly', () => {
      const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        const classes = component.iconClasses();
        expect(classes).toContain(`icon--${size}`);
      });
    });
  });

  describe('Combined States', () => {
    it('should handle multiple modifiers together', () => {
      fixture.componentRef.setInput('size', 'xl');
      fixture.componentRef.setInput('color', 'error');
      fixture.componentRef.setInput('spin', true);
      fixture.detectChanges();

      const classes = component.iconClasses();
      expect(classes).toContain('icon');
      expect(classes).toContain('icon--xl');
      expect(classes).toContain('icon--error');
      expect(classes).toContain('icon--spin');
    });

    it('should handle decorative icon with aria-label', () => {
      fixture.componentRef.setInput('decorative', true);
      fixture.componentRef.setInput('ariaLabel', 'This should be ignored');
      fixture.detectChanges();

      const wrapper = nativeElement.querySelector('.icon');
      // When decorative, aria-hidden should be true
      expect(wrapper?.getAttribute('aria-hidden')).toBe('true');
      // But aria-label is still set (though it will be ignored by screen readers)
      expect(wrapper?.getAttribute('aria-label')).toBe('This should be ignored');
    });
  });

  describe('Icon Names from Constants', () => {
    it('should work with ICON_NAMES constants', () => {
      const testIcons = [
        ICON_NAMES.HOME,
        ICON_NAMES.USER,
        ICON_NAMES.EMAIL,
        ICON_NAMES.SETTINGS,
        ICON_NAMES.SEARCH,
      ];

      testIcons.forEach((iconName) => {
        fixture.componentRef.setInput('name', iconName);
        fixture.detectChanges();
        expect(component.name()).toBe(iconName);
      });
    });
  });
});
