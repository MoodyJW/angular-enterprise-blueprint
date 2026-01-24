import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { heroArrowTopRightOnSquare, heroChevronDown } from '@ng-icons/heroicons/outline';

import { IconComponent } from '@shared/components';
import { ICON_NAMES } from '@shared/constants';

import type { NavItem } from '@core/layout/navigation.data';

/**
 * Navigation dropdown component.
 *
 * Displays a dropdown menu in the navigation bar with support for
 * internal routes and external links. Uses CDK Overlay for positioning
 * and A11yModule for focus trapping and keyboard navigation.
 *
 * @example
 * ```html
 * <eb-nav-dropdown [label]="'Resources'" [items]="resourceItems" />
 * ```
 */
@Component({
  selector: 'eb-nav-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, OverlayModule, A11yModule, IconComponent],
  providers: [provideIcons({ heroChevronDown, heroArrowTopRightOnSquare })],
  templateUrl: './nav-dropdown.component.html',
  styleUrl: './nav-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavDropdownComponent {
  /** Icon name constants for template usage. */
  protected readonly icons = ICON_NAMES;

  /** Label to display on the dropdown trigger. */
  readonly label = input.required<string>();

  /** Navigation items to display in the dropdown menu. */
  readonly items = input.required<NavItem[]>();

  /** Whether the dropdown menu is currently open. */
  readonly isOpen = signal(false);

  /**
   * Toggles the menu open/closed state.
   */
  toggleMenu(): void {
    this.isOpen.update((v) => !v);
  }

  /**
   * Closes the menu.
   */
  closeMenu(): void {
    this.isOpen.set(false);
  }

  /**
   * Handle keyboard events for accessibility.
   */
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isOpen()) {
      this.closeMenu();
      event.preventDefault();
    }
  }
}
