// @vitest-environment jsdom
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { DonutChartComponent } from './donut-chart.component';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
if (!getTestBed().platform) {
  getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
}

describe('DonutChartComponent', () => {
  let component: DonutChartComponent;
  let fixture: ComponentFixture<DonutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonutChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DonutChartComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', 50);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute percentage correctly', () => {
    fixture.componentRef.setInput('value', 25);
    fixture.componentRef.setInput('total', 50);
    fixture.detectChanges();
    expect(component.percentage()).toBe(50);
  });

  it('should cap percentage at 100', () => {
    fixture.componentRef.setInput('value', 150);
    fixture.componentRef.setInput('total', 100);
    fixture.detectChanges();
    expect(component.percentage()).toBe(100);
  });

  it('should cap percentage at 0', () => {
    fixture.componentRef.setInput('value', -20);
    fixture.componentRef.setInput('total', 100);
    fixture.detectChanges();
    expect(component.percentage()).toBe(0);
  });

  it('should generate correct chart style', () => {
    fixture.componentRef.setInput('value', 75);
    fixture.componentRef.setInput('total', 100);
    fixture.detectChanges();
    expect(component.chartStyle()).toEqual({ '--percent': '75%' });
  });

  it('should apply variant class', () => {
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();
    // Re-accessing the computed value
    const classes = component.componentClasses();
    expect(classes).toContain('donut-chart--success');
  });

  it('should apply size class', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(component.componentClasses()).toContain('donut-chart--lg');
  });
});
