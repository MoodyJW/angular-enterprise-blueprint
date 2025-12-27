import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

import { AuthStore } from '@core/auth';
import { ButtonComponent } from '@shared/components/button';
import { LanguageSwitcherComponent } from '@shared/components/language-switcher';
import { ThemePickerComponent } from '@shared/components/theme-picker';
import { NAV_ITEMS } from '../navigation.data';

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
    ButtonComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
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
}
