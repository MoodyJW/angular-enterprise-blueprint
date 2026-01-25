import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
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
  /**
   * Inject DOCUMENT for base URI resolution.
   */
  private readonly _document = inject(DOCUMENT);

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

  /**
   * Resolves the full URL for external links ensuring correct base path.
   * Handles deployment subpaths (e.g. GitHub Pages).
   *
   * @param path - The relative path (e.g., '/storybook')
   * @returns The fully qualified URL
   */
  getExternalUrl(path: string | undefined): string {
    if (path === undefined || path === '') return '';
    if (path.startsWith('http')) return path;

    try {
      // Remove leading slash to resolve relative to baseURI
      const cleanPath = path.startsWith('/') ? path.substring(1) : path;
      return new URL(cleanPath, this._document.baseURI).href;
    } catch {
      return path;
    }
  }
}
