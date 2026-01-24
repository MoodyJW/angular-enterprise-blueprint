import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

import { AuthStore } from '@core/auth';
import { provideIcons } from '@ng-icons/core';
import { heroBars3 } from '@ng-icons/heroicons/outline';
import {
  ButtonComponent,
  IconComponent,
  LanguageSwitcherComponent,
  NavDropdownComponent,
  ThemePickerComponent,
  UserMenuComponent,
} from '@shared/components';
import { ICON_NAMES } from '@shared/constants';
import { NAV_ITEMS, NavItem } from '../navigation.data';

/**
 * Application header component.
 *
 * Provides:
 * - Logo/brand display
 * - Desktop navigation links (data-driven)
 * - Theme picker integration
 * - Auth state UI (Login button vs User profile + Logout)
 * - Mobile hamburger menu toggle
 *
 * @example
 * ```html
 * <eb-header (toggleMenu)="onToggleMenu()" />
 * ```
 */
@Component({
  selector: 'eb-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslocoModule,
    LanguageSwitcherComponent,
    ThemePickerComponent,
    UserMenuComponent,
    ButtonComponent,
    IconComponent,
    NavDropdownComponent,
  ],
  viewProviders: [provideIcons({ heroBars3 })],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly icons = ICON_NAMES;
  private readonly _authStore = inject(AuthStore);

  /**
   * Event emitted when the mobile menu toggle is clicked.
   */
  readonly toggleMenu = output();

  /**
   * Navigation items for the header.
   */
  readonly navItems = NAV_ITEMS;

  /**
   * Current user from auth store.
   */
  readonly user = this._authStore.user;

  /**
   * Authentication status.
   */
  readonly isAuthenticated = this._authStore.isAuthenticated;

  /**
   * Display name for the current user.
   */
  readonly displayName = this._authStore.displayName;

  /**
   * Loading state from auth store.
   */
  readonly isLoading = this._authStore.isLoading;

  /**
   * Handle mobile menu toggle click.
   */
  onToggleMenu(): void {
    this.toggleMenu.emit();
  }

  /**
   * Handle logout action.
   */
  onLogout(): void {
    this._authStore.logout(undefined);
  }

  /**
   * Translate child navigation items for dropdown menus.
   * @param children - Array of child navigation items
   * @param t - Transloco translation function
   * @returns Translated child items with labelKey replaced by translated label
   */
  getTranslatedChildren(children: NavItem[], t: (key: string) => string): NavItem[] {
    return children.map((child) => ({
      ...child,
      labelKey: t(child.labelKey),
    }));
  }
}
