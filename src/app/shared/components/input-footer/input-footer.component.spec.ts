// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { InputFooterComponent } from './input-footer.component';

describe('InputFooterComponent', () => {
  let fixture: ComponentFixture<InputFooterComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InputFooterComponent] }).compileComponents();
    fixture = TestBed.createComponent(InputFooterComponent);
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('renders helper text and character count when provided', () => {
    fixture.componentRef.setInput('helperText', 'Helper text example');
    fixture.componentRef.setInput('helperTextId', 'helper-id');
    fixture.componentRef.setInput('helperTextClasses', 'input-helper-text');
    fixture.componentRef.setInput('showCharCount', true);
    fixture.componentRef.setInput('maxLength', 10);
    fixture.componentRef.setInput('charCountText', '3/10');
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Helper text example');
    expect(compiled.textContent).toContain('3/10');
  });
});
