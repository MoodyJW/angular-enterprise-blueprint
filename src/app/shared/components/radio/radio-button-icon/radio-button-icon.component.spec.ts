// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { matRadioButtonChecked, matRadioButtonUnchecked } from '@ng-icons/material-icons/baseline';

import { ICON_NAMES } from '@shared/constants';

import { RadioButtonIconComponent } from './radio-button-icon.component';

describe('RadioButtonIconComponent', () => {
  let component: RadioButtonIconComponent;
  let fixture: ComponentFixture<RadioButtonIconComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioButtonIconComponent],
      providers: [
        provideIcons({
          [ICON_NAMES.RADIO_UNCHECKED]: matRadioButtonUnchecked,
          [ICON_NAMES.RADIO_CHECKED]: matRadioButtonChecked,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioButtonIconComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (RadioButtonIconComponent as unknown as { ɵcmp: { standalone: boolean } })
        .ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (RadioButtonIconComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
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

  describe('Computed Values - iconName', () => {
    it('should return RADIO_UNCHECKED when not checked', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.detectChanges();
      expect(component.iconName()).toBe(ICON_NAMES.RADIO_UNCHECKED);
    });

    it('should return RADIO_CHECKED when checked', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      expect(component.iconName()).toBe(ICON_NAMES.RADIO_CHECKED);
    });
  });

  describe('Template Rendering', () => {
    it('should render wrapper with aria-hidden="true"', () => {
      fixture.detectChanges();
      const wrapper = nativeElement.querySelector('.radio-icon-wrapper');
      expect(wrapper?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should always render an icon', () => {
      fixture.detectChanges();
      const icon = nativeElement.querySelector('eb-icon');
      expect(icon).toBeTruthy();
    });

    it('should apply radio-icon class to icon', () => {
      fixture.detectChanges();
      const icon = nativeElement.querySelector('.radio-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('State Transitions', () => {
    it('should transition from unchecked to checked icon', () => {
      // Start unchecked
      fixture.componentRef.setInput('checked', false);
      fixture.detectChanges();
      expect(component.iconName()).toBe(ICON_NAMES.RADIO_UNCHECKED);

      // Transition to checked
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      expect(component.iconName()).toBe(ICON_NAMES.RADIO_CHECKED);
    });
  });
});
