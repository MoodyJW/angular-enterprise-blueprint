import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { heroChevronRight, heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { BadgeComponent } from '@shared/components/badge';
import { ButtonComponent } from '@shared/components/button';
import { CardComponent } from '@shared/components/card';
import { ContainerComponent } from '@shared/components/container';
import { GridComponent } from '@shared/components/grid';
import { IconComponent } from '@shared/components/icon';
import { InputComponent } from '@shared/components/input';
import { StackComponent } from '@shared/components/stack';
import { ICON_NAMES } from '@shared/constants/icon-names.constants';

import { ModulesStore } from './state/modules.store';

/**
 * Modules catalog page component.
 *
 * Displays the Reference Modules catalog with search/filter functionality.
 * Uses ModulesStore for state management.
 */
@Component({
  selector: 'eb-modules',
  standalone: true,
  imports: [
    RouterLink,
    TranslocoDirective,
    TitleCasePipe,
    ContainerComponent,
    GridComponent,
    StackComponent,
    CardComponent,
    InputComponent,
    ButtonComponent,
    BadgeComponent,
    IconComponent,
  ],
  providers: [ModulesStore],
  viewProviders: [provideIcons({ heroChevronRight, heroMagnifyingGlass })],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModulesComponent implements OnInit {
  protected readonly store = inject(ModulesStore);
  private readonly _destroyRef = inject(DestroyRef);

  /** Icon name constants */
  protected readonly ICONS = ICON_NAMES;

  /** Search input value signal */
  protected readonly searchValue = signal('');

  /** Subject for debouncing search input */
  private readonly _searchSubject = new Subject<string>();

  ngOnInit(): void {
    // Load modules on init
    this.store.loadModules();

    // Set up debounced search filter
    this._searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => {
        this.store.setFilter(value);
      });
  }

  /**
   * Handle search input changes.
   */
  protected onSearchChange(value: string): void {
    this.searchValue.set(value);
    this._searchSubject.next(value);
  }

  /**
   * Clear the search.
   */
  protected clearSearch(): void {
    this.searchValue.set('');
    this.store.clearFilter();
  }

  /**
   * Get the badge variant based on module status.
   */
  protected getStatusVariant(status: string): 'success' | 'warning' | 'secondary' {
    switch (status) {
      case 'production':
        return 'success';
      case 'beta':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  /**
   * Get the badge variant based on module category.
   */
  protected getCategoryVariant(
    category: string,
  ): 'primary' | 'secondary' | 'success' | 'warning' | 'error' {
    switch (category) {
      case 'state-management':
        return 'primary';
      case 'ui':
        return 'success';
      case 'security':
        return 'warning';
      case 'infrastructure':
        return 'secondary';
      default:
        return 'secondary';
    }
  }
}
