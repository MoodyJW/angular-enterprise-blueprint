import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { filter } from 'rxjs/operators';

import { FooterComponent } from '../footer';
import { HeaderComponent } from '../header';
import { NAV_ITEMS } from '../navigation.data';

/**
 * Main layout component that provides the application shell.
 *
 * Orchestrates:
 * - Header with navigation
 * - Main content area (router outlet)
 * - Footer
 * - Mobile navigation overlay
 *
 * @example
 * ```html
 * <!-- In app.html -->
 * <eb-main-layout />
 * ```
 */
import { ToastContainerComponent } from '@shared/components/toast';

@Component({
  selector: 'eb-main-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    TranslocoModule,
    HeaderComponent,
    FooterComponent,
    ToastContainerComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  /**
   * Whether the mobile menu is currently open.
   */
  readonly isMenuOpen = signal<boolean>(false);

  /**
   * Navigation items for mobile menu.
   */
  readonly navItems = NAV_ITEMS;

  ngOnInit(): void {
    // Close mobile menu on navigation
    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => {
        this.closeMenu();
      });
  }

  /**
   * Toggle the mobile menu open/closed.
   */
  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  /**
   * Close the mobile menu.
   */
  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  /**
   * Handle navigation from mobile menu.
   */
  onMobileNavClick(): void {
    this.closeMenu();
  }
}
