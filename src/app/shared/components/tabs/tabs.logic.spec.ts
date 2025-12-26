import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { TabComponent } from './tab.component';
import { TabsComponent, TabsOrientation } from './tabs.component';

// Isolated Host Component
@Component({
  imports: [TabsComponent, TabComponent],
  template: `
    <eb-tabs [orientation]="orientation" [activeTabId]="activeTabId" ariaLabel="Test Tabs">
      <eb-tab tabId="tab1" label="Tab 1"><p>1</p></eb-tab>
      <eb-tab tabId="tab2" label="Tab 2"><p>2</p></eb-tab>
      <eb-tab tabId="tab3" label="Tab 3" [disabled]="true"><p>3</p></eb-tab>
    </eb-tabs>
  `,
})
class SimpleTabsHostComponent {
  orientation: TabsOrientation = 'horizontal';
  activeTabId: string = '';
}

describe('TabsComponent Logic Isolated', () => {
  let fixture: ComponentFixture<SimpleTabsHostComponent>;
  let tabsComponent: TabsComponent;
  let hostComponent: SimpleTabsHostComponent;
  let selectTabSpy: MockInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleTabsHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleTabsHostComponent);
    hostComponent = fixture.componentInstance;
    // Defer detectChanges to tests to avoid NG0100
    // fixture.detectChanges();

    const tabsDebugEl = fixture.debugElement.query(By.directive(TabsComponent));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    tabsComponent = tabsDebugEl.componentInstance;

    selectTabSpy = vi
      .spyOn(tabsComponent, 'selectTab')
      .mockImplementation(() => {}) as unknown as MockInstance;
  });

  it('should skip disabled tab logic (Horizontal ArrowRight) - No Wrap', () => {
    hostComponent.activeTabId = 'tab2';
    // Update view to reflect prop change
    fixture.detectChanges();

    // Clear any previous calls (e.g. from init)
    selectTabSpy.mockClear();

    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    // Simulate being at index 1
    tabsComponent.handleKeydown(event, 1);

    // Next is index 2 (disabled). Logic stops/returns current.
    expect(selectTabSpy).not.toHaveBeenCalled();
  });

  it('should handle Vertical navigation (ArrowDown)', () => {
    hostComponent.orientation = 'vertical';
    hostComponent.activeTabId = 'tab1';
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    tabsComponent.handleKeydown(event, 0);

    // Should select index 1 (tab2).
    expect(selectTabSpy).toHaveBeenCalledWith(1);
  });
});
