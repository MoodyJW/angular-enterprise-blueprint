import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import type { IconName } from '../../constants';

/**
 * Individual tab component.
 * Should be used as a child of eb-tabs.
 *
 * @example
 * ```html
 * <eb-tab tabId="overview" label="Overview" [icon]="ICON_NAMES.HOME">
 *   <p>Tab content goes here...</p>
 * </eb-tab>
 * ```
 */
@Component({
  selector: 'eb-tab',
  imports: [CommonModule],
  template: `
    @if (isActive()) {
      <div
        class="tab-panel"
        [id]="panelId()"
        role="tabpanel"
        [attr.aria-labelledby]="tabId()"
        [attr.tabindex]="0"
      >
        <ng-content />
      </div>
    }
  `,
  styles: [
    `
      .tab-panel {
        padding: var(--space-4);
        outline: none;

        &:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  /**
   * Unique identifier for this tab
   * Used for tab/panel association
   */
  readonly tabId = input.required<string>();

  /**
   * Label text displayed in the tab button
   */
  readonly label = input.required<string>();

  /**
   * Optional icon to display before the label
   */
  readonly icon = input<IconName | undefined>(undefined);

  /**
   * Whether this tab is disabled
   */
  readonly disabled = input<boolean>(false);

  /**
   * Whether this tab is currently active
   * Managed by the parent TabsComponent
   */
  readonly isActive = signal<boolean>(false);

  /**
   * Computed panel ID for ARIA association
   */
  readonly panelId = computed(() => `${this.tabId()}-panel`);

  /**
   * Set the active state (called by parent TabsComponent)
   */
  setActive(active: boolean): void {
    this.isActive.set(active);
  }
}
