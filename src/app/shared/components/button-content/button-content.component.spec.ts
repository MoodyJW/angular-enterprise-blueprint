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
});
