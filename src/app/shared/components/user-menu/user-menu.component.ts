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
  readonly icons = ICON_NAMES;
  readonly user = input.required<User>();
  readonly logout = output();

  readonly isOpen = signal(false);

  toggleMenu(): void {
    this.isOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.isOpen.set(false);
  }

  onLogout(): void {
    this.closeMenu();
    this.logout.emit();
  }
}
