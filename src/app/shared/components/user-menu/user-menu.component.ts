import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { heroArrowRightOnRectangle, heroUserCircle } from '@ng-icons/heroicons/outline';

import { User } from '@core/auth';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ICON_NAMES } from '@shared/constants/icon-names.constants';

/**
 * User menu dropdown component.
 *
 * Displays a user profile icon that opens a dropdown menu with user details
 * and a logout action. Uses CDK Overlay for positioning and A11yModule for
 * focus trapping and keyboard navigation.
 *
 * @example
 * ```html
 * <eb-user-menu [user]="currentUser" (logout)="onLogout()" />
 * ```
 */
@Component({
  selector: 'eb-user-menu',
  standalone: true,
  imports: [CommonModule, OverlayModule, A11yModule, ButtonComponent, IconComponent],
  providers: [provideIcons({ heroUserCircle, heroArrowRightOnRectangle })],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent {
  /** Icon name constants for template usage. */
  protected readonly icons = ICON_NAMES;

  /** The authenticated user to display in the menu. */
  readonly user = input.required<User>();

  /** Event emitted when the user clicks the logout action. */
  readonly logout = output();

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
   * Handles the logout action.
   * Closes the menu and emits the logout event.
   */
  onLogout(): void {
    this.closeMenu();
    this.logout.emit();
  }
}
