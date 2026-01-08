// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import {
  matCheckBox,
  matCheckBoxOutlineBlank,
  matIndeterminateCheckBox,
} from '@ng-icons/material-icons/baseline';

import { ICON_NAMES } from '@shared/constants';

import { CheckboxCheckmarkComponent } from './checkbox-checkmark.component';

describe('CheckboxCheckmarkComponent', () => {
  let component: CheckboxCheckmarkComponent;
  let fixture: ComponentFixture<CheckboxCheckmarkComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxCheckmarkComponent],
      providers: [
        provideIcons({
          [ICON_NAMES.CHECKBOX_UNCHECKED]: matCheckBoxOutlineBlank,
          [ICON_NAMES.CHECKBOX_CHECKED]: matCheckBox,
          [ICON_NAMES.CHECKBOX_INDETERMINATE]: matIndeterminateCheckBox,
        }),
      ],
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

  describe('Computed Values - iconName', () => {
    it('should return CHECKBOX_UNCHECKED when neither checked nor indeterminate', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();
      expect(component.iconName()).toBe(ICON_NAMES.CHECKBOX_UNCHECKED);
    });

    it('should return CHECKBOX_CHECKED when checked', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();
      expect(component.iconName()).toBe(ICON_NAMES.CHECKBOX_CHECKED);
    });

    it('should return CHECKBOX_INDETERMINATE when indeterminate', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      expect(component.iconName()).toBe(ICON_NAMES.CHECKBOX_INDETERMINATE);
    });

    it('should return CHECKBOX_INDETERMINATE when both checked and indeterminate (indeterminate takes precedence)', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      expect(component.iconName()).toBe(ICON_NAMES.CHECKBOX_INDETERMINATE);
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
    it('should always render an icon (unchecked state)', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
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
    it('should render icon with correct name when unchecked', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();

      // Verify computed value
      expect(component.iconName()).toBe(ICON_NAMES.CHECKBOX_UNCHECKED);

      // Verify icon is rendered
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
    });

    it('should render icon with correct name when checked', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();

      // Verify computed value
      expect(component.iconName()).toBe(ICON_NAMES.CHECKBOX_CHECKED);

      // Verify icon is rendered
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
    });

    it('should render icon with correct name when indeterminate', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();

      // Verify computed value
      expect(component.iconName()).toBe(ICON_NAMES.CHECKBOX_INDETERMINATE);

      // Verify icon is rendered
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
    });

    it('should apply checkbox-icon class to icon', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      const icon = nativeElement.querySelector('.checkbox-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('State Transitions', () => {
    it('should transition from unchecked to checked', () => {
      // Start unchecked
      fixture.componentRef.setInput('checked', false);
      fixture.detectChanges();
      expect(component.iconName()).toBe(ICON_NAMES.CHECKBOX_UNCHECKED);

      // Transition to checked
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      expect(component.iconName()).toBe(ICON_NAMES.CHECKBOX_CHECKED);
    });

    it('should transition from checked to indeterminate', () => {
      // Start checked
      fixture.componentRef.setInput('checked', true);
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();
      expect(component.iconName()).toBe(ICON_NAMES.CHECKBOX_CHECKED);

      // Transition to indeterminate
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      expect(component.iconName()).toBe(ICON_NAMES.CHECKBOX_INDETERMINATE);
    });

    it('should transition from indeterminate to unchecked', () => {
      // Start indeterminate
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      expect(component.iconName()).toBe(ICON_NAMES.CHECKBOX_INDETERMINATE);

      // Transition to unchecked
      fixture.componentRef.setInput('indeterminate', false);
      fixture.componentRef.setInput('checked', false);
      fixture.detectChanges();
      expect(component.iconName()).toBe(ICON_NAMES.CHECKBOX_UNCHECKED);
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
