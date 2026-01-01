// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { CheckboxCheckmarkComponent } from './checkbox-checkmark.component';

describe('CheckboxCheckmarkComponent', () => {
  let component: CheckboxCheckmarkComponent;
  let fixture: ComponentFixture<CheckboxCheckmarkComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxCheckmarkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxCheckmarkComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (CheckboxCheckmarkComponent as unknown as { ɵcmp: { standalone: boolean } })
        .ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (CheckboxCheckmarkComponent as unknown as { ɵcmp: { onPush: boolean } })
        .ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - Checked', () => {
    it('should have default checked state as false', () => {
      expect(component.checked()).toBe(false);
    });

    it('should handle checked state as true', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      expect(component.checked()).toBe(true);
    });

    it('should handle checked state as false', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.detectChanges();
      expect(component.checked()).toBe(false);
    });
  });

  describe('Input Handling - Indeterminate', () => {
    it('should have default indeterminate state as false', () => {
      expect(component.indeterminate()).toBe(false);
    });

    it('should handle indeterminate state as true', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      expect(component.indeterminate()).toBe(true);
    });

    it('should handle indeterminate state as false', () => {
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();
      expect(component.indeterminate()).toBe(false);
    });
  });

  describe('Computed Values - showIcon', () => {
    it('should return false when neither checked nor indeterminate', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();
      expect(component.showIcon()).toBe(false);
    });

    it('should return true when checked', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();
      expect(component.showIcon()).toBe(true);
    });

    it('should return true when indeterminate', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      expect(component.showIcon()).toBe(true);
    });

    it('should return true when both checked and indeterminate', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      expect(component.showIcon()).toBe(true);
    });
  });

  describe('Computed Values - iconName', () => {
    it('should return heroMinus when indeterminate', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.componentRef.setInput('checked', false);
      fixture.detectChanges();
      expect(component.iconName()).toBe('heroMinus');
    });

    it('should return heroMinus when both indeterminate and checked (indeterminate takes precedence)', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      expect(component.iconName()).toBe('heroMinus');
    });

    it('should return heroCheck when checked and not indeterminate', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();
      expect(component.iconName()).toBe('heroCheck');
    });

    it('should return heroCheck when neither checked nor indeterminate (default)', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();
      expect(component.iconName()).toBe('heroCheck');
    });
  });

  describe('Template Rendering - Wrapper', () => {
    it('should render checkbox-checkmark wrapper', () => {
      fixture.detectChanges();
      const wrapper = nativeElement.querySelector('.checkbox-checkmark');
      expect(wrapper).toBeTruthy();
    });

    it('should have aria-hidden="true" on wrapper', () => {
      fixture.detectChanges();
      const wrapper = nativeElement.querySelector('.checkbox-checkmark');
      expect(wrapper?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Template Rendering - Icon', () => {
    it('should not render icon when unchecked and not indeterminate', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeNull();
    });

    it('should render icon when checked', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
    });

    it('should render icon when indeterminate', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
    });

    it('should render icon when both checked and indeterminate', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('Icon Properties', () => {
    it('should render icon with correct name when checked', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();

      // Verify computed value
      expect(component.iconName()).toBe('heroCheck');

      // Verify icon is rendered
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
    });

    it('should render icon with correct name when indeterminate', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();

      // Verify computed value
      expect(component.iconName()).toBe('heroMinus');

      // Verify icon is rendered
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
    });

    it('should configure icon correctly', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();

      // Verify icon element exists with correct class
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
      expect(icon?.classList.contains('checkbox-icon')).toBe(true);
    });

    it('should apply checkbox-icon class to icon', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon?.classList.contains('checkbox-icon')).toBe(true);
    });
  });

  describe('State Transitions', () => {
    it('should transition from unchecked to checked', () => {
      // Start unchecked
      fixture.componentRef.setInput('checked', false);
      fixture.detectChanges();
      expect(component.showIcon()).toBe(false);
      let icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeNull();

      // Transition to checked
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      expect(component.showIcon()).toBe(true);
      expect(component.iconName()).toBe('heroCheck');
      icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
    });

    it('should transition from checked to indeterminate', () => {
      // Start checked
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();
      expect(component.iconName()).toBe('heroCheck');
      let icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();

      // Transition to indeterminate
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      expect(component.iconName()).toBe('heroMinus');
      icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
    });

    it('should transition from indeterminate to unchecked', () => {
      // Start indeterminate
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      expect(component.showIcon()).toBe(true);
      let icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();

      // Transition to unchecked
      fixture.componentRef.setInput('indeterminate', false);
      fixture.componentRef.setInput('checked', false);
      fixture.detectChanges();
      expect(component.showIcon()).toBe(false);
      icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeNull();
    });
  });

  describe('CSS Classes', () => {
    it('should apply checkbox-checkmark class to wrapper', () => {
      fixture.detectChanges();
      const wrapper = nativeElement.querySelector('.checkbox-checkmark');
      expect(wrapper?.classList.contains('checkbox-checkmark')).toBe(true);
    });

    it('should apply checkbox-icon class to icon', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      const icon = nativeElement.querySelector('.checkbox-icon');
      expect(icon).toBeTruthy();
    });
  });
});
