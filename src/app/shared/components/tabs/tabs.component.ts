import { CommonModule } from '@angular/common';
import {
  type AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

import { TabButtonComponent } from '../tab-button/tab-button.component';

import { TabComponent } from './tab.component';

export type TabsVariant = 'default' | 'pills' | 'underline' | 'boxed';
export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsSize = 'sm' | 'md' | 'lg';

/**
 * Accessible tabs component with keyboard navigation.
 * Follows WAI-ARIA tabs pattern and WCAG 2.1 AAA guidelines.
 *
 * @example
 * ```html
 * <eb-tabs [(activeTabId)]="selectedTab">
 *   <eb-tab tabId="overview" label="Overview">
 *     <p>Overview content...</p>
 *   </eb-tab>
 *   <eb-tab tabId="details" label="Details">
 *     <p>Details content...</p>
 *   </eb-tab>
 *   <eb-tab tabId="settings" label="Settings" [disabled]="true">
 *     <p>Settings content...</p>
 *   </eb-tab>
 * </eb-tabs>
 * ```
 */
@Component({
  selector: 'eb-tabs',
  standalone: true,
  imports: [CommonModule, TabButtonComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements AfterContentInit {
  /**
   * Visual variant of the tabs
   * - default: Standard tabs with bottom border
   * - pills: Rounded pill-style tabs
   * - underline: Minimal tabs with animated underline
   * - boxed: Tabs with box background
   */
  readonly variant = input<TabsVariant>('default');

  /**
   * Orientation of the tabs
   * - horizontal: Tabs arranged horizontally (default)
   * - vertical: Tabs arranged vertically
   */
  readonly orientation = input<TabsOrientation>('horizontal');

  /**
   * Size of the tabs
   * - sm: Small tabs (12px padding, 14px font)
   * - md: Medium tabs (16px padding, 16px font) - default
   * - lg: Large tabs (20px padding, 18px font)
   */
  readonly size = input<TabsSize>('md');

  /**
   * ID of the currently active tab
   * Two-way bindable with [(activeTabId)]
   */
  readonly activeTabId = input<string>('');

  /**
   * Whether to fill the full width of the container
   * When true, tabs will be distributed evenly
   */
  readonly fullWidth = input<boolean>(false);

  /**
   * ARIA label for the tabs
   * Required for accessibility
   */
  readonly ariaLabel = input.required<string>();

  /**
   * Emitted when the active tab changes
   * Used for two-way binding with [(activeTabId)]
   */
  readonly activeTabIdChange = output<string>();

  /**
   * Emitted when a tab is clicked
   */
  readonly tabChanged = output<{ tabId: string; index: number }>();

  /**
   * Query for all tab children
   */
  readonly tabs = contentChildren(TabComponent);

  /**
   * Internal active tab index
   */
  readonly activeTabIndex = signal<number>(0);

  /**
   * Computed CSS classes for the tab list
   */
  readonly tabListClasses = computed(() => this._getTabListClasses());

  /**
   * Effect to sync activeTabId input with internal state
   */
  private readonly _syncActiveTab = effect(() => {
    const tabId = this.activeTabId();
    const tabs = this.tabs();

    if (tabId.length > 0 && tabs.length > 0) {
      const index = tabs.findIndex((tab) => tab.tabId() === tabId);
      if (index !== -1) {
        this.activeTabIndex.set(index);
        this._updateTabStates(index);
      }
    }
  });

  ngAfterContentInit(): void {
    // Set initial active tab
    const tabs = this.tabs();
    if (tabs.length > 0) {
      const activeId = this.activeTabId();
      if (activeId.length > 0) {
        const index = tabs.findIndex((tab) => tab.tabId() === activeId);
        if (index !== -1) {
          this.selectTab(index);
          return;
        }
      }

      // If no active tab specified or not found, select first non-disabled tab
      const firstEnabledIndex = tabs.findIndex((tab) => !tab.disabled());
      if (firstEnabledIndex !== -1) {
        this.selectTab(firstEnabledIndex);
      }
    }
  }

  /**
   * Select a tab by index
   */
  selectTab(index: number): void {
    const tabs = this.tabs();

    if (index < 0 || index >= tabs.length) {
      return;
    }

    const tab = tabs[index];
    if (!tab.disabled()) {
      this.activeTabIndex.set(index);
      this._updateTabStates(index);

      // Emit events
      const tabId = tab.tabId();
      this.activeTabIdChange.emit(tabId);
      this.tabChanged.emit({ tabId, index });
    }
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(event: KeyboardEvent, currentIndex: number): void {
    const tabs = this.tabs();
    let newIndex = currentIndex;

    const isHorizontal = this.orientation() === 'horizontal';

    switch (event.key) {
      case 'ArrowLeft':
        if (isHorizontal) {
          event.preventDefault();
          newIndex = this._getNextEnabledTab(currentIndex, -1);
        }
        break;

      case 'ArrowRight':
        if (isHorizontal) {
          event.preventDefault();
          newIndex = this._getNextEnabledTab(currentIndex, 1);
        }
        break;

      case 'ArrowUp':
        if (!isHorizontal) {
          event.preventDefault();
          newIndex = this._getNextEnabledTab(currentIndex, -1);
        }
        break;

      case 'ArrowDown':
        if (!isHorizontal) {
          event.preventDefault();
          newIndex = this._getNextEnabledTab(currentIndex, 1);
        }
        break;

      case 'Home':
        event.preventDefault();
        newIndex = this._getNextEnabledTab(-1, 1);
        break;

      case 'End':
        event.preventDefault();
        newIndex = this._getNextEnabledTab(tabs.length, -1);
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectTab(currentIndex);
        return;
    }

    if (newIndex !== currentIndex) {
      this.selectTab(newIndex);
      // Focus the new tab
      this._focusTab(newIndex);
    }
  }

  /**
   * Get the next enabled tab index
   */
  private _getNextEnabledTab(currentIndex: number, direction: number): number {
    const tabs = this.tabs();
    let index = currentIndex + direction;

    // Wrap around
    while (index >= 0 && index < tabs.length) {
      if (!tabs[index].disabled()) {
        return index;
      }
      index += direction;
    }

    // If no enabled tab found, return current index
    return currentIndex;
  }

  /**
   * Focus a tab by index
   */
  private _focusTab(_index: number): void {
    // This will be handled by the template with tabindex
    // The browser will automatically focus the element with tabindex="0"
  }

  /**
   * Update active/inactive states of all tabs
   */
  private _updateTabStates(activeIndex: number): void {
    const tabs = this.tabs();
    tabs.forEach((tab, index) => {
      tab.setActive(index === activeIndex);
    });
  }

  /**
   * Generate BEM CSS classes for the tab list
   */
  private _getTabListClasses(): string {
    const classes = ['tabs__list'];

    // Variant class
    classes.push(`tabs__list--${this.variant()}`);

    // Orientation class
    classes.push(`tabs__list--${this.orientation()}`);

    // Size class
    classes.push(`tabs__list--${this.size()}`);

    // Full width modifier
    if (this.fullWidth()) {
      classes.push('tabs__list--full-width');
    }

    return classes.join(' ');
  }

  /**
   * Track by function for tab iteration
   */
  trackByTabId(index: number, tab: TabComponent): string {
    return tab.tabId();
  }
}
