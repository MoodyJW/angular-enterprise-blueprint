import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ButtonContentComponent } from './button-content.component';

describe('ButtonContentComponent', () => {
  let component: ButtonContentComponent;
  let fixture: ComponentFixture<ButtonContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner when loading is true and hide icons while loading', () => {
    fixture.componentRef.setInput('iconLeft', 'left-icon');
    fixture.componentRef.setInput('iconRight', 'right-icon');
    fixture.detectChanges();

    // set loading to true
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.btn__spinner')).toBeTruthy();
    // icons are hidden while loading per template conditions
    expect(el.querySelector('.btn__icon--left')).toBeFalsy();
    expect(el.querySelector('.btn__icon--right')).toBeFalsy();
    // content still present unless iconOnly is true
    expect(el.querySelector('.btn__content')).toBeTruthy();
  });

  it('should render left and right icons when provided and not loading', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('iconLeft', 'left-icon');
    fixture.componentRef.setInput('iconRight', 'right-icon');
    fixture.componentRef.setInput('iconOnly', false);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    const left = el.querySelector('.btn__icon--left');
    const right = el.querySelector('.btn__icon--right');

    expect(left).toBeTruthy();
    expect(left?.textContent.trim()).toBe('left-icon');
    expect(right).toBeTruthy();
    expect(right?.textContent.trim()).toBe('right-icon');
  });

  it('should hide content when iconOnly is true but still show left icon', () => {
    fixture.componentRef.setInput('iconLeft', 'only-left');
    fixture.componentRef.setInput('iconRight', 'only-right');
    fixture.componentRef.setInput('iconOnly', true);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement as HTMLElement;
    // content should be hidden when iconOnly is true
    expect(el.querySelector('.btn__content')).toBeFalsy();
    // left icon is allowed even in iconOnly mode per template
    expect(el.querySelector('.btn__icon--left')).toBeTruthy();
    // right icon should be hidden when iconOnly is true per template
    expect(el.querySelector('.btn__icon--right')).toBeFalsy();
  });

  describe('projected content', () => {
    // Create a host component to project content into eb-button-content
    @Component({
      template: `
        <eb-button-content
          [iconLeft]="left"
          [iconRight]="right"
          [loading]="loading"
          [iconOnly]="iconOnly"
        >
          <span class="projected">Projected text</span>
        </eb-button-content>
      `,
      standalone: true,
      imports: [ButtonContentComponent],
    })
    class HostComponent {
      left?: string;
      right?: string;
      loading = false;
      iconOnly = false;
    }

    let hostFixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
      hostFixture = TestBed.createComponent(HostComponent);
    });

    it('should render projected content when not iconOnly', () => {
      hostFixture.componentInstance.iconOnly = false;
      hostFixture.detectChanges();

      const hostEl: HTMLElement = hostFixture.nativeElement as HTMLElement;
      expect(hostEl.querySelector('.btn__content')).toBeTruthy();
      expect(hostEl.querySelector('.btn__content')?.textContent).toContain('Projected text');
    });

    it('should not render projected content when iconOnly is true', () => {
      hostFixture.componentInstance.iconOnly = true;
      hostFixture.detectChanges();

      const hostEl: HTMLElement = hostFixture.nativeElement as HTMLElement;
      expect(hostEl.querySelector('.btn__content')).toBeFalsy();
    });
  });
});
